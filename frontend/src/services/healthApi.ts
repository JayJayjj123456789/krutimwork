import API from './api'
import { ApiResponse, HealthAnalysis, Recommendation } from '../types'

export const analyzeHealth = async (_userId: string, city: string, signal?: AbortSignal): Promise<HealthAnalysis> => {
  const r = await API.post<ApiResponse<HealthAnalysis>>('/health/analyze', { city }, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Analysis failed')
  return r.data.data
}

export const getRecommendations = async (analysisId: number, signal?: AbortSignal): Promise<Recommendation> => {
  const r = await API.get<ApiResponse<Recommendation>>(`/recommendations?analysisId=${analysisId}`, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to get recommendations')
  return r.data.data
}
