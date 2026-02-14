/**
 * Expander Component
 * Collapsible/accordion section for revealing hidden content
 * Used for formula explanation in Scoring Method page
 */

import { useState, useRef, useEffect } from 'react'
import styles from './Expander.module.css'

interface ExpanderProps {
  title: string
  children: React.ReactNode
  defaultOpen?: boolean
}

export function Expander({ title, children, defaultOpen = false }: ExpanderProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const contentRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState<number | 'auto'>(defaultOpen ? 'auto' : 0)

  useEffect(() => {
    if (contentRef.current) {
      setHeight(isOpen ? contentRef.current.scrollHeight : 0)
    }
  }, [isOpen])

  const toggle = () => setIsOpen(!isOpen)

  return (
    <div className={styles.container}>
      <button 
        className={styles.header}
        onClick={toggle}
        aria-expanded={isOpen}
      >
        <span className={styles.title}>{title}</span>
        <span className={`${styles.icon} ${isOpen ? styles.open : ''}`}>
          ▼
        </span>
      </button>
      
      <div 
        className={styles.content}
        style={{ height: typeof height === 'number' ? height : height }}
      >
        <div ref={contentRef} className={styles.inner}>
          {children}
        </div>
      </div>
    </div>
  )
}

export default Expander
