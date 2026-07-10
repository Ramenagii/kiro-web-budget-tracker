export const CATEGORIES = [
  'Food',
  'Transport',
  'Entertainment',
  'Bills',
  'Shopping',
  'Health',
  'Other',
] as const;

export type Category = (typeof CATEGORIES)[number];

export type RecurringInterval = 'weekly' | 'biweekly' | 'monthly';

export interface Transaction {
  id: string;
  type: 'income' | 'expense';
  amount: number;
  category: Category;
  description: string;
  date: string;
  recurring?: boolean;
  recurringInterval?: RecurringInterval;
}

export interface TransactionFilters {
  searchQuery: string;
  categoryFilter: Category | 'all';
  typeFilter: 'income' | 'expense' | 'all';
  dateRange: { start: string; end: string } | null;
  sortBy: 'date' | 'amount';
  sortOrder: 'asc' | 'desc';
}
