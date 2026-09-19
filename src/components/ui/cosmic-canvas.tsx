import { useEffect, useRef } from 'react'

interface Particle {
  angle: number
  radiusX: number
  radiusY: number
  tilt: number
  speed: number
  size: number
  color: string
  label: string
  glowColor: string
}

export function CosmicCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    let width = (canvas.width = canvas.offsetWidth * window.devicePixelRatio)
    let height = (canvas.height = canvas.offsetHeight * window.devicePixelRatio)

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = canvas.offsetWidth * window.devicePixelRatio
      height = canvas.height = canvas.offsetHeight * window.devicePixelRatio
    }

    window.addEventListener('resize', handleResize)

    // Knowledge node planetary satellites
    const satellites: Particle[] = [
      {
        angle: 0.8,
        radiusX: 220,
        radiusY: 110,
        tilt: -0.45,
        speed: 0.007,
        size: 5,
        color: '#34d399',
        label: '|ψ⟩ QUBIT STATE',
        glowColor: 'rgba(52, 211, 153, 0.4)',
      },
      {
        angle: 2.6,
        radiusX: 300,
        radiusY: 150,
        tilt: 0.35,
        speed: -0.005,
        size: 4.5,
        color: '#e4e4e7',
        label: 'ħ = 1.054×10⁻³⁴ J·s',
        glowColor: 'rgba(255, 255, 255, 0.35)',
      },
      {
        angle: 4.2,
        radiusX: 370,
        radiusY: 180,
        tilt: -0.25,
        speed: 0.004,
        size: 5,
        color: '#fbbf24',
        label: 'ΔS ≥ 0 RECALL',
        glowColor: 'rgba(251, 191, 36, 0.4)',
      },
      {
        angle: 5.5,
        radiusX: 430,
        radiusY: 210,
        tilt: 0.5,
        speed: -0.0035,
        size: 4.5,
        color: '#34d399',
        label: 'Ω QUORUM',
        glowColor: 'rgba(52, 211, 153, 0.3)',
      },
    ]

    // Background stardust particles
    const starCount = 65
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 1.5 + 0.5) * window.devicePixelRatio,
      alpha: Math.random() * 0.6 + 0.2,
      speed: Math.random() * 0.005 + 0.002,
    }))

    let baseRotation = 0
    let scrollYOffset = 0

    const handleScroll = () => {
      scrollYOffset = window.scrollY || 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = () => {
      ctx.clearRect(0, 0, width, height)

      const dpr = window.devicePixelRatio || 1
      const cx = width / 2
      const cy = (height / 2) * 0.85 + (scrollYOffset * 0.15 * dpr)
      const scaleFactor = 1 + (scrollYOffset * 0.0004)

      baseRotation += 0.001

      // 1. Draw Stardust Field
      ctx.fillStyle = '#ffffff'
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        star.alpha += Math.sin(baseRotation * 15 + i) * 0.005
        const currentAlpha = Math.max(0.1, Math.min(0.8, star.alpha))
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.5})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // 2. Draw Concentric Orbital Rings
      const rings = [140, 220, 300, 370, 430]
      for (let r of rings) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scaleFactor, scaleFactor)
        ctx.rotate(baseRotation * 0.3)

        ctx.beginPath()
        ctx.ellipse(0, 0, r * dpr, (r * 0.55) * dpr, -0.3, 0, Math.PI * 2)
        ctx.strokeStyle = r === 220 ? 'rgba(52, 211, 153, 0.22)' : 'rgba(255, 255, 255, 0.07)'
        ctx.lineWidth = 1 * dpr
        if (r === 370) {
          ctx.setLineDash([4 * dpr, 8 * dpr])
        } else if (r === 140) {
          ctx.setLineDash([2 * dpr, 6 * dpr])
        }
        ctx.stroke()
        ctx.restore()
      }

      // 3. Central Pulsar Core Glow
      ctx.save()
      ctx.translate(cx, cy)
      const coreGrad = ctx.createRadialGradient(0, 0, 0, 0, 0, 80 * dpr * scaleFactor)
      coreGrad.addColorStop(0, 'rgba(52, 211, 153, 0.35)')
      coreGrad.addColorStop(0.4, 'rgba(52, 211, 153, 0.1)')
      coreGrad.addColorStop(1, 'transparent')
      ctx.fillStyle = coreGrad
      ctx.beginPath()
      ctx.arc(0, 0, 80 * dpr * scaleFactor, 0, Math.PI * 2)
      ctx.fill()

      // Core Star Point
      ctx.fillStyle = '#34d399'
      ctx.beginPath()
      ctx.arc(0, 0, 4.5 * dpr, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // 4. Update and Draw Planetary Knowledge Satellites
      for (const sat of satellites) {
        sat.angle += sat.speed

        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scaleFactor, scaleFactor)

        // Calculate 2D position along tilted ellipse
        const cosAngle = Math.cos(sat.angle)
        const sinAngle = Math.sin(sat.angle)
        const cosTilt = Math.cos(sat.tilt)
        const sinTilt = Math.sin(sat.tilt)

        const rawX = sat.radiusX * cosAngle * dpr
        const rawY = sat.radiusY * sinAngle * dpr

        const px = rawX * cosTilt - rawY * sinTilt
        const py = rawX * sinTilt + rawY * cosTilt

        // Satellite Glow Aura
        const satGlow = ctx.createRadialGradient(px, py, 0, px, py, 20 * dpr)
        satGlow.addColorStop(0, sat.glowColor)
        satGlow.addColorStop(1, 'transparent')
        ctx.fillStyle = satGlow
        ctx.beginPath()
        ctx.arc(px, py, 20 * dpr, 0, Math.PI * 2)
        ctx.fill()

        // Satellite Solid Node
        ctx.fillStyle = sat.color
        ctx.beginPath()
        ctx.arc(px, py, sat.size * dpr, 0, Math.PI * 2)
        ctx.fill()

        // Label Typography
        ctx.font = `${Math.round(9 * dpr)}px "JetBrains Mono", monospace`
        ctx.fillStyle = '#a1a1aa'
        ctx.letterSpacing = '1px'
        ctx.fillText(sat.label, px + (10 * dpr), py + (3 * dpr))

        ctx.restore()
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className ?? 'absolute inset-0 w-full h-full pointer-events-none transform-gpu'}
    />
  )
}

export default CosmicCanvas
