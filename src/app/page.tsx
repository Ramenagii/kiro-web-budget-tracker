"use client";

import { useState, useEffect } from "react";
import { Transaction } from "@/types";
import Header from "@/components/Header";
import BalanceSummary from "@/components/BalanceSummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const STORAGE_KEY = "budget-tracker-transactions";

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setTransactions(JSON.parse(stored));
      }
    } catch (error) {
      console.error("Error loading transactions from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  // Save to localStorage when transactions change
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error("Error saving transactions to localStorage:", error);
      }
    }
  }, [transactions, isLoaded]);

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <BalanceSummary transactions={transactions} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <TransactionForm onAddTransaction={handleAddTransaction} />
            <CategoryBreakdown transactions={transactions} />
          </div>
          <div className="lg:col-span-2">
            <TransactionList
              transactions={transactions}
              onDeleteTransaction={handleDeleteTransaction}
            />
          </div>
        </div>
      </main>
    </div>
  );
}
