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
          <div className="bubble-ai" aria-label="Aether is typing">
            <div style={{ display: 'flex', gap: 5, padding: '4px 0' }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-ink-faint)', animation: 'typing-bounce 1.2s ease-in-out infinite' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-ink-faint)', animation: 'typing-bounce 1.2s ease-in-out 0.15s infinite' }} />
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--color-ink-faint)', animation: 'typing-bounce 1.2s ease-in-out 0.3s infinite' }} />
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
