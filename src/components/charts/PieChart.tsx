/**
 * Pie Chart Component
 * Simple, clean pie/donut chart using Recharts defaults
 * Supports light/dark theme
 */

import {
  PieChart as RechartsPieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts'
import { useTheme } from '@/hooks/useTheme'
import { getChartColors, PIE_DEFAULT_COLORS, DONUT_INNER_RADIUS_RATIO } from '@/lib/chartTheme'

interface PieChartProps {
  data: Array<{ name: string; value: number }>
  title?: string
  height?: number
  colors?: string[]
  donut?: boolean
}

export function PieChart({
  data,
  title,
  height = 300,
  colors = PIE_DEFAULT_COLORS,
  donut = true,
}: PieChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const chartColors = getChartColors(isDark)

  // Proportional radius so the chart always fits in its container
  const outerRadius = Math.min(height / 2.5, 100)
  const innerRadius = donut ? outerRadius * DONUT_INNER_RADIUS_RATIO : 0

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
            dataKey="value"
          >
            {data.map((_, index) => (
              <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{
              backgroundColor: chartColors.tooltipBg,
              border: `1px solid ${chartColors.tooltipBorder}`,
              borderRadius: '8px',
              color: chartColors.tooltipText,
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
  )
}
