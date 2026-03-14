import { useState, useCallback } from 'react'

export function useLoading(initialState = false) {
  const [isLoading, setIsLoading] = useState(initialState)

  const start = useCallback(() => setIsLoading(true), [])
  const stop = useCallback(() => setIsLoading(false), [])
  const toggle = useCallback(() => setIsLoading(prev => !prev), [])

  return {
    isLoading,
    start,
    stop,
    toggle,
    // Higher-order function for async operations
    withLoading: async <T>(fn: () => Promise<T>): Promise<T> => {
      start()
      try {
        return await fn()
      } finally {
        stop()
      }
    }
  }
}