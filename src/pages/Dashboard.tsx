import { useEffect, useState } from 'react'
import styles from './Dashboard.module.css'

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
    
    // Simulate data loading
    const timer = setTimeout(() => setIsLoading(false), 1000)
    return () => clearTimeout(timer)
  }, [])

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p>Loading statistics...</p>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Statistics</h1>
      <p className={styles.text}>Dashboard content coming soon...</p>
    </div>
  )
}

export default Dashboard
