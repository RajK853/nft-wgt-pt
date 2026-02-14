/**
 * DataTable Component
 * Sortable data table with simple styling
 * KISS: Basic table with sort functionality
 */

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

  return (
    <div className="overflow-x-auto rounded-lg border border-gray-700">
      <table className="w-full text-sm">
        <thead className="bg-gray-800">
          <tr>
            {columns.map((column) => (
              <th
                key={String(column.key)}
                className={`px-4 py-3 text-left text-gray-400 font-medium
                  ${column.sortable ? 'cursor-pointer hover:text-white' : ''}`}
                onClick={() => column.sortable && handleSort(String(column.key))}
              >
                <div className="flex items-center gap-2">
                  {column.header}
                  {column.sortable && sortKey === column.key && (
                    <span className="text-blue-400">
                      {sortDirection === 'asc' ? '↑' : '↓'}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-700">
          {data.map((row, rowIndex) => (
            <tr key={rowIndex} className="hover:bg-gray-800/50">
              {columns.map((column) => {
                const value = getValue(row, String(column.key))
                return (
                  <td key={String(column.key)} className="px-4 py-3 text-gray-300">
                    {column.render ? column.render(value, row) : value}
                  </td>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
      
      {data.length === 0 && (
        <div className="p-8 text-center text-gray-500">
          No data available
        </div>
      )}
    </div>
  )
}
