'use client'

import { useEffect, useState } from 'react'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useBudget } from '@/lib/budget-store'

type Props = {
  selectedMonth: Date
  onResetToToday?: () => void
}

export default function BudgetBarChart({ selectedMonth, onResetToToday }: Props) {
  const { expenses, budgets } = useBudget()
  type ChartData = { category: string; planned: number; actual: number }
  const [chartData, setChartData] = useState<ChartData[]>([])
  const monthKey = format(selectedMonth, 'yyyy-MM')

  useEffect(() => {
    const monthBudgets = budgets?.filter(b => b.month === monthKey) ?? []
    const actualMap = expenses
      .filter(e => format(new Date(e.date), 'yyyy-MM') === monthKey)
      .reduce((acc, curr) => {
        acc[curr.category] = (acc[curr.category] || 0) + curr.amount
        return acc
      }, {} as Record<string, number>)


    const combined = monthBudgets.map(budget => ({
      category: budget.category,
      planned: budget.planned,
      actual: actualMap[budget.category] || 0,
    }))

    setChartData(combined)
  }, [expenses, budgets, monthKey])


  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-background p-6 rounded-2xl shadow-md"
    >
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold">Planned vs Actual</h3>
        {onResetToToday && (
          <Button variant="outline" size="sm" onClick={onResetToToday}>
            Today
          </Button>
        )}
      </div>

      {chartData.length === 0 ? (
        <div className="text-muted-foreground">No data available for {monthKey}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip
              formatter={(value: number) =>
                `$${value.toLocaleString(undefined, { minimumFractionDigits: 2 })}`
              }
            />
            <Legend />
            <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
            <Bar dataKey="actual" fill="#ef4444" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}
