'use client'

import { useState } from 'react'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'

export default function AddIncomeModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ source: '', amount: '', date: '' })

  const handleSubmit = () => {
    if (!form.source || !form.amount || !form.date) {
      toast.error('Please fill in all fields.')
      return
    }

    // TODO: Replace with actual DB call
    toast.success(`Income added: ${form.source} - $${form.amount}`)
    setForm({ source: '', amount: '', date: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <Input
            placeholder="Source (e.g. Paycheck)"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          <Input
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <Input
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>
        <div className="flex justify-end">
          <Button onClick={handleSubmit}>Save</Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}
