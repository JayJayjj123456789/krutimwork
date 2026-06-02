export default function LoadingSpinner({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className="loading-spinner">
      <div className="loading-spinner-circle" />
      <span className="loading-spinner-text">{text}</span>
    </div>
  )
}
