/**
 * Pie Chart Component
 * Simple, clean pie/donut chart using Recharts defaults
 * Supports light/dark theme
 */

import React, { useEffect, useState } from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  height?: number;
  colors?: string[];
  donut?: boolean;
}

const DEFAULT_COLORS = ['#3b82f6', '#22c55e', '#f59e0b', '#ef4444', '#8b5cf6'];

// Theme-aware colors for pie chart
const getChartColors = (isDark: boolean) => ({
  tooltipBg: isDark ? '#1f2937' : '#ffffff',
  tooltipBorder: isDark ? '#374151' : '#e5e7eb',
  tooltipText: isDark ? '#fff' : '#1f2937',
  legendText: isDark ? '#9ca3af' : '#6b7280',
});

/**
 * Simple pie chart with clean default styling and theme support
 */
export function PieChart({ 
  data, 
  title, 
  height = 300,
  colors = DEFAULT_COLORS,
  donut = true
}: PieChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const chartColors = getChartColors(isDark);
  
  // Calculate proportional radius based on height to ensure chart fits in container
  const outerRadius = Math.min(height / 2.5, 100);
  const innerRadius = donut ? outerRadius * 0.6 : 0;
  
  if (!mounted) {
    return <div style={{ height }} />;
  }
  
  return (
    <div className={`rounded-lg p-4 ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {title && (
        <h3 className={`text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsPieChart>
          <Pie
            data={data}
            cx="50%"
            cy="50%"
            labelLine={false}
            outerRadius={outerRadius}
            innerRadius={innerRadius}
            fill="#8884d8"
            dataKey="value"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ 
              backgroundColor: chartColors.tooltipBg, 
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: '8px',
              color: chartColors.tooltipText
            }}
          />
          <Legend 
            formatter={(value) => <span style={{ color: chartColors.legendText }}>{value}</span>}
            verticalAlign="bottom"
            align="center"
            wrapperStyle={{ paddingTop: '10px' }}
          />
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}
