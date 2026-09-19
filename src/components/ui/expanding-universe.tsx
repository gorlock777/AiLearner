import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ExpandingUniverseProps {
  children?: React.ReactNode
  className?: string
}

export function ExpandingUniverse({ children, className }: ExpandingUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll tracking across 200vh
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Physics spring for silky smooth choreography
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 80,
    damping: 24,
    restDelta: 0.001,
  })

  // 1. Cosmic Celestial Orbits: Starts centered, expands in scale
  const universeScale = useTransform(smoothProgress, [0, 0.75], [1, 2.4])
  const universeOpacity = useTransform(smoothProgress, [0, 0.5, 0.9], [0.8, 0.5, 0.12])
  const universeRotate = useTransform(smoothProgress, [0, 1], [0, 25])

  // 2. Title Transition: Starts centered, then glides to the left side
  // On large screens, translating by 280px centers it initially, then 0px docks it to the left
  const titleX = useTransform(smoothProgress, [0, 0.5], [260, 0])
  const titleScale = useTransform(smoothProgress, [0, 0.5], [1.02, 0.96])
  const titleTextCenter = useTransform(smoothProgress, [0, 0.35], [1, 0]) // For crossfade if needed

  // 3. Second Box (LivePreviewBento): Hidden at start, emerges on the right side as title moves left
  const bentoOpacity = useTransform(smoothProgress, [0.18, 0.52], [0, 1])
  const bentoScale = useTransform(smoothProgress, [0.18, 0.55], [0.82, 1.0])
  const bentoY = useTransform(smoothProgress, [0.18, 0.55], [50, 0])
  const bentoX = useTransform(smoothProgress, [0.18, 0.55], [40, 0])
  const bentoPointerEvents = useTransform(smoothProgress, (v) => (v > 0.3 ? 'auto' : 'none'))

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-h-[200vh] w-full bg-[#0d0e12] text-zinc-100 select-none overflow-x-clip',
        className
      )}
    >
      {/* ── Sticky Viewport Window (Centered & Never Cut Off) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-8 lg:px-12">
        
        {/* ── Cosmic Ambient Atmosphere ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu"
        >
          {/* Central Solar Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[850px] sm:w-[1050px] h-[750px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0%,rgba(96,165,250,0.04)_40%,transparent_70%)] blur-[110px]" />
          
          {/* Fine Astrolabe Grid */}
          <div
            className="absolute inset-0 opacity-25 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.14) 1px, transparent 1px)',
              backgroundSize: '28px 28px',
            }}
          />
        </div>

        {/* ── Enhanced Celestial Astrolabe Orbits ── */}
        <motion.div
          style={{
            scale: universeScale,
            opacity: universeOpacity,
            rotate: universeRotate,
          }}
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 w-full h-full flex items-center justify-center transform-gpu"
        >
          <svg
            className="w-[920px] h-[920px] max-w-none text-white opacity-80"
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

            {/* Orbit Science Constants & Astrodynamics */}
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
            </g>
          </svg>
        </motion.div>

        {/* ── Main Side-by-Side Responsive Grid Container ── */}
        <div className="relative z-20 w-full max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-center justify-between">
          
          {/* ── Left Column: Headline (Centered at Start, Glides to Left) ── */}
          <motion.div
            style={{
              x: titleX,
              scale: titleScale,
            }}
            className="lg:col-span-5 flex flex-col items-center lg:items-start text-center lg:text-left z-20 pointer-events-auto"
          >
            <h1 className="font-heading font-normal text-4xl sm:text-5xl lg:text-[3.6rem] leading-[1.08] tracking-tight text-white mb-5 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
              Turn dense notes <br className="hidden sm:inline" />
              into effortless recall.
            </h1>

            <p className="max-w-md text-sm sm:text-base text-zinc-300 leading-relaxed font-sans mb-6">
              Eureka decomposes complex lecture notes and textbooks into 3D active flashcards,
              spaced memory intervals, and diagnostic test insights.
            </p>
          </motion.div>

          {/* ── Right Column: Second Box (LivePreviewBento - Emerges on Scroll) ── */}
          <motion.div
            style={{
              opacity: bentoOpacity,
              scale: bentoScale,
              y: bentoY,
              x: bentoX,
              pointerEvents: bentoPointerEvents,
            }}
            className="lg:col-span-7 w-full z-20"
          >
            {children}
          </motion.div>

        </div>

      </div>
    </div>
  )
}

export default ExpandingUniverse
