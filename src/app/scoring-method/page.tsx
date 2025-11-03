'use client';

import React from 'react';

import { PointSystemTable } from '@/components/point-system-table';
import { eventOutcomes } from '@/lib/scoring-data';

/**
 * Renders the Scoring Method Page, displaying a table of event-based points for shooters and goalkeepers.
 * This page outlines the base points system used to calculate player scores.
 * Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
 *
 * @returns {JSX.Element} The rendered Scoring Method Page.
 */
export default function ScoringMethodPage() {
  return (
    <>
      <section className="bg-gray-700 text-white py-8 mb-8">
        <h1 className="text-4xl font-bold text-center">Scoring Method Page</h1>
        <p className="text-lg text-center px-4 mt-4">
          This page outlines the base points system used to calculate player scores. Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
        </p>
      </section>

      <section className="mb-8 px-4">
        <h2 className="text-3xl font-bold text-center mt-8 mb-4">Total Points Calculation & Time-Weighted Points</h2>
        <p className="text-lg">
          While the table above details the base points for individual events, a player's overall "Total Points" will be calculated using a more comprehensive approach. This will involve "Time-Weighted Points," where recent events contribute more significantly to the total score than older events. This method ensures that a player's current form and recent performance are accurately reflected in their overall rating.
        </p>
        <p className="text-lg mt-2">
          The detailed algorithm for calculating Time-Weighted Points, including factors like playing time, event decay, and specific weighting parameters, will be implemented in a future update. This section serves as a conceptual overview of how total scores will be derived.
        </p>
      </section>

      <PointSystemTable outcomes={eventOutcomes} />
    </>
  );
}
