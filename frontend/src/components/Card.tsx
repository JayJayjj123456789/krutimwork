import { ReactNode } from 'react'
import styles from './Card.module.css'

interface CardProps {
  title: string
  children: ReactNode
  icon?: string
}

export default function Card({ title, children, icon }: CardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header}>
        {icon && <span className={styles.icon}>{icon}</span>}
        <h3>{title}</h3>
      </div>
      <div className={styles.content}>{children}</div>
    </div>
  )
}
