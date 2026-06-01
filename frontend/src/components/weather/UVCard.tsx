import { uvText } from '../../utils/weather'
import styles from './UVCard.module.css'

interface UVCardProps {
  uv: number
}

export default function UVCard({ uv }: UVCardProps) {
  const text = uvText(uv)
  const isHigh = uv > 7

  return (
    <div className={`glass-card stat-card ${styles.card}`}>
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: isHigh ? 'rgba(255,180,171,0.12)' : 'rgba(137,208,237,0.08)' }}>
          <span className="material-symbols-outlined icon-fill" style={{ color: isHigh ? 'var(--color-error)' : 'var(--color-secondary)', fontSize: 22 }}>wb_sunny</span>
        </div>
        <span className={`chip ${isHigh ? 'chip-warning' : 'chip-neutral'}`}>{text}</span>
      </div>
      <div>
        <div className={styles.valueRow}>
          <span className="stat-card-value" style={{ color: isHigh ? 'var(--color-error)' : undefined }}>{uv}</span>
          <span className={styles.unit}>/ 11</span>
        </div>
        <span className="stat-card-label">UV Index</span>
      </div>
      {isHigh && (
        <p className={styles.advice}>Use SPF 50+, avoid midday sun</p>
      )}
    </div>
  )
}
