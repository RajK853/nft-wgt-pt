import { useEffect } from 'react'
import styles from './Home.module.css'

function Home() {
  useEffect(() => {
    document.title = 'NFT Weingarten - Penalty Tracker'
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.content}>
        {/* Logo Container */}
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
        
        {/* Title and Subtitle */}
        <div className={styles.titleSection}>
          <h1 className={styles.title}>NFT Weingarten</h1>
          <p className={styles.subtitle}>Penalty Tracker</p>
        </div>
        
        {/* Status Indicator */}
        <div className={styles.statusIndicator}>
          <div className={styles.statusDot}></div>
          <span>System Online</span>
        </div>
      </div>
    </div>
  )
}

export default Home
