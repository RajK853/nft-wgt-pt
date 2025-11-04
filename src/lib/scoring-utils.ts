export function calculateScoreDecay(
  originalScore: number,
  halfLife: number,
  timeElapsed: number[]
): { time: number; decayedScore: number }[] {
  if (halfLife <= 0) {
    // Handle invalid half-life to prevent division by zero or non-sensical results
    return timeElapsed.map((time) => ({ time, decayedScore: 0 }));
  }

  return timeElapsed.map((time) => {
    const exponent = time / halfLife;
    const decayedScore = originalScore * Math.pow(0.5, exponent);
    return { time, decayedScore };
  });
}
