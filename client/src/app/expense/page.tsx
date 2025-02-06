"use client";

import React, { useState } from "react";
import { useCreateExpenseMutation } from "@/state/api"; // Import the expense mutation hook

interface Expense {
  expenseDate: string;
  reason: string;
  details?: string;
  amount: number;
}

const Expense: React.FC = () => {
  const [expense, setExpense] = useState<Partial<Expense>>({
    expenseDate: "",
    reason: "",
    details: "",
    amount: 0,
  });

  const [createExpense] = useCreateExpenseMutation(); // Initialize mutation hook for expense creation

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setExpense((prevExpense) => ({
      ...prevExpense,
      [name]: name === "amount" ? parseFloat(value) : value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    // Validate all required fields before submission
    if (!expense.expenseDate || !expense.reason || (expense.reason === "Shop Supplies" && !expense.details) || !expense.amount) {
      console.error("All fields are required.");
      return;
    }

    const expenseDetails = {
      expenseDate: expense.expenseDate,
      reason: expense.reason,
      details: expense.details || "",
      amount: expense.amount,
    };

    try {
      // Call the createExpense mutation
      const result = await createExpense(expenseDetails).unwrap();
      console.log("Expense created:", result);

      // Reset form after successful submission
      setExpense({
        expenseDate: "",
        reason: "",
        details: "",
        amount: 0,
      });
    } catch (error) {
      console.error("Failed to save the expense:", error);
    }
  };

  return (
    <div className="max-w-4xl mx-auto mt-10 p-8 bg-white shadow-lg rounded-lg">
      <h2 className="text-3xl font-bold text-gray-700 text-center mb-8">New Expense Entry</h2>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Expense Date */}
        <div>
          <label className="block mb-1 text-gray-600">Expense Date</label>
          <input
            type="date"
            name="expenseDate"
            value={expense.expenseDate || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
            required
          />
        </div>

        {/* Expense Reason */}
        <div>
          <label className="block mb-1 text-gray-600">Reason for Expense</label>
          <select
            name="reason"
            value={expense.reason || ""}
            onChange={handleChange}
            className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
            required
          >
            <option value="">Select Reason</option>
            <option value="Shop Supplies">Shop Supplies</option>
            <option value="Salaries">Salaries</option>
          </select>
        </div>

        {/* Details or Amount based on Reason */}
        {expense.reason === "Shop Supplies" && (
          <>
            <div>
              <label className="block mb-1 text-gray-600">Details of Items Purchased</label>
              <textarea
                name="details"
                value={expense.details || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
                placeholder="Describe what was bought for the shop"
                required
              />
            </div>
            <div>
              <label className="block mb-1 text-gray-600">Amount for Shop Supplies ($)</label>
              <input
                type="number"
                name="amount"
                min="0"
                value={expense.amount || ""}
                onChange={handleChange}
                className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
                required
              />
            </div>
          </>
        )}

        {expense.reason === "Salaries" && (
          <div>
            <label className="block mb-1 text-gray-600">Amount Paid for Salaries ($)</label>
            <input
              type="number"
              name="amount"
              min="0"
              value={expense.amount || ""}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:border-blue-400"
              required
            />
          </div>
        )}

        {/* Submit Button */}
        <div className="flex items-center justify-between mt-6">
          <button type="submit" className="bg-blue-600 text-white py-3 px-6 rounded-lg font-semibold hover:bg-blue-700 transition">
            Save Expense
          </button>
        </div>
      </form>
    </div>
  );
};

export default Expense;
