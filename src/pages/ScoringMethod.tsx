/**
 * Scoring Method Page
 * 
 * Main page component for the scoring system with interactive charts.
 * Follows composition principle - builds complex UI from simple components.
 */

import React, { useState, useCallback, useMemo, useRef, useEffect } from 'react';
import { LineChart, BarChart, PieChart } from '../components/charts';
import { ScoreResultDisplay } from '../components/ScoreResultDisplay';
import { useScoringData } from '../hooks/useScoringData';
import { MockDataService } from '../lib/data';
import { ScoringCalculator, ScoreData, ScoreResult } from '../lib/scoring';
import { LoadingSpinner, ChartSkeleton, ScoreAnnouncer } from '../components/ui';
import styles from './ScoringMethod.module.css';

export default function ScoringMethod() {
  // State for current score calculation
  const [currentScore, setCurrentScore] = useState<ScoreData>({
    accuracy: 85,
    speed: 25,
    consistency: 78,
    difficulty: 6
  });

  // Debounced score state for performance
  const [debouncedScore, setDebouncedScore] = useState<ScoreData>(currentScore);
  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // State for score history and leaderboard
  const [scoreHistory, setScoreHistory] = useState<ScoreData[]>([]);
  const [leaderboard, setLeaderboard] = useState<ScoreResult[]>([]);

  // Use scoring data hook
  const {
    historicalData,
    leaderboard: apiLeaderboard,
    scoreDistribution,
    loading,
    error,
    loadHistoricalData,
    loadLeaderboard,
    loadScoreDistribution
  } = useScoringData(MockDataService);

  // Calculate current score
  const calculateScore = useCallback(() => {
    const result = ScoringCalculator.calculateScore(debouncedScore);
    
    // Add to history
    setScoreHistory(prev => [...prev, debouncedScore]);
    
    // Add to leaderboard
    setLeaderboard(prev => {
      const newLeaderboard = [...prev, result].sort((a, b) => b.totalScore - a.totalScore);
      return newLeaderboard.slice(0, 10); // Keep top 10
    });
  }, [debouncedScore]);

  const updateScore = useCallback((field: keyof ScoreData, value: number) => {
    setCurrentScore(prev => ({ ...prev, [field]: value }));
    
    // Debounce the score calculation to prevent excessive re-renders
    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }
    
    debounceTimeoutRef.current = setTimeout(() => {
      setDebouncedScore(prev => ({ ...prev, [field]: value }));
    }, 150); // 150ms debounce
  }, []);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, []);

  // Handle keyboard navigation for sliders
  const handleSliderKeyDown = useCallback((e: React.KeyboardEvent<HTMLInputElement>, field: keyof ScoreData) => {
    const currentValue = currentScore[field];
    const step = field === 'speed' ? 1 : 1;
    const min = field === 'speed' ? 10 : field === 'difficulty' ? 1 : 0;
    const max = field === 'speed' ? 60 : field === 'difficulty' ? 10 : 100;

    switch (e.key) {
      case 'ArrowUp':
      case 'ArrowRight':
        e.preventDefault();
        updateScore(field, Math.min(currentValue + step, max));
        break;
      case 'ArrowDown':
      case 'ArrowLeft':
        e.preventDefault();
        updateScore(field, Math.max(currentValue - step, min));
        break;
      case 'Home':
        e.preventDefault();
        updateScore(field, min);
        break;
      case 'End':
        e.preventDefault();
        updateScore(field, max);
        break;
    }
  }, [currentScore, updateScore]);

  // Generate chart data with memoization for performance
  const trendData = React.useMemo(() => 
    scoreHistory.map((data, index) => ({
      name: `Game ${index + 1}`,
      value: ScoringCalculator.calculateScore(data).totalScore
    })), [scoreHistory]
  );

  const comparisonData = React.useMemo(() => 
    scoreHistory.slice(-5).map((data, index) => {
      const result = ScoringCalculator.calculateScore(data);
      return {
        name: `Game ${index + 1}`,
        baseScore: result.baseScore,
        accuracyBonus: result.accuracyBonus,
        speedBonus: result.speedBonus
      };
    }), [scoreHistory]
  );

  const distributionData = React.useMemo(() => 
    scoreDistribution.length > 0 
      ? scoreDistribution 
      : [
          { name: 'A', value: 0 },
          { name: 'B', value: 0 },
          { name: 'C', value: 0 },
          { name: 'D', value: 0 },
          { name: 'F', value: 0 }
        ], [scoreDistribution]
  );

  // Memoized current score calculation for performance
  const currentScoreResult = React.useMemo(() => 
    ScoringCalculator.calculateScore(currentScore), [currentScore]
  );

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Scoring Method</h1>
        <p className={styles.subtitle}>
          Interactive scoring system with real-time calculations and data visualization
        </p>
      </div>

      <div className={styles.content}>
        {/* Left Column: Controls and Results */}
        <div className={styles.leftColumn}>
          {/* Score Calculator */}
          <div className={styles.calculator}>
            <h2 className={styles.sectionTitle}>Score Calculator</h2>
            
            <div className={styles.controls}>
              <div className={styles.controlGroup}>
                <label className={styles.label}>
                  Accuracy: {currentScore.accuracy}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentScore.accuracy}
                  onChange={(e) => updateScore('accuracy', Number(e.target.value))}
                  onKeyDown={(e) => handleSliderKeyDown(e, 'accuracy')}
                  aria-label="Accuracy slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={currentScore.accuracy}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>
                  Speed: {currentScore.speed}s
                </label>
                <input
                  type="range"
                  min="10"
                  max="60"
                  value={currentScore.speed}
                  onChange={(e) => updateScore('speed', Number(e.target.value))}
                  onKeyDown={(e) => handleSliderKeyDown(e, 'speed')}
                  aria-label="Speed slider"
                  aria-valuemin={10}
                  aria-valuemax={60}
                  aria-valuenow={currentScore.speed}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>
                  Consistency: {currentScore.consistency}%
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={currentScore.consistency}
                  onChange={(e) => updateScore('consistency', Number(e.target.value))}
                  onKeyDown={(e) => handleSliderKeyDown(e, 'consistency')}
                  aria-label="Consistency slider"
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-valuenow={currentScore.consistency}
                  className={styles.slider}
                />
              </div>

              <div className={styles.controlGroup}>
                <label className={styles.label}>
                  Difficulty: {currentScore.difficulty}
                </label>
                <input
                  type="range"
                  min="1"
                  max="10"
                  value={currentScore.difficulty}
                  onChange={(e) => updateScore('difficulty', Number(e.target.value))}
                  onKeyDown={(e) => handleSliderKeyDown(e, 'difficulty')}
                  aria-label="Difficulty slider"
                  aria-valuemin={1}
                  aria-valuemax={10}
                  aria-valuenow={currentScore.difficulty}
                  className={styles.slider}
                />
              </div>

              <button 
                onClick={calculateScore}
                className={styles.calculateButton}
              >
                Calculate Score
              </button>
            </div>
          </div>

          {/* Current Score Result */}
          <div className={styles.result}>
            <ScoreResultDisplay score={ScoringCalculator.calculateScore(currentScore)} />
            <ScoreAnnouncer 
              score={ScoringCalculator.calculateScore(currentScore)} 
              isActive={false} 
            />
          </div>
        </div>

        {/* Right Column: Charts */}
        <div className={styles.rightColumn}>
          {/* Score Trend Chart */}
          <div className={styles.chartSection}>
            <h3 className={styles.chartTitle}>Score Trend</h3>
            <LineChart 
              data={trendData}
              color="#3b82f6"
              height={300}
            />
          </div>

          {/* Score Breakdown Chart */}
          <div className={styles.chartSection}>
            <h3 className={styles.chartTitle}>Score Breakdown</h3>
            <BarChart 
              data={comparisonData}
              colors={{
                baseScore: '#22c55e',
                accuracyBonus: '#3b82f6',
                speedBonus: '#f59e0b'
              }}
              height={300}
            />
          </div>

          {/* Grade Distribution Chart */}
          <div className={styles.chartSection}>
            <h3 className={styles.chartTitle}>Grade Distribution</h3>
            <PieChart 
              data={distributionData}
              colors={['#22c55e', '#3b82f6', '#f59e0b', '#ef4444', '#6b7280']}
              height={300}
            />
          </div>
        </div>
      </div>

      {/* Error Display */}
      {(error.historical || error.leaderboard || error.distribution) && (
        <div className={styles.errorBanner}>
          {error.historical && (
            <div className="error-item">
              <p><strong>Historical Data:</strong> {error.historical.message}</p>
              {error.historical.retryCount > 0 && (
                <button 
                  onClick={() => loadHistoricalData()}
                  className="retry-button"
                  disabled={loading.historical}
                >
                  {loading.historical ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          )}
          {error.leaderboard && (
            <div className="error-item">
              <p><strong>Leaderboard:</strong> {error.leaderboard.message}</p>
              {error.leaderboard.retryCount > 0 && (
                <button 
                  onClick={() => loadLeaderboard()}
                  className="retry-button"
                  disabled={loading.leaderboard}
                >
                  {loading.leaderboard ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          )}
          {error.distribution && (
            <div className="error-item">
              <p><strong>Score Distribution:</strong> {error.distribution.message}</p>
              {error.distribution.retryCount > 0 && (
                <button 
                  onClick={() => loadScoreDistribution()}
                  className="retry-button"
                  disabled={loading.distribution}
                >
                  {loading.distribution ? 'Retrying...' : 'Retry'}
                </button>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}