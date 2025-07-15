'use client'

import { motion } from 'framer-motion'
import { Card, CardContent } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, DollarSign, PieChart } from 'lucide-react'

const cards = [
  {
    title: 'Income',
    amount: 4200,
    icon: <ArrowUpRight className="text-green-500" />,
  },
  {
    title: 'Expenses',
    amount: 3100,
    icon: <ArrowDownRight className="text-red-500" />,
  },
  {
    title: 'Savings',
    amount: 700,
    icon: <DollarSign className="text-blue-500" />,
  },
  {
    title: 'Net Balance',
    amount: 1100,
    icon: <PieChart className="text-yellow-500" />,
  },
]

export default function OverviewCards() {
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
