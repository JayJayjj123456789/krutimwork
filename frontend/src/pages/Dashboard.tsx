import { useWeather } from '../hooks/useWeather'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'

const forecast = [
  { label: 'Today',  icon: 'partly_cloudy_day', high: 32, low: 25, active: true  },
  { label: 'Wed',    icon: 'cloudy',             high: 31, low: 26               },
  { label: 'Thu',    icon: 'rainy',              high: 29, low: 24               },
  { label: 'Fri',    icon: 'thunderstorm',       high: 28, low: 24               },
  { label: 'Sat',    icon: 'clear_day',          high: 33, low: 25               },
  { label: 'Sun',    icon: 'partly_cloudy_day',  high: 30, low: 24               },
  { label: 'Mon',    icon: 'rainy',              high: 27, low: 23               },
]

const metrics = [
  { icon: 'air',             label: 'Air Quality',   value: '42',   unit: 'AQI',  chip: 'Good',     chipClass: 'chip-good',    bg: 'rgba(137,208,237,0.12)', iconColor: 'var(--color-secondary)' },
  { icon: 'wb_sunny',        label: 'UV Index',      value: '8',    unit: '/11',  chip: 'Very High', chipClass: 'chip-warning', bg: 'rgba(255,180,171,0.12)', iconColor: 'var(--color-error)'     },
  { icon: 'water_drop',      label: 'Humidity',      value: '78',   unit: '%',    chip: 'High',      chipClass: 'chip-neutral', bg: 'rgba(137,208,237,0.08)', iconColor: 'var(--color-secondary)' },
  { icon: 'thermostat',      label: 'Feels Like',    value: '32',   unit: '°C',   chip: 'Hot',       chipClass: 'chip-warning', bg: 'rgba(255,180,171,0.08)', iconColor: 'var(--color-error)'     },
]

export default function Dashboard() {
  const { data: weatherData, loading, error, refetch } = useWeather()

  if (loading && !weatherData) {
    return <LoadingSpinner text="Fetching weather data..." />
  }

  return (
    <div className="section-gap page-enter">
      {error && (
        <ErrorBanner message={error} onRetry={refetch} />
      )}

      <div className="grid-weather-main">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220, background: 'linear-gradient(135deg, rgba(137,208,237,0.08), rgba(17,19,22,0.5))' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>location_on</span>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>Bangkok</span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <span className="temp-big">{weatherData ? Math.round(weatherData.temperature) : '28'}°</span>
              <div style={{ paddingBottom: 12 }}>
                <span className="material-symbols-outlined icon-fill weather-icon-big" style={{ color: 'var(--color-secondary)' }}>partly_cloudy_day</span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
              {weatherData ? `Humidity ${weatherData.humidity}% · Wind ${Math.round(weatherData.wind_speed * 3.6)} km/h` : 'Partly Cloudy · Feels like 32°C'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            <span className="chip chip-good">Clear skies evening</span>
          </div>
        </div>

        <div className="bento-4">
          {metrics.map(({ icon, label, value, unit, chip, chipClass, bg, iconColor }) => (
            <div key={label} className="glass-card stat-card">
              <div className="stat-card-header">
                <div className="stat-card-icon" style={{ background: bg }}>
                  <span className="material-symbols-outlined icon-fill" style={{ color: iconColor, fontSize: 22 }}>{icon}</span>
                </div>
                <span className={`chip ${chipClass}`}>{chip}</span>
              </div>
              <div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 4 }}>
                  <span className="stat-card-value">{value}</span>
                  <span style={{ fontFamily: 'var(--font-headline)', fontSize: 16, color: 'var(--color-on-surface-variant)' }}>{unit}</span>
                </div>
                <span className="stat-card-label">{label}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="grid-ai-forecast">
        <div className="ai-accent-card">
          <span className="material-symbols-outlined ai-watermark">smart_toy</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14 }}>
            <div style={{ width: 36, height: 36, borderRadius: 'var(--radius-md)', background: 'rgba(137,208,237,0.12)', border: '1px solid rgba(137,208,237,0.25)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 20 }}>smart_toy</span>
            </div>
            <div>
              <span className="section-label" style={{ color: 'var(--color-ai-accent)', display: 'block' }}>AI Summary</span>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 600, color: 'var(--color-primary)' }}>Today's Outlook</span>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface-variant)' }}>
            Air quality is in the good range, suitable for outdoor activities. Temperature will rise in the afternoon. Recommend staying hydrated and wearing breathable clothing. UV index peaks at noon — apply SPF 50+ if going outdoors.
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            <span className="chip chip-good">Low Risk</span>
            <span className="chip chip-neutral">Updated 5m ago</span>
          </div>
        </div>

        <div className="glass-card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>7-Day Forecast</span>
            <button className="btn" style={{ padding: '6px 12px', fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>
              Full Calendar
            </button>
          </div>
          <div className="forecast-strip">
            {forecast.map(day => (
              <div key={day.label} className={`forecast-day${day.active ? ' active' : ''}`}>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: 11, fontWeight: 700, color: day.active ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{day.label}</span>
                <span className="material-symbols-outlined icon-fill" style={{ fontSize: 28, color: 'var(--color-secondary)' }}>{day.icon}</span>
                <span style={{ fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{day.high}°</span>
                <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>{day.low}°</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="glass-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16, gap: 8, flexWrap: 'wrap' }}>
          <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 700, color: 'var(--color-primary)' }}>24-Hour Trend</span>
          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap' }}>
            {['Temperature', 'Humidity', 'AQI'].map((l, i) => (
              <span key={l} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 12, color: 'var(--color-on-surface-variant)' }}>
                <span style={{ width: 8, height: 8, borderRadius: '50%', background: ['var(--color-secondary)','rgba(255,255,255,0.4)','var(--color-error)'][i], display: 'inline-block' }} />
                {l}
              </span>
            ))}
          </div>
        </div>
        <div style={{ position: 'relative', height: 140 }}>
          <svg width="100%" height="100%" viewBox="0 0 800 140" preserveAspectRatio="none">
            <defs>
              <linearGradient id="areaGrad" x1="0" x2="0" y1="0" y2="1">
                <stop offset="0%" stopColor="#89d0ed" stopOpacity="0.25" />
                <stop offset="100%" stopColor="#89d0ed" stopOpacity="0" />
              </linearGradient>
            </defs>
            <polygon fill="url(#areaGrad)" points="0,140 0,90 100,80 200,70 300,85 400,55 500,45 600,60 700,50 800,65 800,140" />
            <polyline fill="none" stroke="#89d0ed" strokeWidth="2.5" strokeLinejoin="round" points="0,90 100,80 200,70 300,85 400,55 500,45 600,60 700,50 800,65" />
            <polyline fill="none" stroke="rgba(255,255,255,0.25)" strokeWidth="1.5" strokeLinejoin="round" strokeDasharray="6,4" points="0,100 100,95 200,90 300,105 400,85 500,80 600,95 700,82 800,88" />
            {[0,100,200,300,400,500,600,700,800].map((x, i) => (
              <circle key={x} cx={x} cy={[90,80,70,85,55,45,60,50,65][i]} r="3.5" fill="#0c0e11" stroke="#89d0ed" strokeWidth="2" />
            ))}
          </svg>
          <div style={{ position: 'absolute', bottom: -20, left: 0, right: 0, display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--color-on-surface-variant)', fontFamily: 'var(--font-headline)', fontWeight: 700 }}>
            {['00:00','03:00','06:00','09:00','12:00','15:00','18:00','21:00','Now'].map(t => <span key={t}>{t}</span>)}
          </div>
        </div>
      </div>
    </div>
  )
}
