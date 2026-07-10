"use client";

import { motion } from "framer-motion";
import { Transaction } from "@/types";

interface HeaderProps {
  title: string;
  subtitle?: string;
  transactions?: Transaction[];
}

export default function Header({ title, subtitle, transactions }: HeaderProps) {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-6"
    >
      <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-zinc-900">
        {title}
      </h1>
      {subtitle && (
        <p className="mt-1 text-zinc-500 text-sm sm:text-base leading-relaxed">
          {subtitle}
        </p>
      )}
    </motion.header>
  );
}
