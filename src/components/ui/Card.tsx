import { ReactNode } from 'react'

interface CardProps {
  children: ReactNode
  className?: string
  variant?: 'default' | 'glass' | 'glass-dark' | 'gradient'
}

export default function Card({ children, className = '', variant = 'default' }: CardProps) {
  const variantClasses = {
    default: 'bg-white rounded-lg shadow-md',
    glass: 'glass rounded-3xl shadow-2xl',
    'glass-dark': 'glass-dark rounded-3xl shadow-2xl',
    gradient: 'bg-gradient-to-br from-white/20 via-white/10 to-white/5 backdrop-blur-sm border border-white/20 rounded-3xl shadow-2xl'
  }
  
  return (
    <div className={`${variantClasses[variant]} ${className}`}>
      {children}
    </div>
  )
}
