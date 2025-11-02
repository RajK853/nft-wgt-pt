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
      <h1 className="text-4xl font-bold text-center mt-8">Scoring Method Page</h1>
      <p className="text-lg text-center mb-8 px-4">
        This page outlines the base points system used to calculate player scores. Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
      </p>
      <PointSystemTable outcomes={eventOutcomes} />
    </>
  );
}



