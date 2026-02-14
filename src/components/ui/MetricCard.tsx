/**
 * MetricCard Component
 * Display a metric with label, value, and optional delta
 * KISS: Simple, reusable component
 */

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string | number
  help?: string
  variant?: 'default' | 'success' | 'danger' | 'warning'
}

export function MetricCard({ label, value, delta, help, variant = 'default' }: MetricCardProps) {
  const variantStyles = {
    default: 'bg-gray-800/50 border-gray-700',
    success: 'bg-green-900/30 border-green-700',
    danger: 'bg-red-900/30 border-red-700',
    warning: 'bg-amber-900/30 border-amber-700'
  }

  const valueColors = {
    default: 'text-white',
    success: 'text-green-400',
    danger: 'text-red-400',
    warning: 'text-amber-400'
  }

  const deltaColors = {
    default: delta && parseFloat(String(delta)) >= 0 ? 'text-green-400' : 'text-red-400',
    success: 'text-green-400',
    danger: 'text-red-400',
    warning: 'text-amber-400'
  }

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]}`}>
      <div className="text-sm text-gray-400 mb-1">{label}</div>
      <div className={`text-2xl font-bold ${valueColors[variant]}`}>
        {value}
      </div>
      {delta !== undefined && (
        <div className={`text-sm mt-1 ${deltaColors[variant]}`}>
          {typeof delta === 'number' && delta > 0 ? '+' : ''}{delta}
        </div>
      )}
      {help && (
        <div className="text-xs text-gray-500 mt-2" title={help}>
          {help}
        </div>
      )}
    </div>
  )
}
