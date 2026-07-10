"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/types";

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function CategoryBreakdown({
  transactions,
}: CategoryBreakdownProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  if (expenses.length === 0) {
    return (
      <motion.section
        aria-label="Category Breakdown"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
          Expense Breakdown
        </h2>
        <p className="text-zinc-500 text-center py-8 text-sm leading-relaxed">
          No expenses to display yet.
        </p>
      </motion.section>
    );
  }

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  const categoryColors: Record<string, string> = {
    Food: "bg-emerald-500",
    Transport: "bg-slate-500",
    Entertainment: "bg-teal-500",
    Bills: "bg-amber-500",
    Shopping: "bg-zinc-600",
    Health: "bg-emerald-600",
    Other: "bg-slate-400",
  };

  return (
    <motion.section
      aria-label="Category Breakdown"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
        Expense Breakdown
      </h2>
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-3"
      >
        {sortedCategories.map(([category, amount]) => {
          const percentage = (amount / totalExpenses) * 100;
          return (
            <motion.div key={category} variants={itemVariants}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-zinc-700">
                  {category}
                </span>
                <span className="text-sm text-zinc-500">
                  ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                <motion.div
                  className={`h-2.5 rounded-full ${
                    categoryColors[category] || "bg-slate-400"
                  }`}
                  initial={{ scaleX: 0 }}
                  animate={{ scaleX: percentage / 100 }}
                  transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                  style={{ transformOrigin: "left", width: "100%" }}
                />
              </div>
            </motion.div>
          );
        })}
      </motion.div>
      <div className="mt-4 pt-3 border-t border-zinc-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-zinc-700">
            Total Expenses
          </span>
          <span className="text-sm font-semibold text-red-600">
            ${totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>
    </motion.section>
  );
}
