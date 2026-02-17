# Common Patterns Cookbook

Quick reference for the most frequent task types in this project. Each recipe shows the minimal set of files to create/modify and a concrete code example.

---

## 1. Add a New Page

**Files to create:**
- `src/pages/MyPage.tsx`
- `src/pages/MyPage.module.css`

**Files to modify:**
- `src/App.tsx` — add `<Route>`

### MyPage.tsx
```tsx
import styles from './MyPage.module.css'
import { LoadingSpinner } from '@/components/ui'
import { useMyData } from '@/hooks/useMyData'

export default function MyPage() {
  const { data, loading, error } = useMyData()

  if (loading) return <LoadingSpinner />
  if (error) return <div className={styles.error}>{error.message}</div>

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Page Title</h1>
      <section className={styles.section}>
        {/* content */}
      </section>
    </div>
  )
}
```

### MyPage.module.css (minimal)
```css
.container {
  min-height: calc(100vh - 60px);
  background: linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%);
  padding: 2rem;
}

.title {
  font-size: 2rem;
  font-weight: 700;
  color: #ffffff;
  margin: 0 0 1.5rem 0;
}

.section {
  margin-bottom: 2.5rem;
}
```

### Route in App.tsx
```tsx
import { lazy } from 'react'
const MyPage = lazy(() => import('./pages/MyPage'))

// Inside <Routes>:
<Route path="/my-page" element={<ProtectedRoute><MyPage /></ProtectedRoute>} />
```

> For full design system reference (colors, cards, grids), see `llm_context/2_llm_interaction/2_page_design_guide.md`.

---

## 2. Add a New Custom Hook (with Supabase + mock fallback)

**File to create:** `src/hooks/useMyData.ts`

```ts
import { useState, useEffect, useMemo } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { getSupabaseClient } from '@/lib/supabase'
import type { PenaltyRecord } from '@/types'

export function useMyData() {
  const { user } = useAuth()
  const [records, setRecords] = useState<PenaltyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    let cancelled = false

    const fetchData = async () => {
      try {
        if (user) {
          const supabase = getSupabaseClient()
          const { data, error: sbError } = await supabase
            .from('game_events')
            .select('id, date, shooter_name, outcome, keeper_name')
            .order('date', { ascending: false })

          if (sbError) throw sbError
          if (!cancelled) setRecords(data ?? [])
        } else {
          // Mock fallback for unauthenticated users
          if (!cancelled) setRecords(MOCK_RECORDS)
        }
      } catch (err) {
        if (!cancelled) setError(err as Error)
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    fetchData()
    return () => { cancelled = true }
  }, [user])

  // Derive computed values — don't store in state
  const total = useMemo(() => records.length, [records])

  return { records, total, loading, error }
}

const MOCK_RECORDS: PenaltyRecord[] = [
  // minimal mock entries for unauthenticated preview
]
```

> Always query only needed columns (not `select('*')`). Always include the mock fallback branch.

---

## 3. Add a New Reusable UI Component

**File to create:** `src/components/ui/MyWidget.tsx`  
**Optional:** `src/components/ui/MyWidget.module.css` (if non-trivial styles)  
**Register in:** `src/components/ui/index.ts`

```tsx
// src/components/ui/MyWidget.tsx
import { cn } from '@/lib/utils'

interface MyWidgetProps {
  label: string
  value: string | number
  className?: string
}

export function MyWidget({ label, value, className }: MyWidgetProps) {
  return (
    <div className={cn('rounded-lg border border-white/10 bg-white/5 p-4', className)}>
      <p className="text-sm text-gray-400">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  )
}
```

```ts
// Add to src/components/ui/index.ts
export { MyWidget } from './MyWidget'
```

> Use Tailwind utilities for simple styles. Use a `.module.css` only when styles are complex or need animations.

---

## 4. Add a New Supabase Query (service layer)

Add to an existing service file or create `src/services/myService.ts`:

```ts
import { getSupabaseClient } from '@/lib/supabase'
import type { PenaltyRecord } from '@/types'

export async function fetchRecentEvents(limit = 20): Promise<PenaltyRecord[]> {
  const supabase = getSupabaseClient()

  const { data, error } = await supabase
    .from('game_events')
    .select('id, date, shooter_name, outcome, keeper_name, is_shootout')
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return data ?? []
}
```

> - Always use `getSupabaseClient()` — never instantiate a new client inline.  
> - Always `throw error` from service functions; let hooks handle the error state.  
> - Never use `@supabase/ssr` or `createServerClient`.

---

## 5. Add a Chart to a Page

Import from `@/components/charts`. All charts accept `data`, `height`, and optional `color`/`colors` props.

```tsx
import { BarChart, LineChart, PieChart } from '@/components/charts'

// Bar chart
<BarChart
  data={[{ name: 'Alice', value: 12 }, { name: 'Bob', value: 8 }]}
  height={300}
  color="#a855f7"
/>

// Line chart (time series)
<LineChart
  data={[{ date: '2024-01', value: 5 }, { date: '2024-02', value: 9 }]}
  height={250}
/>

// Pie chart
<PieChart
  data={[{ name: 'Goal', value: 60 }, { name: 'Save', value: 40 }]}
  height={300}
/>
```

Wrap in a container div with a set height or use `ResponsiveContainer` from recharts directly for custom sizing.

---

## 6. Using Existing UI Components

Quick import pattern:

```tsx
import {
  MetricCard,
  DataTable,
  LoadingSpinner,
  RevealButton,
  Expander,
  InfoBox,
  Badge,
} from '@/components/ui'
```

See `llm_context/2_llm_interaction/2_page_design_guide.md` § 4.1 for full prop reference.
