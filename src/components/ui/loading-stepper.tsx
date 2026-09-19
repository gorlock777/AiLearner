import * as React from 'react'
import { motion } from 'framer-motion'
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
  const percentage = Math.min(100, Math.max(0, (currentStep / steps.length) * 100))

  return (
    <div className={cn('w-full flex flex-col gap-4', className)}>
      {/* Top progress bar */}
      <div className="relative h-1 w-full bg-zinc-900 rounded-full overflow-hidden border border-zinc-800/80">
        <motion.div
          className="h-full bg-zinc-200"
          initial={{ width: '0%' }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 0.35, ease: 'easeOut' }}
        />
      </div>

      {/* Step items */}
      <div className="flex flex-col gap-2 border border-zinc-800/80 rounded-lg bg-zinc-950/60 p-3.5">
        {steps.map((step) => {
          const isDone = currentStep > step.id
          const isCurrent = currentStep === step.id

          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0.6 }}
              animate={{
                opacity: isDone || isCurrent ? 1 : 0.5,
              }}
              className={cn(
                'text-xs flex items-center justify-between font-mono py-1 transition-colors',
                isDone
                  ? 'text-emerald-400'
                  : isCurrent
                  ? 'text-zinc-100 font-medium'
                  : 'text-zinc-400'
              )}
            >
              <div className="flex items-center gap-2.5">
                <span className="w-5 h-5 rounded border flex items-center justify-center text-[10px]">
                  {isDone ? (
                    <Check size={11} className="text-emerald-400" />
                  ) : isCurrent ? (
                    <Loader2 size={11} className="animate-spin text-zinc-300" />
                  ) : (
                    <span className="text-zinc-400">0{step.id}</span>
                  )}
                </span>
                <span>{step.label}</span>
              </div>

              <span className="text-[10px] uppercase font-mono tracking-wider">
                {isDone ? 'COMPLETE' : isCurrent ? 'PROCESSING' : 'PENDING'}
              </span>
            </motion.div>
          )
        })}
      </div>
    </div>
  )
}
