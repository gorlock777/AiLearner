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
      color: 'rgba(255, 255, 255, 0.08)',
      width: 1,
      duration: 18 + position * 2,
    },
    {
      d: `M-${100 - position * 30} ${200 + position * 40}C${400 + position * 50} ${50 + position * 30} ${900 + position * 20} ${450 - position * 40} ${1600 - position * 30} ${200 + position * 20}`,
      color: 'rgba(52, 211, 153, 0.12)',
      width: 1,
      duration: 22 + position * 3,
    },
    {
      d: `M-${300 + position * 50} ${400 - position * 30}C${300 - position * 40} ${600 + position * 20} ${800 + position * 60} ${100 - position * 50} ${1500 + position * 20} ${550 - position * 40}`,
      color: 'rgba(255, 255, 255, 0.05)',
      width: 1,
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
        className="w-full h-full opacity-60"
        viewBox="0 0 1400 800"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid slice"
      >
        {[0, 1, 2, 3].map((pos) => (
          <FloatingPath key={pos} position={pos} />
        ))}
      </svg>
    </div>
  )
}

export default BackgroundPaths

