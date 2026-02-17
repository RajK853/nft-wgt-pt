# Coding Philosophy

Core principles for this codebase. Apply these consistently when writing or reviewing code.

---

## Principles

| Principle | Meaning in Practice |
|-----------|-------------------|
| **KISS** | Start with the simplest solution. Avoid premature abstraction. |
| **DRY** | Extract repeated logic into hooks or utility functions — not components unless the UI also repeats. |
| **SRP** | One component, one job. One hook, one concern. Extract when a function does two things. |
| **YAGNI** | Don't build features or abstractions for hypothetical future use. |
| **Composition > Inheritance** | Share behaviour via hooks and component composition, not class hierarchies. |

---

## TypeScript

- **No `any`** — use specific types or `unknown` with narrowing
- **No type assertions (`as X`)** unless genuinely unavoidable — prefer type guards
- **Explicit return types** on exported functions and hooks
- **Interfaces for objects**, `type` for unions/primitives
- **Import types explicitly**: `import type { Foo } from '@/types'`

```ts
// ✅
function getScore(record: PenaltyRecord): number { ... }

// ❌
function getScore(record: any): any { ... }
```

---

## React Specifics

- **Function components only** — no class components
- **Derive, don't duplicate state** — compute values from existing state rather than syncing separate state variables
- **Colocate state** — keep state as close to where it's used as possible; lift only when necessary
- **Effects are last resort** — prefer event handlers and derived values before `useEffect`
- **One hook, one concern** — if a hook does auth + data fetching, split it

```tsx
// ✅ Derived value
const totalGoals = data.filter(r => r.status === 'goal').length

// ❌ Duplicated state
const [totalGoals, setTotalGoals] = useState(0)
```

---

## Error Handling

- Always handle the `error` return from Supabase queries
- Surface errors in UI with a meaningful message — not just `console.error`
- Use the `loading / error / empty / data` guard pattern in components (see `3_core_logic_overview.md`)

---

## Code Readability

- Prefer **explicit over clever** — a clear 3-line solution beats a cryptic 1-liner
- **Name things by purpose**, not by type: `userEvents` not `dataArray`
- **Inline comments explain why**, not what — the code itself shows what
