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
    <div className="ai-accent-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <span className="material-symbols-outlined ai-watermark">auto_awesome</span>
      <div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 20 }}>auto_awesome</span>
          <span className="section-label" style={{ color: 'var(--color-ai-accent)' }}>{title}</span>
        </div>
        <p className={styles.summary}>{summary}</p>
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
