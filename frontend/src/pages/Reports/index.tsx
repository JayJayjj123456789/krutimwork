import { useEffect, useState, useRef } from 'react'
import { getReports } from '../../services/reportApi'
import { ReportData } from '../../types'
import { useUser } from '../../context/UserContext'
import WeeklyReport from '../../components/reports/WeeklyReport'
import TrendChart from '../../components/reports/TrendChart'
import ReportTable from '../../components/reports/ReportTable'

export default function Reports() {
  const { userId } = useUser()
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    getReports(userId, controller.signal)
      .then((r) => {
        if (mountedRef.current && !controller.signal.aborted) setReport(r)
      })
      .catch((e) => {
        if (mountedRef.current && !controller.signal.aborted) {
          if (e instanceof Error && e.name === 'AbortError') return
          console.error('Failed to load reports:', e)
          setError(e instanceof Error ? e.message : 'Could not load reports')
        }
      })
      .finally(() => {
        if (mountedRef.current && !controller.signal.aborted) setLoading(false)
      })
  }, [userId])

  if (loading) {
    return (
      <div className="section-gap page-enter">
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 200 }}>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>Loading reports...</span>
        </div>
      </div>
    )
  }

  if (error && !report) {
    return (
      <div className="section-gap page-enter">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: 200, gap: 12 }}>
          <span style={{ color: 'var(--color-error)' }}>{error}</span>
        </div>
      </div>
    )
  }

  const analyses = report?.data ?? []
  const trendData = analyses.slice(0, 7).reverse().map((a) => {
    const d = new Date(a.created_at)
    return {
      label: d.toLocaleDateString('en-US', { weekday: 'short' }),
      primary: a.health_score,
      secondary: a.respiratory_risk === 'very_high' ? 200 : a.respiratory_risk === 'high' ? 150 : a.respiratory_risk === 'moderate' ? 100 : 50,
    }
  })

  const tableColumns = [
    { key: 'label', label: 'Day', render: (r: { label: string; primary: number }) => r.label },
    { key: 'health', label: 'Health Score', render: (r: { primary: number }) => r.primary },
    { key: 'respiratory', label: 'Resp. Risk', render: (r: { secondary: number }) => r.secondary > 150 ? 'Very High' : r.secondary > 100 ? 'High' : r.secondary > 50 ? 'Moderate' : 'Low' },
  ]

  return (
    <div className="section-gap page-enter">
      {report ? (
        <WeeklyReport report={report} />
      ) : (
        <div className="glass-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: 120 }}>
          <span style={{ color: 'var(--color-on-surface-variant)' }}>No reports available yet</span>
        </div>
      )}

      {trendData.length > 0 && (
        <TrendChart
          data={trendData}
          primaryColor="var(--color-secondary)"
          secondaryColor="rgba(198,198,199,0.6)"
          primaryLabel="Health Score"
          secondaryLabel="Resp. Risk"
        />
      )}

      {trendData.length > 0 && (
        <ReportTable
          columns={tableColumns}
          data={trendData}
          title="Daily Summary"
        />
      )}
    </div>
  )
}
