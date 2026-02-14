/**
 * Bar Chart Component
 * Simple, focused bar chart using Recharts
 * Follows KISS principle with clean, readable code
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

interface BarChartProps {
  data: Array<{ name: string; value: number; [key: string]: any }>;
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
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-gray-300 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
          Value: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

// Neutral bright colors palette - bright visible colors for dark background
const NEUTRAL_COLORS = [
  '#e2e8f0', // slate-200 (brightest)
  '#f1f5f9', // slate-100
  '#cbd5e1', // slate-300
  '#ffffff', // white
  '#818cf8', // indigo-400 (accent for visibility)
];

/**
 * Bar chart component with responsive design
 */
export function BarChart({ 
  data, 
  title, 
  color = '#e2e8f0', 
  height = 300,
  showGrid = true,
  showLegend = false,
  layout = 'horizontal',
  colors = NEUTRAL_COLORS,
  dataKeys = ['value'],
  colorCoding = 'single',
}: BarChartProps) {
  // Default data key for single bar
  const primaryDataKey = dataKeys[0] || 'value'
  
  // Find the max value for highlighting
  const maxValue = Math.max(...data.map(d => d[primaryDataKey] || d.value || 0))
  const defaultColor = color
  
  return (
    <div className="chart-container bg-gray-800 rounded-lg p-4 shadow-lg">
      {title && (
        <h3 className="chart-title text-lg font-semibold text-white mb-4">
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart 
          data={data} 
          layout={layout}
          margin={{ top: 10, right: 10, left: 10, bottom: 10 }}
        >
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151"
              vertical={layout === 'horizontal'}
              horizontal={layout === 'vertical'}
            />
          )}
          
          {layout === 'horizontal' ? (
            <>
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
                minTickGap={30}
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
                origin={0}
              />
              <ReferenceLine y={0} stroke="#9ca3af" strokeWidth={1} />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
              />
              <YAxis 
                dataKey="name"
                type="category"
                stroke="#9ca3af"
                fontSize={12}
                tick={{ fill: '#9ca3af' }}
                axisLine={{ stroke: '#9ca3af', strokeWidth: 1 }}
                tickLine={{ stroke: '#9ca3af' }}
                width={100}
              />
            </>
          )}
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ fill: '#374151', opacity: 0.4 }}
          />
          
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
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
                  fill={entry.fill || colors[index % colors.length]} 
                />
              ))}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
