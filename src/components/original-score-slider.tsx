'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface OriginalScoreSliderProps {
  initialOriginalScore: number;
  onOriginalScoreChange: (originalScore: number) => void;
}

export function OriginalScoreSlider({ initialOriginalScore, onOriginalScoreChange }: OriginalScoreSliderProps) {
  const [originalScore, setOriginalScore] = React.useState(initialOriginalScore);

  const handleValueChange = (value: number[]) => {
    const newOriginalScore = value[0];
    setOriginalScore(newOriginalScore);
    onOriginalScoreChange(newOriginalScore);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="original-score-slider">Original Score: {originalScore.toFixed(1)}</Label>
      <Slider
        id="original-score-slider"
        min={0.0}
        max={10.0}
        step={0.1}
        value={[originalScore]}
        onValueChange={handleValueChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Original Score Slider"
      />
    </div>
  );
}
