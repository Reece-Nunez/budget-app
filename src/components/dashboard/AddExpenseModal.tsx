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

export default function AddExpenseModal() {
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ category: '', amount: '', date: '' })

  const { addExpense, categories, fetchCategories } = useBudget()

  useEffect(() => {
    if (open) {
      if (fetchCategories) {
        fetchCategories()
      }
    }
  }, [open, fetchCategories])

  const handleSubmit = async () => {
    if (!form.category || !form.amount || !form.date) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      // Add the actual expense
      await addExpense({
        category: form.category.trim(),
        amount: parseFloat(form.amount),
        date: form.date,
      })

      // Optionally insert the category into `budgets` if it doesn't exist
      const month = form.date.slice(0, 7)
      const { data: existing } = await supabase
        .from('budgets')
        .select('id')
        .eq('category', form.category)
        .eq('month', month)
        .maybeSingle()

      if (!existing) {
        await supabase.from('budgets').insert([
          {
            id: crypto.randomUUID(),
            category: form.category,
            planned: 0,
            month,
          },
        ])
      }

      toast.success(`Added: ${form.category} - $${form.amount}`)
      setForm({ category: '', amount: '', date: '' })
      setOpen(false)
    } catch (err) {
      console.error(err)
      toast.error('Failed to save expense')
    }
  }


  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Add Expense</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Expense</DialogTitle>
          <DialogDescription>
            Enter the details for your new monthly expense.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories?.filter((c) => c.type === 'expense')
              .map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
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
