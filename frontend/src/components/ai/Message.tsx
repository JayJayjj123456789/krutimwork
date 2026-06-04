import { ChatMessage } from '../../types'

interface MessageProps {
  message: ChatMessage
}

export default function Message({ message }: MessageProps) {
  const isUser = message.role === 'user'

  return (
    <div style={{ display: 'flex', justifyContent: isUser ? 'flex-end' : 'flex-start', marginBottom: 12 }}>
      {isUser ? (
        <div className="bubble-user">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55 }}>{message.content}</p>
        </div>
      ) : (
        <div className="bubble-ai">
          <p style={{ fontFamily: 'var(--font-body)', fontSize: 14, lineHeight: 1.55, color: 'var(--color-ink)', whiteSpace: 'pre-wrap' }}>{message.content}</p>
        </div>
      )}
    </div>
  )
}
