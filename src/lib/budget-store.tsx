'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { supabase } from '@/lib/supaBaseClient'

export type Expense = {
  id: string
  category: string
  amount: number
  date: string
}

export type Income = {
  id: string
  source: string
  amount: number
  date: string
}

type Category = {
  id: string
  name: string
  type: 'expense' | 'income'
  user_id?: string
}

export type Budget = {
  id: string
  category: string
  planned: number
  month: string
}

export type RecurringBill = {
  id: string
  name: string
  amount: number
  due_day: number
  category: string
  user_id?: string
  is_active: boolean
}

type BudgetContextType = {
  selectedMonth: string
  setSelectedMonth: (month: string) => void
  expenses: Expense[]
  addExpense: (data: Omit<Expense, 'id'>) => Promise<void>
  income: Income[]
  addIncome: (data: Omit<Income, 'id'>) => Promise<void>
  categories?: Category[]
  fetchCategories?: () => Promise<void>
  addCategory?: (data: Omit<Category, 'id'>) => Promise<void>
  fetchExpenses?: () => Promise<void>
  fetchIncome?: () => Promise<void>
  fetchBudgets?: () => Promise<void>
  setBudgets?: (budgets: Budget[]) => void
  budgets?: Budget[]
  addRecurringBill?: (data: Omit<RecurringBill, 'id'>) => Promise<void>
  recurringBills?: RecurringBill[]
  fetchRecurringBills?: () => Promise<void>
  setRecurringBills?: (bills: RecurringBill[]) => void
}

const BudgetContext = createContext<BudgetContextType | undefined>(undefined)

export const BudgetProvider = ({ children }: { children: React.ReactNode }) => {

  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date()
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
  })

  const [expenses, setExpenses] = useState<Expense[]>([])
  const [income, setIncome] = useState<Income[]>([])
  const [categories, setCategories] = useState<Category[]>([])
  const [budgets, setBudgets] = useState<Budget[]>([])
  const [recurringBills, setRecurringBills] = useState<RecurringBill[]>([])

  const fetchRecurringBills = async () => {
    const { data, error } = await supabase.from('recurring_bills').select('*')
    if (error) {
      console.error('Error fetching recurring bills:', error)
      return
    }
    if (data) setRecurringBills(data as RecurringBill[])
  }


  const fetchExpenses = async () => {
    const { data } = await supabase.from('expenses').select('*')
    if (data) setExpenses(data as Expense[])
  }

  const fetchIncome = async () => {
    const { data, error } = await supabase.from('income').select('*').order('date', { ascending: false })
    if (error) {
      console.error('Error fetching income:', error)
      return
    }
    if (data) setIncome(data as Income[])
  }

  const fetchBudgets = async () => {
    const { data } = await supabase.from('budgets').select('*')
    if (data) setBudgets(data as Budget[])
  }

  useEffect(() => {
    fetchBudgets()
    fetchExpenses()
    fetchIncome()
    fetchCategories()
    fetchRecurringBills()
  }, [])


  const fetchCategories = async () => {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    if (!userId) return

    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .eq('user_id', userId)

    if (!error && data) {
      setCategories(data)
    }
  }


  const addCategory = async (newCategory: Omit<Category, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    if (!userId) throw new Error("User not authenticated")

    const { data, error } = await supabase
      .from('categories')
      .insert([{ ...newCategory, id: crypto.randomUUID(), user_id: userId }])
      .select()

    if (!error && data) {
      setCategories(prev => [...prev, data[0]])
    } else {
      throw error
    }
  }


  useEffect(() => {
    fetchCategories()
  }, [])


  useEffect(() => {
    const fetchData = async () => {
      const [expRes, incRes] = await Promise.all([
        supabase.from('expenses').select('*'),
        supabase.from('income').select('*'),
      ])

      if (expRes.data) setExpenses(expRes.data as Expense[])
      if (incRes.data) setIncome(incRes.data as Income[])
    }

    fetchData()
  }, [])

  const addExpense = async (data: Omit<Expense, 'id'>) => {
    const { data: inserted, error } = await supabase.from('expenses').insert([data])
    if (!error && inserted) {
      setExpenses((prev) => [...prev, ...(inserted as Expense[])])
    }
  }

  const addIncome = async (data: Omit<Income, 'id'>) => {
    const { data: inserted, error } = await supabase.from('income').insert([data])
    if (!error && inserted) {
      setIncome((prev) => [...prev, ...(inserted as Income[])])
      await fetchIncome()
    }
  }

  const addRecurringBill = async (data: Omit<RecurringBill, 'id'>) => {
    const { data: { user } } = await supabase.auth.getUser()
    const userId = user?.id
    if (!userId) throw new Error("User not authenticated")

    const { data: inserted, error } = await supabase
      .from('recurring_bills')
      .insert([{ ...data, id: crypto.randomUUID(), user_id: userId }])
      .select()

    if (!error && inserted) {
      setRecurringBills(prev => [...prev, inserted[0]])
    } else {
      throw error
    }
  }

  return (
    <BudgetContext.Provider
      value={{
        selectedMonth,
        setSelectedMonth,
        expenses,
        addExpense,
        income,
        addIncome,
        categories,
        fetchCategories,
        addCategory,
        fetchExpenses,
        fetchIncome,
        fetchBudgets,
        setBudgets,
        budgets,
        recurringBills,
        addRecurringBill,
        fetchRecurringBills,
      }}
    >
      {children}
    </BudgetContext.Provider>
  )
}

export const useBudget = () => {
  const context = useContext(BudgetContext)
  if (!context) throw new Error('useBudget must be used within BudgetProvider')
  return context
}
