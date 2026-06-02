import API from './api'

export const getReports = async (userId: number, signal?: AbortSignal) => {
  const r = await API.get('/reports', { params: { userId: String(userId) }, signal })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to fetch reports')
  return r.data.data
}
