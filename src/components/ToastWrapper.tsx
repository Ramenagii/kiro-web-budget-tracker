"use client";

import { useBudget } from "@/context/BudgetContext";
import ToastContainer from "@/components/Toast";

export function ToastWrapper() {
  const { toasts, dismissToast } = useBudget();
  return <ToastContainer toasts={toasts} onDismiss={dismissToast} />;
}
