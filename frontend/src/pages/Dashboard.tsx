import { useMemo } from 'react'
import { useWeather } from '../hooks/useWeather'
import { useUser } from '../context/UserContext'
import LoadingSpinner from '../components/LoadingSpinner'
import ErrorBanner from '../components/ErrorBanner'
import { getWmoInfo } from '../utils/wmo'

function dayLabel(date: string, index: number): string {
  if (index === 0) return 'Today'
  const d = new Date(date)
  return d.toLocaleDateString('en-US', { weekday: 'short' })
}

function aqiChip(aqi: number | null): { chip: string; chipClass: string } {
  if (aqi === null) return { chip: 'Unavailable', chipClass: 'chip-neutral' }
  if (aqi <= 50)  return { chip: 'Good',            chipClass: 'chip-good' }
  if (aqi <= 100) return { chip: 'Moderate',        chipClass: 'chip-neutral' }
  if (aqi <= 150) return { chip: 'Unhealthy for Sensitive', chipClass: 'chip-warning' }
  return                { chip: 'Unhealthy',          chipClass: 'chip-warning' }
}

function uvChip(uv: number | null): { chip: string; chipClass: string } {
  if (uv === null) return { chip: 'Unavailable', chipClass: 'chip-neutral' }
  if (uv <= 2)  return { chip: 'Low',         chipClass: 'chip-good' }
  if (uv <= 5)  return { chip: 'Moderate',    chipClass: 'chip-neutral' }
  if (uv <= 7)  return { chip: 'High',        chipClass: 'chip-warning' }
  if (uv <= 10) return { chip: 'Very High',   chipClass: 'chip-warning' }
  return              { chip: 'Extreme',    chipClass: 'chip-error' }
}

export default function Dashboard() {
  const { city } = useUser()
  const { data: weatherData, loading, error, refetch } = useWeather(city.split(',')[0].trim())
  console.log(`[Dashboard] city="${city}" loading=${loading} hasData=${!!weatherData} error=${error}`)

  const wmo = useMemo(
    () => (weatherData ? getWmoInfo(weatherData.weather_code) : null),
    [weatherData]
  )

  if (loading && !weatherData) {
    return <LoadingSpinner text="Fetching weather data..." />
  }

  const aqiUnavailable = weatherData?.dataAvailability?.aqi === false
  const uvUnavailable  = weatherData?.dataAvailability?.uv === false
  const aqi = weatherData?.aqi ?? null
  const uv  = weatherData?.uv ?? null
  const humidity = weatherData?.humidity ?? null
  const feelsLike = weatherData?.feels_like ?? null
  const temp = weatherData?.temperature ?? null

  const placeLine = weatherData
    ? `${weatherData.city}${weatherData.country ? `, ${weatherData.country}` : ''}`
    : '—'

  const summarySentence = weatherData
    ? `Currently ${Math.round(temp!)}°C with ${wmo?.en.toLowerCase() ?? '—'}. ` +
      `AQI ${aqi !== null ? Math.round(aqi) : 'unavailable'}` +
      `${aqi !== null && aqi <= 50 ? ' (good range)' : aqi !== null && aqi > 100 ? ' (sensitive groups should limit outdoor time)' : ''}. ` +
      `UV ${uv !== null ? (Math.round(uv * 10) / 10) : 'unavailable'}` +
      `${uv !== null && uv > 7 ? ' — apply SPF 50+ if going outdoors at midday.' : '.'}`
    : 'No data available.'

  return (
    <div className="section-gap page-enter">
      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {aqiUnavailable && <ErrorBanner message="AQI data temporarily unavailable." onRetry={refetch} />}
      {uvUnavailable && <ErrorBanner message="UV index data temporarily unavailable." onRetry={refetch} />}

      {/* Hero: place, conditions, dominant number — no big bento, no gradient */}
      <section className="card" style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-ink-muted)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 14 }}>location_on</span>
          <span style={{ fontSize: 13, fontWeight: 500 }}>{placeLine}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 16, flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
            <span className="temp-big">{temp !== null ? Math.round(temp) : '—'}°</span>
            <div style={{ paddingBottom: 8, display: 'flex', alignItems: 'center', gap: 6, color: 'var(--color-ink-muted)' }}>
              <span className="material-symbols-outlined weather-icon-big" style={{ fontSize: 28 }}>
                {wmo?.icon ?? 'help'}
              </span>
              <span style={{ fontSize: 14, fontWeight: 500 }}>{wmo?.en ?? '—'}</span>
            </div>
          </div>
          {wmo && <span className="chip chip-neutral">{wmo.en}</span>}
        </div>
        <p style={{ fontSize: 13, color: 'var(--color-ink-muted)' }}>
          Feels like {feelsLike !== null ? Math.round(feelsLike) : '—'}°C
          {humidity !== null ? ` · Humidity ${humidity}%` : ''}
          {weatherData?.wind_speed !== undefined ? ` · Wind ${Math.round(weatherData.wind_speed)} km/h` : ''}
        </p>
      </section>

      {/* Metrics: definition list, not a bento of identical icon-cards */}
      <section className="card">
        <div className="section-label" style={{ marginBottom: 12 }}>Conditions</div>
        <dl style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 16 }}>
          <div>
            <dt style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>Air quality</dt>
            <dd style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 20, fontWeight: 500, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {aqi !== null ? Math.round(aqi) : '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>AQI</span>
              <span className={`chip ${aqiChip(aqi).chipClass}`} style={{ marginLeft: 4 }}>{aqiChip(aqi).chip}</span>
            </dd>
          </div>
          <div>
            <dt style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>UV index</dt>
            <dd style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 20, fontWeight: 500, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {uv !== null ? (Math.round(uv * 10) / 10) : '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>/11</span>
              <span className={`chip ${uvChip(uv).chipClass}`} style={{ marginLeft: 4 }}>{uvChip(uv).chip}</span>
            </dd>
          </div>
          <div>
            <dt style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>Humidity</dt>
            <dd style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 20, fontWeight: 500, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {humidity !== null ? humidity : '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>%</span>
            </dd>
          </div>
          <div>
            <dt style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>Feels like</dt>
            <dd style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginTop: 4 }}>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 20, fontWeight: 500, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>
                {feelsLike !== null ? Math.round(feelsLike) : '—'}
              </span>
              <span style={{ fontSize: 12, color: 'var(--color-ink-faint)' }}>°C</span>
            </dd>
          </div>
        </dl>
      </section>

      {/* Forecast + summary: side by side, no AI watermark, no gradient */}
      <section className="grid-ai-forecast">
        <div className="card">
          <p style={{ fontSize: 13, lineHeight: 1.55, color: 'var(--color-ink)' }}>{summarySentence}</p>
          <div style={{ marginTop: 12, display: 'flex', gap: 6, flexWrap: 'wrap' }}>
            {aqi !== null && aqi <= 100 && <span className="chip chip-good">Low risk</span>}
            {aqi !== null && aqi > 100 && <span className="chip chip-warning">Elevated risk</span>}
            {weatherData?.timestamp && (
              <span className="chip chip-neutral">
                Updated {new Date(weatherData.timestamp).toLocaleTimeString('th-TH', { hour: '2-digit', minute: '2-digit' })}
              </span>
            )}
          </div>
        </div>

        <div className="card">
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12, gap: 8, flexWrap: 'wrap' }}>
            <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--color-ink)' }}>7-day forecast</span>
            <button className="btn" style={{ padding: '5px 10px', fontSize: 12 }}>
              <span className="material-symbols-outlined" style={{ fontSize: 14 }}>calendar_month</span>
              Full calendar
            </button>
          </div>
          <div className="forecast-strip">
            {weatherData?.daily?.length ? (
              weatherData.daily.map((d, i) => {
                const w = getWmoInfo(d.weather_code)
                return (
                  <div key={d.date} className={`forecast-day${i === 0 ? ' active' : ''}`}>
                    <span style={{ fontSize: 11, fontWeight: 500, color: i === 0 ? 'var(--color-ink)' : 'var(--color-ink-muted)' }}>{dayLabel(d.date, i)}</span>
                    <span className="material-symbols-outlined" style={{ fontSize: 22, color: 'var(--color-ink-muted)' }}>{w.icon}</span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 500, color: 'var(--color-ink)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(d.temperature_max)}°</span>
                    <span style={{ fontSize: 12, color: 'var(--color-ink-faint)', fontVariantNumeric: 'tabular-nums' }}>{Math.round(d.temperature_min)}°</span>
                  </div>
                )
              })
            ) : (
              <span style={{ fontSize: 12, color: 'var(--color-ink-muted)' }}>No forecast data</span>
            )}
          </div>
        </div>
      </section>
    </div>
  )
}
