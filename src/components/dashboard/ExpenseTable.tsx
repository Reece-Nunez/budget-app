'use client'

import { useState } from 'react'
import { format, parseISO } from 'date-fns'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { toast } from 'sonner'
import { supabase } from '@/lib/supaBaseClient'
import { useBudget } from '@/lib/budget-store'

type Props = {
  selectedMonth: Date
}

export default function ExpenseTable({ selectedMonth }: Props) {
  const { expenses, fetchExpenses } = useBudget()
  const monthKey = format(selectedMonth, 'yyyy-MM')
  const [editDate, setEditDate] = useState<string>('')
  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)
  const [visibleCount, setVisibleCount] = useState<number>(5)

  const filteredExpenses = expenses.filter((e) => e.date.startsWith(monthKey))
  const visibleExpenses = filteredExpenses.slice(0, visibleCount)

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('expenses').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete expense')
    } else {
      toast.success('Deleted expense')
      await fetchExpenses?.()
    }
  }

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('expenses')
      .update({ amount: editAmount, date: editDate })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update expense')
    } else {
      toast.success('Updated expense')
      setEditingId(null)
      await fetchExpenses?.()
    }
  }

  // Sort by ISO date descending (latest first)
  const sorted = filteredExpenses.sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  )

  // Removed unused variable 'visibleTransactions'

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background rounded-2xl shadow-md mt-8"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-lg font-semibold">Expenses</h3>
      </div>
      {filteredExpenses.length === 0 ? (
        <div className="px-6 pb-4 text-muted-foreground">
          No expenses recorded for {monthKey}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Category</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Amount</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {visibleExpenses.map((e) => (
                <tr key={e.id} className="border-t hover:bg-accent transition-colors">
                  <td className="px-6 py-3">{e.category}</td>
                  <td className="px-6 py-3">
                    {editingId === e.id ? (
                      <Input
                        type="number"
                        className="w-24"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                      />
                    ) : (
                      `$${e.amount.toLocaleString()}`
                    )}
                  </td>
                  <td className="px-6 py-3">
                    {editingId === e.id ? (
                      <Input
                        type="date"
                        className="w-36"
                        value={editDate}
                        onChange={(e) => setEditDate(e.target.value)}
                      />
                    ) : (
                      format(parseISO(e.date), 'MMM d, yyyy')
                    )}
                  </td>
                  <td className="px-6 py-3 space-x-2">
                    {editingId === e.id ? (
                      <Button size="sm" onClick={() => handleSave(e.id)}>
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditAmount(e.amount)
                          setEditDate(e.date)
                          setEditingId(e.id)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {sorted.length > 5 && (
            <div className="flex justify-center pt-4 gap-4">
              {visibleCount < sorted.length && (
                <Button
                  variant="ghost"
                  onClick={() => setVisibleCount((prev) => prev + 5)}
                >
                  Load More
                </Button>
              )}

              {visibleCount > 5 && (
                <Button
                  variant="outline"
                  onClick={() => setVisibleCount((prev) => Math.max(5, prev - 5))}
                >
                  Show Less
                </Button>
              )}
            </div>
          )}
        </div>
      )}
    </motion.div>
  )
}
