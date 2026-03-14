/**
 * Chart Skeleton Component
 * Simple skeleton loader with KISS principle
 */

interface ChartSkeletonProps {
  height?: number;
  className?: string;
}

export function ChartSkeleton({ height = 300, className = '' }: ChartSkeletonProps) {
  return (
    <div
      className="animate-pulse rounded-lg bg-muted"
      style={{ height }}
      aria-busy="true"
      aria-label="Loading chart"
    />
  );
}
