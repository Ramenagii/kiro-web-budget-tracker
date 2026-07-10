"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/types";
import { formatCurrency } from "@/utils/format";

interface BalanceSummaryProps {
  transactions: Transaction[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.1 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { type: "spring", stiffness: 100, damping: 20 },
  },
};

export default function BalanceSummary({ transactions }: BalanceSummaryProps) {
  const totalIncome = transactions
    .filter((t) => t.type === "income")
    .reduce((sum, t) => sum + t.amount, 0);

  const totalExpenses = transactions
    .filter((t) => t.type === "expense")
    .reduce((sum, t) => sum + t.amount, 0);

  const netBalance = totalIncome - totalExpenses;

  return (
    <motion.section
      aria-label="Balance Summary"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-1 md:grid-cols-2 gap-4"
    >
      <motion.article
        variants={itemVariants}
        whileHover={{ scale: 1.01 }}
        transition={{ type: "spring", stiffness: 100, damping: 20 }}
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-6 flex flex-col justify-center"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
          Net Balance
        </h2>
        <p
          className={`mt-3 text-4xl font-bold tracking-tighter ${
            netBalance >= 0 ? "text-emerald-600" : "text-red-600"
          }`}
        >
          {netBalance >= 0 ? "+" : "-"}{formatCurrency(Math.abs(netBalance))}
        </p>
      </motion.article>

      <div className="flex flex-col gap-4">
        <motion.article
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
            Total Income
          </h2>
          <p className="mt-2 text-2xl font-bold text-emerald-600 tracking-tighter">
            {formatCurrency(totalIncome)}
          </p>
        </motion.article>

        <motion.article
          variants={itemVariants}
          whileHover={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 100, damping: 20 }}
          className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
          style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
        >
          <h2 className="text-sm font-medium text-zinc-500 uppercase tracking-wide">
            Total Expenses
          </h2>
          <p className="mt-2 text-2xl font-bold text-red-600 tracking-tighter">
            {formatCurrency(totalExpenses)}
          </p>
        </motion.article>
      </div>
    </motion.section>
  );
}
