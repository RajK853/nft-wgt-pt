# Core Logic Overview

This is a **pure client-side React 19 app** (CSR). There are no server components, server actions, or API routes. All logic runs in the browser.

---

## Data Flow

```
Supabase DB
    │
    ▼
src/services/        ← Supabase queries + mock data fallback
    │
    ▼
src/hooks/           ← usePenaltyData, useTheme (React state/effect wrappers)
    │
    ▼
src/pages/           ← Route-level components consume hooks, render UI
    │
    ▼
src/components/      ← UI primitives, charts, layout
```

---

## Scoring Algorithm (`src/lib/scoring.ts`)

The core scoring logic applies **exponential time decay** to each event:

```
weight(t) = 2^(-days_ago / half_life)
```

- Half-life: **45 days** (`Scoring.PERFORMANCE_HALF_LIFE_DAYS`)
- Each penalty event is weighted by how recent it is
- Older events contribute less to the player's current score

**Point values per event (`src/types/index.ts → Scoring`):**

| Outcome | Shooter | Keeper |
|---------|---------|--------|
| Goal | +1.5 | -1.0 |
| Saved | 0.0 | +1.5 |
| Out | -1.0 | 0.0 |

---

## Authentication & Data Fallback (`src/auth/AuthContext.tsx`)

- Uses Supabase Auth (email/password)
- `AuthContext` provides `user`, `session`, `loading`, `signIn`, `signOut`
- Access via `useAuth()` hook from `src/auth/AuthContext.tsx`
- When `user` is `null` (unauthenticated), the data layer falls back to **mock/demo data**

```tsx
const { user } = useAuth()
const data = user ? await fetchFromSupabase() : getMockData()
```

---

## Data Fetching (`src/hooks/usePenaltyData.ts`)

- Single custom hook that provides all penalty data to pages
- Returns: `historicalData`, `leaderboard`, `loading`, `error`, `refetch`
- Triggers re-fetch when auth state changes

---

## Analysis Utilities (`src/lib/analysis.ts`)

Functions for deriving statistics from raw `PenaltyRecord[]` data:
- Player and keeper leaderboards
- Hall of Fame records (streaks, rivalries, busiest day, etc.)
- Outcome distributions per player/keeper

---

## Key Lib Files

| File | Purpose |
|------|---------|
| `src/lib/supabase.ts` | Singleton Supabase client — call `getSupabaseClient()` |
| `src/lib/scoring.ts` | Time-weighted score calculation |
| `src/lib/analysis.ts` | Statistical derivations from raw records |
| `src/lib/utils.ts` | `cn()` helper for class merging (`clsx` + `tailwind-merge`) |
| `src/lib/validation.ts` | Input validation utilities |

---

## Rendering Patterns

Since this is CSR, all data fetching happens inside `useEffect`:

```tsx
// ✅ Correct CSR data fetching pattern
useEffect(() => {
  let cancelled = false
  fetchData().then(data => {
    if (!cancelled) setData(data)
  })
  return () => { cancelled = true }
}, [dependency])
```

**Loading / error / empty guards:**
```tsx
if (loading) return <LoadingSpinner />
if (error) return <ErrorDisplay error={error} />
if (!data.length) return <EmptyState />
return <DataView data={data} />
```
