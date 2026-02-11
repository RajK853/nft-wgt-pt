/**
 * Score Announcer Component
 * Simple ARIA live region for screen readers
 */

import React, { useEffect, useRef } from 'react';

interface ScoreAnnouncerProps {
  score: { totalScore: number; grade: string };
  isActive: boolean;
}

export function ScoreAnnouncer({ score, isActive }: ScoreAnnouncerProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isActive && ref.current) {
      const text = `Score calculated. Total score: ${score.totalScore}. Grade: ${score.grade}.`;
      setTimeout(() => {
        if (ref.current) ref.current.textContent = text;
      }, 100);
    }
  }, [score, isActive]);

  return (
    <div ref={ref} aria-live="polite" aria-atomic="true" className="sr-only" role="status" />
  );
}
