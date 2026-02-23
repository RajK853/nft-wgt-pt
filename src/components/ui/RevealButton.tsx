/**
 * RevealButton Component
 * Animated button with countdown before revealing content
 * Used for Top Performers section in Dashboard
 */

import { useReducer, useEffect, useCallback, useRef } from 'react'
import { animate } from 'framer-motion'
import { cn } from '@/lib/utils'
import styles from './RevealButton.module.css'

interface RevealButtonProps {
  label: string
  onReveal: () => void
  onReset?: () => void
  isRevealed?: boolean
  countdownSeconds?: number
  variant?: 'primary' | 'secondary' | 'success'
}

type Phase = 'idle' | 'counting' | 'revealed'
type State = { phase: Phase; countdown: number | null }
type Action =
  | { type: 'START'; seconds: number }
  | { type: 'TICK' }
  | { type: 'REVEAL' }
  | { type: 'RESET' }

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'START':
      return { phase: 'counting', countdown: action.seconds }
    case 'TICK':
      return { ...state, countdown: (state.countdown ?? 1) - 1 }
    case 'REVEAL':
      return { phase: 'revealed', countdown: null }
    case 'RESET':
      return { phase: 'idle', countdown: null }
    default:
      return state
  }
}

export function RevealButton({
  label,
  onReveal,
  onReset,
  isRevealed,
  countdownSeconds = 3,
  variant = 'primary',
}: RevealButtonProps) {
  const [{ phase, countdown }, dispatch] = useReducer(reducer, {
    phase: 'idle',
    countdown: null,
  })

  const buttonRef = useRef<HTMLButtonElement>(null)

  // Sync internal state with external isRevealed prop
  useEffect(() => {
    if (isRevealed === true && phase !== 'revealed') {
      dispatch({ type: 'REVEAL' })
    } else if (isRevealed === false && phase === 'revealed') {
      dispatch({ type: 'RESET' })
    }
  }, [isRevealed, phase])

  // Determine the effective phase based on prop
  const effectivePhase = isRevealed === true ? 'revealed' : phase

  const handleClick = useCallback(() => {
    if (effectivePhase === 'revealed') return
    dispatch({ type: 'START', seconds: countdownSeconds })
  }, [countdownSeconds, effectivePhase])

  // Heartbeat animation when countdown changes
  useEffect(() => {
    if (phase !== 'counting' || countdown === null || !buttonRef.current) return

    // Trigger heartbeat animation on the button
    animate(
      buttonRef.current,
      { scale: [1, 1.08, 1] },
      { duration: 0.3, ease: 'easeInOut' }
    )
  }, [countdown, phase])

  useEffect(() => {
    if (phase !== 'counting' || countdown === null) return

    if (countdown === 0) {
      dispatch({ type: 'REVEAL' })
      onReveal()
      return
    }

    const timer = setTimeout(() => {
      dispatch({ type: 'TICK' })
    }, 1000)

    return () => clearTimeout(timer)
  }, [phase, countdown, onReveal])

  const handleReset = () => {
    dispatch({ type: 'RESET' })
    onReset?.()
  }

  return (
    <div className={styles.container}>
      <button
        ref={buttonRef}
        className={cn(
          styles.button,
          styles[variant],
          phase === 'counting' && styles.animating,
          phase === 'counting' && styles.heartbeatGlow,
          effectivePhase === 'revealed' && styles.revealed
        )}
        onClick={handleClick}
        disabled={effectivePhase !== 'idle'}
      >
        {phase === 'counting' && countdown !== null ? (
          <span className={styles.countdown}>
            <span className={styles.countdownNumber}>{countdown}</span>
            <span className={styles.countdownText}>Get Ready...</span>
          </span>
        ) : effectivePhase === 'revealed' ? (
          <span className={styles.revealedText}>✓ Revealed</span>
        ) : (
          <span className={styles.label}>{label}</span>
        )}
      </button>

      {effectivePhase === 'revealed' && (
        <button className={styles.resetButton} onClick={handleReset}>
          ↺ Reset
        </button>
      )}
    </div>
  )
}

export default RevealButton
