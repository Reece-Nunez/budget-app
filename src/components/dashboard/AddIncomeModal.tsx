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
import { toast } from 'sonner'
import { Button } from '../ui/button'
import { useBudget } from '@/lib/budget-store'
import { supabase } from '@/lib/supaBaseClient'

export default function AddIncomeModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  const [form, setForm] = useState({ source: '', amount: '', date: '' })
  const { addIncome } = useBudget()
  const [incomeCategories, setIncomeCategories] = useState<string[]>([])

  useEffect(() => {
    const fetchCategories = async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .eq('type', 'income')

      if (!error && data) {
        setIncomeCategories(data.map((cat) => cat.name))
      }
    }

    if (open) fetchCategories()
  }, [open])

  const handleSubmit = async () => {
    if (!form.source || !form.amount || !form.date) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      await addIncome({
        source: form.source.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
      })

      toast.success(`Added: ${form.source} - $${form.amount}`)
      setForm({ source: '', amount: '', date: '' })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to save income')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogTrigger asChild>
        <Button>Add Income</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Income</DialogTitle>
          <DialogDescription>
            Enter the details for your new monthly income.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={form.source}
            onChange={(e) => setForm({ ...form, source: e.target.value })}
          >
            <option value="">Select Income Category</option>
            {incomeCategories.map((cat, i) => (
              <option key={i} value={cat}>
                {cat}
              </option>
            ))}
          </select>

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
