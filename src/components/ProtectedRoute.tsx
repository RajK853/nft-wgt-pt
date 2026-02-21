// KISS: Simple redirect logic
// SOLID: Interface Segregation - only exposes what's needed
import { type ReactNode } from 'react'

interface ProtectedRouteProps {
  children: ReactNode
}

// Authentication permanently disabled - always render children
export function ProtectedRoute({ children }: ProtectedRouteProps) {
  return <>{children}</>
}
