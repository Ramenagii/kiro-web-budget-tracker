"use client";

import { motion } from "framer-motion";

export type TabId = "transactions" | "insights" | "data";

interface Tab {
  id: TabId;
  label: string;
}

const tabs: Tab[] = [
  { id: "transactions", label: "Transactions" },
  { id: "insights", label: "Insights" },
  { id: "data", label: "Data" },
];

interface TabNavigationProps {
  activeTab: TabId;
  onChange: (tab: TabId) => void;
}

export default function TabNavigation({
  activeTab,
  onChange,
}: TabNavigationProps) {
  return (
    <motion.nav
      aria-label="Main Navigation"
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-1.5 mb-8"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex gap-1">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => onChange(tab.id)}
            className={`relative flex-1 px-4 py-2.5 text-sm font-medium rounded-xl transition-colors ${
              activeTab === tab.id
                ? "text-emerald-700"
                : "text-zinc-500 hover:text-zinc-700"
            }`}
          >
            {activeTab === tab.id && (
              <motion.div
                layoutId="activeTab"
                className="absolute inset-0 rounded-xl bg-emerald-50 border border-emerald-200/50"
                transition={{ type: "spring", stiffness: 100, damping: 20 }}
              />
            )}
            <span className="relative z-10">{tab.label}</span>
          </button>
        ))}
      </div>
    </motion.nav>
  );
}
