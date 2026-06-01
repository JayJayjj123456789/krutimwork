export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center',
      gap: 16, padding: '60px 20px', width: '100%',
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid var(--color-glass-border)',
        borderTopColor: 'var(--color-secondary)',
        animation: 'spin 0.7s linear infinite',
      }} />
      <span style={{
        fontFamily: 'var(--font-headline)', fontSize: 14, fontWeight: 600,
        color: 'var(--color-on-surface-variant)',
      }}>{text}</span>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  )
}
