'use client';

import React from 'react';

import { PointSystemTable } from '@/components/point-system-table';
import { shooterOutcomes, goalkeeperOutcomes } from '@/lib/scoring-data';

export default function ScoringMethodPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1 className="text-4xl font-bold">Scoring Method Page</h1>
      <div className="container mx-auto px-4 py-8">
        <p className="text-lg text-center mb-8">
          This page outlines the base points system used to calculate player scores. Points are awarded or deducted based on various in-game events for both shooters and goalkeepers.
        </p>

        <PointSystemTable title="Shooter Point System" outcomes={shooterOutcomes} />
        <PointSystemTable title="Goalkeeper Point System" outcomes={goalkeeperOutcomes} />
      </div>
    </div>
  );
}
