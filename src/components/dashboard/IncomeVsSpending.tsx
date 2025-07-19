'use client'

import { useBudget } from '@/lib/budget-store'
import { format } from 'date-fns'
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Cell,
} from 'recharts'
import { motion } from 'framer-motion'

type Props = {
  selectedMonth: Date
}

export default function IncomeVsSpendingChart({ selectedMonth }: Props) {
  const { income, expenses } = useBudget()
  const monthKey = format(selectedMonth, 'yyyy-MM')

  const incomeTotal = income
    .filter((i) => i.date.startsWith(monthKey))
    .reduce((sum, i) => sum + i.amount, 0)

  const expenseTotal = expenses
    .filter((e) => e.date.startsWith(monthKey))
    .reduce((sum, e) => sum + e.amount, 0)

  const balance = incomeTotal - expenseTotal

  const chartData = [
    { name: 'Income', amount: incomeTotal },
    { name: 'Expenses', amount: expenseTotal },
    { name: 'Net', amount: balance },
  ]

  const barColors: Record<string, string> = {
    Income: '#22c55e',    // Green-500
    Expenses: '#ef4444',  // Red-500
    Net: '#3b82f6',       // Blue-500
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background rounded-2xl shadow-md p-6 mt-8"
    >
      <h3 className="text-lg font-semibold mb-4">
        Income vs Spending – {format(selectedMonth, 'MMMM yyyy')}
      </h3>
      <ResponsiveContainer width="100%" height={250}>
        <BarChart data={chartData}>
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip
            formatter={(value: number) =>
              `$${value.toLocaleString(undefined, {
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              })}`
            }
          />
          <Legend />
          <Bar dataKey="amount" name="Amount">
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={barColors[entry.name]} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
