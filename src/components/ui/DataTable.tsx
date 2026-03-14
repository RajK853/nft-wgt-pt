/**
 * DataTable Component
 * Sortable data table with CSS-module styling
 * KISS: Basic table with sort functionality
 * Theme-aware using CSS variables via DataTable.module.css
 */

import styles from './DataTable.module.css'
import { EmptyState } from './EmptyState'
import { RefreshCw, Search } from 'lucide-react'

interface Column<T> {
  key: keyof T | string
  header: string
  render?: (value: unknown, row: T) => React.ReactNode
  sortable?: boolean
}

interface DataTableProps<T> {
  data: T[]
  columns: readonly Column<T>[]
  sortKey?: string
  sortDirection?: 'asc' | 'desc'
  onSort?: (key: string) => void
  rowKey?: (row: T) => string | number
  isLoading?: boolean
  error?: string
  onRefresh?: () => void
}

export function DataTable<T extends object>({
  data,
  columns,
  sortKey,
  sortDirection = 'asc',
  onSort,
  rowKey,
  isLoading = false,
  error,
  onRefresh,
}: DataTableProps<T>) {
  const getValue = (row: T, key: string): unknown => {
    const record = row as Record<string, unknown>
    if (key.includes('.')) {
      const parts = key.split('.')
      return parts.reduce((obj: unknown, part) => (obj as Record<string, unknown>)?.[part], record)
    }
    return record[key]
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.skeleton} />
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Data Error"
          description={error}
          icon={RefreshCw}
          action={{
            label: "Retry",
            onClick: onRefresh || (() => {}),
            variant: "primary"
          }}
        />
      </div>
    )
  }

  if (data.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No Data Available"
          description="No records match your current filters. Try adjusting your search criteria."
          icon={Search}
          action={{
            label: "Clear Filters",
            onClick: () => console.log('Clear filters'),
            variant: "secondary"
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead className={styles.thead}>
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`${styles.th} ${column.sortable ? styles.thSortable : ''}`}
                onClick={() => column.sortable && onSort?.(String(column.key))}
              >
                <div className={styles.thInner}>
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className={styles.sortIcon}>
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={styles.tbody}>
          {data.map((row, rowIndex) => (
            <tr key={rowKey ? rowKey(row) : rowIndex} className={styles.tr}>
              {columns.map((column) => {
                const value = getValue(row, String(column.key))
                return (
                  <td key={String(column.key)} className={styles.td}>
                    {column.render ? column.render(value, row) : String(value ?? '')}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}
