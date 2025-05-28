import { openDB } from "idb";

const DB_NAME = "budgetAppDB";
const DB_VERSION = 3;

export const initDB = async () => {
  return openDB(DB_NAME, DB_VERSION, {
    upgrade(db) {
      if (!db.objectStoreNames.contains("expenses")) {
        db.createObjectStore("expenses", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("incomes")) {
        db.createObjectStore("incomes", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("recurringBills")) {
        db.createObjectStore("recurringBills", { keyPath: "id" });
      }
      if (!db.objectStoreNames.contains("billPayments")) {
        db.createObjectStore("billPayments", { keyPath: "id" });
      }
    },
  });
};

// Expense Methods
export const addExpense = async (item: any) => {
  const db = await initDB();
  await db.put("expenses", item);
};

export const getAllExpenses = async () => {
  const db = await initDB();
  return db.getAll("expenses");
};

export const deleteExpense = async (id: string) => {
  const db = await initDB();
  await db.delete("expenses", id);
};

// Income Methods
export const addIncome = async (item: any) => {
  const db = await initDB();
  await db.put("incomes", item);
};

export const getAllIncomes = async () => {
  const db = await initDB();
  return db.getAll("incomes");
};

export const deleteIncome = async (id: string) => {
  const db = await initDB();
  await db.delete("incomes", id);
};

export const addRecurringBill = async (bill: any) => {
  const db = await initDB();
  await db.put("recurringBills", bill);
};

export const getAllRecurringBills = async () => {
  const db = await initDB();
  return db.getAll("recurringBills");
};

export const deleteRecurringBill = async (id: string) => {
  const db = await initDB();
  await db.delete("recurringBills", id);
};

export const addBillPayment = async (payment: any) => {
  const db = await initDB();
  await db.put("billPayments", payment);
};

export const getBillPaymentsByMonth = async (month: string) => {
  const db = await initDB();
  const all = await db.getAll("billPayments");
  return all.filter((p) => p.month === month);
};
