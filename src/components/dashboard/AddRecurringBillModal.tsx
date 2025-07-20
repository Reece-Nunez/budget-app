'use client'

import { useState, useEffect } from 'react'
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
import { Switch } from '@/components/ui/switch'
import { useBudget } from '@/lib/budget-store'

export default function AddRecurringBillModal({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const [form, setForm] = useState({
    name: '',
    amount: '',
    due_day: '',
    category: '',
    is_active: true,
  })

  const [loading, setLoading] = useState(false)
  const { categories, fetchCategories } = useBudget()

  useEffect(() => {
    if (open && fetchCategories) fetchCategories()
  }, [open, fetchCategories])

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
        category: form.category || null,
        is_active: form.is_active,
        user_id: user.id,
      })

      if (error) throw error

      toast.success(`Recurring bill "${form.name}" added`)
      setForm({
        name: '',
        amount: '',
        due_day: '',
        category: '',
        is_active: true,
      })
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

          <select
            className="w-full border rounded p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category (optional)</option>
            {categories
              ?.filter((c) => c.type === 'expense')
              .map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
          </select>

          <div className="flex items-center justify-between">
            <span>Is Active</span>
            <Switch
              checked={form.is_active}
              onCheckedChange={(val) => setForm({ ...form, is_active: val })}
            />
          </div>
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
