import { useRef } from 'react'
import { motion, useScroll, useTransform, useSpring } from 'framer-motion'
import { cn } from '@/lib/utils'

interface ExpandingUniverseProps {
  children?: React.ReactNode
  className?: string
}

export function ExpandingUniverse({ children, className }: ExpandingUniverseProps) {
  const containerRef = useRef<HTMLDivElement>(null)

  // Scroll tracking across the cosmic expansion stage
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ['start start', 'end end'],
  })

  // Physics spring for silky smooth expansion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 85,
    damping: 24,
    restDelta: 0.001,
  })

  // 1. Cosmic Orbits Expansion (scale 1.0 -> 2.5)
  const universeScale = useTransform(smoothProgress, [0, 0.75], [1, 2.3])
  const universeOpacity = useTransform(smoothProgress, [0, 0.5, 0.9], [0.8, 0.55, 0.15])
  const universeRotate = useTransform(smoothProgress, [0, 1], [0, 25])

  // 2. Stage 1: Headline (fades gracefully as user scrolls)
  const headlineOpacity = useTransform(smoothProgress, [0, 0.22], [1, 0])
  const headlineY = useTransform(smoothProgress, [0, 0.22], [0, -40])
  const headlineScale = useTransform(smoothProgress, [0, 0.22], [1, 0.94])
  const headlinePointerEvents = useTransform(smoothProgress, (v) => (v < 0.2 ? 'auto' : 'none'))

  // 3. Stage 2: Central Study Canvas (zooms in from 0.88 -> 1.0 without ANY cutoff)
  const canvasScale = useTransform(smoothProgress, [0.12, 0.55], [0.88, 1.0])
  const canvasOpacity = useTransform(smoothProgress, [0.1, 0.38], [0, 1])
  const canvasY = useTransform(smoothProgress, [0.12, 0.55], [40, 0])
  const canvasPointerEvents = useTransform(smoothProgress, (v) => (v > 0.25 ? 'auto' : 'none'))

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-h-[190vh] w-full bg-[#0d0e12] text-zinc-100 select-none',
        className
      )}
    >
      {/* ── Sticky Viewport Window (Centered, No Clipping) ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center px-4 sm:px-6">
        
        {/* ── Lunar Space Atmosphere ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu"
        >
          {/* Subtle Radial Glow */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] sm:w-[950px] h-[650px] rounded-full bg-[radial-gradient(circle_at_center,rgba(52,211,153,0.08)_0%,rgba(96,165,250,0.04)_40%,transparent_70%)] blur-[100px]" />
          
          {/* Fine Stardust Grid Texture */}
          <div
            className="absolute inset-0 opacity-30 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            style={{
              backgroundImage: 'radial-gradient(rgba(255, 255, 255, 0.12) 1px, transparent 1px)',
              backgroundSize: '24px 24px',
            }}
          />
        </div>

        {/* ── Expanding Celestial Universe Vector Constellation ── */}
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
            className="w-[850px] h-[850px] max-w-none text-white"
            viewBox="0 0 800 800"
            fill="none"
          >
            {/* Celestial Orbits (Concentric Ellipses) */}
            <circle
              cx="400"
              cy="400"
              r="140"
              stroke="rgba(255,255,255,0.09)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="400"
              cy="400"
              r="230"
              stroke="rgba(255,255,255,0.07)"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="320"
              stroke="rgba(52,211,153,0.22)"
              strokeWidth="1.2"
              strokeDasharray="8 8"
            />
            <circle
              cx="400"
              cy="400"
              r="380"
              stroke="rgba(255,255,255,0.05)"
              strokeWidth="1"
            />

            {/* Orbit Axis Lines */}
            <line x1="400" y1="20" x2="400" y2="780" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />
            <line x1="20" y1="400" x2="780" y2="400" stroke="rgba(255,255,255,0.04)" strokeWidth="1" />

            {/* Celestial Knowledge Nodes with Science Labels */}
            <g transform="translate(400, 400)">
              {/* Node 1: Origin Core */}
              <circle cx="0" cy="0" r="4" fill="#34d399" />
              <circle cx="0" cy="0" r="16" stroke="rgba(52,211,153,0.3)" strokeWidth="1" />

              {/* Node 2: Qubit State ψ */}
              <g transform="translate(162, -162)">
                <circle cx="0" cy="0" r="5" fill="#34d399" />
                <text x="10" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">
                  |ψ⟩ STATE
                </text>
              </g>

              {/* Node 3: Planck Constant ħ */}
              <g transform="translate(-226, 70)">
                <circle cx="0" cy="0" r="4" fill="#e4e4e7" />
                <text x="-55" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">
                  ħ CONSTANT
                </text>
              </g>

              {/* Node 4: Entropy Synthesis ΔS */}
              <g transform="translate(100, 290)">
                <circle cx="0" cy="0" r="4.5" fill="#fbbf24" />
                <text x="10" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">
                  ΔS RECALL
                </text>
              </g>

              {/* Node 5: Raft Epoch Ω */}
              <g transform="translate(-180, -260)">
                <circle cx="0" cy="0" r="4" fill="#34d399" />
                <text x="-65" y="4" fill="#a1a1aa" fontSize="10" fontFamily="JetBrains Mono">
                  Ω QUORUM
                </text>
              </g>
            </g>
          </svg>
        </motion.div>

        {/* ── Stage 1: Headline Section (Centered Overlay) ── */}
        <motion.div
          style={{
            opacity: headlineOpacity,
            y: headlineY,
            scale: headlineScale,
            pointerEvents: headlinePointerEvents,
          }}
          className="absolute z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center"
        >
          {/* Subtle Ambient Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-300 mb-6 shadow-sm backdrop-blur-md">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Eureka · Neural Active Recall Engine · Lunar Edition</span>
          </div>

          <h1 className="font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.2rem] leading-[1.05] tracking-tight text-white mb-6 drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)]">
            Turn dense notes <br className="hidden sm:inline" />
            into effortless recall.
          </h1>

          <p className="max-w-xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-sans mb-8">
            Eureka transforms complex lecture notes and textbooks into 3D active flashcards,
            spaced memory intervals, and diagnostic test insights.
          </p>
        </motion.div>

        {/* ── Stage 2: Central Study Canvas (Zooms In to Center, Never Cut Off) ── */}
        <motion.div
          style={{
            scale: canvasScale,
            opacity: canvasOpacity,
            y: canvasY,
            pointerEvents: canvasPointerEvents,
          }}
          className="relative z-30 w-full max-w-4xl mx-auto"
        >
          {children}
        </motion.div>

      </div>
    </div>
  )
}

export default ExpandingUniverse
