import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import App from './App'

describe('App Integration', () => {
  it('renders header and main content', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    expect(screen.getByRole('banner')).toBeInTheDocument()
    expect(screen.getByRole('main')).toBeInTheDocument()
  })

  it('has proper document title on dashboard', () => {
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    )
    
    // The dashboard sets document.title in useEffect
    expect(document.title).toBe('Dashboard - NFT Weingarten')
  })
})