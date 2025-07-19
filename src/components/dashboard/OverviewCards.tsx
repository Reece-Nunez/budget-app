'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart } from 'lucide-react'
import { format } from 'date-fns'
import { useBudget } from '@/lib/budget-store'

export default function OverviewCards({ selectedMonth }: { selectedMonth: Date }) {
  const { income, expenses } = useBudget()
  const key = format(selectedMonth, 'yyyy-MM')

  const monthlyIncome = income
    .filter((i) => i.date.startsWith(key))
    .reduce((sum, i) => sum + i.amount, 0)

  const monthlyExpenses = expenses
    .filter(
      (e) =>
        e.date.startsWith(key) &&
        e.category.toLowerCase() !== 'savings'
    )
    .reduce((sum, e) => sum + e.amount, 0)


  const savingsExpense = expenses
    .filter((e) => e.date.startsWith(key) && e.category.toLowerCase() === 'savings')
    .reduce((sum, e) => sum + e.amount, 0)

  const netBalance = monthlyIncome - monthlyExpenses

  const cards = [
    {
      title: 'Income',
      amount: monthlyIncome,
      icon: <ArrowUpRight className="text-green-500" />,
    },
    {
      title: 'Expenses',
      amount: monthlyExpenses,
      icon: <ArrowDownRight className="text-red-500" />,
    },
    ...(savingsExpense > 0
      ? [
        {
          title: 'Savings',
          amount: savingsExpense,
          icon: <DollarSign className="text-blue-500" />,
        },
      ]
      : []),
    {
      title: 'Net Balance',
      amount: netBalance,
      icon: <PieChart className="text-yellow-500" />,
    },
  ]


  return (
    <motion.div
      className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6"
      initial="hidden"
      animate="visible"
      variants={{
        hidden: { opacity: 0, y: 20 },
        visible: {
          opacity: 1,
          y: 0,
          transition: {
            staggerChildren: 0.15,
          },
        },
      }}
    >
      {cards.map((card, index) => (
        <motion.div
          key={index}
          variants={{
            hidden: { opacity: 0, y: 20 },
            visible: { opacity: 1, y: 0 },
          }}
        >
          <Card className="rounded-2xl shadow-md hover:shadow-xl transition-all">
            <CardContent className="p-6 flex flex-col gap-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-muted-foreground">
                  {card.title}
                </span>
                {card.icon}
              </div>
              <div className="text-2xl font-semibold">
                ${card.amount.toLocaleString()}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}
