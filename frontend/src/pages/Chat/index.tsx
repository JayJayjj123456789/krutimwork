import { useChat } from '../../hooks/useChat'
import { useUser } from '../../context/UserContext'
import ChatBox from '../../components/ai/ChatBox'
import ErrorBanner from '../../components/ErrorBanner'

export default function Chat() {
  const { userId } = useUser()
  const { messages, loading, error, sendMessage } = useChat(userId)

  return (
    <div className="chat-container">
      {error && <ErrorBanner message={error} />}
      {messages.length === 0 && !loading && (
        <div style={{ textAlign: 'center', padding: 40, color: 'var(--color-on-surface-variant)' }}>
          <span className="material-symbols-outlined" style={{ fontSize: 48, opacity: 0.3, marginBottom: 12 }}>chat_bubble</span>
          <p style={{ fontFamily: 'var(--font-headline)', fontSize: 16, fontWeight: 600 }}>No messages yet</p>
          <p style={{ fontSize: 14, marginTop: 4 }}>Ask about weather, health, or recommendations</p>
        </div>
      )}
      <ChatBox messages={messages} onSend={sendMessage} loading={loading} />
    </div>
  )
}
