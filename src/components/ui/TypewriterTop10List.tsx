/**
 * TypewriterTop10List Component
 * Displays a top-10 list with typewriter animation effect
 * Each player's name and score animates in sequence
 * Uses exponentially decreasing speed for accelerating effect
 * Displays in 2-column layout (2 players per row)
 */

import { useState, useEffect, useRef } from 'react'
import styles from './TypewriterTop10List.module.css'

interface PlayerScore {
  name: string
  score: number
}

interface TypewriterTop10ListProps {
  players: PlayerScore[]
  baseSpeed?: number // milliseconds per character (initial speed)
}

export function TypewriterTop10List({ players, baseSpeed = 30 }: TypewriterTop10ListProps) {
  const [displayedPlayers, setDisplayedPlayers] = useState<Array<{ name: string; score: string }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'name' | 'score'>('name')
  const [charIndex, setCharIndex] = useState(0)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    if (currentIndex >= players.length) return

    const player = players[currentIndex]
    const targetText = phase === 'name' 
      ? player.name 
      : player.score.toFixed(2)

    if (charIndex < targetText.length) {
      // Exponentially decreasing speed: each character is faster than the previous
      // Using 0.85 decay factor for faster acceleration
      const delay = baseSpeed * Math.pow(0.85, charIndex)
      
      timerRef.current = setTimeout(() => {
        setCharIndex(charIndex + 1)
        if (phase === 'name') {
          setDisplayedPlayers(prev => {
            const updated = [...prev]
            updated[currentIndex] = {
              ...updated[currentIndex],
              name: targetText.slice(0, charIndex + 1)
            } as { name: string; score: string }
            return updated
          })
        } else {
          setDisplayedPlayers(prev => {
            const updated = [...prev]
            updated[currentIndex] = {
              ...updated[currentIndex],
              score: targetText.slice(0, charIndex + 1)
            } as { name: string; score: string }
            return updated
          })
        }
      }, delay)
      
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current)
      }
    } else {
      // Text complete for this phase
      if (phase === 'name') {
        // Move to score phase after a short delay
        timerRef.current = setTimeout(() => {
          setPhase('score')
          setCharIndex(0)
        }, 40)
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current)
        }
      } else {
        // Both name and score complete, move to next player
        timerRef.current = setTimeout(() => {
          setCurrentIndex(currentIndex + 1)
          setPhase('name')
          setCharIndex(0)
        }, 60)
        return () => {
          if (timerRef.current) clearTimeout(timerRef.current)
        }
      }
    }
  }, [currentIndex, phase, charIndex, players, baseSpeed])

  if (players.length === 0) return null

  // Group players into pairs for 2-column layout
  const playerPairs: Array<[PlayerScore, PlayerScore | null]> = []
  for (let i = 0; i < players.length; i += 2) {
    playerPairs.push([players[i], players[i + 1] || null])
  }

  return (
    <div className={styles.typewriterList}>
      {playerPairs.map((pair, pairIndex) => {
        const [player1, player2] = pair
        const index1 = pairIndex * 2
        const index2 = pairIndex * 2 + 1
        
        return (
          <div key={pairIndex} className={styles.typewriterRow}>
            {renderPlayer(player1, index1, displayedPlayers[index1], currentIndex, phase, charIndex)}
            {player2 && renderPlayer(player2, index2, displayedPlayers[index2], currentIndex, phase, charIndex)}
          </div>
        )
      })}
    </div>
  )

  function renderPlayer(
    player: PlayerScore,
    index: number,
    displayed: { name: string; score: string } | undefined,
    currentIndex: number,
    phase: 'name' | 'score',
    charIndex: number
  ) {
    const isCurrentOrPast = index <= currentIndex
    
    return (
      <div className={`${styles.playerCell} ${isCurrentOrPast ? styles.visible : styles.hidden}`}>
        <span className={styles.rank}>{index + 1}.</span>
        <span className={styles.name}>
          {displayed?.name || ''}
          {index === currentIndex && phase === 'name' && charIndex < player.name.length && (
            <span className={styles.cursor}>|</span>
          )}
        </span>
        <span className={styles.score}>
          {displayed?.score || ''}
          {index === currentIndex && phase === 'score' && charIndex < player.score.toFixed(2).length && (
            <span className={styles.cursor}>|</span>
          )}
        </span>
      </div>
    )
  }
}