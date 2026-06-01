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
      <table className="data-table">
        <thead>
          <tr>
            {columns.map(col => (
              <th key={col.key}>{col.label}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {columns.map(col => (
                <td key={col.key}>{col.render(row)}</td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
      {data.length === 0 && (
        <p className={styles.empty}>No data available</p>
      )}
    </div>
  )
}
