import { PenaltyRecord, PlayerScore, KeeperScore, OutcomeDistribution, Scoring } from '@/types'

type WeightedRecord = PenaltyRecord & { weight: number }

function applyTimeDecay(records: PenaltyRecord[], halfLife: number = Scoring.PERFORMANCE_HALF_LIFE_DAYS): WeightedRecord[] {
  const latestDate = new Date(Math.max(...records.map(r => new Date(r.date).getTime())))

  return records.map(record => {
    const daysAgo = (latestDate.getTime() - new Date(record.date).getTime()) / (1000 * 60 * 60 * 24)
    const weight = Math.pow(2, -daysAgo / halfLife)
    return { ...record, weight }
  })
}

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

/** Builds a map of player → unique session dates they appeared in. */
function buildPlayerSessionMap(records: PenaltyRecord[]): Map<string, Set<string>> {
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

  return playerSessions
}

/** Builds a map of keeper → unique session dates they appeared in. */
function buildKeeperSessionMap(records: PenaltyRecord[]): Map<string, Set<string>> {
  const sessions = groupBySession(records)
  const keeperSessions = new Map<string, Set<string>>()

  for (const [dateStr, sessionRecords] of sessions) {
    for (const record of sessionRecords) {
      const keeper = record.keeperName
      const existing = keeperSessions.get(keeper) || new Set()
      existing.add(dateStr)
      keeperSessions.set(keeper, existing)
    }
  }

  return keeperSessions
}

export function calculatePlayerScores(records: PenaltyRecord[]): PlayerScore[] {
  if (records.length === 0) return []

  const weighted = applyTimeDecay(records)
  const scoreMap = new Map<string, { score: number; goals: number; saved: number; out: number }>()

  for (const record of weighted) {
    const weight = record.weight
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

  // Calculate unique sessions per player
  const playerSessions = buildPlayerSessionMap(records)

  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goals: data.goals,
      saved: data.saved,
      out: data.out,
      sessions: playerSessions.get(name)?.size ?? 0
    }))
    .sort((a, b) => b.score - a.score)
}

export function calculateKeeperScores(records: PenaltyRecord[]): KeeperScore[] {
  if (records.length === 0) return []

  const weighted = applyTimeDecay(records)
  const scoreMap = new Map<string, { score: number; goalsConceded: number; saves: number; outs: number }>()

  for (const record of weighted) {
    const weight = record.weight
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

  // Calculate unique sessions per keeper
  const keeperSessions = buildKeeperSessionMap(records)

  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goalsConceded: data.goalsConceded,
      saves: data.saves,
      outs: data.outs,
      sessions: keeperSessions.get(name)?.size ?? 0
    }))
    .sort((a, b) => b.score - a.score)
}

export function getRecentSessionPlayerScores(records: PenaltyRecord[]): PlayerScore[] {
  if (records.length === 0) return []

  const sessions = groupBySession(records)
  const sortedDates = Array.from(sessions.keys()).sort((a, b) => b.localeCompare(a))

  if (sortedDates.length === 0) return []

  const latestDate = sortedDates[0]
  const latestRecords = sessions.get(latestDate)!

  const scoreMap = new Map<string, { score: number; goals: number; saved: number; out: number }>()

  for (const record of latestRecords) {
    const shooter = record.shooterName

    if (!scoreMap.has(shooter)) {
      scoreMap.set(shooter, { score: 0, goals: 0, saved: 0, out: 0 })
    }

    const entry = scoreMap.get(shooter)!

    if (record.status === 'goal') {
      entry.score += Scoring.GOAL
      entry.goals++
    } else if (record.status === 'saved') {
      entry.score += Scoring.SAVED
      entry.saved++
    } else if (record.status === 'out') {
      entry.score += Scoring.OUT
      entry.out++
    }
  }

  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goals: data.goals,
      saved: data.saved,
      out: data.out,
      sessions: 1
    }))
    .sort((a, b) => b.score - a.score)
}

export function getRecentSessionKeeperScores(records: PenaltyRecord[]): KeeperScore[] {
  if (records.length === 0) return []

  const sessions = groupBySession(records)
  const sortedDates = Array.from(sessions.keys()).sort((a, b) => b.localeCompare(a))

  if (sortedDates.length === 0) return []

  const latestDate = sortedDates[0]
  const latestRecords = sessions.get(latestDate)!

  const scoreMap = new Map<string, { score: number; goalsConceded: number; saves: number; outs: number }>()

  for (const record of latestRecords) {
    const keeper = record.keeperName

    if (!scoreMap.has(keeper)) {
      scoreMap.set(keeper, { score: 0, goalsConceded: 0, saves: 0, outs: 0 })
    }

    const entry = scoreMap.get(keeper)!

    if (record.status === 'goal') {
      entry.score += Scoring.KEEPER_GOAL
      entry.goalsConceded++
    } else if (record.status === 'saved') {
      entry.score += Scoring.KEEPER_SAVED
      entry.saves++
    } else if (record.status === 'out') {
      entry.score += Scoring.KEEPER_OUT
      entry.outs++
    }
  }

  return Array.from(scoreMap.entries())
    .map(([name, data]) => ({
      name,
      score: Math.round(data.score * 100) / 100,
      goalsConceded: data.goalsConceded,
      saves: data.saves,
      outs: data.outs,
      sessions: 1
    }))
    .sort((a, b) => b.score - a.score)
}

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

export function filterByMonth(records: PenaltyRecord[], monthValue: string): PenaltyRecord[] {
  if (!monthValue) return records

  const [year, month] = monthValue.split('-')
  return records.filter(record => {
    const date = new Date(record.date)
    return date.getFullYear() === parseInt(year) && date.getMonth() + 1 === parseInt(month)
  })
}

export function getUniquePlayers(records: PenaltyRecord[]): string[] {
  const players = new Set<string>()
  records.forEach(r => players.add(r.shooterName))
  return Array.from(players).sort()
}

export function getUniqueKeepers(records: PenaltyRecord[]): string[] {
  const keepers = new Set<string>()
  records.forEach(r => keepers.add(r.keeperName))
  return Array.from(keepers).sort()
}

export function getLongestGoalStreak(records: PenaltyRecord[]): { playerName: string; streak: number; date: Date } | null {
  if (records.length === 0) return null

  const sessions = groupBySession(records)
  let bestStreak = 0
  let bestPlayer = ''
  let bestDate: Date | null = null

  for (const [dateStr, sessionRecords] of sessions) {
    const date = new Date(dateStr)
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

export function getMarathonMan(records: PenaltyRecord[]): { playerName: string; sessionCount: number } | null {
  if (records.length === 0) return null

  const playerSessions = buildPlayerSessionMap(records)
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

export function getMysteriousNinja(records: PenaltyRecord[]): { playerName: string; sessionCount: number } | null {
  if (records.length === 0) return null

  const playerSessions = buildPlayerSessionMap(records)
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

export function getOverallStats(records: PenaltyRecord[]): {
  totalPenalties: number
  totalSessions: number
  totalPlayers: number
  goalRate: number
} {
  if (records.length === 0) return { totalPenalties: 0, totalSessions: 0, totalPlayers: 0, goalRate: 0 }

  const sessions = groupBySession(records)
  const players = new Set(records.map(r => r.shooterName))
  const goals = records.filter(r => r.status === 'goal').length

  return {
    totalPenalties: records.length,
    totalSessions: sessions.size,
    totalPlayers: players.size,
    goalRate: Math.round((goals / records.length) * 100)
  }
}

export function getHottestShooter(records: PenaltyRecord[], lastNSessions = 3, minAttempts = 3): {
  playerName: string
  goalRate: number
  goals: number
  attempts: number
  sessions: number
} | null {
  if (records.length === 0) return null

  const sessions = groupBySession(records)
  const sortedDates = Array.from(sessions.keys()).sort((a, b) => b.localeCompare(a))

  const playerSessionRecords = new Map<string, PenaltyRecord[]>()
  const playerSessionCounts = new Map<string, number>()

  for (const dateStr of sortedDates) {
    const sessionRecords = sessions.get(dateStr)!
    const playersInSession = new Set(sessionRecords.map(r => r.shooterName))

    for (const player of playersInSession) {
      const sessionCount = playerSessionCounts.get(player) || 0
      if (sessionCount < lastNSessions) {
        const playerRecordsInSession = sessionRecords.filter(r => r.shooterName === player)
        const existing = playerSessionRecords.get(player) || []
        existing.push(...playerRecordsInSession)
        playerSessionRecords.set(player, existing)
        playerSessionCounts.set(player, sessionCount + 1)
      }
    }
  }

  let bestPlayer = ''
  let bestRate = -1
  let bestGoals = 0
  let bestAttempts = 0
  let bestSessions = 0

  for (const [player, attempts] of playerSessionRecords) {
    if (attempts.length < minAttempts) continue
    const goals = attempts.filter(r => r.status === 'goal').length
    const rate = goals / attempts.length
    if (rate > bestRate) {
      bestRate = rate
      bestPlayer = player
      bestGoals = goals
      bestAttempts = attempts.length
      bestSessions = playerSessionCounts.get(player) || 0
    }
  }

  return bestPlayer
    ? { playerName: bestPlayer, goalRate: Math.round(bestRate * 100), goals: bestGoals, attempts: bestAttempts, sessions: bestSessions }
    : null
}

export function getBestSaveRate(records: PenaltyRecord[], minAttempts = 5): {
  keeperName: string
  saveRate: number
  saves: number
  faced: number
} | null {
  if (records.length === 0) return null

  const keeperMap = new Map<string, { saves: number; faced: number }>()

  for (const record of records) {
    const keeper = record.keeperName
    const existing = keeperMap.get(keeper) || { saves: 0, faced: 0 }
    // Only count saves and goals (out doesn't count as "faced" for save rate)
    if (record.status === 'saved') {
      existing.saves++
      existing.faced++
    } else if (record.status === 'goal') {
      existing.faced++
    }
    keeperMap.set(keeper, existing)
  }

  let bestKeeper = ''
  let bestRate = -1
  let bestSaves = 0
  let bestFaced = 0

  for (const [keeper, stats] of keeperMap) {
    if (stats.faced < minAttempts) continue
    const rate = stats.saves / stats.faced
    if (rate > bestRate) {
      bestRate = rate
      bestKeeper = keeper
      bestSaves = stats.saves
      bestFaced = stats.faced
    }
  }

  return bestKeeper ? { keeperName: bestKeeper, saveRate: Math.round(bestRate * 100), saves: bestSaves, faced: bestFaced } : null
}

export function getBestConversionRate(records: PenaltyRecord[], minAttempts = 5): {
  playerName: string
  goalRate: number
  goals: number
  attempts: number
} | null {
  if (records.length === 0) return null

  const playerMap = new Map<string, { goals: number; attempts: number }>()

  for (const record of records) {
    const player = record.shooterName
    const existing = playerMap.get(player) || { goals: 0, attempts: 0 }
    existing.attempts++
    if (record.status === 'goal') existing.goals++
    playerMap.set(player, existing)
  }

  let bestPlayer = ''
  let bestRate = -1
  let bestGoals = 0
  let bestAttempts = 0

  for (const [player, stats] of playerMap) {
    if (stats.attempts < minAttempts) continue
    const rate = stats.goals / stats.attempts
    if (rate > bestRate) {
      bestRate = rate
      bestPlayer = player
      bestGoals = stats.goals
      bestAttempts = stats.attempts
    }
  }

  return bestPlayer ? { playerName: bestPlayer, goalRate: Math.round(bestRate * 100), goals: bestGoals, attempts: bestAttempts } : null
}

export function getPerfectSession(records: PenaltyRecord[], minAttempts = 3): {
  playerName: string
  goals: number
  date: Date
} | null {
  if (records.length === 0) return null

  const sessions = groupBySession(records)

  for (const [dateStr, sessionRecords] of [...sessions.entries()].sort((a, b) => b[0].localeCompare(a[0]))) {
    const playerGrouped = new Map<string, PenaltyRecord[]>()
    for (const record of sessionRecords) {
      const existing = playerGrouped.get(record.shooterName) || []
      existing.push(record)
      playerGrouped.set(record.shooterName, existing)
    }

    for (const [player, attempts] of playerGrouped) {
      if (attempts.length < minAttempts) continue
      const allGoals = attempts.every(r => r.status === 'goal')
      if (allGoals) {
        return { playerName: player, goals: attempts.length, date: new Date(dateStr) }
      }
    }
  }

  return null
}

export function getSessionLeader(records: PenaltyRecord[]): {
  playerName: string
  goals: number
} | null {
  if (records.length === 0) return null

  const sessions = groupBySession(records)
  const sortedDates = Array.from(sessions.keys()).sort((a, b) => b.localeCompare(a))
  if (sortedDates.length === 0) return null

  const latestRecords = sessions.get(sortedDates[0])!
  const playerGoals = new Map<string, number>()

  for (const record of latestRecords) {
    if (record.status === 'goal') {
      playerGoals.set(record.shooterName, (playerGoals.get(record.shooterName) || 0) + 1)
    }
  }

  if (playerGoals.size === 0) return null

  let bestPlayer = ''
  let bestGoals = 0

  for (const [player, goals] of playerGoals) {
    if (goals > bestGoals) {
      bestGoals = goals
      bestPlayer = player
    }
  }

  return bestPlayer ? { playerName: bestPlayer, goals: bestGoals } : null
}

export function getTopPlayer(records: PenaltyRecord[]): PlayerScore | null {
  const scores = calculatePlayerScores(records)
  return scores.length > 0 ? scores[0] : null
}

export function getTopKeeper(records: PenaltyRecord[]): KeeperScore | null {
  const scores = calculateKeeperScores(records)
  return scores.length > 0 ? scores[0] : null
}

export function getRecentSession(records: PenaltyRecord[]): {
  date: Date
  goals: number
  saves: number
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