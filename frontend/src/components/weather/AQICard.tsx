import { aqiText, aqiLevel } from '../../utils/weather'
import { riskColor } from '../../utils/risk'
import styles from './AQICard.module.css'

interface AQICardProps {
  aqi: number
  pm25: number
}

export default function AQICard({ aqi, pm25 }: AQICardProps) {
  const level = aqiLevel(aqi)
  const color = riskColor(level)

  return (
    <div className="glass-card stat-card">
      <div className="stat-card-header">
        <div className="stat-card-icon" style={{ background: 'rgba(137,208,237,0.12)' }}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-secondary)', fontSize: 22 }}>air</span>
        </div>
        <span className={`chip chip-${level === 'low' ? 'good' : level === 'moderate' ? 'yellow' : 'warning'}`}>
          {aqiText(aqi)}
        </span>
      </div>
      <div>
        <div className={styles.valueRow}>
          <span className="stat-card-value" style={{ color }}>{aqi}</span>
          <span className={styles.unit}>AQI</span>
        </div>
        <span className="stat-card-label">Air Quality</span>
      </div>
      <div className={styles.pm25}>
        <span>PM2.5: {pm25} µg/m³</span>
      </div>
    </div>
  )
}
