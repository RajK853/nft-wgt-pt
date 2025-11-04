import { calculateScoreDecay, MAX_DAYS_SIMULATED } from './scoring-utils';

describe('calculateScoreDecay', () => {
  const timeElapsed = Array.from({ length: MAX_DAYS_SIMULATED + 1 }, (_, i) => i); // 0 to MAX_DAYS_SIMULATED days

  it('should calculate decayed scores correctly for a given half-life', () => {
    const originalScore = 100;
    const halfLife = 30; // 30 days

    const result = calculateScoreDecay(originalScore, halfLife, timeElapsed);

    // Check initial value (time = 0)
    expect(result[0].time).toBe(0);
    expect(result[0].decayedScore).toBeCloseTo(originalScore);

    // Check value at half-life (time = 30)
    expect(result[30].time).toBe(30);
    expect(result[30].decayedScore).toBeCloseTo(originalScore * 0.5);

    // Check value at double half-life (time = 60)
    expect(result[60].time).toBe(60);
    expect(result[60].decayedScore).toBeCloseTo(originalScore * 0.25);

    // Check value at end of range (time = MAX_DAYS_SIMULATED)
    expect(result[MAX_DAYS_SIMULATED].time).toBe(MAX_DAYS_SIMULATED);
    const expectedDecayedScoreAtMaxDays = originalScore * Math.pow(0.5, MAX_DAYS_SIMULATED / halfLife);
    expect(result[MAX_DAYS_SIMULATED].decayedScore).toBeCloseTo(expectedDecayedScoreAtMaxDays);
  });

  it('should return all zeros if half-life is zero or negative', () => {
    const originalScore = 100;
    const timeElapsedShort = [0, 10, 20];

    // Test with halfLife = 0
    const resultZeroHalfLife = calculateScoreDecay(originalScore, 0, timeElapsedShort);
    expect(resultZeroHalfLife.every(item => item.decayedScore === 0)).toBe(true);

    // Test with negative halfLife
    const resultNegativeHalfLife = calculateScoreDecay(originalScore, -10, timeElapsedShort);
    expect(resultNegativeHalfLife.every(item => item.decayedScore === 0)).toBe(true);
  });

  it('should handle different original scores', () => {
    const originalScore = 50;
    const halfLife = 10;
    const result = calculateScoreDecay(originalScore, halfLife, [0, 10]);
    expect(result[0].decayedScore).toBeCloseTo(50);
    expect(result[1].decayedScore).toBeCloseTo(25);
  });

  it('should handle different time elapsed arrays', () => {
    const originalScore = 100;
    const halfLife = 5;
    const customTimeElapsed = [0, 5, 10, 15];
    const result = calculateScoreDecay(originalScore, halfLife, customTimeElapsed);

    expect(result.length).toBe(4);
    expect(result[0].decayedScore).toBeCloseTo(100);
    expect(result[1].decayedScore).toBeCloseTo(50);
    expect(result[2].decayedScore).toBeCloseTo(25);
    expect(result[3].decayedScore).toBeCloseTo(12.5);
  });
});
