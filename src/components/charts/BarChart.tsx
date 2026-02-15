/**
 * Bar Chart Component
 * Simple, focused bar chart using Recharts
 * Follows KISS principle with clean, readable code
 * Supports light/dark theme
 */

import React from 'react';
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from 'recharts';
import { useTheme } from '@/hooks/useTheme';

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: unknown }>;
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
  layout?: 'horizontal' | 'vertical';
  colors?: string[];
  dataKeys?: string[];
  colorCoding?: 'single' | 'custom';
}

/** Custom tooltip component */
const CustomTooltip = ({ active, payload, label, isDark }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className={isDark ? "bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg" : "bg-white border border-gray-200 p-3 rounded-lg shadow-lg"}>
        <p className={isDark ? "text-sm text-gray-300 mb-1" : "text-sm text-gray-700 mb-1"}>{label}</p>
        <p className={isDark ? "text-sm font-semibold text-white" : "text-sm font-semibold text-gray-900"}>
          Value: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Theme-aware colors
const getChartColors = (isDark: boolean) => ({
  // Neutral bright colors palette - bright visible colors
  neutralColors: [
    '#e2e8f0', // slate-200 (brightest)
    '#f1f5f9', // slate-100
    '#cbd5e1', // slate-300
    '#ffffff', // white
    '#818cf8', // indigo-400 (accent for visibility)
  ],
  // Axis and grid colors
  axisColor: isDark ? '#9ca3af' : '#6b7280',
  gridColor: isDark ? '#374151' : '#e5e7eb',
  tooltipBg: isDark ? '#1f2937' : '#ffffff',
  tooltipBorder: isDark ? '#374151' : '#e5e7eb',
  textColor: isDark ? '#e5e7eb' : '#1f2937',
});

/**
 * Bar chart component with responsive design and theme support
 */
export function BarChart({ 
  data, 
  title, 
  color = '#e2e8f0', 
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = 'horizontal',
  colors,
  dataKeys = ['value'],
  colorCoding = 'single',
}: BarChartProps) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme === 'dark';
  
  const chartColors = getChartColors(isDark);
  const defaultColors = colors || chartColors.neutralColors;
  
  // Default data key for single bar
  const primaryDataKey = dataKeys[0] || 'value';
  
  // Find the max value for highlighting
  const maxValue = Math.max(...data.map(d => Number(d[primaryDataKey]) || d.value || 0));
  const defaultColor = color;
  
  return (
    <div className={`chart-container rounded-lg p-2 shadow-lg ${isDark ? 'bg-gray-800' : 'bg-white'}`}>
      {title && (
        <h3 className={`chart-title text-lg font-semibold mb-2 ${isDark ? 'text-white' : 'text-gray-900'}`}>
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart 
          data={data} 
          layout={layout}
          margin={{ top: 5, right: 5, left: 0, bottom: 5 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke={chartColors.gridColor}
              vertical={layout === 'horizontal'}
              horizontal={layout === 'vertical'}
            />
          )}
          
          {layout === 'horizontal' ? (
            <>
              <XAxis 
                dataKey="name" 
                stroke={chartColors.axisColor}
                tick={{ fill: chartColors.axisColor, fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                tickMargin={8}
                minTickGap={30}
              />
              <YAxis 
                stroke={chartColors.axisColor}
                fontSize={12}
                tick={{ fill: chartColors.axisColor }}
                axisLine={false}
                tickLine={false}
                tickMargin={8}
                origin={0}
              />
              <ReferenceLine y={0} stroke={chartColors.axisColor} strokeWidth={1} />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                stroke={chartColors.axisColor}
                fontSize={12}
                tick={{ fill: chartColors.axisColor }}
                axisLine={{ stroke: chartColors.axisColor, strokeWidth: 1 }}
                tickLine={{ stroke: chartColors.axisColor }}
              />
              <YAxis 
                dataKey="name"
                type="category"
                stroke={chartColors.axisColor}
                fontSize={12}
                tick={{ fill: chartColors.axisColor }}
                axisLine={{ stroke: chartColors.axisColor, strokeWidth: 1 }}
                tickLine={{ stroke: chartColors.axisColor }}
                width={100}
              />
            </>
          )}
          
          <Tooltip 
            content={<CustomTooltip isDark={isDark} />}
            cursor={{ fill: chartColors.gridColor, opacity: 0.4 }}
          />
          
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span style={{ color: chartColors.textColor }}>{value}</span>}
            />
          )}
          
          {/* Render bars for each data key */}
          {dataKeys.map((key, keyIndex) => (
            <Bar 
              key={key}
              dataKey={key} 
              fill={colorCoding === 'single' ? color : undefined}
              radius={[4, 4, 0, 0]}
              barSize={80}
              isAnimationActive={true}
              animationDuration={500}
            >
              {/* Color highest value green, others use default or custom */}
              {colorCoding === 'single' && data.map((entry, index) => {
                const value = entry[primaryDataKey] || entry.value || 0
                return (
                  <Cell 
                    key={`cell-${index}`} 
                    fill={value === maxValue && maxValue > 0 ? '#22c55e' : defaultColor}
                  />
                )
              })}
              {colorCoding === 'custom' && data.map((entry, index) => (
                <Cell 
                  key={`cell-${index}`} 
                  fill={(entry.fill as string) || defaultColors[index % defaultColors.length]} 
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
