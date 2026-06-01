import styles from './MetricDisplay.module.css'

interface MetricDisplayProps {
  label: string
  value: string | number
  unit?: string
  trend?: 'up' | 'down' | 'stable'
}

export default function MetricDisplay({ label, value, unit, trend }: MetricDisplayProps) {
  const trendIcon = trend === 'up' ? '↑' : trend === 'down' ? '↓' : '→'
  const trendColor = trend === 'up' ? '#22c55e' : trend === 'down' ? '#ef4444' : '#6b7280'

  return (
    <div className={styles.metric}>
      <span className={styles.label}>{label}</span>
      <div className={styles.valueContainer}>
        <span className={styles.value}>{value}</span>
        {unit && <span className={styles.unit}>{unit}</span>}
        {trend && <span className={styles.trend} style={{ color: trendColor }}>{trendIcon}</span>}
      </div>
    </div>
  )
}
