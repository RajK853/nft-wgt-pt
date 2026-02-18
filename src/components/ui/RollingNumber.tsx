/**
 * RollingNumber Component
 * Displays a number with slot machine digit cycling effect
 * Each digit cycles 0-9 and stops on the correct value
 * Left digit has maxDuration, right digit has minDuration
 * KISS: Simple, single-purpose component
 */

import { useEffect, useRef } from 'react'

interface RollingNumberProps {
  value: number
  decimals?: number
  prefix?: string
  suffix?: string
  enabled?: boolean
  maxDuration?: number
  minDuration?: number
}

// Format number to string with commas and decimals
function formatToString(num: number, decimals: number): string {
  const fixed = num.toFixed(decimals)
  const parts = fixed.split('.')
  parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
  return parts.join('.')
}

export function RollingNumber({
  value,
  decimals = 0,
  prefix = '',
  suffix = '',
  enabled = true,
  maxDuration = 2000,
  minDuration = 1000,
}: RollingNumberProps): JSX.Element {
  const containerRef = useRef<HTMLSpanElement>(null)
  const rafRef = useRef<number | null>(null)
  const isRunningRef = useRef(false)

  const initialValue = enabled ? 0 : value
  const initialDisplay = formatToString(initialValue, decimals)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    if (!enabled) {
      container.textContent = `${prefix}${formatToString(value, decimals)}${suffix}`
      return
    }

    isRunningRef.current = true

    // Get target digits (excluding commas)
    const formatted = formatToString(value, decimals)
    const targetDigits = formatted.split('').filter(c => c !== ',')
    const totalDigits = targetDigits.length

    // Create digit elements and pre-compute durations
    container.innerHTML = ''
    const digitData: { element: HTMLSpanElement; target: string; duration: number; isStatic: boolean; index: number }[] = []

    for (let i = 0; i < targetDigits.length; i++) {
      const target = targetDigits[i]
      const isNumeric = target >= '0' && target <= '9'
      const span = document.createElement('span')

      if (isNumeric) {
        span.textContent = '0'
        const duration = maxDuration - (i / Math.max(totalDigits - 1, 1)) * (maxDuration - minDuration)
        digitData.push({ element: span, target, duration, isStatic: false, index: i })
      } else {
        // Non-numeric characters (decimal, %, etc.) - don't animate
        span.textContent = target
        digitData.push({ element: span, target, duration: 0, isStatic: true, index: i })
      }

      container.appendChild(span)
    }

    const startTime = performance.now()

    const animate = (currentTime: number) => {
      if (!isRunningRef.current) return

      const elapsed = currentTime - startTime
      let allStopped = true

      for (const data of digitData) {
        const { element, target, duration, isStatic, index } = data

        if (isStatic) continue

        if (elapsed >= duration) {
          element.textContent = target
        } else {
          allStopped = false
          const cycleSpeed = 50
          const currentCycle = Math.floor(elapsed / cycleSpeed)
          element.textContent = String((currentCycle + index) % 10)
        }
      }

      if (!allStopped && isRunningRef.current) {
        rafRef.current = requestAnimationFrame(animate)
      }
    }

    rafRef.current = requestAnimationFrame(animate)

    return () => {
      isRunningRef.current = false
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current)
      }
    }
  }, [value, enabled, decimals, maxDuration, minDuration, prefix, suffix])

  return (
    <span ref={containerRef}>
      {prefix}{initialDisplay}{suffix}
    </span>
  )
}

export default RollingNumber
