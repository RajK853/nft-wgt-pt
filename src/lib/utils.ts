import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Truncates a name to `max` characters, appending "…" if it exceeds the limit.
 * Used for chart axis labels where space is limited.
 */
export function truncateName(name: string, max: number): string {
  return name.length > max ? name.substring(0, max) + '…' : name
}
