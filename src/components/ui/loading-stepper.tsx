import * as React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Check, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface StepItem {
  id: number
  label: string
}

export interface LoadingStepperProps {
  steps: StepItem[]
  currentStep: number
  className?: string
}

export function LoadingStepper({
  steps,
  currentStep,
  className,
}: LoadingStepperProps) {
  const percentage = Math.min(100, Math.max(0, Math.round((currentStep / steps.length) * 100)))

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      {/* ── Progress bar with animated % label ── */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1 h-1.5 bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
          <motion.div
            className="h-full rounded-full"
            style={{ background: 'linear-gradient(90deg, #34d399, #60a5fa)' }}
            initial={{ width: '0%' }}
            animate={{ width: `${percentage}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
          />
          {/* Shimmer overlay */}
          <motion.div
            className="absolute inset-0 rounded-full"
            style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.15) 50%, transparent 100%)' }}
            animate={{ x: ['-100%', '200%'] }}
            transition={{ duration: 1.6, repeat: Infinity, ease: 'linear' }}
          />
        </div>
        {/* Percentage */}
        <motion.span
          key={percentage}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-[11px] font-mono text-emerald-400 w-9 text-right tabular-nums flex-shrink-0"
        >
          {percentage}%
        </motion.span>
      </div>

      {/* ── Step items — slide in one at a time ── */}
      <div className="flex flex-col gap-1.5 border border-zinc-800/60 rounded-xl bg-zinc-950/60 p-3.5 overflow-hidden">
        <AnimatePresence initial={false}>
          {steps.map((step, i) => {
            const isDone = currentStep > step.id
            const isCurrent = currentStep === step.id
            const isVisible = currentStep >= step.id

            return (
              <motion.div
                key={step.id}
                initial={{ opacity: 0, y: 14, height: 0 }}
                animate={
                  isVisible
                    ? { opacity: isDone || isCurrent ? 1 : 0.5, y: 0, height: 'auto' }
                    : { opacity: 0.3, y: 0, height: 'auto' }
                }
                transition={{
                  duration: 0.28,
                  delay: isVisible ? i * 0.06 : 0,
                  ease: [0.22, 1, 0.36, 1],
                }}
                className={cn(
                  'text-xs flex items-center justify-between font-mono py-1.5 transition-colors',
                  isDone
                    ? 'text-emerald-400'
                    : isCurrent
                    ? 'text-zinc-100 font-medium'
                    : 'text-zinc-500'
                )}
              >
                <div className="flex items-center gap-2.5">
                  <span
                    className={cn(
                      'w-5 h-5 rounded border flex items-center justify-center text-[10px] flex-shrink-0 transition-colors',
                      isDone
                        ? 'border-emerald-500/40 bg-emerald-500/10'
                        : isCurrent
                        ? 'border-zinc-500/60 bg-zinc-800/60'
                        : 'border-zinc-800 bg-zinc-900/50'
                    )}
                  >
                    {isDone ? (
                      <Check size={11} className="text-emerald-400" />
                    ) : isCurrent ? (
                      <Loader2 size={11} className="animate-spin text-zinc-300" />
                    ) : (
                      <span className="text-zinc-600">0{step.id}</span>
                    )}
                  </span>
                  <span>{step.label}</span>
                </div>

                <span
                  className={cn(
                    'text-[9px] uppercase font-mono tracking-wider px-1.5 py-0.5 rounded border',
                    isDone
                      ? 'text-emerald-400 border-emerald-500/20 bg-emerald-500/08'
                      : isCurrent
                      ? 'text-zinc-300 border-zinc-600/40 bg-zinc-800/60'
                      : 'text-zinc-600 border-zinc-800/60'
                  )}
                >
                  {isDone ? 'Done' : isCurrent ? 'Running' : 'Pending'}
                </span>
              </motion.div>
            )
          })}
        </AnimatePresence>
      </div>
    </div>
  )
}
