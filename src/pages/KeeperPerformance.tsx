/**
 * Goalkeeper Performance Page
 * Keeper score leaderboard and comparison over time
 */

import { useEffect, useMemo, useState } from 'react'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import { 
  calculateKeeperScores, 
  filterByMonth, 
  getUniqueMonths,
  getKeeperOutcomeDistribution
} from '@/lib/analysis'
import { BarChart, PieChart } from '@/components/charts'
import { DataTable, Tabs, InfoBox, LoadingSpinner } from '@/components/ui'
import { SelectWithLabel as Select } from '@/components/ui/select'
import { Scoring } from '@/types'
import styles from './PlayerPerformance.module.css'

// Table columns for keeper stats
const KEEPER_STATS_COLUMNS = [
  { key: 'name', header: 'Goalkeeper', sortable: true },
  { key: 'score', header: 'Score', sortable: true },
  { key: 'saves', header: 'Saves', sortable: true },
  { key: 'goalsConceded', header: 'Goals Conceded', sortable: true },
  { key: 'outs', header: 'Out', sortable: true }
]

// Tab options for outcome distribution
const OUTCOME_TABS = [
  { id: 'saves', label: 'Save Rate' },
  { id: 'goals', label: 'Goal Rate' },
  { id: 'out', label: 'Out Rate' }
]

export default function KeeperPerformance() {
  const { data, loading, error } = usePenaltyData()
  
  // Filter state
  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedKeeperForPie, setSelectedKeeperForPie] = useState<string>('')

  // Table sorting state
  const [tableSortKey, setTableSortKey] = useState<string>('score')
  const [tableSortDirection, setTableSortDirection] = useState<'asc' | 'desc'>('desc')

  useEffect(() => {
    document.title = 'Goalkeeper Performance - NFT Weingarten'
  }, [])

  // Get all unique months for filtering
  const monthOptions = useMemo(() => {
    return getUniqueMonths(data)
  }, [data])

  // Get all unique keepers
  const keeperOptions = useMemo(() => {
    const keepers = new Set<string>()
    data.forEach(r => keepers.add(r.keeperName))
    return Array.from(keepers).sort()
  }, [data])

  // Filter data by month if selected
  const filteredData = useMemo(() => {
    if (!selectedMonth) return data
    return filterByMonth(data, selectedMonth)
  }, [data, selectedMonth])

  // Calculate keeper scores
  const keeperScores = useMemo(() => {
    return calculateKeeperScores(filteredData)
  }, [filteredData])

  // Sort keeper scores based on table sorting
  const sortedKeeperScores = useMemo(() => {
    const sorted = [...keeperScores].sort((a, b) => {
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
  }, [keeperScores, tableSortKey, tableSortDirection])

  // Get top 10 keepers for leaderboard
  const top10Keepers = useMemo(() => {
    return sortedKeeperScores.slice(0, 10)
  }, [sortedKeeperScores])

  // Chart data for leaderboard
  const leaderboardChartData = useMemo(() => {
    return top10Keepers.map(k => ({
      name: k.name.length > 12 ? k.name.substring(0, 12) + '...' : k.name,
      value: k.score,
      score: k.score,
      saves: k.saves
    }))
  }, [top10Keepers])

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

  // Pie chart data for selected keeper
  const pieChartData = useMemo(() => {
    if (!selectedKeeperForPie) return []
    
    const distribution = getKeeperOutcomeDistribution(filteredData, selectedKeeperForPie)
    
    return distribution.map(d => ({
      name: d.status === 'saved' ? 'Saved' : d.status === 'goal' ? 'Goal' : 'Out',
      value: d.count,
      percentage: d.percentage
    }))
  }, [filteredData, selectedKeeperForPie])

  // Calculate save rate percentage for display
  const saveRate = useMemo(() => {
    if (!selectedKeeperForPie) return null
    
    const distribution = getKeeperOutcomeDistribution(filteredData, selectedKeeperForPie)
    const saved = distribution.find(d => d.status === 'saved')
    const goal = distribution.find(d => d.status === 'goal')
    
    if (!saved || !goal) return null
    
    const total = saved.count + goal.count
    return total > 0 ? Math.round((saved.count / total) * 100) : 0
  }, [filteredData, selectedKeeperForPie])

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
        <h1 className={styles.title}>Goalkeeper Performance</h1>
        <p className={styles.subtitle}>Track and compare goalkeeper statistics over time</p>
      </div>

      {/* Goalkeeper Score Leaderboard Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Goalkeeper Score Leaderboard</h2>
        
        <InfoBox>
          <p>
            Scores are weighted by half-life ({Scoring.PERFORMANCE_HALF_LIFE_DAYS} days). 
            Recent games count more than older games. A higher score means more saves and fewer goals conceded.
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
              data={top10Keepers}
              columns={KEEPER_STATS_COLUMNS}
              sortKey={tableSortKey}
              sortDirection={tableSortDirection}
              onSort={handleTableSort}
            />
          </div>
        </div>
      </section>

      {/* Outcome Distribution Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Goalkeeper Outcome Distribution</h2>
        
        <div className={styles.comparisonSection}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <Select
                label="Select Goalkeeper"
                value={selectedKeeperForPie || '__select__'}
                onChange={(val) => setSelectedKeeperForPie(val === '__select__' ? '' : val)}
                options={[{ value: '__select__', label: 'Select a goalkeeper...' }, ...keeperOptions.map(k => ({ value: k, label: k }))]}
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

          {selectedKeeperForPie && pieChartData.length > 0 ? (
            <div className={styles.tabsContainer}>
              <div className={styles.comparisonChart}>
                <PieChart 
                  data={pieChartData}
                  height={300}
                />
              </div>
              
              {saveRate !== null && (
                <InfoBox>
                  <p>
                    <strong>{selectedKeeperForPie}</strong> has a save rate of <strong>{saveRate}%</strong> 
                    {' '}when facing shots on target (excluding shots that went out).
                  </p>
                </InfoBox>
              )}
              
              <Tabs
                tabs={OUTCOME_TABS}
                defaultTab="saves"
              >
                {(activeTab) => {
                  const outcome = pieChartData.find(d => 
                    (activeTab === 'saves' && d.name === 'Saved') ||
                    (activeTab === 'goals' && d.name === 'Goal') ||
                    (activeTab === 'out' && d.name === 'Out')
                  )
                  return (
                    <p className={styles.description}>
                      {activeTab === 'saves' && `Save Rate: ${outcome?.percentage || 0}%`}
                      {activeTab === 'goals' && `Goal Rate: ${outcome?.percentage || 0}%`}
                      {activeTab === 'out' && `Out Rate: ${outcome?.percentage || 0}%`}
                    </p>
                  )
                }}
              </Tabs>
            </div>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>📊</div>
              <div className={styles.noDataText}>
                Select a goalkeeper above to see their outcome distribution
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
