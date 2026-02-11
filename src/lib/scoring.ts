/**
 * Scoring Logic Module
 * 
 * Pure functions for mathematical calculations following SOLID principles.
 * Single Responsibility: Each function has one clear purpose.
 * Open/Closed: Easy to extend with new scoring rules.
 */

export interface ScoreData {
  accuracy: number; // 0-100
  speed: number;   // seconds
  consistency: number; // 0-100
  difficulty: number;  // 1-10
}

export interface ScoreResult {
  baseScore: number;
  accuracyBonus: number;
  speedBonus: number;
  totalScore: number;
  grade: 'A' | 'B' | 'C' | 'D' | 'F';
}

/**
 * ScoringCalculator - Pure functions for score calculations
 * 
 * This class contains static methods that are pure functions,
 * making them easy to test and maintain.
 */
export class ScoringCalculator {
  /**
   * Calculate complete score with all bonuses and grade
   */
  static calculateScore(data: ScoreData): ScoreResult {
    const baseScore = this.calculateBaseScore(data);
    const accuracyBonus = this.calculateAccuracyBonus(data.accuracy);
    const speedBonus = this.calculateSpeedBonus(data.speed, data.difficulty);
    const totalScore = baseScore + accuracyBonus + speedBonus;
    const grade = this.calculateGrade(totalScore);

    return {
      baseScore,
      accuracyBonus,
      speedBonus,
      totalScore,
      grade
    };
  }

  /**
   * Calculate base score from accuracy and difficulty
   */
  private static calculateBaseScore(data: ScoreData): number {
    return data.accuracy * data.difficulty * 10;
  }

  /**
   * Calculate accuracy bonus based on performance tiers
   */
  private static calculateAccuracyBonus(accuracy: number): number {
    if (accuracy >= 90) return 100;
    if (accuracy >= 70) return 50;
    return 0;
  }

  /**
   * Calculate speed bonus based on difficulty level
   */
  private static calculateSpeedBonus(speed: number, difficulty: number): number {
    const threshold = 30 - (difficulty * 2); // Harder = faster required
    return speed <= threshold ? 50 : 0;
  }

  /**
   * Calculate letter grade based on total score
   */
  private static calculateGrade(score: number): 'A' | 'B' | 'C' | 'D' | 'F' {
    if (score >= 900) return 'A';
    if (score >= 750) return 'B';
    if (score >= 600) return 'C';
    if (score >= 400) return 'D';
    return 'F';
  }
}

/**
 * Utility functions for score analysis
 */
export const ScoreUtils = {
  /**
   * Calculate average score from multiple results
   */
  calculateAverageScore(results: ScoreResult[]): number {
    if (results.length === 0) return 0;
    const total = results.reduce((sum, result) => sum + result.totalScore, 0);
    return total / results.length;
  },

  /**
   * Get grade distribution from score results
   */
  getGradeDistribution(results: ScoreResult[]): Record<string, number> {
    return results.reduce((acc, result) => {
      acc[result.grade] = (acc[result.grade] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
  },

  /**
   * Find best score from results
   */
  findBestScore(results: ScoreResult[]): ScoreResult | null {
    if (results.length === 0) return null;
    return results.reduce((best, current) => 
      current.totalScore > best.totalScore ? current : best
    );
  }
};