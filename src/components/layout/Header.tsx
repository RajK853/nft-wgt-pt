import { Link, useLocation } from 'react-router-dom'
import { memo } from 'react'
import { ThemeToggle } from '@/components/ui/theme-toggle'
import styles from './Header.module.css'

function Header() {
  const location = useLocation()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="NFT Weingarten Home">
        <div className={styles.logoWrapper}>
          <div className={styles.logoGlow}></div>
          <div className={styles.logoFrame}>
            <img
              src="/nft-logo.jpg"
              alt="NFT Weingarten"
              width="36"
              height="36"
              className={styles.logo}
              loading="lazy"
            />
          </div>
        </div>
        <div className={styles.brandText}>
          <span className={styles.brandTitle}>NFT Weingarten</span>
          <span className={styles.brandSubtitle}>Penalty Tracker</span>
        </div>
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <NavLink to="/" current={location.pathname}>Home</NavLink>
        <NavLink to="/dashboard" current={location.pathname}>Dashboard</NavLink>
        <NavLink to="/player-performance" current={location.pathname}>Players</NavLink>
        <NavLink to="/keeper-performance" current={location.pathname}>Goalkeepers</NavLink>
        <NavLink to="/scoring-method" current={location.pathname}>Scoring</NavLink>
        <ThemeToggle />
      </nav>
    </header>
  )
}

interface NavLinkProps {
  to: string
  current: string
  children: string
}

const NavLink = memo(({ to, current, children }: NavLinkProps) => {
  const isActive = current === to
  
  return (
    <Link 
      to={to} 
      className={isActive ? styles.active : styles.link}
      aria-current={isActive ? 'page' : undefined}
    >
      {children}
    </Link>
  )
})

NavLink.displayName = 'NavLink'

export default Header
