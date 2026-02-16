"use client"

import * as React from "react"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  PieChart as RechartsPieChart,
  Pie,
  LineChart as RechartsLineChart,
  Line,
  AreaChart as RechartsAreaChart,
  Area,
  RadarChart as RechartsRadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RadialBarChart as RechartsRadialBarChart,
  RadialBar,
} from "recharts"
import { useTheme } from "@/hooks/useTheme"

// Re-export all chart components
export {
  RechartsBarChart as BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
  Cell,
  RechartsPieChart as PieChart,
  Pie,
  RechartsLineChart as LineChart,
  Line,
  RechartsAreaChart as AreaChart,
  Area,
  RechartsRadarChart as RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  RechartsRadialBarChart as RadialBarChart,
  RadialBar,
}

// Theme-aware colors
const getChartColors = (isDark: boolean) => ({
  gridColor: isDark ? '#374151' : '#e5e7eb',
  axisColor: isDark ? '#9ca3af' : '#6b7280',
  tooltipBg: isDark ? '#1f2937' : '#ffffff',
  tooltipBorder: isDark ? '#374151' : '#e5e7eb',
  tooltipText: isDark ? '#fff' : '#1f2937',
  legendText: isDark ? '#9ca3af' : '#6b7280',
})

// Simple shadcn-style BarChart component (KISS)
interface SimpleBarChartProps {
  data: Array<{ name: string; value: number; fill?: string }>
  layout?: "horizontal" | "vertical"
  colors?: string[]
}

export function SimpleBarChart({ 
  data, 
  layout = "horizontal",
  colors = ["#94a3b8", "#64748b", "#475569"]
}: SimpleBarChartProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'
  const chartColors = getChartColors(isDark)
  const defaultColor = colors[0]
  
  return (
    <ResponsiveContainer width="100%" height={300}>
      <RechartsBarChart 
        data={data} 
        layout={layout}
        margin={{ top: 10, right: 10, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke={chartColors.gridColor} />
        {layout === "horizontal" ? (
          <>
            <XAxis 
              dataKey="name" 
              stroke={chartColors.axisColor}
              tick={{ fill: chartColors.axisColor, fontSize: 12 }}
              angle={-45}
              textAnchor="end"
              height={80}
            />
            <YAxis stroke={chartColors.axisColor} tick={{ fill: chartColors.axisColor, fontSize: 12 }} />
          </>
        ) : (
          <>
            <XAxis type="number" stroke={chartColors.axisColor} tick={{ fill: chartColors.axisColor, fontSize: 12 }} />
            <YAxis dataKey="name" type="category" stroke={chartColors.axisColor} tick={{ fill: chartColors.axisColor, fontSize: 12 }} width={100} />
          </>
        )}
        <Tooltip 
          contentStyle={{ backgroundColor: chartColors.tooltipBg, border: `1px solid ${chartColors.tooltipBorder}`, borderRadius: "8px", color: chartColors.tooltipText }}
          labelStyle={{ color: chartColors.tooltipText }}
        />
        <Legend />
        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
          {data.map((entry, index) => (
            <Cell key={`cell-${index}`} fill={entry.fill || defaultColor} />
          ))}
        </Bar>
      </RechartsBarChart>
    </ResponsiveContainer>
  )
}
