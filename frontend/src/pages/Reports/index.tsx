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
    console.log(`[Reports] fetching for userId=${userId}`)
    getReports(userId, controller.signal)
      .then((r) => {
        if (mountedRef.current && !controller.signal.aborted) {
          console.log(`[Reports] data: ${r.analyses_count} analyses, avg=${r.avg_health_score}`)
          setReport(r)
        }
      })
      .catch((e) => {
        if (mountedRef.current && !controller.signal.aborted) {
          if (e instanceof Error && e.name === 'AbortError') return
          console.error('[Reports] Failed to load reports:', e)
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

  // Generate data from API response (next 7 days forecast)
  const generateWeekData = () => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

    return analyses.map((item: any, index: number) => {
      const date = new Date(item.date)
      const dayName = days[date.getDay()]
      const isToday = index === 0

      return {
        label: isToday ? 'Today' : dayName,
        date: item.date,
        primary: item.health_score ?? 0,
        secondary: item.respiratory_risk === 'very_high' ? 200 :
                   item.respiratory_risk === 'high' ? 150 :
                   item.respiratory_risk === 'moderate' ? 100 :
                   item.respiratory_risk === 'low' ? 50 : 0,
        hasData: true,
      }
    })
  }

  const trendData = generateWeekData()

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
          title="7-Day Forecast"
        />
      )}

      {trendData.length > 0 && (
        <ReportTable
          columns={tableColumns}
          data={trendData}
          title="Daily Forecast (Next 7 Days)"
        />
      )}
    </div>
  )
}
