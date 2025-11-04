'use client';

import * as React from 'react';
import { Slider } from '@/components/ui/slider';
import { Label } from '@/components/ui/label';

interface HalfLifeSliderProps {
  initialHalfLife: number;
  onHalfLifeChange: (halfLife: number) => void;
}

export function HalfLifeSlider({ initialHalfLife, onHalfLifeChange }: HalfLifeSliderProps) {
  const [halfLife, setHalfLife] = React.useState(initialHalfLife);

  const handleValueChange = (value: number[]) => {
    const newHalfLife = value[0];
    setHalfLife(newHalfLife);
    onHalfLifeChange(newHalfLife);
  };

  return (
    <div className="grid gap-2">
      <Label htmlFor="half-life-slider">Half-Life: {halfLife} days</Label>
      <Slider
        id="half-life-slider"
        min={1}
        max={90}
        step={1}
        value={[halfLife]}
        onValueChange={handleValueChange}
        className="[&_[role=slider]]:h-4 [&_[role=slider]]:w-4"
        aria-label="Half-Life Slider"
      />
    </div>
  );
}
