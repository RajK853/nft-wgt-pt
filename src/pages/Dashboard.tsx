import { useEffect, useState, useCallback } from 'react'
import styles from './Dashboard.module.css'

interface DashboardData {
  totalGames: number
  activePlayers: number
  averageScore: number
  recentActivity: string[]
}

function Dashboard() {
  const [isLoading, setIsLoading] = useState(true)
  const [hasError, setHasError] = useState(false)
  const [data, setData] = useState<DashboardData | null>(null)
  const [retryCount, setRetryCount] = useState(0)

  const fetchData = useCallback(async () => {
    setIsLoading(true)
    setHasError(false)
    
    try {
      // Simulate realistic data fetching with different delays
      const delay = Math.random() * 1000 + 500 // 500ms to 1500ms
      await new Promise(resolve => setTimeout(resolve, delay))
      
      // Simulate occasional failures
      if (Math.random() < 0.1 && retryCount < 3) { // 10% chance of failure, max 3 retries
        throw new Error('Network timeout')
      }
      
      // Mock data
      const mockData: DashboardData = {
        totalGames: Math.floor(Math.random() * 1000) + 100,
        activePlayers: Math.floor(Math.random() * 500) + 50,
        averageScore: Math.floor(Math.random() * 100) + 50,
        recentActivity: [
          'Player123 scored 85 points',
          'New game session started',
          'Leaderboard updated',
          'Daily challenge completed'
        ]
      }
      
      setData(mockData)
    } catch (error) {
      console.error('Failed to fetch dashboard data:', error)
      setHasError(true)
    } finally {
      setIsLoading(false)
    }
  }, [retryCount])

  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
    fetchData()
  }, [fetchData])

  const handleRetry = () => {
    setRetryCount(prev => prev + 1)
    fetchData()
  }

  if (isLoading) {
    return (
      <div className={styles.container}>
        <div className={styles.loading}>
          <div className={styles.spinner}></div>
          <p className={styles.loadingText}>Loading Game Statistics...</p>
        </div>
        
        {/* Skeleton loading for content */}
        <div className={styles.skeletonContainer}>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
          <div className={styles.skeletonCard}>
            <div className={styles.skeletonHeader}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
            <div className={styles.skeletonLine}></div>
          </div>
        </div>
      </div>
    )
  }

  if (hasError) {
    return (
      <div className={styles.container}>
        <div className={styles.errorState}>
          <div className={styles.errorIcon}>⚠️</div>
          <h2 className={styles.errorTitle}>Unable to Load Statistics</h2>
          <p className={styles.errorMessage}>
            We're having trouble loading your game statistics. This might be due to a network issue or server problem. 
            Please check your connection and try again.
          </p>
          <button 
            className={styles.retryButton}
            onClick={handleRetry}
            disabled={retryCount >= 3}
          >
            {retryCount >= 3 ? 'Max Retries Reached' : 'Try Again'}
          </button>
          {retryCount > 0 && (
            <p style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '1rem' }}>
              Retry attempt {retryCount} of 3
            </p>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Game Statistics</h1>
      <div style={{ marginBottom: '2rem' }}>
        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
          gap: '1.5rem',
          marginBottom: '2rem'
        }}>
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#a855f7' }}>
              {data?.totalGames.toLocaleString()}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Total Games
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#3b82f6' }}>
              {data?.activePlayers.toLocaleString()}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Active Players
            </div>
          </div>
          
          <div style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '0.75rem',
            padding: '1.5rem',
            textAlign: 'center'
          }}>
            <div style={{ fontSize: '2rem', fontWeight: 'bold', color: '#22c55e' }}>
              {data?.averageScore}
            </div>
            <div style={{ color: '#94a3b8', fontSize: '0.875rem', marginTop: '0.5rem' }}>
              Average Score
            </div>
          </div>
        </div>
        
        <div style={{
          background: 'rgba(255, 255, 255, 0.05)',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          borderRadius: '0.75rem',
          padding: '1.5rem'
        }}>
          <h3 style={{ margin: '0 0 1rem 0', color: '#ffffff' }}>Recent Activity</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
            {data?.recentActivity.map((activity, index) => (
              <li 
                key={index}
                style={{
                  padding: '0.75rem',
                  borderBottom: index < data.recentActivity.length - 1 ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
                  color: '#cbd5e1'
                }}
              >
                {activity}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
