// src/components/dashboard/BudgetBarChart.tsx
'use client'

import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts'
import { motion } from 'framer-motion'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import { useRouter, useSearchParams } from 'next/navigation'

const monthlyChartData: Record<string, { category: string; planned: number; actual: number }[]> = {
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

export default function BudgetBarChart({ selectedMonth, onResetToToday }: Props) {
  const monthKey = format(selectedMonth, 'yyyy-MM')
  const data = monthlyChartData[monthKey] ?? []

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
      {data.length === 0 ? (
        <div className="text-muted-foreground">No data available for {monthKey}</div>
      ) : (
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <XAxis dataKey="category" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="planned" fill="#3b82f6" name="Planned" />
            <Bar dataKey="actual" fill="#ef4444" name="Actual" />
          </BarChart>
        </ResponsiveContainer>
      )}
    </motion.div>
  )
}