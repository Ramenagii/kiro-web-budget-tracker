"use client";

import { useState, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction, CATEGORIES, Category } from "@/types";

interface DataManagerProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
}

function generateId(): string {
  if (typeof crypto !== "undefined" && typeof crypto.randomUUID === "function") {
    return crypto.randomUUID();
  }
  return `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 11)}`;
}

function escapeCSV(value: string): string {
  if (value.includes(",") || value.includes('"') || value.includes("\n")) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

function parseCSVLine(line: string): string[] {
  const result: string[] = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      if (inQuotes && i + 1 < line.length && line[i + 1] === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === "," && !inQuotes) {
      result.push(current.trim());
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim());
  return result;
}

function validateRow(fields: string[]): Transaction | null {
  if (fields.length < 5) return null;

  const [date, type, amountStr, category, description, recurringStr, intervalStr] = fields;

  // Validate date (YYYY-MM-DD format)
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) return null;

  // Validate type
  if (type !== "income" && type !== "expense") return null;

  // Validate amount
  const amount = parseFloat(amountStr);
  if (isNaN(amount) || amount <= 0) return null;

  // Validate category
  if (!(CATEGORIES as readonly string[]).includes(category)) return null;

  // Description can be empty but must exist
  const desc = description || "";

  // Optional recurring fields
  const recurring = recurringStr === "true";
  const validIntervals = ["weekly", "biweekly", "monthly"];
  const recurringInterval =
    recurring && intervalStr && validIntervals.includes(intervalStr)
      ? (intervalStr as "weekly" | "biweekly" | "monthly")
      : undefined;

  return {
    id: generateId(),
    date,
    type: type as "income" | "expense",
    amount,
    category: category as Category,
    description: desc,
    recurring: recurring || undefined,
    recurringInterval,
  };
}

export default function DataManager({
  transactions,
  onImport,
}: DataManagerProps) {
  const [importPreview, setImportPreview] = useState<{
    valid: Transaction[];
    invalidCount: number;
  } | null>(null);
  const [importError, setImportError] = useState("");
  const [exportSuccess, setExportSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleExport = () => {
    const headers = [
      "date",
      "type",
      "amount",
      "category",
      "description",
      "recurring",
      "recurringInterval",
    ];
    const rows = transactions.map((t) => [
      t.date,
      t.type,
      t.amount.toString(),
      t.category,
      escapeCSV(t.description),
      t.recurring ? "true" : "false",
      t.recurringInterval || "",
    ]);

    const csv = [headers.join(","), ...rows.map((r) => r.join(","))].join("\n");
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `budget-tracker-export-${new Date().toISOString().split("T")[0]}.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);

    setExportSuccess(true);
    setTimeout(() => setExportSuccess(false), 3000);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    setImportError("");
    setImportPreview(null);

    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.name.endsWith(".csv")) {
      setImportError("Please select a .csv file");
      return;
    }

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const text = event.target?.result as string;
        if (!text || text.trim().length === 0) {
          setImportError("File is empty");
          return;
        }

        const lines = text.trim().split("\n");
        // Skip header if it matches expected pattern
        let startIndex = 0;
        if (lines.length > 0) {
          const firstLine = lines[0].toLowerCase();
          if (firstLine.includes("date") && firstLine.includes("type")) {
            startIndex = 1;
          }
        }

        const valid: Transaction[] = [];
        let invalidCount = 0;

        for (let i = startIndex; i < lines.length; i++) {
          const line = lines[i].trim();
          if (!line) continue;

          const fields = parseCSVLine(line);
          const transaction = validateRow(fields);
          if (transaction) {
            valid.push(transaction);
          } else {
            invalidCount++;
          }
        }

        if (valid.length === 0 && invalidCount === 0) {
          setImportError("No data rows found in file");
          return;
        }

        setImportPreview({ valid, invalidCount });
      } catch {
        setImportError("Failed to parse file. Ensure it is valid CSV format.");
      }
    };

    reader.onerror = () => {
      setImportError("Failed to read file");
    };

    reader.readAsText(file);
  };

  const handleConfirmImport = () => {
    if (importPreview && importPreview.valid.length > 0) {
      onImport(importPreview.valid);
      setImportPreview(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    }
  };

  const handleCancelImport = () => {
    setImportPreview(null);
    setImportError("");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <motion.section
      aria-label="Data Management"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 100, damping: 20 }}
      className="space-y-6"
    >
      {/* Export Section */}
      <div
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-zinc-800 mb-3 tracking-tighter">
          Export Data
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Download all your transactions as a CSV file for backup or use in
          other applications.
        </p>
        <div className="flex items-center gap-3">
          <button
            onClick={handleExport}
            disabled={transactions.length === 0}
            className="px-4 py-2.5 text-sm font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Export CSV ({transactions.length} transactions)
          </button>
          <AnimatePresence>
            {exportSuccess && (
              <motion.span
                initial={{ opacity: 0, x: -8 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0 }}
                className="text-sm text-emerald-600"
              >
                Downloaded successfully
              </motion.span>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Import Section */}
      <div
        className="rounded-2xl bg-white/60 backdrop-blur-md border border-white/10 shadow-lg shadow-zinc-200/50 p-5"
        style={{ boxShadow: "inset 0 1px 0 rgba(255,255,255,0.1)" }}
      >
        <h2 className="text-lg font-semibold text-zinc-800 mb-3 tracking-tighter">
          Import Data
        </h2>
        <p className="text-sm text-zinc-500 mb-4">
          Import transactions from a CSV file. Expected columns: date, type,
          amount, category, description, recurring, recurringInterval.
        </p>

        <input
          ref={fileInputRef}
          type="file"
          accept=".csv"
          onChange={handleFileSelect}
          className="block w-full text-sm text-zinc-500 file:mr-3 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-sm file:font-medium file:bg-emerald-50 file:text-emerald-700 hover:file:bg-emerald-100 file:cursor-pointer file:transition-colors"
        />

        {importError && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-3 text-sm text-red-500"
          >
            {importError}
          </motion.p>
        )}

        <AnimatePresence>
          {importPreview && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mt-4 p-4 rounded-xl bg-white/60 border border-zinc-200"
            >
              <h3 className="text-sm font-medium text-zinc-700 mb-2">
                Import Preview
              </h3>
              <div className="flex gap-4 text-sm mb-3">
                <span className="text-emerald-600">
                  {importPreview.valid.length} valid rows
                </span>
                {importPreview.invalidCount > 0 && (
                  <span className="text-red-500">
                    {importPreview.invalidCount} invalid rows (will be skipped)
                  </span>
                )}
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleConfirmImport}
                  disabled={importPreview.valid.length === 0}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-emerald-500 text-white hover:bg-emerald-600 transition-colors disabled:opacity-50"
                >
                  Confirm Import
                </button>
                <button
                  onClick={handleCancelImport}
                  className="px-4 py-2 text-sm font-medium rounded-xl bg-zinc-100 text-zinc-700 hover:bg-zinc-200 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.section>
  );
}
