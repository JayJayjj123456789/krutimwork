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

  const heroBg = wmo ? `linear-gradient(135deg, var(--grad-${wmo.gradient}-from), var(--grad-${wmo.gradient}-to))` : undefined

  return (
    <div className="section-gap page-enter">
      {error && <ErrorBanner message={error} onRetry={refetch} />}
      {aqiUnavailable && (
        <ErrorBanner message="AQI data temporarily unavailable." onRetry={refetch} />
      )}
      {uvUnavailable && (
        <ErrorBanner message="UV index data temporarily unavailable." onRetry={refetch} />
      )}

      <div className="grid-weather-main">
        <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220, background: heroBg ?? 'linear-gradient(135deg, rgba(137,208,237,0.08), rgba(17,19,22,0.5))' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span className="material-symbols-outlined icon-fill" style={{ fontSize: 16, color: 'var(--color-secondary)' }}>location_on</span>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 600, color: 'var(--color-on-surface-variant)' }}>
                {weatherData ? `${weatherData.city}${weatherData.country ? `, ${weatherData.country}` : ''}` : '—'}
              </span>
            </div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12 }}>
              <span className="temp-big">{weatherData ? Math.round(weatherData.temperature) : '—'}°</span>
              <div style={{ paddingBottom: 12 }}>
                <span className="material-symbols-outlined icon-fill weather-icon-big" style={{ color: 'var(--color-secondary)' }}>
                  {wmo?.icon ?? 'help'}
                </span>
              </div>
            </div>
            <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, color: 'var(--color-on-surface-variant)', marginTop: 4 }}>
              {weatherData
                ? `${wmo?.en ?? '—'} · Feels like ${Math.round(weatherData.feels_like)}°C · Humidity ${weatherData.humidity}% · Wind ${Math.round(weatherData.wind_speed)} km/h`
                : 'No data'}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 8, marginTop: 16, flexWrap: 'wrap' }}>
            {wmo && <span className="chip chip-good">{wmo.en}</span>}
          </div>
        </div>

        <div className="bento-4">
          {[
            {
              icon: 'air', label: 'Air Quality',
              value: aqi !== null ? String(Math.round(aqi)) : 'N/A',
              unit: 'AQI',
              chip: aqiChip(aqi).chip, chipClass: aqiChip(aqi).chipClass,
              bg: 'rgba(137,208,237,0.12)', iconColor: 'var(--color-secondary)',
            },
            {
              icon: 'wb_sunny', label: 'UV Index',
              value: uv !== null ? String(Math.round(uv * 10) / 10) : 'N/A',
              unit: '/11',
              chip: uvChip(uv).chip, chipClass: uvChip(uv).chipClass,
              bg: 'rgba(255,180,171,0.12)', iconColor: 'var(--color-error)',
            },
            {
              icon: 'water_drop', label: 'Humidity',
              value: weatherData ? String(weatherData.humidity) : '—',
              unit: '%',
              chip: weatherData && weatherData.humidity > 70 ? 'High' : 'Normal',
              chipClass: weatherData && weatherData.humidity > 70 ? 'chip-neutral' : 'chip-good',
              bg: 'rgba(137,208,237,0.08)', iconColor: 'var(--color-secondary)',
            },
            {
              icon: 'thermostat', label: 'Feels Like',
              value: weatherData ? String(Math.round(weatherData.feels_like)) : '—',
              unit: '°C',
              chip: weatherData && weatherData.feels_like > 32 ? 'Hot' : 'Warm',
              chipClass: weatherData && weatherData.feels_like > 32 ? 'chip-warning' : 'chip-neutral',
              bg: 'rgba(255,180,171,0.08)', iconColor: 'var(--color-error)',
            },
          ].map(({ icon, label, value, unit, chip, chipClass, bg, iconColor }) => (
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
              <span className="section-label" style={{ color: 'var(--color-ai-accent)', display: 'block' }}>Weather Overview</span>
              <span style={{ fontFamily: 'var(--font-headline)', fontSize: 15, fontWeight: 600, color: 'var(--color-primary)' }}>Today's Outlook</span>
            </div>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface-variant)' }}>
            {weatherData
              ? `Currently ${Math.round(weatherData.temperature)}°C with ${wmo?.en.toLowerCase() ?? '—'}. AQI ${aqi !== null ? Math.round(aqi) : 'unavailable'}${aqi !== null ? (aqi <= 50 ? ' (good range)' : ' (sensitive groups should limit outdoor time)') : ''}. UV ${uv !== null ? Math.round(uv * 10) / 10 : 'unavailable'}${uv !== null && uv > 7 ? ' — apply SPF 50+ if going outdoors at midday.' : '.'}`
              : 'No data available.'}
          </p>
          <div style={{ marginTop: 16, display: 'flex', gap: 8, flexWrap: 'wrap' }}>
            {aqi !== null && aqi <= 100 && <span className="chip chip-good">Low Risk</span>}
            {aqi !== null && aqi > 100 && <span className="chip chip-warning">Elevated Risk</span>}
            <span className="chip chip-neutral">Updated just now</span>
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
            {weatherData?.daily?.length ? (
              weatherData.daily.map((d, i) => {
                const w = getWmoInfo(d.weather_code)
                return (
                  <div key={d.date} className={`forecast-day${i === 0 ? ' active' : ''}`}>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: 11, fontWeight: 700, color: i === 0 ? 'var(--color-secondary)' : 'var(--color-on-surface-variant)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{dayLabel(d.date, i)}</span>
                    <span className="material-symbols-outlined icon-fill" style={{ fontSize: 28, color: 'var(--color-secondary)' }}>{w.icon}</span>
                    <span style={{ fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 700, color: 'var(--color-primary)' }}>{Math.round(d.temperature_max)}°</span>
                    <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>{Math.round(d.temperature_min)}°</span>
                  </div>
                )
              })
            ) : (
              <span style={{ fontSize: 12, color: 'var(--color-on-surface-variant)' }}>No forecast data</span>
            )}
          </div>
        </div>
      </div>


    </div>
  )
}
