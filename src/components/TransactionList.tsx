"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
  onEditTransaction: (transaction: Transaction) => void;
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.06 },
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

export default function TransactionList({
  transactions,
  onDeleteTransaction,
  onEditTransaction,
}: TransactionListProps) {
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
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-zinc-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 012-2h2a2 2 0 012 2M9 5h6" />
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

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

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
        className="divide-y divide-zinc-100 max-h-96 overflow-y-auto"
      >
        <AnimatePresence mode="popLayout">
          {sortedTransactions.map((transaction) => (
            <motion.article
              key={transaction.id}
              layout
              variants={itemVariants}
              exit={{ opacity: 0, x: -20, transition: { type: "spring", stiffness: 100, damping: 20 } }}
              whileHover={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 100, damping: 20 }}
              className="flex items-center justify-between py-3 first:pt-0 last:pb-0"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
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
                </div>
                <p className="text-sm text-zinc-700 truncate leading-relaxed">
                  {transaction.description || <span className="italic text-zinc-400">No description</span>}
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
                  {transaction.type === "income" ? "+" : ""}{formatCurrency(transaction.amount)}
                </span>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onEditTransaction(transaction)}
                  className="p-1.5 text-zinc-400 hover:text-blue-500 hover:bg-blue-50 rounded transition-colors"
                  aria-label={`Edit transaction: ${transaction.description || transaction.category}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                  </svg>
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.98 }}
                  onClick={() => onDeleteTransaction(transaction.id)}
                  className="p-1.5 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                  aria-label={`Delete transaction: ${transaction.description || transaction.category}`}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </motion.button>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>
    </motion.section>
  );
}
