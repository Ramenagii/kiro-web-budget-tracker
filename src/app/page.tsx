"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { Transaction, TransactionFilters as FiltersType, BudgetGoal, MonthlyStats, CATEGORIES } from "@/types";
import { generateId } from "@/lib/utils";
import Header from "@/components/Header";
import BalanceSummary from "@/components/BalanceSummary";
import TransactionForm from "@/components/TransactionForm";
import TransactionList from "@/components/TransactionList";
import TransactionFilters from "@/components/TransactionFilters";
import CategoryBreakdown from "@/components/CategoryBreakdown";
import TabNavigation, { TabId } from "@/components/TabNavigation";
import BudgetGoals from "@/components/BudgetGoals";
import MonthlyTrends from "@/components/MonthlyTrends";
import DataManager from "@/components/DataManager";

const STORAGE_KEY = "budget-tracker-transactions";
const GOALS_STORAGE_KEY = "budget-tracker-goals";

const defaultFilters: FiltersType = {
  searchQuery: "",
  categoryFilter: "all",
  typeFilter: "all",
  dateRange: null,
  sortBy: "date",
  sortOrder: "desc",
};

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

function isValidBudgetGoal(entry: unknown): entry is BudgetGoal {
  if (typeof entry !== "object" || entry === null) return false;
  const obj = entry as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    (obj.category === "overall" ||
      (typeof obj.category === "string" &&
        (CATEGORIES as readonly string[]).includes(obj.category))) &&
    typeof obj.monthlyLimit === "number" &&
    isFinite(obj.monthlyLimit) &&
    obj.monthlyLimit > 0 &&
    typeof obj.createdAt === "string"
  );
}

function addInterval(dateStr: string, interval: "weekly" | "biweekly" | "monthly"): string {
  const date = new Date(dateStr);
  switch (interval) {
    case "weekly":
      date.setDate(date.getDate() + 7);
      break;
    case "biweekly":
      date.setDate(date.getDate() + 14);
      break;
    case "monthly":
      date.setMonth(date.getMonth() + 1);
      break;
  }
  return date.toISOString().split("T")[0];
}

function computeMonthlyStats(transactions: Transaction[]): MonthlyStats[] {
  const monthMap = new Map<string, MonthlyStats>();

  for (const t of transactions) {
    const month = t.date.slice(0, 7); // YYYY-MM
    if (!monthMap.has(month)) {
      monthMap.set(month, {
        month,
        totalIncome: 0,
        totalExpenses: 0,
        netSavings: 0,
        categoryBreakdown: {},
      });
    }
    const stats = monthMap.get(month)!;
    if (t.type === "income") {
      stats.totalIncome += t.amount;
    } else {
      stats.totalExpenses += t.amount;
      stats.categoryBreakdown[t.category] =
        (stats.categoryBreakdown[t.category] || 0) + t.amount;
    }
    stats.netSavings = stats.totalIncome - stats.totalExpenses;
  }

  return Array.from(monthMap.values()).sort((a, b) =>
    a.month.localeCompare(b.month)
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
  const [budgetGoals, setBudgetGoals] = useState<BudgetGoal[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [filters, setFilters] = useState<FiltersType>(defaultFilters);
  const [activeTab, setActiveTab] = useState<TabId>("transactions");

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

    try {
      const storedGoals = localStorage.getItem(GOALS_STORAGE_KEY);
      if (storedGoals) {
        const parsed: unknown = JSON.parse(storedGoals);
        if (Array.isArray(parsed)) {
          const valid = parsed.filter(isValidBudgetGoal);
          setBudgetGoals(valid);
        }
      }
    } catch (error) {
      console.error("Error loading budget goals from localStorage:", error);
    }

    setIsLoaded(true);
  }, []);

  // Save transactions to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(transactions));
      } catch (error) {
        console.error("Error saving transactions to localStorage:", error);
      }
    }
  }, [transactions, isLoaded]);

  // Save budget goals to localStorage
  useEffect(() => {
    if (isLoaded) {
      try {
        localStorage.setItem(GOALS_STORAGE_KEY, JSON.stringify(budgetGoals));
      } catch (error) {
        console.error("Error saving budget goals to localStorage:", error);
      }
    }
  }, [budgetGoals, isLoaded]);

  // Recurring transaction auto-generation
  useEffect(() => {
    if (!isLoaded) return;

    const today = new Date().toISOString().split("T")[0];
    const recurringTransactions = transactions.filter(
      (t) => t.recurring && t.recurringInterval
    );

    if (recurringTransactions.length === 0) return;

    const newTransactions: Transaction[] = [];

    for (const recurring of recurringTransactions) {
      if (!recurring.recurringInterval) continue;

      // Find the latest transaction with the same description, category, amount, and type
      const relatedTransactions = transactions.filter(
        (t) =>
          t.description === recurring.description &&
          t.category === recurring.category &&
          t.amount === recurring.amount &&
          t.type === recurring.type
      );

      const latestDate = relatedTransactions.reduce((latest, t) => {
        return t.date > latest ? t.date : latest;
      }, recurring.date);

      // Generate new transactions up to today, capped at 50 per recurring entry
      const MAX_GENERATED_PER_RECURRING = 50;
      let generated = 0;
      let nextDate = addInterval(latestDate, recurring.recurringInterval);
      while (nextDate <= today && generated < MAX_GENERATED_PER_RECURRING) {
        // Check if this date already has a transaction
        const exists = [...transactions, ...newTransactions].some(
          (t) =>
            t.date === nextDate &&
            t.description === recurring.description &&
            t.category === recurring.category &&
            t.amount === recurring.amount &&
            t.type === recurring.type
        );

        if (!exists) {
          newTransactions.push({
            id: generateId(),
            type: recurring.type,
            amount: recurring.amount,
            category: recurring.category,
            description: recurring.description,
            date: nextDate,
            recurring: true,
            recurringInterval: recurring.recurringInterval,
          });
        }
        generated++;
        nextDate = addInterval(nextDate, recurring.recurringInterval);
      }
    }

    if (newTransactions.length > 0) {
      setTransactions((prev) => [...prev, ...newTransactions]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isLoaded]);

  // Filtered and sorted transactions
  const filteredTransactions = useMemo(() => {
    let result = [...transactions];

    // Search filter
    if (filters.searchQuery) {
      const query = filters.searchQuery.toLowerCase();
      result = result.filter((t) =>
        t.description.toLowerCase().includes(query)
      );
    }

    // Category filter
    if (filters.categoryFilter !== "all") {
      result = result.filter((t) => t.category === filters.categoryFilter);
    }

    // Type filter
    if (filters.typeFilter !== "all") {
      result = result.filter((t) => t.type === filters.typeFilter);
    }

    // Date range filter
    if (filters.dateRange) {
      const { start, end } = filters.dateRange;
      if (start) {
        result = result.filter((t) => t.date >= start);
      }
      if (end) {
        result = result.filter((t) => t.date <= end);
      }
    }

    // Sort
    result.sort((a, b) => {
      let comparison = 0;
      if (filters.sortBy === "date") {
        comparison = new Date(a.date).getTime() - new Date(b.date).getTime();
      } else {
        comparison = a.amount - b.amount;
      }
      return filters.sortOrder === "asc" ? comparison : -comparison;
    });

    return result;
  }, [transactions, filters]);

  // Computed monthly stats
  const monthlyStats = useMemo(
    () => computeMonthlyStats(transactions),
    [transactions]
  );

  const handleAddTransaction = (transaction: Transaction) => {
    setTransactions((prev) => [...prev, transaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions((prev) => prev.filter((t) => t.id !== id));
  };

  const handleEditTransaction = useCallback(
    (id: string, updates: Partial<Transaction>) => {
      setTransactions((prev) =>
        prev.map((t) => (t.id === id ? { ...t, ...updates } : t))
      );
    },
    []
  );

  const handleAddGoal = (goal: BudgetGoal) => {
    setBudgetGoals((prev) => [...prev, goal]);
  };

  const handleDeleteGoal = (id: string) => {
    setBudgetGoals((prev) => prev.filter((g) => g.id !== id));
  };

  const handleImportTransactions = (imported: Transaction[]) => {
    setTransactions((prev) => [...prev, ...imported]);
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

        <TabNavigation activeTab={activeTab} onChange={setActiveTab} />

        {activeTab === "transactions" && (
          <motion.div
            key="transactions"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              <div className="lg:col-span-1 space-y-8">
                <TransactionForm onAddTransaction={handleAddTransaction} />
                <CategoryBreakdown transactions={transactions} />
              </div>
              <div className="lg:col-span-2">
                <TransactionFilters filters={filters} onChange={setFilters} />
                <TransactionList
                  transactions={filteredTransactions}
                  onDeleteTransaction={handleDeleteTransaction}
                  onEditTransaction={handleEditTransaction}
                />
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "insights" && (
          <motion.div
            key="insights"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <BudgetGoals
                goals={budgetGoals}
                transactions={transactions}
                onAddGoal={handleAddGoal}
                onDeleteGoal={handleDeleteGoal}
              />
              <MonthlyTrends monthlyStats={monthlyStats} />
            </div>
          </motion.div>
        )}

        {activeTab === "data" && (
          <motion.div
            key="data"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <div className="max-w-2xl">
              <DataManager
                transactions={transactions}
                onImport={handleImportTransactions}
              />
            </div>
          </motion.div>
        )}
      </motion.main>
    </div>
  );
}
