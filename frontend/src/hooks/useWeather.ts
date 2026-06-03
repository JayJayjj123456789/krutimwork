import { useState, useEffect, useCallback, useRef } from 'react'
import { WeatherData } from '../types'
import { getWeather } from '../services/weatherApi'

const CACHE_TTL = 5 * 60 * 1000
const cache = new Map<string, { data: WeatherData; timestamp: number }>()

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
    const cached = cache.get(city)
    if (cached && Date.now() - cached.timestamp < CACHE_TTL) {
      console.log(`[useWeather] cache hit for "${city}"`)
      setData(cached.data)
      setLoading(false)
      setError(null)
      return
    }

    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    setLoading(true)
    setError(null)
    console.log(`[useWeather] fetching for city="${city}"`)
    try {
      const d = await getWeather(city, controller.signal)
      if (mountedRef.current && !controller.signal.aborted) {
        console.log(`[useWeather] data received: temp=${d.temperature} humidity=${d.humidity} aqi=${d.aqi}`)
        cache.set(city, { data: d, timestamp: Date.now() })
        setData(d)
      }
    } catch (e) {
      if (mountedRef.current && !controller.signal.aborted) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('[useWeather] aborted')
          return
        }
        console.error(`[useWeather] error:`, e instanceof Error ? e.message : e)
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
