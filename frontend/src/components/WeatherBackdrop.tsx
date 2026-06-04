import { useEffect } from 'react'
import { useUser } from '../context/UserContext'
import { useWeather } from '../hooks/useWeather'

type LivingCategory = 'clear' | 'partly-cloudy' | 'cloudy' | 'fog' | 'rain' | 'snow' | 'storm'

const DEFAULT_CATEGORY: LivingCategory = 'partly-cloudy'

function getCategory(code: number | null | undefined): LivingCategory {
  if (code === null || code === undefined) return DEFAULT_CATEGORY
  if (code === 0 || code === 1) return 'clear'
  if (code === 2) return 'partly-cloudy'
  if (code === 3) return 'cloudy'
  if (code === 45 || code === 48) return 'fog'
  if (code >= 51 && code <= 67) return 'rain'
  if (code >= 71 && code <= 77) return 'snow'
  if (code >= 80 && code <= 82) return 'rain'
  if (code >= 85 && code <= 86) return 'snow'
  if (code >= 95) return 'storm'
  return DEFAULT_CATEGORY
}

export default function WeatherBackdrop() {
  const { city } = useUser()
  const { data } = useWeather(city.split(',')[0].trim())

  useEffect(() => {
    const cat = getCategory(data?.weather_code)
    document.body.dataset.weather = cat
    return () => {
      if (document.body.dataset.weather === cat) {
        delete document.body.dataset.weather
      }
    }
  }, [data?.weather_code])

  return (
    <div className="weather-effects" aria-hidden="true">
      <div className="sun-layer" />
      <div className="fog-layer" />
      <div className="rain-layer" />
      <div className="lightning-layer" />
    </div>
  )
}
