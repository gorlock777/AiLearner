import { motion, type Variants } from 'framer-motion'
import { cn } from '@/lib/utils'

interface CinematicTitleProps {
  text: string
  highlight?: string
  className?: string
  subtitle?: string
}

export function CinematicTitle({
  text,
  highlight,
  className,
  subtitle,
}: CinematicTitleProps) {
  const words = text.split(' ')

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: (i = 1) => ({
      opacity: 1,
      transition: { staggerChildren: 0.08, delayChildren: 0.04 * i },
    }),
  }

  const childVariants: Variants = {
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      rotateX: 0,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 120,
      },
    },
    hidden: {
      opacity: 0,
      y: 32,
      filter: 'blur(8px)',
      rotateX: 25,
      transition: {
        type: 'spring',
        damping: 18,
        stiffness: 120,
      },
    },
  }

  return (
    <div className="flex flex-col items-center justify-center text-center">
      <motion.h1
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className={cn(
          'font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.06] tracking-tight text-white drop-shadow-[0_10px_35px_rgba(0,0,0,0.8)] perspective-[1000px]',
          className
        )}
      >
        {words.map((word, index) => {
          const isHighlight = highlight && word.toLowerCase().includes(highlight.toLowerCase())
          return (
            <motion.span
              key={index}
              variants={childVariants}
              className={cn(
                'inline-block mr-[0.25em] last:mr-0 transform-gpu',
                isHighlight && 'bg-gradient-to-r from-emerald-300 via-teal-200 to-sky-300 bg-clip-text text-transparent font-normal drop-shadow-[0_0_25px_rgba(52,211,153,0.35)]'
              )}
            >
              {word}
              {index === 2 ? <br className="hidden sm:inline" /> : null}
            </motion.span>
          )
        })}
      </motion.h1>

      {subtitle && (
        <motion.p
          initial={{ opacity: 0, y: 16, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
          transition={{ duration: 0.8, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-sans mt-7 mb-8"
        >
          {subtitle}
        </motion.p>
      )}
    </div>
  )
}

export default CinematicTitle
