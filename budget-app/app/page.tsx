// app/page.tsx
"use client";

import { useState, useEffect } from "react";
import {
  addIncome,
  getAllIncomes,
  deleteIncome,
  addExpense,
  getAllExpenses,
  deleteExpense,
  initDB,
} from "@/lib/db";
import BudgetModal from "@/components/BudgetModal";
import BudgetChart from "@/components/BudgetChart";
import AddRecurringBillForm from "@/components/AddRecurringBillForm";
import MonthlyBillEntryTable from "@/components/MonthlyBillEntryTable";
import RecurringBillsChart from "@/components/RecurringBillsChart";

type BudgetItem = {
  id: string;
  description: string;
  category: string;
  plannedAmount: number;
  actualAmount: number;
  date: string;
};

export default function Home() {
  const [incomes, setIncomes] = useState<BudgetItem[]>([]);
  const [expenses, setExpenses] = useState<BudgetItem[]>([]);
  const [showIncomeModal, setShowIncomeModal] = useState(false);
  const [showExpenseModal, setShowExpenseModal] = useState(false);
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const i = await getAllIncomes();
    const e = await getAllExpenses();
    setIncomes(i);
    setExpenses(e);
  };

  const handleAddIncome = async (income: any) => {
    await addIncome(income);
    setShowIncomeModal(false);
    loadData();
  };

  const handleAddExpense = async (expense: any) => {
    await addExpense(expense);
    setShowExpenseModal(false);
    loadData();
  };

  const handleDeleteIncome = async (id: any) => {
    await deleteIncome(id);
    loadData();
  };

  const handleDeleteExpense = async (id: any) => {
    await deleteExpense(id);
    loadData();
  };

  const clearAll = async () => {
    const db = await initDB();
    const tx1 = db.transaction("incomes", "readwrite");
    tx1.store.clear();
    const tx2 = db.transaction("expenses", "readwrite");
    tx2.store.clear();
    await Promise.all([tx1.done, tx2.done]);
    loadData();
  };

  const totalPlanned = (arr: any[]) => arr.reduce((sum: any, x: { plannedAmount: any; }) => sum + x.plannedAmount, 0);
  const totalActual = (arr: any[]) => arr.reduce((sum: any, x: { actualAmount: any; }) => sum + x.actualAmount, 0);

  return (
    <main className={`min-h-screen p-6 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Budget Dashboard</h1>
        <div className="space-x-2">
          <button
            onClick={() => setDarkMode(!darkMode)}
            className="px-4 py-1 rounded bg-gray-300 hover:bg-gray-400 dark:bg-gray-700"
          >
            Toggle {darkMode ? "Light" : "Dark"} Mode
          </button>
          <button
            onClick={clearAll}
            className="px-4 py-1 rounded bg-red-500 text-white hover:bg-red-600"
          >
            Clear All
          </button>
        </div>
      </div>

      <div className="flex gap-4 mb-6">
        <button
          onClick={() => setShowIncomeModal(true)}
          className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
        >
          Add Income
        </button>
        <button
          onClick={() => setShowExpenseModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
        >
          Add Expense
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        <BudgetChart
          type="income"
          data={{
            planned: totalPlanned(incomes),
            actual: totalActual(incomes),
          }}
          darkMode={darkMode}
        />
        <BudgetChart
          type="expense"
          data={{
            planned: totalPlanned(expenses),
            actual: totalActual(expenses),
          }}
          darkMode={darkMode}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
        {/* Incomes Table */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Income</h2>
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="p-2">Description</th>
                <th className="p-2">Category</th>
                <th className="p-2">Planned</th>
                <th className="p-2">Actual</th>
                <th className="p-2">Diff</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {incomes.map((item) => (
                <tr key={item.id} className="border-t border-gray-300 dark:border-gray-600">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">${item.plannedAmount.toFixed(2)}</td>
                  <td className="p-2">${item.actualAmount.toFixed(2)}</td>
                  <td className="p-2">
                    ${Math.abs(item.actualAmount - item.plannedAmount).toFixed(2)}
                  </td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteIncome(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Expenses Table */}
        <div className="bg-white dark:bg-gray-800 rounded shadow p-4">
          <h2 className="text-xl font-semibold mb-2">Expenses</h2>
          <table className="w-full text-left">
            <thead className="bg-gray-200 dark:bg-gray-700 text-black dark:text-white">
              <tr>
                <th className="p-2">Description</th>
                <th className="p-2">Category</th>
                <th className="p-2">Planned</th>
                <th className="p-2">Actual</th>
                <th className="p-2">Diff</th>
                <th className="p-2">Date</th>
                <th className="p-2">Actions</th>
              </tr>
            </thead>
            <tbody>
              {expenses.map((item) => (
                <tr key={item.id} className="border-t border-gray-300 dark:border-gray-600">
                  <td className="p-2">{item.description}</td>
                  <td className="p-2">{item.category}</td>
                  <td className="p-2">${item.plannedAmount.toFixed(2)}</td>
                  <td className="p-2">${item.actualAmount.toFixed(2)}</td>
                  <td className="p-2">
                    ${Math.abs(item.actualAmount - item.plannedAmount).toFixed(2)}
                  </td>
                  <td className="p-2">{item.date}</td>
                  <td className="p-2">
                    <button
                      onClick={() => handleDeleteExpense(item.id)}
                      className="text-red-600 hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Recurring Bills Section */}
      <div className="mt-12 space-y-6">
        <AddRecurringBillForm onBillAdded={() => {}} />
        <MonthlyBillEntryTable />
        <RecurringBillsChart />
      </div>

      {/* Modals */}
      <BudgetModal
        isOpen={showIncomeModal}
        onClose={() => setShowIncomeModal(false)}
        onSave={handleAddIncome}
        type="income"
      />
      <BudgetModal
        isOpen={showExpenseModal}
        onClose={() => setShowExpenseModal(false)}
        onSave={handleAddExpense}
        type="expense"
      />
    </main>
  );
}
