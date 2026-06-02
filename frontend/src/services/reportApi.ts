import API from './api'

export const getReports = async (userId: number, week?: string, signal?: AbortSignal) => {
  const params: Record<string, string> = { userId: String(userId) }
  if (week) params.week = week
  const r = await API.get('/reports', { params, signal })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to fetch reports')
  return r.data.data
}
