import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { BudgetProvider } from "@/context/BudgetContext";
import Navigation from "@/components/Navigation";
import { ToastWrapper } from "@/components/ToastWrapper";

const inter = Inter({ subsets: ["latin"] });

export const metadata: Metadata = {
  title: "Budget Tracker",
  description: "A simple personal budget tracker to manage your income and expenses",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-zinc-50 min-h-[100dvh]`}>
        <BudgetProvider>
          <Navigation />
          <ToastWrapper />
          {children}
        </BudgetProvider>
      </body>
    </html>
  );
}
