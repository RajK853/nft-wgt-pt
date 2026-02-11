/**
 * Scoring Method Page
 * 
 * Main page component for the scoring system with interactive charts.
 * Follows composition principle - builds complex UI from simple components.
 */

import React, { useState, useCallback } from 'react';
import { LineChart } from '../components/charts/LineChart';
import { BarChart } from '../components/charts/BarChart';
import { PieChart } from '../components/charts/PieChart';
import { ScoreResultDisplay } from '../components/ScoreResultDisplay';
import { useScoringData } from '../hooks/useScoringData';
import { MockDataService } from '../lib/data';
import { ScoringCalculator, ScoreData, ScoreResult } from '../lib/scoring';
import styles from './ScoringMethod.module.css';

export default function ScoringMethod() {
  // State for current score calculation
  const [currentScore, setCurrentScore] = useState<ScoreData>({
    accuracy: 85,
    speed: 25,
    consistency: 78,
    difficulty: 6
  });

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
    const result = ScoringCalculator.calculateScore(currentScore);
    
    // Add to history
    setScoreHistory(prev => [...prev, currentScore]);
    
    // Add to leaderboard
    setLeaderboard(prev => {
      const newLeaderboard = [...prev, result].sort((a, b) => b.totalScore - a.totalScore);
      return newLeaderboard.slice(0, 10); // Keep top 10
    });
  }, [currentScore]);

  // Update score input
  const updateScore = useCallback((field: keyof ScoreData, value: number) => {
    setCurrentScore(prev => ({ ...prev, [field]: value }));
  }, []);

  // Generate chart data
  const trendData = scoreHistory.map((data, index) => ({
    name: `Game ${index + 1}`,
    value: ScoringCalculator.calculateScore(data).totalScore
  }));

  const comparisonData = scoreHistory.slice(-5).map((data, index) => {
    const result = ScoringCalculator.calculateScore(data);
    return {
      name: `Game ${index + 1}`,
      baseScore: result.baseScore,
      accuracyBonus: result.accuracyBonus,
      speedBonus: result.speedBonus
    };
  });

  const distributionData = scoreDistribution.length > 0 
    ? scoreDistribution 
    : [
        { name: 'A', value: 0 },
        { name: 'B', value: 0 },
        { name: 'C', value: 0 },
        { name: 'D', value: 0 },
        { name: 'F', value: 0 }
      ];

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
          {error.historical && <p>{error.historical}</p>}
          {error.leaderboard && <p>{error.leaderboard}</p>}
          {error.distribution && <p>{error.distribution}</p>}
        </div>
      )}
    </div>
  );
}