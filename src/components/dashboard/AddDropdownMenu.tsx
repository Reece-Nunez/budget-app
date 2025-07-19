'use client'

import { useState } from 'react'
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { Plus } from 'lucide-react'
import AddExpenseModal from './AddExpenseModal'
import AddIncomeModal from './AddIncomeModal'
import AddCategoryModal from './AddCategoryModal'
import AddBudgetModal from './AddBudgetModal'
import AddRecurringBillModal from './AddRecurringBillModal'

export default function AddDropdownMenu() {
  const [activeModal, setActiveModal] = useState<null | 'expense' | 'income' | 'category' | 'budget' | 'recurringBill'>(null)

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="default" className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            Add
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem onClick={() => setActiveModal('expense')}>Add Expense</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('income')}>Add Income</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('category')}>Add Category</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('budget')}>Add Budget</DropdownMenuItem>
          <DropdownMenuItem onClick={() => setActiveModal('recurringBill')}>Add Recurring Bill</DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      {activeModal === 'expense' && <AddExpenseModal open={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'income' && <AddIncomeModal open={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'category' && <AddCategoryModal open={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'budget' && <AddBudgetModal open={true} onClose={() => setActiveModal(null)} />}
      {activeModal === 'recurringBill' && <AddRecurringBillModal open={true} onClose={() => setActiveModal(null)} />}
    </>
  )
}
