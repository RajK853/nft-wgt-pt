/**
 * MetricCard Component
 * Display a metric with label, value, and optional delta
 * KISS: Simple, reusable component
 * Theme-aware using CSS variables and legacy colors
 * Supports sentiment-based coloring for values
 */


interface MetricCardProps {
  label: string
  value: string | number
  delta?: string | number
  help?: string
  /** CSS variable for delta text color, e.g., 'var(--color-legacy-success)' */
  deltaColor?: string
}

export function MetricCard({ label, value, delta, help, deltaColor }: MetricCardProps): JSX.Element {
  // Use legacy colors - neutral backgrounds
  const cardStyles = {
    backgroundColor: 'var(--color-legacy-bg-tertiary)',
    borderColor: 'var(--color-legacy-border)'
  }

  const labelStyle = {
    color: 'var(--color-legacy-text-secondary)'
  }

  // Value always uses neutral text color
  const valueStyle = {
    color: 'var(--color-legacy-text-primary)'
  }

  // Delta style - use provided color or default to muted
  const getDeltaStyle = (): React.CSSProperties => {
    if (delta === undefined) return { color: 'var(--color-legacy-text-muted)' }
    if (deltaColor) return { color: deltaColor }
    return { color: 'var(--color-legacy-text-muted)' }
  }

  const helpStyle = {
    color: 'var(--color-legacy-text-disabled)'
  }

  return (
    <div className="rounded-lg border p-4" style={cardStyles}>
      <div className="text-sm mb-1" style={labelStyle}>{label}</div>
      <div className="text-2xl font-bold" style={valueStyle}>
        {value}
      </div>
      {delta !== undefined && (
        <div className="text-sm mt-1" style={getDeltaStyle()}>
          {typeof delta === 'number' && delta > 0 ? '+' : ''}{delta}
        </div>
      )}
      {help && (
        <div className="text-xs mt-2" style={helpStyle} title={help}>
          {help}
        </div>
      )}
    </div>
  )
}
