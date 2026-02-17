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
import type { PlayerScore } from '@/types'
import { PLAYER_STATS_COLUMNS, CHART_NAME_MAX_LENGTH } from '@/lib/constants'
import { truncateName } from '@/lib/utils'
import { useTableSort } from '@/hooks/useTableSort'
import styles from './PlayerPerformance.module.css'

const COMPARISON_TABS = [
  { id: 'score', label: 'Score' },
  { id: 'goals', label: 'Goals' },
  { id: 'saved', label: 'Saved' },
  { id: 'out', label: 'Out' }
]

type ComparisonKey = 'score' | 'goals' | 'saved' | 'out'

const COMPARISON_DESCRIPTIONS: Record<ComparisonKey, string> = {
  score: 'Comparing overall scores (green = best, red = worst)',
  goals: 'Comparing total goals scored',
  saved: 'Comparing total saves',
  out: 'Comparing total shots missed',
}

function buildComparisonChartData(players: PlayerScore[], metric: ComparisonKey) {
  if (players.length === 0) return []

  const values = players.map(p => p[metric] as number)
  const max = Math.max(...values)
  const min = Math.min(...values)

  return players.map(p => {
    const value = p[metric] as number
    let color = '#a855f7'
    if (max !== min) {
      if (value === max) color = '#22c55e'
      else if (value === min) color = '#ef4444'
    }
    return {
      name: truncateName(p.name, CHART_NAME_MAX_LENGTH),
      value,
      score: value,
      fill: color,
    }
  })
}

export default function PlayerPerformance() {
  const { data, loading, error } = usePenaltyData()

  const [selectedMonth, setSelectedMonth] = useState<string>('')
  const [selectedPlayers, setSelectedPlayers] = useState<string[]>([])
  const { sortKey: tableSortKey, sortDirection: tableSortDirection, handleSort: handleTableSort } = useTableSort()

  useEffect(() => {
    document.title = 'Player Performance - NFT Weingarten'
  }, [])

  const monthOptions = useMemo(() => getUniqueMonths(data), [data])
  const playerOptions = useMemo(() => getUniquePlayers(data), [data])

  const filteredData = useMemo(() => {
    if (!selectedMonth) return data
    return filterByMonth(data, selectedMonth)
  }, [data, selectedMonth])

  const playerScores = useMemo(() => calculatePlayerScores(filteredData), [filteredData])

  const sortedPlayerScores = useMemo(() => [...playerScores].sort((a, b) => {
    const aVal = a[tableSortKey as keyof typeof a]
    const bVal = b[tableSortKey as keyof typeof b]
    if (typeof aVal === 'number' && typeof bVal === 'number') {
      return tableSortDirection === 'asc' ? aVal - bVal : bVal - aVal
    }
    if (typeof aVal === 'string' && typeof bVal === 'string') {
      return tableSortDirection === 'asc' ? aVal.localeCompare(bVal) : bVal.localeCompare(aVal)
    }
    return 0
  }), [playerScores, tableSortKey, tableSortDirection])

  const top10Players = useMemo(() => sortedPlayerScores.slice(0, 10), [sortedPlayerScores])

  const leaderboardChartData = useMemo(() =>
    top10Players.map(p => ({
      name: truncateName(p.name, CHART_NAME_MAX_LENGTH),
      value: p.score,
      score: p.score,
      goals: p.goals,
    })),
    [top10Players]
  )

  const comparisonData = useMemo(() =>
    playerScores.filter(p => selectedPlayers.includes(p.name)),
    [playerScores, selectedPlayers]
  )

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
        <h1 className={styles.title}>Player Performance</h1>
        <p className={styles.subtitle}>Track and compare player statistics over time</p>
      </div>

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
            <BarChart data={leaderboardChartData} height={300} dataKeys={['score']} />
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
            <Tabs tabs={COMPARISON_TABS} defaultTab="score">
              {(activeTab) => {
                const metric = activeTab as ComparisonKey
                const chartData = buildComparisonChartData(comparisonData, metric)
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
                    <p className={styles.description}>{COMPARISON_DESCRIPTIONS[metric]}</p>
                  </div>
                )
              }}
            </Tabs>
          ) : (
            <div className={styles.noData}>
              <div className={styles.noDataIcon}>👆</div>
              <div className={styles.noDataText}>Select players above to compare their performance</div>
            </div>
          )}
        </div>
      </section>
    </div>
  )
}
