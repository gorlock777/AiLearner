import * as React from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CardFlipProps extends React.HTMLAttributes<HTMLDivElement> {
  isFlipped: boolean
  onFlip?: () => void
  front: React.ReactNode
  back: React.ReactNode
  className?: string
}

export function CardFlip({
  isFlipped,
  onFlip,
  front,
  back,
  className,
  ...props
}: CardFlipProps) {
  // Gentle 3D mouse parallax tilt
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const rotateX = useSpring(useTransform(y, [-0.5, 0.5], [6, -6]), { stiffness: 300, damping: 30 })
  const rotateY = useSpring(useTransform(x, [-0.5, 0.5], [-6, 6]), { stiffness: 300, damping: 30 })

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect()
    const normX = (e.clientX - rect.left) / rect.width - 0.5
    const normY = (e.clientY - rect.top) / rect.height - 0.5
    x.set(normX)
    y.set(normY)
  }

  const handleMouseLeave = () => {
    x.set(0)
    y.set(0)
  }

  return (
    <div
      onClick={onFlip}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className={cn(
        'relative w-full cursor-pointer select-none [perspective:1400px]',
        className
      )}
      {...props}
    >
      <motion.div
        style={{
          rotateX,
          rotateY,
          transformStyle: 'preserve-3d',
        }}
        animate={{
          rotateY: isFlipped ? 180 : 0,
        }}
        transition={{
          duration: 0.55,
          type: 'spring',
          stiffness: 200,
          damping: 22,
        }}
        className="relative w-full h-full [transform-style:preserve-3d] transition-shadow duration-300"
      >
        {/* Front Face */}
        <div
          className="w-full h-full [backface-visibility:hidden] [transform:rotateY(0deg)]"
          style={{ backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden' }}
        >
          {front}
        </div>

        {/* Back Face */}
        <div
          className="absolute inset-0 w-full h-full [backface-visibility:hidden] [transform:rotateY(180deg)]"
          style={{
            backfaceVisibility: 'hidden',
            WebkitBackfaceVisibility: 'hidden',
            transform: 'rotateY(180deg)',
          }}
        >
          {back}
        </div>
      </motion.div>
    </div>
  )
}

export default CardFlip
