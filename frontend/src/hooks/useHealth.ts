import { useState, useCallback } from 'react'
import { HealthAnalysis } from '../types'
import { analyzeHealth } from '../services/healthApi'

export function useHealth() {
  const [data, setData] = useState<HealthAnalysis | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const analyze = useCallback((userId: number, city: string) => {
    setLoading(true)
    setError(null)
    analyzeHealth(userId, city)
      .then(d => setData(d))
      .catch(e => setError(e.message))
      .finally(() => setLoading(false))
  }, [])

  return { data, loading, error, analyze }
}
