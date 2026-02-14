/**
 * usePenaltyData Hook
 * Custom hook for fetching penalty data from Supabase
 * KISS: Simple data fetching with loading/error states
 */

import { useState, useCallback, useEffect, useMemo } from 'react'
import { getSupabaseClient } from '@/lib/supabase'
import { PenaltyRecord, Gender } from '@/types'

interface UsePenaltyDataReturn {
  data: PenaltyRecord[]
  loading: boolean
  error: Error | null
  gender: Gender
  setGender: (gender: Gender) => void
  refresh: () => void
}

export function usePenaltyData(): UsePenaltyDataReturn {
  const [data, setData] = useState<PenaltyRecord[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | null>(null)
  const [gender, setGender] = useState<Gender>('Male')
  
  const supabase = useMemo(() => {
    try {
      return getSupabaseClient()
    } catch (e) {
      console.error('Failed to create Supabase client:', e)
      return null
    }
  }, [])
  
  const fetchData = useCallback(async () => {
    setLoading(true)
    setError(null)
    
    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }
      
      // Fetch from game_events table
      const { data: records, error: fetchError } = await supabase
        .from('game_events')
        .select('*')
        .order('date', { ascending: false })
      
      if (fetchError) {
        throw new Error(fetchError.message)
      }
      
      // Map to our PenaltyRecord type
      const mappedRecords: PenaltyRecord[] = (records || []).map((r: any) => ({
        id: r.id,
        date: new Date(r.date),
        shooterName: r.player_name || r.shooterName || r.shooter_name,
        keeperName: r.keeper_name || r.keeperName,
        status: r.status,
        remark: r.remark,
        gender: r.gender
      }))
      
      setData(mappedRecords)
    } catch (err) {
      console.error('Error fetching penalty data:', err)
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      setLoading(false)
    }
  }, [supabase])
  
  useEffect(() => {
    fetchData()
  }, [fetchData])
  
  // Filter by gender
  const filteredData = data.filter(r => !r.gender || r.gender === gender)
  
  return {
    data: filteredData,
    loading,
    error,
    gender,
    setGender: (g: Gender) => {
      setGender(g)
    },
    refresh: fetchData
  }
}
