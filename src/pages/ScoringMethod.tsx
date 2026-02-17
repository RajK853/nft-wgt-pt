import { useState, useMemo } from 'react'
import { LineChart, BarChart } from '../components/charts'
import { DataTable, NumberInput, Expander } from '../components/ui'
import { Scoring } from '@/types'
import styles from './ScoringMethod.module.css'

const SHOOTER_SCORING = [
  { outcome: 'Goal', points: `+${Scoring.GOAL}` },
  { outcome: 'Saved', points: `${Scoring.SAVED}` },
  { outcome: 'Out', points: `${Scoring.OUT}` }
]

const KEEPER_SCORING = [
  { outcome: 'Goal Conceded', points: `${Scoring.KEEPER_GOAL}` },
  { outcome: 'Penalty Saved', points: `+${Scoring.KEEPER_SAVED}` },
  { outcome: 'Shooter Missed', points: `${Scoring.KEEPER_OUT}` }
]

const SCORING_COLUMNS = [
  { key: 'outcome', header: 'Outcome', sortable: false },
  { key: 'points', header: 'Points', sortable: false }
]

export default function ScoringMethod() {
  const [originalScore, setOriginalScore] = useState<number>(100)
  const [halfLife, setHalfLife] = useState<number>(Scoring.PERFORMANCE_HALF_LIFE_DAYS)
  const [currentHalfLife] = useState<number>(Scoring.PERFORMANCE_HALF_LIFE_DAYS)

  const decayCurveData = useMemo(() => {
    const days = Array.from({ length: 180 }, (_, i) => i)
    return days.map(day => {
      const simulatedDecay = Math.pow(2, -day / halfLife)
      const currentDecay = Math.pow(2, -day / currentHalfLife)
      return {
        day,
        simulated: Math.round(simulatedDecay * originalScore),
        current: Math.round(currentDecay * originalScore)
      }
    })
  }, [originalScore, halfLife, currentHalfLife])

  const halfLifeScore = useMemo(() => Math.round(originalScore * 0.5), [originalScore])

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Scoring Method</h1>
        <p className={styles.subtitle}>
          Understanding how scores are calculated with time-weighted system
        </p>
      </div>

      <div className={styles.content}>
        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>Base Points System</h2>

          <div className={styles.scoringGrid}>
            <div className={styles.scoringCard}>
              <h3 className={styles.cardTitle}>🎯 Shooter Scoring</h3>
              <DataTable data={SHOOTER_SCORING} columns={SCORING_COLUMNS} />
            </div>

            <div className={styles.scoringCard}>
              <h3 className={styles.cardTitle}>🧤 Goalkeeper Scoring</h3>
              <DataTable data={KEEPER_SCORING} columns={SCORING_COLUMNS} />
            </div>
          </div>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>⏱️ Time-Weighted Scoring</h2>
          <p className={styles.description}>
            Recent games matter more! Scores are weighted by a half-life decay function.
            This means recent performances have double the impact of games from {Scoring.PERFORMANCE_HALF_LIFE_DAYS} days ago.
          </p>

          <Expander title="See the Math" defaultOpen={false}>
            <div className={styles.formula}>
              <code>Weighted Score = Original Score × 2^(-days_ago / half_life)</code>
              <p className={styles.formulaExplanation}>
                Where <strong>half-life</strong> = {Scoring.PERFORMANCE_HALF_LIFE_DAYS} days
              </p>
              <ul className={styles.examples}>
                <li>Today: 100% of points</li>
                <li>{Scoring.PERFORMANCE_HALF_LIFE_DAYS} days ago: 50% of points</li>
                <li>{Scoring.PERFORMANCE_HALF_LIFE_DAYS * 2} days ago: 25% of points</li>
                <li>{Scoring.PERFORMANCE_HALF_LIFE_DAYS * 3} days ago: 12.5% of points</li>
              </ul>
            </div>
          </Expander>
        </section>

        <section className={styles.section}>
          <h2 className={styles.sectionTitle}>📈 Interactive Simulation</h2>
          <p className={styles.description}>
            See how the decay curve changes with different parameters
          </p>

          <div className={styles.simulationControls}>
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

          <div className={styles.simulationInfo}>
            <div className={styles.infoBox}>
              <span className={styles.infoLabel}>At half-life ({halfLife} days):</span>
              <span className={styles.infoValue}>{halfLifeScore} points</span>
            </div>
          </div>

          <div className={styles.chartContainer}>
            <h3 className={styles.chartTitle}>Decay Curve</h3>
            <LineChart
              data={decayCurveData.filter((_, i) => i % 10 === 0).map(d => ({
                name: `Day ${d.day}`,
                value: d.simulated
              }))}
              height={300}
            />
            <div className={styles.halfLifeMarker}>
              ✕ Half-life marker at day {halfLife} (score: {halfLifeScore})
            </div>
          </div>
        </section>
      </div>
    </div>
  )
}
