# Development Strategies

Practical strategies for building and maintaining features in this codebase.

---

## Modularity

- **Separate concerns**: data fetching in `src/services/`, state management in `src/hooks/`, presentation in `src/components/` and `src/pages/`
- **Co-locate related files**: page component + its CSS Module live in the same directory
- **Barrel exports**: use `index.ts` in `src/components/ui/` and `src/components/charts/` to simplify imports

```ts
// ✅ Clean import via barrel
import { Button, Card, LoadingSpinner } from '@/components/ui'

// ❌ Deep import
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
```

---

## Error Handling

Always handle errors explicitly — both at the service and UI layer:

```ts
// Service layer: throw errors, don't swallow them
const { data, error } = await supabase.from('game_events').select('*')
if (error) throw error
return data

// Hook layer: catch and set error state
try {
  const result = await fetchAllEvents()
  setData(result)
} catch (err) {
  setError(err as Error)
} finally {
  setLoading(false)
}
```

---

## Documentation

- **JSDoc** on exported functions and hooks — document parameters and return values
- **Inline comments** explain *why*, not *what* — avoid restating the code in prose
- **Type names are documentation** — prefer descriptive types (`PenaltyStatus`) over primitives (`string`)

```ts
/**
 * Calculates time-weighted score for a player across all their penalty events.
 * Applies exponential decay with a 45-day half-life so recent events matter more.
 */
export function calculateWeightedScore(records: PenaltyRecord[], asOf?: Date): number {
  // Half-life of 45 days — see Scoring.PERFORMANCE_HALF_LIFE_DAYS
  ...
}
```

---

## Testing Strategy

- **Unit tests** for pure functions: scoring logic, analysis utilities, validation (`src/lib/`)
- **Component tests** for interactive UI behaviour using React Testing Library
- **Test behaviour, not implementation** — query by role/text, not by CSS class or internal state
- Test files live in `src/__tests__/` or co-located as `*.test.ts(x)`

```ts
// ✅ Tests what the user sees
expect(screen.getByRole('button', { name: /reveal/i })).toBeInTheDocument()

// ❌ Tests implementation detail
expect(component.state.isRevealed).toBe(false)
```

Run tests: `bun test` | Watch mode: `bun test --watch` | Coverage: `bun test --coverage`

---

## Security

- **Never hardcode secrets** — use `.env` with `VITE_` prefix; add `.env` to `.gitignore`
- **Never expose the Supabase `service_role` key** client-side — only use the anon key
- **Validate user input** before sending to Supabase (see `src/lib/validation.ts`)
- **RLS is the last line of defence** — always enable RLS on Supabase tables

---

## Performance

- **Lazy-load pages** with `React.lazy` + `Suspense` (already done in `App.tsx`)
- **Memoize expensive computations** with `useMemo` — e.g., score calculations over large datasets
- **Avoid unnecessary re-renders**: use `useCallback` for stable function references passed to child components
- **Derive, don't store** — computed values should not be state (see `0_coding_philosophy.md`)
