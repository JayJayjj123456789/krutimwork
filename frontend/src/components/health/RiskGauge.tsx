import { riskSeverity, riskColor, riskLabel } from '../../utils/risk'
import styles from './RiskGauge.module.css'

interface RiskGaugeProps {
  value: number
  label: string
}

export default function RiskGauge({ value, label }: RiskGaugeProps) {
  const level = riskSeverity(value)
  const color = riskColor(level)
  const text = riskLabel(level)

  return (
    <div className={styles.gauge}>
      <svg width="100%" height="100%" viewBox="0 0 120 70">
        <defs>
          <linearGradient id={`riskGrad-${label.replace(/\s+/g, '')}`} x1="0" y1="0" x2="1" y2="0">
            <stop offset="0%" stopColor="#22c55e" />
            <stop offset="40%" stopColor="#eab308" />
            <stop offset="70%" stopColor="#f97316" />
            <stop offset="100%" stopColor="#ef4444" />
          </linearGradient>
        </defs>
        <path d="M10 60 A 50 50 0 0 1 110 60" fill="none" stroke={`url(#riskGrad-${label.replace(/\s+/g, '')})`} strokeWidth="8" strokeLinecap="round" opacity="0.3" />
        <path
          d="M10 60 A 50 50 0 0 1 110 60"
          fill="none"
          stroke={color}
          strokeWidth="8"
          strokeLinecap="round"
          strokeDasharray={`${(value / 100) * 157} 157`}
          style={{ transition: 'stroke-dashoffset 1s ease-out' }}
        />
      </svg>
      <div className={styles.center}>
        <span className={styles.value} style={{ color }}>{value}</span>
      </div>
      <span className={styles.label}>{label}</span>
      <span className={styles.level} style={{ color }}>{text}</span>
    </div>
  )
}
