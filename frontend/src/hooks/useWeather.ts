import { useState, useEffect, useCallback, useRef } from 'react'
import { WeatherData } from '../types'
import { getWeather } from '../services/weatherApi'

export function useWeather(city: string = 'Bangkok') {
  const [data, setData] = useState<WeatherData | null>(null)
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

  const fetchWeather = useCallback(async () => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    try {
      const d = await getWeather(city, controller.signal)
      if (mountedRef.current && !controller.signal.aborted) {
        setData(d)
      }
    } catch (e) {
      if (mountedRef.current && !controller.signal.aborted) {
        if (e instanceof Error && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'An error occurred')
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [city])

  useEffect(() => {
    fetchWeather()
  }, [fetchWeather])

  return { data, loading, error, refetch: fetchWeather }
}
