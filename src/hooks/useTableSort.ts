import { useState, useCallback } from 'react'

interface UseTableSortReturn {
  sortKey: string
  sortDirection: 'asc' | 'desc'
  handleSort: (key: string) => void
}

/**
 * Shared hook for DataTable column sorting state.
 * Toggles direction when the same column is clicked; resets to 'desc' for new columns.
 */
export function useTableSort(defaultKey = 'score'): UseTableSortReturn {
  const [sortKey, setSortKey] = useState(defaultKey)
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc')

  const handleSort = useCallback((key: string) => {
    if (sortKey === key) {
      setSortDirection(prev => (prev === 'asc' ? 'desc' : 'asc'))
    } else {
      setSortKey(key)
      setSortDirection('desc')
    }
  }, [sortKey])

  return { sortKey, sortDirection, handleSort }
}
