/**
 * Player Performance Page
 * Player score leaderboard and comparison over time
 */

import { useEffect, useMemo, useState } from 'react'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import { 
  calculatePlayerScores, 
  filterByMonth, 
  getUniqueMonths,
  getUniquePlayers
} from '@/lib/analysis'
import { BarChart } from '@/components/charts'
import { DataTable, MultiSelect, Tabs, InfoBox, LoadingSpinner } from '@/components/ui'
import { SelectWithLabel as Select } from '@/components/ui/select'
import { Scoring } from '@/types'
import styles from './PlayerPerformance.module.css'

// Table columns for player stats
const PLAYER_STATS_COLUMNS = [
  { key: 'name', header: 'Player', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
  { key: 'goals', header: 'Goals', sortable: true },
  { key: 'saved', header: 'Saved', sortable: true },
  { key: 'out', header: 'Out', sortable: true }
]

// Tab options for comparison view
const COMPARISON_TABS = [
  { id: 'score', label: 'Score' },
  { id: 'goals', label: 'Goals' },
  { id: 'saved', label: 'Saved' },
  { id: 'out', label: 'Out' }
]

export default function PlayerPerformance() {
  const { data, loading, error } = usePenaltyData()
  
  // Filter state
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('score')

  // Table sorting state
  const [tableSortKey, setTableSortKey] = useState<string>('score')
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    document.title = 'Player Performance - NFT Weingarten'
  }, [])

  // Get all unique months for filtering
  const monthOptions = useMemo(() => {
    return getUniqueMonths(data)
  }, [data])

  // Get all unique players
  const playerOptions = useMemo(() => {
    return getUniquePlayers(data)
  }, [data])

  // Filter data by month if selected
  const filteredData = useMemo(() => {
    if (!selectedMonth) return data
    return filterByMonth(data, selectedMonth)
  }, [data, selectedMonth])

  // Calculate player scores
  const playerScores = useMemo(() => {
    return calculatePlayerScores(filteredData)
  }, [filteredData])

  // Sort player scores based on table sorting
  const sortedPlayerScores = useMemo(() => {
    const sorted = [...playerScores].sort((a, b) => {
      const aVal = a[tableSortKey as keyof typeof a]
      const bVal = b[tableSortKey as keyof typeof b]
      
      if (typeof aVal === 'number' && typeof bVal === 'number') {
        return tableSortDirection === 'asc' ? aVal - bVal : bVal - aVal
      }
      
      if (typeof aVal === 'string' && typeof bVal === 'string') {
        return tableSortDirection === 'asc' 
          ? aVal.localeCompare(bVal) 
          : bVal.localeCompare(aVal)
      }
      
      return 0
    })
    return sorted
  }, [playerScores, tableSortKey, tableSortDirection])

  // Get top 10 players for leaderboard
  const top10Players = useMemo(() => {
    return sortedPlayerScores.slice(0, 10)
  }, [sortedPlayerScores])

  // Chart data for leaderboard
  const leaderboardChartData = useMemo(() => {
    return top10Players.map(p => ({
      name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
      score: p.score,
      goals: p.goals
    }))
  }, [top10Players])

  // Handle table sorting
  const handleTableSort = (key: string) => {
    if (tableSortKey === key) {
      // Toggle direction if same key
      setTableSortDirection(prev => prev === 'asc' ? 'desc' : 'asc')
    } else {
      // New key - default to descending for numeric, ascending for strings
      setTableSortKey(key)
      setTableSortDirection('desc')
    }
  }

  // Comparison data - filter selected players
  const comparisonData = useMemo(() => {
    if (selectedPlayers.length === 0) return []
    
    return playerScores.filter(p => selectedPlayers.includes(p.name))
  }, [playerScores, selectedPlayers])

  // Determine color based on value (green for best, red for worst)
  const getComparisonChartData = () => {
    if (comparisonData.length === 0) return []
    
    const values = comparisonData.map(p => p[activeTab as keyof typeof p] as number)
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    return comparisonData.map(p => {
      const value = p[activeTab as keyof typeof p] as number
      let color = '#a855f7' // default purple
      
      if (max !== min) {
        // Green for best, red for worst
        if (value === max) {
          color = '#22c55e' // green
        } else if (value === min) {
          color = '#ef4444' // red
        }
      }
      
      return {
        name: p.name.length > 12 ? p.name.substring(0, 12) + '...' : p.name,
        value: value,
        fill: color
      }
    })
  }

  if (loading) {
    return <LoadingSpinner />
  }

  if (error) {
    return (
      <div className={styles.container}>
        <div className={styles.noData}>
          <div className={styles.noDataIcon}>⚠️</div>
          <div className={styles.noDataText}>Error loading data: {error.message}</div>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Player Performance</h1>
        <p className={styles.subtitle}>Track and compare player statistics over time</p>
      </div>

      {/* Player Score Leaderboard Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Player Score Leaderboard</h2>
        
        <InfoBox>
          <p>
            Scores are weighted by half-life ({Scoring.PERFORMANCE_HALF_LIFE_DAYS} days). 
            Recent games count more than older games. 
            <a href="/scoring-method" className="text-purple-400 hover:underline ml-1">
              Visit Scoring Method page for details
            </a>
          </p>
        </InfoBox>
        
        <div className={styles.leaderboardSection}>
          <div className={styles.chartContainer}>
            <BarChart 
              data={leaderboardChartData}
              height={300}
              dataKeys={['score']}
            />
          </div>
          
          <div className={styles.tableContainer}>
            <DataTable 
              data={top10Players}
              columns={PLAYER_STATS_COLUMNS}
              sortKey={tableSortKey}
              sortDirection={tableSortDirection}
              onSort={handleTableSort}
            />
          </div>
        </div>
      </section>

      {/* Compare Player Performance Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Compare Player Performance Over Time</h2>
        
        <div className={styles.comparisonSection}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <MultiSelect
                label="Select Players"
                value={selectedPlayers}
                onChange={setSelectedPlayers}
                options={playerOptions}
                max={10}
                placeholder="Select up to 10 players..."
              />
            </div>
            
            <div className={styles.control}>
              <Select
                label="Select Month"
                value={selectedMonth || '__all__'}
                onChange={(val) => setSelectedMonth(val === '__all__' ? '' : val)}
                options={[{ value: '__all__', label: 'All Time' }, ...monthOptions.map(m => ({ value: m.value, label: m.label }))]}
              />
            </div>
          </div>

          {selectedPlayers.length > 0 ? (
            <>
              <Tabs
                tabs={COMPARISON_TABS}
                defaultTab="score"
              >
                {(activeTab) => {
                  setActiveTab(activeTab)
                  const chartData = getComparisonChartData()
                  return (
                    <div className={styles.tabsContainer}>
                      <div className={styles.comparisonChart}>
                        <BarChart 
                          data={chartData}
                          height={300}
                          layout="vertical"
                          dataKeys={['value']}
                          colors={chartData.map(d => d.fill || '#94a3b8')}
                          colorCoding="custom"
                        />
                      </div>
                      <p className={styles.description}>
                        {activeTab === 'score' && 'Comparing overall scores (green = best, red = worst)'}
                        {activeTab === 'goals' && 'Comparing total goals scored'}
                        {activeTab === 'saved' && 'Comparing total saves'}
                        {activeTab === 'out' && 'Comparing total shots missed'}
                      </p>
                    </div>
                  )
                }}
              </Tabs>
            </>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>👆</div>
              <div className={styles.noDataText}>
                Select players above to compare their performance
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
