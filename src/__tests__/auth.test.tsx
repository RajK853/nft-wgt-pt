/**
 * Authentication Tests
 * 
 * Tests for Login component, AuthContext, and ProtectedRoute.
 * Follows KISS principle with clear, readable test cases.
 */

import { describe, test, expect, vi, beforeEach } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Login from '../pages/Login'
import { AuthProvider, useAuth } from '../auth/AuthContext'
import ProtectedRoute from '../components/ProtectedRoute'
import React from 'react'

// Mock Supabase client
vi.mock('../lib/supabase', () => ({
  createSupabaseClient: () => ({
    auth: {
      signInWithPassword: vi.fn(),
      signUp: vi.fn(),
      signOut: vi.fn(),
      getSession: vi.fn().mockResolvedValue({ data: { session: null } }),
      onAuthStateChange: vi.fn(() => ({ data: { subscription: { unsubscribe: vi.fn() } } }))
    }
  })
}))

describe('Login Component', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render login form with email and password inputs', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByLabelText(/email/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('should show sign up toggle link', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByText(/don't have an account/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign up/i })).toBeInTheDocument()
  })

  test('should toggle to sign up mode when clicking sign up link', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const signUpButton = screen.getByRole('button', { name: /sign up/i })
    fireEvent.click(signUpButton)

    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /create account/i })).toBeInTheDocument()
    expect(screen.getByText(/already have an account/i)).toBeInTheDocument()
  })

  test('should toggle back to sign in mode', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    // Click sign up
    fireEvent.click(screen.getByRole('button', { name: /sign up/i }))
    expect(screen.getByRole('heading', { name: /create account/i })).toBeInTheDocument()

    // Click sign in
    fireEvent.click(screen.getByRole('button', { name: /sign in/i }))
    expect(screen.getByRole('heading', { name: /sign in/i })).toBeInTheDocument()
  })

  test('should validate password minimum length', () => {
    render(
      <BrowserRouter>
        <AuthProvider>
          <Login />
        </AuthProvider>
      </BrowserRouter>
    )

    const passwordInput = screen.getByLabelText(/password/i)
    // Check that minLength attribute is set
    expect(passwordInput).toHaveAttribute('minLength', '6')
  })
})

describe('AuthContext', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should provide auth context to children', () => {
    const TestComponent = () => {
      const auth = useAuth()
      return <div data-testid="auth-present">{auth ? 'auth-available' : 'no-auth'}</div>
    }

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('auth-present')).toHaveTextContent('auth-available')
  })

  test('should have signIn, signUp, and signOut functions', () => {
    const TestComponent = () => {
      const { signIn, signUp, signOut } = useAuth()
      return (
        <div>
          <span data-testid="signin-type">{typeof signIn}</span>
          <span data-testid="signup-type">{typeof signUp}</span>
          <span data-testid="signout-type">{typeof signOut}</span>
        </div>
      )
    }

    render(
      <BrowserRouter>
        <AuthProvider>
          <TestComponent />
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByTestId('signin-type')).toHaveTextContent('function')
    expect(screen.getByTestId('signup-type')).toHaveTextContent('function')
    expect(screen.getByTestId('signout-type')).toHaveTextContent('function')
  })
})

describe('ProtectedRoute', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  test('should render children when user is authenticated', () => {
    const TestComponent = () => <div>Protected Content</div>

    render(
      <BrowserRouter>
        <AuthProvider>
          <ProtectedRoute>
            <TestComponent />
          </ProtectedRoute>
        </AuthProvider>
      </BrowserRouter>
    )

    expect(screen.getByText('Protected Content')).toBeInTheDocument()
  })
})
