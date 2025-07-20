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
import { format } from 'date-fns'

export default function AddBudgetModal({ open, onClose }: { open: boolean, onClose: () => void }) {
  
  const [form, setForm] = useState({
    category: '',
    planned: '',
    month: format(new Date(), 'yyyy-MM'),
  })

  const { categories, fetchCategories, fetchBudgets } = useBudget()

  useEffect(() => {
    if (open && fetchCategories) fetchCategories()
  }, [open, fetchCategories])

  const handleSubmit = async () => {
    if (!form.category || !form.planned || !form.month) {
      toast.error('Please fill in all fields')
      return
    }

    try {
      const existing = await supabase
        .from('budgets')
        .select('id')
        .eq('category', form.category)
        .eq('month', form.month)
        .maybeSingle()

      if (existing.data) {
        toast.error('Budget already exists for this category and month.')
        return
      }

      const { error } = await supabase.from('budgets').insert([
        {
          id: crypto.randomUUID(),
          category: form.category,
          planned: Number(form.planned),
          month: form.month,
        },
      ])

      if (error) throw error

      toast.success(`Budget set for ${form.category} – $${form.planned}`)
      if (fetchBudgets) {
        await fetchBudgets()
      }
      setForm({ category: '', planned: '', month: format(new Date(), 'yyyy-MM') })
      onClose()
    } catch (err) {
      console.error(err)
      toast.error('Failed to set budget')
    }
  }

  return (
    <Dialog open={open} onOpenChange={(state) => !state && onClose()}>
      <DialogTrigger asChild>
        <Button variant="outline">Add Budget</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Budget</DialogTitle>
          <DialogDescription>Set a planned amount for a category and month.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <select
            className="w-full border border-gray-300 rounded p-2"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          >
            <option value="">Select Category</option>
            {categories
              ?.filter((c) => c.type === 'expense')
              .map((cat) => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
          </select>

          <input
            className="w-full border border-gray-300 rounded p-2"
            type="number"
            placeholder="Planned Amount"
            value={form.planned}
            onChange={(e) => setForm({ ...form, planned: e.target.value })}
          />

          <input
            className="w-full border border-gray-300 rounded p-2"
            type="month"
            value={form.month}
            onChange={(e) => setForm({ ...form, month: e.target.value })}
          />
        </div>

        <DialogFooter>
          <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700 text-white">
            Save
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
