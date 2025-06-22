import React from 'react'
import { cn } from '@/lib/utils'

interface LoaderProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'dots' | 'spinner'
}

const Loader: React.FC<LoaderProps> = ({ 
  className, 
  size = 'md', 
  variant = 'default' 
}) => {
  const sizeClasses = {
    sm: 'w-4 h-4',
    md: 'w-8 h-8', 
    lg: 'w-12 h-12'
  }

  if (variant === 'dots') {
    return (
      <div className={cn('flex space-x-1', className)}>
        <div className={cn('bg-current rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '0ms' }}></div>
        <div className={cn('bg-current rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '150ms' }}></div>
        <div className={cn('bg-current rounded-full animate-bounce', sizeClasses[size])} style={{ animationDelay: '300ms' }}></div>
      </div>
    )
  }

  if (variant === 'spinner') {
    return (
      <div 
        className={cn(
          'border-2 border-current border-t-transparent rounded-full animate-spin',
          sizeClasses[size],
          className
        )}
      />
    )
  }

  // Default loader with custom CSS animation
  return (
    <div 
      className={cn(
        'loader-custom border-2 border-current',
        sizeClasses[size],
        className
      )}
    />
  )
}

export { Loader }