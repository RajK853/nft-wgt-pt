/**
 * Centralized configuration for Hall of Fame metrics
 * Use this file to manage delta colors for all metric cards
 * Direct CSS variables - no abstraction layer (KISS)
 */

// Standard delta colors for reuse
export const DELTA_COLORS = {
  success: 'var(--color-legacy-success)',
  error: 'var(--color-legacy-error)',
  muted: 'var(--color-legacy-text-muted)',
} as const

export type DeltaColor = typeof DELTA_COLORS[keyof typeof DELTA_COLORS]

export interface MetricConfig {
  /** Unique key to identify the metric */
  key: string
  /** Display label for the metric */
  label: string
  /** Optional icon prefix */
  icon?: string
  /** CSS variable for delta text color */
  deltaColor?: DeltaColor
}

// ============================================
// Hall of Fame - Single Session Metrics
// ============================================
export const SINGLE_SESSION_METRICS: MetricConfig[] = [
  {
    key: 'mostGoals',
    label: 'Most Goals in Session',
    deltaColor: DELTA_COLORS.success,
  },
  {
    key: 'mostSaves',
    label: 'Most Saves in Session',
    deltaColor: DELTA_COLORS.success,
  },
]

// ============================================
// Hall of Fame - All-Time Records Metrics
// ============================================
export const ALLTIME_RECORDS_METRICS: MetricConfig[] = [
  {
    key: 'longestStreak',
    label: 'Longest Goal Streak',
    deltaColor: DELTA_COLORS.success,
  },
  {
    key: 'biggestRivalry',
    label: 'Biggest Rivalry',
    deltaColor: DELTA_COLORS.muted,
  },
]

// ============================================
// Hall of Fame - Fun Facts Metrics
// ============================================
export const FUN_FACTS_METRICS: MetricConfig[] = [
  {
    key: 'marathonMan',
    label: '🏃 Marathon Man',
    deltaColor: DELTA_COLORS.success,
  },
  {
    key: 'mysteriousNinja',
    label: '🥷 Mysterious Ninja',
    deltaColor: DELTA_COLORS.error,
  },
  {
    key: 'busiestDay',
    label: '📅 Busiest Day',
    deltaColor: DELTA_COLORS.muted,
  },
  {
    key: 'perfectSession',
    label: '💯 Perfect Session',
    deltaColor: DELTA_COLORS.success,
  },
]

// ============================================
// Combined Hall of Fame Config
// ============================================
export const HALL_OF_FAME_METRICS = {
  single: SINGLE_SESSION_METRICS,
  alltime: ALLTIME_RECORDS_METRICS,
  funfacts: FUN_FACTS_METRICS,
} as const
