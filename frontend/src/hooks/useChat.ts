import { useState, useCallback, useRef, useEffect } from 'react'
import { ChatMessage } from '../types'
import { sendChat } from '../services/chatApi'

export function useChat(userId: string) {
  const [messages, setMessages] = useState<ChatMessage[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const mountedRef = useRef(true)
  const abortRef = useRef<AbortController | null>(null)

  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
      abortRef.current?.abort()
    }
  }, [])

  useEffect(() => {
    setMessages([])
    setError(null)
  }, [userId])

  const sendMessage = useCallback(async (question: string) => {
    abortRef.current?.abort()
    const controller = new AbortController()
    abortRef.current = controller

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: question,
      timestamp: new Date(),
    }
    setMessages(prev => [...prev, userMsg])
    setLoading(true)
    setError(null)
    console.log(`[useChat] sending: "${question.slice(0, 80)}..."`)
    try {
      const res = await sendChat(userId, question, controller.signal)
      if (mountedRef.current && !controller.signal.aborted) {
        console.log(`[useChat] response received: ${res.answer.slice(0, 80)}...`)
        const aiMsg: ChatMessage = {
          id: `ai-${Date.now()}`,
          role: 'ai',
          content: res.answer,
          timestamp: new Date(),
        }
        setMessages(prev => [...prev, aiMsg])
      }
    } catch (e) {
      if (mountedRef.current && !controller.signal.aborted) {
        if (e instanceof Error && e.name === 'AbortError') {
          console.log('[useChat] aborted')
          return
        }
        console.error(`[useChat] error:`, e instanceof Error ? e.message : e)
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
      }
    } finally {
      if (mountedRef.current && !controller.signal.aborted) {
        setLoading(false)
      }
    }
  }, [userId])

  return { messages, loading, error, sendMessage }
}
