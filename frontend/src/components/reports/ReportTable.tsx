import { ReactNode } from 'react'
import styles from './ReportTable.module.css'

interface Column<T> {
  key: string
  label: string
  render: (row: T) => ReactNode
}

interface ReportTableProps<T> {
  columns: Column<T>[]
  data: T[]
  title?: string
}

export default function ReportTable<T>({ columns, data, title }: ReportTableProps<T>) {
  return (
    <div className={`glass-card ${styles.container}`}>
      {title && (
        <div className={styles.header}>
          <span className={styles.title}>{title}</span>
        </div>
      )}
      <div className="table-wrapper">
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => {
            const key = columns[0]?.key ? String((row as any)[columns[0].key] ?? i) : `row-${i}`
            return (
              <tr key={key}>
                {columns.map(col => (
                  <td key={col.key}>{col.render(row)}</td>
                ))}
              </tr>
            )
          })}
        </tbody>
      </table>
      </div>
      {data.length === 0 && (
        <p className={styles.empty}>No data available</p>
      )}
    </div>
  )
}
