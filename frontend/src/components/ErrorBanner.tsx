interface ErrorBannerProps {
  message: string
  onRetry?: () => void
}

export default function ErrorBanner({ message, onRetry }: ErrorBannerProps) {
  return (
    <div className="error-accent-card" style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px 20px' }}>
      <span className="material-symbols-outlined icon-fill" style={{ color: 'var(--color-error)', fontSize: 24, flexShrink: 0 }}>error</span>
      <div style={{ flex: 1 }}>
        <p style={{
          fontFamily: 'var(--font-headline)', fontSize: 13, fontWeight: 700,
          color: 'var(--color-primary)', marginBottom: 2,
        }}>Something went wrong</p>
        <p style={{ fontSize: 13, color: 'var(--color-on-surface-variant)' }}>{message}</p>
      </div>
      {onRetry && (
        <button className="btn btn-primary" style={{ flexShrink: 0, padding: '8px 16px', fontSize: 12 }} onClick={onRetry}>
          <span className="material-symbols-outlined" style={{ fontSize: 16 }}>refresh</span>
          Retry
        </button>
      )}
    </div>
  )
}
