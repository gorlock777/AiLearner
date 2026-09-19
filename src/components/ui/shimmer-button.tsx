import * as React from 'react'
import { cn } from '@/lib/utils'

export interface ShimmerButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  shimmerColor?: string
  shimmerSize?: string
  borderRadius?: string
  shimmerDuration?: string
  background?: string
  className?: string
  children?: React.ReactNode
}

export const ShimmerButton = React.forwardRef<
  HTMLButtonElement,
  ShimmerButtonProps
>(
  (
    {
      shimmerColor = 'rgba(255, 255, 255, 0.2)',
      shimmerSize = '0.05em',
      shimmerDuration = '3s',
      borderRadius = '6px',
      background = 'rgba(22, 22, 26, 1)',
      className,
      children,
      disabled,
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        style={
          {
            '--spread': '90deg',
            '--shimmer-color': shimmerColor,
            '--radius': borderRadius,
            '--speed': shimmerDuration,
            '--cut': shimmerSize,
            '--bg': background,
          } as React.CSSProperties
        }
        disabled={disabled}
        className={cn(
          'group relative z-0 flex cursor-pointer items-center justify-center overflow-hidden whitespace-nowrap border border-zinc-700/80 px-4 py-1.5 text-xs font-medium text-zinc-100 [background:var(--bg)] [border-radius:var(--radius)] transition-all duration-200 hover:scale-[1.01] hover:border-zinc-500 active:scale-[0.98] disabled:pointer-events-none disabled:opacity-50',
          className
        )}
        {...props}
      >
        {/* Shimmer Border Spark */}
        <div className="absolute inset-0 -z-30 overflow-visible [container-type:size]">
          <div className="absolute inset-0 h-[100cqh] animate-shimmer-slide [aspect-ratio:1] [border-radius:0] [mask:none]">
            <div className="animate-spin-around absolute -inset-full w-auto rotate-0 [background:conic-gradient(from_calc(270deg-(var(--spread)*0.5)),transparent_0,var(--shimmer-color)_var(--spread),transparent_var(--spread))] [translate:0_0]" />
          </div>
        </div>

        {/* Content */}
        <span className="relative z-10 flex items-center gap-2">
          {children}
        </span>

        {/* Inner highlight */}
        <div className="absolute [border-radius:var(--radius)] inset-[1px] -z-10 bg-zinc-950/90 transition-colors group-hover:bg-zinc-900/90" />
      </button>
    )
  }
)

ShimmerButton.displayName = 'ShimmerButton'
