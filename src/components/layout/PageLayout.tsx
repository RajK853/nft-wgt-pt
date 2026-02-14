/**
 * PageLayout Component
 * Global layout template for all pages
 * Provides consistent structure: Header + Main Content
 */

import { ReactNode } from 'react'
import Header from './Header'

interface PageLayoutProps {
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'full'
  padding?: 'none' | 'sm' | 'md' | 'lg'
}

export function PageLayout({ 
  children, 
  maxWidth = '2xl',
  padding = 'md'
}: PageLayoutProps) {
  const maxWidthClasses = {
    sm: 'max-w-screen-sm',
    md: 'max-w-screen-md',
    lg: 'max-w-screen-lg',
    xl: 'max-w-screen-xl',
    '2xl': 'max-w-6xl',
    full: 'max-w-full'
  }

  const paddingClasses = {
    none: '',
    sm: 'p-2',
    md: 'p-4',
    lg: 'p-6'
  }

  return (
    <div className="min-h-screen bg-gray-900">
      {/* Global Header */}
      <Header />
      
      {/* Main Content Area */}
      <main className={`mx-auto ${maxWidthClasses[maxWidth]} ${paddingClasses[padding]}`}>
        {children}
      </main>
    </div>
  )
}
