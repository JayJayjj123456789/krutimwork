import { useState, useCallback, useRef, useEffect } from 'react'
import { HealthAnalysis } from '../types'
import { analyzeHealth } from '../services/healthApi'

export function useHealth() {
  const [data, setData] = useState<HealthAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
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

  const analyze = useCallback(async (userId: number, city: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    try {
      const d = await analyzeHealth(userId, city, controller.signal)
      if (mountedRef.current && !controller.signal.aborted) setData(d)
    } catch (e) {
      if (mountedRef.current && !controller.signal.aborted) {
        if (e instanceof Error && e.name === 'AbortError') return
        setError(e instanceof Error ? e.message : 'An error occurred')
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) setLoading(false)
    }
  }, [])

  return { data, loading, error, analyze }
}
