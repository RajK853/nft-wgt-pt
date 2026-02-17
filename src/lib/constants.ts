/**
 * Shared UI constants — single source of truth for table column definitions
 * and other app-wide magic values.
 */

export const PLAYER_STATS_COLUMNS = [
  { key: 'name',  header: 'Player',  sortable: true },
  { key: 'score', header: 'Score',   sortable: true },
  { key: 'goals', header: 'Goals',   sortable: true },
  { key: 'saved', header: 'Saved',   sortable: true },
  { key: 'out',   header: 'Out',     sortable: true },
] as const

export const KEEPER_STATS_COLUMNS = [
  { key: 'name',          header: 'Goalkeeper',    sortable: true },
  { key: 'score',         header: 'Score',         sortable: true },
  { key: 'saves',         header: 'Saves',         sortable: true },
  { key: 'goalsConceded', header: 'Goals Conceded', sortable: true },
  { key: 'outs',          header: 'Out',           sortable: true },
] as const

/** Max characters shown for a player/keeper name in chart labels */
export const CHART_NAME_MAX_LENGTH = 12
