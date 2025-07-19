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

export default function IncomeTable({ selectedMonth }: Props) {
  const { income, fetchIncome } = useBudget()
  const monthKey = format(selectedMonth, 'yyyy-MM')

  const [editingId, setEditingId] = useState<string | null>(null)
  const [editAmount, setEditAmount] = useState<number>(0)

  const filteredIncome = income.filter((i) => i.date.startsWith(monthKey))

  const handleDelete = async (id: string) => {
    const { error } = await supabase.from('income').delete().eq('id', id)
    if (error) {
      toast.error('Failed to delete income')
    } else {
      toast.success('Deleted income')
      await fetchIncome?.()
    }
  }

  const handleSave = async (id: string) => {
    const { error } = await supabase
      .from('income')
      .update({ amount: editAmount })
      .eq('id', id)

    if (error) {
      toast.error('Failed to update income')
    } else {
      toast.success('Updated income')
      setEditingId(null)
      await fetchIncome?.()
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background rounded-2xl shadow-md mt-8"
    >
      <div className="flex items-center justify-between px-6 py-4">
        <h3 className="text-lg font-semibold">Income</h3>
      </div>
      {filteredIncome.length === 0 ? (
        <div className="px-6 pb-4 text-muted-foreground">No income recorded for {monthKey}</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm text-left">
            <thead className="bg-muted">
              <tr>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Source</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Amount</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Date</th>
                <th className="px-6 py-4 font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncome.map((i) => (
                <tr key={i.id} className="border-t hover:bg-accent transition-colors">
                  <td className="px-6 py-3">{i.source}</td>
                  <td className="px-6 py-3">
                    {editingId === i.id ? (
                      <Input
                        type="number"
                        className="w-24"
                        value={editAmount}
                        onChange={(e) => setEditAmount(Number(e.target.value))}
                      />
                    ) : (
                      `$${i.amount.toLocaleString()}`
                    )}
                  </td>
                  <td className="px-6 py-3">{format(parseISO(i.date), 'MMM d, yyyy')}</td>
                  <td className="px-6 py-3 space-x-2">
                    {editingId === i.id ? (
                      <Button size="sm" onClick={() => handleSave(i.id)}>
                        Save
                      </Button>
                    ) : (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setEditAmount(i.amount)
                          setEditingId(i.id)
                        }}
                      >
                        Edit
                      </Button>
                    )}
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => handleDelete(i.id)}
                    >
                      Delete
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </motion.div>
  )
}
