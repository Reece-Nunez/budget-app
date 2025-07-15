'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

const billsByMonth: Record<string, { name: string; amount: number; due: string; status: string }[]> = {
  '2025-07': [
    { name: 'Rent', amount: 1200, due: 'Jul 1', status: 'Paid' },
    { name: 'Electric', amount: 95, due: 'Jul 7', status: 'Due Soon' },
    { name: 'Phone', amount: 45, due: 'Jul 12', status: 'Unpaid' },
    { name: 'Internet', amount: 70, due: 'Jul 15', status: 'Paid' },
    { name: 'Water', amount: 35, due: 'Jul 20', status: 'Due Soon' },
  ],
  '2025-06': [
    { name: 'Rent', amount: 1200, due: 'Jun 1', status: 'Paid' },
    { name: 'Electric', amount: 100, due: 'Jun 7', status: 'Paid' },
    { name: 'Phone', amount: 45, due: 'Jun 12', status: 'Paid' },
    { name: 'Internet', amount: 70, due: 'Jun 15', status: 'Paid' },
    { name: 'Water', amount: 35, due: 'Jun 20', status: 'Paid' },
  ],
}

const getStatusVariant = (status: string): "outline" | "destructive" | "default" | "secondary" => {
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

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function RecurringBills({ selectedMonth, onResetToToday }: Props) {
  const monthKey = format(selectedMonth, 'yyyy-MM')
  const bills = billsByMonth[monthKey] ?? []

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
      {bills.length === 0 ? (
        <div className="text-muted-foreground">No bills for {monthKey}</div>
      ) : (
        <ul className="space-y-3">
          {bills.map((bill, index) => (
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
                <Badge variant={getStatusVariant(bill.status)}>
                  {bill.status}
                </Badge>
              </div>
            </li>
          ))}
        </ul>
      )}
    </motion.div>
  )
}
