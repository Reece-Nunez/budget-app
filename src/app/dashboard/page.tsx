import DashboardLayout from '@/components/dashboard/DashboardLayout'
import OverviewCards from '@/components/dashboard/OverviewCards'
import BudgetBarChart from '@/components/dashboard/BudgetBarChart'
import ExpensePieChart from '@/components/dashboard/ExpensePieChart'
import MonthlyTable from '@/components/dashboard/MonthlyTable'
import RecurringBills from '@/components/dashboard/RecurringBills'
import TransactionsFeed from '@/components/dashboard/TransactionsFeed'

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <OverviewCards />
      <BudgetBarChart />
      <ExpensePieChart />
      <MonthlyTable />
      <RecurringBills />
      <TransactionsFeed />
    </DashboardLayout>
  )
}
