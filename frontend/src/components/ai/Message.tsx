import { ChatMessage } from '../../types'

interface MessageProps {
  message: ChatMessage
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 16 }}>
      {isUser ? (
        <div className="bubble-user">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.6 }}>{message.content}</p>
        </div>
      ) : (
        <div className="bubble-ai">
          <span className="material-symbols-outlined icon-fill" style={{ position: 'absolute', top: 8, right: 8, fontSize: 40, color: 'rgba(137,208,237,0.06)', pointerEvents: 'none' }}>auto_awesome</span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
            <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-ai-accent)', fontSize: 15 }}>auto_awesome</span>
            <span style={{ fontFamily: 'var(--font-headline)', fontSize: 12, fontWeight: 700, color: 'var(--color-ai-accent)' }}>Aether Intelligence</span>
          </div>
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.7, color: 'var(--color-on-surface)', position: 'relative', zIndex: 1, whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
      )}
    </div>
  )
}
