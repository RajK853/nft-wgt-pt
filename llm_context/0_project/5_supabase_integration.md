# Supabase Integration

This app uses Supabase as its backend (PostgreSQL database + Auth). It is a **pure CSR app** — all Supabase interactions happen client-side using `@supabase/supabase-js`. There is no SSR, no `@supabase/ssr`, and no cookie-based session handling.

---

## Client Initialisation (`src/lib/supabase.ts`)

A **singleton pattern** ensures only one Supabase client instance exists:

```ts
import { createClient, SupabaseClient } from '@supabase/supabase-js'

let supabaseInstance: SupabaseClient | null = null

export function getSupabaseClient(): SupabaseClient {
  if (supabaseInstance) return supabaseInstance

  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Missing Supabase environment variables')
  }

  supabaseInstance = createClient(supabaseUrl, supabaseAnonKey, {
    auth: { persistSession: true, autoRefreshToken: true },
  })

  return supabaseInstance
}
```

> Always import `getSupabaseClient()` — never instantiate `createClient` directly in components.

---

## Authentication (`src/auth/AuthContext.tsx`)

Auth state is managed via React Context. The `AuthContext` wraps the app and listens to Supabase auth state changes:

```tsx
// Consume in any component
import { useAuth } from '@/auth/AuthContext'

const { user, session, loading, signIn, signOut } = useAuth()
```

**AuthContext interface:**
```ts
interface AuthContextValue {
  user: AuthUser | null
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
}
```

**Sign-in / sign-out pattern:**
```tsx
const { signIn } = useAuth()
const { error } = await signIn(email, password)
if (error) setError(error.message)
```

---

## Data Fetching Pattern

Use the singleton client in service files. Never call `getSupabaseClient()` inside React render logic — call it in `useEffect` or service functions:

```ts
// src/services/penaltyService.ts
import { getSupabaseClient } from '@/lib/supabase'

export async function fetchAllEvents() {
  const supabase = getSupabaseClient()
  const { data, error } = await supabase
    .from('game_events')
    .select('*')
    .order('date', { ascending: false })

  if (error) throw error
  return data
}
```

---

## Mock Data Fallback

When the user is unauthenticated, the app renders with mock/demo data instead of showing an empty state or error. This is handled in `src/hooks/usePenaltyData.ts`:

```tsx
const { user } = useAuth()

useEffect(() => {
  const load = async () => {
    const result = user
      ? await fetchAllEvents()        // Real Supabase data
      : getMockPenaltyData()          // Demo data for guests
    setData(result)
  }
  load()
}, [user])
```

---

## Row-Level Security (RLS)

- RLS is enabled on `game_events`
- The anon key only grants access per the defined policies
- **Never expose the `service_role` key** in the browser or frontend code
- Use `VITE_SUPABASE_ANON_KEY` — not the service role key

---

## Best Practices

| Practice | Guidance |
|----------|----------|
| Select columns explicitly | `.select('id, date, player_name, status')` not `.select('*')` where possible |
| Handle errors | Always destructure and check `error` from Supabase responses |
| Throw on error | In service functions, `if (error) throw error` — let hooks handle error state |
| No `await` in render | All async calls go in `useEffect` or event handlers |
| Environment variables | Use `import.meta.env.VITE_*` — never `process.env` in Vite |

---

## What NOT to Use

- `@supabase/ssr` — SSR-only, not applicable here
- `@supabase/auth-helpers-nextjs` — Next.js-only
- `createServerClient` — server-side pattern, not applicable
- `cookies()` from Next.js — not applicable
