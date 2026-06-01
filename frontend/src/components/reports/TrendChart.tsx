import styles from './TrendChart.module.css'

interface TrendPoint {
  label: string
  primary: number
  secondary?: number
}

interface TrendChartProps {
  data: TrendPoint[]
  primaryColor?: string
  secondaryColor?: string
  primaryLabel?: string
  secondaryLabel?: string
}

export default function TrendChart({
  data,
  primaryColor = 'var(--color-secondary)',
  secondaryColor = 'rgba(198,198,199,0.6)',
  primaryLabel,
  secondaryLabel,
}: TrendChartProps) {
  const maxVal = Math.max(...data.flatMap(d => [d.primary, d.secondary ?? 0]), 100)

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>7-Day Trend</span>
        <div style={{ display: 'flex', gap: 16 }}>
          {primaryLabel && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: primaryColor, display: 'inline-block' }} />
              {primaryLabel}
            </span>
          )}
          {secondaryLabel && (
            <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: secondaryColor, display: 'inline-block' }} />
              {secondaryLabel}
            </span>
          )}
        </div>
      </div>
      <div className={styles.chart}>
        {data.map(d => {
          const primaryH = (d.primary / maxVal) * 100
          const secondaryH = d.secondary ? (d.secondary / maxVal) * 100 : 0
          return (
            <div key={d.label} className={styles.barCol}>
              <div className={styles.bars}>
                {d.secondary !== undefined && (
                  <div className={styles.bar} style={{ height: `${secondaryH}%`, background: secondaryColor }} />
                )}
                <div className={styles.bar} style={{ height: `${primaryH}%`, background: primaryColor }} />
              </div>
              <span className={styles.label}>{d.label}</span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
