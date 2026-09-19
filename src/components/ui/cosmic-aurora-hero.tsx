import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'
import { BackgroundPaths } from './background-paths'

export interface CosmicAuroraHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function CosmicAuroraHero({ children, className, ...props }: CosmicAuroraHeroProps) {
  return (
    <div
      className={cn(
        'relative min-h-[90vh] md:min-h-screen w-full overflow-hidden bg-[#070709] flex flex-col items-center justify-center pt-24 pb-20 px-6',
        className
      )}
      {...props}
    >
      {/* ── Layer 0: Kokonut UI Animated Background Paths ── */}
      <BackgroundPaths />

      {/* ── Layer 1: High-Performance Studio Radial Lighting (Zero Purple, Zero Frame Drop) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu"
      >
        {/* Top-Center Warm Studio Radial Accent */}
        <div className="absolute -top-40 left-1/2 w-[800px] h-[500px] -translate-x-1/2 rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.12)_0%,rgba(24,24,27,0.4)_50%,transparent_70%)] blur-[80px]" />

        {/* Center Minimal Ambient Atmosphere */}
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl h-[260px] bg-[radial-gradient(ellipse_at_center,rgba(255,255,255,0.04)_0%,transparent_70%)] blur-[60px]" />

        {/* Bottom Fade to Canvas */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[#070709] to-transparent" />
      </div>

      {/* ── Layer 2: Precision Dot Matrix Grid with Radial Mask ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
        style={{
          backgroundImage:
            'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
          backgroundSize: '28px 28px',
        }}
      />

      {/* ── Layer 3: Foreground Content (Spacious, High-End Luxury) ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {children}
      </div>
    </div>
  )
}

export default CosmicAuroraHero

