"use client";

import { motion } from "framer-motion";
import { TransactionFilters as FiltersType, CATEGORIES } from "@/types";

interface TransactionFiltersProps {
  filters: FiltersType;
  onChange: (filters: FiltersType) => void;
}

const defaultFilters: FiltersType = {
  searchQuery: "",
  categoryFilter: "all",
  typeFilter: "all",
  dateRange: null,
  sortBy: "date",
  sortOrder: "desc",
};

export default function TransactionFilters({
  filters,
  onChange,
}: TransactionFiltersProps) {
  const hasActiveFilters =
    filters.searchQuery !== "" ||
    filters.categoryFilter !== "all" ||
    filters.typeFilter !== "all" ||
    filters.dateRange !== null ||
    filters.sortBy !== "date" ||
    filters.sortOrder !== "desc";

  const handleClear = () => {
    onChange(defaultFilters);
  };

  return (
    <motion.section
      aria-label="Transaction Filters"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-4 mb-4"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex flex-col gap-3">
        {/* Row 1: Search + Type Toggle + Clear */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Search */}
          <div className="relative flex-1">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-zinc-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth={2}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            <input
              type="text"
              placeholder="Search transactions..."
              value={filters.searchQuery}
              onChange={(e) =>
                onChange({ ...filters, searchQuery: e.target.value })
              }
              className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
            />
          </div>

          {/* Type Toggle */}
          <div
            className="flex rounded-lg overflow-hidden border border-zinc-200 shrink-0"
            role="group"
            aria-label="Filter by type"
          >
            {(["all", "income", "expense"] as const).map((t) => (
              <button
                key={t}
                type="button"
                onClick={() => onChange({ ...filters, typeFilter: t })}
                aria-pressed={filters.typeFilter === t}
                className={`px-3 py-2 text-xs font-medium transition-colors ${
                  filters.typeFilter === t
                    ? t === "income"
                      ? "bg-emerald-500 text-white"
                      : t === "expense"
                      ? "bg-red-500 text-white"
                      : "bg-zinc-700 text-white"
                    : "bg-zinc-50 text-zinc-600 hover:bg-zinc-100"
                }`}
              >
                {t.charAt(0).toUpperCase() + t.slice(1)}
              </button>
            ))}
          </div>
        </div>

        {/* Row 2: Category + Date Range + Sort */}
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center">
          {/* Category */}
          <select
            value={filters.categoryFilter}
            onChange={(e) =>
              onChange({
                ...filters,
                categoryFilter: e.target.value as FiltersType["categoryFilter"],
              })
            }
            className="px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          >
            <option value="all">All Categories</option>
            {CATEGORIES.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          {/* Date Range */}
          <div className="flex items-center gap-2">
            <input
              type="date"
              value={filters.dateRange?.start || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  dateRange: e.target.value
                    ? {
                        start: e.target.value,
                        end: filters.dateRange?.end || "",
                      }
                    : filters.dateRange?.end
                    ? { start: "", end: filters.dateRange.end }
                    : null,
                })
              }
              className="px-2 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
              aria-label="Start date"
            />
            <span className="text-xs text-zinc-400">to</span>
            <input
              type="date"
              value={filters.dateRange?.end || ""}
              onChange={(e) =>
                onChange({
                  ...filters,
                  dateRange: e.target.value
                    ? {
                        start: filters.dateRange?.start || "",
                        end: e.target.value,
                      }
                    : filters.dateRange?.start
                    ? { start: filters.dateRange.start, end: "" }
                    : null,
                })
              }
              className="px-2 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
              aria-label="End date"
            />
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2 shrink-0">
            <select
              value={filters.sortBy}
              onChange={(e) =>
                onChange({
                  ...filters,
                  sortBy: e.target.value as FiltersType["sortBy"],
                })
              }
              className="px-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
              aria-label="Sort by"
            >
              <option value="date">Sort by Date</option>
              <option value="amount">Sort by Amount</option>
            </select>
            <button
              type="button"
              onClick={() =>
                onChange({
                  ...filters,
                  sortOrder: filters.sortOrder === "asc" ? "desc" : "asc",
                })
              }
              className="p-2 border border-zinc-300 rounded-lg hover:bg-zinc-100 transition-colors bg-white/80"
              aria-label={`Sort ${filters.sortOrder === "asc" ? "descending" : "ascending"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-4 w-4 text-zinc-600 transition-transform ${
                  filters.sortOrder === "asc" ? "rotate-180" : ""
                }`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>
          </div>
        </div>

        {/* Clear Filters */}
        {hasActiveFilters && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ type: "spring", stiffness: 100, damping: 20 }}
          >
            <button
              type="button"
              onClick={handleClear}
              className="text-xs font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
            >
              Clear all filters
            </button>
          </motion.div>
        )}
      </div>
    </motion.section>
  );
}
