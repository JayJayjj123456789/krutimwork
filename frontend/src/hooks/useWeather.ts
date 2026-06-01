import { useState, useEffect, useCallback } from 'react'
import { WeatherData } from '../types'
import { getWeather } from '../services/weatherApi'

export function useWeather(city: string = 'Bangkok') {
  const [data, setData] = useState<WeatherData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchWeather = useCallback(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    getWeather(city)
      .then(d => { if (mounted) setData(d) })
      .catch(e => { if (mounted) setError(e.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [city])

  useEffect(() => {
    const cleanup = fetchWeather()
    return cleanup
  }, [fetchWeather])

  return { data, loading, error, refetch: fetchWeather }
}
