/**
 * Input Validation Utilities
 * 
 * KISS: Simple, reusable validation functions
 * SOLID: Liskov Substitution - each validator can be used independently
 */

/**
 * Email validation regex
 */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

/**
 * Validation result type
 */
export type ValidationResult = {
  isValid: boolean
  error: string | null
}

/**
 * Individual validator function type
 */
export type Validator = (value: string) => ValidationResult

/**
 * Pre-built validator functions
 */
export const Validators = {
  /**
   * Email validation
   */
  email: (value: string): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, error: 'Email is required' }
    }
    if (!EMAIL_REGEX.test(value)) {
      return { isValid: false, error: 'Invalid email format' }
    }
    return { isValid: true, error: null }
  },

  /**
   * Password validation (minimum 8 characters)
   */
  password: (value: string): ValidationResult => {
    if (!value) {
      return { isValid: false, error: 'Password is required' }
    }
    if (value.length < 8) {
      return { isValid: false, error: 'Password must be at least 8 characters' }
    }
    return { isValid: true, error: null }
  },

  /**
   * Required field validation
   */
  required: (value: string, fieldName = 'This field'): ValidationResult => {
    if (!value.trim()) {
      return { isValid: false, error: `${fieldName} is required` }
    }
    return { isValid: true, error: null }
  },

  /**
   * Minimum length validation
   */
  minLength: (min: number, fieldName = 'This field'): Validator => {
    return (value: string): ValidationResult => {
      if (value.length < min) {
        return { isValid: false, error: `${fieldName} must be at least ${min} characters` }
      }
      return { isValid: true, error: null }
    }
  },

  /**
   * Maximum length validation
   */
  maxLength: (max: number, fieldName = 'This field'): Validator => {
    return (value: string): ValidationResult => {
      if (value.length > max) {
        return { isValid: false, error: `${fieldName} must be at most ${max} characters` }
      }
      return { isValid: true, error: null }
    }
  },

  /**
   * Confirm password validation
   */
  confirmPassword: (password: string): Validator => {
    return (value: string): ValidationResult => {
      if (value !== password) {
        return { isValid: false, error: 'Passwords do not match' }
      }
      return { isValid: true, error: null }
    }
  }
}

/**
 * Form validation helper
 * 
 * @param data - Form data to validate
 * @param rules - Validation rules for each field
 * @returns Object with errors for each field
 */
export function validateForm<T extends Record<string, string>>(
  data: T,
  rules: Partial<Record<keyof T, Validator[]>>
): Record<keyof T, string | null> {
  const errors = {} as Record<keyof T, string | null>

  for (const [field, fieldRules] of Object.entries(rules)) {
    const value = data[field] || ''
    const fieldRulesArray = fieldRules || []

    for (const validator of fieldRulesArray) {
      const result = validator(value)
      if (!result.isValid) {
        errors[field as keyof T] = result.error
        break // Stop at first error
      }
    }

    if (!errors[field as keyof T]) {
      errors[field as keyof T] = null
    }
  }

  return errors
}

/**
 * Check if form has any errors
 */
export function hasErrors<T extends Record<string, string | null>>(
  errors: T
): boolean {
  return Object.values(errors).some(error => error !== null)
}

/**
 * Get first error message
 */
export function getFirstError<T extends Record<string, string | null>>(
  errors: T
): string | null {
  const errorValues = Object.values(errors).filter(Boolean)
  return errorValues.length > 0 ? errorValues[0] : null
}
