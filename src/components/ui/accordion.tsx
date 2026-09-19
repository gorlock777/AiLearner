import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AccordionContextValue {
  openItems: string[]
  toggleItem: (id: string) => void
}

const AccordionContext = React.createContext<AccordionContextValue | null>(null)

interface AccordionProps extends React.HTMLAttributes<HTMLDivElement> {
  type?: 'single' | 'multiple'
  defaultValue?: string | string[]
}

function Accordion({
  type = 'single',
  defaultValue,
  className,
  children,
  ...props
}: AccordionProps) {
  const [openItems, setOpenItems] = React.useState<string[]>(() => {
    if (!defaultValue) return []
    return Array.isArray(defaultValue) ? defaultValue : [defaultValue]
  })

  const toggleItem = React.useCallback(
    (id: string) => {
      setOpenItems((prev) => {
        if (type === 'single') {
          return prev.includes(id) ? [] : [id]
        }
        return prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
      })
    },
    [type]
  )

  return (
    <AccordionContext.Provider value={{ openItems, toggleItem }}>
      <div className={cn('divide-y divide-[#1e2638]', className)} {...props}>
        {children}
      </div>
    </AccordionContext.Provider>
  )
}

interface AccordionItemProps extends React.HTMLAttributes<HTMLDivElement> {
  value: string
}

function AccordionItem({
  value,
  className,
  children,
  ...props
}: AccordionItemProps) {
  return (
    <div className={cn('border-b border-[#1e2638] last:border-b-0', className)} {...props}>
      {React.Children.map(children, (child) => {
        if (React.isValidElement(child)) {
          return React.cloneElement(child as React.ReactElement<any>, { itemValue: value })
        }
        return child
      })}
    </div>
  )
}

interface AccordionTriggerProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  itemValue?: string
}

function AccordionTrigger({
  itemValue,
  className,
  children,
  ...props
}: AccordionTriggerProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionTrigger must be within Accordion')

  const isOpen = itemValue ? context.openItems.includes(itemValue) : false

  return (
    <button
      type="button"
      onClick={() => itemValue && context.toggleItem(itemValue)}
      className={cn(
        'flex flex-1 items-center justify-between py-3.5 text-xs font-medium text-slate-200 transition-all hover:text-slate-100 text-left w-full',
        className
      )}
      {...props}
    >
      {children}
      <ChevronDown
        size={15}
        className={cn(
          'text-slate-400 transition-transform duration-200 flex-shrink-0 ml-2',
          isOpen && 'rotate-180 text-slate-200'
        )}
      />
    </button>
  )
}

interface AccordionContentProps extends React.HTMLAttributes<HTMLDivElement> {
  itemValue?: string
}

function AccordionContent({
  itemValue,
  className,
  children,
  ...props
}: AccordionContentProps) {
  const context = React.useContext(AccordionContext)
  if (!context) throw new Error('AccordionContent must be within Accordion')

  const isOpen = itemValue ? context.openItems.includes(itemValue) : false

  if (!isOpen) return null

  return (
    <div className={cn('pb-4 pt-1 text-xs text-slate-400', className)} {...props}>
      {children}
    </div>
  )
}

export { Accordion, AccordionItem, AccordionTrigger, AccordionContent }

