/**
 * Analysis Logic Tests
 * Tests for penalty score calculations in analysis.ts
 */

import {
  calculatePlayerScores,
  calculateKeeperScores,
  getTopPlayer,
  getTopKeeper,
  getBiggestRivalry,
  getBusiestDay,
  getRecentSession,
} from '../lib/analysis'
import type { PenaltyRecord } from '../types'

const makeRecord = (overrides: Partial<PenaltyRecord> = {}): PenaltyRecord => ({
  id: Math.random().toString(36).slice(2),
  date: new Date('2024-01-15'),
  shooterName: 'Alice',
  keeperName: 'Bob',
  status: 'goal',
  ...overrides,
})

const RECORDS: PenaltyRecord[] = [
  makeRecord({ shooterName: 'Alice', keeperName: 'Bob', status: 'goal' }),
  makeRecord({ shooterName: 'Alice', keeperName: 'Bob', status: 'goal' }),
  makeRecord({ shooterName: 'Alice', keeperName: 'Bob', status: 'saved' }),
  makeRecord({ shooterName: 'Carol', keeperName: 'Bob', status: 'goal' }),
  makeRecord({ shooterName: 'Carol', keeperName: 'Dave', status: 'out' }),
]

describe('calculatePlayerScores', () => {
  test('returns empty array for no records', () => {
    expect(calculatePlayerScores([])).toEqual([])
  })

  test('counts goals, saves and outs per player', () => {
    const scores = calculatePlayerScores(RECORDS)
    const alice = scores.find(s => s.name === 'Alice')!
    expect(alice.goals).toBe(2)
    expect(alice.saved).toBe(1)
    expect(alice.out).toBe(0)
  })

  test('sorts by score descending', () => {
    const scores = calculatePlayerScores(RECORDS)
    for (let i = 1; i < scores.length; i++) {
      expect(scores[i - 1].score).toBeGreaterThanOrEqual(scores[i].score)
    }
  })

  test('goals give positive points, outs give negative', () => {
    const goalOnlyRecords = [makeRecord({ shooterName: 'Alice', status: 'goal' })]
    const outOnlyRecords = [makeRecord({ shooterName: 'Bob', status: 'out' })]

    const goalScore = calculatePlayerScores(goalOnlyRecords)[0].score
    const outScore = calculatePlayerScores(outOnlyRecords)[0].score

    expect(goalScore).toBeGreaterThan(0)
    expect(outScore).toBeLessThan(0)
  })
})

describe('calculateKeeperScores', () => {
  test('returns empty array for no records', () => {
    expect(calculateKeeperScores([])).toEqual([])
  })

  test('counts saves and conceded per keeper', () => {
    const scores = calculateKeeperScores(RECORDS)
    const bob = scores.find(s => s.name === 'Bob')!
    // Bob faced 2 goals by Alice + 1 goal by Carol = 3 conceded, 1 save
    expect(bob.goalsConceded).toBe(3)
    expect(bob.saves).toBe(1)
  })

  test('saves give positive points, conceded give negative', () => {
    const savedRecord = [makeRecord({ keeperName: 'Bob', status: 'saved' })]
    const goalRecord = [makeRecord({ keeperName: 'Bob', status: 'goal' })]

    const saveScore = calculateKeeperScores(savedRecord)[0].score
    const concededScore = calculateKeeperScores(goalRecord)[0].score

    expect(saveScore).toBeGreaterThan(0)
    expect(concededScore).toBeLessThan(0)
  })
})

describe('getTopPlayer', () => {
  test('returns null for empty records', () => {
    expect(getTopPlayer([])).toBeNull()
  })

  test('returns the player with the highest score', () => {
    const top = getTopPlayer(RECORDS)
    expect(top).not.toBeNull()
    expect(top!.name).toBe('Alice') // Alice scored 2 goals, should be highest
  })
})

describe('getTopKeeper', () => {
  test('returns null for empty records', () => {
    expect(getTopKeeper([])).toBeNull()
  })

  test('returns a keeper', () => {
    const top = getTopKeeper(RECORDS)
    expect(top).not.toBeNull()
    expect(typeof top!.name).toBe('string')
  })
})

describe('getBiggestRivalry', () => {
  test('returns null for empty records', () => {
    expect(getBiggestRivalry([])).toBeNull()
  })

  test('identifies the most frequent matchup', () => {
    const rivalry = getBiggestRivalry(RECORDS)
    // Alice vs Bob appears 3 times (2 goals + 1 saved)
    expect(rivalry!.shooterName).toBe('Alice')
    expect(rivalry!.keeperName).toBe('Bob')
    expect(rivalry!.encounters).toBe(3)
  })
})

describe('getBusiestDay', () => {
  test('returns null for empty records', () => {
    expect(getBusiestDay([])).toBeNull()
  })

  test('finds the day with most penalties', () => {
    const moreRecords: PenaltyRecord[] = [
      ...RECORDS,
      makeRecord({ date: new Date('2024-02-01') }),
      makeRecord({ date: new Date('2024-02-01') }),
      makeRecord({ date: new Date('2024-02-01') }),
      makeRecord({ date: new Date('2024-02-01') }),
      makeRecord({ date: new Date('2024-02-01') }),
      makeRecord({ date: new Date('2024-02-01') }),
    ]
    const busiest = getBusiestDay(moreRecords)!
    expect(busiest.penaltyCount).toBe(6)
  })
})

describe('getRecentSession', () => {
  test('returns null for empty records', () => {
    expect(getRecentSession([])).toBeNull()
  })

  test('returns stats for the most recent date', () => {
    const records: PenaltyRecord[] = [
      makeRecord({ date: new Date('2024-01-01'), status: 'goal' }),
      makeRecord({ date: new Date('2024-01-01'), status: 'saved' }),
      makeRecord({ date: new Date('2024-01-10'), status: 'out' }),
    ]
    const session = getRecentSession(records)!
    expect(session.goals).toBe(0)
    expect(session.saves).toBe(0)
    expect(session.outs).toBe(1)
  })
})
