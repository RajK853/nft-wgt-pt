import { useEffect } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/auth/AuthContext'
import styles from './Home.module.css'

interface NavCardProps {
  icon: string
  title: string
  description: string
  to?: string
  onClick?: () => void
  variant?: 'default' | 'login'
}

function NavCard({ icon, title, description, to, onClick, variant = 'default' }: NavCardProps) {
  const className = `${styles.navCard} ${variant === 'login' ? styles.login : ''}`
  
  if (to) {
    return (
      <Link to={to} className={className}>
        <span className={styles.navCardIcon}>{icon}</span>
        <div className={styles.navCardContent}>
          <h3 className={styles.navCardTitle}>{title}</h3>
          <p className={styles.navCardDescription}>{description}</p>
        </div>
        <span className={styles.navCardArrow}>→</span>
      </Link>
    )
  }
  
  return (
    <button onClick={onClick} className={className}>
      <span className={styles.navCardIcon}>{icon}</span>
      <div className={styles.navCardContent}>
        <h3 className={styles.navCardTitle}>{title}</h3>
        <p className={styles.navCardDescription}>{description}</p>
      </div>
      <span className={styles.navCardArrow}>→</span>
    </button>
  )
}

function Home() {
  const { user } = useAuth()
  const navigate = useNavigate()
  
  useEffect(() => {
    document.title = 'NFT Weingarten - Penalty Tracker'
  }, [])

  const handleLoginClick = () => {
    navigate('/login')
  }

  return (
    <div className={styles.container}>
      {/* Header with Logo */}
      <header className={styles.header}>
        <div className={styles.logoContainer}>
          <div className={styles.logoWrapper}>
            <div className={styles.logoGlow}></div>
            <div className={styles.logoFrame}>
              <img 
                src="/nft-logo.jpg" 
                alt="NFT Weingarten Logo" 
                className={styles.logo}
              />
            </div>
          </div>
        </div>
        
        <div className={styles.headerText}>
          <h1 className={styles.title}>NFT Weingarten</h1>
          <p className={styles.subtitle}>Penalty Tracker</p>
        </div>
        
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot}></div>
          <span>System Online</span>
        </div>
      </header>
      
      {/* Navigation Cards */}
      <div className={styles.content}>
        <div className={styles.navGrid}>
          <NavCard
            icon="📊"
            title="Dashboard"
            description="View top performers, records, and recent activity"
            to={user ? "/dashboard" : "/login"}
          />
          <NavCard
            icon="⚽"
            title="Player Performance"
            description="Track player scores, goals, and compare statistics"
            to={user ? "/player-performance" : "/login"}
          />
          <NavCard
            icon="🧤"
            title="Goalkeeper Performance"
            description="Track goalkeeper scores, saves, and compare statistics"
            to={user ? "/keeper-performance" : "/login"}
          />
          <NavCard
            icon="📝"
            title="Scoring Method"
            description="Learn how scores are calculated with time-weighted system"
            to="/scoring-method"
          />
        </div>
        
        {/* Login button for unauthenticated users */}
        {!user && (
          <NavCard
            icon="🔐"
            title="Login"
            description="Sign in to access the full dashboard and statistics"
            onClick={handleLoginClick}
            variant="login"
          />
        )}
      </div>
    </div>
  )
}

export default Home
