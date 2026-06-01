import { useEffect } from 'react'
import { useHealth } from '../hooks/useHealth'
import { useUser } from '../context/UserContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

const impacts = [
  { icon: 'psychiatry',    label: 'Migraine',    level: 'High Risk',   levelColor: 'var(--color-error)',             bg: 'rgba(255,180,171,0.1)'  },
  { icon: 'air',           label: 'Respiratory', level: 'Moderate',    levelColor: 'var(--color-secondary)',         bg: 'rgba(137,208,237,0.1)'  },
  { icon: 'battery_1_bar', label: 'Fatigue',     level: 'Low Risk',    levelColor: 'var(--color-on-surface-variant)',bg: 'rgba(196,199,200,0.08)' },
  { icon: 'favorite',      label: 'Cardiovascular',level: 'Moderate',  levelColor: 'var(--color-secondary)',         bg: 'rgba(137,208,237,0.1)'  },
]

export default function Health() {
  const { userId, city } = useUser()
  const { data: healthData, loading, error, analyze } = useHealth()

  useEffect(() => {
    analyze(userId, city)
  }, [analyze, userId, city])

  if (loading && !healthData) {
    return <LoadingSpinner text="Analyzing health risks..." />
  }

  return (
    <div className="section-gap page-enter">
      {error && (
        <ErrorBanner message={error} onRetry={() => analyze(userId, city)} />
      )}

      <div style={{ display: 'grid', gridTemplateColumns: '260px 1fr 1fr', gap: 20 }}>
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 12 }}>
          <span className="section-label">Health Risk Score</span>
          <div style={{ position: 'relative', width: 180, height: 180, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', transform: 'rotate(-90deg)' }} viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-surface-container-high)" strokeWidth="5" />
              <circle cx="50" cy="50" r="40" fill="none" stroke="var(--color-secondary)" strokeWidth="7" strokeLinecap="round" className="gauge-progress" />
            </svg>
            <div style={{ zIndex: 1, textAlign: 'center' }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 52, fontWeight: 300, letterSpacing: '-0.04em', color: 'var(--color-primary)', lineHeight: 1 }}>{healthData ? healthData.health_score : '72'}</span>
              <div style={{ display: 'flex', alignItems: 'center', gap: 4, justifyContent: 'center', marginTop: 4 }}>
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 14, color: 'var(--color-secondary)' }}>warning</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: 11, fontWeight: 700, color: 'var(--color-secondary)' }}>MODERATE</span>
              </div>
            </div>
          </div>
          <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', textAlign: 'center' }}>Based on current atmospheric conditions</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          {impacts.map(({ icon, label, level, levelColor, bg }) => (
            <div key={label} className="glass-card" style={{ display: 'flex', gap: 12, alignItems: 'center', padding: 16 }}>
              <div style={{ width: 44, height: 44, borderRadius: 'var(--radius-md)', background: bg, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                <span className="material-symbols-outlined icon-fill" style={{ color: levelColor, fontSize: 24 }}>{icon}</span>
              </div>
              <div>
                <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{label}</p>
                <p style={{ fontSize: 12, color: levelColor, fontWeight: 600, marginTop: 2 }}>{level}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="ai-accent-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
          <span className="material-symbols-outlined ai-watermark">auto_awesome</span>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 20 }}>auto_awesome</span>
              <span className="section-label" style={{ color: 'var(--color-ai-accent)' }}>AI Personalized Insight</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface-variant)' }}>
              {healthData?.ai_summary || 'Rapidly dropping barometric pressure combined with high humidity significantly increases your migraine risk. Recommend staying hydrated and avoiding direct bright light exposure.'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16 }}>
            <span className="chip chip-warning">High Migraine Risk</span>
            <span className="chip chip-neutral">Next 4 hours</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 20 }}>
        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>24-Hour Risk Trend</span>
            <div style={{ display: 'flex', gap: 8 }}>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
                <span style={{ width: 24, height: 2, background: 'var(--color-secondary)', display: 'inline-block', borderRadius: 2 }} /> Health Risk
              </span>
            </div>
          </div>
          <div style={{ position: 'relative', height: 160 }}>
            <svg width="100%" height="100%" viewBox="0 0 600 160" preserveAspectRatio="none">
              <defs>
                <linearGradient id="riskGrad" x1="0" x2="0" y1="0" y2="1">
                  <stop offset="0%" stopColor="#89d0ed" stopOpacity="0.3" />
                  <stop offset="100%" stopColor="#89d0ed" stopOpacity="0" />
                </linearGradient>
              </defs>
              {[40,80,120].map(y => <line key={y} x1="0" y1={y} x2="600" y2={y} stroke="rgba(255,255,255,0.06)" strokeWidth="1" />)}
              <polygon fill="url(#riskGrad)" points="0,160 0,110 100,95 200,115 300,70 400,50 500,65 600,80 600,160" />
              <polyline fill="none" stroke="#89d0ed" strokeWidth="2.5" strokeLinejoin="round" points="0,110 100,95 200,115 300,70 400,50 500,65 600,80" />
              <circle cx="400" cy="50" r="5" fill="#0c0e11" stroke="#89d0ed" strokeWidth="2.5" />
              <circle cx="400" cy="50" r="2.5" fill="white" />
            </svg>
            <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-headline)', fontWeight: 700 }}>
              {['06:00','09:00','12:00','15:00','18:00','21:00','Now'].map(t => <span key={t}>{t}</span>)}
            </div>
          </div>
        </div>

        <div className="glass-card">
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)', display: 'block', marginBottom: 16 }}>Contributing Factors</span>
          {[
            { label: 'Barometric Pressure', value: 78, color: 'var(--color-error)' },
            { label: 'Humidity',            value: 65, color: 'var(--color-secondary)' },
            { label: 'Temperature',         value: 45, color: 'var(--color-secondary)' },
            { label: 'Air Quality',         value: 30, color: 'rgba(52,211,153,1)' },
          ].map(({ label, value, color }) => (
            <div key={label} style={{ marginBottom: 14 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-headline)', fontWeight: 600 }}>{label}</span>
                <span style={{ fontSize: 13, fontWeight: 700, fontFamily: 'var(--font-headline)', color }}>{value}%</span>
              </div>
              <div className="progress-track">
                <div className="progress-fill" style={{ width: `${value}%`, background: color, boxShadow: 'none' }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
