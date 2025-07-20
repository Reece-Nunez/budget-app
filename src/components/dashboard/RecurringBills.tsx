'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { format, isBefore, addDays, setDate } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'
import { supabase } from '@/lib/supaBaseClient'
import { Switch } from '@/components/ui/switch'

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

type RecurringBill = {
  id: string
  name: string
  amount: number
  due_day: number
  is_active: boolean
}

type BillDisplay = {
  id: string
  name: string
  amount: number
  due: string
  status: 'Paid' | 'Due Soon' | 'Unpaid'
  is_active: boolean
}

export default function RecurringBills({ selectedMonth, onResetToToday }: Props) {
  const { expenses } = useBudget()
  const [recurringBills, setRecurringBills] = useState<BillDisplay[]>([])

  const monthKey = format(selectedMonth, 'yyyy-MM')

  useEffect(() => {
    const fetchBills = async () => {
      const { data: { user }, error: userError } = await supabase.auth.getUser()
      const userId = user?.id
      if (userError || !userId) {
        console.error('No user found:', userError)
        return
      }

      const { data: recurring, error } = await supabase
        .from('recurring_bills')
        .select('*')
        .eq('user_id', userId)

      console.log('Fetched recurring bills:', recurring)
      if (error) {
        console.error('Supabase error:', error)
        return
      }

      if (!recurring || recurring.length === 0) {
        console.warn('No recurring bills returned for user:', userId)
        return
      }

      const now = new Date()

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
          id: bill.id,
          name: bill.name,
          amount: bill.amount,
          due: format(dueDate, 'MMM d'),
          status,
          is_active: bill.is_active ?? true,
        }
      })

      console.log('Display-ready recurring bills:', display)
      setRecurringBills(display)
    }

    fetchBills()
  }, [selectedMonth, expenses, monthKey])


  const toggleActive = async (id: string, value: boolean) => {
    const { error } = await supabase
      .from('recurring_bills')
      .update({ is_active: value })
      .eq('id', id)

    if (!error) {
      setRecurringBills((prev) =>
        prev.map((bill) =>
          bill.id === id ? { ...bill, is_active: value } : bill
        )
      )
    }
  }

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

  function cn(...classes: (string | boolean | undefined | null)[]): string {
    return classes.filter(Boolean).join(' ')
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
      <div className="grid grid-cols-4 gap-4 font-medium text-sm text-muted-foreground mb-3 px-2">
        <div className="text-left">Bill</div>
        <div className="text-left">Amount</div>
        <div className="text-left">Status</div>
        <div className="text-right">Active</div>
      </div>


      {recurringBills.length === 0 ? (
        <div className="text-muted-foreground">No recurring bills set up</div>
      ) : (

        <ul className="space-y-3">
          {recurringBills.map((bill) => (
            <li
              key={bill.id}
              className={cn(
                'grid grid-cols-4 gap-4 items-center border-b border-muted pb-3 last:border-none px-2',
                !bill.is_active && 'opacity-50 italic'
              )}
            >
              <div className="flex flex-col">
                <span className="font-medium">{bill.name}</span>
                <span className="text-xs text-muted-foreground">Due {bill.due}</span>
              </div>
              <div className="text-sm font-semibold">
                ${bill.amount.toLocaleString()}
              </div>
              <div>
                <Badge variant={getStatusVariant(bill.status)}>{bill.status}</Badge>
              </div>
              <div className="flex justify-end">
                <Switch
                  checked={bill.is_active}
                  onCheckedChange={(val) => toggleActive(bill.id, val)}
                />
              </div>
            </li>
          ))}
        </ul>

      )}
    </motion.div>
  )
}
