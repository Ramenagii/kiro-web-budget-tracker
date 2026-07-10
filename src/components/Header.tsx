"use client";

import { motion } from "framer-motion";

export default function Header() {
  return (
    <motion.header
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="border-b border-zinc-200 bg-white/80 backdrop-blur-md"
    >
      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tighter text-zinc-900">
          Budget Tracker
        </h1>
        <p className="mt-1 text-zinc-500 text-sm sm:text-base leading-relaxed">
          Track your income and expenses with ease
        </p>
      </div>
    </motion.header>
  );
}
