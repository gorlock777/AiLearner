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

  // Smooth physics spring for organic cosmic expansion
  const smoothProgress = useSpring(scrollYProgress, {
    stiffness: 70,
    damping: 20,
    restDelta: 0.001,
  })

  // 1. Cosmic Orbits Expansion (scale 1.0 -> 2.6 as you scroll down)
  const universeScale = useTransform(smoothProgress, [0, 0.75], [1, 2.4])
  const universeOpacity = useTransform(smoothProgress, [0, 0.45, 0.85], [0.85, 0.6, 0.15])
  const universeRotate = useTransform(smoothProgress, [0, 1], [0, 35])

  // 2. Headline Focus & Disperse
  const headlineOpacity = useTransform(smoothProgress, [0, 0.28], [1, 0])
  const headlineY = useTransform(smoothProgress, [0, 0.28], [0, -50])
  const headlineScale = useTransform(smoothProgress, [0, 0.28], [1, 0.95])

  // 3. Central Study Canvas Zoom-In Expansion (scale 0.84 -> 1.0)
  const canvasScale = useTransform(smoothProgress, [0.15, 0.65], [0.84, 1.0])
  const canvasOpacity = useTransform(smoothProgress, [0.1, 0.45], [0.4, 1])
  const canvasY = useTransform(smoothProgress, [0.15, 0.65], [60, 0])

  return (
    <div
      ref={containerRef}
      className={cn(
        'relative min-h-[170vh] w-full bg-[#fafaf8] text-stone-900 overflow-hidden select-none',
        className
      )}
    >
      {/* ── Sticky Viewport Window ── */}
      <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col items-center justify-center px-4 sm:px-6">
        
        {/* ── Cosmic Alabaster Ambient Atmosphere ── */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 overflow-hidden transform-gpu"
        >
          {/* Subtle Warm Solar Halo */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] sm:w-[900px] h-[700px] rounded-full bg-[radial-gradient(circle_at_center,rgba(5,150,105,0.06)_0%,rgba(217,119,6,0.03)_40%,transparent_70%)] blur-[90px]" />
          
          {/* Fine Academic Grid Texture */}
          <div
            className="absolute inset-0 opacity-40 [mask-image:radial-gradient(ellipse_60%_50%_at_50%_50%,#000_70%,transparent_100%)]"
            style={{
              backgroundImage: 'radial-gradient(rgba(0, 0, 0, 0.08) 1px, transparent 1px)',
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
            className="w-[850px] h-[850px] max-w-none text-stone-900"
            viewBox="0 0 800 800"
            fill="none"
          >
            {/* Celestial Orbits (Concentric Ellipses) */}
            <circle
              cx="400"
              cy="400"
              r="140"
              stroke="rgba(0,0,0,0.08)"
              strokeWidth="1"
              strokeDasharray="4 6"
            />
            <circle
              cx="400"
              cy="400"
              r="230"
              stroke="rgba(0,0,0,0.07)"
              strokeWidth="1"
            />
            <circle
              cx="400"
              cy="400"
              r="320"
              stroke="rgba(5,150,105,0.18)"
              strokeWidth="1.2"
              strokeDasharray="8 8"
            />
            <circle
              cx="400"
              cy="400"
              r="380"
              stroke="rgba(0,0,0,0.05)"
              strokeWidth="1"
            />

            {/* Orbit Axis Lines */}
            <line x1="400" y1="20" x2="400" y2="780" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />
            <line x1="20" y1="400" x2="780" y2="400" stroke="rgba(0,0,0,0.04)" strokeWidth="1" />

            {/* Celestial Knowledge Nodes with Science Labels */}
            <g transform="translate(400, 400)">
              {/* Node 1: Origin Core */}
              <circle cx="0" cy="0" r="4" fill="#059669" />
              <circle cx="0" cy="0" r="16" stroke="rgba(5,150,105,0.2)" strokeWidth="1" />

              {/* Node 2: Qubit State ψ */}
              <g transform="translate(162, -162)">
                <circle cx="0" cy="0" r="5" fill="#059669" />
                <text x="10" y="4" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono" letterSpacing="1">
                  |ψ⟩ STATE
                </text>
              </g>

              {/* Node 3: Planck Constant ħ */}
              <g transform="translate(-226, 70)">
                <circle cx="0" cy="0" r="4" fill="#18181b" />
                <text x="-55" y="4" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono">
                  ħ CONSTANT
                </text>
              </g>

              {/* Node 4: Entropy Synthesis ΔS */}
              <g transform="translate(100, 290)">
                <circle cx="0" cy="0" r="4.5" fill="#d97706" />
                <text x="10" y="4" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono">
                  ΔS RECALL
                </text>
              </g>

              {/* Node 5: Raft Epoch Ω */}
              <g transform="translate(-180, -260)">
                <circle cx="0" cy="0" r="4" fill="#059669" />
                <text x="-65" y="4" fill="#71717a" fontSize="10" fontFamily="JetBrains Mono">
                  Ω QUORUM
                </text>
              </g>
            </g>
          </svg>
        </motion.div>

        {/* ── Stage 1: Headline Section (Fades gracefully as scroll expands cosmos) ── */}
        <motion.div
          style={{
            opacity: headlineOpacity,
            y: headlineY,
            scale: headlineScale,
          }}
          className="relative z-20 max-w-4xl mx-auto text-center flex flex-col items-center pointer-events-auto"
        >
          {/* Subtle Academic Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-stone-100/90 border border-stone-300/80 text-[11px] font-mono text-stone-700 mb-6 shadow-sm">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse" />
            <span>Eureka · Neural Active Recall Engine · Alabaster Edition</span>
          </div>

          <h1 className="font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.1rem] leading-[1.06] tracking-tight text-stone-900 mb-6 drop-shadow-sm">
            Turn dense notes <br className="hidden sm:inline" />
            into effortless recall.
          </h1>

          <p className="max-w-xl text-sm sm:text-base md:text-lg text-stone-600 leading-relaxed font-sans mb-8">
            Eureka transforms complex lecture notes and textbooks into 3D active flashcards,
            spaced memory intervals, and diagnostic test insights.
          </p>
        </motion.div>

        {/* ── Stage 2: Central Study Canvas (Scales in from 0.84 to 1.0 as universe expands) ── */}
        <motion.div
          style={{
            scale: canvasScale,
            opacity: canvasOpacity,
            y: canvasY,
          }}
          className="relative z-30 w-full max-w-4xl mx-auto -mt-6 pointer-events-auto"
        >
          {children}
        </motion.div>

      </div>
    </div>
  )
}

export default ExpandingUniverse
