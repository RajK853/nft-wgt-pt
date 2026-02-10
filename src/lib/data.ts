/**
 * Sample Data Generator
 * 
 * Generates realistic mock data for development and testing.
 * Pure functions that are easy to test and maintain.
 */

import { ScoreData, ScoreResult } from './scoring';
import { ScoringCalculator } from './scoring';

export interface GameSession {
  id: string;
  timestamp: Date;
  player: string;
  data: ScoreData;
  result: ScoreResult;
}

/**
 * Generate realistic score data for testing
 */
export function generateScoreData(): ScoreData {
  return {
    accuracy: Math.floor(Math.random() * 100) + 1,
    speed: Math.floor(Math.random() * 50) + 10,
    consistency: Math.floor(Math.random() * 100) + 1,
    difficulty: Math.floor(Math.random() * 9) + 1
  };
}

/**
 * Generate historical game sessions
 */
export function generateHistoricalData(count: number = 20): GameSession[] {
  const sessions: GameSession[] = [];
  const players = ['Player1', 'Player2', 'Player3', 'Player4', 'Player5'];
  
  for (let i = 0; i < count; i++) {
    const data = generateScoreData();
    const result = ScoringCalculator.calculateScore(data);
    const player = players[Math.floor(Math.random() * players.length)];
    
    sessions.push({
      id: `session-${i + 1}`,
      timestamp: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000), // Last 7 days
      player,
      data,
      result
    });
  }
  
  // Sort by timestamp
  return sessions.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
}

/**
 * Generate leaderboard data
 */
export function generateLeaderboard(count: number = 10): GameSession[] {
  const sessions = generateHistoricalData(count * 2);
  
  // Get top scores
  return sessions
    .sort((a, b) => b.result.totalScore - a.result.totalScore)
    .slice(0, count);
}

/**
 * Generate score distribution data for pie chart
 */
export function generateScoreDistribution(sessions: GameSession[]): Array<{ name: string; value: number }> {
  const distribution = {
    A: 0,
    B: 0,
    C: 0,
    D: 0,
    F: 0
  };
  
  sessions.forEach(session => {
    distribution[session.result.grade]++;
  });
  
  return Object.entries(distribution).map(([name, value]) => ({
    name,
    value
  }));
}

/**
 * Generate trend data for line chart
 */
export function generateTrendData(sessions: GameSession[]): Array<{ name: string; value: number }> {
  return sessions.map((session, index) => ({
    name: `Game ${index + 1}`,
    value: session.result.totalScore
  }));
}

/**
 * Generate comparison data for bar chart
 */
export function generateComparisonData(sessions: GameSession[]): Array<{
  name: string;
  baseScore: number;
  accuracyBonus: number;
  speedBonus: number;
}> {
  return sessions.slice(0, 5).map((session, index) => ({
    name: `Game ${index + 1}`,
    baseScore: session.result.baseScore,
    accuracyBonus: session.result.accuracyBonus,
    speedBonus: session.result.speedBonus
  }));
}

/**
 * Mock data service for development
 */
export const MockDataService = {
  async fetchHistoricalData(): Promise<ScoreData[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500));
    return generateHistoricalData(15).map(session => session.data);
  },

  async fetchLeaderboard(): Promise<ScoreResult[]> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 300));
    return generateLeaderboard(8).map(session => session.result);
  },

  async fetchScoreDistribution(): Promise<Array<{ name: string; value: number }>> {
    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 200));
    const sessions = generateHistoricalData(50);
    return generateScoreDistribution(sessions);
  }
};