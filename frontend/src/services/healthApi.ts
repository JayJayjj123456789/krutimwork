import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000/api',
})

export const analyzeHealth = (userId: number, city: string) =>
  API.post('/health/analyze', { userId, city }).then(r => r.data)

export const getRecommendations = (analysisId: number) =>
  API.get(`/recommendations?analysisId=${analysisId}`).then(r => r.data)
