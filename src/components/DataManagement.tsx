"use client";

import { useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Transaction } from "@/types";

interface DataManagementProps {
  transactions: Transaction[];
  onImport: (transactions: Transaction[]) => void;
  onClearAll: () => void;
}

function exportAsJson(data: unknown, filename: string) {
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function exportAsCsv(transactions: Transaction[]) {
  const header = 'id,type,amount,category,description,date';
  const rows = transactions.map((t) =>
    `"${t.id}","${t.type}",${t.amount},"${t.category}","${t.description.replace(/"/g, '""')}","${t.date}"`
  );
  const csv = [header, ...rows].join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `budget-tracker-export-${new Date().toISOString().split('T')[0]}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function DataManagement({ transactions, onImport, onClearAll }: DataManagementProps) {
  const [showMenu, setShowMenu] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [importPreview, setImportPreview] = useState<Transaction[] | null>(null);
  const [importError, setImportError] = useState('');
  const [showConfirmClear, setShowConfirmClear] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  const handleExportJson = () => {
    exportAsJson(transactions, `budget-tracker-export-${new Date().toISOString().split('T')[0]}.json`);
    setShowMenu(false);
  };

  const handleExportCsv = () => {
    exportAsCsv(transactions);
    setShowMenu(false);
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImportError('');
    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const content = event.target?.result as string;
        if (file.name.endsWith('.csv')) {
          const lines = content.split('\n').filter((l) => l.trim());
          const parsed: Transaction[] = [];
          for (let i = 1; i < lines.length; i++) {
            const vals = lines[i].split(',').map((v) => v.replace(/^"|"$/g, ''));
            if (vals.length >= 6) {
              parsed.push({
                id: vals[0],
                type: vals[1] as 'income' | 'expense',
                amount: parseFloat(vals[2]) || 0,
                category: vals[3] as Transaction['category'],
                description: vals[4],
                date: vals[5],
              });
            }
          }
          setImportPreview(parsed);
        } else {
          const parsed = JSON.parse(content);
          if (Array.isArray(parsed)) {
            setImportPreview(parsed as Transaction[]);
          } else if (parsed.transactions && Array.isArray(parsed.transactions)) {
            setImportPreview(parsed.transactions as Transaction[]);
          } else {
            setImportError('File does not contain valid transaction data.');
          }
        }
        setShowImportModal(true);
      } catch {
        setImportError('Failed to parse file. Make sure it is valid JSON or CSV.');
      }
    };
    reader.readAsText(file);
    if (fileRef.current) fileRef.current.value = '';
  };

  const confirmImport = () => {
    if (importPreview) {
      onImport(importPreview);
      setShowImportModal(false);
      setImportPreview(null);
      setShowMenu(false);
    }
  };

  const handleClearAll = () => {
    onClearAll();
    setShowConfirmClear(false);
    setShowMenu(false);
  };

  return (
    <>
      <div className="relative">
        <motion.button
          whileTap={{ scale: 0.97 }}
          onClick={() => setShowMenu(!showMenu)}
          className="w-full py-2 px-4 text-sm font-medium bg-zinc-100 text-zinc-700 rounded-lg hover:bg-zinc-200 transition-colors"
        >
          Data
        </motion.button>

        <AnimatePresence>
          {showMenu && (
            <motion.div
              initial={{ opacity: 0, y: -8, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -8, scale: 0.95 }}
              className="absolute bottom-full mb-2 left-0 right-0 bg-white rounded-xl shadow-xl border border-zinc-200 p-2 space-y-1"
            >
              <button onClick={handleExportJson} className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">Export as JSON</button>
              <button onClick={handleExportCsv} className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">Export as CSV</button>
              <button onClick={() => { fileRef.current?.click(); setShowMenu(false); }} className="w-full text-left px-3 py-2 text-sm text-zinc-700 hover:bg-zinc-50 rounded-lg transition-colors">Import from file</button>
              <hr className="border-zinc-100" />
              <button onClick={() => { setShowConfirmClear(true); }} className="w-full text-left px-3 py-2 text-sm text-red-600 hover:bg-red-50 rounded-lg transition-colors">Clear all data</button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <input ref={fileRef} type="file" accept=".json,.csv" onChange={handleFileSelect} className="hidden" />

      <AnimatePresence>
        {showImportModal && importPreview && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex items-center justify-center p-4 bg-black/20 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) { setShowImportModal(false); setImportPreview(null); } }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl bg-white shadow-xl border border-zinc-200 p-6 w-full max-w-md"
            >
              <h2 className="text-lg font-semibold text-zinc-800 mb-2 tracking-tighter">Import Preview</h2>
              <p className="text-sm text-zinc-500 mb-4">
                {importPreview.length} transaction{importPreview.length !== 1 ? 's' : ''} found. This will add to your existing data.
              </p>
              <div className="max-h-48 overflow-y-auto mb-4 space-y-1">
                {importPreview.slice(0, 20).map((t) => (
                  <div key={t.id} className="flex items-center gap-2 text-xs text-zinc-600">
                    <span className={`w-2 h-2 rounded-full ${t.type === 'income' ? 'bg-emerald-400' : 'bg-red-400'}`} />
                    <span className="font-medium">{t.category}</span>
                    <span className="text-zinc-400">-</span>
                    <span>{t.description || 'No description'}</span>
                  </div>
                ))}
                {importPreview.length > 20 && (
                  <p className="text-xs text-zinc-400 pt-1">...and {importPreview.length - 20} more</p>
                )}
              </div>
              {importError && <p className="text-sm text-red-600 mb-4">{importError}</p>}
              <div className="flex gap-3">
                <button onClick={() => { setShowImportModal(false); setImportPreview(null); }} className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm">Cancel</button>
                <button onClick={confirmImport} className="flex-1 py-2.5 px-4 bg-emerald-600 text-white font-medium rounded-lg hover:bg-emerald-700 transition-colors text-sm">Import</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showConfirmClear && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/30 backdrop-blur-sm"
            onClick={(e) => { if (e.target === e.currentTarget) setShowConfirmClear(false); }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="rounded-2xl bg-white shadow-xl border border-red-200 p-6 w-full max-w-sm text-center"
            >
              <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-red-100 flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-red-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
              </div>
              <h2 className="text-lg font-semibold text-zinc-800 mb-2">Clear All Data?</h2>
              <p className="text-sm text-zinc-500 mb-6">This permanently deletes all transactions and budgets. This cannot be undone.</p>
              <div className="flex gap-3">
                <button onClick={() => setShowConfirmClear(false)} className="flex-1 py-2.5 px-4 bg-zinc-100 text-zinc-700 font-medium rounded-lg hover:bg-zinc-200 transition-colors text-sm">Cancel</button>
                <button onClick={handleClearAll} className="flex-1 py-2.5 px-4 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700 transition-colors text-sm">Delete All</button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
