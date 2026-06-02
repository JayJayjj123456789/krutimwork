import { ReportData } from '../../types'
import { formatWeekRange } from '../../utils/date'
import { riskSeverity, riskColor } from '../../utils/risk'
import styles from './WeeklyReport.module.css'

interface WeeklyReportProps {
  report: ReportData
}

export default function WeeklyReport({ report }: WeeklyReportProps) {
  const scoreColor = riskColor(riskSeverity(report.avg_health_score))

  return (
    <div className="glass-card">
      <div className={styles.header}>
        <div className={styles.titleRow}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>calendar_month</span>
          <div>
            <span className={styles.title}>Weekly Report</span>
            <span className={styles.range}>{formatWeekRange(report.week_start, report.week_end)}</span>
          </div>
        </div>
        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statValue} style={{ color: scoreColor }}>{report.avg_health_score}</span>
            <span className={styles.statLabel}>Health</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statValue}>{report.analyses_count}</span>
            <span className={styles.statLabel}>Analyses</span>
          </div>
        </div>
      </div>
      <div className="ai-accent-card" style={{ marginTop: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 18 }}>auto_awesome</span>
          <span className="section-label" style={{ color: 'var(--color-ai-accent)' }}>AI Summary</span>
        </div>
        <p className={styles.summary}>{report.ai_summary || 'No summary available for this week.'}</p>
      </div>
    </div>
  )
}
