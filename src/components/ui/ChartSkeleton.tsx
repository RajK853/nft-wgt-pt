/**
 * Chart Skeleton Component
 * Simple skeleton loader with KISS principle
 */

import React from 'react';

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

export function ChartSkeleton({ height = 300, className = '' }: ChartSkeletonProps) {
  return (
    <div className={`bg-gray-800 rounded-lg p-4 animate-pulse ${className}`} style={{ height }}>
      <div className="space-y-4">
        <div className="h-4 bg-gray-700 rounded w-1/3"></div>
        <div className="h-64 bg-gray-700 rounded"></div>
      </div>
    </div>
  );
}
