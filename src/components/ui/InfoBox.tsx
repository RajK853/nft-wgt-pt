/**
 * InfoBox Component
 * Informational box with icon and optional link
 * Used for explaining scoring system and providing context
 */

import { InformationCircleIcon } from '@heroicons/react/24/solid'

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
  const variantStyles = {
    info: 'bg-blue-900/20 border-blue-700/50 text-blue-200',
    warning: 'bg-yellow-900/20 border-yellow-700/50 text-yellow-200',
    success: 'bg-green-900/20 border-green-700/50 text-green-200'
  }

  const iconColors = {
    info: 'text-blue-400',
    warning: 'text-yellow-400',
    success: 'text-green-400'
  }

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
              className="inline-block mt-2 text-sm font-medium hover:underline opacity-80 hover:opacity-100"
            >
              {link.text} →
            </a>
          )}
        </div>
      </div>
    </div>
  )
}
