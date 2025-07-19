'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { format, isBefore, addDays, setDate } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'
import { supabase } from '@/lib/supaBaseClient'

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

type RecurringBill = {
  id: string
  name: string
  amount: number
  due_day: number
}

type BillDisplay = {
  name: string
  amount: number
  due: string
  status: 'Paid' | 'Due Soon' | 'Unpaid'
}

export default function RecurringBills({ selectedMonth, onResetToToday }: Props) {
  const { expenses } = useBudget()
  const [recurringBills, setRecurringBills] = useState<BillDisplay[]>([])

  const monthKey = format(selectedMonth, 'yyyy-MM')

  useEffect(() => {
    const now = new Date()
    const fetchRecurringBills = async () => {
      const { data: { user } } = await supabase.auth.getUser()
      const userId = user?.id || user?.id
      if (!userId) return

      const { data: recurring, error } = await supabase
        .from('recurring_bills')
        .select('*')
        .eq('user_id', userId)

      if (error || !recurring) return

      const display: BillDisplay[] = recurring.map((bill: RecurringBill) => {
        const dueDate = setDate(selectedMonth, bill.due_day)
        const paid = expenses.some(
          (e) => e.date.startsWith(monthKey) && e.category === bill.name
        )

        let status: 'Paid' | 'Due Soon' | 'Unpaid' = 'Unpaid'
        if (paid) {
          status = 'Paid'
        } else if (isBefore(dueDate, addDays(now, 5)) && isBefore(now, dueDate)) {
          status = 'Due Soon'
        }

        return {
          name: bill.name,
          amount: bill.amount,
          due: format(dueDate, 'MMM d'),
          status,
        }
      })

      setRecurringBills(display)
    }
    fetchRecurringBills()
  }, [selectedMonth, expenses, monthKey])


  const getStatusVariant = (
    status: 'Paid' | 'Due Soon' | 'Unpaid'
  ): 'outline' | 'destructive' | 'default' | 'secondary' => {
    switch (status) {
      case 'Paid':
        return 'secondary'
      case 'Due Soon':
        return 'outline'
      case 'Unpaid':
        return 'destructive'
      default:
        return 'default'
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background p-6 rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Recurring Bills</h3>
        {onResetToToday && (
          <Button variant="outline" size="sm" onClick={onResetToToday}>
            Today
          </Button>
        )}
      </div>

      {recurringBills.length === 0 ? (
        <div className="text-muted-foreground">No recurring bills set up</div>
      ) : (
        <ul className="space-y-3">
          {recurringBills.map((bill, index) => (
            <li
              key={index}
              className="flex items-center justify-between border-b pb-2 last:border-none"
            >
              <div>
                <p className="font-medium">{bill.name}</p>
                <p className="text-sm text-muted-foreground">Due {bill.due}</p>
              </div>
              <div className="flex items-center gap-4">
                <span className="text-sm font-semibold">
                  ${bill.amount.toLocaleString()}
                </span>
                <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
