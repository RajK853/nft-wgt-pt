import { Link, useLocation } from 'react-router-dom'
import styles from './Header.module.css'

function Header() {
  const location = useLocation()

  return (
    <header className={styles.header}>
      <Link to="/" className={styles.logoLink} aria-label="NFT Weingarten Home">
        <img 
          src="/nft-logo.jpg" 
          alt="NFT Weingarten" 
          width="40" 
          height="40"
          className={styles.logo}
        />
      </Link>
      <nav className={styles.nav} aria-label="Main navigation">
        <NavLink to="/" current={location.pathname}>Home</NavLink>
        <NavLink to="/dashboard" current={location.pathname}>Dashboard</NavLink>
      </nav>
    </header>
  )
}

interface NavLinkProps {
  to: string
  current: string
  children: string
}

function NavLink({ to, current, children }: NavLinkProps) {
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
}

export default Header
