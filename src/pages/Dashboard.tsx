import { useEffect, useMemo, useState } from 'react'
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
  getRecentSession,
  getOverallStats,
  getHottestShooter,
  getBestSaveRate,
  getBestConversionRate,
  getPerfectSession,
  getSessionLeader
} from '@/lib/analysis'
import { MetricCard, Tabs, DataTable, LoadingSpinner, RevealButton, TypewriterTop10List } from '@/components/ui'
import { BarChart, PieChart } from '@/components/charts'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { PLAYER_STATS_COLUMNS, KEEPER_STATS_COLUMNS, CHART_NAME_MAX_LENGTH } from '@/lib/constants'
import { truncateName } from '@/lib/utils'
import styles from './Dashboard.module.css'

function Dashboard() {
  const { data, loading, error } = usePenaltyData()

  const [revealedTop10, setRevealedTop10] = useState(false)
  const [revealedTopPlayer, setRevealedTopPlayer] = useState(false)
  const [revealedTopKeeper, setRevealedTopKeeper] = useState(false)

  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
  }, [])

  const playerScores = useMemo(() => calculatePlayerScores(data), [data])
  const keeperScores = useMemo(() => calculateKeeperScores(data), [data])
  const topPlayer = useMemo(() => getTopPlayer(data), [data])
  const topKeeper = useMemo(() => getTopKeeper(data), [data])
  const top10Players = useMemo(() => playerScores.slice(0, 10), [playerScores])

  const overallStats = useMemo(() => getOverallStats(data), [data])
  const hottestShooter = useMemo(() => getHottestShooter(data), [data])
  const iceMan = useMemo(() => getBestSaveRate(data), [data])
  const sharpshooter = useMemo(() => getBestConversionRate(data), [data])
  const sessionLeader = useMemo(() => getSessionLeader(data), [data])

  const hallOfFame = useMemo(() => ({
    mostGoals: getMostGoalsInSession(data),
    mostSaves: getMostSavesInSession(data),
    longestStreak: getLongestGoalStreak(data),
    biggestRivalry: getBiggestRivalry(data),
    marathonMan: getMarathonMan(data),
    mysteriousNinja: getMysteriousNinja(data),
    busiestDay: getBusiestDay(data),
    perfectSession: getPerfectSession(data)
  }), [data])

  const recentSession = useMemo(() => getRecentSession(data), [data])

  const chartData = useMemo(() =>
    top10Players.map(p => ({
      name: truncateName(p.name, CHART_NAME_MAX_LENGTH),
      value: p.score,
      score: p.score,
      goals: p.goals
    })),
    [top10Players]
  )

  if (loading) return <LoadingSpinner />

  if (error) {
    return (
      <div className={styles.errorState}>
        <div className={styles.errorIcon}>!</div>
        <p className={styles.errorTitle}>Error loading data</p>
        <p className={styles.errorMessage}>{error.message}</p>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      {/* Page Header */}
      <div className={styles.pageHeader}>
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>All-time penalty statistics & records</p>
      </div>

      {/* Stats Summary Bar */}
      <div className={styles.statsBar}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statBarItem}>
              <span className={styles.statBarValue}>{overallStats.totalPenalties.toLocaleString()}</span>
              <span className={styles.statBarLabel}>Total Penalties</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Total number of penalty kicks recorded across all sessions</p>
          </TooltipContent>
        </Tooltip>
        <div className={styles.statBarDivider} />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statBarItem}>
              <span className={styles.statBarValue}>{overallStats.totalSessions}</span>
              <span className={styles.statBarLabel}>Sessions</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Number of unique training/match sessions recorded</p>
          </TooltipContent>
        </Tooltip>
        <div className={styles.statBarDivider} />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statBarItem}>
              <span className={styles.statBarValue}>{overallStats.totalPlayers}</span>
              <span className={styles.statBarLabel}>Players</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Number of unique players who have taken penalties</p>
          </TooltipContent>
        </Tooltip>
        <div className={styles.statBarDivider} />
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statBarItem}>
              <span className={`${styles.statBarValue} ${styles.statBarValueAccent}`}>
                {overallStats.goalRate}%
              </span>
              <span className={styles.statBarLabel}>Goal Rate</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Percentage of all penalty kicks that resulted in goals</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Top Performers */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>🏆 Top Performers</h2>

        <div className={styles.topPerformersGrid}>
          {/* Wide left card: Top-10 */}
          <div className={`${styles.card} ${styles.cardWide} ${styles.cardAccentLeft}`}>
            <h3 className={styles.cardTitle}>🔟 Top-10 Players</h3>
            <RevealButton
              label="Reveal Top-10"
              onReveal={() => setRevealedTop10(true)}
              onReset={() => setRevealedTop10(false)}
              variant="primary"
            />
            {revealedTop10 && top10Players.length > 0 && (
              <div className={styles.revealedContent}>
                <TypewriterTop10List players={top10Players} />
              </div>
            )}
          </div>

          {/* Right column: Top Player + Top Keeper stacked */}
          <div className={styles.topPerformersStack}>
            <div className={`${styles.card} ${styles.cardAccentLeft}`}>
              <h3 className={styles.cardTitle}>👤 Top Player</h3>
              <RevealButton
                label="Reveal Player"
                onReveal={() => setRevealedTopPlayer(true)}
                onReset={() => setRevealedTopPlayer(false)}
                variant="primary"
              />
              {revealedTopPlayer && topPlayer && (
                <div className={styles.revealedContent}>
                  <MetricCard
                    label={topPlayer.name}
                    value={topPlayer.score.toFixed(2)}
                    delta={`${topPlayer.goals} goals · ${topPlayer.saved} saved · ${topPlayer.out} out`}
                    sentiment="positive"
                  />
                </div>
              )}
            </div>

            <div className={`${styles.card} ${styles.cardAccentLeft}`}>
              <h3 className={styles.cardTitle}>🧤 Top Goalkeeper</h3>
              <RevealButton
                label="Reveal Keeper"
                onReveal={() => setRevealedTopKeeper(true)}
                onReset={() => setRevealedTopKeeper(false)}
                variant="primary"
              />
              {revealedTopKeeper && topKeeper && (
                <div className={styles.revealedContent}>
                  <MetricCard
                    label={topKeeper.name}
                    value={topKeeper.score.toFixed(2)}
                    delta={`${topKeeper.saves} saves · ${topKeeper.goalsConceded} conceded`}
                    sentiment="positive"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Current Form */}
      <section className={styles.section}>
        <h2 className={styles.sectionTitle}>⚡ Current Form</h2>
        <p className={styles.sectionSubtitle}>Live stats based on recent activity</p>

        <div className={styles.formGrid}>
          <div className={styles.formCard}>
            <div className={styles.formCardIcon}>🔥</div>
            <div className={styles.formCardBody}>
              <div className={styles.formCardName}>
                {hottestShooter?.playerName ?? 'N/A'}
              </div>
              <div className={styles.formCardStat}>
                {hottestShooter
                  ? `${hottestShooter.goalRate}% in last ${hottestShooter.sessions} session${hottestShooter.sessions !== 1 ? 's' : ''} (${hottestShooter.attempts} attempts)`
                  : 'Not enough data'}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${styles.formCardLabel} ${styles.formCardLabelTooltip}`}>Hottest Shooter ⓘ</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Player with the highest goal rate across their last 3 sessions (min. 3 attempts total)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.formCardIcon}>🧊</div>
            <div className={styles.formCardBody}>
              <div className={styles.formCardName}>
                {iceMan?.keeperName ?? 'N/A'}
              </div>
              <div className={styles.formCardStat}>
                {iceMan
                  ? `${iceMan.saveRate}% save rate (${iceMan.saves}/${iceMan.faced})`
                  : 'Not enough data'}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${styles.formCardLabel} ${styles.formCardLabelTooltip}`}>Ice Man ⓘ</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Goalkeeper with the best all-time save rate (min. 5 shots faced, excluding shots that went wide)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.formCardIcon}>🎯</div>
            <div className={styles.formCardBody}>
              <div className={styles.formCardName}>
                {sharpshooter?.playerName ?? 'N/A'}
              </div>
              <div className={styles.formCardStat}>
                {sharpshooter
                  ? `${sharpshooter.goalRate}% conversion (${sharpshooter.goals}/${sharpshooter.attempts})`
                  : 'Not enough data'}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${styles.formCardLabel} ${styles.formCardLabelTooltip}`}>Sharpshooter ⓘ</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Player with the best all-time penalty conversion rate (min. 5 attempts)</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          <div className={styles.formCard}>
            <div className={styles.formCardIcon}>🏃</div>
            <div className={styles.formCardBody}>
              <div className={styles.formCardName}>
                {sessionLeader?.playerName ?? 'N/A'}
              </div>
              <div className={styles.formCardStat}>
                {sessionLeader
                  ? `${sessionLeader.goals} goal${sessionLeader.goals !== 1 ? 's' : ''} scored`
                  : 'No goals in latest session'}
              </div>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className={`${styles.formCardLabel} ${styles.formCardLabelTooltip}`}>Session Leader ⓘ</div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Player who scored the most goals in the most recent session</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </section>

      {/* Hall of Fame */}
      <section className={`${styles.section} ${styles.sectionAccent}`}>
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
                    delta={hallOfFame.mostGoals
                      ? `${hallOfFame.mostGoals.goals} goals on ${hallOfFame.mostGoals.date.toLocaleDateString()}`
                      : 'No data'}
                    sentiment="positive"
                  />
                  <MetricCard
                    label="Most Saves in Session"
                    value={hallOfFame.mostSaves?.keeperName || 'N/A'}
                    delta={hallOfFame.mostSaves
                      ? `${hallOfFame.mostSaves.saves} saves on ${hallOfFame.mostSaves.date.toLocaleDateString()}`
                      : 'No data'}
                    sentiment="neutral"
                  />
                </div>
              )}

              {activeTab === 'alltime' && (
                <div className={styles.recordsGrid}>
                  <MetricCard
                    label="Longest Goal Streak"
                    value={hallOfFame.longestStreak?.playerName || 'N/A'}
                    delta={hallOfFame.longestStreak
                      ? `${hallOfFame.longestStreak.streak} consecutive goals`
                      : 'No data'}
                    sentiment="positive"
                  />
                  <MetricCard
                    label="Biggest Rivalry"
                    value={hallOfFame.biggestRivalry
                      ? `${hallOfFame.biggestRivalry.shooterName} vs ${hallOfFame.biggestRivalry.keeperName}`
                      : 'N/A'}
                    delta={hallOfFame.biggestRivalry
                      ? `${hallOfFame.biggestRivalry.encounters} encounters`
                      : 'No data'}
                    sentiment="neutral"
                  />
                </div>
              )}

              {activeTab === 'funfacts' && (
                <div className={styles.recordsGridWide}>
                  <MetricCard
                    label="🏃 Marathon Man"
                    value={hallOfFame.marathonMan?.playerName || 'N/A'}
                    delta={hallOfFame.marathonMan
                      ? `${hallOfFame.marathonMan.sessionCount} sessions played`
                      : 'No data'}
                    sentiment="positive"
                  />
                  <MetricCard
                    label="🥷 Mysterious Ninja"
                    value={hallOfFame.mysteriousNinja?.playerName || 'N/A'}
                    delta={hallOfFame.mysteriousNinja
                      ? `Only ${hallOfFame.mysteriousNinja.sessionCount} session(s)`
                      : 'No data'}
                    sentiment="neutral"
                  />
                  <MetricCard
                    label="📅 Busiest Day"
                    value={hallOfFame.busiestDay
                      ? hallOfFame.busiestDay.date.toLocaleDateString()
                      : 'N/A'}
                    delta={hallOfFame.busiestDay
                      ? `${hallOfFame.busiestDay.penaltyCount} penalties`
                      : 'No data'}
                    sentiment="neutral"
                  />
                  <MetricCard
                    label="💯 Perfect Session"
                    value={hallOfFame.perfectSession?.playerName || 'N/A'}
                    delta={hallOfFame.perfectSession
                      ? `${hallOfFame.perfectSession.goals}/${hallOfFame.perfectSession.goals} on ${hallOfFame.perfectSession.date.toLocaleDateString()}`
                      : 'No perfect session yet'}
                    sentiment="positive"
                  />
                </div>
              )}
            </div>
          )}
        </Tabs>
      </section>

      {/* Recent Activity */}
      <section className={styles.section}>
        <div className={styles.recentHeader}>
          <h2 className={styles.sectionTitle}>📊 Recent Activity</h2>
          {recentSession && (
            <span className={styles.sessionDatePill}>
              {recentSession.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
            </span>
          )}
        </div>

        <div className={styles.recentMetrics}>
          <div className={`${styles.recentMetricCard} ${styles.recentMetricGoals}`}>
            <MetricCard
              label="Goals"
              value={recentSession?.goals ?? 0}
              sentiment="positive"
            />
          </div>
          <div className={`${styles.recentMetricCard} ${styles.recentMetricSaves}`}>
            <MetricCard
              label="Saves"
              value={recentSession?.saves ?? 0}
              sentiment="neutral"
            />
          </div>
          <div className={`${styles.recentMetricCard} ${styles.recentMetricOut}`}>
            <MetricCard
              label="Out"
              value={recentSession?.outs ?? 0}
              sentiment="negative"
            />
          </div>
        </div>

        <div className={styles.statsCard}>
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
                    <div className={styles.chartWrapper}>
                      <BarChart data={chartData} dataKeys={['score']} height={200} />
                    </div>
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
        </div>
      </section>
    </div>
  )
}

export default Dashboard
