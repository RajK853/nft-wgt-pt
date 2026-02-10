import { useEffect } from 'react'
import styles from './Dashboard.module.css'

function Dashboard() {
  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
  }, [])

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Statistics</h1>
      <p className={styles.text}>Dashboard content coming soon...</p>
    </div>
  )
}

export default Dashboard
