import { riskSeverity, riskLabel, riskColor } from '../../utils/risk'
import styles from './HealthScore.module.css'

interface HealthScoreProps {
  score: number
}

export default function HealthScore({ score }: HealthScoreProps) {
  const level = riskSeverity(score)
  const color = riskColor(level)
  const label = riskLabel(level)

  return (
    <div className={`glass-card ${styles.card}`}>
      <span className="section-label">Health Risk Score</span>
      <div className={styles.gauge}>
        <svg className={styles.svg} viewBox="0 0 100 100">
          <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="5" />
          <circle
            cx="50" cy="50" r="40"
            fill="none" stroke={color}
            strokeWidth="7" strokeLinecap="round"
            strokeDasharray="251"
            strokeDashoffset={251 - (score / 100) * 251}
            style={{ transition: 'stroke-dashoffset 1.8s ease-out' }}
          />
        </svg>
        <div className={styles.center}>
          <span className={styles.scoreValue}>{score}</span>
          <div className={styles.badge} style={{ color }}>
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14 }}>warning</span>
            <span>{label.toUpperCase()}</span>
          </div>
        </div>
      </div>
      <p className={styles.sub}>Based on current atmospheric conditions</p>
    </div>
  )
}
