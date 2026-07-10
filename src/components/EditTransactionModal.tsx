"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import { Transaction, Category } from "@/types";
import { EXPENSE_CATEGORIES, INCOME_CATEGORIES } from "@/constants";

interface EditTransactionModalProps {
  transaction: Transaction | null;
  onSave: (id: string, updated: Partial<Transaction>) => void;
  onClose: () => void;
}

export default function EditTransactionModal({ transaction, onSave, onClose }: EditTransactionModalProps) {
  const [type, setType] = useState<"income" | "expense">("expense");
  const [amount, setAmount] = useState("");
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (transaction) {
      setType(transaction.type);
      setAmount(transaction.amount.toString());
      setCategory(transaction.category);
      setDescription(transaction.description);
      setDate(transaction.date);
    }
  }, [transaction]);

  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (e.key === 'Escape') onClose();
  }, [onClose]);

  useEffect(() => {
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  if (!transaction) return null;

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

    onSave(transaction.id, {
      type,
      amount: parsedAmount,
      category: category as Category,
      description: description.trim(),
      date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95, y: 10 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95, y: 10 }}
        transition={{ type: "spring", stiffness: 200, damping: 25 }}
        className="rounded-2xl bg-white shadow-xl border border-zinc-200 p-6 w-full max-w-md"
      >
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-zinc-800 tracking-tighter">Edit Transaction</h2>
          <button onClick={onClose} className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors" aria-label="Close">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex rounded-lg overflow-hidden border border-zinc-200" role="group" aria-label="Transaction type">
            <button type="button" onClick={() => { setType("income"); setCategory(""); }} aria-pressed={type === "income"} className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "income" ? "bg-emerald-500 text-white" : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"}`}>Income</button>
            <button type="button" onClick={() => { setType("expense"); setCategory(""); }} aria-pressed={type === "expense"} className={`flex-1 py-2 text-sm font-medium transition-colors ${type === "expense" ? "bg-red-500 text-white" : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"}`}>Expense</button>
          </div>

          <div>
            <label htmlFor="edit-amount" className="block text-sm font-medium text-zinc-700 mb-1">Amount</label>
            <input type="number" id="edit-amount" value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.00" step="0.01" min="0.01" className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80" />
          </div>

          <div>
            <label htmlFor="edit-category" className="block text-sm font-medium text-zinc-700 mb-1">Category</label>
            <select id="edit-category" value={category} onChange={(e) => setCategory(e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80">
              <option value="">Select a category</option>
              {categories.map((cat) => (<option key={cat} value={cat}>{cat}</option>))}
            </select>
          </div>

          <div>
            <label htmlFor="edit-description" className="block text-sm font-medium text-zinc-700 mb-1">Description</label>
            <input type="text" id="edit-description" value={description} onChange={(e) => setDescription(e.target.value)} placeholder="Enter a description" className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80" />
          </div>

          <div>
            <label htmlFor="edit-date" className="block text-sm font-medium text-zinc-700 mb-1">Date</label>
            <input type="date" id="edit-date" value={date} onChange={(e) => setDate(e.target.value)} className="w-full px-3 py-2 border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80" />
          </div>

          {error && <p className="text-sm text-red-600" role="alert">{error}</p>}

          <div className="flex gap-3">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors">Cancel</button>
            <motion.button type="submit" whileTap={{ scale: 0.98 }} className="flex-1 py-2.5 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors">Save</motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
}
