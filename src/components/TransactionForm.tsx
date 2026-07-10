"use client";

import { useState, useRef, useEffect } from "react";
import { motion } from "framer-motion";
import { Transaction, Category } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES, CATEGORY_LABELS, CATEGORY_ICONS } from "@/constants";

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  if (typeof crypto !== "undefined" && typeof crypto.getRandomValues === "function") {
    const bytes = new Uint8Array(16);
    crypto.getRandomValues(bytes);
    bytes[6] = (bytes[6] & 0x0f) | 0x40;
    bytes[8] = (bytes[8] & 0x3f) | 0x80;
    const hex = Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("");
    return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

interface TransactionFormProps {
  onAddTransaction: (transaction: Transaction) => void;
  focusTrigger?: number;
}

export default function TransactionForm({ onAddTransaction, focusTrigger }: TransactionFormProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [error, setError] = useState("");
  const amountRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (focusTrigger && focusTrigger > 0) {
      amountRef.current?.focus();
    }
  }, [focusTrigger]);

  const categories = type === 'income' ? INCOME_CATEGORIES : EXPENSE_CATEGORIES;

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
    };

    onAddTransaction(transaction);
    setAmount("");
    setCategory("");
    setDescription("");
    setDate(new Date().toISOString().split("T")[0]);
    setError("");
    amountRef.current?.focus();
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
        <div className="flex rounded-lg overflow-hidden border border-zinc-200" role="group" aria-label="Transaction type">
          <button
            type="button"
            onClick={() => { setType("income"); setCategory(""); }}
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
            onClick={() => { setType("expense"); setCategory(""); }}
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

        <div>
          <label htmlFor="amount" className="block text-sm font-medium text-zinc-700 mb-1">
            Amount
          </label>
          <input
            ref={amountRef}
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

        <div>
          <label htmlFor="category" className="block text-sm font-medium text-zinc-700 mb-1">
            Category
          </label>
          <select
            id="category"
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          >
            <option value="">Select a category</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {CATEGORY_ICONS[cat] || ''} {CATEGORY_LABELS[cat] || cat}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label htmlFor="description" className="block text-sm font-medium text-zinc-700 mb-1">
            Description <span className="text-zinc-400 font-normal">(optional)</span>
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

        <div>
          <label htmlFor="date" className="block text-sm font-medium text-zinc-700 mb-1">
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

        {error && (
          <p className="text-sm text-red-600" role="alert">
            {error}
          </p>
        )}

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
