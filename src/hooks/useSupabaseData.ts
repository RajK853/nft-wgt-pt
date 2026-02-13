/**
 * Supabase Data Hook
 * 
 * KISS: Simple hook that abstracts data fetching
 * SOLID: Depends on abstraction (service), not concrete implementation
 */

import { useState, useCallback, useEffect } from 'react'
import { useAuth } from '@/auth/AuthContext'
import { SupabaseDataService } from '@/services/supabaseData'
import { MockDataService } from '@/lib/data'
import type { ScoreData, ScoreResult } from '@/lib/scoring'

export interface UseSupabaseDataOptions {
  /** Enable graceful fallback to mock data when Supabase unavailable */
  useMockFallback?: boolean
}

export interface UseSupabaseDataReturn {
  historicalData: ScoreData[]
  leaderboard: ScoreResult[]
  scoreDistribution: Array<{ name: string; value: number }>
  loading: boolean
  error: Error | null
  refetch: () => Promise<void>
}

/**
 * Hook for fetching data from Supabase with optional mock fallback
 * 
 * KISS: Single responsibility - data fetching
 * SOLID: Dependency Inversion - works with any data service
 */
export function useSupabaseData(options: UseSupabaseDataOptions = {}): UseSupabaseDataReturn {
  const { user } = useAuth()
  const [historicalData, setHistoricalData] = useState<ScoreData[]>([])
  const [leaderboard, setLeaderboard] = useState<ScoreResult[]>([])
  const [scoreDistribution, setScoreDistribution] = useState<Array<{ name: string; value: number }>>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)

  const fetchData = useCallback(async () => {
    // Determine which service to use
    const hasSupabase = Boolean(user && !options.useMockFallback)
    const targetUserId = user?.id

    setLoading(true)
    setError(null)

    try {
      if (hasSupabase && targetUserId) {
        // Use Supabase service
        const [historical, leader, distribution] = await Promise.all([
          SupabaseDataService.fetchHistoricalData(targetUserId),
          SupabaseDataService.fetchLeaderboard(),
          SupabaseDataService.fetchScoreDistribution(targetUserId)
        ])
        
        setHistoricalData(historical)
        setLeaderboard(leader)
        setScoreDistribution(distribution)
      } else {
        // Use mock service
        const [historical, leader, distribution] = await Promise.all([
          MockDataService.fetchHistoricalData(),
          MockDataService.fetchLeaderboard(),
          MockDataService.fetchScoreDistribution()
        ])
        
        setHistoricalData(historical)
        setLeaderboard(leader)
        setScoreDistribution(distribution)
      }
    } catch (err) {
      // Graceful fallback to mock data if enabled
      if (options.useMockFallback && !hasSupabase) {
        try {
          const [historical, leader, distribution] = await Promise.all([
            MockDataService.fetchHistoricalData(),
            MockDataService.fetchLeaderboard(),
            MockDataService.fetchScoreDistribution()
          ])
          
          setHistoricalData(historical)
          setLeaderboard(leader)
          setScoreDistribution(distribution)
        } catch (mockErr) {
          setError(mockErr as Error)
        }
      } else {
        setError(err as Error)
      }
    } finally {
      setLoading(false)
    }
  }, [user, options.useMockFallback])


  // Fetch on mount and when user changes
  useEffect(() => {
    fetchData()
  }, [fetchData])

  return {
    historicalData,
    leaderboard,
    scoreDistribution,
    loading,
    error,
    refetch: fetchData
  }
}
