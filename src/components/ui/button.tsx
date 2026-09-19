import * as React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '../../lib/utils'

const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-xs font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-400 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-3.5 [&_svg]:shrink-0',
  {
    variants: {
      variant: {
        default:
          'bg-zinc-100 text-zinc-950 shadow hover:bg-zinc-200 active:scale-[0.98]',
        destructive:
          'bg-rose-500/10 text-rose-400 border border-rose-500/20 hover:bg-rose-500/20 active:scale-[0.98]',
        outline:
          'border border-zinc-800 bg-transparent shadow-sm hover:bg-zinc-900 hover:text-zinc-100 active:scale-[0.98]',
        secondary:
          'bg-zinc-900 text-zinc-300 border border-zinc-800 hover:bg-zinc-800/80 hover:text-zinc-100 active:scale-[0.98]',
        ghost:
          'text-zinc-400 hover:bg-zinc-900 hover:text-zinc-100',
        link:
          'text-zinc-400 underline-offset-4 hover:underline hover:text-zinc-100',
      },
      size: {
        default: 'h-8 px-3 py-1.5',
        sm: 'h-7 rounded-md px-2.5 text-[11px]',
        lg: 'h-9 rounded-md px-4 text-xs font-semibold',
        icon: 'h-8 w-8',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <button
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = 'Button'

export { Button, buttonVariants }
