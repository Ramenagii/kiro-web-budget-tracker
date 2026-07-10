"use client";

import { motion } from "framer-motion";
import { useBudget } from "@/context/BudgetContext";
import Header from "@/components/Header";
import BalanceSummary from "@/components/BalanceSummary";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import Link from "next/link";

export default function Dashboard() {
  const { transactions, budgets, isLoaded } = useBudget();

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-4 w-72 rounded mt-2 animate-shimmer" />
        </div>
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="rounded-2xl bg-white/60 p-6 h-32 animate-shimmer" />
        </main>
      </div>
    );
  }

  const now = new Date();
  const monthName = now.toLocaleString('default', { month: 'long' });

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Header
        title="Dashboard"
        subtitle={`${monthName} · ${transactions.length} transaction${transactions.length !== 1 ? 's' : ''}`}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="mb-8">
          <BalanceSummary transactions={transactions} />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <CategoryBreakdown transactions={transactions} budgets={budgets} />
          </div>

          <div className="space-y-4">
            <Link
              href="/transactions"
              className="block rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5 hover:bg-white/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-zinc-800 tracking-tighter">Manage Transactions</h3>
              <p className="mt-1 text-xs text-zinc-500">Add, edit, search, and filter your transactions.</p>
            </Link>
            <Link
              href="/reports"
              className="block rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5 hover:bg-white/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-zinc-800 tracking-tighter">View Reports</h3>
              <p className="mt-1 text-xs text-zinc-500">Monthly breakdowns and spending insights.</p>
            </Link>
            <Link
              href="/settings"
              className="block rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5 hover:bg-white/80 transition-colors"
            >
              <h3 className="text-sm font-semibold text-zinc-800 tracking-tighter">Settings</h3>
              <p className="mt-1 text-xs text-zinc-500">Budget limits, export, import, and data management.</p>
            </Link>
          </div>
        </div>
      </motion.main>
    </div>
  );
}
