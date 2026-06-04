import styles from './HealthInsight.module.css'

interface HealthInsightProps {
  title: string
  summary: string
  riskLabel?: string
  riskClass?: string
  timestamp?: string
}

export default function HealthInsight({ title, summary, riskLabel: riskTag, riskClass, timestamp }: HealthInsightProps) {
  return (
    <div className="ai-accent-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
      <div>
        <span className="section-label" style={{ display: 'block' }}>{title}</span>
        <p className={styles.summary} style={{ marginTop: 8 }}>{summary}</p>
      </div>
      {(riskTag || timestamp) && (
        <div className={styles.footer}>
          {riskTag && <span className={`chip ${riskClass || 'chip-neutral'}`}>{riskTag}</span>}
          {timestamp && <span className="chip chip-neutral">{timestamp}</span>}
        </div>
      )}
    </div>
  )
}
