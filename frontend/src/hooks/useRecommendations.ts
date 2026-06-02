import { useState, useEffect, useRef } from 'react'
import { Recommendation } from '../types'
import { getRecommendations } from '../services/healthApi'

export function useRecommendations(analysisId: number) {
  const [data, setData] = useState<Recommendation | null>(null)
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

  useEffect(() => {
    const controller = new AbortController()
    abortRef.current = controller
    setLoading(true)
    setError(null)
    getRecommendations(analysisId, controller.signal)
      .then(d => {
        if (mountedRef.current && !controller.signal.aborted) setData(d)
      })
      .catch(e => {
        if (mountedRef.current && !controller.signal.aborted) {
          if (e instanceof Error && e.name === 'AbortError') return
          setError(e instanceof Error ? e.message : 'An error occurred')
        }
      })
      .finally(() => {
        if (mountedRef.current && !controller.signal.aborted) {
          setLoading(false)
        }
      })
  }, [analysisId])

  return { data, loading, error }
}
