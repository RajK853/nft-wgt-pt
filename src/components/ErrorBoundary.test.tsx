import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import ErrorBoundary from './ErrorBoundary'

// Mock component that throws an error
const ThrowError = () => {
  throw new Error('Test error')
}

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('ErrorBoundary', () => {
  beforeEach(() => {
    // Clear any console errors from previous tests
    jest.clearAllMocks()
  })

  it('renders children when there is no error', () => {
    renderWithRouter(
      <ErrorBoundary>
        <div>Normal content</div>
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Normal content')).toBeInTheDocument()
  })

  it('displays error UI when child component throws error', () => {
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {})

    renderWithRouter(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    expect(screen.getByText('We\'re sorry, but something unexpected happened. Please try refreshing the page or contact support if the problem persists.')).toBeInTheDocument()
    expect(screen.getByText('Refresh Page')).toBeInTheDocument()
    
    consoleSpy.mockRestore()
  })

  it('calls refresh when refresh button is clicked', () => {
    const locationSpy = jest.spyOn(window.location, 'reload').mockImplementation(() => {})
    
    renderWithRouter(
      <ErrorBoundary>
        <ThrowError />
      </ErrorBoundary>
    )
    
    const refreshButton = screen.getByText('Refresh Page')
    fireEvent.click(refreshButton)
    
    expect(locationSpy).toHaveBeenCalled()
    
    locationSpy.mockRestore()
  })
})