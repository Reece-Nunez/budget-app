'use client'

import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'

const monthlyData: Record<string, { category: string; planned: number; actual: number }[]> = {
  '2025-07': [
    { category: 'Housing', planned: 1200, actual: 1300 },
    { category: 'Groceries', planned: 600, actual: 550 },
    { category: 'Utilities', planned: 300, actual: 310 },
    { category: 'Transport', planned: 250, actual: 280 },
    { category: 'Entertainment', planned: 200, actual: 150 },
  ],
  '2025-06': [
    { category: 'Housing', planned: 1200, actual: 1200 },
    { category: 'Groceries', planned: 650, actual: 640 },
    { category: 'Utilities', planned: 290, actual: 300 },
    { category: 'Transport', planned: 240, actual: 260 },
    { category: 'Entertainment', planned: 180, actual: 210 },
  ],
}

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function MonthlyTable({ selectedMonth, onResetToToday }: Props) {
  const monthKey = format(selectedMonth, 'yyyy-MM')
  const data = monthlyData[monthKey] ?? monthlyData['2025-07']

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
            </tr>
          </thead>
          <tbody>
            {data.map((item, index) => {
              const diff = item.planned - item.actual
              const isPositive = diff >= 0

              return (
                <tr
                  key={index}
                  className="border-t hover:bg-accent transition-colors"
                >
                  <td className="px-6 py-3 font-medium">{item.category}</td>
                  <td className="px-6 py-3">${item.planned.toLocaleString()}</td>
                  <td className="px-6 py-3">${item.actual.toLocaleString()}</td>
                  <td
                    className={`px-6 py-3 font-semibold ${
                      isPositive ? 'text-green-600' : 'text-red-500'
                    }`}
                  >
                    {isPositive ? '+' : '-'}${Math.abs(diff).toLocaleString()}
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
