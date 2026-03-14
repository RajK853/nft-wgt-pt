import { useState, useCallback, useEffect } from 'react'
import { useLoading } from './useLoading'
import { getSupabaseClient } from '@/lib/supabase'
import type { PenaltyRecord, Gender } from '@/types'

// Singleton client created once at module level
const supabase = (() => {
  try {
    return getSupabaseClient()
  } catch {
    return null
  }
})()

interface UsePenaltyDataReturn {
  data: PenaltyRecord[]
  isLoading: boolean
  error: Error | null
  gender: Gender
  setGender: (gender: Gender) => void
  refresh: () => void
}

export function usePenaltyData(): UsePenaltyDataReturn {
  const { isLoading, start, stop } = useLoading(true)
  const [allData, setAllData] = useState<PenaltyRecord[]>([])
  const [error, setError] = useState<Error | null>(null)
  const [gender, setGender] = useState<Gender>('Male')

  const fetchData = useCallback(async () => {
    start()
    setError(null)

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized')
      }

      const { data: records, error: fetchError } = await supabase
        .from('game_events')
        .select('*')
        .order('date', { ascending: false })

      if (fetchError) {
        throw new Error(fetchError.message)
      }

      const mappedRecords: PenaltyRecord[] = (records || []).map((r: Record<string, unknown>) => ({
        id: r.id as string,
        date: new Date(r.date as string),
        shooterName: (r.player_name || r.shooterName || r.shooter_name) as string,
        keeperName: (r.keeper_name || r.keeperName) as string,
        status: r.status as PenaltyRecord['status'],
        remark: r.remark as string | undefined,
        gender: r.gender as Gender | undefined,
      }))

      setAllData(mappedRecords)
    } catch (err) {
      setError(err instanceof Error ? err : new Error('Failed to fetch data'))
    } finally {
      stop()
    }
  }, [start, stop])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  const filteredData = allData.filter(r => !r.gender || r.gender === gender)

  return {
    data: filteredData,
    isLoading,
    error,
    gender,
    setGender,
    refresh: fetchData,
  }
}
