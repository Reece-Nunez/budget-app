'use client'

import { useState } from 'react'
import MonthSelector from '@/components/dashboard/MonthSelector'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import OverviewCards from '@/components/dashboard/OverviewCards'
import BudgetBarChart from '@/components/dashboard/BudgetBarChart'
import ExpensePieChart from '@/components/dashboard/ExpensePieChart'
import MonthlyTable from '@/components/dashboard/MonthlyTable'
import RecurringBills from '@/components/dashboard/RecurringBills'
import TransactionsFeed from '@/components/dashboard/TransactionsFeed'
import AddDropdownMenu from '@/components/dashboard/AddDropdownMenu'
import ExpenseTable from '@/components/dashboard/ExpenseTable'
import IncomeTable from '@/components/dashboard/IncomeTable'
import IncomeVsSpending from '@/components/dashboard/IncomeVsSpending'


export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  return (
    <DashboardLayout>
      <div className="relative">
        <MonthSelector onChange={setSelectedMonth} />
      </div>

      <div className="fixed top-4 right-4 z-50 bg-background rounded-xl shadow-md p-1">
        <AddDropdownMenu />
      </div>

      <OverviewCards selectedMonth={selectedMonth} />
      <IncomeTable selectedMonth={selectedMonth} />
      <IncomeVsSpending selectedMonth={selectedMonth} />
      <ExpensePieChart selectedMonth={selectedMonth} />
      <ExpenseTable selectedMonth={selectedMonth} />
      <BudgetBarChart selectedMonth={selectedMonth} />
      <MonthlyTable selectedMonth={selectedMonth} />
      <RecurringBills selectedMonth={selectedMonth} />
      <TransactionsFeed selectedMonth={selectedMonth} />
    </DashboardLayout>
  )
}
