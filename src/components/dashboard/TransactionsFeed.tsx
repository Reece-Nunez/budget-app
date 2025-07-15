'use client'

import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { format, parse } from 'date-fns'
import { Button } from '@/components/ui/button'

const allTransactions: Record<string, { type: 'Income' | 'Expense'; source: string; amount: number; date: string }[]> = {
  '2025-07': [
    { type: 'Income', source: 'Freelance Project', amount: 1200, date: 'Jul 5' },
    { type: 'Expense', source: 'Groceries', amount: 130, date: 'Jul 6' },
    { type: 'Expense', source: 'Gas Station', amount: 45, date: 'Jul 8' },
    { type: 'Income', source: 'Paycheck', amount: 2500, date: 'Jul 10' },
    { type: 'Expense', source: 'Dining Out', amount: 65, date: 'Jul 11' },
  ],
  '2025-06': [
    { type: 'Income', source: 'Freelance Project', amount: 1000, date: 'Jun 4' },
    { type: 'Expense', source: 'Groceries', amount: 140, date: 'Jun 6' },
    { type: 'Income', source: 'Paycheck', amount: 2400, date: 'Jun 10' },
    { type: 'Expense', source: 'Gas Station', amount: 50, date: 'Jun 12' },
    { type: 'Expense', source: 'Streaming', amount: 20, date: 'Jun 15' },
  ],
}

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function TransactionsFeed({ selectedMonth, onResetToToday }: Props) {
  const monthKey = format(selectedMonth, 'yyyy-MM')
  const transactions = allTransactions[monthKey] ?? []

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background p-6 rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xl font-semibold">Recent Transactions</h3>
        {onResetToToday && (
          <Button variant="outline" size="sm" onClick={onResetToToday}>
            Today
          </Button>
        )}
      </div>

      {transactions.length === 0 ? (
        <div className="text-muted-foreground">No transactions for {monthKey}</div>
      ) : (
        <ul className="space-y-3 divide-y">
          {transactions.map((item, index) => {
            const isIncome = item.type === 'Income'

            return (
              <li key={index} className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-3">
                  {isIncome ? (
                    <ArrowUpRight className="text-green-500" size={18} />
                  ) : (
                    <ArrowDownRight className="text-red-500" size={18} />
                  )}
                  <div>
                    <p className="font-medium">{item.source}</p>
                    <p className="text-sm text-muted-foreground">{item.date}</p>
                  </div>
                </div>
                <p
                  className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-red-600'
                    }`}
                >
                  {isIncome ? '+' : '-'}${item.amount.toLocaleString()}
                </p>
              </li>
            )
          })}
        </ul>
      )}
    </motion.div>
  )
}
