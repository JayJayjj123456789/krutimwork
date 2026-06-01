export default function TopBar() {
  return (
    <header className="top-app-bar">
      <button className="icon-btn" aria-label="Location">
        <span className="material-symbols-outlined icon-fill">location_on</span>
      </button>
      <h1>Aether AI</h1>
      <div className="avatar" aria-label="Profile">
        <span className="material-symbols-outlined" style={{ fontSize: 20, color: 'var(--color-on-surface-variant)' }}>person</span>
      </div>
    </header>
  )
}
