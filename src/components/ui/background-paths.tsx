import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface BackgroundPathsProps {
  className?: string
}

function FloatingPath({ position }: { position: number }) {
  // Generate harmonious bezier curves flowing across the canvas
  const paths = [
    {
      d: `M-${200 + position * 40} -${50 + position * 20}C${200 + position * 30} ${150 + position * 40} ${600 - position * 20} ${250 - position * 30} ${1400 + position * 40} ${400 + position * 60}`,
      color: 'rgba(52, 211, 153, 0.22)',
      width: 1.5,
      duration: 18 + position * 2,
    },
    {
      d: `M-${100 - position * 30} ${200 + position * 40}C${400 + position * 50} ${50 + position * 30} ${900 + position * 20} ${450 - position * 40} ${1600 - position * 30} ${200 + position * 20}`,
      color: 'rgba(96, 165, 250, 0.18)',
      width: 1.2,
      duration: 22 + position * 3,
    },
    {
      d: `M-${300 + position * 50} ${400 - position * 30}C${300 - position * 40} ${600 + position * 20} ${800 + position * 60} ${100 - position * 50} ${1500 + position * 20} ${550 - position * 40}`,
      color: 'rgba(167, 139, 250, 0.15)',
      width: 1.4,
      duration: 20 + position * 2.5,
    },
  ]

  return (
    <>
      {paths.map((path, idx) => (
        <motion.path
          key={idx}
          d={path.d}
          stroke={path.color}
          strokeWidth={path.width}
          fill="none"
          initial={{ pathLength: 0.1, opacity: 0 }}
          animate={{
            pathLength: [0.15, 0.95, 0.15],
            pathOffset: [0, 1, 0],
            opacity: [0.15, 0.65, 0.15],
          }}
          transition={{
            duration: path.duration,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: position * 0.8 + idx * 1.2,
          }}
        />
      ))}
    </>
  )
}

export function BackgroundPaths({ className }: BackgroundPathsProps) {
  return (
    <div
      aria-hidden="true"
      className={cn(
        'pointer-events-none absolute inset-0 overflow-hidden select-none',
        className
      )}
    >
      <svg
        className="w-full h-full opacity-70"
        viewBox="0 0 1400 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        <defs>
          <linearGradient id="glow-grad-emerald" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#34d399" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#60a5fa" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#a78bfa" stopOpacity="0" />
          </linearGradient>
        </defs>

        {[0, 1, 2, 3, 4, 5].map((pos) => (
          <FloatingPath key={pos} position={pos} />
        ))}
      </svg>

      {/* Subtle floating luminous particles */}
      {[...Array(6)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute rounded-full bg-emerald-400/20 blur-[2px]"
          style={{
            width: 3 + (i % 3) * 2,
            height: 3 + (i % 3) * 2,
            left: `${15 + (i * 15)}%`,
            top: `${20 + ((i * 13) % 60)}%`,
          }}
          animate={{
            y: [0, -35, 0],
            x: [0, (i % 2 === 0 ? 20 : -20), 0],
            opacity: [0.2, 0.8, 0.2],
            scale: [1, 1.4, 1],
          }}
          transition={{
            duration: 8 + i * 2,
            repeat: Infinity,
            ease: 'easeInOut',
            delay: i * 0.7,
          }}
        />
      ))}
    </div>
  )
}

export default BackgroundPaths
