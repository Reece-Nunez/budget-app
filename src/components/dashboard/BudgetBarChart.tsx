'use client'

import { motion } from 'framer-motion'
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'

const data = [
  {
    category: 'Housing',
    planned: 1200,
    actual: 1300,
  },
  {
    category: 'Groceries',
    planned: 600,
    actual: 550,
  },
  {
    category: 'Utilities',
    planned: 300,
    actual: 310,
  },
  {
    category: 'Transport',
    planned: 250,
    actual: 280,
  },
  {
    category: 'Entertainment',
    planned: 200,
    actual: 150,
  },
]

export default function BudgetBarChart() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-[400px] bg-background p-6 rounded-2xl shadow-md"
    >
      <h3 className="text-xl font-semibold mb-4">Planned vs Actual</h3>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="category" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="planned" fill="#3b82f6" radius={[4, 4, 0, 0]} />
          <Bar dataKey="actual" fill="#ef4444" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  )
}
