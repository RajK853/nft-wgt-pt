/**
 * Analysis Library
 * Pure functions for calculating player and keeper scores
 * Based on Python analysis.py - Ported to TypeScript
 */

import { PenaltyRecord, PlayerScore, KeeperScore, OutcomeDistribution, Scoring } from '@/types'

/**
 * Apply time decay to records based on half-life
 */
function applyTimeDecay(records: PenaltyRecord[], halfLife: number = Scoring.PERFORMANCE_HALF_LIFE_DAYS): PenaltyRecord[] {
  const latestDate = new Date(Math.max(...records.map(r => new Date(r.date).getTime())))
  
  return records.map(record => {
    const recordDate = new Date(record.date)
    const daysAgo = (latestDate.getTime() - recordDate.getTime()) / (1000 * 60 * 60 * 24)
    const weight = Math.pow(2, -daysAgo / halfLife)
    return { ...record, weight }
  })
}

/**
 * Calculate player scores with time-weighted scoring
 */
export function calculatePlayerScores(records: PenaltyRecord[]): PlayerScore[] {
  if (records.length === 0) return []
  
  const weighted = applyTimeDecay(records)
  const scoreMap = new Map<string, { score: number; goals: number; saved: number; out: number }>()
  
  for (const record of weighted) {
    const weight = (record as any).weight || 1
    const shooter = record.shooterName
    
    if (!scoreMap.has(shooter)) {
      scoreMap.set(shooter, { score: 0, goals: 0, saved: 0, out: 0 })
    }
    
    const entry = scoreMap.get(shooter)!
    let points = 0
    
    if (record.status === 'goal') {
      points = Scoring.GOAL * weight
      entry.goals++
    } else if (record.status === 'saved') {
      points = Scoring.SAVED * weight
      entry.saved++
    } else if (record.status === 'out') {
      points = Scoring.OUT * weight
      entry.out++
    }
    
    entry.score += points
  }
  
  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goals: data.goals,
      saved: data.saved,
      out: data.out
    }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Calculate keeper scores with time-weighted scoring
 */
export function calculateKeeperScores(records: PenaltyRecord[]): KeeperScore[] {
  if (records.length === 0) return []
  
  const weighted = applyTimeDecay(records)
  const scoreMap = new Map<string, { score: number; goalsConceded: number; saves: number; outs: number }>()
  
  for (const record of weighted) {
    const weight = (record as any).weight || 1
    const keeper = record.keeperName
    
    if (!scoreMap.has(keeper)) {
      scoreMap.set(keeper, { score: 0, goalsConceded: 0, saves: 0, outs: 0 })
    }
    
    const entry = scoreMap.get(keeper)!
    let points = 0
    
    if (record.status === 'goal') {
      points = Scoring.KEEPER_GOAL * weight
      entry.goalsConceded++
    } else if (record.status === 'saved') {
      points = Scoring.KEEPER_SAVED * weight
      entry.saves++
    } else if (record.status === 'out') {
      points = Scoring.KEEPER_OUT * weight
      entry.outs++
    }
    
    entry.score += points
  }
  
  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goalsConceded: data.goalsConceded,
      saves: data.saves,
      outs: data.outs
    }))
    .sort((a, b) => b.score - a.score)
}

/**
 * Get keeper outcome distribution for pie chart
 */
export function getKeeperOutcomeDistribution(records: PenaltyRecord[], keeperName: string): OutcomeDistribution[] {
  const keeperRecords = records.filter(r => r.keeperName === keeperName)
  
  if (keeperRecords.length === 0) return []
  
  const counts = {
    goal: keeperRecords.filter(r => r.status === 'goal').length,
    saved: keeperRecords.filter(r => r.status === 'saved').length,
    out: keeperRecords.filter(r => r.status === 'out').length
  }
  
  const total = keeperRecords.length
  
  return [
    { status: 'goal', count: counts.goal, percentage: Math.round((counts.goal / total) * 100) },
    { status: 'saved', count: counts.saved, percentage: Math.round((counts.saved / total) * 100) },
    { status: 'out', count: counts.out, percentage: Math.round((counts.out / total) * 100) }
  ]
}

/**
 * Get unique months from records for filtering
 */
export function getUniqueMonths(records: PenaltyRecord[]): { value: string; label: string }[] {
  const months = new Set<string>()
  
  for (const record of records) {
    const date = new Date(record.date)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    months.add(monthKey)
  }
  
  return Array.from(months)
    .sort((a, b) => b.localeCompare(a))
    .map(monthKey => {
      const [year, month] = monthKey.split('-')
      const date = new Date(parseInt(year), parseInt(month) - 1)
      return {
        value: monthKey,
        label: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })
      }
    })
}

/**
 * Filter records by month
 */
export function filterByMonth(records: PenaltyRecord[], monthValue: string): PenaltyRecord[] {
  if (!monthValue) return records
  
  const [year, month] = monthValue.split('-')
  return records.filter(record => {
    const date = new Date(record.date)
    return date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)
  })
}

/**
 * Get unique player names for selection
 */
export function getUniquePlayers(records: PenaltyRecord[]): string[] {
  const players = new Set<string>()
  records.forEach(r => players.add(r.shooterName))
  return Array.from(players).sort()
}

// ============================================================================
// Hall of Fame / Records Functions
// ============================================================================

/**
 * Group records by session (same date)
 */
function groupBySession(records: PenaltyRecord[]): Map<string, PenaltyRecord[]> {
  const sessions = new Map<string, PenaltyRecord[]>()
  
  for (const record of records) {
    const dateStr = new Date(record.date).toISOString().split('T')[0]
    const existing = sessions.get(dateStr) || []
    existing.push(record)
    sessions.set(dateStr, existing)
  }
  
  return sessions
}

/**
 * Get player with longest goal streak (consecutive goals in a session)
 */
export function getLongestGoalStreak(records: PenaltyRecord[]): { playerName: string; streak: number; date: Date } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  let bestStreak = 0
  let bestPlayer = ''
  let bestDate: Date | null = null
  
  for (const [dateStr, sessionRecords] of sessions) {
    const date = new Date(dateStr)
    // Sort by record ID or timestamp to maintain order
    const shooterGoals = new Map<string, number>()
    
    for (const record of sessionRecords) {
      if (record.status === 'goal') {
        const current = shooterGoals.get(record.shooterName) || 0
        shooterGoals.set(record.shooterName, current + 1)
        
        if (current + 1 > bestStreak) {
          bestStreak = current + 1
          bestPlayer = record.shooterName
          bestDate = date
        }
      } else {
        shooterGoals.set(record.shooterName, 0)
      }
    }
  }
  
  return bestPlayer ? { playerName: bestPlayer, streak: bestStreak, date: bestDate! } : null
}

/**
 * Get most goals in a single session
 */
export function getMostGoalsInSession(records: PenaltyRecord[]): { playerName: string; goals: number; date: Date } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  let bestGoals = 0
  let bestPlayer = ''
  let bestDate: Date | null = null
  
  for (const [dateStr, sessionRecords] of sessions) {
    const date = new Date(dateStr)
    const shooterGoals = new Map<string, number>()
    
    for (const record of sessionRecords) {
      if (record.status === 'goal') {
        const current = shooterGoals.get(record.shooterName) || 0
        shooterGoals.set(record.shooterName, current + 1)
        
        if (current + 1 > bestGoals) {
          bestGoals = current + 1
          bestPlayer = record.shooterName
          bestDate = date
        }
      }
    }
  }
  
  return bestPlayer ? { playerName: bestPlayer, goals: bestGoals, date: bestDate! } : null
}

/**
 * Get most saves in a single session
 */
export function getMostSavesInSession(records: PenaltyRecord[]): { keeperName: string; saves: number; date: Date } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  let bestSaves = 0
  let bestKeeper = ''
  let bestDate: Date | null = null
  
  for (const [dateStr, sessionRecords] of sessions) {
    const date = new Date(dateStr)
    const keeperSaves = new Map<string, number>()
    
    for (const record of sessionRecords) {
      if (record.status === 'saved') {
        const current = keeperSaves.get(record.keeperName) || 0
        keeperSaves.set(record.keeperName, current + 1)
        
        if (current + 1 > bestSaves) {
          bestSaves = current + 1
          bestKeeper = record.keeperName
          bestDate = date
        }
      }
    }
  }
  
  return bestKeeper ? { keeperName: bestKeeper, saves: bestSaves, date: bestDate! } : null
}

/**
 * Get player with most sessions played (Marathon Man)
 */
export function getMarathonMan(records: PenaltyRecord[]): { playerName: string; sessionCount: number } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  const playerSessions = new Map<string, Set<string>>()
  
  for (const [dateStr, sessionRecords] of sessions) {
    for (const record of sessionRecords) {
      const player = record.shooterName
      const existing = playerSessions.get(player) || new Set()
      existing.add(dateStr)
      playerSessions.set(player, existing)
    }
  }
  
  let bestPlayer = ''
  let bestCount = 0
  
  for (const [player, sessionDates] of playerSessions) {
    if (sessionDates.size > bestCount) {
      bestCount = sessionDates.size
      bestPlayer = player
    }
  }
  
  return bestPlayer ? { playerName: bestPlayer, sessionCount: bestCount } : null
}

/**
 * Get player with fewest sessions played (Mysterious Ninja)
 */
export function getMysteriousNinja(records: PenaltyRecord[]): { playerName: string; sessionCount: number } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  const playerSessions = new Map<string, Set<string>>()
  
  for (const [dateStr, sessionRecords] of sessions) {
    for (const record of sessionRecords) {
      const player = record.shooterName
      const existing = playerSessions.get(player) || new Set()
      existing.add(dateStr)
      playerSessions.set(player, existing)
    }
  }
  
  let bestPlayer = ''
  let bestCount = Infinity
  
  for (const [player, sessionDates] of playerSessions) {
    if (sessionDates.size < bestCount) {
      bestCount = sessionDates.size
      bestPlayer = player
    }
  }
  
  return bestPlayer && bestCount !== Infinity ? { playerName: bestPlayer, sessionCount: bestCount } : null
}

/**
 * Get busiest day (most penalties in a single session)
 */
export function getBusiestDay(records: PenaltyRecord[]): { date: Date; penaltyCount: number } | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  let bestDate: Date | null = null
  let bestCount = 0
  
  for (const [dateStr, sessionRecords] of sessions) {
    if (sessionRecords.length > bestCount) {
      bestCount = sessionRecords.length
      bestDate = new Date(dateStr)
    }
  }
  
  return bestDate ? { date: bestDate, penaltyCount: bestCount } : null
}

/**
 * Get biggest rivalry (most frequent shooter-keeper matchups)
 */
export function getBiggestRivalry(records: PenaltyRecord[]): { shooterName: string; keeperName: string; encounters: number } | null {
  if (records.length === 0) return null
  
  const matchups = new Map<string, number>()
  
  for (const record of records) {
    const key = `${record.shooterName}|${record.keeperName}`
    const current = matchups.get(key) || 0
    matchups.set(key, current + 1)
  }
  
  let bestMatchup = ''
  let bestCount = 0
  
  for (const [matchup, count] of matchups) {
    if (count > bestCount) {
      bestCount = count
      bestMatchup = matchup
    }
  }
  
  if (!bestMatchup) return null
  
  const [shooter, keeper] = bestMatchup.split('|')
  return { shooterName: shooter, keeperName: keeper, encounters: bestCount }
}

/**
 * Get top player (highest score)
 */
export function getTopPlayer(records: PenaltyRecord[]): PlayerScore | null {
  const scores = calculatePlayerScores(records)
  return scores.length > 0 ? scores[0] : null
}

/**
 * Get top goalkeeper (highest score)
 */
export function getTopKeeper(records: PenaltyRecord[]): KeeperScore | null {
  const scores = calculateKeeperScores(records)
  return scores.length > 0 ? scores[0] : null
}

/**
 * Get recent session stats
 */
export function getRecentSession(records: PenaltyRecord[]): { 
  date: Date; 
  goals: number; 
  saves: number; 
  outs: number 
} | null {
  if (records.length === 0) return null
  
  const sessions = groupBySession(records)
  const sortedDates = Array.from(sessions.keys()).sort((a, b) => b.localeCompare(a))
  
  if (sortedDates.length === 0) return null
  
  const latestDate = sortedDates[0]
  const latestRecords = sessions.get(latestDate)!
  
  let goals = 0, saves = 0, outs = 0
  for (const record of latestRecords) {
    if (record.status === 'goal') goals++
    else if (record.status === 'saved') saves++
    else if (record.status === 'out') outs++
  }
  
  return { date: new Date(latestDate), goals, saves, outs }
}
