import { useEffect } from 'react'
import { useHealth } from '../hooks/useHealth'
import { useUser } from '../context/UserContext'
import { RiskLevel, RISK_LABELS_TH, RISK_COLORS } from '../types'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

const riskConfig: Record<string, { icon: string; field: string; label: string }> = {
  migraine:    { icon: 'psychiatry',    field: 'migraine_risk',    label: 'Migraine' },
  respiratory: { icon: 'air',           field: 'respiratory_risk', label: 'Respiratory' },
  fatigue:     { icon: 'battery_1_bar', field: 'fatigue_risk',     label: 'Fatigue' },
}

export default function Health() {
  const { userId, city } = useUser()
  const { data: healthData, loading, error, analyze } = useHealth()

  useEffect(() => {
    analyze(userId, city.split(',')[0].trim())
  }, [analyze, userId, city])

  const retry = () => analyze(userId, city.split(',')[0].trim())

  if (loading && !healthData) {
    return <LoadingSpinner text="Analyzing health risks..." />
  }

  return (
    <div className="section-gap page-enter">
      {error && (
        <ErrorBanner message={error} onRetry={retry} />
      )}

      <div className="grid-health-top">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span className="section-label">Health Risk Score</span>
          <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="5" />
              <circle
                cx="50"
                cy="50"
                r="40"
                fill="none"
                stroke="var(--color-secondary)"
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray={251}
                strokeDashoffset={healthData ? Math.max(0, 251 - (healthData.health_score / 100) * 251) : 251}
                style={{ transition: 'stroke-dashoffset 1.2s ease-out' }}
              />
            </svg>
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 52, fontWeight: 300, letterSpacing: '-0.04em', color: 'var(--color-primary)', lineHeight: 1 }}>{healthData ? healthData.health_score : '-'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14, color: 'var(--color-secondary)' }}>warning</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: 11, fontWeight: 700, color: 'var(--color-secondary)' }}>{healthData ? 'ACTIVE' : 'N/A'}</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>Based on current atmospheric conditions</p>
        </div>

        <div className="risk-cards-grid">
          {healthData ? Object.entries(riskConfig).map(([key, cfg]) => {
            const level = healthData[cfg.field as keyof typeof healthData] || 'low'
            const color = RISK_COLORS[level as RiskLevel] || 'var(--color-ink-muted)'
            return (
              <div key={key} className="glass-card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 14 }}>
                <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined icon-fill" style={{ color, fontSize: 20 }}>{cfg.icon}</span>
                </div>
                <div>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink)' }}>{cfg.label}</p>
                  <p style={{ fontSize: 12, color, marginTop: 2 }}>{RISK_LABELS_TH[level as RiskLevel] || level}</p>
                </div>
              </div>
            )
          }) : null}
        </div>

        <div className="ai-accent-card" style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          <span className="section-label">Personalized insight</span>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--color-ink)' }}>
            {healthData?.ai_summary || '-'}
          </p>
        </div>
      </div>
    </div>
  )
}
