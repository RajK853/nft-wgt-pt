/**
 * Scoring Data Hook
 * 
 * Custom hook for data fetching and state management.
 * Follows Dependency Inversion principle - depends on abstractions.
 */

import { useState, useCallback, useEffect } from 'react';
import { ScoreData, ScoreResult } from '../lib/scoring';

export interface ScoringDataService {
  fetchHistoricalData(): Promise<ScoreData[]>;
  fetchLeaderboard(): Promise<ScoreResult[]>;
  fetchScoreDistribution(): Promise<Array<{ name: string; value: number }>>;
}

interface UseScoringDataReturn {
  // Data state
  historicalData: ScoreData[];
  leaderboard: ScoreResult[];
  scoreDistribution: Array<{ name: string; value: number }>;
  
  // Loading states
  loading: {
    historical: boolean;
    leaderboard: boolean;
    distribution: boolean;
  };
  
  // Error states
  error: {
    historical: string | null;
    leaderboard: string | null;
    distribution: string | null;
  };
  
  // Actions
  loadHistoricalData: () => Promise<void>;
  loadLeaderboard: () => Promise<void>;
  loadScoreDistribution: () => Promise<void>;
  refreshAll: () => Promise<void>;
}

/**
 * Custom hook for managing scoring data
 */
export function useScoringData(service: ScoringDataService): UseScoringDataReturn {
  // State management
  const [historicalData, setHistoricalData] = useState<ScoreData[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreResult[]>([]);
  const [scoreDistribution, setScoreDistribution] = useState<Array<{ name: string; value: number }>>([]);
  
  const [loading, setLoading] = useState({
    historical: false,
    leaderboard: false,
    distribution: false
  });
  
  const [error, setError] = useState({
    historical: null as string | null,
    leaderboard: null as string | null,
    distribution: null as string | null
  });

  // Load historical data
  const loadHistoricalData = useCallback(async () => {
    setLoading(prev => ({ ...prev, historical: true }));
    setError(prev => ({ ...prev, historical: null }));
    
    try {
      const data = await service.fetchHistoricalData();
      setHistoricalData(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        historical: 'Failed to load historical data. Please check your connection and try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, historical: false }));
    }
  }, [service]);

  // Load leaderboard
  const loadLeaderboard = useCallback(async () => {
    setLoading(prev => ({ ...prev, leaderboard: true }));
    setError(prev => ({ ...prev, leaderboard: null }));
    
    try {
      const data = await service.fetchLeaderboard();
      setLeaderboard(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        leaderboard: 'Failed to load leaderboard. Please check your connection and try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, leaderboard: false }));
    }
  }, [service]);

  // Load score distribution
  const loadScoreDistribution = useCallback(async () => {
    setLoading(prev => ({ ...prev, distribution: true }));
    setError(prev => ({ ...prev, distribution: null }));
    
    try {
      const data = await service.fetchScoreDistribution();
      setScoreDistribution(data);
    } catch (err) {
      setError(prev => ({ 
        ...prev, 
        distribution: 'Failed to load score distribution. Please check your connection and try again.' 
      }));
    } finally {
      setLoading(prev => ({ ...prev, distribution: false }));
    }
  }, [service]);

  // Refresh all data
  const refreshAll = useCallback(async () => {
    await Promise.all([
      loadHistoricalData(),
      loadLeaderboard(),
      loadScoreDistribution()
    ]);
  }, [loadHistoricalData, loadLeaderboard, loadScoreDistribution]);

  // Initial data loading
  useEffect(() => {
    refreshAll();
  }, [refreshAll]);

  return {
    // Data
    historicalData,
    leaderboard,
    scoreDistribution,
    
    // Loading states
    loading,
    
    // Error states
    error,
    
    // Actions
    loadHistoricalData,
    loadLeaderboard,
    loadScoreDistribution,
    refreshAll
  };
}