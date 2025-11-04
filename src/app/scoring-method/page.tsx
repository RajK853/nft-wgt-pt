'use client';

import { PointSystemTable } from '@/components/point-system-table';
import { ScoringExplanation } from '@/components/scoring-explanation';
import { eventOutcomes } from '@/lib/scoring-data';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';


/**
 * Renders the Scoring Method Page, displaying a table of event-based points for shooters and goalkeepers.
 * This page outlines the base points system used to calculate player scores.
 * Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
 *
 * @returns {JSX.Element} The rendered Scoring Method Page.
 */
export default function ScoringMethodPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <section className="text-center mb-12">
        <h1 className="text-4xl font-bold">Scoring Method</h1>
        <p className="text-lg text-muted-foreground mt-2">
          Learn how player scores are calculated based on in-game events and our time-weighted system.
        </p>
      </section>

      <section className="mb-12">
        <ScoringExplanation
          title="Understanding Time-Weighted Scoring"
          description="Time-weighted scoring values recent performance more than older achievements. This system reduces the value of old scores over time. The key idea is 'half-life,' which is the time it takes for a score's value to decrease by half."
          example="For example, if a score has a 30-day half-life, its value will be 50% after 30 days, and 25% after 60 days. This decay highlights current performance."
          formulaTitle="Score Decay Formula"
          formula="S_{decayed} = S_{original} \times (1/2)^{\frac{t_{elapsed}}{t_{half-life}}}"
          formulaExplanation="This formula shows how a score decays. `Original Score` is the initial points. `Time Elapsed` is the time since the event. `Half-Life` is the time for a score's value to halve."
        />
      </section>

      <section>
        <Card>
          <CardHeader>
            <CardTitle>Base Point System</CardTitle>
          </CardHeader>
          <CardContent>
            <PointSystemTable outcomes={eventOutcomes} />
          </CardContent>
        </Card>
      </section>
    </div>
  );
}
