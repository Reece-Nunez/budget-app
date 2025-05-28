"use client";

import React, { useEffect, useState } from "react";
import {
  getAllRecurringBills,
  getBillPaymentsByMonth,
} from "@/lib/db";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
} from "recharts";

export default function RecurringBillsChart() {
  type ChartData = { name: string; Expected: number; Actual: number };
  const [data, setData] = useState<ChartData[]>([]);
  const currentMonth = new Date().toISOString().slice(0, 7); // e.g., "2025-05"

  useEffect(() => {
    loadChartData();
  }, []);

  const loadChartData = async () => {
    const bills = await getAllRecurringBills();
    const payments = await getBillPaymentsByMonth(currentMonth);

    const combined = bills.map((bill) => {
      const payment = payments.find((p) => p.billId === bill.id);
      return {
        name: bill.name,
        Expected: bill.expectedAmount,
        Actual: payment?.actualAmount ?? 0,
      };
    });

    setData(combined);
  };

  if (data.length === 0) return null;

  return (
    <div className="w-full h-96 bg-white dark:bg-gray-800 rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4">Recurring Bills — {currentMonth}</h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={data}
          barGap={8}
          barCategoryGap="20%"
          maxBarSize={60}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" stroke="#888" />
          <YAxis stroke="#888" />
          <Tooltip />
          <Legend />
          <Bar dataKey="Expected" fill="#60a5fa" animationDuration={1000} />
          <Bar dataKey="Actual" fill="#f87171" animationDuration={1500} />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
