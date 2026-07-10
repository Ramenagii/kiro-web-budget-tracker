"use client";

import { motion, AnimatePresence } from "framer-motion";
import { ToastMessage } from "@/types";

interface ToastContainerProps {
  toasts: ToastMessage[];
  onDismiss: (id: string) => void;
}

export default function ToastContainer({ toasts, onDismiss }: ToastContainerProps) {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map((toast) => (
          <motion.div
            key={toast.id}
            layout
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.95 }}
            transition={{ type: "spring", stiffness: 200, damping: 25 }}
            className={`pointer-events-auto rounded-xl p-4 shadow-lg border backdrop-blur-md ${
              toast.type === 'success'
                ? 'bg-emerald-50 border-emerald-200 text-emerald-800'
                : toast.type === 'error'
                ? 'bg-red-50 border-red-200 text-red-800'
                : 'bg-zinc-50 border-zinc-200 text-zinc-800'
            }`}
          >
            <div className="flex items-center justify-between gap-3">
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <div className="flex items-center gap-2 shrink-0">
                {toast.undoAction && (
                  <button
                    onClick={toast.undoAction}
                    className="text-xs font-semibold uppercase tracking-wide text-emerald-600 hover:text-emerald-700 transition-colors"
                  >
                    {toast.undoLabel || 'Undo'}
                  </button>
                )}
                <button
                  onClick={() => onDismiss(toast.id)}
                  className="text-current opacity-50 hover:opacity-100 transition-opacity"
                  aria-label="Dismiss"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
