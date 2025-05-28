"use client";

import React, { useEffect, useState } from "react";
import { getAllRecurringBills, addBillPayment, getBillPaymentsByMonth } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

type Bill = {
  id: string;
  name: string;
  expectedAmount: number;
};

type Payment = {
  id: string;
  billId: string;
  month: string;
  actualAmount: number;
};

export default function MonthlyBillEntryTable() {
  const [bills, setBills] = useState<Bill[]>([]);
  const [payments, setPayments] = useState<Payment[]>([]);
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-05"

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const [bills, payments] = await Promise.all([
      getAllRecurringBills(),
      getBillPaymentsByMonth(currentMonth),
    ]);
    setBills(bills);
    setPayments(payments);
  };

  const getActualForBill = (billId: string) => {
    const entry = payments.find((p) => p.billId === billId);
    return entry?.actualAmount || "";
  };

  const handleInput = async (billId: string, value: string) => {
    const existing = payments.find((p) => p.billId === billId);
    const actualAmount = parseFloat(value);
    if (!actualAmount) return;

    const payment = {
      id: existing?.id || uuidv4(),
      billId,
      month: currentMonth,
      actualAmount,
    };

    await addBillPayment(payment);
    loadData();
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded shadow p-4 mt-6">
      <h2 className="text-lg font-semibold mb-2">Monthly Bill Input ({currentMonth})</h2>
      <table className="w-full text-left">
        <thead className="bg-gray-100 dark:bg-gray-700">
          <tr>
            <th className="p-2">Bill</th>
            <th className="p-2">Expected</th>
            <th className="p-2">Actual</th>
            <th className="p-2">Difference</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => {
            const actual = getActualForBill(bill.id);
            const difference = actual ? (actual - bill.expectedAmount).toFixed(2) : "-";
            return (
              <tr key={bill.id} className="border-t border-gray-300 dark:border-gray-700">
                <td className="p-2">{bill.name}</td>
                <td className="p-2">${bill.expectedAmount.toFixed(2)}</td>
                <td className="p-2">
                  <input
                    type="number"
                    value={actual}
                    onChange={(e) => handleInput(bill.id, e.target.value)}
                    className="border px-2 py-1 w-24 rounded text-black"
                  />
                </td>
                <td className="p-2">
                  {actual ? `$${difference}` : "-"}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
