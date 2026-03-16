/**
 * ScoringMethod Page
 *
 * Educational page explaining the scoring system with:
 * - Visual scoring outcome cards (Shooter & Goalkeeper)
 * - Time-weighted decay explanation with inline formula + milestone tiles
 * - Interactive simulation: controls panel + dual-line chart + metric cards
 */

import { useState, useMemo } from 'react'
import { LineChart } from '../components/charts'
import { NumberInput, MetricCard, SkipLink } from '../components/ui'
import { Scoring } from '@/types'
import { SHOOTER_OUTCOMES, KEEPER_OUTCOMES } from '@/lib/scoring'
import type { ScoringOutcome } from '@/lib/scoring'
import styles from './ScoringMethod.module.css'

// ─── ScoringBadge ────────────────────────────────────────────────────────────

/** Colored pill showing a point value: green (positive), red (negative), gray (zero). */
function ScoringBadge({ points, label }: { points: number; label: string }) {
  const variant =
    points > 0 ? styles.badgePositive
    : points < 0 ? styles.badgeNegative
    : styles.badgeNeutral
  return <span className={`${styles.badge} ${variant}`}>{label}</span>
}

// ─── ScoringOutcomeList ───────────────────────────────────────────────────────

function ScoringOutcomeList({ outcomes }: { outcomes: ScoringOutcome[] }) {
  return (
    <ul className={styles.outcomeList}>
      {outcomes.map(({ emoji, outcome, points, label }) => (
        <li key={outcome} className={styles.outcomeRow}>
          <span className={styles.outcomeEmoji}>{emoji}</span>
          <span className={styles.outcomeName}>{outcome}</span>
          <ScoringBadge points={points} label={label} />
        </li>
      ))}
    </ul>
  )
}

// ─── DecayMilestone ──────────────────────────────────────────────────────────

interface DecayMilestone {
  dayLabel: string
  pct: number       // 0–100
  score: number     // computed weighted score for the sample base
  description: string
}

function DecayMilestoneCard({ dayLabel, pct, score, description }: DecayMilestone) {
  return (
    <div className={styles.milestone}>
      <div className={styles.milestoneDay}>{dayLabel}</div>
      <div className={styles.milestoneBarTrack}>
        <div className={styles.milestoneFill} style={{ width: `${pct}%` }} />
      </div>
      <div className={styles.milestonePct}>{pct}%</div>
      <div className={styles.milestoneScore}>{score} pts</div>
      <div className={styles.milestoneDesc}>{description}</div>
    </div>
  )
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function ScoringMethod() {
  const [originalScore, setOriginalScore] = useState<number>(100)
  const [halfLife, setHalfLife] = useState<number>(Scoring.PERFORMANCE_HALF_LIFE_DAYS)
  const currentHalfLife = Scoring.PERFORMANCE_HALF_LIFE_DAYS

  // Chart data: sample every 10 days
  const decayCurveData = useMemo(() => {
    return Array.from({ length: 19 }, (_, i) => i * 10).map(day => ({
      name: `Day ${day}`,
      simulated: Math.round(Math.pow(2, -day / halfLife) * originalScore),
      current: Math.round(Math.pow(2, -day / currentHalfLife) * originalScore),
    }))
  }, [originalScore, halfLife, currentHalfLife])

  // Metric card values
  const scoreToday      = originalScore
  const scoreAtHalfLife = useMemo(() => Math.round(originalScore * 0.5), [originalScore])
  const scoreAtDouble   = useMemo(() => Math.round(originalScore * 0.25), [originalScore])

  // Decay milestones — use originalScore so tiles stay in sync with the simulator
  const milestones: DecayMilestone[] = [
    { dayLabel: 'Day 0',                      pct: 100, score: originalScore,                         description: 'Today' },
    { dayLabel: `Day ${currentHalfLife}`,     pct: 50,  score: Math.round(originalScore * 0.5),       description: '½-Life' },
    { dayLabel: `Day ${currentHalfLife * 2}`, pct: 25,  score: Math.round(originalScore * 0.25),      description: '2× ½-Life' },
    { dayLabel: `Day ${currentHalfLife * 3}`, pct: 12,  score: Math.round(originalScore * 0.125),     description: '3× ½-Life' },
  ]

  return (
    <div className={styles.container}>
      <SkipLink />
      {/* ── Page Header ─────────────────────────────────────────────── */}
      <header className={styles.header} id="main-content">
        <h1 className={styles.title}>Scoring Method</h1>
        <p className={styles.subtitle}>
          Understanding how scores are calculated with the time-weighted system
        </p>
      </header>

      {/* ── Section 1: Base Points ──────────────────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>🎯 Base Points System</h2>
        <div className={styles.scoringGrid}>
          <div className={styles.scoringCard}>
            <h3 className={styles.cardTitle}>Shooter</h3>
            <ScoringOutcomeList outcomes={SHOOTER_OUTCOMES} />
          </div>
          <div className={styles.scoringCard}>
            <h3 className={styles.cardTitle}>Goalkeeper</h3>
            <ScoringOutcomeList outcomes={KEEPER_OUTCOMES} />
          </div>
        </div>
      </section>

      {/* ── Section 2: Time-Weighted Scoring ───────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>⏱️ Time-Weighted Scoring</h2>
        <p className={styles.description}>
          Recent games matter more. Scores decay exponentially over time — a game
          played {currentHalfLife} days ago counts for only half as much as a game
          played today.
        </p>

        {/* Formula */}
        <div className={styles.mathSection}>
          <div className={styles.formulaBlock}>
            <span className={styles.formulaLabel}>Formula</span>
            <code className={styles.formulaCode}>
              Weighted Score = Base Score × 2<sup>−days_ago / half_life</sup>
            </code>
            <p className={styles.formulaNote}>
              Current <strong>half-life</strong> = {currentHalfLife} days
            </p>
          </div>

          {/* Decay milestones */}
          <div className={styles.milestones}>
            {milestones.map(m => (
              <DecayMilestoneCard key={m.dayLabel} {...m} />
            ))}
          </div>
          <p className={styles.milestonesCaption}>
            * Based on a base score of {originalScore} pts (adjust in the simulator below)
          </p>
        </div>
      </section>

      {/* ── Section 3: Interactive Simulation ──────────────────────── */}
      <section className={styles.card}>
        <h2 className={styles.sectionTitle}>📈 Interactive Simulation</h2>
        <p className={styles.description}>
          Adjust the parameters below and see how the decay curve changes in real time.
          The <span className={styles.accentText}>red line</span> reflects your chosen
          half-life; the <span className={styles.dimText}>gray line</span> is the current
          app default ({currentHalfLife} days).
        </p>

        <div className={styles.simulationLayout}>

          {/* Controls & Metrics */}
          <div className={styles.controlsPanel}>
            <div className={styles.inputGroup}>
              <NumberInput
                label="Original Score"
                value={originalScore}
                onChange={setOriginalScore}
                min={1}
                max={1000}
                step={10}
              />
              <NumberInput
                label="Half-Life (days)"
                value={halfLife}
                onChange={setHalfLife}
                min={1}
                max={180}
                step={5}
              />
            </div>

            <div className={styles.metricsRow}>
              <MetricCard
                label="Today"
                value={`${scoreToday} pts`}
                help="Score on day 0"
              />
              <MetricCard
                label={`At ½-Life (day ${halfLife})`}
                value={`${scoreAtHalfLife} pts`}
                help="50% of original score"
              />
              <MetricCard
                label={`At 2× ½-Life (day ${halfLife * 2})`}
                value={`${scoreAtDouble} pts`}
                help="25% of original score"
              />
            </div>
          </div>

          {/* Chart */}
          <div className={styles.chartPanel}>
            <LineChart
              data={decayCurveData}
              height={340}
              showLegend
              series={[
                { key: 'simulated', label: `Simulated (½-life: ${halfLife}d)`, color: 'var(--chart-error, #b83232)' },
                { key: 'current',   label: `Current (½-life: ${currentHalfLife}d)`,  color: 'var(--chart-neutral, #6b7280)' },
              ]}
            />
          </div>

        </div>
      </section>

    </div>
  )
}
