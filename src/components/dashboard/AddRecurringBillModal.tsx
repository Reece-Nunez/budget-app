'use client'

import { useState } from 'react'
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { supabase } from '@/lib/supaBaseClient'

export default function AddRecurringBillModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [form, setForm] = useState({ name: '', amount: '', due_day: '' })
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!form.name || !form.amount || !form.due_day) {
      toast.error('Please fill in all fields')
      return
    }

    const dueDayNum = parseInt(form.due_day)
    if (isNaN(dueDayNum) || dueDayNum < 1 || dueDayNum > 31) {
      toast.error('Due day must be a number between 1 and 31')
      return
    }

    setLoading(true)

    try {
      const {
        data: { user },
        error: userError,
      } = await supabase.auth.getUser()

      if (userError || !user) throw new Error('User not authenticated')

      const { error } = await supabase.from('recurring_bills').insert({
        name: form.name.trim(),
        amount: parseFloat(form.amount),
        due_day: dueDayNum,
        user_id: user.id,
      })

      if (error) throw error

      toast.success(`Recurring bill "${form.name}" added`)
      setForm({ name: '', amount: '', due_day: '' })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to add recurring bill')
    } finally {
      setLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Recurring Bill</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Recurring Bill</DialogTitle>
          <DialogDescription>
            Define a recurring bill that will appear each month automatically.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            className="w-full border rounded p-2"
            placeholder="Bill Name (e.g. Water Bill)"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Amount"
            type="number"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="w-full border rounded p-2"
            placeholder="Due Day (1–31)"
            type="number"
            value={form.due_day}
            onChange={(e) => setForm({ ...form, due_day: e.target.value })}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} disabled={loading}>
            {loading ? 'Saving...' : 'Save'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
