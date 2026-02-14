/**
 * NumberInput Component
 * Input field for numeric values with increment/decrement controls
 * Used for simulation controls in Scoring Method page
 */

import { useState, useCallback } from 'react'
import styles from './NumberInput.module.css'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(String(value))

  const handleInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    
    const num = parseFloat(val)
    if (!isNaN(num) && num >= min && num <= max) {
      onChange(num)
    }
  }, [min, max, onChange])

  const handleBlur = useCallback(() => {
    const num = parseFloat(inputValue)
    if (isNaN(num)) {
      setInputValue(String(value))
    } else {
      const clamped = Math.min(Math.max(num, min), max)
      setInputValue(String(clamped))
      if (clamped !== value) {
        onChange(clamped)
      }
    }
  }, [inputValue, min, max, onChange, value])

  const handleIncrement = useCallback(() => {
    const newValue = Math.min(value + step, max)
    setInputValue(String(newValue))
    onChange(newValue)
  }, [value, step, max, onChange])

  const handleDecrement = useCallback(() => {
    const newValue = Math.max(value - step, min)
    setInputValue(String(newValue))
    onChange(newValue)
  }, [value, step, min, onChange])

  return (
    <div className={styles.container}>
      {label && <label className={styles.label}>{label}</label>}
      <div className={styles.inputWrapper}>
        <button
          className={styles.button}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          type="button"
        >
          −
        </button>
        <input
          type="number"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
        />
        <button
          className={styles.button}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          type="button"
        >
          +
        </button>
      </div>
    </div>
  )
}

export default NumberInput
