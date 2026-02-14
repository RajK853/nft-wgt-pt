/**
 * Bar Chart Component
 * Supports color coding: green (best), red (worst)
 */

import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell
} from 'recharts';

interface BarChartProps {
  data: Array<{
    name: string;
    [key: string]: string | number;
  }>;
  title?: string;
  height?: number;
  dataKeys?: string[];
  colors?: string[];
  colorCoding?: 'none' | 'performance' | 'custom';
  showGrid?: boolean;
  layout?: 'horizontal' | 'vertical';
}

/**
 * Bar chart with optional color coding (green=best, red=worst)
 */
export function BarChart({ 
  data, 
  title, 
  height = 300,
  dataKeys = ['baseScore'],
  colors = ['#3b82f6', '#22c55e', '#f59e0b'],
  colorCoding = 'none',
  showGrid = true,
  layout = 'horizontal'
}: BarChartProps) {
  // Calculate colors based on performance
  const getBarColors = () => {
    if (colorCoding === 'none') {
      return undefined
    }
    
    // For the first data key, calculate colors
    const primaryKey = dataKeys[0]
    const values = data.map(d => Number(d[primaryKey]))
    const maxVal = Math.max(...values)
    const minVal = Math.min(...values)
    const range = maxVal - minVal
    
    return data.map(d => {
      const val = Number(d[primaryKey])
      if (range === 0) return colors[0]
      
      // Normalize value between 0 and 1
      const normalized = (val - minVal) / range
      
      // Green for high values, red for low values
      if (normalized > 0.66) return '#22c55e' // green-500
      if (normalized > 0.33) return '#f59e0b' // yellow-500
      return '#ef4444' // red-500
    })
  }

  const barColors = getBarColors()

  return (
    <div className="bg-gray-800 rounded-lg p-4">
      {title && (
        <h3 className="text-lg font-semibold text-white mb-4">{title}</h3>
      )}
      
      <ResponsiveContainer width="100%" height={height}>
        <RechartsBarChart 
          data={data} 
          margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
          layout={layout}
        >
          {showGrid && <CartesianGrid strokeDasharray="3 3" stroke="#374151" />}
          {layout === 'horizontal' ? (
            <>
              <XAxis 
                dataKey="name" 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                angle={-45}
                textAnchor="end"
                height={80}
              />
              <YAxis 
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
            </>
          ) : (
            <>
              <XAxis 
                type="number"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
              />
              <YAxis 
                dataKey="name" 
                type="category"
                stroke="#9ca3af"
                tick={{ fill: '#9ca3af', fontSize: 12 }}
                width={100}
              />
            </>
          )}
          <Tooltip 
            contentStyle={{ 
              backgroundColor: '#1f2937', 
              border: '1px solid #374151',
              borderRadius: '8px',
              color: '#fff'
            }}
            labelStyle={{ color: '#fff' }}
          />
          <Legend />
          {dataKeys.map((key, index) => (
            <Bar 
              key={key} 
              dataKey={key} 
              radius={[4, 4, 0, 0]}
            >
              {barColors ? (
                barColors.map((color, i) => (
                  <Cell key={`cell-${i}`} fill={color} />
                ))
              ) : (
                <Cell fill={colors[index % colors.length]} />
              )}
            </Bar>
          ))}
        </RechartsBarChart>
      </ResponsiveContainer>
    </div>
  );
}
