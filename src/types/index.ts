/**
 * TypeScript Types for Penalty Tracker
 * Based on Python constants from the original Streamlit project
 */

// Status constants
export type PenaltyStatus = 'goal' | 'saved' | 'out'

// Gender constants
export type Gender = 'Male' | 'Female'

// Base columns/fields
export interface PenaltyRecord {
  id: string
  date: Date
  shooterName: string
  keeperName: string
  status: PenaltyStatus
  remark?: string
  gender?: Gender
}

// Player scoring
export interface PlayerScore {
  name: string
  score: number
  goals: number
  saved: number
  out: number
}

// Keeper scoring  
export interface KeeperScore {
  name: string
  score: number
  goalsConceded: number
  saves: number
  outs: number
}

// Outcome distribution for pie charts
export interface OutcomeDistribution {
  status: PenaltyStatus
  count: number
  percentage: number
}

// Monthly data for filtering
export interface MonthOption {
  value: string
  label: string
}

// Record types for Hall of Fame
export interface RecordData {
  type: 'goal_streak' | 'most_goals' | 'most_saves' | 'marathon_man' | 'mysterious_ninja' | 'busiest_day' | 'biggest_rivalry'
  playerName?: string
  keeperName?: string
  value: number
  date?: Date
  sessionCount?: number
}

// Scoring constants (from Python)
export const Scoring = {
  GOAL: 1.5,
  SAVED: 0.0,
  OUT: -1.0,
  KEEPER_GOAL: -1.0,
  KEEPER_SAVED: 1.5,
  KEEPER_OUT: 0.0,
  PERFORMANCE_HALF_LIFE_DAYS: 45
} as const
