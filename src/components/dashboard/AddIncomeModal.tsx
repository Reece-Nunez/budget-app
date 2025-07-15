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
import { toast } from 'sonner'

export default function AddExpenseModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ source: '', amount: '', date: '' })

  const handleSubmit = () => {
    if (!form.source || !form.amount || !form.date) {
      toast.error('Please fill in all fields')
      return
    }
    toast.success(`Added: ${form.source} - $${form.amount}`)
    setForm({ source: '', amount: '', date: '' })
    setOpen(false)
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger>
        <button className="rounded bg-green-600 px-4 py-2 text-white hover:bg-blue-700 transition">
          Add Income
        </button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Enter the details for your new monthly income.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <input
            className="w-full border border-gray-300 rounded p-2"
            placeholder="Source"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 rounded p-2"
            type="number"
            placeholder="Amount"
            value={form.amount}
            onChange={(e) => setForm({ ...form, amount: e.target.value })}
          />
          <input
            className="w-full border border-gray-300 rounded p-2"
            type="date"
            value={form.date}
            onChange={(e) => setForm({ ...form, date: e.target.value })}
          />
        </div>

        <DialogFooter>
          <button
            onClick={handleSubmit}
            className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition"
          >
            Save
          </button>
        </DialogFooter>
      </DialogContent>

    </Dialog>
  )
}
