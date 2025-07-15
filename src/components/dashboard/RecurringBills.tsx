'use client'

import { motion } from 'framer-motion'
import { Badge } from '@/components/ui/badge'

const bills = [
  { name: 'Rent', amount: 1200, due: 'Jul 1', status: 'Paid' },
  { name: 'Electric', amount: 95, due: 'Jul 7', status: 'Due Soon' },
  { name: 'Phone', amount: 45, due: 'Jul 12', status: 'Unpaid' },
  { name: 'Internet', amount: 70, due: 'Jul 15', status: 'Paid' },
  { name: 'Water', amount: 35, due: 'Jul 20', status: 'Due Soon' },
]

const getStatusColor = (status: string) => {
  switch (status) {
    case 'Paid':
      return 'bg-green-100 text-green-700'
    case 'Due Soon':
      return 'bg-yellow-100 text-yellow-700'
    case 'Unpaid':
      return 'bg-red-100 text-red-700'
    default:
      return ''
  }
}

export default function RecurringBills() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4">Recurring Bills</h3>
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
              <span className={`text-xs px-2 py-1 rounded-full ${getStatusColor(bill.status)}`}>
                {bill.status}
              </span>
            </div>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}