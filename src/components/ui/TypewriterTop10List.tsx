/**
 * TypewriterTop10List Component
 * Displays a top-10 list with typewriter animation effect
 * Each player's name and score animates in sequence
 */

import { useState, useEffect } from 'react'
import styles from './TypewriterTop10List.module.css'

interface PlayerScore {
  name: string
  score: number
}

interface TypewriterTop10ListProps {
  players: PlayerScore[]
  speed?: number // milliseconds per character
}

export function TypewriterTop10List({ players, speed = 30 }: TypewriterTop10ListProps) {
  const [displayedPlayers, setDisplayedPlayers] = useState<Array<{ name: string; score: string }>>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [phase, setPhase] = useState<'name' | 'score'>('name')
  const [charIndex, setCharIndex] = useState(0)

  useEffect(() => {
    if (currentIndex >= players.length) return

    const player = players[currentIndex]
    const targetText = phase === 'name' 
      ? player.name 
      : player.score.toFixed(2)
    const currentDisplayed = phase === 'name' 
      ? (displayedPlayers[currentIndex]?.name || '') 
      : (displayedPlayers[currentIndex]?.score || '')

    if (charIndex < targetText.length) {
      const timer = setTimeout(() => {
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
      }, speed)
      return () => clearTimeout(timer)
    } else {
      // Text complete for this phase
      if (phase === 'name') {
        // Move to score phase after a short delay
        const timer = setTimeout(() => {
          setPhase('score')
          setCharIndex(0)
        }, 100)
        return () => clearTimeout(timer)
      } else {
        // Both name and score complete, move to next player
        const timer = setTimeout(() => {
          setCurrentIndex(currentIndex + 1)
          setPhase('name')
          setCharIndex(0)
        }, 150)
        return () => clearTimeout(timer)
      }
    }
  }, [currentIndex, phase, charIndex, players, speed, displayedPlayers])

  if (players.length === 0) return null

  return (
    <div className={styles.typewriterList}>
      {players.map((player, index) => {
        const isCurrentOrPast = index <= currentIndex
        const displayed = displayedPlayers[index]
        
        return (
          <div 
            key={player.name} 
            className={`${styles.typewriterRow} ${isCurrentOrPast ? styles.visible : styles.hidden}`}
          >
            <span className={styles.rank}>{index + 1}.</span>
            <span className={styles.name}>
              {displayed?.name || ''}
              {index === currentIndex && phase === 'name' && charIndex < player.name.length && (
                <span className={styles.cursor}>|</span>
              )}
            </span>
            <span className={styles.dots}>
              {'.'.repeat(Math.max(0, 25 - player.name.length))}
            </span>
            <span className={styles.score}>
              {displayed?.score || ''}
              {index === currentIndex && phase === 'score' && charIndex < player.score.toFixed(2).length && (
                <span className={styles.cursor}>|</span>
              )}
            </span>
          </div>
        )
      })}
    </div>
  )
}