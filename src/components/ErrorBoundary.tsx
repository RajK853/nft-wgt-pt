import { Component, ReactNode } from 'react'

interface ErrorBoundaryState {
  hasError: boolean
  error?: Error
  errorInfo?: React.ErrorInfo
  hasReset: boolean
}

interface ErrorBoundaryProps {
  children: ReactNode
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void
}

class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, hasReset: false }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error, hasReset: false }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Error caught by boundary:', error, errorInfo)
    
    // Call optional error handler
    if (this.props.onError) {
      this.props.onError(error, errorInfo)
    }
    
    // In a production environment, you would log this to an error reporting service
    // Example: logErrorToService(error, errorInfo)
  }

  private getErrorMessage(error: Error): string {
    const message = error.message.toLowerCase()
    
    if (message.includes('network') || message.includes('fetch')) {
      return 'Network error: Unable to connect to the server. Please check your internet connection and try again.'
    }
    
    if (message.includes('syntax') || message.includes('unexpected token')) {
      return 'Syntax error: There appears to be an issue with the application code. Please refresh the page.'
    }
    
    if (message.includes('type') || message.includes('undefined') || message.includes('null')) {
      return 'Data error: An unexpected data issue occurred. Please refresh the page or contact support.'
    }
    
    if (message.includes('permission') || message.includes('forbidden')) {
      return 'Access error: You do not have permission to access this resource. Please check your permissions.'
    }
    
    if (message.includes('timeout')) {
      return 'Timeout error: The request took too long to complete. Please try again.'
    }
    
    return 'An unexpected error occurred. Please try refreshing the page or contact support if the problem persists.'
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: undefined, errorInfo: undefined, hasReset: true })
  }

  render() {
    if (this.state.hasError) {
      const errorMessage = this.state.error ? this.getErrorMessage(this.state.error) : 'An unexpected error occurred.'
      
      return (
        <div 
          style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #111827 0%, #1f2937 50%, #111827 100%)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem',
            color: '#ffffff'
          }}
        >
          <div style={{ textAlign: 'center', maxWidth: '600px' }}>
            <h2 style={{ 
              fontSize: '2rem', 
              fontWeight: '700', 
              marginBottom: '1rem',
              background: 'linear-gradient(45deg, #fff, #9ca3af, #a855f7)',
              backgroundSize: '200% 200%',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text'
            }}>
              Something went wrong
            </h2>
            <p style={{ 
              color: '#cbd5e1', 
              fontSize: '1.1rem', 
              marginBottom: '1.5rem',
              lineHeight: '1.6'
            }}>
              {errorMessage}
            </p>
            <div style={{ marginBottom: '2rem' }}>
              <button 
                onClick={this.handleReset}
                style={{
                  background: 'linear-gradient(45deg, #3b82f6, #22c55e)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
                  marginRight: '1rem'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Try Again
              </button>
              <button 
                onClick={() => window.location.reload()}
                style={{
                  background: 'linear-gradient(45deg, #a855f7, #ec4899)',
                  color: 'white',
                  border: 'none',
                  padding: '0.75rem 1.5rem',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontWeight: '500',
                  cursor: 'pointer',
                  transition: 'opacity 0.2s ease',
                  boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)'
                }}
                onMouseEnter={(e) => e.currentTarget.style.opacity = '0.9'}
                onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
              >
                Refresh Page
              </button>
            </div>
            {process.env.NODE_ENV === 'development' && this.state.error && (
              <details style={{ 
                textAlign: 'left', 
                background: 'rgba(255, 255, 255, 0.05)', 
                padding: '1rem', 
                borderRadius: '0.5rem',
                marginTop: '1rem'
              }}>
                <summary style={{ cursor: 'pointer', color: '#94a3b8' }}>Debug Information</summary>
                <pre style={{ color: '#e5e7eb', fontSize: '0.875rem', marginTop: '0.5rem' }}>
                  {this.state.error.stack}
                </pre>
              </details>
            )}
          </div>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary