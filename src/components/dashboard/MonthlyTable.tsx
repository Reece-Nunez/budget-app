'use client'

import { motion } from 'framer-motion'

const data = [
  { category: 'Housing', planned: 1200, actual: 1300 },
  { category: 'Groceries', planned: 600, actual: 550 },
  { category: 'Utilities', planned: 300, actual: 310 },
  { category: 'Transport', planned: 250, actual: 280 },
  { category: 'Entertainment', planned: 200, actual: 150 },
]

export default function MonthlyTable() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="overflow-x-auto bg-background rounded-2xl shadow-md"
    >
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
    </motion.div>
  )
}