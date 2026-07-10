"use client";

import { Transaction } from "@/types";

interface TransactionListProps {
  transactions: Transaction[];
  onDeleteTransaction: (id: string) => void;
}

export default function TransactionList({
  transactions,
  onDeleteTransaction,
}: TransactionListProps) {
  if (transactions.length === 0) {
    return (
      <section aria-label="Transaction List" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Transactions
        </h2>
        <p className="text-gray-500 text-center py-8">
          No transactions yet. Add one to get started!
        </p>
      </section>
    );
  }

  const sortedTransactions = [...transactions].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <section aria-label="Transaction List" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Transactions ({transactions.length})
      </h2>
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {sortedTransactions.map((transaction) => (
          <article
            key={transaction.id}
            className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors"
          >
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span
                  className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-medium ${
                    transaction.type === "income"
                      ? "bg-green-100 text-green-700"
                      : "bg-red-100 text-red-700"
                  }`}
                >
                  {transaction.type}
                </span>
                <span className="text-xs text-gray-500">
                  {transaction.category}
                </span>
              </div>
              <p className="text-sm text-gray-700 truncate">
                {transaction.description || "No description"}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                {transaction.date}
              </p>
            </div>
            <div className="flex items-center gap-3 ml-3">
              <span
                className={`text-sm font-semibold whitespace-nowrap ${
                  transaction.type === "income"
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {transaction.type === "income" ? "+" : "-"}$
                {transaction.amount.toFixed(2)}
              </span>
              <button
                onClick={() => onDeleteTransaction(transaction.id)}
                className="p-1.5 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded transition-colors"
                aria-label={`Delete transaction: ${transaction.description || transaction.category}`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                  />
                </svg>
              </button>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
