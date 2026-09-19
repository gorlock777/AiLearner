import React from 'react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CosmicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function CosmicHero({ children, className, ...props }: CosmicHeroProps) {
  // Gentle scroll-driven depth parallax
  const { scrollY } = useScroll()
  const orbitScale = useTransform(scrollY, [0, 800], [1, 1.35])
  const orbitRotate = useTransform(scrollY, [0, 800], [0, 20])
  const orbitOpacity = useTransform(scrollY, [0, 600], [0.85, 0.25])

  return (
    <section
      className={cn(
        'relative min-h-screen w-full overflow-hidden bg-[#0d0e12] flex flex-col items-center justify-center pt-32 pb-24 px-4 sm:px-6',
        className
      )}
      {...props}
    >
      {/* ── Layer 1: Ambient Space Atmosphere ── */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu"
      >
        {/* Soft Central Solar Core */}
        <div className="absolute top-28 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.12)_0%,rgba(96,165,250,0.05)_40%,transparent_70%)] blur-[100px]" />
        
        {/* Fine Astrolabe Grid Pattern */}
        <div
          className="absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_40%,#000_70%,transparent_100%)]"
          style={{
            backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.15) 1px, transparent 1px)',
            backgroundSize: '28px 28px',
          }}
        />

        {/* Bottom Fade into page */}
        <div className="absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-[#0d0e12] to-transparent" />
      </div>

      {/* ── Layer 2: Celestial Astrolabe Orbits with Sciency Personality ── */}
      <motion.div
        style={{
          scale: orbitScale,
          rotate: orbitRotate,
          opacity: orbitOpacity,
        }}
        aria-hidden="true"
        className="pointer-events-none absolute top-12 left-1/2 -translate-x-1/2 w-[900px] h-[900px] flex items-center justify-center transform-gpu"
      >
        <svg
          className="w-full h-full text-white opacity-70"
          viewBox="0 0 900 900"
          fill="none"
        >
          {/* Outer Astrolabe Degree Ring with Ticks */}
          <circle cx="450" cy="450" r="410" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
          <circle cx="450" cy="450" r="400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="2 12" />

          {/* Inner Circular Orbits */}
          <circle cx="450" cy="450" r="160" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="450" cy="450" r="260" stroke="rgba(52,211,153,0.3)" strokeWidth="1.2" />
          <circle cx="450" cy="450" r="340" stroke="rgba(255,255,255,0.06)" strokeWidth="1" strokeDasharray="6 10" />

          {/* Tilted Keplerian Elliptical Planetary Trajectories */}
          <ellipse cx="450" cy="450" rx="380" ry="200" transform="rotate(-28 450 450)" stroke="rgba(52,211,153,0.18)" strokeWidth="1.2" strokeDasharray="6 6" />
          <ellipse cx="450" cy="450" rx="320" ry="160" transform="rotate(35 450 450)" stroke="rgba(96,165,250,0.14)" strokeWidth="1" />

          {/* Coordinate Axis Crosshairs */}
          <line x1="450" y1="30" x2="450" y2="870" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="30" y1="450" x2="870" y2="450" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="4 8" />

          {/* Orbit Science Constants & Astronomical Telemetry */}
          <g transform="translate(450, 450)">
            {/* Origin Core */}
            <circle cx="0" cy="0" r="5" fill="#34d399" />
            <circle cx="0" cy="0" r="18" stroke="rgba(52,211,153,0.3)" strokeWidth="1" strokeDasharray="3 3" />

            {/* Satellite 1: Quantum Superposition |ψ⟩ */}
            <g transform="translate(184, -184)">
              <circle cx="0" cy="0" r="5" fill="#34d399" />
              <circle cx="0" cy="0" r="12" stroke="rgba(52,211,153,0.25)" strokeWidth="1" />
              <text x="14" y="4" fill="#d4d4d8" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">
                |ψ⟩ = α|0⟩ + β|1⟩
              </text>
            </g>

            {/* Satellite 2: Planck Quantum Action ħ */}
            <g transform="translate(-255, 80)">
              <circle cx="0" cy="0" r="4.5" fill="#e4e4e7" />
              <text x="-135" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">
                ħ = 1.054×10⁻³⁴ J·s
              </text>
            </g>

            {/* Satellite 3: Entropy Growth ΔS */}
            <g transform="translate(120, 320)">
              <circle cx="0" cy="0" r="5" fill="#fbbf24" />
              <text x="14" y="4" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                ΔS ≥ 0 RECALL
              </text>
            </g>

            {/* Satellite 4: Raft Consensus Epoch Ω */}
            <g transform="translate(-200, -290)">
              <circle cx="0" cy="0" r="4.5" fill="#34d399" />
              <text x="-85" y="4" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">
                Ω QUORUM (N/2+1)
              </text>
            </g>

            {/* Astronomical Telemetry */}
            <text x="320" y="-380" fill="#71717a" fontSize="8" fontFamily="JetBrains Mono">
              RA 14h 29m · DEC -62°40′
            </text>
            <text x="-380" y="390" fill="#71717a" fontSize="8" fontFamily="JetBrains Mono">
              EPOCH 2026.0 · CELESTIAL ENGINE
            </text>
          </g>
        </svg>
      </motion.div>

      {/* ── Layer 3: Foreground Centered Content ── */}
      <div className="relative z-10 w-full max-w-5xl mx-auto flex flex-col items-center text-center">
        {children}
      </div>
    </section>
  )
}

export default CosmicHero
