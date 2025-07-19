'use client'

import { motion } from 'framer-motion'
import { ArrowDownRight, ArrowUpRight } from 'lucide-react'
import { format, parseISO } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function TransactionsFeed({ selectedMonth, onResetToToday }: Props) {
  const { income, expenses } = useBudget()
  const monthKey = format(selectedMonth, 'yyyy-MM')

  // Combine and format both income and expenses
  const combined = [
    ...income
      .filter((i) => i.date.startsWith(monthKey))
      .map((i) => ({
        type: 'Income' as const,
        source: i.source || 'Income',
        amount: i.amount,
        date: format(parseISO(i.date), 'MMM d'),
      })),
    ...expenses
      .filter((e) => e.date.startsWith(monthKey))
      .map((e) => ({
        type: 'Expense' as const,
        source: e.category || 'Expense',
        amount: e.amount,
        date: format(parseISO(e.date), 'MMM d'),
      })),
  ]

  // Sort by date descending (latest first)
  const transactions = combined.sort(
    (a, b) => parseISO(b.date).getTime() - parseISO(a.date).getTime()
  )

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
                <p className={`font-semibold text-sm ${isIncome ? 'text-green-600' : 'text-red-600'}`}>
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
