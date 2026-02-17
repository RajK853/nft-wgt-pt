# Data Schema

The application uses a **PostgreSQL** database hosted by **Supabase**. The primary table is `game_events`, which stores individual penalty kick records.

---

## `game_events` Table

| Column | Type | Constraints | Description |
|--------|------|-------------|-------------|
| `id` | `uuid` | PK | Auto-generated unique event ID |
| `date` | `timestamp` | NOT NULL | Date/time the penalty was taken |
| `player_name` | `text` | NOT NULL | Shooter's name |
| `keeper_name` | `text` | NOT NULL | Goalkeeper's name |
| `status` | `text` | CHECK (`'goal'`, `'saved'`, `'out'`) | Outcome of the penalty |
| `remark` | `text` | nullable | Optional comment |
| `gender` | `text` | nullable | `'Male'` or `'Female'` |

---

## TypeScript Types (`src/types/index.ts`)

These types mirror the database schema and scoring constants:

```ts
export type PenaltyStatus = 'goal' | 'saved' | 'out'
export type Gender = 'Male' | 'Female'

export interface PenaltyRecord {
  id: string
  date: Date
  shooterName: string
  keeperName: string
  status: PenaltyStatus
  remark?: string
  gender?: Gender
}

export interface PlayerScore {
  name: string
  score: number
  goals: number
  saved: number
  out: number
}

export interface KeeperScore {
  name: string
  score: number
  goalsConceded: number
  saves: number
  outs: number
}

export interface OutcomeDistribution {
  status: PenaltyStatus
  count: number
  percentage: number
}

export interface RecordData {
  type: 'goal_streak' | 'most_goals' | 'most_saves' | 'marathon_man' |
        'mysterious_ninja' | 'busiest_day' | 'biggest_rivalry'
  playerName?: string
  keeperName?: string
  value: number
  date?: Date
  sessionCount?: number
}
```

---

## Scoring Constants (`src/types/index.ts`)

```ts
export const Scoring = {
  GOAL: 1.5,           // Points earned by shooter for scoring
  SAVED: 0.0,          // Points earned by shooter when saved
  OUT: -1.0,           // Points earned by shooter when ball goes out
  KEEPER_GOAL: -1.0,   // Points earned by keeper when conceding
  KEEPER_SAVED: 1.5,   // Points earned by keeper for a save
  KEEPER_OUT: 0.0,     // Points earned by keeper when ball goes out
  PERFORMANCE_HALF_LIFE_DAYS: 45  // Half-life for exponential decay
} as const
```

---

## Row-Level Security (RLS)

RLS is enabled on the `game_events` table. Policies restrict read/write access based on authentication status. The app falls back to **mock data** when the user is unauthenticated (see `src/hooks/usePenaltyData.ts`).

---

## Key Query Patterns

The service layer in `src/services/` queries Supabase using the singleton client from `src/lib/supabase.ts`:

```ts
import { getSupabaseClient } from '@/lib/supabase'

const supabase = getSupabaseClient()

// Fetch all events ordered by date
const { data, error } = await supabase
  .from('game_events')
  .select('*')
  .order('date', { ascending: false })
```
