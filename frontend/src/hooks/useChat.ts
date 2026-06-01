import { useState, useCallback } from 'react'
import { ChatMessage } from '../types'
import { sendChat } from '../services/chatApi'

export function useChat(userId: number) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const sendMessage = useCallback(async (question: string) => {
    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)
    try {
      const res = await sendChat(userId, question)
      const aiMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'ai',
        content: res.answer,
        timestamp: new Date(),
      }
      setMessages(prev => [...prev, aiMsg])
    } catch (e) {
      setError(e instanceof Error ? e.message : 'An error occurred')
      setMessages(prev => [
        ...prev,
        {
          id: `ai-error-${Date.now()}`,
          role: 'ai',
          content: 'Sorry, I encountered an error. Please try again.',
          timestamp: new Date(),
        },
      ])
    } finally {
      setLoading(false)
    }
  }, [userId])

  return { messages, loading, error, sendMessage }
}
