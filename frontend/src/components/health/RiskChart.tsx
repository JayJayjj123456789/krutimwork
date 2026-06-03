import styles from './RiskChart.module.css'

interface DataPoint {
  label: string
  value: number
}

interface RiskChartProps {
  data: DataPoint[]
  color?: string
  highlightIndex?: number
}

export default function RiskChart({ data, color = 'var(--color-secondary)', highlightIndex }: RiskChartProps) {
  if (data.length === 0) return null
  const maxVal = Math.max(...data.map(d => d.value), 100)
  const denominator = Math.max(data.length - 1, 1)
  const points = data.map((d, i) => ({
    x: (i / denominator) * 100,
    y: 100 - (d.value / maxVal) * 100,
  }))
  const polyline = points.map(p => `${p.x},${p.y}`).join(' ')
  const polyArea = `0,100 ${polyline} 100,100`

  return (
    <div className="glass-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>24-Hour Risk Trend</span>
      </div>
      <div className={styles.chart}>
        <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none">
          <defs>
            <linearGradient id="riskChartGrad" x1="0" x2="0" y1="0" y2="1">
              <stop offset="0%" stopColor={color} stopOpacity="0.3" />
              <stop offset="100%" stopColor={color} stopOpacity="0" />
            </linearGradient>
          </defs>
          {[40, 80, 120].map(y => (
            <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />
          ))}
          <polygon fill="url(#riskChartGrad)" points={polyArea} />
          <polyline fill="none" stroke={color} strokeWidth="2.5" strokeLinejoin="round" points={polyline} />
          {points.map((p, i) => (
            <circle
              key={`pt-${data[i]?.label ?? i}`}
              cx={(p.x / 100) * 600}
              cy={(p.y / 100) * 160}
              r={i === highlightIndex ? 5 : 3}
              fill={i === highlightIndex ? 'var(--color-background)' : color}
              stroke={color}
              strokeWidth="2.5"
            />
          ))}
          {highlightIndex !== undefined && (
            <circle cx={(points[highlightIndex].x / 100) * 600} cy={(points[highlightIndex].y / 100) * 160} r="2.5" fill="white" />
          )}
        </svg>
        <div className={styles.labels}>
          {data.map(d => (
            <span key={d.label} className={styles.label}>{d.label}</span>
          ))}
        </div>
      </div>
    </div>
  )
}
