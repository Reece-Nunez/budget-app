'use client'

import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function ExpensePieChart({ selectedMonth, onResetToToday }: Props) {
  const { expenses } = useBudget()

  const monthKey = format(selectedMonth, 'yyyy-MM')

  const filtered = expenses.filter((e) =>
    e.date.startsWith(monthKey)
  )

  const categories = filtered.reduce((acc, item) => {
    acc[item.category] = (acc[item.category] || 0) + item.amount
    return acc
  }, {} as Record<string, number>)

  const chartData = Object.entries(categories).map(([name, value]) => ({
    name,
    value,
  }))

  const formattedMonth = format(selectedMonth, 'MMMM yyyy')

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full bg-background p-6 rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Spending Breakdown – {formattedMonth}</h3>
        {onResetToToday && (
          <Button variant="outline" size="sm" onClick={onResetToToday}>
            Today
          </Button>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="text-muted-foreground">No data available for {monthKey}</div>
      ) : (
        <>
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
        </>
      )}
    </motion.div>
  )
}
