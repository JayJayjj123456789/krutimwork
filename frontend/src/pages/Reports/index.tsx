import { useEffect, useState } from 'react'
import { getReports } from '../../services/reportApi'
import { ReportData } from '../../types'
import WeeklyReport from '../../components/reports/WeeklyReport'
import TrendChart from '../../components/reports/TrendChart'
import ReportTable from '../../components/reports/ReportTable'

const trendData = [
  { label: 'Mon', primary: 72, secondary: 95 },
  { label: 'Tue', primary: 68, secondary: 88 },
  { label: 'Wed', primary: 55, secondary: 102 },
  { label: 'Thu', primary: 60, secondary: 110 },
  { label: 'Fri', primary: 75, secondary: 75 },
  { label: 'Sat', primary: 82, secondary: 65 },
  { label: 'Sun', primary: 70, secondary: 90 },
]

export default function Reports() {
  const [report, setReport] = useState<ReportData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    getReports(1)
      .then((res) => {
        const r = Array.isArray(res) ? res[0] : res
        setReport(r || null)
      })
      .catch(() => setError('Could not load reports'))
      .finally(() => setLoading(false))
  }, [])

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

  const tableColumns = [
    { key: 'day', label: 'Day', render: (r: typeof trendData[0]) => r.label },
    { key: 'health', label: 'Health Score', render: (r: typeof trendData[0]) => r.primary },
    { key: 'aqi', label: 'AQI', render: (r: typeof trendData[0]) => r.secondary },
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

      <TrendChart
        data={trendData}
        primaryColor="var(--color-secondary)"
        secondaryColor="rgba(198,198,199,0.6)"
        primaryLabel="Health Score"
        secondaryLabel="AQI"
      />

      <ReportTable
        columns={tableColumns}
        data={trendData}
        title="Daily Summary"
      />
    </div>
  )
}
