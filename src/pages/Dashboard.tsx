import { useEffect, useMemo, useState, Suspense } from 'react'
import { usePenaltyData } from '@/hooks/usePenaltyData'
import {
  calculatePlayerScores,
  calculateKeeperScores,
  getMostGoalsInSession,
  getMostSavesInSession,
  getLongestGoalStreak,
  getBiggestRivalry,
  getMarathonMan,
  getMysteriousNinja,
  getBusiestDay,
  getRecentSession,
  getRecentSessionPlayerScores,
  getRecentSessionKeeperScores,
  getOverallStats,
  getHottestShooter,
  getBestSaveRate,
  getBestConversionRate,
  getPerfectSession,
  getSessionLeader
} from '@/lib/analysis'
import { MetricCard, Tabs, TabsList, TabsTrigger, TabsContent, DataTable, LoadingSpinner, RevealButton, TypewriterTop10List, RollingNumber, ChartSkeleton, EmptyState, SkipLink } from '@/components/ui'
import { RefreshCw, Users } from 'lucide-react'
import { Carousel, CarouselContent, CarouselItem, CarouselPrevious, CarouselNext, CarouselPagination } from '@/components/ui/carousel'
import { BarChart, PieChart } from '@/components/charts'
import { Tooltip, TooltipTrigger, TooltipContent } from '@/components/ui/tooltip'
import { PLAYER_STATS_COLUMNS, KEEPER_STATS_COLUMNS, RECENT_PLAYER_STATS_COLUMNS, RECENT_KEEPER_STATS_COLUMNS, CHART_NAME_MAX_LENGTH } from '@/lib/constants'
import { truncateName } from '@/lib/utils'
import { HALL_OF_FAME_METRICS, type MetricConfig, DELTA_COLORS } from '@/lib/metricsConfig'
import styles from './Dashboard.module.css'

// Helper type for Hall of Fame data
type HallOfFameData = {
  mostGoals: { playerName: string; goals: number; date: Date } | null
  mostSaves: { keeperName: string; saves: number; date: Date } | null
  longestStreak: { playerName: string; streak: number; date: Date } | null
  biggestRivalry: { shooterName: string; keeperName: string; encounters: number } | null
  marathonMan: { playerName: string; sessionCount: number } | null
  mysteriousNinja: { playerName: string; sessionCount: number } | null
  busiestDay: { date: Date; penaltyCount: number } | null
  perfectSession: { playerName: string; goals: number; date: Date } | null
}

// Helper to extract value and delta from Hall of Fame data based on metric key
function getMetricValueAndDelta(data: HallOfFameData, config: MetricConfig): { value: string; delta: string } {
  switch (config.key) {
    case 'mostGoals': {
      const item = data.mostGoals
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.playerName, delta: `${item.goals} goals on ${item.date.toLocaleDateString()}` }
    }
    case 'mostSaves': {
      const item = data.mostSaves
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.keeperName, delta: `${item.saves} saves on ${item.date.toLocaleDateString()}` }
    }
    case 'longestStreak': {
      const item = data.longestStreak
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.playerName, delta: `${item.streak} consecutive goals` }
    }
    case 'biggestRivalry': {
      const item = data.biggestRivalry
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: `${item.shooterName} vs ${item.keeperName}`, delta: `${item.encounters} encounters` }
    }
    case 'marathonMan': {
      const item = data.marathonMan
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.playerName, delta: `${item.sessionCount} sessions played` }
    }
    case 'mysteriousNinja': {
      const item = data.mysteriousNinja
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.playerName, delta: `Only ${item.sessionCount} session(s)` }
    }
    case 'busiestDay': {
      const item = data.busiestDay
      if (!item) return { value: 'N/A', delta: 'No data' }
      return { value: item.date.toLocaleDateString(), delta: `${item.penaltyCount} penalties` }
    }
    case 'perfectSession': {
      const item = data.perfectSession
      if (!item) return { value: 'N/A', delta: 'No perfect session yet' }
      return { value: item.playerName, delta: `${item.goals}/${item.goals} on ${item.date.toLocaleDateString()}` }
    }
    default:
      return { value: 'N/A', delta: 'No data' }
  }
}

function Dashboard() {
  const { data, isLoading, error } = usePenaltyData()

  const [revealedTopPerformers, setRevealedTopPerformers] = useState(false)

  useEffect(() => {
    document.title = 'Dashboard - NFT Weingarten'
  }, [])
  // All-time scores
  const playerScores = useMemo(() => calculatePlayerScores(data), [data])
  const keeperScores = useMemo(() => calculateKeeperScores(data), [data])
  const top3Players = useMemo(() => playerScores.slice(0, 3), [playerScores])
  const top3Keepers = useMemo(() => keeperScores.slice(0, 3), [keeperScores])
  const top10Players = useMemo(() => playerScores.slice(0, 10), [playerScores])

  // Recent session scores (for Recent Activity section)
  const recentPlayerScores = useMemo(() => getRecentSessionPlayerScores(data), [data])
  const recentKeeperScores = useMemo(() => getRecentSessionKeeperScores(data), [data])

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

  const recentChartData = useMemo(() =>
    recentPlayerScores.slice(0, 10).map(p => ({
      name: truncateName(p.name, CHART_NAME_MAX_LENGTH),
      value: p.score,
      score: p.score,
      goals: p.goals
    })),
    [recentPlayerScores]
  )

  if (isLoading || !data) {
    return (
      <div className={styles.container}>
        <div className={styles.pageHeader}>
          <h1 className={styles.title}>Dashboard</h1>
          <p className={styles.subtitle}>All-time penalty statistics & records</p>
        </div>
        
        <EmptyState
          title="Loading Data"
          description="Fetching penalty statistics and records. This may take a moment..."
          icon={RefreshCw}
        />
      </div>
    )
  }

  if (error) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="Data Unavailable"
          description="Unable to load penalty data at this time. Please try again later."
          icon={RefreshCw}
          action={{
            label: "Retry",
            onClick: () => window.location.reload(),
            variant: "primary"
          }}
        />
      </div>
    )
  }

  if (!data || data.length === 0) {
    return (
      <div className={styles.container}>
        <EmptyState
          title="No Penalty Data"
          description="There are no penalty statistics available for the selected filters. Try adjusting your search criteria or check back later."
          icon={Users}
          action={{
            label: "Refresh Data",
            onClick: () => window.location.reload(),
            variant: "secondary"
          }}
        />
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <SkipLink />
      {/* Page Header */}
      <div className={styles.pageHeader} id="main-content">
        <h1 className={styles.title}>Dashboard</h1>
        <p className={styles.subtitle}>All-time penalty statistics & records</p>
      </div>

      {/* Stats Summary Bar - Always Visible */}
      <div className={styles.statsBar}>
        <Tooltip>
          <TooltipTrigger asChild>
            <div className={styles.statBarItem}>
              <span className={styles.statBarValue}><RollingNumber value={overallStats.totalPenalties} /></span>
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
              <span className={styles.statBarValue}><RollingNumber value={overallStats.totalSessions} /></span>
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
              <span className={styles.statBarValue}><RollingNumber value={overallStats.totalPlayers} /></span>
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
                <RollingNumber value={overallStats.goalRate} decimals={1} suffix="%" />
              </span>
              <span className={styles.statBarLabel}>Goal Rate</span>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Percentage of all penalty kicks that resulted in goals</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Main Tabs Navigation */}
      <Tabs defaultValue="leaderboard" className={styles.mainTabs}>
        <TabsList className={styles.mainTabsList}>
          <TabsTrigger value="leaderboard" className={styles.mainTabsTrigger}>
            <span className={styles.tabIcon}>🏆</span>
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="insights" className={styles.mainTabsTrigger}>
            <span className={styles.tabIcon}>📈</span>
            Insights
          </TabsTrigger>
        </TabsList>

        {/* TAB 1: LEADERBOARD */}
        <TabsContent value="leaderboard">
          <section className={styles.section}>
            <div className={styles.topPerformersHeader}>
              <h2 className={styles.sectionTitle}>🎯 Top Performers</h2>
              <div className={styles.topPerformersActions}>
                <RevealButton
                  label="Reveal"
                  onReveal={() => setRevealedTopPerformers(true)}
                  onReset={() => setRevealedTopPerformers(false)}
                  isRevealed={revealedTopPerformers}
                  variant="primary"
                />
              </div>
            </div>

            {revealedTopPerformers && (
              <div className={styles.podiumSection}>
                <div className={styles.podiumGrid}>
                  {/* Shooters Podium */}
                  <div className={styles.podiumCard}>
                    <h3 className={styles.podiumTitle}>🎯 Top 3 Shooters</h3>
                    <div className={styles.podiumContent}>
                      <div className={styles.podiumPositions}>
                        <div className={`${styles.podiumPosition} ${styles.podiumGold}`}>
                          <span className={styles.podiumMedal}>🥇</span>
                          {top3Players[0] && (
                            <>
                              <span className={styles.podiumName}>{top3Players[0].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Players[0]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                        <div className={`${styles.podiumPosition} ${styles.podiumSilver}`}>
                          <span className={styles.podiumMedal}>🥈</span>
                          {top3Players[1] && (
                            <>
                              <span className={styles.podiumName}>{top3Players[1].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Players[1]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                        <div className={`${styles.podiumPosition} ${styles.podiumBronze}`}>
                          <span className={styles.podiumMedal}>🥉</span>
                          {top3Players[2] && (
                            <>
                              <span className={styles.podiumName}>{top3Players[2].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Players[2]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Keepers Podium */}
                  <div className={styles.podiumCard}>
                    <h3 className={styles.podiumTitle}>🧤 Top 3 Keepers</h3>
                    <div className={styles.podiumContent}>
                      <div className={styles.podiumPositions}>
                        <div className={`${styles.podiumPosition} ${styles.podiumGold}`}>
                          <span className={styles.podiumMedal}>🥇</span>
                          {top3Keepers[0] && (
                            <>
                              <span className={styles.podiumName}>{top3Keepers[0].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Keepers[0]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                        <div className={`${styles.podiumPosition} ${styles.podiumSilver}`}>
                          <span className={styles.podiumMedal}>🥈</span>
                          {top3Keepers[1] && (
                            <>
                              <span className={styles.podiumName}>{top3Keepers[1].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Keepers[1]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                        <div className={`${styles.podiumPosition} ${styles.podiumBronze}`}>
                          <span className={styles.podiumMedal}>🥉</span>
                          {top3Keepers[2] && (
                            <>
                              <span className={styles.podiumName}>{top3Keepers[2].name}</span>
                              <span className={styles.podiumScore}><RollingNumber value={top3Keepers[2]?.score ?? 0} decimals={2} enabled={revealedTopPerformers} /></span>
                            </>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className={`${styles.card} ${styles.leaderboardCard}`}>
                  <h3 className={styles.cardTitle}>📊 Full Leaderboard (Top 10 Shooters)</h3>
                  {top10Players.length > 0 && (
                    <TypewriterTop10List players={top10Players} />
                  )}
                </div>
              </div>
            )}

            {!revealedTopPerformers && (
              <div className={styles.topPerformersCollapsed} />
            )}
          </section>
        </TabsContent>

        {/* TAB 2: INSIGHTS */}
        <TabsContent value="insights">
          {/* Current Form Section */}
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

          {/* Hall of Fame + Recent Activity Side by Side */}
          <div className={styles.insightsGrid}>
            {/* Hall of Fame */}
            <section className={`${styles.section} ${styles.sectionAccent}`}>
              <h2 className={styles.sectionTitle}>🏅 Hall of Fame</h2>

              <Tabs defaultValue="single" className={styles.hallOfFameTabs}>
                <TabsList>
                  <TabsTrigger value="single">Single Session</TabsTrigger>
                  <TabsTrigger value="alltime">All-Time</TabsTrigger>
                  <TabsTrigger value="funfacts">Fun Facts</TabsTrigger>
                </TabsList>

                <TabsContent value="single">
                  <div className={styles.hallOfFameContent}>
                    <div className={styles.recordsGrid}>
                      {HALL_OF_FAME_METRICS.single.map(config => {
                        const { value, delta } = getMetricValueAndDelta(hallOfFame, config)
                        return (
                          <MetricCard
                            key={config.key}
                            label={config.label}
                            value={value}
                            delta={delta}
                            deltaColor={config.deltaColor}
                          />
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="alltime">
                  <div className={styles.hallOfFameContent}>
                    <div className={styles.recordsGrid}>
                      {HALL_OF_FAME_METRICS.alltime.map(config => {
                        const { value, delta } = getMetricValueAndDelta(hallOfFame, config)
                        return (
                          <MetricCard
                            key={config.key}
                            label={config.label}
                            value={value}
                            delta={delta}
                            deltaColor={config.deltaColor}
                          />
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>

                <TabsContent value="funfacts">
                  <div className={styles.hallOfFameContent}>
                    <div className={styles.recordsGridWide}>
                      {HALL_OF_FAME_METRICS.funfacts.map(config => {
                        const { value, delta } = getMetricValueAndDelta(hallOfFame, config)
                        return (
                          <MetricCard
                            key={config.key}
                            label={config.label}
                            value={value}
                            delta={delta}
                            deltaColor={config.deltaColor}
                          />
                        )
                      })}
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </section>

            {/* Recent Activity - MetricCards + Carousels */}
            <section className={styles.recentActivitySection}>
              <div className={styles.recentActivityHeader}>
                <div>
                  <h2 className={styles.recentActivityTitle}>📊 Recent Activity</h2>
                  {recentSession && (
                    <span className={styles.recentActivityDate}>
                      {recentSession.date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                  )}
                </div>
              </div>

              {/* Summary Stats - Old MetricCard Style */}
              <div className={styles.recentMetrics}>
                <div className={`${styles.recentMetricCard} ${styles.recentMetricGoals}`}>
                  <MetricCard
                    label="Goals"
                    value={recentSession?.goals ?? 0}
                    deltaColor={DELTA_COLORS.success}
                  />
                </div>
                <div className={`${styles.recentMetricCard} ${styles.recentMetricSaves}`}>
                  <MetricCard
                    label="Saves"
                    value={recentSession?.saves ?? 0}
                    deltaColor={DELTA_COLORS.muted}
                  />
                </div>
                <div className={`${styles.recentMetricCard} ${styles.recentMetricOut}`}>
                  <MetricCard
                    label="Out"
                    value={recentSession?.outs ?? 0}
                    deltaColor={DELTA_COLORS.error}
                  />
                </div>
              </div>

              {/* Shooters Row - Carousel */}
              <div className={styles.recentActivityRow}>
                <h3 className={styles.recentActivityRowTitle}>🎯 Shooters</h3>
                {recentPlayerScores.length === 0 ? (
                  <div className={styles.recentActivityEmpty}>
                    <span>No shooter data available</span>
                  </div>
                ) : (
                <Carousel opts={{ align: 'center', loop: false }} className="w-full">
                  <CarouselContent className="justify-center">
                    {recentPlayerScores.map(player => (
                      <CarouselItem key={player.name} className="basis-[140px] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2">
                        <div className={`${styles.recentActivityCard} ${styles.shooter}`}>
                          <span className={styles.recentActivityCardIcon}>🎯</span>
                          <span className={styles.recentActivityCardName}>{player.name}</span>
                          <span className={styles.recentActivityCardStats}>
                            {player.goals}G / {player.out}O
                          </span>
                          <span className={styles.recentActivityCardScore}>{player.score.toFixed(1)}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                  <CarouselPagination />
                </Carousel>
                )}
              </div>

              {/* Keepers Row - Carousel */}
              <div className={styles.recentActivityRow}>
                <h3 className={styles.recentActivityRowTitle}>🧤 Keepers</h3>
                {recentKeeperScores.length === 0 ? (
                  <div className={styles.recentActivityEmpty}>
                    <span>No keeper data available</span>
                  </div>
                ) : (
                <Carousel opts={{ align: 'center', loop: false }} className="w-full">
                  <CarouselContent className="justify-center">
                    {recentKeeperScores.map(keeper => (
                      <CarouselItem key={keeper.name} className="basis-[140px] sm:basis-1/3 md:basis-1/4 lg:basis-1/5 px-2">
                        <div className={`${styles.recentActivityCard} ${styles.keeper}`}>
                          <span className={styles.recentActivityCardIcon}>🧤</span>
                          <span className={styles.recentActivityCardName}>{keeper.name}</span>
                          <span className={styles.recentActivityCardStats}>
                            {keeper.saves}S / {keeper.goalsConceded}G
                          </span>
                          <span className={styles.recentActivityCardScore}>{keeper.score.toFixed(1)}</span>
                        </div>
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                  <CarouselPagination />
                </Carousel>
                )}
              </div>
            </section>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default Dashboard
