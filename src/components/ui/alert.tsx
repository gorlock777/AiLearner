import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const alertVariants = cva(
  'relative w-full rounded-lg border px-4 py-3 text-xs [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-3.5 [&>svg]:text-zinc-400 [&>svg~*]:pl-7',
  {
    variants: {
      variant: {
        default: 'bg-zinc-900/80 border-zinc-800 text-zinc-300',
        destructive:
          'border-rose-500/20 bg-rose-500/10 text-rose-400 [&>svg]:text-rose-400',
        warning:
          'border-amber-500/20 bg-amber-500/10 text-amber-300 [&>svg]:text-amber-400',
        success:
          'border-emerald-500/20 bg-emerald-500/10 text-emerald-300 [&>svg]:text-emerald-400',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

const Alert = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & VariantProps<typeof alertVariants>
>(({ className, variant, ...props }, ref) => (
  <div
    ref={ref}
    role="alert"
    className={cn(alertVariants({ variant }), className)}
    {...props}
  />
))
Alert.displayName = 'Alert'

const AlertTitle = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLHeadingElement>
>(({ className, ...props }, ref) => (
  <h5
    ref={ref}
    className={cn('mb-1 font-medium leading-none tracking-tight text-zinc-100', className)}
    {...props}
  />
))
AlertTitle.displayName = 'AlertTitle'

const AlertDescription = React.forwardRef<
  HTMLParagraphElement,
  React.HTMLAttributes<HTMLParagraphElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn('text-xs text-zinc-400 [&_p]:leading-relaxed', className)}
    {...props}
  />
))
AlertDescription.displayName = 'AlertDescription'

export { Alert, AlertTitle, AlertDescription }
