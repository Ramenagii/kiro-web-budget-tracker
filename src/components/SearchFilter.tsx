"use client";

import { motion } from "framer-motion";
import { FilterState, CATEGORIES } from "@/types";

interface SearchFilterProps {
  filters: FilterState;
  onChange: (filters: FilterState) => void;
  resultCount: number;
}

export default function SearchFilter({ filters, onChange, resultCount }: SearchFilterProps) {
  const set = (partial: Partial<FilterState>) => onChange({ ...filters, ...partial });

  const hasActiveFilters = filters.search || filters.type !== 'all' || filters.category || filters.dateFrom || filters.dateTo;

  return (
    <motion.section
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
      style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
    >
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-sm font-semibold text-zinc-800 tracking-tighter">Filters</h2>
        {resultCount >= 0 && (
          <span className="text-xs text-zinc-400">{resultCount} result{resultCount !== 1 ? 's' : ''}</span>
        )}
      </div>

      <div className="space-y-3">
        <div className="relative">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
          </svg>
          <input
            type="text"
            id="search"
            value={filters.search}
            onChange={(e) => set({ search: e.target.value })}
            placeholder="Search transactions..."
            className="w-full pl-9 pr-3 py-2 text-sm border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none transition-shadow bg-white/80"
          />
        </div>

        <div className="flex gap-1.5" role="group" aria-label="Filter by type">
          {(['all', 'income', 'expense'] as const).map((t) => (
            <button
              key={t}
              onClick={() => set({ type: t })}
              className={`flex-1 py-1.5 text-xs font-medium rounded-md transition-colors capitalize ${
                filters.type === t
                  ? t === 'all' ? 'bg-zinc-800 text-white'
                    : t === 'income' ? 'bg-emerald-500 text-white'
                    : 'bg-red-500 text-white'
                  : 'bg-zinc-100 text-zinc-600 hover:bg-zinc-200'
              }`}
            >
              {t}
            </button>
          ))}
        </div>

        <div className="grid grid-cols-2 gap-2">
          <div>
            <label htmlFor="filter-category" className="block text-xs font-medium text-zinc-500 mb-1">Category</label>
            <select
              id="filter-category"
              value={filters.category}
              onChange={(e) => set({ category: e.target.value })}
              className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
            >
              <option value="">All</option>
              {CATEGORIES.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>
          <div className="flex gap-2">
            <div className="flex-1">
              <label htmlFor="filter-from" className="block text-xs font-medium text-zinc-500 mb-1">From</label>
              <input
                type="date"
                id="filter-from"
                value={filters.dateFrom}
                onChange={(e) => set({ dateFrom: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
              />
            </div>
            <div className="flex-1">
              <label htmlFor="filter-to" className="block text-xs font-medium text-zinc-500 mb-1">To</label>
              <input
                type="date"
                id="filter-to"
                value={filters.dateTo}
                onChange={(e) => set({ dateTo: e.target.value })}
                className="w-full px-2 py-1.5 text-xs border border-zinc-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none bg-white/80"
              />
            </div>
          </div>
        </div>

        {hasActiveFilters && (
          <button
            onClick={() => onChange({ search: '', type: 'all', category: '', dateFrom: '', dateTo: '' })}
            className="text-xs text-emerald-600 hover:text-emerald-700 font-medium transition-colors"
          >
            Clear all filters
          </button>
        )}
      </div>
    </motion.section>
  );
}
