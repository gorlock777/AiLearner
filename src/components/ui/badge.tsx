import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning'
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-blue-600/15 border-blue-500/30 text-blue-400',
    secondary: 'bg-[#182030] border-[#252f44] text-slate-300',
    outline: 'border-[#252f44] text-slate-400 bg-transparent',
    destructive: 'bg-red-500/15 border-red-500/30 text-red-400',
    success: 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400',
    warning: 'bg-amber-500/15 border-amber-500/30 text-amber-400',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center rounded-md border px-2 py-0.5 text-xs font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }

