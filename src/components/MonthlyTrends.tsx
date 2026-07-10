"use client";

import { motion } from "framer-motion";
import { MonthlyStats } from "@/types";

interface MonthlyTrendsProps {
  monthlyStats: MonthlyStats[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
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

function formatMonth(monthStr: string): string {
  const [year, month] = monthStr.split("-");
  const date = new Date(parseInt(year), parseInt(month) - 1);
  return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
}

function getChangeIndicator(current: number, previous: number): string {
  if (previous === 0) return "";
  const change = ((current - previous) / previous) * 100;
  const sign = change >= 0 ? "+" : "";
  return `${sign}${change.toFixed(1)}%`;
}

export default function MonthlyTrends({ monthlyStats }: MonthlyTrendsProps) {
  // Take last 6 months, sorted chronologically
  const recentMonths = monthlyStats.slice(-6);

  if (recentMonths.length < 2) {
    return (
      <motion.section
        aria-label="Monthly Trends"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">
          Monthly Trends
        </h2>
        <p className="text-zinc-500 text-center py-8 text-sm leading-relaxed">
          Keep tracking your transactions. Monthly trends will appear once you
          have at least 2 months of data.
        </p>
      </motion.section>
    );
  }

  const maxValue = Math.max(
    ...recentMonths.map((m) => Math.max(m.totalIncome, m.totalExpenses))
  );

  // Calculate overall savings rate from most recent month
  const latestMonth = recentMonths[recentMonths.length - 1];
  const savingsRate =
    latestMonth.totalIncome > 0
      ? ((latestMonth.totalIncome - latestMonth.totalExpenses) /
          latestMonth.totalIncome) *
        100
      : 0;

  return (
    <motion.section
      aria-label="Monthly Trends"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center justify-between mb-5">
        <h2 className="text-lg font-semibold text-zinc-800 tracking-tighter">
          Monthly Trends
        </h2>
        <div className="text-right">
          <p className="text-xs text-zinc-500">Savings Rate</p>
          <p
            className={`text-sm font-semibold ${
              savingsRate >= 0 ? "text-emerald-600" : "text-red-600"
            }`}
          >
            {savingsRate.toFixed(1)}%
          </p>
        </div>
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-4"
      >
        {recentMonths.map((stats, index) => {
          const incomeWidth =
            maxValue > 0 ? (stats.totalIncome / maxValue) * 100 : 0;
          const expenseWidth =
            maxValue > 0 ? (stats.totalExpenses / maxValue) * 100 : 0;

          const prevMonth = index > 0 ? recentMonths[index - 1] : null;
          const expenseChange = prevMonth
            ? getChangeIndicator(stats.totalExpenses, prevMonth.totalExpenses)
            : "";
          const incomeChange = prevMonth
            ? getChangeIndicator(stats.totalIncome, prevMonth.totalIncome)
            : "";

          return (
            <motion.div key={stats.month} variants={itemVariants}>
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-sm font-medium text-zinc-700">
                  {formatMonth(stats.month)}
                </span>
                <div className="flex gap-3 text-xs text-zinc-500">
                  {incomeChange && (
                    <span
                      className={
                        incomeChange.startsWith("+")
                          ? "text-emerald-600"
                          : "text-red-500"
                      }
                    >
                      Income {incomeChange}
                    </span>
                  )}
                  {expenseChange && (
                    <span
                      className={
                        expenseChange.startsWith("+")
                          ? "text-red-500"
                          : "text-emerald-600"
                      }
                    >
                      Expenses {expenseChange}
                    </span>
                  )}
                </div>
              </div>
              {/* Income bar */}
              <div className="flex items-center gap-2 mb-1">
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-emerald-500"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: incomeWidth / 100 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.2 + index * 0.05,
                    }}
                    style={{ transformOrigin: "left", width: "100%" }}
                  />
                </div>
                <span className="text-xs text-emerald-600 w-16 text-right whitespace-nowrap">
                  ${stats.totalIncome.toFixed(0)}
                </span>
              </div>
              {/* Expense bar */}
              <div className="flex items-center gap-2">
                <div className="w-full bg-zinc-100 rounded-full h-2 overflow-hidden">
                  <motion.div
                    className="h-2 rounded-full bg-zinc-400"
                    initial={{ scaleX: 0 }}
                    animate={{ scaleX: expenseWidth / 100 }}
                    transition={{
                      type: "spring",
                      stiffness: 100,
                      damping: 20,
                      delay: 0.25 + index * 0.05,
                    }}
                    style={{ transformOrigin: "left", width: "100%" }}
                  />
                </div>
                <span className="text-xs text-zinc-500 w-16 text-right whitespace-nowrap">
                  ${stats.totalExpenses.toFixed(0)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </motion.div>

      {/* Legend */}
      <div className="mt-4 pt-3 border-t border-zinc-100 flex gap-4">
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs text-zinc-500">Income</span>
        </div>
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-2 rounded-full bg-zinc-400" />
          <span className="text-xs text-zinc-500">Expenses</span>
        </div>
      </div>
    </motion.section>
  );
}
