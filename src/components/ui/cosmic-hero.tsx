import React from 'react'
import { cn } from '@/lib/utils'
import { CosmicCanvas } from './cosmic-canvas'

export interface CosmicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function CosmicHero({ children, className, ...props }: CosmicHeroProps) {
  return (
    <section
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-[#0d0e12] flex flex-col items-center justify-center pt-32 pb-24 px-4 sm:px-6',
        className
      )}
      {...props}
    >
      {/* ── Layer 1: Hardware-Accelerated 60fps HTML5 Space Canvas ── */}
      <CosmicCanvas className="absolute inset-0 w-full h-full pointer-events-none z-0" />

      {/* ── Layer 2: Subtle Ambient Light Glow (Zero Blur GPU Layer) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden z-0"
      >
        <div className="absolute top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[960px] h-[540px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.12)_0%,rgba(52,211,153,0.03)_40%,transparent_70%)]" />
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0e12] to-transparent" />
      </div>

      {/* ── Layer 3: Foreground Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {children}
      </div>
    </section>
  )
}

export default CosmicHero
