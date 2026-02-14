/**
 * PageTemplate Component
 * Standard layout template for all pages
 * Provides: centered container, header, section structure
 * 
 * Usage:
 * <PageTemplate
 *   title="Page Title"
 *   subtitle="Optional description"
 * >
 *   <Section title="Section 1">...</Section>
 *   <Section title="Section 2">...</Section>
 * </PageTemplate>
 */

import { ReactNode } from 'react'

interface PageTemplateProps {
  title: string
  subtitle?: string
  children: ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '3xl'
}

interface SectionProps {
  title?: string
  children: ReactNode
  fullWidth?: boolean
}

const MAX_WIDTH_CLASSES = {
  sm: 'max-w-3xl',
  md: 'max-w-4xl',
  lg: 'max-w-5xl',
  xl: 'max-w-6xl',
  '2xl': 'max-w-7xl',
  '3xl': 'max-w-full'
}

export function PageTemplate({ 
  title, 
  subtitle, 
  children,
  maxWidth = '2xl'
}: PageTemplateProps) {
  return (
    <div className={`mx-auto w-full px-4 sm:px-6 lg:px-8 py-6 ${MAX_WIDTH_CLASSES[maxWidth]}`}>
      {/* Page Header */}
      <header className="mb-8">
        <h1 className="text-2xl sm:text-3xl font-bold text-white">
          {title}
        </h1>
        {subtitle && (
          <p className="mt-1 text-sm sm:text-base text-gray-400">
            {subtitle}
          </p>
        )}
      </header>
      
      {/* Page Content */}
      {children}
    </div>
  )
}

/**
 * Section Component
 * Standard section within a page
 * Provides consistent styling for grouped content
 */
export function Section({ title, children, fullWidth = false }: SectionProps) {
  return (
    <section className={`mb-8 ${fullWidth ? '' : ''}`}>
      {title && (
        <h2 className="text-lg font-semibold text-white mb-4">
          {title}
        </h2>
      )}
      {children}
    </section>
  )
}

/**
 * TwoColumn Section Layout
 * For side-by-side content
 */
export function TwoColumn({ 
  left, 
  right 
}: { 
  left: ReactNode
  right: ReactNode 
}) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <div>{left}</div>
      <div>{right}</div>
    </div>
  )
}

/**
 * CardGrid - for responsive card layouts
 */
export function CardGrid({ 
  children,
  columns = 3
}: { 
  children: ReactNode
  columns?: 2 | 3 | 4
}) {
  const gridCols = {
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'
  }
  
  return (
    <div className={`grid ${gridCols[columns]} gap-4`}>
      {children}
    </div>
  )
}
