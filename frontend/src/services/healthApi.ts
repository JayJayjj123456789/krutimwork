import API from './api'

export const analyzeHealth = async (userId: number, city: string, signal?: AbortSignal) => {
  const r = await API.post('/health/analyze', { userId, city }, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Analysis failed')
  return r.data.data
}

export const getRecommendations = async (analysisId: number, signal?: AbortSignal) => {
  const r = await API.get(`/recommendations?analysisId=${analysisId}`, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to get recommendations')
  return r.data.data
}
