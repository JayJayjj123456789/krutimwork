import { useState, useEffect } from 'react'
import { Recommendation } from '../types'
import { getRecommendations } from '../services/healthApi'

export function useRecommendations(analysisId: number) {
  const [data, setData] = useState<Recommendation[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let mounted = true
    setLoading(true)
    setError(null)
    getRecommendations(analysisId)
      .then(d => { if (mounted) setData(d) })
      .catch(e => { if (mounted) setError(e.message) })
      .finally(() => { if (mounted) setLoading(false) })
    return () => { mounted = false }
  }, [analysisId])

  return { data, loading, error }
}
