import API from './api'
import { ApiResponse, ReportData } from '../types'

export const getReports = async (_userId: string, signal?: AbortSignal): Promise<ReportData> => {
  const r = await API.get<ApiResponse<ReportData>>('/reports', { signal })
  if (!r.data.success) throw new Error(r.data.error || 'Failed to fetch reports')
  return r.data.data
}
