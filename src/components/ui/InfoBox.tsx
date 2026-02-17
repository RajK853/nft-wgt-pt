/**
 * InfoBox Component
 * Informational box with icon and optional link
 * Used for explaining scoring system and providing context
 * Theme-aware using CSS variables
 */

import { InformationCircleIcon } from '@heroicons/react/24/solid'
import { useTheme } from '@/hooks/useTheme'

interface InfoBoxProps {
  title?: string
  children: React.ReactNode
  link?: {
    text: string
    href: string
  }
  variant?: 'info' | 'warning' | 'success'
  className?: string
}

export function InfoBox({ 
  title, 
  children, 
  link, 
  variant = 'info',
  className = '' 
}: InfoBoxProps) {
  const { resolvedTheme } = useTheme()
  const isDark = resolvedTheme === 'dark'

  const variantStyles = {
    info: isDark 
      ? 'bg-blue-900/20 border-blue-700/50 text-blue-200' 
      : 'bg-blue-50 border-blue-200 text-blue-800',
    warning: isDark 
      ? 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200' 
      : 'bg-yellow-50 border-yellow-200 text-yellow-800',
    success: isDark 
      ? 'bg-green-900/20 border-green-700/50 text-green-200' 
      : 'bg-green-50 border-green-200 text-green-800'
  }

  const iconColors = {
    info: isDark ? 'text-blue-400' : 'text-blue-600',
    warning: isDark ? 'text-yellow-400' : 'text-yellow-600',
    success: isDark ? 'text-green-400' : 'text-green-600'
  }

  const linkClasses = isDark 
    ? 'inline-block mt-2 text-sm font-medium hover:underline opacity-80 hover:opacity-100' 
    : 'inline-block mt-2 text-sm font-medium hover:underline text-blue-600'

  return (
    <div className={`rounded-lg border p-4 ${variantStyles[variant]} ${className}`}>
      <div className="flex items-start gap-3">
        <InformationCircleIcon className={`h-5 w-5 flex-shrink-0 mt-0.5 ${iconColors[variant]}`} />
        <div className="flex-1">
          {title && (
            <h4 className="font-medium mb-1">{title}</h4>
          )}
          <div className="text-sm opacity-90">
            {children}
          </div>
          {link && (
            <a 
              href={link.href}
              className={linkClasses}
            >
              {link.text} →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
