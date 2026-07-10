"use client";

import { motion } from "framer-motion";
import { useBudget } from "@/context/BudgetContext";
import Header from "@/components/Header";
import BudgetSettings from "@/components/BudgetSettings";
import DataManagement from "@/components/DataManagement";

export default function SettingsPage() {
  const { transactions, budgets, setBudgets, importTransactions, clearAll, isLoaded } = useBudget();

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
        </div>
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="max-w-lg h-96 rounded-2xl bg-white/60 animate-shimmer" />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Header
        title="Settings"
        subtitle="Budget limits, export, import, and data management"
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="max-w-lg space-y-6">
          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
            className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">Budget Limits</h2>
            <p className="text-xs text-zinc-500 mb-4">Set monthly spending limits per expense category.</p>
            <BudgetSettings budgets={budgets} onSave={setBudgets} />
          </motion.section>

          <motion.section
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
            className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
            style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
          >
            <h2 className="text-lg font-semibold text-zinc-800 mb-4 tracking-tighter">Data Management</h2>
            <p className="text-xs text-zinc-500 mb-4">Export your data as JSON or CSV, import from a file, or clear all data.</p>
            <DataManagement
              transactions={transactions}
              onImport={importTransactions}
              onClearAll={clearAll}
            />
          </motion.section>
        </div>
      </motion.main>
    </div>
  );
}
