import { ReactNode } from 'react'
import styles from './AIInsightCard.module.css'

interface AIInsightCardProps {
  icon?: string
  title: string
  subtitle?: string
  children: ReactNode
  chips?: { label: string; className: string }[]
}

export default function AIInsightCard({ icon, title, subtitle, children, chips }: AIInsightCardProps) {
  return (
    <div className="ai-accent-card">
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
        {icon && (
          <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-ink-muted)' }}>{icon}</span>
        )}
        <div>
          <span className="section-label" style={{ display: 'block' }}>{title}</span>
          {subtitle && <span className={styles.subtitle}>{subtitle}</span>}
        </div>
      </div>
      <div className={styles.content}>{children}</div>
      {chips && chips.length > 0 && (
        <div className={styles.chips}>
          {chips.map(c => (
            <span key={c.label} className={`chip ${c.className}`}>{c.label}</span>
          ))}
        </div>
      )}
    </div>
  )
}
