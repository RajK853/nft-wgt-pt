/**
 * Scoring outcome data
 *
 * Single source of truth for the shooters and goalkeeper outcome definitions.
 * These pair the `Scoring` constants from `src/types` with display metadata
 * (emoji, label) so any page can import them without duplication.
 */

import { Scoring } from '@/types'

export interface ScoringOutcome {
  emoji: string
  outcome: string
  points: number
  /** Pre-formatted label string, e.g. "+1.5" or "-1" */
  label: string
}

export const SHOOTER_OUTCOMES: ScoringOutcome[] = [
  { emoji: '⚽', outcome: 'Goal',  points: Scoring.GOAL,  label: `+${Scoring.GOAL}` },
  { emoji: '🧤', outcome: 'Saved', points: Scoring.SAVED, label: `${Scoring.SAVED}` },
  { emoji: '❌', outcome: 'Out',   points: Scoring.OUT,   label: `${Scoring.OUT}` },
]

export const KEEPER_OUTCOMES: ScoringOutcome[] = [
  { emoji: '⚽', outcome: 'Goal Conceded',  points: Scoring.KEEPER_GOAL,  label: `${Scoring.KEEPER_GOAL}` },
  { emoji: '✋', outcome: 'Penalty Saved',  points: Scoring.KEEPER_SAVED, label: `+${Scoring.KEEPER_SAVED}` },
  { emoji: '❌', outcome: 'Shooter Missed', points: Scoring.KEEPER_OUT,   label: `${Scoring.KEEPER_OUT}` },
]
