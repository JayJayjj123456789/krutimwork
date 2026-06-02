import { useState, useCallback, useRef, useEffect } from 'react'
import { HealthAnalysis } from '../types'
import { analyzeHealth } from '../services/healthApi'

export function useHealth() {
  const [data, setData] = useState<HealthAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  const analyze = useCallback(async (userId: number, city: string) => {
    setLoading(true)
    setError(null)
    try {
      const d = await analyzeHealth(userId, city)
      if (mountedRef.current) setData(d)
    } catch (e) {
      if (mountedRef.current) {
        setError(e instanceof Error ? e.message : 'An error occurred')
      }
    } finally {
      if (mountedRef.current) setLoading(false)
    }
  }, [])

  return { data, loading, error, analyze }
}
