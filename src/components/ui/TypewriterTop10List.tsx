/**
 * TypewriterTop10List Component
 * Displays a top-10 list with typewriter animation effect
 * Each player's name and score animates in sequence
 * Uses exponentially decreasing speed for accelerating effect
 * Displays in 2-column layout (2 players per row)
 */

import { useState, useEffect, useRef, useMemo } from 'react'
import styles from './TypewriterTop10List.module.css'

interface PlayerScore {
  name: string
  score: number
}

interface TypewriterTop10ListProps {
  players: PlayerScore[]
  baseSpeed?: number
}

interface DisplayedPlayer {
  name: string
  score: string
}

function PlayerCell({
  index,
  displayed,
  showCursorName,
  showCursorScore
}: {
  index: number
  displayed: DisplayedPlayer | undefined
  showCursorName: boolean
  showCursorScore: boolean
}) {
  const isVisible = displayed !== undefined

  return (
    <div className={`${styles.playerCell} ${isVisible ? styles.visible : styles.hidden}`}>
      <span className={styles.rank}>{index + 1}.</span>
      <span className={styles.name}>
        {displayed?.name || ''}
        {showCursorName && <span className={styles.cursor}>|</span>}
      </span>
      <span className={styles.score}>
        {displayed?.score || ''}
        {showCursorScore && <span className={styles.cursor}>|</span>}
      </span>
    </div>
  )
}

export function TypewriterTop10List({ players, baseSpeed = 30 }: TypewriterTop10ListProps) {
  const [displayedPlayers, setDisplayedPlayers] = useState<DisplayedPlayer[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'name' | 'score'>('name')
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const clearTimer = () => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }
  }

  useEffect(() => {
    if (currentIndex >= players.length) return

    const player = players[currentIndex]
    const targetText = phase === 'name' ? player.name : player.score.toFixed(2)

    if (charIndex < targetText.length) {
      const delay = baseSpeed * Math.pow(0.85, charIndex)

      timerRef.current = setTimeout(() => {
        setCharIndex(charIndex + 1)
        setDisplayedPlayers(prev => {
          const updated = [...prev]
          const existing = updated[currentIndex] || { name: '', score: '' }
          updated[currentIndex] = {
            ...existing,
            [phase]: targetText.slice(0, charIndex + 1)
          }
          return updated
        })
      }, delay)

      return clearTimer
    }

    // Text complete - transition to next phase
    const delay = phase === 'name' ? 40 : 60
    timerRef.current = setTimeout(() => {
      if (phase === 'name') {
        setPhase('score')
        setCharIndex(0)
      } else {
        setCurrentIndex(prev => prev + 1)
        setPhase('name')
        setCharIndex(0)
      }
    }, delay)

    return clearTimer
  }, [currentIndex, phase, charIndex, players, baseSpeed])

  const playerPairs = useMemo(() => {
    const pairs: Array<[PlayerScore, PlayerScore | null]> = []
    for (let i = 0; i < players.length; i += 2) {
      pairs.push([players[i], players[i + 1] || null])
    }
    return pairs
  }, [players])

  if (players.length === 0) return null

  return (
    <div className={styles.typewriterList}>
      {playerPairs.map(([player1, player2], pairIndex) => {
        const index1 = pairIndex * 2
        const index2 = pairIndex * 2 + 1

        return (
          <div key={pairIndex} className={styles.typewriterRow}>
            <PlayerCell
              index={index1}
              displayed={displayedPlayers[index1]}
              showCursorName={index1 === currentIndex && phase === 'name' && charIndex < player1.name.length}
              showCursorScore={index1 === currentIndex && phase === 'score' && charIndex < player1.score.toFixed(2).length}
            />
            {player2 && (
              <PlayerCell
                index={index2}
                displayed={displayedPlayers[index2]}
                showCursorName={index2 === currentIndex && phase === 'name' && charIndex < player2.name.length}
                showCursorScore={index2 === currentIndex && phase === 'score' && charIndex < player2.score.toFixed(2).length}
              />
            )}
          </div>
        )
      })}
    </div>
  )
}
