# App Structure

This project uses **React Router v6** for client-side routing inside a **Vite** CSR app. There is no Next.js App Router, no `app/` directory, no `layout.tsx`, and no server components.

---

## Directory Layout

```
/
├── src/
│   ├── main.tsx              # Vite entry point — mounts <App /> into #root
│   ├── App.tsx               # Root component: BrowserRouter + Routes + Suspense
│   ├── pages/                # Route-level page components (co-located *.module.css)
│   │   ├── Home.tsx / Home.module.css
│   │   ├── Dashboard.tsx / Dashboard.module.css
│   │   ├── ScoringMethod.tsx / ScoringMethod.module.css
│   │   ├── PlayerPerformance.tsx / PlayerPerformance.module.css
│   │   ├── KeeperPerformance.tsx
│   │   └── Login.tsx / Login.module.css
│   ├── components/
│   │   ├── ui/               # Reusable UI primitives (button, card, input, tabs…)
│   │   ├── charts/           # Chart components (BarChart, LineChart, PieChart)
│   │   ├── layout/           # Header, PageLayout
│   │   ├── ErrorBoundary.tsx
│   │   └── ProtectedRoute.tsx
│   ├── hooks/                # Custom React hooks (usePenaltyData, useTheme)
│   ├── lib/                  # supabase.ts, utils.ts, scoring.ts, analysis.ts, validation.ts
│   ├── services/             # Data service layer (Supabase queries, mock data)
│   ├── auth/                 # AuthContext.tsx (React Context + hook)
│   ├── types/                # TypeScript type definitions (index.ts)
│   └── styles/               # globals.css (Tailwind base + CSS custom properties)
├── public/                   # Static assets (logo, SVGs)
├── scripts/                  # Node/Bun utility scripts (Google Sheets import)
├── docs/                     # Developer documentation
├── llm_context/              # LLM context files (this directory)
├── plans/                    # Implementation plan documents
├── index.html                # Vite HTML entry point
├── vite.config.ts            # Vite + React + Tailwind plugin config
├── vercel.json               # Vercel deployment config (SPA rewrites)
└── package.json
```

---

## Routing

Routes are defined in `src/App.tsx` using React Router v6:

```tsx
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { lazy, Suspense } from 'react'

const Dashboard = lazy(() => import('./pages/Dashboard'))

<BrowserRouter>
  <Routes>
    <Route path="/" element={<Home />} />
    <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
    <Route path="/scoring" element={<ScoringMethod />} />
    <Route path="/login" element={<Login />} />
  </Routes>
</BrowserRouter>
```

- Use `<Link to="/path">` from `react-router-dom` — **never** `next/link`
- Use `useNavigate()` for programmatic navigation — **never** `useRouter()`
- `vercel.json` rewrites all routes to `index.html` for SPA behaviour

---

## Page Conventions

Each page consists of two co-located files:

```
src/pages/
├── PageName.tsx        # Default-exported React component
└── PageName.module.css # Scoped CSS Module styles
```

Pages are lazy-loaded via `React.lazy` and wrapped in `<Suspense>` in `App.tsx`.

---

## Environment Variables

Use `import.meta.env.VITE_*` — this is Vite's browser-safe env access:

```ts
const url = import.meta.env.VITE_SUPABASE_URL
```

Variables must be prefixed with `VITE_` to be exposed to the browser.
