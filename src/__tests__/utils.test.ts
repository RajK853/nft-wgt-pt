/**
 * Utility Functions Tests
 * 
 * Tests for lib/utils.ts functions.
 */

import { cn } from '../lib/utils';
import { Validators, validateForm, hasErrors, getFirstError } from '../lib/validation';

describe('cn utility', () => {
  test('should merge class names', () => {
    const result = cn('foo', 'bar');
    expect(result).toBe('foo bar');
  });

  test('should handle conditional classes', () => {
    const result = cn('foo', false && 'bar', 'baz');
    expect(result).toBe('foo baz');
  });

  test('should handle undefined and null', () => {
    const result = cn('foo', undefined, null, 'bar');
    expect(result).toBe('foo bar');
  });

  test('should handle empty strings', () => {
    const result = cn('foo', '', 'bar');
    expect(result).toBe('foo bar');
  });

  test('should merge tailwind classes correctly', () => {
    const result = cn('px-2 py-1', 'px-4');
    // Last class should win for conflicting tailwind classes
    expect(result).toContain('px-4');
    expect(result).toContain('py-1');
  });
});

describe('Validation utilities', () => {
  describe('Validators.email', () => {
    test('should validate correct email', () => {
      const result = Validators.email('test@example.com');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject invalid email', () => {
      const result = Validators.email('invalid');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Invalid email format');
    });

    test('should reject empty email', () => {
      const result = Validators.email('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Email is required');
    });
  });

  describe('Validators.password', () => {
    test('should validate strong password', () => {
      const result = Validators.password('StrongPass123!');
      expect(result.isValid).toBe(true);
      expect(result.error).toBeNull();
    });

    test('should reject weak password', () => {
      const result = Validators.password('weak');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 8 characters');
    });

    test('should reject empty password', () => {
      const result = Validators.password('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password is required');
    });
  });

  describe('Validators.required', () => {
    test('should validate non-empty value', () => {
      const result = Validators.required('hello');
      expect(result.isValid).toBe(true);
    });

    test('should reject empty value', () => {
      const result = Validators.required('');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('This field is required');
    });

    test('should use custom field name', () => {
      const result = Validators.required('', 'Username');
      expect(result.error).toBe('Username is required');
    });
  });

  describe('Validators.minLength', () => {
    test('should validate minimum length', () => {
      const validator = Validators.minLength(5, 'Password');
      const result = validator('hello');
      expect(result.isValid).toBe(true);
    });

    test('should reject short value', () => {
      const validator = Validators.minLength(5, 'Password');
      const result = validator('hi');
      expect(result.isValid).toBe(false);
      expect(result.error).toBe('Password must be at least 5 characters');
    });
  });

  describe('validateForm', () => {
    test('should validate form with multiple rules', () => {
      const data = { email: 'test@example.com', password: 'password123' };
      const rules = {
        email: [Validators.email],
        password: [Validators.password]
      };
      const errors = validateForm(data, rules);
      expect(errors.email).toBeNull();
      expect(errors.password).toBeNull();
    });

    test('should catch validation errors', () => {
      const data = { email: 'invalid', password: '123' };
      const rules = {
        email: [Validators.email],
        password: [Validators.password]
      };
      const errors = validateForm(data, rules);
      expect(errors.email).toBe('Invalid email format');
      expect(errors.password).toBe('Password must be at least 8 characters');
    });
  });

  describe('hasErrors', () => {
    test('should return true when errors exist', () => {
      const errors = { email: 'Invalid email', password: null };
      expect(hasErrors(errors)).toBe(true);
    });

    test('should return false when no errors', () => {
      const errors = { email: null, password: null };
      expect(hasErrors(errors)).toBe(false);
    });
  });

  describe('getFirstError', () => {
    test('should return first error message', () => {
      const errors = { email: 'Invalid email', password: 'Weak password' };
      expect(getFirstError(errors)).toBe('Invalid email');
    });

    test('should return null when no errors', () => {
      const errors = { email: null, password: null };
      expect(getFirstError(errors)).toBeNull();
    });
  });
});
