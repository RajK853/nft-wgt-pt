/**
 * MetricCard Component
 * Display a metric with label, value, and optional delta
 * KISS: Simple, reusable component
 * Theme-aware using CSS variables
 */

import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string | number
  help?: string
  variant?: 'default' | 'success' | 'danger' | 'warning'
}

export function MetricCard({ label, value, delta, help, variant = 'default' }: MetricCardProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="rounded-lg border p-4 bg-muted/50 border-border">
        <div className="text-sm text-muted-foreground mb-1">{label}</div>
        <div className="text-2xl font-bold text-foreground">-</div>
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const variantStyles = {
    default: isDark ? 'bg-gray-800/50 border-gray-700' : 'bg-gray-100 border-gray-200',
    success: isDark ? 'bg-green-900/30 border-green-700' : 'bg-green-50 border-green-200',
    danger: isDark ? 'bg-red-900/30 border-red-700' : 'bg-red-50 border-red-200',
    warning: isDark ? 'bg-amber-900/30 border-amber-700' : 'bg-amber-50 border-amber-200'
  }

  const valueColors = {
    default: isDark ? 'text-white' : 'text-gray-900',
    success: isDark ? 'text-green-400' : 'text-green-700',
    danger: isDark ? 'text-red-400' : 'text-red-700',
    warning: isDark ? 'text-amber-400' : 'text-amber-700'
  }

  const deltaColors = {
    default: delta && parseFloat(String(delta)) >= 0 
      ? (isDark ? 'text-green-400' : 'text-green-600') 
      : (isDark ? 'text-red-400' : 'text-red-600'),
    success: isDark ? 'text-green-400' : 'text-green-700',
    danger: isDark ? 'text-red-400' : 'text-red-700',
    warning: isDark ? 'text-amber-400' : 'text-amber-700'
  }

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className={`text-sm mb-1 ${isDark ? 'text-gray-400' : 'text-gray-600'}`}>{label}</div>
      <div className={`text-2xl font-bold ${valueColors[variant]}`}>
        {value}
      </div>
      {delta !== undefined && (
        <div className={`text-sm mt-1 ${deltaColors[variant]}`}>
          {typeof delta === 'number' && delta > 0 ? '+' : ''}{delta}
        </div>
      )}
      {help && (
        <div className={`text-xs mt-2 ${isDark ? 'text-gray-500' : 'text-gray-400'}`} title={help}>
          {help}
        </div>
      )}
    </div>
  )
}
