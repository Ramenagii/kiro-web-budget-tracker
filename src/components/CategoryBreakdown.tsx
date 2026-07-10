"use client";

import { Transaction } from "@/types";

interface CategoryBreakdownProps {
  transactions: Transaction[];
}

export default function CategoryBreakdown({
  transactions,
}: CategoryBreakdownProps) {
  const expenses = transactions.filter((t) => t.type === "expense");

  if (expenses.length === 0) {
    return (
      <section aria-label="Category Breakdown" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Expense Breakdown
        </h2>
        <p className="text-gray-500 text-center py-8">
          No expenses to display yet.
        </p>
      </section>
    );
  }

  const categoryTotals: Record<string, number> = {};
  expenses.forEach((t) => {
    categoryTotals[t.category] = (categoryTotals[t.category] || 0) + t.amount;
  });

  const totalExpenses = expenses.reduce((sum, t) => sum + t.amount, 0);

  const sortedCategories = Object.entries(categoryTotals).sort(
    ([, a], [, b]) => b - a
  );

  const categoryColors: Record<string, string> = {
    Food: "bg-orange-500",
    Transport: "bg-blue-500",
    Entertainment: "bg-purple-500",
    Bills: "bg-yellow-500",
    Shopping: "bg-pink-500",
    Health: "bg-teal-500",
    Other: "bg-gray-500",
  };

  return (
    <section aria-label="Category Breakdown" className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
      <h2 className="text-lg font-semibold text-gray-800 mb-4">
        Expense Breakdown
      </h2>
      <div className="space-y-3">
        {sortedCategories.map(([category, amount]) => {
          const percentage = (amount / totalExpenses) * 100;
          return (
            <div key={category}>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm font-medium text-gray-700">
                  {category}
                </span>
                <span className="text-sm text-gray-500">
                  ${amount.toFixed(2)} ({percentage.toFixed(1)}%)
                </span>
              </div>
              <div className="w-full bg-gray-100 rounded-full h-2.5">
                <div
                  className={`h-2.5 rounded-full ${
                    categoryColors[category] || "bg-gray-500"
                  }`}
                  style={{ width: `${percentage}%` }}
                ></div>
              </div>
            </div>
          );
        })}
      </div>
      <div className="mt-4 pt-3 border-t border-gray-100">
        <div className="flex justify-between items-center">
          <span className="text-sm font-semibold text-gray-700">
            Total Expenses
          </span>
          <span className="text-sm font-semibold text-red-600">
            ${totalExpenses.toFixed(2)}
          </span>
        </div>
      </div>
    </section>
  );
}
