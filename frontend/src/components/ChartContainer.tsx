import { ReactNode } from 'react'
import styles from './ChartContainer.module.css'

interface ChartContainerProps {
  title: string
  children: ReactNode
}

export default function ChartContainer({ title, children }: ChartContainerProps) {
  return (
    <div className={styles.container}>
      <h4 className={styles.title}>{title}</h4>
      <div className={styles.chartArea}>{children}</div>
    </div>
  )
}
