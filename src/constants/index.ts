export const EXPENSE_CATEGORIES = ['Food', 'Transport', 'Entertainment', 'Bills', 'Shopping', 'Health', 'Other'] as const;

export const INCOME_CATEGORIES = ['Salary', 'Freelance', 'Investments', 'Gifts', 'Refunds', 'Other Income'] as const;

export const ALL_CATEGORIES = [...EXPENSE_CATEGORIES, ...INCOME_CATEGORIES] as const;

export const CATEGORY_COLORS: Record<string, string> = {
  Food: 'bg-emerald-500',
  Transport: 'bg-sky-500',
  Entertainment: 'bg-violet-500',
  Bills: 'bg-amber-500',
  Shopping: 'bg-rose-500',
  Health: 'bg-teal-500',
  Other: 'bg-zinc-400',
  Salary: 'bg-green-600',
  Freelance: 'bg-blue-500',
  Investments: 'bg-indigo-500',
  Gifts: 'bg-pink-400',
  Refunds: 'bg-cyan-500',
  'Other Income': 'bg-zinc-400',
};

export const CATEGORY_ICONS: Record<string, string> = {
  Food: '🍕',
  Transport: '🚗',
  Entertainment: '🎮',
  Bills: '📄',
  Shopping: '🛍️',
  Health: '💊',
  Other: '📌',
  Salary: '💰',
  Freelance: '💻',
  Investments: '📈',
  Gifts: '🎁',
  Refunds: '↩️',
  'Other Income': '📌',
};

export const CATEGORY_LABELS: Record<string, string> = {
  Food: 'Food',
  Transport: 'Transport',
  Entertainment: 'Entertainment',
  Bills: 'Bills',
  Shopping: 'Shopping',
  Health: 'Health',
  Other: 'Other',
  Salary: 'Salary',
  Freelance: 'Freelance',
  Investments: 'Investments',
  Gifts: 'Gifts',
  Refunds: 'Refunds',
  'Other Income': 'Other Income',
};

export const STORAGE_KEYS = {
  TRANSACTIONS: 'budget-tracker-transactions',
  BUDGETS: 'budget-tracker-budgets',
} as const;
