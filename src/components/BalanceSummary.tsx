"use client";

import { Transaction } from "@/types";

interface BalanceSummaryProps {
  transactions: Transaction[];
}

export default function BalanceSummary({ transactions }: BalanceSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <section aria-label="Balance Summary" className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Total Income
        </h2>
        <p className="mt-2 text-2xl font-bold text-green-600">
          +${totalIncome.toFixed(2)}
        </p>
      </article>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Total Expenses
        </h2>
        <p className="mt-2 text-2xl font-bold text-red-600">
          -${totalExpenses.toFixed(2)}
        </p>
      </article>

      <article className="bg-white rounded-xl shadow-sm border border-gray-100 p-5">
        <h2 className="text-sm font-medium text-gray-500 uppercase tracking-wide">
          Net Balance
        </h2>
        <p
          className={`mt-2 text-2xl font-bold ${
            netBalance >= 0 ? "text-green-600" : "text-red-600"
          }`}
        >
          {netBalance >= 0 ? "+" : "-"}${Math.abs(netBalance).toFixed(2)}
        </p>
      </article>
    </section>
  );
}
