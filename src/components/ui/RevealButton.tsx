/**
 * RevealButton Component
 * Animated button with countdown before revealing content
 * Used for Top Performers section in Dashboard
 */

import { useState, useEffect, useCallback } from 'react'
import { cn } from '@/lib/utils'
import styles from './RevealButton.module.css'

interface RevealButtonProps {
  label: string
  onReveal: () => void
  onReset?: () => void
  countdownSeconds?: number
  variant?: 'primary' | 'secondary' | 'success'
}

export function RevealButton({ 
  label, 
  onReveal, 
  onReset,
  countdownSeconds = 3,
  variant = 'primary' 
}: RevealButtonProps) {
  const [countdown, setCountdown] = useState<number | null>(null)
  const [isRevealed, setIsRevealed] = useState(false)
  const [isAnimating, setIsAnimating] = useState(false)

  const handleClick = useCallback(() => {
    if (isRevealed) return
    setIsAnimating(true)
    setCountdown(countdownSeconds)
  }, [countdownSeconds, isRevealed])

  useEffect(() => {
    if (countdown === null) return

    if (countdown === 0) {
      setIsRevealed(true)
      setIsAnimating(false)
      onReveal()
      setCountdown(null)
      return
    }

    const timer = setTimeout(() => {
      setCountdown(countdown - 1)
    }, 1000)

    return () => clearTimeout(timer)
  }, [countdown, onReveal])

  const handleReset = () => {
    setIsRevealed(false)
    setCountdown(null)
    setIsAnimating(false)
    onReset?.()
  }

  return (
    <div className={styles.container}>
      <button 
        className={cn(
          styles.button,
          styles[variant],
          isAnimating && styles.animating,
          isRevealed && styles.revealed
        )}
        onClick={handleClick}
        disabled={isAnimating || isRevealed}
      >
        {isAnimating && countdown !== null ? (
          <span className={styles.countdown}>
            <span className={styles.countdownNumber}>{countdown}</span>
            <span className={styles.countdownText}>Get Ready...</span>
          </span>
        ) : isRevealed ? (
          <span className={styles.revealedText}>✓ Revealed</span>
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </button>
      
      {isRevealed && (
        <button className={styles.resetButton} onClick={handleReset}>
          ↺ Reset
        </button>
      )}
    </div>
  )
}

export default RevealButton
