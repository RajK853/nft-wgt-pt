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
    if (import.meta.env.DEV) {
      console.error('Error caught by boundary:', error, errorInfo)
    }

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
        <div className="error-boundary-container min-h-screen flex items-center justify-center p-8">
          <div className="text-center max-w-[600px]">
            <h2
              className="text-3xl font-bold mb-4"
              style={{
                background: 'linear-gradient(45deg, var(--color-foreground), var(--color-muted-foreground), var(--color-primary))',
                backgroundSize: '200% 200%',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              Something went wrong
            </h2>
            <p
              className="mb-6 leading-relaxed text-[1.1rem]"
              style={{ color: 'var(--color-muted-foreground)' }}
            >
              {errorMessage}
            </p>
            <div className="mb-8">
              <button
                onClick={this.handleReset}
                className="inline-flex items-center justify-center bg-gradient-to-r from-blue-500 to-green-500 text-white border-none px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-opacity shadow-md mr-4 hover:opacity-90"
              >
                Try Again
              </button>
              <button
                onClick={() => window.location.reload()}
                className="inline-flex items-center justify-center bg-gradient-to-r from-purple-500 to-pink-500 text-white border-none px-6 py-3 rounded-md text-base font-medium cursor-pointer transition-opacity shadow-md hover:opacity-90"
              >
                Refresh Page
              </button>
            </div>
            {import.meta.env.DEV && this.state.error && (
              <details
                className="text-left p-4 rounded-lg mt-4"
                style={{ background: 'var(--color-muted)' }}
              >
                <summary
                  className="cursor-pointer"
                  style={{ color: 'var(--color-muted-foreground)' }}
                >
                  Debug Information
                </summary>
                <pre
                  className="text-sm mt-2"
                  style={{ color: 'var(--color-foreground)' }}
                >
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
