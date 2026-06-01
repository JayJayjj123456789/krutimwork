import { ReactNode } from 'react'
import styles from './AIInsightCard.module.css'

interface AIInsightCardProps {
  icon?: string
  title: string
  subtitle?: string
  children: ReactNode
  chips?: { label: string; className: string }[]
}

export default function AIInsightCard({ icon = 'smart_toy', title, subtitle, children, chips }: AIInsightCardProps) {
  return (
    <div className="ai-accent-card">
      <span className="material-symbols-outlined ai-watermark">{icon}</span>
      <div style={{ position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 14 }}>
          <div className={styles.iconBox}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 20 }}>{icon}</span>
          </div>
          <div>
            <span className="section-label" style={{ color: 'var(--color-ai-accent)', display: 'block' }}>{title}</span>
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
    </div>
  )
}
