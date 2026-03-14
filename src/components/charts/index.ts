import { lazy } from 'react'

export const LazyBarChart = lazy(() =>
  import('./BarChart').then(module => ({ default: module.BarChart }))
)

export const LazyLineChart = lazy(() =>
  import('./LineChart').then(module => ({ default: module.LineChart }))
)

export const LazyPieChart = lazy(() =>
  import('./PieChart').then(module => ({ default: module.PieChart }))
)

export { LineChart } from './LineChart';
export { BarChart } from './BarChart';
export { PieChart } from './PieChart';