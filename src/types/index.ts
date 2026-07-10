import { ALL_CATEGORIES, EXPENSE_CATEGORIES, INCOME_CATEGORIES } from '@/constants';

export const CATEGORIES = ALL_CATEGORIES;

export type Category = (typeof ALL_CATEGORIES)[number];
export type ExpenseCategory = (typeof EXPENSE_CATEGORIES)[number];
export type IncomeCategory = (typeof INCOME_CATEGORIES)[number];

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string;
}

export interface Budget {
  id: string;
  category: Category;
  monthlyLimit: number;
}

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
  id: string;
  type: ToastType;
  message: string;
  undoAction?: () => void;
  undoLabel?: string;
}

export interface FilterState {
  search: string;
  type: 'all' | 'income' | 'expense';
  category: string;
  dateFrom: string;
  dateTo: string;
}
