"use client";

export default function Header() {
  return (
    <header className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight">
          Budget Tracker
        </h1>
        <p className="mt-1 text-indigo-100 text-sm sm:text-base">
          Track your income and expenses with ease
        </p>
      </div>
    </header>
  );
}
