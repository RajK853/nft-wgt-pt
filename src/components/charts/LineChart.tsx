/**
 * Line Chart Component
 * 
 * Simple, focused component for displaying line charts.
 * Follows KISS principle with clear, readable code.
 * Supports light/dark theme
 */

import { useEffect, useState } from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

export interface LineChartSeries {
  key: string;
  label: string;
  color: string;
}

interface LineChartProps {
  data: Array<Record<string, string | number>>;
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  /** Multi-series mode: provide an array of series descriptors instead of using dataKey="value" */
  series?: LineChartSeries[];
}

/**
 * Custom tooltip component for better styling - theme aware
 */
const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={isDark ? "bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg" : "bg-white border border-gray-200 p-3 rounded-lg shadow-lg"}>
        <p className={isDark ? "text-sm text-gray-300 mb-2" : "text-sm text-gray-700 mb-2"}>{label}</p>
        {payload.map((entry: any) => (
          <p key={entry.dataKey} className="text-sm font-semibold" style={{ color: entry.color }}>
            {entry.name}: {entry.value}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

// Theme-aware colors
const getChartColors = (isDark: boolean) => ({
  axisColor: isDark ? '#9ca3af' : '#6b7280',
  gridColor: isDark ? '#374151' : '#e5e7eb',
  tooltipBg: isDark ? '#1f2937' : '#ffffff',
  tooltipBorder: isDark ? '#374151' : '#e5e7eb',
  textColor: isDark ? '#e5e7eb' : '#1f2937',
  dotStroke: isDark ? '#1f2937' : '#ffffff',
  cursorColor: isDark ? '#64748b' : '#94a3b8',
});

/**
 * Line chart component with responsive design and theme support
 */
export function LineChart({ 
  data, 
  title, 
  color = '#8884d8', 
  height = 300,
  showGrid = true,
  showLegend = true,
  series,
}: LineChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const chartColors = getChartColors(isDark);
  
  if (!mounted) {
    return <div style={{ height }} />;
  }
  
  return (
    <div className={`chart-container rounded-lg p-4 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {title && (
        <h3 className={`chart-title text-lg font-semibold mb-4 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={chartColors.gridColor}
              vertical={false}
            />
          )}
          
          <XAxis 
            dataKey="name" 
            stroke={chartColors.axisColor}
            fontSize={12}
            tick={{ fill: chartColors.axisColor }}
            axisLine={{ stroke: chartColors.axisColor }}
            tickLine={{ stroke: chartColors.axisColor }}
          />
          
          <YAxis 
            stroke={chartColors.axisColor}
            fontSize={12}
            tick={{ fill: chartColors.axisColor }}
            axisLine={{ stroke: chartColors.axisColor }}
            tickLine={{ stroke: chartColors.axisColor }}
          />
          
          <Tooltip 
            content={<CustomTooltip isDark={isDark} />}
            cursor={{ stroke: chartColors.cursorColor, strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span style={{ color: chartColors.textColor }}>{value}</span>}
            />
          )}

          {series && series.length > 0
            ? series.map((s) => (
                <Line
                  key={s.key}
                  type="monotone"
                  dataKey={s.key}
                  name={s.label}
                  stroke={s.color}
                  strokeWidth={2}
                  dot={{ r: 3, fill: s.color, stroke: chartColors.dotStroke, strokeWidth: 1 }}
                  activeDot={{ r: 5, fill: s.color, stroke: chartColors.dotStroke, strokeWidth: 2 }}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              ))
            : (
                <Line 
                  type="monotone" 
                  dataKey="value" 
                  stroke={color}
                  strokeWidth={2}
                  dot={{ 
                    r: 4, 
                    fill: color,
                    stroke: chartColors.dotStroke,
                    strokeWidth: 2
                  }}
                  activeDot={{ 
                    r: 6, 
                    fill: color,
                    stroke: chartColors.dotStroke,
                    strokeWidth: 2
                  }}
                  isAnimationActive={true}
                  animationDuration={500}
                />
              )
          }
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}
