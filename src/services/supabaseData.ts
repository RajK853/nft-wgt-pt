/**
 * Supabase Data Service
 * 
 * KISS: Single responsibility - handles all Supabase database operations
 * SOLID: Open/Closed - extend with new methods without modifying existing code
 */

import { createSupabaseClient } from '../lib/supabase'

import type { ScoreData, ScoreResult } from '../lib/scoring'


// Initialize client
const supabase = createSupabaseClient()

/**
 * Score record type (mirrors Supabase table)
 */
interface ScoreRecord {
  id: string
  user_id: string
  accuracy: number
  speed: number
  consistency: number
  difficulty: number
  base_score: number
  accuracy_bonus: number
  speed_bonus: number
  total_score: number
  grade: 'A' | 'B' | 'C' | 'D' | 'F'
  created_at: string
}

/**
 * Convert database record to ScoreData
 */
function toScoreData(record: ScoreRecord): ScoreData {
  return {
    accuracy: record.accuracy,
    speed: record.speed,
    consistency: record.consistency,
    difficulty: record.difficulty
  }
}

/**
 * Convert database record to ScoreResult
 */
function toScoreResult(record: ScoreRecord): ScoreResult {
  return {
    baseScore: record.base_score,
    accuracyBonus: record.accuracy_bonus,
    speedBonus: record.speed_bonus,
    totalScore: record.total_score,
    grade: record.grade
  }
}

/**
 * Supabase Data Service - CRUD operations
 * 
 * KISS: Each function has single responsibility
 */
export const SupabaseDataService = {
  /**
   * Fetch historical score data for a user
   */
  async fetchHistoricalData(userId: string): Promise<ScoreData[]> {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(20)

    if (error) {
      console.error('Error fetching historical data:', error)
      throw new Error(`Failed to fetch historical data: ${error.message}`)
    }

    return (data as ScoreRecord[] | null ?? []).map(toScoreData)
  },

  /**
   * Fetch leaderboard data
   */
  async fetchLeaderboard(limit = 10): Promise<ScoreResult[]> {
    const { data, error } = await supabase
      .from('scores')
      .select('*')
      .order('total_score', { ascending: false })
      .limit(limit)

    if (error) {
      console.error('Error fetching leaderboard:', error)
      throw new Error(`Failed to fetch leaderboard: ${error.message}`)
    }

    return (data as ScoreRecord[] | null ?? []).map(toScoreResult)
  },

  /**
   * Fetch score distribution (grade breakdown)
   */
  async fetchScoreDistribution(userId?: string): Promise<Array<{ name: string; value: number }>> {
    let query = supabase.from('scores').select('grade')

    if (userId) {
      query = query.eq('user_id', userId)
    }

    const { data, error } = await query

    if (error) {
      console.error('Error fetching score distribution:', error)
      throw new Error(`Failed to fetch score distribution: ${error.message}`)
    }

    const distribution = { A: 0, B: 0, C: 0, D: 0, F: 0 }
    
    const records = data as Array<{ grade: string }> | null ?? []
    records.forEach(record => {
      const grade = record.grade as keyof typeof distribution
      if (grade in distribution) {
        distribution[grade]++
      }
    })

    return Object.entries(distribution).map(([name, value]) => ({ name, value }))
  },

  /**
   * Save a new score record
   */
  async saveScore(userId: string, scoreData: ScoreData, scoreResult: ScoreResult): Promise<ScoreResult> {
    const { data, error } = await supabase
      .from('scores')
      .insert({
        user_id: userId,
        accuracy: scoreData.accuracy,
        speed: scoreData.speed,
        consistency: scoreData.consistency,
        difficulty: scoreData.difficulty,
        base_score: scoreResult.baseScore,
        accuracy_bonus: scoreResult.accuracyBonus,
        speed_bonus: scoreResult.speedBonus,
        total_score: scoreResult.totalScore,
        grade: scoreResult.grade
      })
      .select()
      .single()

    if (error) {
      console.error('Error saving score:', error)
      throw new Error(`Failed to save score: ${error.message}`)
    }

    return toScoreResult(data as ScoreRecord)
  },

  /**
   * Delete a score record
   */
  async deleteScore(scoreId: string): Promise<void> {
    const { error } = await supabase
      .from('scores')
      .delete()
      .eq('id', scoreId)

    if (error) {
      console.error('Error deleting score:', error)
      throw new Error(`Failed to delete score: ${error.message}`)
    }
  },

  /**
   * Update a score record
   */
  async updateScore(
    scoreId: string,
    scoreData: Partial<ScoreData>,
    scoreResult?: ScoreResult
  ): Promise<ScoreResult> {
    const updateData: Record<string, unknown> = {}

    if (scoreData.accuracy !== undefined) updateData.accuracy = scoreData.accuracy
    if (scoreData.speed !== undefined) updateData.speed = scoreData.speed
    if (scoreData.consistency !== undefined) updateData.consistency = scoreData.consistency
    if (scoreData.difficulty !== undefined) updateData.difficulty = scoreData.difficulty

    if (scoreResult) {
      updateData.base_score = scoreResult.baseScore
      updateData.accuracy_bonus = scoreResult.accuracyBonus
      updateData.speed_bonus = scoreResult.speedBonus
      updateData.total_score = scoreResult.totalScore
      updateData.grade = scoreResult.grade
    }

    const { data, error } = await supabase
      .from('scores')
      .update(updateData)
      .eq('id', scoreId)
      .select()
      .single()

    if (error) {
      console.error('Error updating score:', error)
      throw new Error(`Failed to update score: ${error.message}`)
    }

    return toScoreResult(data as ScoreRecord)
  },

  /**
   * Get user's total stats
   */
  async fetchUserStats(userId: string): Promise<{
    totalGames: number
    averageScore: number
    bestScore: number
  }> {
    const { data, error } = await supabase
      .from('scores')
      .select('total_score')
      .eq('user_id', userId)

    if (error) {
      console.error('Error fetching user stats:', error)
      throw new Error(`Failed to fetch user stats: ${error.message}`)
    }

    const records = data as Array<{ total_score: number }> | null ?? []
    const scores = records.map(d => d.total_score)
    const totalGames = scores.length
    const averageScore = totalGames > 0 
      ? Math.round(scores.reduce((a, b) => a + b, 0) / totalGames)
      : 0
    const bestScore = totalGames > 0 ? Math.max(...scores) : 0

    return { totalGames, averageScore, bestScore }
  }
}
