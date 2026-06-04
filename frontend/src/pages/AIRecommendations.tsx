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
  const [retryCount, setRetryCount] = useState(0)

  useEffect(() => {
    let cancelled = false
    const controller = new AbortController()
    setState(s => ({ ...s, loading: true, error: null }))
    console.log(`[AIRecommendations] loading for userId=${userId} city="${city}"`)

    ;(async () => {
      try {
        const analysis: HealthAnalysis = await analyzeHealth(userId, city.split(',')[0].trim(), controller.signal)
        if (cancelled) return
        console.log(`[AIRecommendations] analysis done: id=${analysis.id} score=${analysis.health_score}`)
        const rec: Recommendation = await getRecommendations(analysis.id, controller.signal)
        if (cancelled) return
        console.log(`[AIRecommendations] recs done: activity="${rec.activity.slice(0, 60)}..."`)
        let parsedMenu: { name: string; reason: string; benefit: string }[] = []
        try { if (rec.menu) parsedMenu = JSON.parse(rec.menu) } catch (e) { console.warn('[AIRecommendations] menu parse failed:', e) }
        setMenu(parsedMenu)
        setMood(rec.mood || '')
        setState({ analysis, rec, loading: false, error: null })
      } catch (e) {
        if (cancelled) return
        if (e instanceof Error && e.name === 'AbortError') return
        console.error(`[AIRecommendations] error:`, e)
        setState(s => ({ ...s, loading: false, error: e instanceof Error ? e.message : 'Failed to load' }))
      }
    })()

    return () => { cancelled = true; controller.abort() }
  }, [city, userId, retryCount])

  if (state.loading && !state.analysis) return <LoadingSpinner text="Generating AI recommendations..." />
  if (state.error) return <ErrorBanner message={state.error} onRetry={() => setRetryCount(c => c + 1)} />

  const a = state.analysis
  const r = state.rec
  if (!a || !r) return null

  return (
    <div className="section-gap page-enter">
      <div className="grid-rec-top">
        <div className="ai-accent-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
            <span className="material-symbols-outlined" style={{ fontSize: 18, color: 'var(--color-ink-muted)' }}>local_drink</span>
            <span className="section-label">Hydration</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--color-ink)' }}>
            {r.hydration}
          </p>
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
            <span className="chip chip-neutral">{a.created_at ? `Updated ${new Date(a.created_at).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}` : 'Updated just now'}</span>
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
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-accent)', fontSize: 18 }}>directions_run</span>
            </div>
            <div>
              <span className="section-label">Activity</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink)', marginTop: 2 }}>Recommended</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--color-ink)' }}>
            {r.activity}
          </p>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 16 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-accent)', fontSize: 18 }}>checkroom</span>
            </div>
            <div>
              <span className="section-label">Clothing</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink)', marginTop: 2 }}>What to wear</p>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--color-ink)' }}>
            {r.clothing}
          </p>
        </div>
      </div>

      {menu.length > 0 && (
        <div className="glass-card">
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
            <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined" style={{ color: 'var(--color-accent)', fontSize: 18 }}>restaurant</span>
            </div>
            <div>
              <span className="section-label">Menu suggestions</span>
              <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink)', marginTop: 2 }}>Weather-aware picks</p>
            </div>
          </div>
          <div className="rec-activities-grid">
            {menu.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start', padding: '12px 14px', borderRadius: 'var(--radius-md)', background: 'var(--color-surface-2)', border: '1px solid var(--color-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--radius-sm)', background: 'var(--color-surface-3)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                  <span className="material-symbols-outlined" style={{ color: 'var(--color-ink-muted)', fontSize: 18 }}>restaurant_menu</span>
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <p style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 500, color: 'var(--color-ink)' }}>{m.name}</p>
                  <p style={{ fontSize: 12, color: 'var(--color-ink-muted)', marginTop: 4, lineHeight: 1.5 }}>{m.reason}</p>
                  {m.benefit && <p style={{ fontSize: 11, color: 'var(--color-ink-faint)', marginTop: 4, fontStyle: 'italic' }}>{m.benefit}</p>}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
