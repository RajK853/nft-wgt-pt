import { useEffect, useMemo, useState } from 'react'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import {
  calculateKeeperScores,
  filterByMonth,
  getUniqueMonths,
  getUniqueKeepers,
  getKeeperOutcomeDistribution
} from '@/lib/analysis'
import { BarChart, PieChart } from '@/components/charts'
import { DataTable, Tabs, InfoBox, LoadingSpinner } from '@/components/ui'
import { SelectWithLabel as Select } from '@/components/ui/select'
import { Scoring } from '@/types'
import { KEEPER_STATS_COLUMNS, CHART_NAME_MAX_LENGTH } from '@/lib/constants'
import { truncateName } from '@/lib/utils'
import { useTableSort } from '@/hooks/useTableSort'
// Intentionally reuses PlayerPerformance styles — shared layout
import styles from './PlayerPerformance.module.css'

const OUTCOME_TABS = [
  { id: 'saves', label: 'Save Rate' },
  { id: 'goals', label: 'Goal Rate' },
  { id: 'out', label: 'Out Rate' }
]

export default function KeeperPerformance() {
  const { data, loading, error } = usePenaltyData()

  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedKeeperForPie, setSelectedKeeperForPie] = useState<string>('')
  const { sortKey: tableSortKey, sortDirection: tableSortDirection, handleSort: handleTableSort } = useTableSort()

  useEffect(() => {
    document.title = 'Goalkeeper Performance - NFT Weingarten'
  }, [])

  const monthOptions = useMemo(() => getUniqueMonths(data), [data])
  const keeperOptions = useMemo(() => getUniqueKeepers(data), [data])

  const filteredData = useMemo(() => {
    if (!selectedMonth) return data
    return filterByMonth(data, selectedMonth)
  }, [data, selectedMonth])

  const keeperScores = useMemo(() => calculateKeeperScores(filteredData), [filteredData])

  const sortedKeeperScores = useMemo(() => [...keeperScores].sort((a, b) => {
    const aVal = a[tableSortKey as keyof typeof a]
    const bVal = b[tableSortKey as keyof typeof b]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return tableSortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return tableSortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return 0
  }), [keeperScores, tableSortKey, tableSortDirection])

  const top10Keepers = useMemo(() => sortedKeeperScores.slice(0, 10), [sortedKeeperScores])

  const leaderboardChartData = useMemo(() =>
    top10Keepers.map(k => ({
      name: truncateName(k.name, CHART_NAME_MAX_LENGTH),
      value: k.score,
      score: k.score,
      saves: k.saves
    })),
    [top10Keepers]
  )

  const pieChartData = useMemo(() => {
    if (!selectedKeeperForPie) return []
    return getKeeperOutcomeDistribution(filteredData, selectedKeeperForPie).map(d => ({
      name: d.status === 'saved' ? 'Saved' : d.status === 'goal' ? 'Goal' : 'Out',
      value: d.count,
      percentage: d.percentage
    }))
  }, [filteredData, selectedKeeperForPie])

  const saveRate = useMemo(() => {
    if (!selectedKeeperForPie) return null
    const distribution = getKeeperOutcomeDistribution(filteredData, selectedKeeperForPie)
    const saved = distribution.find(d => d.status === 'saved')
    const goal = distribution.find(d => d.status === 'goal')
    if (!saved || !goal) return null
    const total = saved.count + goal.count
    return total > 0 ? Math.round((saved.count / total) * 100) : 0
  }, [filteredData, selectedKeeperForPie])

  if (loading) return <LoadingSpinner />

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
            <BarChart data={leaderboardChartData} height={300} dataKeys={['score']} />
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
                <PieChart data={pieChartData} height={300} />
              </div>

              {saveRate !== null && (
                <InfoBox>
                  <p>
                    <strong>{selectedKeeperForPie}</strong> has a save rate of <strong>{saveRate}%</strong>
                    {' '}when facing shots on target (excluding shots that went out).
                  </p>
                </InfoBox>
              )}

              <Tabs tabs={OUTCOME_TABS} defaultTab="saves">
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
