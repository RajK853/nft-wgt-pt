import { useId } from 'react'

export function useAria(label: string, description?: string) {
  const id = useId()
  return {
    'aria-label': label,
    'aria-describedby': description ? `${id}-description` : undefined,
    descriptionId: description ? `${id}-description` : undefined,
    description
  }
}