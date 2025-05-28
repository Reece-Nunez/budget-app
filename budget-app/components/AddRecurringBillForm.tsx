"use client";

import React, { useState } from "react";
import { addRecurringBill } from "@/lib/db";
import { v4 as uuidv4 } from "uuid";

export default function AddRecurringBillForm({ onBillAdded }: { onBillAdded: () => void }) {
  const [name, setName] = useState("");
  const [category, setCategory] = useState("Utilities");
  const [expected, setExpected] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await addRecurringBill({
      id: uuidv4(),
      name,
      category,
      expectedAmount: parseFloat(expected),
    });
    setName("");
    setExpected("");
    onBillAdded();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 bg-white dark:bg-gray-800 p-4 rounded shadow">
      <h2 className="text-lg font-semibold">Add Recurring Bill</h2>
      <input
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        placeholder="Bill Name (e.g. Electric)"
        className="w-full border px-4 py-2 rounded text-black"
        required
      />
      <input
        type="number"
        value={expected}
        onChange={(e) => setExpected(e.target.value)}
        placeholder="Expected Amount"
        className="w-full border px-4 py-2 rounded text-black"
        required
      />
      <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">
        Save Bill
      </button>
    </form>
  );
}
