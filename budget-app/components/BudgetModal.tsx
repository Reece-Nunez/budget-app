"use client";

import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from "uuid";

interface BudgetModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (item: {
    id: string;
    description: string;
    category: string;
    plannedAmount: number;
    actualAmount: number;
    date: string;
  }) => void;
  type: "income" | "expense";
}

const baseCategories = {
  income: ["Salary", "Side Hustle", "Investments", "Other", "Custom"],
  expense: ["Groceries", "Bills", "Entertainment", "Rent", "Other", "Custom"],
};

export default function BudgetModal({
  isOpen,
  onClose,
  onSave,
  type,
}: BudgetModalProps) {
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState(baseCategories[type][0]);
  const [customCategory, setCustomCategory] = useState("");
  const [userCategories, setUserCategories] = useState<string[]>([]);
  const [planned, setPlanned] = useState("");
  const [actual, setActual] = useState("");
  const [date, setDate] = useState("");
  const finalCategory = category === "Custom" ? customCategory : category;

  useEffect(() => {
    if (isOpen) {
      setDescription("");
      setCategory(baseCategories[type][0]);
      setPlanned("");
      setActual("");
      setCustomCategory("");
      setDate(new Date().toISOString().split("T")[0]);

      const saved = localStorage.getItem(`${type}Categories`);
      if (saved) setUserCategories(JSON.parse(saved));
    }
  }, [isOpen, type]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // save custom category for future use
    if (category === "Custom" && customCategory) {
      const updated = Array.from(new Set([...userCategories, customCategory]));
      setUserCategories(updated);
      localStorage.setItem(`${type}Categories`, JSON.stringify(updated));
    }
    onSave({
      id: uuidv4(),
      description,
      category: finalCategory,
      plannedAmount: parseFloat(planned),
      actualAmount: parseFloat(actual),
      date,
    });
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md dark:bg-gray-900">
        <h2 className="text-xl font-bold mb-4 capitalize">
          Add {type === "income" ? "Income" : "Expense"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <input
            type="text"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded text-black"
          />
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full border px-4 py-2 rounded text-black"
          >
            {[...userCategories, ...baseCategories[type]].map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {category === "Custom" && (
            <input
              type="text"
              placeholder="Enter custom category"
              value={customCategory}
              onChange={(e) => setCustomCategory(e.target.value)}
              className="w-full border px-4 py-2 rounded text-black"
              required
            />
          )}

          <input
            type="number"
            placeholder="Planned Amount"
            value={planned}
            onChange={(e) => setPlanned(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded text-black"
          />
          <input
            type="number"
            placeholder="Actual Amount"
            value={actual}
            onChange={(e) => setActual(e.target.value)}
            required
            className="w-full border px-4 py-2 rounded text-black"
          />
          <input
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full border px-4 py-2 rounded text-black"
          />
          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded bg-gray-300 hover:bg-gray-400"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 rounded bg-blue-600 text-white hover:bg-blue-700"
            >
              Save
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
