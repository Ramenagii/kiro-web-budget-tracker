"use client";

import { motion } from "framer-motion";
import { useBudget } from "@/context/BudgetContext";
import Header from "@/components/Header";
import MonthlyReport from "@/components/MonthlyReport";
import CategoryBreakdown from "@/components/CategoryBreakdown";

export default function ReportsPage() {
  const { transactions, budgets, isLoaded } = useBudget();

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
        </div>
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="h-96 rounded-2xl bg-white/60 animate-shimmer" />
            <div className="h-96 rounded-2xl bg-white/60 animate-shimmer" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Header
        title="Reports"
        subtitle="Monthly overview and category breakdown"
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <MonthlyReport transactions={transactions} />
          <CategoryBreakdown transactions={transactions} budgets={budgets} />
        </div>
      </motion.main>
    </div>
  );
}
