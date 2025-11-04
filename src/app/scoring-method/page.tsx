'use client';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { HalfLifeSlider } from '@/components/half-life-slider';
import { OriginalScoreSlider } from '@/components/original-score-slider';
import { HalfLifeChart } from '@/components/half-life-chart';
import { ScoringExplanation } from '@/components/scoring-explanation';
import { PointSystemTable } from '@/components/point-system-table';
import React, { useState, useMemo } from 'react';
import { useDebounce } from '@/lib/hooks/useDebounce';

import { calculateScoreDecay } from '@/lib/scoring-utils';
import { eventOutcomes } from '@/lib/scoring-data';

/**
 * Renders the Scoring Method Page, displaying a table of event-based points for shooters and goalkeepers.
 * This page outlines the base points system used to calculate player scores.
 * Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
 *
 * @returns {JSX.Element} The rendered Scoring Method Page.
 */
export default function ScoringMethodPage() {
  const [halfLife, setHalfLife] = useState(30);
  const [originalScore, setOriginalScore] = useState(1.5); // New state for original score

  const debouncedHalfLife = useDebounce(halfLife, 100); // Debounce with 100ms delay
  const debouncedOriginalScore = useDebounce(originalScore, 100); // Debounce with 100ms delay

  const timeElapsed = Array.from({ length: 366 }, (_, i) => i); // 0 to 365 days

  const decayCurveData = useMemo(() => {
    return calculateScoreDecay(debouncedOriginalScore, debouncedHalfLife, timeElapsed);
  }, [debouncedOriginalScore, debouncedHalfLife, timeElapsed]);

  const handleHalfLifeChange = (newHalfLife: number) => {
    setHalfLife(newHalfLife);
  };

  const handleOriginalScoreChange = (newOriginalScore: number) => { // New handler
    setOriginalScore(newOriginalScore);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">Scoring Method</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn how player scores are calculated based on in-game events and our time-weighted system.
        </p>
      </section>

      <section className="mb-12">
        <Card>
          <CardHeader>
            <CardTitle>Base Point System</CardTitle>
            <CardDescription>
              This table outlines the base points awarded or deducted for various in-game events for both shooters and goalkeepers.
              These points are then adjusted by the time-weighted scoring system.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <PointSystemTable outcomes={eventOutcomes} />
          </CardContent>
        </Card>
      </section>

      <section>
        <ScoringExplanation
          title="Understanding Time-Weighted Scoring"
          description="Time-weighted scoring values recent performance more than older achievements. This system reduces the value of old scores over time. The key idea is 'half-life,' which is the time it takes for a score's value to decrease by half."
          example="For example, if a score has a 30-day half-life, its value will be 50% after 30 days, and 25% after 60 days. This decay highlights current performance."
          formulaTitle="Score Decay Formula"
          formula="S_{decayed} = S_{original} \times (1/2)^{\frac{t_{elapsed}}{t_{half-life}}}"
          formulaExplanation="This formula shows how a score decays. `Original Score` is the initial points. `Time Elapsed` is the time since the event. `Half-Life` is the time for a score's value to halve."
          className="mb-8"
        />
        <Card className="mt-8 mb-8">
          <CardHeader>
            <CardTitle>Half-Life Simulation</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <OriginalScoreSlider initialOriginalScore={originalScore} onOriginalScoreChange={handleOriginalScoreChange} />
            </div>
            <div className="mb-4">
              <HalfLifeSlider initialHalfLife={halfLife} onHalfLifeChange={handleHalfLifeChange} />
            </div>
            <div>
              <HalfLifeChart data={decayCurveData} originalScore={debouncedOriginalScore} halfLife={debouncedHalfLife} />
            </div>
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
