import type { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'danger'
  size?: 'sm' | 'md' | 'lg'
}

function Button({ 
  children, 
  className = '', 
  variant = 'primary',
  size = 'md',
  disabled = false,
  onClick,
  ...props 
}: ButtonProps) {
  // Runtime prop validation for development
  if (process.env.NODE_ENV === 'development') {
    if (typeof children === 'undefined') {
      console.warn('Button: children prop is required')
    }
    
    if (variant && !['primary', 'secondary', 'danger'].includes(variant)) {
      console.warn(`Button: invalid variant "${variant}". Expected one of: primary, secondary, danger`)
    }
    
    if (size && !['sm', 'md', 'lg'].includes(size)) {
      console.warn(`Button: invalid size "${size}". Expected one of: sm, md, lg`)
    }
  }

  const buttonClasses = [
    styles.button,
    styles[`button--${variant}`],
    styles[`button--${size}`],
    disabled ? styles['button--disabled'] : '',
    className
  ].filter(Boolean).join(' ')

  return (
    <button 
      className={buttonClasses} 
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
