"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Budget, Category } from "@/types";
import { EXPENSE_CATEGORIES, CATEGORY_LABELS } from "@/constants";

interface BudgetSettingsProps {
  budgets: Budget[];
  onSave: (budgets: Budget[]) => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") return crypto.randomUUID();
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

export default function BudgetSettings({ budgets, onSave }: BudgetSettingsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [localBudgets, setLocalBudgets] = useState<Budget[]>(() =>
    EXPENSE_CATEGORIES.map((cat) => {
      const existing = budgets.find((b) => b.category === cat);
      return existing || { id: generateId(), category: cat as Category, monthlyLimit: 0 };
    })
  );

  const handleLimitChange = (category: string, value: string) => {
    const parsed = parseFloat(value) || 0;
    setLocalBudgets((prev) =>
      prev.map((b) => (b.category === category ? { ...b, monthlyLimit: parsed } : b))
    );
  };

  const handleSave = () => {
    const active = localBudgets.filter((b) => b.monthlyLimit > 0);
    onSave(active);
    setIsOpen(false);
  };

  const hasChanges = JSON.stringify(localBudgets) !== JSON.stringify(
    EXPENSE_CATEGORIES.map((cat) => {
      const existing = budgets.find((b) => b.category === cat);
      return existing || { id: generateId(), category: cat as Category, monthlyLimit: 0 };
    })
  );

  return (
    <>
      <motion.button
        whileTap={{ scale: 0.97 }}
        onClick={() => setIsOpen(true)}
        className="w-full py-2 px-4 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
      >
        Budget Limits
      </motion.button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setIsOpen(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 10 }}
              transition={{ type: "spring", stiffness: 200, damping: 25 }}
              className="rounded-2xl bg-white shadow-xl border border-zinc-200 p-6 w-full max-w-lg max-h-[80vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-zinc-800 tracking-tighter">Monthly Budget Limits</h2>
                <button onClick={() => setIsOpen(false)} className="p-1 text-zinc-400 hover:text-zinc-600 transition-colors" aria-label="Close">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
              <p className="text-xs text-zinc-500 mb-4">Set a monthly spending limit for each expense category. Leave at $0 for no limit.</p>

              <div className="space-y-3 mb-6">
                {localBudgets.map((b) => (
                  <div key={b.category} className="flex items-center gap-3">
                    <label htmlFor={`budget-${b.category}`} className="text-sm text-zinc-700 w-28 shrink-0">{CATEGORY_LABELS[b.category] || b.category}</label>
                    <div className="relative flex-1">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400 text-sm">$</span>
                      <input
                        type="number"
                        id={`budget-${b.category}`}
                        value={b.monthlyLimit || ''}
                        onChange={(e) => handleLimitChange(b.category, e.target.value)}
                        placeholder="0.00"
                        step="0.01"
                        min="0"
                        className="w-full pl-7 pr-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
                      />
                    </div>
                  </div>
                ))}
              </div>

              <div className="flex gap-3">
                <button onClick={() => setIsOpen(false)} className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm">Cancel</button>
                <button onClick={handleSave} className="flex-1 py-2.5 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">Save Budgets</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
