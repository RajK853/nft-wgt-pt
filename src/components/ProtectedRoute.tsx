// KISS: Simple redirect logic
// SOLID: Interface Segregation - only exposes what's needed
import { type ReactNode } from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'

interface ProtectedRouteProps {
  children: ReactNode
}

// Set VITE_AUTH_DISABLED=true in .env to bypass auth during development
const AUTH_DISABLED = import.meta.env.VITE_AUTH_DISABLED === 'true'

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const { user, loading } = useAuth()
  const location = useLocation()

  if (AUTH_DISABLED) {
    return <>{children}</>
  }

  if (loading) {
    return (
      <div className="loading-container flex justify-center items-center min-h-[200px]">
        <p>Loading...</p>
      </div>
    )
  }

  if (!user) {
    return <Navigate to="/login" state={{ from: location }} replace />
  }

  return <>{children}</>
}
