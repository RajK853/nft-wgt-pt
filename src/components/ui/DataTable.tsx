/**
 * DataTable Component
 * Sortable data table with simple styling
 * KISS: Basic table with sort functionality
 * Theme-aware using CSS variables
 */

import { useTheme } from '@/hooks/useTheme'
import { useEffect, useState } from 'react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: any, row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: Column<T>[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
}

export function DataTable<T extends Record<string, any>>({ 
  data, 
  columns, 
  sortKey, 
  sortDirection = 'asc',
  onSort 
}: DataTableProps<T>) {
  const { resolvedTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  
  useEffect(() => {
    setMounted(true)
  }, [])
  
  if (!mounted) {
    return (
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead className="bg-muted">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className="px-4 py-3 text-left text-muted-foreground font-medium"
                >
                  {column.header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td colSpan={columns.length} className="px-4 py-8 text-center text-muted-foreground">
                Loading...
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    )
  }

  const isDark = resolvedTheme === 'dark'

  const handleSort = (key: string) => {
    if (onSort) {
      onSort(key)
    }
  }

  const getValue = (row: T, key: string): any => {
    if (key.includes('.')) {
      const parts = key.split('.')
      return parts.reduce((obj: any, part) => obj?.[part], row)
    }
    return row[key]
  }

  const containerClasses = isDark 
    ? 'overflow-x-auto rounded-lg border border-gray-700' 
    : 'overflow-x-auto rounded-lg border border-gray-200'
  
  const theadClasses = isDark ? 'bg-gray-800' : 'bg-gray-50'
  const thClasses = isDark 
    ? 'px-4 py-3 text-left text-gray-400 font-medium' 
    : 'px-4 py-3 text-left text-gray-600 font-medium'
  const thHoverClasses = (column: Column<T>) => column.sortable 
    ? (isDark ? 'cursor-pointer hover:text-white' : 'cursor-pointer hover:text-gray-900') 
    : ''
  const tbodyClasses = isDark ? 'divide-y divide-gray-700' : 'divide-y divide-gray-200'
  const trHoverClasses = isDark ? 'hover:bg-gray-800/50' : 'hover:bg-gray-50'
  const tdClasses = isDark ? 'px-4 py-3 text-gray-300' : 'px-4 py-3 text-gray-700'
  const emptyClasses = isDark ? 'text-gray-500' : 'text-gray-400'
  const sortIconClasses = isDark ? 'text-blue-400' : 'text-blue-600'

  return (
    <div className={containerClasses}>
      <table className="w-full text-sm">
        <thead className={theadClasses}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`${thClasses} ${thHoverClasses(column)}`}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className={sortIconClasses}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={tbodyClasses}>
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className={trHoverClasses}>
              {columns.map((column) => {
                const value = getValue(row, String(column.key))
                return (
                  <td key={String(column.key)} className={tdClasses}>
                    {column.render ? column.render(value, row) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className={`p-8 text-center ${emptyClasses}`}>
          No data available
        </div>
      )}
    </div>
  )
}
