"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

interface MonthlyReportProps {
  transactions: Transaction[];
}

interface MonthData {
  label: string;
  income: number;
  expense: number;
  net: number;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function getYearOptions(transactions: Transaction[]): number[] {
  const years = new Set(transactions.map((t) => new Date(t.date).getFullYear()));
  if (years.size === 0) years.add(new Date().getFullYear());
  return Array.from(years).sort((a, b) => b - a);
}

export default function MonthlyReport({ transactions }: MonthlyReportProps) {
  const yearOptions = useMemo(() => getYearOptions(transactions), [transactions]);
  const [selectedYear, setSelectedYear] = useState(yearOptions[0] || new Date().getFullYear());

  const monthlyData = useMemo(() => {
    const data: MonthData[] = MONTHS.map((label, i) => ({
      label,
      income: 0,
      expense: 0,
      net: 0,
    }));

    transactions
      .filter((t) => new Date(t.date).getFullYear() === selectedYear)
      .forEach((t) => {
        const month = new Date(t.date).getMonth();
        if (t.type === 'income') {
          data[month].income += t.amount;
        } else {
          data[month].expense += t.amount;
        }
      });

    data.forEach((d) => { d.net = d.income - d.expense; });
    return data;
  }, [transactions, selectedYear]);

  const maxVal = Math.max(
    ...monthlyData.map((d) => Math.max(d.income, d.expense, 1))
  );

  const totalIncome = monthlyData.reduce((s, d) => s + d.income, 0);
  const totalExpense = monthlyData.reduce((s, d) => s + d.expense, 0);
  const netTotal = totalIncome - totalExpense;

  if (transactions.length === 0) return null;

  return (
    <motion.section
      aria-label="Monthly Report"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-zinc-800 tracking-tighter">Monthly Overview</h2>
        <select
          value={selectedYear}
          onChange={(e) => setSelectedYear(Number(e.target.value))}
          className="px-2 py-1 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 outline-none bg-white/80"
        >
          {yearOptions.map((y) => (
            <option key={y} value={y}>{y}</option>
          ))}
        </select>
      </div>

      <div className="grid grid-cols-3 gap-2 mb-4">
        <div className="bg-emerald-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-emerald-600 font-medium uppercase tracking-wide">Income</p>
          <p className="text-sm font-bold text-emerald-700">{formatCurrency(totalIncome)}</p>
        </div>
        <div className="bg-red-50 rounded-lg p-2 text-center">
          <p className="text-[10px] text-red-600 font-medium uppercase tracking-wide">Expenses</p>
          <p className="text-sm font-bold text-red-700">{formatCurrency(totalExpense)}</p>
        </div>
        <div className={`rounded-lg p-2 text-center ${netTotal >= 0 ? 'bg-emerald-50' : 'bg-red-50'}`}>
          <p className="text-[10px] font-medium uppercase tracking-wide text-zinc-500">Net</p>
          <p className={`text-sm font-bold ${netTotal >= 0 ? 'text-emerald-700' : 'text-red-700'}`}>{formatCurrency(netTotal)}</p>
        </div>
      </div>

      <div className="space-y-2">
        {monthlyData.map((d, i) => {
          if (d.income === 0 && d.expense === 0) return null;
          const incomePct = (d.income / maxVal) * 100;
          const expensePct = (d.expense / maxVal) * 100;
          return (
            <div key={d.label} className="group relative">
              <div className="flex items-center gap-2 mb-0.5">
                <span className="text-xs font-medium text-zinc-500 w-7">{d.label}</span>
                <div className="flex-1 h-4 bg-zinc-100 rounded-full overflow-hidden flex">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(expensePct, 2)}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.03 }}
                    className="h-full bg-red-400 rounded-full"
                    title={`Expenses: ${formatCurrency(d.expense)}`}
                  />
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.max(incomePct, 2)}%` }}
                    transition={{ type: "spring", stiffness: 80, damping: 20, delay: i * 0.03 }}
                    className="h-full bg-emerald-400 rounded-full ml-0.5"
                    title={`Income: ${formatCurrency(d.income)}`}
                  />
                </div>
              </div>
              <div className="opacity-0 group-hover:opacity-100 absolute -top-8 left-1/2 -translate-x-1/2 bg-zinc-800 text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap transition-opacity pointer-events-none z-10">
                {d.label}: +{formatCurrency(d.income)} / -{formatCurrency(d.expense)}
              </div>
            </div>
          );
        })}
      </div>
    </motion.section>
  );
}
