/**
 * Dashboard Page
 * Main dashboard with Top Performers, Hall of Fame, and Recent Activity
 * Follows the reimplementation plan layout
 */

import { useEffect, useState, useMemo, useCallback } from 'react'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import { 
  calculatePlayerScores, 
  calculateKeeperScores,
  getTopPlayer,
  getTopKeeper,
  getMostGoalsInSession,
  getMostSavesInSession,
  getLongestGoalStreak,
  getBiggestRivalry,
  getMarathonMan,
  getMysteriousNinja,
  getBusiestDay,
  getRecentSession
} from '@/lib/analysis'
import { MetricCard, Tabs, DataTable, LoadingSpinner, RevealButton } from '@/components/ui'
import { BarChart, PieChart } from '@/components/charts'
import styles from './Dashboard.module.css'

// Table columns for player/keeper stats
const PLAYER_STATS_COLUMNS = [
  { key: 'name', header: 'Player', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
  { key: 'goals', header: 'Goals', sortable: true },
  { key: 'saved', header: 'Saved', sortable: true },
  { key: 'out', header: 'Out', sortable: true }
]

const KEEPER_STATS_COLUMNS = [
  { key: 'name', header: 'Goalkeeper', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
  { key: 'saves', header: 'Saves', sortable: true },
  { key: 'goalsConceded', header: 'Conceded', sortable: true },
  { key: 'outs', header: 'Out', sortable: true }
]

function Dashboard() {
  const { data, loading, error } = usePenaltyData()
  
  // Reveal states
  const [revealedTop10, setRevealedTop10] = useState(false)
  const [revealedTopPlayer, setRevealedTopPlayer] = useState(false)
  const [revealedTopKeeper, setRevealedTopKeeper] = useState(false)

  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
  }, [])

  // Calculate data
  const playerScores = useMemo(() => calculatePlayerScores(data), [data])
  const keeperScores = useMemo(() => calculateKeeperScores(data), [data])
  const topPlayer = useMemo(() => getTopPlayer(data), [data])
  const topKeeper = useMemo(() => getTopKeeper(data), [data])
  const top10Players = useMemo(() => playerScores.slice(0, 10), [playerScores])
  
  // Hall of Fame data
  const hallOfFame = useMemo(() => ({
    mostGoals: getMostGoalsInSession(data),
    mostSaves: getMostSavesInSession(data),
    longestStreak: getLongestGoalStreak(data),
    biggestRivalry: getBiggestRivalry(data),
    marathonMan: getMarathonMan(data),
    mysteriousNinja: getMysteriousNinja(data),
    busiestDay: getBusiestDay(data)
  }), [data])
  
  // Recent session
  const recentSession = useMemo(() => getRecentSession(data), [data])
  
  // Prepare chart data for top 10
  const chartData = useMemo(() => 
    top10Players.map(p => ({
      name: p.name.length > 10 ? p.name.substring(0, 10) + '...' : p.name,
      score: p.score,
      goals: p.goals
    })),
    [top10Players]
  )
  
  // Prepare pie chart data for recent session
  const recentPieData = useMemo(() => {
    if (!recentSession) return []
    return [
      { name: 'Goals', value: recentSession.goals },
      { name: 'Saves', value: recentSession.saves },
      { name: 'Out', value: recentSession.outs }
    ]
  }, [recentSession])

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <div className="text-red-400">Error loading data</div>
        <div className="text-gray-500 text-sm mt-2">{error.message}</div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Dashboard</h1>
      
      {/* TOP PERFORMERS SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏆 Top Performers</h2>
        
        <div className={styles.topPerformersGrid}>
          {/* Top 10 Players */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🔟 Top-10 Players</h3>
            <RevealButton 
              label="Reveal Top-10" 
              onReveal={() => setRevealedTop10(true)}
              variant="primary"
            />
            {revealedTop10 && top10Players.length > 0 && (
              <div className={styles.revealedContent}>
                <BarChart 
                  data={chartData} 
                  height={250}
                />
                <DataTable 
                  data={top10Players}
                  columns={PLAYER_STATS_COLUMNS}
                  sortKey="score"
                  sortDirection="desc"
                />
              </div>
            )}
          </div>
          
          {/* Top Player */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>👤 Top Player</h3>
            <RevealButton 
              label="Reveal Player" 
              onReveal={() => setRevealedTopPlayer(true)}
              variant="success"
            />
            {revealedTopPlayer && topPlayer && (
              <div className={styles.revealedContent}>
                <MetricCard
                  label={topPlayer.name}
                  value={topPlayer.score.toFixed(2)}
                  delta={`${topPlayer.goals} goals • ${topPlayer.saved} saved • ${topPlayer.out} out`}
                  variant="success"
                />
              </div>
            )}
          </div>
          
          {/* Top Keeper */}
          <div className={styles.card}>
            <h3 className={styles.cardTitle}>🧤 Top Goalkeeper</h3>
            <RevealButton 
              label="Reveal Keeper" 
              onReveal={() => setRevealedTopKeeper(true)}
              variant="secondary"
            />
            {revealedTopKeeper && topKeeper && (
              <div className={styles.revealedContent}>
                <MetricCard
                  label={topKeeper.name}
                  value={topKeeper.score.toFixed(2)}
                  delta={`${topKeeper.saves} saves • ${topKeeper.goalsConceded} conceded`}
                  variant="success"
                />
              </div>
            )}
          </div>
        </div>
      </section>

      {/* HALL OF FAME SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏅 Hall of Fame</h2>
        
        <Tabs
          tabs={[
            { id: 'single', label: 'Single Session' },
            { id: 'alltime', label: 'All-Time Records' },
            { id: 'funfacts', label: 'Fun Facts' }
          ]}
          defaultTab="single"
        >
          {(activeTab) => (
            <div className={styles.hallOfFameContent}>
              {activeTab === 'single' && (
                <div className={styles.recordsGrid}>
                  <MetricCard
                    label="Most Goals in Session"
                    value={hallOfFame.mostGoals?.playerName || 'N/A'}
                    delta={hallOfFame.mostGoals ? `${hallOfFame.mostGoals.goals} goals on ${hallOfFame.mostGoals.date.toLocaleDateString()}` : 'No data'}
                    variant="success"
                  />
                  <MetricCard
                    label="Most Saves in Session"
                    value={hallOfFame.mostSaves?.keeperName || 'N/A'}
                    delta={hallOfFame.mostSaves ? `${hallOfFame.mostSaves.saves} saves on ${hallOfFame.mostSaves.date.toLocaleDateString()}` : 'No data'}
                    variant="default"
                  />
                </div>
              )}
              
              {activeTab === 'alltime' && (
                <div className={styles.recordsGrid}>
                  <MetricCard
                    label="Longest Goal Streak"
                    value={hallOfFame.longestStreak?.playerName || 'N/A'}
                    delta={hallOfFame.longestStreak ? `${hallOfFame.longestStreak.streak} consecutive goals` : 'No data'}
                    variant="success"
                  />
                  <MetricCard
                    label="Biggest Rivalry"
                    value={hallOfFame.biggestRivalry ? `${hallOfFame.biggestRivalry.shooterName} vs ${hallOfFame.biggestRivalry.keeperName}` : 'N/A'}
                    delta={hallOfFame.biggestRivalry ? `${hallOfFame.biggestRivalry.encounters} encounters` : 'No data'}
                    variant="default"
                  />
                </div>
              )}
              
              {activeTab === 'funfacts' && (
                <div className={styles.recordsGrid}>
                  <MetricCard
                    label="Marathon Man"
                    value={hallOfFame.marathonMan?.playerName || 'N/A'}
                    delta={hallOfFame.marathonMan ? `${hallOfFame.marathonMan.sessionCount} sessions played` : 'No data'}
                    variant="success"
                  />
                  <MetricCard
                    label="Mysterious Ninja"
                    value={hallOfFame.mysteriousNinja?.playerName || 'N/A'}
                    delta={hallOfFame.mysteriousNinja ? `Only ${hallOfFame.mysteriousNinja.sessionCount} session(s)` : 'No data'}
                    variant="default"
                  />
                  <MetricCard
                    label="Busiest Day"
                    value={hallOfFame.busiestDay ? hallOfFame.busiestDay.date.toLocaleDateString() : 'N/A'}
                    delta={hallOfFame.busiestDay ? `${hallOfFame.busiestDay.penaltyCount} penalties` : 'No data'}
                    variant="default"
                  />
                </div>
              )}
            </div>
          )}
        </Tabs>
      </section>

      {/* RECENT ACTIVITY SECTION */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>📊 Recent Activity</h2>
        
        {recentSession && (
          <div className={styles.recentHeader}>
            <span className={styles.recentDate}>
              Latest Session: {recentSession.date.toLocaleDateString()}
            </span>
          </div>
        )}
        
        <div className={styles.recentMetrics}>
          <MetricCard
            label="Goals"
            value={recentSession?.goals || 0}
            variant="success"
          />
          <MetricCard
            label="Saves"
            value={recentSession?.saves || 0}
            variant="default"
          />
          <MetricCard
            label="Out"
            value={recentSession?.outs || 0}
            variant="warning"
          />
        </div>
        
        <Tabs
          tabs={[
            { id: 'players', label: 'Player Stats' },
            { id: 'keepers', label: 'Keeper Stats' }
          ]}
          defaultTab="players"
        >
          {(activeTab) => (
            <div className={styles.statsContent}>
              {activeTab === 'players' && playerScores.length > 0 && (
                <>
                  <BarChart 
                    data={chartData}
                    height={200}
                  />
                  <DataTable 
                    data={playerScores.slice(0, 10)}
                    columns={PLAYER_STATS_COLUMNS}
                    sortKey="score"
                    sortDirection="desc"
                  />
                </>
              )}
              {activeTab === 'keepers' && keeperScores.length > 0 && (
                <>
                  <div className={styles.keeperCharts}>
                    {keeperScores.slice(0, 3).map(keeper => (
                      <div key={keeper.name} className={styles.keeperChart}>
                        <h4 className={styles.keeperName}>{keeper.name}</h4>
                        <PieChart 
                          data={[
                            { name: 'Conceded', value: keeper.goalsConceded },
                            { name: 'Saved', value: keeper.saves },
                            { name: 'Out', value: keeper.outs }
                          ]}
                          height={180}
                        />
                      </div>
                    ))}
                  </div>
                  <DataTable 
                    data={keeperScores.slice(0, 10)}
                    columns={KEEPER_STATS_COLUMNS}
                    sortKey="score"
                    sortDirection="desc"
                  />
                </>
              )}
            </div>
          )}
        </Tabs>
      </section>
    </div>
  )
}

export default Dashboard
