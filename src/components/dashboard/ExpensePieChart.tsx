'use client'

import { motion } from 'framer-motion'
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  { name: 'Housing', value: 1300 },
  { name: 'Groceries', value: 550 },
  { name: 'Utilities', value: 310 },
  { name: 'Transport', value: 280 },
  { name: 'Entertainment', value: 150 },
]

const COLORS = ['#3b82f6', '#f97316', '#10b981', '#8b5cf6', '#ef4444']

export default function ExpensePieChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px] bg-background p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4">Spending Breakdown</h3>
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={120}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </motion.div>
  )
}