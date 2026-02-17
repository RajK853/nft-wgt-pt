# Component Design

This project uses **React 19 function components** with **Radix UI primitives**, **CSS Modules**, and **CVA** for variants. There is no shadcn/ui CLI — components are hand-crafted. All components are client-side (no server components).

---

## Component Categories

| Location | Purpose |
|----------|---------|
| `src/components/ui/` | Reusable UI primitives (Button, Card, Input, Tabs, etc.) |
| `src/components/charts/` | Chart wrappers (BarChart, LineChart, PieChart) |
| `src/components/layout/` | Header, PageLayout |
| `src/pages/` | Route-level page components |
| `src/auth/` | AuthContext, ProtectedRoute |

---

## 1. UI Primitive Pattern (Radix UI + CVA + CSS Modules)

UI components wrap Radix UI primitives and use **CVA** for type-safe variants:

```tsx
// src/components/ui/button.tsx
import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        outline: 'border border-input bg-background hover:bg-accent',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 px-3',
        lg: 'h-11 px-8',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button'
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />
  }
)
```

---

## 2. Page Component Pattern

Each page uses a co-located CSS Module for scoped styles:

```tsx
// src/pages/Example.tsx
import { useState } from 'react'
import { LoadingSpinner } from '@/components/ui'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import styles from './Example.module.css'

export default function Example() {
  const { data, loading, error } = usePenaltyData()

  if (loading) return <LoadingSpinner />
  if (error) return <div className={styles.error}>{error.message}</div>
  if (!data.length) return <div className={styles.empty}>No data</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Example</h1>
      {/* content */}
    </div>
  )
}
```

```css
/* src/pages/Example.module.css */
.container {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  padding: 2rem;
}
.title { font-size: 2rem; font-weight: 700; color: #ffffff; }
```

---

## 3. Layout Component Pattern

`PageLayout` wraps pages with consistent padding and the header:

```tsx
// src/components/layout/PageLayout.tsx
interface PageLayoutProps {
  children: React.ReactNode
  className?: string
}

export function PageLayout({ children, className }: PageLayoutProps) {
  return (
    <main className={cn('min-h-screen', className)}>
      {children}
    </main>
  )
}
```

---

## 4. Custom Hook Pattern

Extract all data fetching and stateful logic into custom hooks:

```tsx
// src/hooks/usePenaltyData.ts
export function usePenaltyData() {
  const { user } = useAuth()
  const [data, setData] = useState<PenaltyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false
    const load = async () => {
      try {
        const result = user ? await fetchAllEvents() : getMockData()
        if (!cancelled) setData(result)
      } catch (err) {
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }
    load()
    return () => { cancelled = true }
  }, [user])

  return { data, loading, error }
}
```

---

## 5. Protected Route Pattern

```tsx
// src/components/ProtectedRoute.tsx
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import { LoadingSpinner } from '@/components/ui'

export function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (loading) return <LoadingSpinner />
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />

  return <>{children}</>
}
```

---

## 6. Available UI Components

Import from `@/components/ui`:

| Component | Purpose |
|-----------|---------|
| `Button` | Styled button with variants (default, outline, ghost) |
| `Card` | Generic card wrapper |
| `MetricCard` | Single metric: label, value, delta |
| `DataTable` | Sortable tabular data |
| `Tabs` | Tab switching with render-prop children |
| `Select` | Dropdown (wraps Radix Select) |
| `MultiSelect` | Multi-option selection |
| `NumberInput` | Numeric input with +/- buttons |
| `Expander` | Collapsible section |
| `LoadingSpinner` | Full-page loading state |
| `RevealButton` | Countdown reveal interaction |
| `InfoBox` | Informational callout |
| `Badge` | Status pill |
| `Input` | Text input |
| `Dialog` | Modal dialog (wraps Radix Dialog) |

Import from `@/components/charts`:

| Component | Purpose |
|-----------|---------|
| `BarChart` | Bar chart (wraps Recharts) |
| `LineChart` | Line chart (wraps Recharts) |
| `PieChart` | Pie chart (wraps Recharts) |

---

## 7. `cn()` Utility

Always use `cn()` for combining class names (handles Tailwind conflicts):

```tsx
import { cn } from '@/lib/utils'

<div className={cn('base-class', conditional && 'extra-class', className)} />
```

---

## Anti-Patterns to Avoid

- ❌ Do not use `'use client'` directives — this is not Next.js
- ❌ Do not use `next/link`, `next/image`, `next/navigation` — use `react-router-dom`
- ❌ Do not install shadcn/ui via CLI — components are already in `src/components/ui/`
- ❌ Do not create new Supabase client instances in components — use `getSupabaseClient()`
