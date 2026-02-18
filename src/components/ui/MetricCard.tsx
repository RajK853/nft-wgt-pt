/**
 * MetricCard Component
 * Display a metric with label, value, and optional delta
 * KISS: Simple, reusable component
 * Theme-aware using CSS variables and legacy colors
 * Supports sentiment-based coloring for values
 */


type Sentiment = 'positive' | 'negative' | 'neutral' | 'rival' | 'auto'

interface MetricCardProps {
  label: string
  value: string | number
  delta?: string | number
  help?: string
  sentiment?: Sentiment
}

export function MetricCard({ label, value, delta, help, sentiment = 'auto' }: MetricCardProps) {
  // Use legacy colors - neutral backgrounds
  const cardStyles = {
    backgroundColor: 'var(--color-legacy-bg-tertiary)',
    borderColor: 'var(--color-legacy-border)'
  }

  const labelStyle = {
    color: 'var(--color-legacy-text-secondary)'
  }

  // Get color based on sentiment
  const getValueColor = (): string => {
    // Use legacy accent (purple) for rival sentiment
    if (sentiment === 'rival') {
      return 'var(--color-legacy-accent)'
    }
    // Neutral sentiment always uses text color
    if (sentiment === 'neutral') {
      return 'var(--color-legacy-text-primary)'
    }
    // Positive sentiment always uses success color
    if (sentiment === 'positive') {
      return 'var(--color-legacy-success)'
    }
    // Negative sentiment always uses error color
    if (sentiment === 'negative') {
      return 'var(--color-legacy-error)'
    }
    // Auto: use delta-based coloring - positive delta = green, negative = red
    return 'var(--color-legacy-text-primary)'
  }

  // Delta colors - green for positive, red for negative
  const getDeltaStyle = () => {
    if (delta === undefined) return { color: 'var(--color-legacy-text-muted)' }

    const numDelta = parseFloat(String(delta))
    if (numDelta > 0) {
      return { color: 'var(--color-legacy-success)' }
    }
    if (numDelta < 0) {
      return { color: 'var(--color-legacy-error)' }
    }
    return { color: 'var(--color-legacy-text-muted)' }
  }

  const helpStyle = {
    color: 'var(--color-legacy-text-disabled)'
  }

  const sentimentValueStyle = {
    color: getValueColor()
  }

  return (
    <div className="rounded-lg border p-4" style={cardStyles}>
      <div className="text-sm mb-1" style={labelStyle}>{label}</div>
      <div className="text-2xl font-bold" style={sentimentValueStyle}>
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
