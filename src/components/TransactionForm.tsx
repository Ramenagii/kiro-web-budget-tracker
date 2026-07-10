"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Transaction, CATEGORIES, Category, RecurringInterval } from "@/types";
import { generateId } from "@/lib/utils";

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
}

export default function TransactionForm({
  onAddTransaction,
}: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [recurring, setRecurring] = useState(false);
  const [recurringInterval, setRecurringInterval] =
    useState<RecurringInterval>("monthly");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const parsedAmount = parseFloat(amount);

    if (!parsedAmount || parsedAmount <= 0) {
      setError("Please enter an amount greater than 0");
      return;
    }

    if (!category) {
      setError("Please select a category");
      return;
    }

    const transaction: Transaction = {
      id: generateId(),
      type,
      amount: parsedAmount,
      category: category as Category,
      description: description.trim(),
      date,
      ...(recurring ? { recurring: true, recurringInterval } : {}),
    };

    onAddTransaction(transaction);

    // Reset form
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setRecurring(false);
    setRecurringInterval("monthly");
    setError("");
  };

  return (
    <motion.section
      aria-label="Add Transaction"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
        Add Transaction
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Type Toggle */}
        <div
          className="flex rounded-lg overflow-hidden border border-zinc-200"
          role="group"
          aria-label="Transaction type"
        >
          <button
            type="button"
            onClick={() => setType("income")}
            aria-pressed={type === "income"}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              type === "income"
                ? "bg-emerald-500 text-white"
                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Income
          </button>
          <button
            type="button"
            onClick={() => setType("expense")}
            aria-pressed={type === "expense"}
            className={`flex-1 py-2.5 text-sm font-medium transition-colors ${
              type === "expense"
                ? "bg-red-500 text-white"
                : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
            }`}
          >
            Expense
          </button>
        </div>

        {/* Amount */}
        <div>
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Amount ($)
          </label>
          <input
            type="number"
            id="amount"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="0.00"
            step="0.01"
            min="0.01"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          />
        </div>

        {/* Category */}
        <div>
          <label
            htmlFor="category"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          >
            <option value="">Select a category</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="description"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Description
          </label>
          <input
            type="text"
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="Enter a description"
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          />
        </div>

        {/* Date */}
        <div>
          <label
            htmlFor="date"
            className="block text-sm font-medium text-zinc-700 mb-1"
          >
            Date
          </label>
          <input
            type="date"
            id="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          />
        </div>

        {/* Recurring Toggle */}
        <div className="space-y-2">
          <label className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              checked={recurring}
              onChange={(e) => setRecurring(e.target.checked)}
              className="h-4 w-4 rounded border-zinc-300 text-emerald-600 focus:ring-emerald-500"
            />
            <span className="text-sm font-medium text-zinc-700">
              Recurring transaction
            </span>
          </label>

          {recurring && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
            >
              <label
                htmlFor="recurringInterval"
                className="block text-sm font-medium text-zinc-700 mb-1"
              >
                Frequency
              </label>
              <select
                id="recurringInterval"
                value={recurringInterval}
                onChange={(e) =>
                  setRecurringInterval(e.target.value as RecurringInterval)
                }
                className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
              >
                <option value="weekly">Weekly</option>
                <option value="biweekly">Biweekly</option>
                <option value="monthly">Monthly</option>
              </select>
            </motion.div>
          )}
        </div>

        {/* Error */}
        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

        {/* Submit */}
        <motion.button
          type="submit"
          whileTap={{ scale: 0.98, y: 1 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="w-full py-2.5 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 transition-colors"
        >
          Add {type === "income" ? "Income" : "Expense"}
        </motion.button>
      </form>
    </motion.section>
  );
}
