import { Recommendation } from '../../types'
import styles from './RecommendationCard.module.css'

interface RecommendationCardProps {
  recommendation: Recommendation
  onDismiss?: (id: number) => void
}

const priorityColors = {
  high: '#ef4444',
  medium: '#f59e0b',
  low: '#22c55e',
}

export default function RecommendationCard({ recommendation: rec, onDismiss }: RecommendationCardProps) {
  return (
    <div className={styles.card}>
      <div className={styles.header} style={{ borderLeftColor: priorityColors[rec.priority] }}>
        <span className={styles.icon}>{rec.icon}</span>
        <div className={styles.titleArea}>
          <span className={styles.category}>{rec.category}</span>
          <h3 className={styles.title}>{rec.title}</h3>
        </div>
        {onDismiss && (
          <button className={styles.dismiss} onClick={() => onDismiss(rec.id)} aria-label="Dismiss">
            ×
          </button>
        )}
      </div>
      <p className={styles.description}>{rec.description}</p>
      <div className={styles.footer}>
        <span className={styles.priority} style={{ backgroundColor: priorityColors[rec.priority] }}>
          {rec.priority} priority
        </span>
      </div>
    </div>
  )
}
