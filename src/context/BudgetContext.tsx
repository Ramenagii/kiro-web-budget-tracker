"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";
import { Transaction, Budget, ToastMessage, CATEGORIES } from "@/types";
import { STORAGE_KEYS } from "@/constants";
import { isStorageNearQuota } from "@/utils/format";

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

function isValidBudget(entry: unknown): entry is Budget {
  if (typeof entry !== "object" || entry === null) return false;
  const obj = entry as Record<string, unknown>;
  return (
    typeof obj.id === "string" &&
    typeof obj.category === "string" &&
    (CATEGORIES as readonly string[]).includes(obj.category) &&
    typeof obj.monthlyLimit === "number" &&
    isFinite(obj.monthlyLimit)
  );
}

interface BudgetContextType {
  transactions: Transaction[];
  budgets: Budget[];
  isLoaded: boolean;
  toasts: ToastMessage[];
  addTransaction: (t: Transaction) => void;
  deleteTransaction: (id: string) => void;
  updateTransaction: (id: string, updated: Partial<Transaction>) => void;
  importTransactions: (txns: Transaction[]) => void;
  clearAll: () => void;
  setBudgets: (b: Budget[]) => void;
  dismissToast: (id: string) => void;
}

const BudgetContext = createContext<BudgetContextType | null>(null);

let toastCounter = 0;

export function BudgetProvider({ children }: { children: ReactNode }) {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgetsState] = useState<Budget[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = useCallback((message: string, type: ToastMessage['type'] = 'info', undoAction?: () => void, undoLabel?: string) => {
    const id = `toast-${++toastCounter}`;
    setToasts((prev) => [...prev, { id, type, message, undoAction, undoLabel }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 4000);
  }, []);

  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEYS.TRANSACTIONS);
      if (stored) {
        const parsed: unknown = JSON.parse(stored);
        if (Array.isArray(parsed)) {
          setTransactions(parsed.filter(isValidTransaction));
        }
      }
      const budgetStored = localStorage.getItem(STORAGE_KEYS.BUDGETS);
      if (budgetStored) {
        const parsed: unknown = JSON.parse(budgetStored);
        if (Array.isArray(parsed)) {
          setBudgetsState(parsed.filter(isValidBudget));
        }
      }
    } catch (error) {
      console.error("Error loading from localStorage:", error);
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
      if (isStorageNearQuota()) {
        addToast('Storage is nearly full. Export your data to avoid losing it.', 'error');
      }
    } catch {
      addToast('Failed to save data. Storage may be full.', 'error');
    }
  }, [transactions, isLoaded, addToast]);

  useEffect(() => {
    if (!isLoaded) return;
    try {
      localStorage.setItem(STORAGE_KEYS.BUDGETS, JSON.stringify(budgets));
    } catch {
      /* silently fail */
    }
  }, [budgets, isLoaded]);

  const addTransaction = useCallback((t: Transaction) => {
    setTransactions((prev) => [...prev, t]);
    addToast(`${t.type === 'income' ? 'Income' : 'Expense'} added`, 'success');
  }, [addToast]);

  const deleteTransaction = useCallback((id: string) => {
    const deleted = transactions.find((t) => t.id === id);
    if (!deleted) return;
    setTransactions((prev) => prev.filter((t) => t.id !== id));
    addToast('Transaction deleted', 'info', () => {
      setTransactions((prev) => [...prev, deleted]);
      addToast('Transaction restored', 'success');
    }, 'Undo');
  }, [transactions, addToast]);

  const updateTransaction = useCallback((id: string, updated: Partial<Transaction>) => {
    setTransactions((prev) => prev.map((t) => (t.id === id ? { ...t, ...updated } : t)));
    addToast('Transaction updated', 'success');
  }, [addToast]);

  const importTransactions = useCallback((txns: Transaction[]) => {
    setTransactions((prev) => {
      const existingIds = new Set(prev.map((t) => t.id));
      const newOnes = txns.filter((t) => !existingIds.has(t.id));
      return [...prev, ...newOnes];
    });
    addToast(`${txns.length} transaction${txns.length !== 1 ? 's' : ''} imported`, 'success');
  }, [addToast]);

  const clearAll = useCallback(() => {
    setTransactions([]);
    setBudgetsState([]);
    addToast('All data cleared', 'info');
  }, [addToast]);

  const setBudgets = useCallback((b: Budget[]) => {
    setBudgetsState(b);
    addToast('Budgets saved', 'success');
  }, [addToast]);

  return (
    <BudgetContext.Provider value={{
      transactions, budgets, isLoaded, toasts,
      addTransaction, deleteTransaction, updateTransaction,
      importTransactions, clearAll, setBudgets, dismissToast,
    }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const ctx = useContext(BudgetContext);
  if (!ctx) throw new Error('useBudget must be used within BudgetProvider');
  return ctx;
}
