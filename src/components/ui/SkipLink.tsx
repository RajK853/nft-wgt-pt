/**
 * SkipLink Component
 * Provides keyboard-accessible skip navigation to main content
 * Addresses WCAG 2.4.1 (Bypass Blocks)
 */

interface SkipLinkProps {
  /** ID of the main content area to skip to */
  targetId?: string
}

export function SkipLink({ targetId = 'main-content' }: SkipLinkProps) {
  return (
    <a
      href={`#${targetId}`}
      className="skip-link"
      style={{
        position: 'absolute',
        top: '-100px',
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'var(--color-primary, #a855f7)',
        color: 'white',
        padding: '0.75rem 1.5rem',
        borderRadius: '0 0 0.5rem 0.5rem',
        zIndex: 9999,
        textDecoration: 'none',
        fontWeight: 600,
        transition: 'top 0.2s ease',
      }}
      onFocus={(e) => {
        e.currentTarget.style.top = '0'
      }}
      onBlur={(e) => {
        e.currentTarget.style.top = '-100px'
      }}
    >
      Skip to main content
    </a>
  )
}