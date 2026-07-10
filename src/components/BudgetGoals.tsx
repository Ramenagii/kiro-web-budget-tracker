"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BudgetGoal, Category, CATEGORIES, Transaction } from "@/types";

interface BudgetGoalsProps {
  goals: BudgetGoal[];
  transactions: Transaction[];
  onAddGoal: (goal: BudgetGoal) => void;
  onDeleteGoal: (id: string) => void;
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
  exit: {
    opacity: 0,
    x: -20,
    transition: { duration: 0.2 },
  },
};

function getCurrentMonthSpending(
  transactions: Transaction[],
  category: Category | "overall"
): number {
  const now = new Date();
  const currentMonth = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  const monthExpenses = transactions.filter(
    (t) => t.type === "expense" && t.date.startsWith(currentMonth)
  );

  if (category === "overall") {
    return monthExpenses.reduce((sum, t) => sum + t.amount, 0);
  }

  return monthExpenses
    .filter((t) => t.category === category)
    .reduce((sum, t) => sum + t.amount, 0);
}

function getProgressColor(percentage: number): string {
  if (percentage > 90) return "bg-red-500";
  if (percentage > 75) return "bg-amber-500";
  return "bg-emerald-500";
}

function getProgressTextColor(percentage: number): string {
  if (percentage > 90) return "text-red-600";
  if (percentage > 75) return "text-amber-600";
  return "text-emerald-600";
}

export default function BudgetGoals({
  goals,
  transactions,
  onAddGoal,
  onDeleteGoal,
}: BudgetGoalsProps) {
  const [category, setCategory] = useState<Category | "overall">("overall");
  const [amount, setAmount] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    const limit = parseFloat(amount);
    if (!limit || limit <= 0) {
      setError("Enter a valid amount greater than 0");
      return;
    }

    // Check for duplicate category goal
    const existing = goals.find((g) => g.category === category);
    if (existing) {
      setError(`A goal for ${category === "overall" ? "overall spending" : category} already exists`);
      return;
    }

    const goal: BudgetGoal = {
      id:
        typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
          ? crypto.randomUUID()
          : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`,
      category,
      monthlyLimit: limit,
      createdAt: new Date().toISOString(),
    };

    onAddGoal(goal);
    setAmount("");
    setCategory("overall");
  };

  return (
    <motion.section
      aria-label="Budget Goals"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
        Budget Goals
      </h2>

      {/* Add Goal Form */}
      <form onSubmit={handleSubmit} className="mb-5">
        <div className="flex gap-2 flex-wrap">
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value as Category | "overall")}
            className="flex-1 min-w-[120px] px-3 py-2 text-sm rounded-xl bg-white/80 border border-zinc-200 text-zinc-700 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          >
            <option value="overall">Overall</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Monthly limit"
            min="0"
            step="0.01"
            className="flex-1 min-w-[120px] px-3 py-2 text-sm rounded-xl bg-white/80 border border-zinc-200 text-zinc-700 placeholder:text-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/30 focus:border-emerald-400"
          />
          <button
            type="submit"
            className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors"
          >
            Add
          </button>
        </div>
        {error && (
          <p className="mt-2 text-xs text-red-500">{error}</p>
        )}
      </form>

      {/* Goals List */}
      {goals.length === 0 ? (
        <p className="text-zinc-500 text-center py-6 text-sm leading-relaxed">
          No budget goals set yet. Add a goal to track your spending limits.
        </p>
      ) : (
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="space-y-3"
        >
          <AnimatePresence mode="popLayout">
            {goals.map((goal) => {
              const spent = getCurrentMonthSpending(transactions, goal.category);
              const percentage = Math.min((spent / goal.monthlyLimit) * 100, 100);
              const rawPercentage = (spent / goal.monthlyLimit) * 100;
              const exceeded = rawPercentage > 100;

              return (
                <motion.div
                  key={goal.id}
                  variants={itemVariants}
                  exit="exit"
                  layout
                  className="relative p-3 rounded-xl bg-white/40 border border-zinc-100"
                >
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <span className="text-sm font-medium text-zinc-700">
                        {goal.category === "overall" ? "Overall" : goal.category}
                      </span>
                      <span className="ml-2 text-xs text-zinc-400">
                        ${spent.toFixed(2)} / ${goal.monthlyLimit.toFixed(2)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      {exceeded && (
                        <motion.span
                          animate={{ opacity: [1, 0.4, 1] }}
                          transition={{ repeat: Infinity, duration: 1.5 }}
                          className="text-xs font-medium text-red-600"
                        >
                          Exceeded
                        </motion.span>
                      )}
                      <span
                        className={`text-xs font-semibold ${getProgressTextColor(rawPercentage)}`}
                      >
                        {rawPercentage.toFixed(0)}%
                      </span>
                      <button
                        onClick={() => onDeleteGoal(goal.id)}
                        className="text-zinc-400 hover:text-red-500 transition-colors"
                        aria-label={`Delete ${goal.category} goal`}
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
                            d="M6 18L18 6M6 6l12 12"
                          />
                        </svg>
                      </button>
                    </div>
                  </div>
                  <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                    <motion.div
                      className={`h-2 rounded-full ${getProgressColor(rawPercentage)}`}
                      initial={{ scaleX: 0 }}
                      animate={{ scaleX: percentage / 100 }}
                      transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: 0.1,
                      }}
                      style={{ transformOrigin: "left", width: "100%" }}
                    />
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </motion.div>
      )}
    </motion.section>
  );
}
