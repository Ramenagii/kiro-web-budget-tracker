"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useBudget } from "@/context/BudgetContext";
import { Transaction, FilterState } from "@/types";
import Header from "@/components/Header";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import SearchFilter from "@/components/SearchFilter";
import EditTransactionModal from "@/components/EditTransactionModal";

export default function TransactionsPage() {
  const { transactions, addTransaction, deleteTransaction, updateTransaction, isLoaded } = useBudget();
  const [filters, setFilters] = useState<FilterState>({
    search: '', type: 'all', category: '', dateFrom: '', dateTo: '',
  });
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [formFocusTrigger, setFormFocusTrigger] = useState(0);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'n' && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setFormFocusTrigger((prev) => prev + 1);
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  const filteredTransactions = transactions.filter((t) => {
    if (filters.type !== 'all' && t.type !== filters.type) return false;
    if (filters.category && t.category !== filters.category) return false;
    if (filters.dateFrom && t.date < filters.dateFrom) return false;
    if (filters.dateTo && t.date > filters.dateTo) return false;
    if (filters.search) {
      const q = filters.search.toLowerCase();
      if (!t.description.toLowerCase().includes(q) && !t.category.toLowerCase().includes(q)) return false;
    }
    return true;
  });

  if (!isLoaded) {
    return (
      <div className="min-h-[100dvh] bg-zinc-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
        </div>
        <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="h-96 rounded-2xl bg-white/60 animate-shimmer" />
            <div className="lg:col-span-2 h-96 rounded-2xl bg-white/60 animate-shimmer" />
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Header
        title="Transactions"
        subtitle={`${transactions.length} total · ${filteredTransactions.length} shown`}
      />
      <motion.main
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ type: "spring", stiffness: 100, damping: 20, delay: 0.1 }}
        className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8"
      >
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-6">
            <TransactionForm onAddTransaction={addTransaction} focusTrigger={formFocusTrigger} />
            <SearchFilter filters={filters} onChange={setFilters} resultCount={filteredTransactions.length} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList
              transactions={filteredTransactions}
              onDeleteTransaction={deleteTransaction}
              onEditTransaction={setEditingTransaction}
            />
          </div>
        </div>
      </motion.main>

      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          onSave={updateTransaction}
          onClose={() => setEditingTransaction(null)}
        />
      )}
    </div>
  );
}
