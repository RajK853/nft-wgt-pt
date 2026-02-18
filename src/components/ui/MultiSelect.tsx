/**
 * MultiSelect Component
 * Dropdown multi-select using Radix Popover + Checkbox
 * Features: Search, chips display, accessible
 * Theme-aware using CSS variables
 */

import { useState } from 'react'
import * as Popover from '@radix-ui/react-popover'
import * as Checkbox from '@radix-ui/react-checkbox'
import { ChevronsUpDown, Check, X } from 'lucide-react'

interface MultiSelectProps {
  value: string[]
  onChange: (value: string[]) => void
  options: string[]
  label?: string
  max?: number
  placeholder?: string
  className?: string
}

export function MultiSelect({
  value,
  onChange,
  options,
  label,
  max = 10,
  placeholder = 'Select options...',
  className = '',
}: MultiSelectProps) {
  const [open, setOpen] = useState(false)
  const [search, setSearch] = useState('')

  const filteredOptions = options.filter(option =>
    option.toLowerCase().includes(search.toLowerCase())
  )

  const handleToggle = (option: string) => {
    if (value.includes(option)) {
      onChange(value.filter(v => v !== option))
    } else if (value.length < max) {
      onChange([...value, option])
    }
  }

  const handleSelectAll = () => onChange(options.slice(0, max))
  const handleClear = () => onChange([])

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label style={{ fontSize: '0.875rem', color: 'var(--color-legacy-text-secondary)', fontWeight: 500 }}>
          {label}
        </label>
      )}

      <Popover.Root open={open} onOpenChange={setOpen}>
        <Popover.Trigger asChild>
          <button
            type="button"
            aria-expanded={open}
            style={{
              position: 'relative',
              width: '100%',
              cursor: 'pointer',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-legacy-bg-secondary)',
              border: '1px solid var(--color-legacy-border)',
              padding: '0.5rem 2.5rem 0.5rem 0.75rem',
              textAlign: 'left',
              fontSize: '0.875rem',
              color: 'var(--color-legacy-text-primary)',
            }}
          >
            {value.length === 0 ? (
              <span style={{ color: 'var(--color-legacy-text-muted)' }}>{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {value.slice(0, 3).map(v => (
                  <span
                    key={v}
                    className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-xs text-white"
                    style={{ backgroundColor: 'var(--color-legacy-info)' }}
                  >
                    {v}
                    <X
                      className="w-3 h-3 cursor-pointer"
                      onClick={(e) => { e.stopPropagation(); handleToggle(v) }}
                    />
                  </span>
                ))}
                {value.length > 3 && (
                  <span className="text-xs" style={{ color: 'var(--color-legacy-text-muted)' }}>
                    +{value.length - 3} more
                  </span>
                )}
              </div>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronsUpDown className="h-4 w-4" style={{ color: 'var(--color-legacy-text-muted)' }} aria-hidden="true" />
            </span>
          </button>
        </Popover.Trigger>

        <Popover.Portal>
          <Popover.Content
            align="start"
            sideOffset={4}
            style={{
              zIndex: 50,
              width: 'var(--radix-popover-trigger-width)',
              maxHeight: '15rem',
              overflowY: 'auto',
              borderRadius: '0.5rem',
              backgroundColor: 'var(--color-legacy-bg-secondary)',
              border: '1px solid var(--color-legacy-border)',
              boxShadow: '0 4px 12px rgb(0 0 0 / 0.15)',
              fontSize: '0.875rem',
            }}
          >
            {/* Search Input */}
            <div
              className="px-3 py-2"
              style={{ borderBottom: '1px solid var(--color-legacy-border)' }}
            >
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search..."
                style={{
                  width: '100%',
                  backgroundColor: 'var(--color-legacy-bg-tertiary)',
                  border: '1px solid var(--color-legacy-border)',
                  borderRadius: '0.25rem',
                  padding: '0.25rem 0.5rem',
                  fontSize: '0.875rem',
                  color: 'var(--color-legacy-text-primary)',
                  outline: 'none',
                }}
                onClick={(e) => e.stopPropagation()}
              />
            </div>

            {/* Select All / Clear */}
            <div
              className="flex gap-3 px-3 py-1 text-xs"
              style={{ borderBottom: '1px solid var(--color-legacy-border)' }}
            >
              <button
                type="button"
                onClick={handleSelectAll}
                style={{ color: 'var(--color-legacy-info)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                Select All
              </button>
              <span style={{ color: 'var(--color-legacy-text-muted)' }}>|</span>
              <button
                type="button"
                onClick={handleClear}
                style={{ color: 'var(--color-legacy-text-muted)', cursor: 'pointer', background: 'none', border: 'none', padding: 0 }}
              >
                Clear
              </button>
            </div>

            {/* Options */}
            {filteredOptions.length === 0 ? (
              <div className="px-3 py-2" style={{ color: 'var(--color-legacy-text-muted)' }}>
                No options found
              </div>
            ) : (
              filteredOptions.map((option) => {
                const isChecked = value.includes(option)
                const isDisabled = !isChecked && value.length >= max
                return (
                  <label
                    key={option}
                    className="flex items-center gap-2 px-3 py-2 cursor-pointer"
                    style={{
                      color: isDisabled ? 'var(--color-legacy-text-disabled)' : 'var(--color-legacy-text-primary)',
                      cursor: isDisabled ? 'not-allowed' : 'pointer',
                    }}
                    onMouseEnter={(e) => {
                      if (!isDisabled) (e.currentTarget as HTMLElement).style.backgroundColor = 'var(--color-legacy-surface-hover)'
                    }}
                    onMouseLeave={(e) => {
                      (e.currentTarget as HTMLElement).style.backgroundColor = 'transparent'
                    }}
                  >
                    <Checkbox.Root
                      checked={isChecked}
                      disabled={isDisabled}
                      onCheckedChange={() => handleToggle(option)}
                      style={{
                        width: '1rem',
                        height: '1rem',
                        borderRadius: '0.25rem',
                        border: '1px solid var(--color-legacy-border-medium)',
                        backgroundColor: isChecked ? 'var(--color-legacy-info)' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      <Checkbox.Indicator>
                        <Check className="w-3 h-3 text-white" />
                      </Checkbox.Indicator>
                    </Checkbox.Root>
                    <span className={`truncate text-sm ${isChecked ? 'font-medium' : ''}`}>{option}</span>
                  </label>
                )
              })
            )}
          </Popover.Content>
        </Popover.Portal>
      </Popover.Root>

      {value.length > 0 && (
        <div className="text-xs" style={{ color: 'var(--color-legacy-text-muted)' }}>
          Selected: {value.length} / {max}
        </div>
      )}
    </div>
  )
}
