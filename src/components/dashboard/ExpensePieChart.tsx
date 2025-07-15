'use client'

import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { useBudget } from '@/lib/budget-store'

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

export default function ExpensePieChart() {
  const { expenses, selectedMonth } = useBudget()

  const filtered = expenses.filter((e) => {
    const expenseDate = new Date(e.date)
    const selectedMonthDate = new Date(selectedMonth)
    return (
      expenseDate.getFullYear() === selectedMonthDate.getFullYear() &&
      expenseDate.getMonth() === selectedMonthDate.getMonth()
    )
  })

  const categories = filtered.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }))

  const formattedMonth = new Date(`${selectedMonth}-01`).toLocaleDateString('en-US', {
    month: 'long',
    year: 'numeric',
  })

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4">
        Spending Breakdown – {formattedMonth}
      </h3>
      <div className="h-[300px]">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={chartData}
              cx="50%"
              cy="50%"
              labelLine={false}
              outerRadius={130}
              fill="#8884d8"
              dataKey="value"
              nameKey="name"
            >
              {chartData.map((entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={COLORS[index % COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip />
          </PieChart>
        </ResponsiveContainer>
      </div>
      <ul className="flex flex-wrap justify-center gap-4 mt-6">
        {chartData.map((entry, index) => (
          <li key={index} className="flex items-center gap-2 text-sm">
            <span
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: COLORS[index % COLORS.length] }}
            />
            <span className="text-muted-foreground">{entry.name}</span>
          </li>
        ))}
      </ul>
    </motion.div>
  )
}
