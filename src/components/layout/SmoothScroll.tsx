import { useEffect } from 'react'
import Lenis from 'lenis'

export const lenisGlobal = {
  instance: null as Lenis | null,
  scrollTo: (target: string | HTMLElement, options?: { offset?: number; duration?: number }) => {
    if (lenisGlobal.instance) {
      lenisGlobal.instance.scrollTo(target, options)
    } else {
      const el = typeof target === 'string' ? document.querySelector(target) : target
      el?.scrollIntoView({ behavior: 'smooth' })
    }
  },
}

export function SmoothScrollProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check if user prefers reduced motion
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (prefersReducedMotion) return

    const lenis = new Lenis({
      duration: 1.1,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1.0,
      touchMultiplier: 1.8,
    })

    lenisGlobal.instance = lenis

    function raf(time: number) {
      lenis.raf(time)
      requestAnimationFrame(raf)
    }

    const rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisGlobal.instance = null
    }
  }, [])

  return <>{children}</>
}

export default SmoothScrollProvider
