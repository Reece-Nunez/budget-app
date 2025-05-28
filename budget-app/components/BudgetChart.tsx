"use client";

import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  Legend,
  Cell,
} from "recharts";

type Props = {
  type: "income" | "expense";
  data: {
    planned: number;
    actual: number;
  };
  darkMode: boolean;
};

export default function BudgetChart({ type, data }: Props) {
  const chartData = [
    {
      name: type.charAt(0).toUpperCase() + type.slice(1),
      Planned: data.planned,
      Actual: data.actual,
    },
  ];
  const isDark =
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-color-scheme: dark)").matches;

  const COLORS = {
    income: "#34d399", // green
    expense: "#f87171", // red
  };

  return (
    <div className="w-full h-64 bg-white dark:bg-gray-800 text-black dark:text-white rounded shadow p-4">
      <h2 className="text-lg font-semibold mb-4 capitalize">
        {type} — Planned vs Actual
      </h2>
      <ResponsiveContainer width="100%" height="100%">
        <BarChart
          data={chartData}
          barGap={8}
          barCategoryGap="25%"
          maxBarSize={60}
        >
          <XAxis dataKey="name" stroke={isDark ? "#fff" : "#000"} />
          <YAxis stroke={isDark ? "#fff" : "#000"} />
          <CartesianGrid stroke={isDark ? "#444" : "#ccc"} />
          <Tooltip
            contentStyle={{ backgroundColor: isDark ? "#333" : "#fff" }}
          />

          <Legend />
          <Bar dataKey="Planned" fill="#60a5fa" animationDuration={1000} />
          <Bar dataKey="Actual" fill={COLORS[type]} animationDuration={1500}>
            {chartData.map((entry, index) => (
              <Cell key={`cell-${index}`} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
