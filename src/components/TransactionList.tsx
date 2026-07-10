"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, CATEGORIES, Category } from "@/types";
import RecurringBadge from "@/components/RecurringBadge";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (id: string, updates: Partial<Transaction>) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 12 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

function InlineEditForm({
  transaction,
  onSave,
  onCancel,
}: {
  transaction: Transaction;
  onSave: (updates: Partial<Transaction>) => void;
  onCancel: () => void;
}) {
  const [amount, setAmount] = useState(transaction.amount.toString());
  const [description, setDescription] = useState(transaction.description);
  const [category, setCategory] = useState<string>(transaction.category);
  const [date, setDate] = useState(transaction.date);

  const handleSave = () => {
    const parsedAmount = parseFloat(amount);
    if (!parsedAmount || parsedAmount <= 0) return;
    if (!category) return;

    onSave({
      amount: parsedAmount,
      description: description.trim(),
      category: category as Category,
      date,
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="flex flex-col gap-2 py-3"
    >
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          step="0.01"
          min="0.01"
          className="px-2 py-1.5 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
          placeholder="Amount"
          aria-label="Edit amount"
        />
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="px-2 py-1.5 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
          placeholder="Description"
          aria-label="Edit description"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="px-2 py-1.5 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
          aria-label="Edit category"
        >
          {CATEGORIES.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <input
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          className="px-2 py-1.5 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
          aria-label="Edit date"
        />
      </div>
      <div className="flex gap-2">
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={handleSave}
          className="px-3 py-1.5 text-xs font-medium bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors"
        >
          Save
        </motion.button>
        <motion.button
          type="button"
          whileTap={{ scale: 0.98 }}
          onClick={onCancel}
          className="px-3 py-1.5 text-xs font-medium bg-zinc-200 text-zinc-700 rounded-lg hover:bg-zinc-300 transition-colors"
        >
          Cancel
        </motion.button>
      </div>
    </motion.div>
  );
}

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}: TransactionListProps) {
  const [editingId, setEditingId] = useState<string | null>(null);

  if (transactions.length === 0) {
    return (
      <motion.section
        aria-label="Transaction List"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
          Transactions
        </h2>
        <div className="flex flex-col items-center justify-center py-12">
          <div className="w-12 h-12 rounded-full bg-zinc-100 flex items-center justify-center mb-4">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={1.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6"
              />
            </svg>
          </div>
          <p className="text-zinc-500 text-sm text-center leading-relaxed">
            No transactions yet.
            <br />
            Add one to get started.
          </p>
        </div>
      </motion.section>
    );
  }

  return (
    <motion.section
      aria-label="Transaction List"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
        Transactions ({transactions.length})
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="divide-y divide-zinc-100"
      >
        <AnimatePresence mode="popLayout">
          {transactions.map((transaction) => (
            <motion.article
              key={transaction.id}
              layout
              variants={itemVariants}
              exit={{
                opacity: 0,
                x: -20,
                transition: { type: "spring", stiffness: 100, damping: 20 },
              }}
              whileHover={editingId !== transaction.id ? { scale: 1.01 } : undefined}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="py-3 first:pt-0 last:pb-0"
            >
              {editingId === transaction.id ? (
                <InlineEditForm
                  transaction={transaction}
                  onSave={(updates) => {
                    onEditTransaction(transaction.id, updates);
                    setEditingId(null);
                  }}
                  onCancel={() => setEditingId(null)}
                />
              ) : (
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                          transaction.type === "income"
                            ? "bg-emerald-100 text-emerald-700"
                            : "bg-red-100 text-red-700"
                        }`}
                      >
                        {transaction.type}
                      </span>
                      <span className="text-xs text-zinc-500">
                        {transaction.category}
                      </span>
                      {transaction.recurring && transaction.recurringInterval && (
                        <RecurringBadge interval={transaction.recurringInterval} />
                      )}
                    </div>
                    <p className="text-sm text-zinc-700 truncate leading-relaxed">
                      {transaction.description || "No description"}
                    </p>
                    <p className="text-xs text-zinc-400 mt-0.5">
                      {transaction.date}
                    </p>
                  </div>
                  <div className="flex items-center gap-2 ml-3">
                    <span
                      className={`text-sm font-semibold whitespace-nowrap ${
                        transaction.type === "income"
                          ? "text-emerald-600"
                          : "text-red-600"
                      }`}
                    >
                      {transaction.type === "income" ? "+" : "-"}$
                      {transaction.amount.toFixed(2)}
                    </span>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setEditingId(transaction.id)}
                      className="p-1.5 text-zinc-400 hover:text-emerald-600 hover:bg-emerald-50 rounded transition-colors"
                      aria-label={`Edit transaction: ${transaction.description || transaction.category}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                        />
                      </svg>
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.98 }}
                      onClick={() => onDeleteTransaction(transaction.id)}
                      className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                      aria-label={`Delete transaction: ${transaction.description || transaction.category}`}
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        strokeWidth={2}
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
