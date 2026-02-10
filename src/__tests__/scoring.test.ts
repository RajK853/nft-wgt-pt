/**
 * Scoring Logic Tests
 * 
 * Comprehensive tests for mathematical accuracy and scoring calculations.
 * Follows KISS principle with clear, readable test cases.
 */

import { ScoringCalculator, ScoreData, ScoreResult, ScoreUtils } from '../lib/scoring';

describe('ScoringCalculator', () => {
  describe('calculateScore', () => {
    test('should calculate base score correctly', () => {
      const data: ScoreData = { accuracy: 80, speed: 25, consistency: 75, difficulty: 5 };
      const result = ScoringCalculator.calculateScore(data);
      
      // Base score = accuracy * difficulty * 10 = 80 * 5 * 10 = 4000
      expect(result.baseScore).toBe(4000);
      expect(result.totalScore).toBeGreaterThan(4000);
    });

    test('should apply accuracy bonus for high accuracy', () => {
      const data: ScoreData = { accuracy: 95, speed: 25, consistency: 75, difficulty: 5 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.accuracyBonus).toBe(100);
    });

    test('should apply accuracy bonus for medium accuracy', () => {
      const data: ScoreData = { accuracy: 80, speed: 25, consistency: 75, difficulty: 5 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.accuracyBonus).toBe(50);
    });

    test('should not apply accuracy bonus for low accuracy', () => {
      const data: ScoreData = { accuracy: 60, speed: 25, consistency: 75, difficulty: 5 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.accuracyBonus).toBe(0);
    });

    test('should calculate speed bonus for fast completion', () => {
      const data: ScoreData = { accuracy: 80, speed: 15, consistency: 75, difficulty: 6 };
      const result = ScoringCalculator.calculateScore(data);
      
      // Threshold = 30 - (difficulty * 2) = 30 - 12 = 18
      // Speed 15 <= 18, so bonus should be applied
      expect(result.speedBonus).toBe(50);
    });

    test('should not calculate speed bonus for slow completion', () => {
      const data: ScoreData = { accuracy: 80, speed: 25, consistency: 75, difficulty: 6 };
      const result = ScoringCalculator.calculateScore(data);
      
      // Threshold = 30 - (difficulty * 2) = 30 - 12 = 18
      // Speed 25 > 18, so no bonus
      expect(result.speedBonus).toBe(0);
    });

    test('should calculate correct grade for excellent score', () => {
      const data: ScoreData = { accuracy: 95, speed: 15, consistency: 90, difficulty: 8 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.grade).toBe('A');
      expect(result.totalScore).toBeGreaterThan(900);
    });

    test('should calculate correct grade for good score', () => {
      const data: ScoreData = { accuracy: 85, speed: 20, consistency: 80, difficulty: 6 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.grade).toBe('B');
      expect(result.totalScore).toBeGreaterThanOrEqual(750);
      expect(result.totalScore).toBeLessThan(900);
    });

    test('should calculate correct grade for average score', () => {
      const data: ScoreData = { accuracy: 75, speed: 25, consistency: 70, difficulty: 5 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.grade).toBe('C');
      expect(result.totalScore).toBeGreaterThanOrEqual(600);
      expect(result.totalScore).toBeLessThan(750);
    });

    test('should calculate correct grade for poor score', () => {
      const data: ScoreData = { accuracy: 60, speed: 35, consistency: 60, difficulty: 4 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.grade).toBe('D');
      expect(result.totalScore).toBeGreaterThanOrEqual(400);
      expect(result.totalScore).toBeLessThan(600);
    });

    test('should calculate correct grade for failing score', () => {
      const data: ScoreData = { accuracy: 40, speed: 45, consistency: 40, difficulty: 2 };
      const result = ScoringCalculator.calculateScore(data);
      
      expect(result.grade).toBe('F');
      expect(result.totalScore).toBeLessThan(400);
    });

    test('should handle edge cases', () => {
      // Minimum values
      const minData: ScoreData = { accuracy: 0, speed: 10, consistency: 0, difficulty: 1 };
      const minResult = ScoringCalculator.calculateScore(minData);
      expect(minResult.totalScore).toBe(0);
      expect(minResult.grade).toBe('F');

      // Maximum values
      const maxData: ScoreData = { accuracy: 100, speed: 10, consistency: 100, difficulty: 10 };
      const maxResult = ScoringCalculator.calculateScore(maxData);
      expect(maxResult.totalScore).toBeGreaterThan(900);
      expect(maxResult.grade).toBe('A');
    });
  });
});

describe('ScoreUtils', () => {
  describe('calculateAverageScore', () => {
    test('should calculate average correctly', () => {
      const results: ScoreResult[] = [
        { baseScore: 1000, accuracyBonus: 100, speedBonus: 50, totalScore: 1150, grade: 'A' },
        { baseScore: 800, accuracyBonus: 50, speedBonus: 0, totalScore: 850, grade: 'B' },
        { baseScore: 600, accuracyBonus: 0, speedBonus: 50, totalScore: 650, grade: 'C' }
      ];
      
      const average = ScoreUtils.calculateAverageScore(results);
      expect(average).toBe(883.3333333333334);
    });

    test('should return 0 for empty array', () => {
      const average = ScoreUtils.calculateAverageScore([]);
      expect(average).toBe(0);
    });
  });

  describe('getGradeDistribution', () => {
    test('should count grade distribution correctly', () => {
      const results: ScoreResult[] = [
        { baseScore: 1000, accuracyBonus: 100, speedBonus: 50, totalScore: 1150, grade: 'A' },
        { baseScore: 800, accuracyBonus: 50, speedBonus: 0, totalScore: 850, grade: 'B' },
        { baseScore: 600, accuracyBonus: 0, speedBonus: 50, totalScore: 650, grade: 'C' },
        { baseScore: 500, accuracyBonus: 0, speedBonus: 0, totalScore: 500, grade: 'D' },
        { baseScore: 300, accuracyBonus: 0, speedBonus: 0, totalScore: 300, grade: 'F' },
        { baseScore: 900, accuracyBonus: 100, speedBonus: 50, totalScore: 1050, grade: 'A' }
      ];
      
      const distribution = ScoreUtils.getGradeDistribution(results);
      expect(distribution).toEqual({
        A: 2,
        B: 1,
        C: 1,
        D: 1,
        F: 1
      });
    });

    test('should handle empty array', () => {
      const distribution = ScoreUtils.getGradeDistribution([]);
      expect(distribution).toEqual({});
    });
  });

  describe('findBestScore', () => {
    test('should find best score correctly', () => {
      const results: ScoreResult[] = [
        { baseScore: 1000, accuracyBonus: 100, speedBonus: 50, totalScore: 1150, grade: 'A' },
        { baseScore: 800, accuracyBonus: 50, speedBonus: 0, totalScore: 850, grade: 'B' },
        { baseScore: 600, accuracyBonus: 0, speedBonus: 50, totalScore: 650, grade: 'C' }
      ];
      
      const best = ScoreUtils.findBestScore(results);
      expect(best).toEqual({
        baseScore: 1000,
        accuracyBonus: 100,
        speedBonus: 50,
        totalScore: 1150,
        grade: 'A'
      });
    });

    test('should return null for empty array', () => {
      const best = ScoreUtils.findBestScore([]);
      expect(best).toBeNull();
    });
  });
});

describe('Integration Tests', () => {
  test('should maintain mathematical accuracy across multiple calculations', () => {
    const testData: ScoreData[] = [
      { accuracy: 90, speed: 20, consistency: 85, difficulty: 7 },
      { accuracy: 75, speed: 25, consistency: 70, difficulty: 5 },
      { accuracy: 95, speed: 15, consistency: 90, difficulty: 8 },
      { accuracy: 60, speed: 30, consistency: 65, difficulty: 4 },
      { accuracy: 85, speed: 18, consistency: 80, difficulty: 6 }
    ];

    const results = testData.map(data => ScoringCalculator.calculateScore(data));
    
    // Verify all calculations are consistent
    results.forEach((result, index) => {
      const data = testData[index];
      
      // Verify base score calculation
      expect(result.baseScore).toBe(data.accuracy * data.difficulty * 10);
      
      // Verify accuracy bonus
      if (data.accuracy >= 90) {
        expect(result.accuracyBonus).toBe(100);
      } else if (data.accuracy >= 70) {
        expect(result.accuracyBonus).toBe(50);
      } else {
        expect(result.accuracyBonus).toBe(0);
      }
      
      // Verify speed bonus
      const threshold = 30 - (data.difficulty * 2);
      if (data.speed <= threshold) {
        expect(result.speedBonus).toBe(50);
      } else {
        expect(result.speedBonus).toBe(0);
      }
      
      // Verify total score
      expect(result.totalScore).toBe(result.baseScore + result.accuracyBonus + result.speedBonus);
    });
  });

  test('should handle concurrent calculations correctly', () => {
    // Simulate multiple users calculating scores simultaneously
    const promises = Array.from({ length: 100 }, (_, i) => {
      const data: ScoreData = {
        accuracy: (i % 100) + 1,
        speed: (i % 50) + 10,
        consistency: (i % 100) + 1,
        difficulty: (i % 9) + 1
      };
      
      return Promise.resolve(ScoringCalculator.calculateScore(data));
    });

    return Promise.all(promises).then(results => {
      // Verify all results are valid
      results.forEach(result => {
        expect(result.totalScore).toBeGreaterThan(0);
        expect(['A', 'B', 'C', 'D', 'F']).toContain(result.grade);
      });
    });
  });
});