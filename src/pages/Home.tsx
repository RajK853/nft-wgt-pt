import { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { SkipLink } from '@/components/ui'
import styles from './Home.module.css'

interface NavCardProps {
  icon: string
  title: string
  description: string
  to: string
}

function NavCard({ icon, title, description, to }: NavCardProps) {
  return (
    <Link to={to} className={styles.navCard}>
      <span className={styles.navCardIcon}>{icon}</span>
      <div className={styles.navCardContent}>
        <h3 className={styles.navCardTitle}>{title}</h3>
        <p className={styles.navCardDescription}>{description}</p>
      </div>
      <span className={styles.navCardArrow}>→</span>
    </Link>
  )
}

function Home() {
  useEffect(() => {
    document.title = 'NFT Weingarten - Penalty Tracker'
  }, [])

  return (
    <div className={styles.container}>
      <SkipLink />
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
      <main id="main-content">
      <div className={styles.content}>
        <div className={styles.navGrid}>
          <NavCard
            icon="📊"
            title="Dashboard"
            description="View top performers, records, and recent activity"
            to="/dashboard"
          />
          <NavCard
            icon="⚽"
            title="Player Performance"
            description="Track player scores, goals, and compare statistics"
            to="/player-performance"
          />
          <NavCard
            icon="🧤"
            title="Goalkeeper Performance"
            description="Track goalkeeper scores, saves, and compare statistics"
            to="/keeper-performance"
          />
          <NavCard
            icon="📝"
            title="Scoring Method"
            description="Learn how scores are calculated with time-weighted system"
            to="/scoring-method"
          />
        </div>
      </div>
      </main>
    </div>
  )
}

export default Home
