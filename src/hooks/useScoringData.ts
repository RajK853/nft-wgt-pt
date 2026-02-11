/**
 * Scoring Data Hook
 * Simple data fetching hook with KISS principle
 */

import { useState, useCallback, useEffect } from 'react';
import { ScoreData, ScoreResult } from '../lib/scoring';

export interface ScoringDataService {
  fetchHistoricalData(): Promise<ScoreData[]>;
  fetchLeaderboard(): Promise<ScoreResult[]>;
  fetchScoreDistribution(): Promise<Array<{ name: string; value: number }>>;
}

export interface ErrorDetails {
  message: string;
  type: 'network' | 'timeout' | 'validation' | 'unknown';
  retryCount: number;
}

interface UseScoringDataReturn {
  historicalData: ScoreData[];
  leaderboard: ScoreResult[];
  scoreDistribution: Array<{ name: string; value: number }>;
  loading: { historical: boolean; leaderboard: boolean; distribution: boolean };
  error: { historical: ErrorDetails | null; leaderboard: ErrorDetails | null; distribution: ErrorDetails | null };
  loadHistoricalData: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadScoreDistribution: () => Promise<void>;
  refreshAll: () => Promise<void>;
  retryHistoricalData: () => Promise<void>;
  retryLeaderboard: () => Promise<void>;
  retryScoreDistribution: () => Promise<void>;
}

export function useScoringData(service: ScoringDataService): UseScoringDataReturn {
  const [historicalData, setHistoricalData] = useState<ScoreData[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreResult[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<Array<{ name: string; value: number }>>([]);
  
  const [loading, setLoading] = useState({ historical: false, leaderboard: false, distribution: false });
  const [error, setError] = useState({ historical: null as ErrorDetails | null, leaderboard: null as ErrorDetails | null, distribution: null as ErrorDetails | null });

  const createError = (message: string, type: ErrorDetails['type'], retryCount = 0): ErrorDetails => ({
    message, type, retryCount
  });

  const getErrorType = (err: any): ErrorDetails['type'] => {
    if (err.name === 'TypeError' || err.message?.includes('fetch')) return 'network';
    if (err.message?.includes('timeout')) return 'timeout';
    if (err.message?.includes('validation')) return 'validation';
    return 'unknown';
  };

  const loadHistoricalData = useCallback(async (retryCount = 0) => {
    setLoading(prev => ({ ...prev, historical: true }));
    setError(prev => ({ ...prev, historical: null }));
    
    try {
      const data = await service.fetchHistoricalData();
      setHistoricalData(data);
    } catch (err) {
      const type = getErrorType(err);
      const message = type === 'network' ? 'Network error: Unable to connect to the server.' : 
                     type === 'timeout' ? 'Request timeout: The server is taking too long to respond.' :
                     type === 'validation' ? 'Data validation error: Received invalid data.' :
                     'An unexpected error occurred while loading historical data.';
      
      setError(prev => ({ ...prev, historical: createError(message, type, retryCount) }));
    } finally {
      setLoading(prev => ({ ...prev, historical: false }));
    }
  }, [service]);

  const loadLeaderboard = useCallback(async (retryCount = 0) => {
    setLoading(prev => ({ ...prev, leaderboard: true }));
    setError(prev => ({ ...prev, leaderboard: null }));
    
    try {
      const data = await service.fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      const type = getErrorType(err);
      const message = type === 'network' ? 'Network error: Unable to connect to the server.' : 
                     type === 'timeout' ? 'Request timeout: The server is taking too long to respond.' :
                     type === 'validation' ? 'Data validation error: Received invalid data.' :
                     'An unexpected error occurred while loading leaderboard.';
      
      setError(prev => ({ ...prev, leaderboard: createError(message, type, retryCount) }));
    } finally {
      setLoading(prev => ({ ...prev, leaderboard: false }));
    }
  }, [service]);

  const loadScoreDistribution = useCallback(async (retryCount = 0) => {
    setLoading(prev => ({ ...prev, distribution: true }));
    setError(prev => ({ ...prev, distribution: null }));
    
    try {
      const data = await service.fetchScoreDistribution();
      setScoreDistribution(data);
    } catch (err) {
      const type = getErrorType(err);
      const message = type === 'network' ? 'Network error: Unable to connect to the server.' : 
                     type === 'timeout' ? 'Request timeout: The server is taking too long to respond.' :
                     type === 'validation' ? 'Data validation error: Received invalid data.' :
                     'An unexpected error occurred while loading score distribution.';
      
      setError(prev => ({ ...prev, distribution: createError(message, type, retryCount) }));
    } finally {
      setLoading(prev => ({ ...prev, distribution: false }));
    }
  }, [service]);

  const retryHistoricalData = useCallback(async () => {
    const currentError = error.historical;
    if (!currentError || currentError.retryCount >= 3) return;
    
    const delay = Math.pow(2, currentError.retryCount) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    await loadHistoricalData(currentError.retryCount + 1);
  }, [error.historical, loadHistoricalData]);

  const retryLeaderboard = useCallback(async () => {
    const currentError = error.leaderboard;
    if (!currentError || currentError.retryCount >= 3) return;
    
    const delay = Math.pow(2, currentError.retryCount) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    await loadLeaderboard(currentError.retryCount + 1);
  }, [error.leaderboard, loadLeaderboard]);

  const retryScoreDistribution = useCallback(async () => {
    const currentError = error.distribution;
    if (!currentError || currentError.retryCount >= 3) return;
    
    const delay = Math.pow(2, currentError.retryCount) * 1000;
    await new Promise(resolve => setTimeout(resolve, delay));
    await loadScoreDistribution(currentError.retryCount + 1);
  }, [error.distribution, loadScoreDistribution]);

  const refreshAll = useCallback(async () => {
    await Promise.all([loadHistoricalData(), loadLeaderboard(), loadScoreDistribution()]);
  }, [loadHistoricalData, loadLeaderboard, loadScoreDistribution]);

  useEffect(() => { refreshAll(); }, [refreshAll]);

  return {
    historicalData, leaderboard, scoreDistribution, loading, error,
    loadHistoricalData, loadLeaderboard, loadScoreDistribution, refreshAll,
    retryHistoricalData, retryLeaderboard, retryScoreDistribution
  };
}
