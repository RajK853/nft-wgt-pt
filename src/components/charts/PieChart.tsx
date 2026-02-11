/**
 * Pie Chart Component
 * 
 * Simple, focused component for displaying pie charts.
 * Follows KISS principle with clear, readable code.
 */

import React from 'react';
import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts';

interface PieChartProps {
  data: Array<{ name: string; value: number }>;
  title?: string;
  colors?: string[];
  height?: number;
  showLegend?: boolean;
  showTooltip?: boolean;
}

/**
 * Custom tooltip component for better styling
 */
const CustomTooltip = ({ active, payload }: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-gray-900 border border-gray-700 p-3 rounded-lg shadow-lg">
        <p className="text-sm text-gray-300 mb-1">{data.name}</p>
        <p className="text-sm font-semibold text-white">
          Count: {data.value}
        </p>
        <p className="text-xs text-gray-400">
          {(data.percent * 100).toFixed(1)}%
        </p>
      </div>
    );
  }
  return null;
};

/**
 * Pie chart component with responsive design
 */
export function PieChart({ 
  data, 
  title, 
  colors = ['#8884d8', '#82ca9d', '#ffc658', '#ff7300', '#0088fe'],
  height = 300,
  showLegend = true,
  showTooltip = true
}: PieChartProps) {
  return (
    <div className="chart-container bg-gray-800 rounded-lg p-4 shadow-lg">
      {title && (
        <h3 className="chart-title text-lg font-semibold text-white mb-4">
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
            label={({ name, percent }: any) => `${name} ${(percent * 100).toFixed(1)}%`}
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            isAnimationActive={true}
            animationDuration={800}
          >
            {data.map((entry, index) => (
              <Cell 
                key={`cell-${index}`} 
                fill={colors[index % colors.length]} 
              />
            ))}
          </Pie>
          
          {showTooltip && (
            <Tooltip 
              content={<CustomTooltip />}
            />
          )}
          
          {showLegend && (
            <Legend 
              verticalAlign="bottom" 
              height={36}
              formatter={(value, entry) => (
                <span className="text-gray-300 text-sm">{value}</span>
              )}
            />
          )}
        </RechartsPieChart>
      </ResponsiveContainer>
    </div>
  );
}