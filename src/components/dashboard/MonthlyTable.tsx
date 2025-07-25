'use client'

import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { useBudget } from '@/lib/budget-store'
import { supabase } from '@/lib/supaBaseClient'
import { toast } from 'sonner'
import { useCallback } from 'react'


type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

type BudgetRow = {
  id: string
  category: string
  planned: number
}

export default function MonthlyTable({ selectedMonth, onResetToToday }: Props) {
  const { expenses, fetchExpenses } = useBudget()
  const monthKey = format(selectedMonth, 'yyyy-MM')

  const [budgets, setBudgets] = useState<BudgetRow[]>([])
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)


  const loadBudgets = useCallback(async () => {
    const { data, error } = await supabase
      .from('budgets')
      .select('*')
      .eq('month', monthKey)

    if (!error) setBudgets(data || [])
    else toast.error('Failed to fetch budgets')
  }, [monthKey])

  useEffect(() => {
    loadBudgets()
  }, [loadBudgets])


  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('budgets')
      .update({ planned: editAmount })
      .eq('id', id)

    if (!error) {
      toast.success('Updated budget')
      await loadBudgets()
      await fetchExpenses?.()
      setEditingId(null)
    } else {
      toast.error('Failed to update')
    }
  }

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('budgets').delete().eq('id', id)
    if (!error) {
      toast.success('Deleted budget')
      await loadBudgets()
      await fetchExpenses?.()
    } else {
      toast.error('Delete failed')
    }
  }


  const actualTotals: Record<string, number> = {}

  expenses
    .filter(e => e.date.startsWith(monthKey))
    .forEach(e => {
      actualTotals[e.category] = (actualTotals[e.category] || 0) + e.amount
    })


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-lg font-semibold">Monthly Breakdown</h3>
        {onResetToToday && (
          <Button variant="outline" size="sm" onClick={onResetToToday}>
            Today
          </Button>
        )}
      </div>
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left">
          <thead className="bg-muted">
            <tr>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Category</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Planned</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Actual</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Difference</th>
              <th className="px-6 py-4 font-semibold text-muted-foreground">Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((b) => {
              const actual = actualTotals[b.category] || 0
              const diff = b.planned - actual
              const isPositive = diff >= 0

              return (
                <tr key={b.id} className="border-t hover:bg-accent transition-colors">
                  <td className="px-6 py-3 font-medium">{b.category}</td>
                  <td className="px-6 py-3">
                    {editingId === b.id ? (
                      <Input
                        type="number"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                        className="w-24"
                      />
                    ) : (
                      `$${b.planned.toLocaleString()}`
                    )}
                  </td>
                  <td className="px-6 py-3">${actual.toLocaleString()}</td>
                  <td
                    className={`px-6 py-3 font-semibold ${isPositive ? 'text-green-600' : 'text-red-500'
                      }`}
                  >
                    {isPositive ? '+' : '-'}${Math.abs(diff).toLocaleString()}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    {editingId === b.id ? (
                      <Button size="sm" onClick={() => handleSave(b.id)}>
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditAmount(b.planned)
                          setEditingId(b.id)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(b.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>
    </motion.div>
  )
}
