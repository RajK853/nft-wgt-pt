import type { ReactNode, ButtonHTMLAttributes } from 'react'
import styles from './Button.module.css'

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
}

function Button({ children, className = '', ...props }: ButtonProps) {
  return (
    <button 
      className={`${styles.button} ${className}`} 
      {...props}
    >
      {children}
    </button>
  )
}

export default Button
