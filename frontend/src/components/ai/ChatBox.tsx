import { useState, FormEvent } from 'react'
import { ChatMessage } from '../../types'
import Message from './Message'
import styles from './ChatBox.module.css'

interface ChatBoxProps {
  messages: ChatMessage[]
  onSend: (text: string) => void
  loading?: boolean
}

export default function ChatBox({ messages, onSend, loading }: ChatBoxProps) {
  const [input, setInput] = useState('')

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!input.trim() || loading) return
    onSend(input.trim())
    setInput('')
  }

  return (
    <div className={styles.container}>
      <div className={`chat-messages hide-scrollbar ${styles.messages}`}>
        {messages.map(msg => (
          <Message key={msg.id} message={msg} />
        ))}
        {loading && (
          <div className="bubble-ai">
            <div style={{ display: 'flex', gap: 6, padding: '8px 0' }}>
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-on-surface-variant)', opacity: 0.4, animation: 'pulse-glow 1.2s infinite' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-on-surface-variant)', opacity: 0.4, animation: 'pulse-glow 1.2s infinite 0.2s' }} />
              <span style={{ width: 8, height: 8, borderRadius: '50%', background: 'var(--color-on-surface-variant)', opacity: 0.4, animation: 'pulse-glow 1.2s infinite 0.4s' }} />
            </div>
          </div>
        )}
      </div>

      <form className="chat-input-row" onSubmit={handleSubmit}>
        <span className="material-symbols-outlined" style={{ color: 'var(--color-on-surface-variant)', opacity: 0.5, fontSize: 20, flexShrink: 0 }}>edit</span>
        <input
          placeholder="Ask about weather, health recommendations…"
          value={input}
          onChange={e => setInput(e.target.value)}
          disabled={loading}
        />
        <button type="submit" className="send-btn" disabled={loading || !input.trim()}>
          <span className="material-symbols-outlined icon-fill" style={{ fontSize: 20 }}>send</span>
        </button>
      </form>
    </div>
  )
}
