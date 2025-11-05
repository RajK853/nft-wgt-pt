'use client';

import React from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Dot,
} from 'recharts';
import { MAX_DAYS_SIMULATED } from '@/lib/scoring-utils';

interface HalfLifeChartProps {
  data: { time: number; decayedScore: number }[];
  originalScore: number;
  halfLife: number;
}

export function HalfLifeChart({ data, originalScore, halfLife }: HalfLifeChartProps) {
  const interval = Math.ceil(MAX_DAYS_SIMULATED / 10); // Show roughly 10 ticks

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5,
        }}
      >

        <XAxis
          dataKey="time"
          label={{ value: 'Time Elapsed (days)', position: 'insideBottom', offset: -5 }}
          interval={0}
          tickCount={MAX_DAYS_SIMULATED / interval + 1}
          tickFormatter={(value) => (value % interval === 0 ? value : '')}
        />
        <YAxis label={{ value: 'Decayed Score', angle: -90, position: 'insideLeft' }} />
        <Tooltip content={<CustomTooltip originalScore={originalScore} halfLife={halfLife} />} />
        <Line
          type="monotone"
          dataKey="decayedScore"
          stroke="#8884d8"
          activeDot={{ r: 3 }}
          dot={({ cx, cy, payload }) => {
            if (payload.time === halfLife) {
              return (
                <Dot
                  cx={cx}
                  cy={cy}
                  r={6}
                  fill="green"
                  key="half-life-dot"
                />
              );
            }
            return (
              <Dot
                cx={cx}
                cy={cy}
                r={3}
                fillOpacity={0} // Make it transparent
                key={`dot-${payload.time}`}
              />
            );
          }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

interface CustomTooltipProps {
  active?: boolean;
  payload?: any[];
  label?: number;
  originalScore: number;
  halfLife: number;
}

const CustomTooltip = ({ active, payload, label, originalScore, halfLife }: CustomTooltipProps) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip p-2 bg-white border border-gray-300 rounded shadow-md text-sm text-black">
        <p className="label">{`Time Elapsed: ${label} days`}</p>
        <p className="desc">{`Decayed Score: ${payload[0].value.toFixed(4)}`}</p>
      </div>
    );
  }

  return null;
};
