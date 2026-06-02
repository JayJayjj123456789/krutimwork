import { Component, ErrorInfo, ReactNode } from 'react'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false, error: null }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('[ErrorBoundary]', error, errorInfo)
  }

  handleReset = () => {
    this.setState({ hasError: false, error: null })
  }

  render() {
    if (this.state.hasError) {
      return (
        <div
          role="alert"
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            minHeight: '60vh',
            padding: 24,
            textAlign: 'center',
            gap: 12,
          }}
        >
          <span
            className="material-symbols-outlined"
            style={{ fontSize: 48, color: 'var(--color-error)' }}
            aria-hidden="true"
          >
            error_outline
          </span>
          <h2 style={{ fontFamily: 'var(--font-headline)', fontSize: 20, fontWeight: 700 }}>
            Something went wrong
          </h2>
          <p style={{ fontSize: 14, color: 'var(--color-on-surface-variant)', maxWidth: 480 }}>
            {this.state.error?.message || 'An unexpected error occurred.'}
          </p>
          <button className="btn btn-primary" onClick={this.handleReset}>
            <span className="material-symbols-outlined" style={{ fontSize: 18 }}>refresh</span>
            Try again
          </button>
        </div>
      )
    }
    return this.props.children
  }
}
