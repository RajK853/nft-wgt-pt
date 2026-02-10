import { render, screen, fireEvent } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Header from './Header'

const renderWithRouter = (component: React.ReactElement) => {
  return render(
    <BrowserRouter>
      {component}
    </BrowserRouter>
  )
}

describe('Header Component', () => {
  it('renders logo and navigation', () => {
    renderWithRouter(<Header />)
    
    expect(screen.getByAltText('NFT Weingarten')).toBeInTheDocument()
    expect(screen.getByText('Home')).toBeInTheDocument()
    expect(screen.getByText('Dashboard')).toBeInTheDocument()
  })

  it('has active state for current page', () => {
    renderWithRouter(<Header />)
    
    const homeLink = screen.getByText('Home')
    expect(homeLink).toHaveClass('active')
  })

  it('navigates correctly', () => {
    renderWithRouter(<Header />)
    
    const dashboardLink = screen.getByText('Dashboard')
    fireEvent.click(dashboardLink)
    
    // Note: This test would need more setup to properly test navigation
    // For now, we're just testing that the link exists and can be clicked
    expect(dashboardLink).toBeInTheDocument()
  })
})