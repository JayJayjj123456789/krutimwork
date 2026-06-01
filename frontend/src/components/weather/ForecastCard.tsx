import styles from './ForecastCard.module.css'

interface ForecastDay {
  label: string
  icon: string
  high: number
  low: number
  active?: boolean
}

interface ForecastCardProps {
  days: ForecastDay[]
}

export default function ForecastCard({ days }: ForecastCardProps) {
  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>7-Day Forecast</span>
      </div>
      <div className={styles.strip}>
        {days.map(day => (
          <div key={day.label} className={`${styles.day}${day.active ? ` ${styles.active}` : ''}`}>
            <span className={styles.label}>{day.label}</span>
            <span className="material-symbols-outlined icon-fill" style={{ fontSize: 28, color: 'var(--color-secondary)' }}>{day.icon}</span>
            <span className={styles.high}>{day.high}°</span>
            <span className={styles.low}>{day.low}°</span>
          </div>
        ))}
      </div>
    </div>
  )
}
