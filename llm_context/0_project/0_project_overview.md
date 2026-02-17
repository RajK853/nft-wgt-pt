# Project Overview

## NFT Weingarten Penalty Tracker

A **client-side React web application** that tracks penalty shoot-out statistics for the NFT Weingarten team. It records shooter and goalkeeper performance, calculates time-weighted scores, and presents leaderboards and visualisations.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime & Package Manager | **Bun** |
| Build Tool | **Vite 7** |
| UI Framework | **React 19** (CSR only — no SSR) |
| Routing | **React Router v6** |
| Styling | **Tailwind CSS 4** (via `@tailwindcss/vite`) + **CSS Modules** |
| UI Primitives | **Radix UI** + **CVA** (class-variance-authority) |
| Data Visualisation | **Recharts** |
| Backend | **Supabase** (PostgreSQL + Auth) |
| Language | **TypeScript 5** |
| Testing | **Vitest** + **React Testing Library** |
| Deployment | **Vercel** |

> ⚠️ This is a **pure CSR app**. There are no server components, server actions, or SSR patterns. Do not apply Next.js patterns here.

---

## Key Features

- Record and view penalty shoot-out events (shooter vs. keeper outcomes)
- Time-weighted scoring algorithm (exponential decay, 45-day half-life)
- Player and keeper leaderboards, hall-of-fame records
- Dashboard with charts (bar, line, pie) and data tables
- Supabase-backed auth with a mock-data fallback for unauthenticated users
- Google Sheets import script for historical data

---

## Commands

```bash
bun run dev       # Start dev server on port 3000
bun run build     # Production build
bun run preview   # Preview production build
bun run lint      # ESLint check
bun test          # Run Vitest tests
```

---

## Environment Variables

Accessed via `import.meta.env` (Vite convention — never `Bun.env` in browser code):

```bash
VITE_SUPABASE_URL=...
VITE_SUPABASE_ANON_KEY=...
```

Legacy `NEXT_PUBLIC_*` keys are supported as a fallback in `src/lib/supabase.ts`.
