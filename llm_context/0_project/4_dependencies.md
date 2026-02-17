# Dependencies

All packages are managed by **Bun**. Use `bun add <pkg>` / `bun add -D <pkg>`.

---

## Runtime Dependencies

| Package | Purpose |
|---------|---------|
| `react` `react-dom` | React 19 UI framework |
| `react-router-dom` | Client-side routing (v6) |
| `@supabase/supabase-js` | Supabase client (auth + database) |
| `recharts` | Data visualisation (bar, line, pie charts) |
| `@radix-ui/react-*` | Headless UI primitives (select, dialog, tabs, tooltip, avatar, checkbox, dropdown-menu, separator, slot, label, scroll-area) |
| `class-variance-authority` | CVA — typed component variants |
| `clsx` | Conditional className utility |
| `tailwind-merge` | Merge Tailwind classes without conflicts |
| `lucide-react` | Icon library |
| `framer-motion` | Animation library |
| `react-katex` `katex` | LaTeX math rendering |
| `papaparse` | CSV parsing |
| `@headlessui/react` | Additional headless UI components |
| `@heroicons/react` | Heroicons icon set |
| `dotenv` | Environment variable loading (scripts only) |
| `googleapis` `google-auth-library` `@googleapis/sheets` | Google Sheets API (import scripts) |

---

## Dev Dependencies

| Package | Purpose |
|---------|---------|
| `vite` | Build tool and dev server |
| `@vitejs/plugin-react` | Vite React plugin |
| `tailwindcss` `@tailwindcss/vite` | Tailwind CSS 4 with Vite plugin |
| `typescript` | TypeScript compiler |
| `eslint` `eslint-plugin-react` | Linting (ESLint v9 flat config) |
| `vitest` | Unit test runner |
| `@testing-library/react` `@testing-library/jest-dom` | React component testing |
| `terser` | JS minifier for production builds |

---

## Not in This Project

The following are **NOT used** — do not suggest or add them:

- `next` / Next.js — project uses Vite
- `@supabase/ssr` / `@supabase/auth-helpers-nextjs` — SSR-only packages
- `prettier` — not configured; ESLint handles style
- `shadcn/ui` CLI — components are hand-crafted with Radix UI + CSS Modules
- `react-hook-form` / `zod` — not currently used
- `npm` / `yarn` / `pnpm` — project uses Bun exclusively
