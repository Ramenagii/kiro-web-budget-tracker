"use client";

import { motion } from "framer-motion";
import { Transaction, Budget, Category } from "@/types";
import { CATEGORY_COLORS, CATEGORY_LABELS, EXPENSE_CATEGORIES } from "@/constants";
import { formatCurrency } from "@/utils/format";

interface CategoryBreakdownProps {
  transactions: Transaction[];
  budgets: Budget[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.08 },
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

export default function CategoryBreakdown({ transactions, budgets }: CategoryBreakdownProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  const budgetMap = new Map(budgets.map((b) => [b.category, b.monthlyLimit]));

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

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

      {expenses.length === 0 ? (
        <p className="text-zinc-500 text-center py-8 text-sm leading-relaxed">
          No expenses to display yet.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          {sortedCategories.map(([category, amount]) => {
            const percentage = (amount / totalExpenses) * 100;
            const budget = budgetMap.get(category as Category);
            const overBudget = budget && amount > budget;
            const nearBudget = budget && !overBudget && amount >= budget * 0.8;

            return (
              <motion.div key={category} variants={itemVariants}>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-sm font-medium text-zinc-700">
                    {CATEGORY_LABELS[category] || category}
                  </span>
                  <span className={`text-sm ${overBudget ? 'text-red-600 font-semibold' : 'text-zinc-500'}`}>
                    {formatCurrency(amount)}
                    {budget && (
                      <span className="text-xs text-zinc-400 ml-1">
                        / {formatCurrency(budget)}
                      </span>
                    )}
                  </span>
                </div>
                <div className="w-full bg-zinc-100 rounded-full h-2.5 overflow-hidden">
                  <motion.div
                    className={`h-2.5 rounded-full ${
                      overBudget ? 'bg-red-500' : nearBudget ? 'bg-amber-400' : CATEGORY_COLORS[category] || 'bg-slate-400'
                    }`}
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: percentage / 100 }}
                    transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.2 }}
                    style={{ transformOrigin: "left", width: "100%" }}
                  />
                </div>
                {budget && (
                  <div className="mt-0.5">
                    <div className="w-full bg-zinc-100 rounded-full h-1 overflow-hidden">
                      <motion.div
                        className={`h-1 rounded-full ${overBudget ? 'bg-red-300' : 'bg-zinc-300'}`}
                        initial={{ scaleX: 0 }}
                        animate={{ scaleX: Math.min(amount / budget, 1) }}
                        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.3 }}
                        style={{ transformOrigin: "left", width: "100%" }}
                      />
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </motion.div>
      )}

      {expenses.length > 0 && (
        <>
          <div className="mt-4 pt-3 border-t border-zinc-100">
            <div className="flex justify-between items-center">
              <span className="text-sm font-semibold text-zinc-700">Total Expenses</span>
              <span className="text-sm font-semibold text-red-600">{formatCurrency(totalExpenses)}</span>
            </div>
          </div>
          {budgets.length > 0 && (
            <div className="mt-2 space-y-1">
              {budgets.map((b) => {
                const spent = categoryTotals[b.category] || 0;
                const pct = b.monthlyLimit > 0 ? (spent / b.monthlyLimit) * 100 : 0;
                return (
                  <div key={b.id} className="flex justify-between text-xs text-zinc-500">
                    <span>{b.category}</span>
                    <span className={pct > 100 ? 'text-red-600 font-medium' : pct >= 80 ? 'text-amber-600 font-medium' : ''}>
                      {pct.toFixed(0)}% used
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </motion.section>
  );
}
