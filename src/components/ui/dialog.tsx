import * as React from 'react'
import { motion, AnimatePresence, type HTMLMotionProps } from 'framer-motion'
import { X } from 'lucide-react'
import { cn } from '../../lib/utils'

interface DialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  children: React.ReactNode
}

interface DialogContentProps extends HTMLMotionProps<'div'> {
  children: React.ReactNode
  className?: string
  showClose?: boolean
}

const DialogContext = React.createContext<{
  open: boolean
  onOpenChange: (open: boolean) => void
}>({
  open: false,
  onOpenChange: () => {},
})

export function Dialog({ open, onOpenChange, children }: DialogProps) {
  return (
    <DialogContext.Provider value={{ open, onOpenChange }}>
      <AnimatePresence>{open && children}</AnimatePresence>
    </DialogContext.Provider>
  )
}

export function DialogContent({
  children,
  className,
  showClose = true,
  ...props
}: DialogContentProps) {
  const { onOpenChange } = React.useContext(DialogContext)

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.15 }}
        onClick={() => onOpenChange(false)}
        className="fixed inset-0 bg-black/75 backdrop-blur-sm"
      />

      {/* Modal Dialog */}
      <motion.div
        initial={{ opacity: 0, scale: 0.96, y: 8 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.96, y: 8 }}
        transition={{ duration: 0.18, ease: 'easeOut' }}
        className={cn(
          'relative z-50 w-full max-w-lg rounded-xl border border-zinc-800 bg-[#0c0c0e] p-6 shadow-2xl text-zinc-100',
          className
        )}
        {...props}
      >
        {showClose && (
          <button
            onClick={() => onOpenChange(false)}
            className="absolute right-4 top-4 rounded-md p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
          >
            <X size={14} />
            <span className="sr-only">Close</span>
          </button>
        )}
        {children}
      </motion.div>
    </div>
  )
}

export function DialogHeader({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn('flex flex-col space-y-1.5 text-left mb-4', className)}
      {...props}
    />
  )
}

export function DialogTitle({
  className,
  ...props
}: React.HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h2
      className={cn('text-sm font-semibold tracking-tight text-zinc-100', className)}
      {...props}
    />
  )
}

export function DialogDescription({
  className,
  ...props
}: React.HTMLAttributes<HTMLParagraphElement>) {
  return (
    <p className={cn('text-xs text-zinc-400 leading-relaxed', className)} {...props} />
  )
}

export function DialogFooter({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        'flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2 mt-5 gap-2 sm:gap-0',
        className
      )}
      {...props}
    />
  )
}
