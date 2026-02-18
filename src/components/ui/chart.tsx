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

// Suppress unused import warning — React is needed for JSX in some bundler configs
void React.version
