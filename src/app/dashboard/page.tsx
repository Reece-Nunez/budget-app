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
import AddExpenseModal from '@/components/dashboard/AddExpenseModal'
import AddIncomeModal from '@/components/dashboard/AddIncomeModal'
import AddCategoryModal from '@/components/dashboard/AddCategoryModal'

export default function DashboardPage() {
  const [selectedMonth, setSelectedMonth] = useState(new Date())

  return (
    <DashboardLayout>
      <div className="flex justify-between items-center mb-6">
        <MonthSelector onChange={setSelectedMonth} />
        <div className="flex gap-2">
          <AddExpenseModal />
          <AddIncomeModal />
          <AddCategoryModal />
        </div>
      </div>
      <OverviewCards selectedMonth={selectedMonth} />
      <BudgetBarChart selectedMonth={selectedMonth} />
      <ExpensePieChart selectedMonth={selectedMonth} />
      <MonthlyTable selectedMonth={selectedMonth} />
      <RecurringBills selectedMonth={selectedMonth} />
      <TransactionsFeed selectedMonth={selectedMonth} />

    </DashboardLayout>
  )
}
