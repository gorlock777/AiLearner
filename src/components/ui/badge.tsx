import * as React from 'react'
import { cn } from '@/lib/utils'

export interface BadgeProps extends React.HTMLAttributes<HTMLDivElement> {
  variant?: 'default' | 'secondary' | 'outline' | 'destructive' | 'success' | 'warning' | 'info'
}

function Badge({
  className,
  variant = 'default',
  ...props
}: BadgeProps) {
  const variantStyles = {
    default: 'bg-zinc-800 text-zinc-300 border-zinc-700/60',
    secondary: 'bg-zinc-900/80 border-zinc-800 text-zinc-400',
    outline: 'border-zinc-800 text-zinc-400 bg-transparent',
    destructive: 'bg-rose-500/10 border-rose-500/20 text-rose-400',
    success: 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400',
    warning: 'bg-amber-500/10 border-amber-500/20 text-amber-400',
    info: 'bg-blue-500/10 border-blue-500/20 text-blue-400',
  }

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1 rounded border px-1.5 py-0.5 text-[11px] font-mono font-medium transition-colors',
        variantStyles[variant],
        className
      )}
      {...props}
    />
  )
}

export { Badge }
