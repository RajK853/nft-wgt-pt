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
import { DataTable, MultiSelect, Select, Tabs, InfoBox, LoadingSpinner } from '@/components/ui'
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

// Tab options for comparison view
const COMPARISON_TABS = [
  { id: 'score', label: 'Score' },
  { id: 'saves', label: 'Saves' },
  { id: 'goalsConceded', label: 'Goals Conceded' },
  { id: 'outs', label: 'Out' }
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
  const [selectedKeepers, setSelectedKeepers] = useState<string[]>([])
  const [activeTab, setActiveTab] = useState<string>('score')
  const [selectedKeeperForPie, setSelectedKeeperForPie] = useState<string>('')

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

  // Get top 10 keepers for leaderboard
  const top10Keepers = useMemo(() => {
    return keeperScores.slice(0, 10)
  }, [keeperScores])

  // Chart data for leaderboard
  const leaderboardChartData = useMemo(() => {
    return top10Keepers.map(k => ({
      name: k.name.length > 12 ? k.name.substring(0, 12) + '...' : k.name,
      score: k.score,
      saves: k.saves
    }))
  }, [top10Keepers])

  // Comparison data - filter selected keepers
  const comparisonData = useMemo(() => {
    if (selectedKeepers.length === 0) return []
    
    return keeperScores.filter(k => selectedKeepers.includes(k.name))
  }, [keeperScores, selectedKeepers])

  // Determine color based on value (green for best, red for worst)
  const getComparisonChartData = () => {
    if (comparisonData.length === 0) return []
    
    // For keeper stats: saves are good, goals conceded are bad
    const values = comparisonData.map(k => k[activeTab as keyof typeof k] as number)
    const max = Math.max(...values)
    const min = Math.min(...values)
    
    return comparisonData.map(k => {
      const value = k[activeTab as keyof typeof k] as number
      let color = '#3b82f6' // default blue
      
      if (max !== min) {
        if (activeTab === 'saves') {
          // More saves is better - green for best
          if (value === max) {
            color = '#22c55e' // green
          } else if (value === min) {
            color = '#ef4444' // red
          }
        } else if (activeTab === 'goalsConceded') {
          // Fewer goals conceded is better - green for lowest
          if (value === min) {
            color = '#22c55e' // green
          } else if (value === max) {
            color = '#ef4444' // red
          }
        } else if (activeTab === 'outs') {
          // More outs is better for keeper
          if (value === max) {
            color = '#22c55e' // green
          } else if (value === min) {
            color = '#ef4444' // red
          }
        } else {
          // Score: higher is better
          if (value === max) {
            color = '#22c55e' // green
          } else if (value === min) {
            color = '#ef4444' // red
          }
        }
      }
      
      return {
        name: k.name.length > 12 ? k.name.substring(0, 12) + '...' : k.name,
        value: value,
        fill: color
      }
    })
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
              colors={['#3b82f6']}
            />
          </div>
          
          <div className={styles.tableContainer}>
            <DataTable 
              data={top10Keepers}
              columns={KEEPER_STATS_COLUMNS}
              sortKey="score"
              sortDirection="desc"
            />
          </div>
        </div>
      </section>

      {/* Compare Goalkeeper Performance Section */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>Compare Goalkeeper Performance</h2>
        
        <div className={styles.comparisonSection}>
          <div className={styles.controls}>
            <div className={styles.control}>
              <MultiSelect
                label="Select Goalkeepers"
                value={selectedKeepers}
                onChange={setSelectedKeepers}
                options={keeperOptions}
                max={10}
                placeholder="Select up to 10 goalkeepers..."
              />
            </div>
            
            <div className={styles.control}>
              <Select
                label="Select Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={[
                  { value: '', label: 'All Time' },
                  ...monthOptions
                ]}
              />
            </div>
          </div>

          {selectedKeepers.length > 0 ? (
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
                          colors={chartData.map(d => d.fill || '#3b82f6')}
                          colorCoding="custom"
                        />
                      </div>
                      <p className={styles.description}>
                        {activeTab === 'score' && 'Comparing overall scores (green = best, red = worst)'}
                        {activeTab === 'saves' && 'Comparing total saves (green = best, red = worst)'}
                        {activeTab === 'goalsConceded' && 'Comparing goals conceded (green = best, red = worst)'}
                        {activeTab === 'outs' && 'Comparing total shots out (green = best, red = worst)'}
                      </p>
                    </div>
                  )
                }}
              </Tabs>
            </>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>🧤</div>
              <div className={styles.noDataText}>
                Select goalkeepers above to compare their performance
              </div>
            </div>
          )}
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
                value={selectedKeeperForPie}
                onChange={setSelectedKeeperForPie}
                options={[
                  { value: '', label: 'Select a goalkeeper...' },
                  ...keeperOptions.map(k => ({ value: k, label: k }))
                ]}
              />
            </div>
            
            <div className={styles.control}>
              <Select
                label="Select Month"
                value={selectedMonth}
                onChange={setSelectedMonth}
                options={[
                  { value: '', label: 'All Time' },
                  ...monthOptions
                ]}
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
