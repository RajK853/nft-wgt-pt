/**
 * NumberInput Component
 * Input field for numeric values with increment/decrement controls
 * Used for simulation controls in Scoring Method page
 */

import { useState, useEffect, useCallback } from 'react'
import styles from './NumberInput.module.css'

interface NumberInputProps {
  value: number
  onChange: (value: number) => void
  min?: number
  max?: number
  step?: number
  label?: string
  disabled?: boolean
  error?: string
  required?: boolean
}

export function NumberInput({
  value,
  onChange,
  min = 0,
  max = 100,
  step = 1,
  label,
  disabled = false,
  error,
  required = false
}: NumberInputProps) {
  const [inputValue, setInputValue] = useState(String(value))

  // Keep the text field in sync when the value prop changes externally
  useEffect(() => {
    setInputValue(String(value))
  }, [value])

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
      {label && (
        <label className={styles.label} id={`${label}-label`}>
          {label}
          {required && <span aria-hidden="true" style={{ color: 'var(--color-legacy-error)', marginLeft: '0.25rem' }}> *</span>}
        </label>
      )}
      <div className={`${styles.inputWrapper} ${error ? styles.error : ''}`}>
        <button
          className={styles.button}
          onClick={handleDecrement}
          disabled={disabled || value <= min}
          type="button"
          aria-label={`Decrease ${label || 'value'} by ${step}`}
          aria-controls={`number-input-${label || 'value'}`}
        >
          −
        </button>
        <input
          id={`number-input-${label || 'value'}`}
          type="number"
          className={styles.input}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleBlur}
          min={min}
          max={max}
          step={step}
          disabled={disabled}
          aria-labelledby={label ? `${label}-label` : undefined}
          aria-describedby={error ? `${label}-error` : undefined}
          aria-invalid={!!error}
          aria-required={required}
        />
        <button
          className={styles.button}
          onClick={handleIncrement}
          disabled={disabled || value >= max}
          type="button"
          aria-label={`Increase ${label || 'value'} by ${step}`}
          aria-controls={`number-input-${label || 'value'}`}
        >
          +
        </button>
      </div>
      {error && (
        <span id={`${label}-error`} className={styles.errorMessage} role="alert">
          {error}
        </span>
      )}
    </div>
  )
}

export default NumberInput
