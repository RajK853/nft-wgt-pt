import * as React from "react"
import { cn } from "@/lib/utils"
import { X, RefreshCw, Search, Users } from "lucide-react"

interface EmptyStateProps {
  title: string
  description: string
  icon?: React.ComponentType<any>
  action?: {
    label: string
    onClick: () => void
    variant?: 'primary' | 'secondary' | 'ghost'
  }
  image?: string
  className?: string
}

export function EmptyState({ 
  title, 
  description, 
  icon: Icon = X,
  action,
  image,
  className 
}: EmptyStateProps) {
  return (
    <div className={cn("flex flex-col items-center justify-center p-6", className)}>
      <div className="w-16 h-16 mb-4 flex items-center justify-center">
        {image ? (
          <img src={image} alt="" className="w-full h-full object-contain" />
        ) : (
          <Icon className="w-12 h-12 text-muted-foreground" />
        )}
      </div>
      <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
      <p className="text-muted-foreground text-center mb-6 max-w-md">{description}</p>
      {action && (
        <button
          onClick={action.onClick}
          className={cn(
            "px-4 py-2 rounded-md transition-colors",
            action.variant === 'primary' 
              ? 'bg-primary text-primary-foreground hover:bg-primary/90'
              : action.variant === 'secondary'
                ? 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
                : 'bg-muted text-muted-foreground hover:bg-muted/80'
          )}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}