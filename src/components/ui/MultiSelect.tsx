/**
 * MultiSelect Component
 * Dropdown multi-select using Headless UI Listbox
 * Features: Search, chips display, accessible
 */

import { useState, Fragment } from 'react'
import { Listbox, Transition } from '@headlessui/react'
import { ChevronUpDownIcon, CheckIcon, XMarkIcon } from '@heroicons/react/24/solid'

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

  const handleSelectAll = () => {
    onChange(options.slice(0, max))
  }

  const handleClear = () => {
    onChange([])
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {label && (
        <label className="text-sm text-gray-400 font-medium">
          {label}
        </label>
      )}
      
      <Listbox value={value} onChange={onChange} multiple>
        <div className="relative">
          <Listbox.Button className="relative w-full cursor-pointer rounded-lg bg-gray-800 border border-gray-600 py-2 pl-3 pr-10 text-left shadow-md focus:outline-none focus-visible:border-blue-500 focus-visible:ring-2 focus-visible:ring-white/75 focus-visible:ring-offset-2 focus-visible:ring-offset-orange-300 sm:text-sm">
            {value.length === 0 ? (
              <span className="text-gray-400">{placeholder}</span>
            ) : (
              <div className="flex flex-wrap gap-1">
                {value.slice(0, 3).map(v => (
                  <span key={v} className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-blue-600 text-white text-xs">
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
                  <span className="text-gray-400 text-xs">+{value.length - 3} more</span>
                )}
              </div>
            )}
            <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
              <ChevronUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
            </span>
          </Listbox.Button>
          
          <Transition
            as={Fragment}
            leave="transition ease-in duration-100"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <Listbox.Options className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-lg bg-gray-800 border border-gray-600 py-1 shadow-lg ring-1 ring-black/5 focus:outline-none sm:text-sm">
              {/* Search Input */}
              <div className="px-3 py-2 border-b border-gray-700">
                <input
                  type="text"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search..."
                  className="w-full bg-gray-700 border border-gray-600 rounded px-2 py-1 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-blue-500"
                  onClick={(e) => e.stopPropagation()}
                />
              </div>
              
              {/* Select All / Clear */}
              <div className="flex gap-3 px-3 py-1 border-b border-gray-700 text-xs">
                <button
                  type="button"
                  onClick={handleSelectAll}
                  className="text-blue-400 hover:text-blue-300"
                >
                  Select All
                </button>
                <span className="text-gray-600">|</span>
                <button
                  type="button"
                  onClick={handleClear}
                  className="text-gray-400 hover:text-gray-300"
                >
                  Clear
                </button>
              </div>
              
              {/* Options */}
              {filteredOptions.length === 0 ? (
                <div className="px-3 py-2 text-gray-400 text-sm">No options found</div>
              ) : (
                filteredOptions.map((option) => (
                  <Listbox.Option
                    key={option}
                    value={option}
                    disabled={!value.includes(option) && value.length >= max}
                    className={({ active, disabled }) =>
                      `relative cursor-pointer select-none py-2 pl-10 pr-4 ${
                        active ? 'bg-blue-600/20 text-white' : 'text-gray-300'
                      } ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`
                    }
                  >
                    {({ selected }) => (
                      <>
                        <span className={`block truncate ${selected ? 'font-medium' : 'font-normal'}`}>
                          {option}
                        </span>
                        {selected && (
                          <span className="absolute inset-y-0 left-0 flex items-center pl-3 text-blue-400">
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
        <div className="text-xs text-gray-500">
          Selected: {value.length} / {max}
        </div>
      )}
    </div>
  )
}
