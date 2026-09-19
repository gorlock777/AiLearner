import React from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

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
      {/* ── Layer 1: Ambient Glowing Multi-Color Aurora Gradients (No blank black void) ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden"
      >
        {/* Top-Center Emerald / Cyan Luminous Core */}
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.35, 0.5, 0.35],
            x: ['-50%', '-48%', '-50%'],
          }}
          transition={{
            duration: 10,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute -top-32 left-1/2 w-[750px] sm:w-[950px] h-[550px] -translate-x-1/2 rounded-[100%] bg-gradient-to-b from-emerald-500/25 via-teal-500/20 to-transparent blur-[110px]"
        />

        {/* Top-Right Indigo / Violet Cosmic Orb */}
        <motion.div
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.25, 0.4, 0.25],
            x: [0, -30, 0],
            y: [0, 40, 0],
          }}
          transition={{
            duration: 12,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-10 right-[-10%] w-[550px] sm:w-[700px] h-[450px] rounded-full bg-gradient-to-br from-indigo-500/20 via-purple-500/15 to-transparent blur-[120px]"
        />

        {/* Top-Left Sky Blue Orb */}
        <motion.div
          animate={{
            scale: [1, 1.18, 1],
            opacity: [0.2, 0.35, 0.2],
            x: [0, 40, 0],
            y: [0, -20, 0],
          }}
          transition={{
            duration: 14,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-20 left-[-10%] w-[500px] sm:w-[650px] h-[400px] rounded-full bg-gradient-to-tr from-sky-500/18 via-blue-500/12 to-transparent blur-[120px]"
        />

        {/* Center Horizon Light Beam */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-5xl h-[300px] bg-gradient-to-r from-transparent via-emerald-500/[0.08] to-transparent blur-[90px] opacity-70" />

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

