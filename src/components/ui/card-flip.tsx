import * as React from 'react'
import { motion } from 'framer-motion'
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
  return (
    <div
      onClick={onFlip}
      className={cn(
        'relative w-full cursor-pointer select-none [perspective:1200px]',
        className
      )}
      {...props}
    >
      <motion.div
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{
          duration: 0.45,
          type: 'spring',
          stiffness: 260,
          damping: 24,
        }}
        className="relative w-full h-full [transform-style:preserve-3d]"
      >
        {/* Front Face */}
        <div className="w-full h-full [backface-visibility:hidden]">
          {front}
        </div>

        {/* Back Face */}
        <div className="absolute inset-0 w-full h-full [transform:rotateY(180deg)] [backface-visibility:hidden]">
          {back}
        </div>
      </motion.div>
    </div>
  )
}
