/**
 * Line Chart Component
 * 
 * Simple, focused component for displaying line charts.
 * Follows KISS principle with clear, readable code.
 */

import React from 'react';
import {
  LineChart as RechartsLineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  type TooltipProps
} from 'recharts';
interface LineChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  color?: string;
  height?: number;
  showGrid?: boolean;
  showLegend?: boolean;
}

/**
 * Custom tooltip component for better styling
 */
const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-gray-300 mb-1">{label}</p>
        <p className="text-sm font-semibold text-white">
          Score: {payload[0].value}
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Line chart component with responsive design
 */
export function LineChart({ 
  data, 
  title, 
  color = '#8884d8', 
  height = 300,
  showGrid = true,
  showLegend = true
}: LineChartProps) {
  return (
    <div className="chart-container bg-gray-800 rounded-lg p-4 shadow-lg">
      {title && (
        <h3 className="chart-title text-lg font-semibold text-white mb-4">
          {title}
        </h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsLineChart data={data}>
          {showGrid && (
            <CartesianGrid 
              strokeDasharray="3 3" 
              stroke="#374151"
              vertical={false}
            />
          )}
          
          <XAxis 
            dataKey="name" 
            stroke="#9ca3af"
            fontSize={12}
            tick={{ fill: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          
          <YAxis 
            stroke="#9ca3af"
            fontSize={12}
            tick={{ fill: '#9ca3af' }}
            axisLine={{ stroke: '#374151' }}
            tickLine={{ stroke: '#374151' }}
          />
          
          <Tooltip 
            content={<CustomTooltip />}
            cursor={{ stroke: '#64748b', strokeWidth: 1, strokeDasharray: '3 3' }}
          />
          
          {showLegend && (
            <Legend 
              verticalAlign="top" 
              height={36}
              formatter={(value) => <span className="text-gray-300">{value}</span>}
            />
          )}
          
          <Line 
            type="monotone" 
            dataKey="value" 
            stroke={color}
            strokeWidth={2}
            dot={{ 
              r: 4, 
              fill: color,
              stroke: '#1f2937',
              strokeWidth: 2
            }}
            activeDot={{ 
              r: 6, 
              fill: color,
              stroke: '#1f2937',
              strokeWidth: 2
            }}
            isAnimationActive={true}
            animationDuration={500}
          />
        </RechartsLineChart>
      </ResponsiveContainer>
    </div>
  );
}