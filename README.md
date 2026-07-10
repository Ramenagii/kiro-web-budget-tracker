# Kiro Budget Tracker

A personal budget tracker built with Next.js 14, TypeScript, and Tailwind CSS. All data is stored locally in your browser.

## Features

- **Track income & expenses** — Add, edit, and delete transactions
- **Categorize transactions** — Expense categories (Food, Transport, Entertainment, Bills, Shopping, Health, Other) and Income categories (Salary, Freelance, Investments, Gifts, Refunds)
- **Monthly reports** — Visual bar charts showing income vs expenses per month
- **Budget limits** — Set monthly spending caps per category with visual warnings
- **Search & filter** — By keyword, type, category, and date range
- **Export/import data** — JSON and CSV formats with import preview
- **Undo delete** — Accidental deletion protection
- **Keyboard shortcuts** — `Cmd/Ctrl+K` to search, `Cmd/Ctrl+N` to add transaction
- **Responsive design** — Mobile-first layout
- **Real-time updates** — All changes saved instantly to localStorage

## Getting Started

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Build

```bash
npm run build
```

Outputs a static site to the `out/` directory.

## Tech Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS 3
- Framer Motion
- localStorage
