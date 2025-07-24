import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import { createServerComponentClient } from '@supabase/auth-helpers-nextjs'
import type { Database } from '@/lib/database.types'

// dashboard widgets (all client components)
import MonthSelector from '@/components/dashboard/MonthSelector'
import OverviewCards from '@/components/dashboard/OverviewCards'
import IncomeTable from '@/components/dashboard/IncomeTable'
import IncomeVsSpending from '@/components/dashboard/IncomeVsSpending'
import ExpensePieChart from '@/components/dashboard/ExpensePieChart'
import ExpenseTable from '@/components/dashboard/ExpenseTable'
import BudgetBarChart from '@/components/dashboard/BudgetBarChart'
import MonthlyTable from '@/components/dashboard/MonthlyTable'
import RecurringBills from '@/components/dashboard/RecurringBills'
import TransactionsFeed from '@/components/dashboard/TransactionsFeed'
import AddDropdownMenu from '@/components/dashboard/AddDropdownMenu'
import DashboardLayout from '@/components/dashboard/DashboardLayout'
import LogoutButton from '@/components/LogoutButton'

export const revalidate = 0  // always fetch fresh data

export default async function DashboardPage() {
  // 1) Read & await the cookies in a Server Component
  const cookieStore = cookies()

  // 2) Create a server‑side Supabase client
  const supabase = createServerComponentClient<Database>({
    cookies: () => cookieStore,
  })

  // 3) Get the session
  const {
    data: { session }
  } = await supabase.auth.getSession()

  // 4) If no session, redirect back to /payment
  if (!session) {
    redirect('/payment')
  }

  // 5) make sure they've actually paid
  const { data: payment } = await supabase
    .from('payments')
    .select('has_paid')
    .eq('user_id', session.user.id)
    .single()

  if (!payment?.has_paid) {
    redirect('/payment')
  }

  // 6) If they have paid, render the dashboard
  const { data: expenses } = await supabase
    .from('expenses')
    .select('*')
    .eq('user_id', session.user.id)


  const selectedMonth = new Date()

  return (
    <main>
      <div className="my-8 mx-4 flex items-center gap-4">
        <div className="bg-neutral-800 text-white rounded-full w-12 h-12 flex items-center justify-center text-lg font-semibold uppercase shadow-md">
          {session.user.email ? session.user.email[0] : ''}
        </div>
        <div>
          <h1 className="text-xl text-gray-500">Welcome back,</h1>
          <h2 className="text-3xl font-bold text-black">{session.user.email}</h2>
        </div>
      </div>

      <DashboardLayout>
        <div className="relative">
          {/* MonthSelector should be a client component that manages selectedMonth state */}
          <MonthSelector />
        </div>

        <div className="fixed top-4 right-4 z-50 flex items-center gap-2 bg-background rounded-xl shadow-md px-3 py-2">
          <AddDropdownMenu />
          <LogoutButton />
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
      <pre>{JSON.stringify(expenses, null, 2)}</pre>
    </main>
  )
}
