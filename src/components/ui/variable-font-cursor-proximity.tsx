import * as React from 'react'
import { useRef, useEffect, useState, useCallback } from 'react'
import { cn } from '@/lib/utils'

interface VariableFontCursorProximityProps
  extends React.HTMLAttributes<HTMLSpanElement> {
  children: string
  containerRef: React.RefObject<HTMLElement | null>
  fromFontVariationSettings?: string
  toFontVariationSettings?: string
  radius?: number
  className?: string
}

function parseWght(fontVariationStr: string): number {
  const match = fontVariationStr.match(/'wght'\s*(\d+)/)
  return match ? parseInt(match[1], 10) : 400
}

export function VariableFontCursorProximity({
  children,
  containerRef,
  fromFontVariationSettings = "'wght' 100",
  toFontVariationSettings = "'wght' 900",
  radius = 80,
  className,
  ...props
}: VariableFontCursorProximityProps) {
  const charRefs = useRef<(HTMLSpanElement | null)[]>([])
  const [weights, setWeights] = useState<number[]>([])

  const fromWght = parseWght(fromFontVariationSettings)
  const toWght = parseWght(toFontVariationSettings)

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      const newWeights = charRefs.current.map((charEl) => {
        if (!charEl) return fromWght
        const rect = charEl.getBoundingClientRect()
        const charCenterX = rect.left + rect.width / 2
        const charCenterY = rect.top + rect.height / 2

        const dist = Math.hypot(e.clientX - charCenterX, e.clientY - charCenterY)

        if (dist >= radius) {
          return fromWght
        }

        const proximity = 1 - dist / radius
        return Math.round(fromWght + (toWght - fromWght) * proximity)
      })
      setWeights(newWeights)
    },
    [fromWght, toWght, radius]
  )

  const handleMouseLeave = useCallback(() => {
    setWeights(new Array(children.length).fill(fromWght))
  }, [children.length, fromWght])

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    container.addEventListener('mousemove', handleMouseMove)
    container.addEventListener('mouseleave', handleMouseLeave)

    return () => {
      container.removeEventListener('mousemove', handleMouseMove)
      container.removeEventListener('mouseleave', handleMouseLeave)
    }
  }, [containerRef, handleMouseMove, handleMouseLeave])

  const characters = children.split('')

  return (
    <span className={cn('inline-block select-none', className)} {...props}>
      {characters.map((char, i) => {
        const currentWeight = weights[i] ?? fromWght
        return (
          <span
            key={i}
            ref={(el) => {
              charRefs.current[i] = el
            }}
            style={{
              fontVariationSettings: `'wght' ${currentWeight}`,
              fontWeight: currentWeight,
              transition: 'font-variation-settings 0.1s ease-out, font-weight 0.1s ease-out',
            }}
            className="inline-block transition-all"
          >
            {char === ' ' ? '\u00A0' : char}
          </span>
        )
      })}
    </span>
  )
}

