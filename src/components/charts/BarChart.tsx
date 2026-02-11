/**
 * Bar Chart Component
 * 
 * Simple, focused component for displaying bar charts.
 * Follows KISS principle with clear, readable code.
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
  ResponsiveContainer
} from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    baseScore: number;
    accuracyBonus: number;
    speedBonus: number;
  }>;
  title?: string;
  colors?: {
    baseScore: string;
    accuracyBonus: string;
    speedBonus: string;
  };
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
        <p className="text-sm text-gray-300 mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex justify-between text-sm">
            <span className="text-gray-300">{entry.dataKey}:</span>
            <span className="font-semibold text-white">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

/**
 * Bar chart component with responsive design
 */
export function BarChart({ 
  data, 
  title, 
  colors = {
    baseScore: '#3b82f6',
    accuracyBonus: '#22c55e',
    speedBonus: '#f59e0b'
  },
  height = 300,
  showGrid = true,
  showLegend = true
}: BarChartProps) {
  return (
    <div className="chart-container bg-gradient-to-br from-gray-900 to-gray-800 rounded-xl p-6 shadow-xl border border-gray-700/50">
      {title && (
        <h3 className="chart-title text-xl font-bold text-white mb-6 text-center">
          {title}
        </h3>
      )}
      
      <div className="space-y-4">
        {/* Legend with better styling */}
        {showLegend && (
          <div className="flex justify-center space-x-6 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-blue-500 shadow-lg"></div>
              <span className="text-gray-300 font-medium">Base Score</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-green-500 shadow-lg"></div>
              <span className="text-gray-300 font-medium">Accuracy Bonus</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-amber-500 shadow-lg"></div>
              <span className="text-gray-300 font-medium">Speed Bonus</span>
            </div>
          </div>
        )}
        
        <ResponsiveContainer width="100%" height={height}>
          <RechartsBarChart 
            data={data}
            margin={{ top: 20, right: 30, left: 20, bottom: 20 }}
          >
            {showGrid && (
              <CartesianGrid 
                strokeDasharray="3 3" 
                stroke="#334155"
                vertical={false}
                horizontal={true}
              />
            )}
            
            <XAxis 
              dataKey="name" 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              tickMargin={8}
            />
            
            <YAxis 
              stroke="#94a3b8"
              fontSize={12}
              tick={{ fill: '#94a3b8' }}
              axisLine={{ stroke: '#334155' }}
              tickLine={{ stroke: '#334155' }}
              tickMargin={8}
              domain={[0, 'auto']}
            />
            
            <Tooltip 
              content={<CustomTooltip />}
              cursor={{ 
                fill: 'rgba(56, 189, 248, 0.1)',
                stroke: '#3b82f6',
                strokeWidth: 1
              }}
              wrapperStyle={{
                backgroundColor: 'rgba(17, 24, 39, 0.95)',
                border: '1px solid #334155',
                borderRadius: '8px',
                padding: '8px'
              }}
            />
            
            <Bar 
              dataKey="baseScore" 
              fill="url(#baseScoreGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              stroke="#1e3a8a"
              strokeWidth={2}
            />
            
            <Bar 
              dataKey="accuracyBonus" 
              fill="url(#accuracyBonusGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              stroke="#166534"
              strokeWidth={2}
            />
            
            <Bar 
              dataKey="speedBonus" 
              fill="url(#speedBonusGradient)"
              radius={[8, 8, 0, 0]}
              isAnimationActive={true}
              animationDuration={800}
              stroke="#92400e"
              strokeWidth={2}
            />
            
            {/* Add gradients for better visual appeal */}
            <defs>
              <linearGradient id="baseScoreGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#60a5fa" stopOpacity={1} />
                <stop offset="100%" stopColor="#1e3a8a" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="accuracyBonusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#4ade80" stopOpacity={1} />
                <stop offset="100%" stopColor="#166534" stopOpacity={1} />
              </linearGradient>
              <linearGradient id="speedBonusGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#fbbf24" stopOpacity={1} />
                <stop offset="100%" stopColor="#92400e" stopOpacity={1} />
              </linearGradient>
            </defs>
          </RechartsBarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
