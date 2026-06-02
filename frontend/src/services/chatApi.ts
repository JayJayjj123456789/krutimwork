import API from './api'

export const sendChat = async (userId: number, question: string, signal?: AbortSignal) => {
  const r = await API.post('/chat', { userId, question }, { signal, timeout: 60_000 })
  if (!r.data.success) throw new Error(r.data.error || 'Chat failed')
  return r.data.data
}
