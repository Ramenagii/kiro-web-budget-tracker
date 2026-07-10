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

export interface BudgetGoal {
  id: string;
  category: Category | 'overall';
  monthlyLimit: number;
  createdAt: string;
}

export interface MonthlyStats {
  month: string;
  totalIncome: number;
  totalExpenses: number;
  netSavings: number;
  categoryBreakdown: Record<string, number>;
}
