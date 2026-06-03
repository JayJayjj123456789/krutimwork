import API from './api'
import { ApiResponse, ChatResponse } from '../types'

export const sendChat = async (_userId: string, question: string, signal?: AbortSignal): Promise<ChatResponse> => {
  const r = await API.post<ApiResponse<ChatResponse>>('/chat', { question }, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Chat failed')
  return r.data.data
}
