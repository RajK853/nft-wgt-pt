/**
 * Shared chart theme — single source of truth for Recharts colours and
 * magic numbers used across BarChart, LineChart, and PieChart.
 */

// ── Animation ────────────────────────────────────────────────────────────────

export const ANIMATION_DURATION_MS = 500

// ── BarChart ─────────────────────────────────────────────────────────────────

export const BAR_SIZE = 80
export const BAR_MIN_TICK_GAP = 30

// ── PieChart ─────────────────────────────────────────────────────────────────

/** Fraction of outerRadius used as innerRadius for donut charts */
export const DONUT_INNER_RADIUS_RATIO = 0.6

export const PIE_DEFAULT_COLORS = [
  '#3b82f6', // blue-500
  '#22c55e', // green-500
  '#f59e0b', // amber-400
  '#ef4444', // red-500
  '#8b5cf6', // violet-500
]

// ── Shared axis / grid / tooltip colours ─────────────────────────────────────

export interface ChartColors {
  axisColor: string
  gridColor: string
  tooltipBg: string
  tooltipBorder: string
  tooltipText: string
  textColor: string
  dotStroke: string
  cursorColor: string
  legendText: string
}

export function getChartColors(isDark: boolean): ChartColors {
  return {
    axisColor:     isDark ? '#9ca3af' : '#6b7280',
    gridColor:     isDark ? '#374151' : '#e5e7eb',
    tooltipBg:     isDark ? '#1f2937' : '#ffffff',
    tooltipBorder: isDark ? '#374151' : '#e5e7eb',
    tooltipText:   isDark ? '#ffffff' : '#1f2937',
    textColor:     isDark ? '#e5e7eb' : '#1f2937',
    dotStroke:     isDark ? '#1f2937' : '#ffffff',
    cursorColor:   isDark ? '#64748b' : '#94a3b8',
    legendText:    isDark ? '#9ca3af' : '#6b7280',
  }
}
