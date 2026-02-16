/**
 * MultiSelect Component
 * Dropdown multi-select using Headless UI Listbox
 * Features: Search, chips display, accessible
 * Theme-aware using CSS variables
 */

import { useState, Fragment, useEffect } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { useTheme } from '@/hooks/useTheme'

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
  className = ''
}: MultiSelectProps) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [search, setSearch] = useState('')
  
  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) {
    // Return a neutral loading state before theme is determined
    return (
      <div className={`flex flex-col gap-2 ${className}`}>
        {label && (
          <label className="text-sm text-gray-500 font-medium">
            {label}
          </label>
        )}
        <div className="relative w-full cursor-pointer rounded-lg bg-gray-100 border border-gray-300 py-2 pl-3 pr-10 text-left shadow-md sm:text-sm">
          <span className="text-gray-400">Loading...</span>
        </div>
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

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

  const handleSelectAll = () => {
    onChange(options.slice(0, max))
  }

  const handleClear = () => {
    onChange([])
  }

  // Theme-aware classes
  const labelClasses = isDark 
    ? 'text-sm text-gray-400 font-medium' 
    : 'text-sm text-gray-600 font-medium'
  
  const buttonClasses = isDark 
    ? 'relative w-full cursor-pointer rounded-lg bg-gray-800 border border-gray-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'
    : 'relative w-full cursor-pointer rounded-lg bg-white border border-gray-300 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-black/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm'
  
  const placeholderClasses = isDark ? 'text-gray-400' : 'text-gray-500'
  const chipBgClasses = isDark ? 'bg-blue-600' : 'bg-blue-500'
  const chipTextClasses = 'text-white'
  const moreTextClasses = isDark ? 'text-gray-400' : 'text-gray-500'
  const iconClasses = isDark ? 'text-gray-400' : 'text-gray-500'
  
  const optionsClasses = isDark 
    ? 'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 border border-gray-600 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'
    : 'absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-white border border-gray-300 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm'
  
  const searchInputClasses = isDark 
    ? 'w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500'
    : 'w-full bg-gray-50 border border-gray-300 rounded px-2 py-1 text-sm text-gray-900 placeholder-gray-500 focus:outline-none focus:border-blue-500'
  
  const optionDividerClasses = isDark ? 'border-gray-700' : 'border-gray-200'
  const selectAllClasses = isDark ? 'text-blue-400 hover:text-blue-300' : 'text-blue-600 hover:text-blue-700'
  const clearClasses = isDark ? 'text-gray-400 hover:text-gray-300' : 'text-gray-500 hover:text-gray-600'
  const dividerClasses = isDark ? 'text-gray-600' : 'text-gray-400'
  const noOptionsClasses = isDark ? 'text-gray-400' : 'text-gray-500'
  const optionTextClasses = isDark ? 'text-gray-300' : 'text-gray-700'
  const checkIconClasses = isDark ? 'text-blue-400' : 'text-blue-600'
  const selectedCountClasses = isDark ? 'text-gray-500' : 'text-gray-400'

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className={labelClasses}>
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button className={buttonClasses}>
            {value.length === 0 ? (
              <span className={placeholderClasses}>{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {value.slice(0, 3).map(v => (
                  <span key={v} className={`inline-flex items-center gap-1 px-2 py-0.5 rounded ${chipBgClasses} ${chipTextClasses} text-xs`}>
                    {v}
                    <XMarkIcon 
                      className="w-3 h-3 cursor-pointer" 
                      onClick={(e) => {
                        e.stopPropagation()
                        handleToggle(v)
                      }}
                    />
                  </span>
                ))}
                {value.length > 3 && (
                  <span className={`${moreTextClasses} text-xs`}>+{value.length - 3} more</span>
                )}
              </div>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className={`h-5 w-5 ${iconClasses}`} aria-hidden="true" />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className={optionsClasses}>
              {/* Search Input */}
              <div className={`px-3 py-2 border-b ${optionDividerClasses}`}>
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className={searchInputClasses}
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Select All / Clear */}
              <div className={`flex gap-3 px-3 py-1 border-b ${optionDividerClasses} text-xs`}>
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className={selectAllClasses}
                >
                  Select All
                </button>
                <span className={dividerClasses}>|</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className={clearClasses}
                >
                  Clear
                </button>
              </div>
              
              {/* Options */}
              {filteredOptions.length === 0 ? (
                <div className={`px-3 py-2 ${noOptionsClasses} text-sm`}>No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    disabled={!value.includes(option) && value.length >= max}
                    className={({ active, disabled }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active 
                          ? (isDark ? 'bg-blue-600/20 text-white' : 'bg-blue-50 text-gray-900') 
                          : optionTextClasses
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option}
                        </span>
                        {selected && (
                          <span className={`absolute inset-y-0 left-0 flex items-center pl-3 ${checkIconClasses}`}>
                            <CheckIcon className="h-5 w-5" aria-hidden="true" />
                          </span>
                        )}
                      </>
                    )}
                  </Listbox.Option>
                ))
              )}
            </Listbox.Options>
          </Transition>
        </div>
      </Listbox>
      
      {value.length > 0 && (
        <div className={`text-xs ${selectedCountClasses}`}>
          Selected: {value.length} / {max}
        </div>
      )}
    </div>
  )
}
