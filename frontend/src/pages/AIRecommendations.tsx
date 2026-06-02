import { useEffect, useState } from 'react'
import { useUser } from '../context/UserContext'
import { analyzeHealth, getRecommendations } from '../services/healthApi'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { Recommendation, HealthAnalysis } from '../types'

interface AIRecState {
  analysis: HealthAnalysis | null
  rec: Recommendation | null
  loading: boolean
  error: string | null
}

export default function AIRecommendations() {
  const { city, userId } = useUser()
  const [state, setState] = useState<AIRecState>({ analysis: null, rec: null, loading: true, error: null })
  const [menu, setMenu] = useState<{ name: string; reason: string; benefit: string }[]>([])
  const [mood, setMood] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setState(s => ({ ...s, loading: true, error: null }))

    ;(async () => {
      try {
        const analysis: HealthAnalysis = await analyzeHealth(userId, city.split(',')[0].trim(), controller.signal)
        if (cancelled) return
        const rec: Recommendation = await getRecommendations(analysis.id, controller.signal)
        if (cancelled) return
        let parsedMenu: { name: string; reason: string; benefit: string }[] = []
        try { if (rec.menu) parsedMenu = JSON.parse(rec.menu) } catch {}
        setMenu(parsedMenu)
        setMood(rec.mood || '')
        setState({ analysis, rec, loading: false, error: null })
      } catch (e) {
        if (cancelled) return
        if (e instanceof Error && e.name === 'AbortError') return
        setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Failed to load' }))
      }
    })()

    return () => { cancelled = true; controller.abort() }
  }, [city, userId])

  if (state.loading && !state.analysis) return <LoadingSpinner text="Generating AI recommendations..." />
  if (state.error) return <ErrorBanner message={state.error} onRetry={() => window.location.reload()} />

  const a = state.analysis
  const r = state.rec
  if (!a || !r) return null

  return (
    <div className="section-gap page-enter">
      <div className="grid-rec-top">
        <div className="ai-accent-card">
          <span className="material-symbols-outlined ai-watermark">water_drop</span>
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 16 }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-secondary)', fontSize: 22 }}>local_drink</span>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Hydration</span>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface)' }}>
              {r.hydration}
            </p>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-ai-accent)', fontSize: 18 }}>auto_awesome</span>
            <span className="section-label" style={{ color: 'var(--color-ai-accent)' }}>AI Insight</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.75, color: 'var(--color-on-surface)' }}>
            {a.ai_summary}
          </p>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <span className={`chip ${a.health_score >= 70 ? 'chip-good' : a.health_score >= 40 ? 'chip-neutral' : 'chip-warning'}`}>
              Health {a.health_score}/100
            </span>
            <span className="chip chip-neutral">Updated just now</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 18 }}>psychology</span>
            <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Mood Forecast</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface)' }}>
            {mood || '—'}
          </p>
        </div>
      </div>

      <div className="grid-rec-bottom">
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>directions_run</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Activity</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>Recommended</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface)' }}>
            {r.activity}
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>checkroom</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Clothing</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>What to wear</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface)' }}>
            {r.clothing}
          </p>
        </div>
      </div>

      {menu.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>restaurant</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-secondary)' }}>Menu Suggestions</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 700, color: 'var(--color-primary)', marginTop: 2 }}>Weather-aware picks</p>
            </div>
          </div>
          <div className="rec-activities-grid">
            {menu.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 'var(--radius-lg)', background: 'var(--color-glass-fill)', border: '1px solid var(--color-glass-border)' }}>
                <div style={{ width: 38, height: 38, borderRadius: 'var(--radius-md)', background: 'var(--color-surface-container-high)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-secondary)', fontSize: 20 }}>restaurant_menu</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 700, color: 'var(--color-primary)' }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-on-surface-variant)', marginTop: 4, lineHeight: 1.5 }}>{m.reason}</p>
                  {m.benefit && <p style={{ fontSize: 11, color: 'var(--color-secondary)', marginTop: 4, fontStyle: 'italic' }}>{m.benefit}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
