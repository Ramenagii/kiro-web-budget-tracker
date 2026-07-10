"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Transaction, CATEGORIES } from "@/types";
import Header from "@/components/Header";
import BalanceSummary from "@/components/BalanceSummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import CategoryBreakdown from "@/components/CategoryBreakdown";

const STORAGE_KEY = "budget-tracker-transactions";

function isValidTransaction(entry: unknown): entry is Transaction {
  if (typeof entry !== "object" || entry === null) return false;
  const obj = entry as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    (obj.type === "income" || obj.type === "expense") &&
    typeof obj.amount === "number" &&
    isFinite(obj.amount) &&
    typeof obj.category === "string" &&
    (CATEGORIES as readonly string[]).includes(obj.category) &&
    typeof obj.description === "string" &&
    typeof obj.date === "string"
  );
}

function LoadingSkeleton() {
  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <div className="border-b border-zinc-200 bg-white/80 backdrop-blur-md">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="h-8 w-48 rounded-lg animate-shimmer" />
          <div className="h-4 w-72 rounded mt-2 animate-shimmer" />
        </div>
      </div>
      <main className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <div className="rounded-2xl bg-white/60 p-6 h-32">
            <div className="h-4 w-24 rounded mb-3 animate-shimmer" />
            <div className="h-10 w-40 rounded animate-shimmer" />
          </div>
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl bg-white/60 p-5">
              <div className="h-4 w-24 rounded mb-2 animate-shimmer" />
              <div className="h-8 w-32 rounded animate-shimmer" />
            </div>
            <div className="rounded-2xl bg-white/60 p-5">
              <div className="h-4 w-24 rounded mb-2 animate-shimmer" />
              <div className="h-8 w-32 rounded animate-shimmer" />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-1 space-y-8">
            <div className="rounded-2xl bg-white/60 p-5 h-96 animate-shimmer" />
          </div>
          <div className="lg:col-span-2">
            <div className="rounded-2xl bg-white/60 p-5 h-96 animate-shimmer" />
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Home() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isValidTransaction);
          setTransactions(valid);
        }
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
    return <LoadingSkeleton />;
  }

  return (
    <div className="min-h-[100dvh] bg-zinc-50">
      <Header />
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
      </motion.main>
    </div>
  );
}
