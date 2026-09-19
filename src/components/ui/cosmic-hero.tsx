import React from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

export interface CosmicHeroProps extends React.HTMLAttributes<HTMLDivElement> {
  children?: React.ReactNode
  className?: string
}

export function CosmicHero({ children, className, ...props }: CosmicHeroProps) {
  // Extended 2-scroll depth tracking (~1500px of scroll distance)
  const { scrollY } = useScroll()
  
  // Smooth spring physics for organic momentum feel
  const smoothY = useSpring(scrollY, {
    stiffness: 70,
    damping: 24,
    restDelta: 0.001,
  })

  // 1. Astrolabe Orbits 3D Deep Zoom over 2 full scrolls (0 -> 1400px)
  const orbitScale = useTransform(smoothY, [0, 1400], [1, 1.65])
  const orbitRotate = useTransform(smoothY, [0, 1400], [0, 45])
  const orbitOpacity = useTransform(smoothY, [0, 600, 1400], [0.9, 0.7, 0.3])
  const orbitY = useTransform(smoothY, [0, 1400], [0, 120])

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
        <motion.div
          animate={{
            scale: [1, 1.15, 1],
            opacity: [0.12, 0.18, 0.12],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
          className="absolute top-28 left-1/2 -translate-x-1/2 w-[700px] sm:w-[950px] h-[550px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.16)_0%,rgba(96,165,250,0.06)_40%,transparent_70%)] blur-[100px]"
        />
        
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

      {/* ── Layer 2: Highly Animated Celestial Astrolabe Orbits with Live Satellites ── */}
      <motion.div
        style={{
          scale: orbitScale,
          rotate: orbitRotate,
          opacity: orbitOpacity,
          y: orbitY,
        }}
        aria-hidden="true"
        className="pointer-events-none absolute top-8 left-1/2 -translate-x-1/2 w-[920px] h-[920px] flex items-center justify-center transform-gpu"
      >
        <svg
          className="w-full h-full text-white opacity-85"
          viewBox="0 0 900 900"
          fill="none"
        >
          <defs>
            <linearGradient id="orbit-beam-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#34d399" stopOpacity="0.7" />
              <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.4" />
              <stop offset="100%" stopColor="#34d399" stopOpacity="0.1" />
            </linearGradient>
          </defs>

          {/* 1. Counter-Rotating Astrolabe Outer Degree Ring */}
          <motion.g
            animate={{ rotate: -360 }}
            transition={{ duration: 120, repeat: Infinity, ease: 'linear' }}
            style={{ transformOrigin: '450px 450px' }}
          >
            <circle cx="450" cy="450" r="420" stroke="rgba(255,255,255,0.08)" strokeWidth="1" />
            <circle cx="450" cy="450" r="410" stroke="rgba(255,255,255,0.05)" strokeWidth="1" strokeDasharray="3 14" />
            <circle cx="450" cy="450" r="390" stroke="rgba(255,255,255,0.03)" strokeWidth="1" strokeDasharray="1 8" />
          </motion.g>

          {/* 2. Pulsing Inner Circular Orbits */}
          <circle cx="450" cy="450" r="150" stroke="rgba(255,255,255,0.12)" strokeWidth="1" strokeDasharray="4 8" />
          <circle cx="450" cy="450" r="250" stroke="url(#orbit-beam-emerald)" strokeWidth="1.2" />
          <circle cx="450" cy="450" r="330" stroke="rgba(255,255,255,0.07)" strokeWidth="1" strokeDasharray="6 10" />

          {/* 3. Tilted Keplerian Elliptical Planetary Trajectories with Orbiting Waves */}
          <ellipse cx="450" cy="450" rx="380" ry="190" transform="rotate(-28 450 450)" stroke="rgba(52,211,153,0.22)" strokeWidth="1.2" strokeDasharray="6 6" />
          <ellipse cx="450" cy="450" rx="320" ry="150" transform="rotate(35 450 450)" stroke="rgba(96,165,250,0.16)" strokeWidth="1" strokeDasharray="4 8" />

          {/* 4. Coordinate Axis Crosshairs */}
          <line x1="450" y1="20" x2="450" y2="880" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 8" />
          <line x1="20" y1="450" x2="880" y2="450" stroke="rgba(255,255,255,0.04)" strokeWidth="1" strokeDasharray="4 8" />

          {/* 5. Revolving Planetary Knowledge Satellites with Continuous Orbital Motion */}
          <g transform="translate(450, 450)">
            {/* Origin Pulsar Core with Harmonic Pulse */}
            <circle cx="0" cy="0" r="5" fill="#34d399" />
            <motion.circle
              cx="0"
              cy="0"
              r="18"
              stroke="rgba(52,211,153,0.4)"
              strokeWidth="1"
              animate={{
                r: [16, 26, 16],
                opacity: [0.6, 0.1, 0.6],
              }}
              transition={{
                duration: 3,
                repeat: Infinity,
                ease: 'easeInOut',
              }}
            />

            {/* Orbiting Satellite Layer 1: Clockwise Revolution (Qubit |ψ⟩) */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 32, repeat: Infinity, ease: 'linear' }}
            >
              <g transform="translate(250, 0)">
                <circle cx="0" cy="0" r="5" fill="#34d399" />
                <circle cx="0" cy="0" r="12" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />
                <text x="14" y="4" fill="#d4d4d8" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">
                  |ψ⟩ STATE
                </text>
              </g>
            </motion.g>

            {/* Orbiting Satellite Layer 2: Counter-Clockwise Revolution (Planck Constant ħ) */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 48, repeat: Infinity, ease: 'linear' }}
            >
              <g transform="translate(-330, 0)">
                <circle cx="0" cy="0" r="4.5" fill="#e4e4e7" />
                <circle cx="0" cy="0" r="10" stroke="rgba(255,255,255,0.2)" strokeWidth="1" />
                <text x="-140" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">
                  ħ = 1.054×10⁻³⁴ J·s
                </text>
              </g>
            </motion.g>

            {/* Orbiting Satellite Layer 3: Elliptical Revolution (Entropy ΔS) */}
            <motion.g
              animate={{ rotate: 360 }}
              transition={{ duration: 40, repeat: Infinity, ease: 'linear' }}
            >
              <g transform="translate(0, 200)">
                <circle cx="0" cy="0" r="5" fill="#fbbf24" />
                <circle cx="0" cy="0" r="11" stroke="rgba(251,191,36,0.3)" strokeWidth="1" />
                <text x="14" y="4" fill="#fbbf24" fontSize="10" fontFamily="JetBrains Mono">
                  ΔS ≥ 0 RECALL
                </text>
              </g>
            </motion.g>

            {/* Orbiting Satellite Layer 4: Deep Elliptical (Raft Consensus Ω) */}
            <motion.g
              animate={{ rotate: -360 }}
              transition={{ duration: 60, repeat: Infinity, ease: 'linear' }}
            >
              <g transform="translate(0, -280)">
                <circle cx="0" cy="0" r="4.5" fill="#34d399" />
                <circle cx="0" cy="0" r="10" stroke="rgba(52,211,153,0.2)" strokeWidth="1" />
                <text x="14" y="4" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono">
                  Ω QUORUM (N/2+1)
                </text>
              </g>
            </motion.g>

            {/* Static Astrolabe Astronomical Telemetry */}
            <text x="320" y="-390" fill="#71717a" fontSize="8" fontFamily="JetBrains Mono">
              RA 14h 29m · DEC -62°40′
            </text>
            <text x="-390" y="400" fill="#71717a" fontSize="8" fontFamily="JetBrains Mono">
              EPOCH 2026.0 · CELESTIAL RECALL
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
