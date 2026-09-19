import { useEffect, useRef } from 'react'

interface Satellite {
  angle: number
  radiusX: number
  radiusY: number
  tilt: number
  speed: number
  size: number
  color: string
  label: string
  spriteType: 'emerald' | 'white' | 'amber'
}

interface AccretionParticle {
  angle: number
  radius: number
  tilt: number
  speed: number
  size: number
  alpha: number
  color: string
}

export function CosmicCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d', { alpha: true })
    if (!ctx) return

    let animationFrameId: number
    const dpr = Math.min(window.devicePixelRatio || 1, 1.5)

    let width = (canvas.width = Math.floor(canvas.offsetWidth * dpr))
    let height = (canvas.height = Math.floor(canvas.offsetHeight * dpr))

    const handleResize = () => {
      if (!canvas) return
      width = canvas.width = Math.floor(canvas.offsetWidth * dpr)
      height = canvas.height = Math.floor(canvas.offsetHeight * dpr)
    }

    window.addEventListener('resize', handleResize)

    // ── 1. Create Pre-rendered Offscreen Glow Sprites (High Performance BitBLT) ──
    const createGlowSprite = (color: string, radius: number) => {
      const sprite = document.createElement('canvas')
      const size = radius * 2
      sprite.width = size
      sprite.height = size
      const sCtx = sprite.getContext('2d')
      if (sCtx) {
        const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius)
        grad.addColorStop(0, color)
        grad.addColorStop(0.35, color.replace('1)', '0.35)').replace('0.8)', '0.28)'))
        grad.addColorStop(0.7, color.replace('1)', '0.08)').replace('0.8)', '0.06)'))
        grad.addColorStop(1, 'transparent')
        sCtx.fillStyle = grad
        sCtx.beginPath()
        sCtx.arc(radius, radius, radius, 0, Math.PI * 2)
        sCtx.fill()
      }
      return sprite
    }

    const spriteEmerald = createGlowSprite('rgba(52, 211, 153, 0.8)', 28 * dpr)
    const spriteWhite = createGlowSprite('rgba(255, 255, 255, 0.7)', 24 * dpr)
    const spriteAmber = createGlowSprite('rgba(251, 191, 36, 0.8)', 28 * dpr)
    const spriteCore = createGlowSprite('rgba(52, 211, 153, 0.5)', 90 * dpr)

    // ── 2. Quantum Node Satellites (Keplerian Epicycles) ──
    const satellites: Satellite[] = [
      {
        angle: 0.8,
        radiusX: 210,
        radiusY: 105,
        tilt: -0.42,
        speed: 0.008,
        size: 5,
        color: '#34d399',
        label: '|ψ⟩ QUBIT STATE',
        spriteType: 'emerald',
      },
      {
        angle: 2.7,
        radiusX: 290,
        radiusY: 140,
        tilt: 0.32,
        speed: -0.006,
        size: 4.5,
        color: '#f4f4f5',
        label: 'ħ = 1.054×10⁻³⁴ J·s',
        spriteType: 'white',
      },
      {
        angle: 4.3,
        radiusX: 360,
        radiusY: 175,
        tilt: -0.22,
        speed: 0.005,
        size: 5,
        color: '#fbbf24',
        label: 'ΔS ≥ 0 RECALL',
        spriteType: 'amber',
      },
      {
        angle: 5.4,
        radiusX: 430,
        radiusY: 205,
        tilt: 0.46,
        speed: -0.004,
        size: 4.5,
        color: '#34d399',
        label: 'Ω QUORUM NODE',
        spriteType: 'emerald',
      },
    ]

    // ── 3. Accretion Disk Relativistic Dust Stream ──
    const accretionParticles: AccretionParticle[] = Array.from({ length: 48 }, (_, i) => ({
      angle: (i / 48) * Math.PI * 2,
      radius: 120 + Math.random() * 320,
      tilt: -0.3 + (Math.random() - 0.5) * 0.15,
      speed: (0.006 + Math.random() * 0.008) * (Math.random() > 0.3 ? 1 : -1),
      size: (Math.random() * 1.6 + 0.6) * dpr,
      alpha: Math.random() * 0.5 + 0.25,
      color: Math.random() > 0.4 ? '#34d399' : '#e4e4e7',
    }))

    // ── 4. Deep Space Distant Starfield ──
    const starCount = 50
    const stars = Array.from({ length: starCount }, () => ({
      x: Math.random() * width,
      y: Math.random() * height,
      size: (Math.random() * 1.2 + 0.4) * dpr,
      alpha: Math.random() * 0.5 + 0.2,
      twinkleSpeed: Math.random() * 0.03 + 0.01,
    }))

    // ── 5. Butter-smooth RAF Scroll Lerp State ──
    let targetScroll = 0
    let currentScroll = 0
    let baseRotation = 0

    const handleScroll = () => {
      targetScroll = window.scrollY || 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = () => {
      // Smooth linear interpolation (Dampened Lerp)
      currentScroll += (targetScroll - currentScroll) * 0.08
      baseRotation += 0.0012

      ctx.clearRect(0, 0, width, height)

      const cx = width / 2
      // Singularity center point moves subtly with depth
      const cy = (height / 2) * 0.82 + (currentScroll * 0.12 * dpr)

      // Scroll expansion & orbit pop factors
      const scrollProgress = Math.min(Math.max(currentScroll / 600, 0), 2.5)
      const scaleFactor = 1 + scrollProgress * 0.32
      const orbitPopBrightness = Math.min(1.4, 1 + scrollProgress * 0.45)
      const rotationSpeedFactor = 1 + scrollProgress * 0.3

      // ── A. Render Distant Starfield ──
      for (let i = 0; i < stars.length; i++) {
        const star = stars[i]
        const currentAlpha = Math.max(0.1, Math.min(0.8, star.alpha + Math.sin(baseRotation * 20 + i) * 0.15))
        ctx.fillStyle = `rgba(255, 255, 255, ${currentAlpha * 0.4})`
        ctx.beginPath()
        ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── B. Accretion Disk Glowing Orbits & Gravitational Lensing ──
      const rings = [
        { r: 130, color: `rgba(52, 211, 153, ${0.35 * orbitPopBrightness})`, dash: [2 * dpr, 6 * dpr], tilt: -0.3 },
        { r: 210, color: `rgba(52, 211, 153, ${0.28 * orbitPopBrightness})`, dash: [], tilt: -0.35 },
        { r: 290, color: `rgba(255, 255, 255, ${0.12 * orbitPopBrightness})`, dash: [4 * dpr, 8 * dpr], tilt: 0.28 },
        { r: 360, color: `rgba(251, 191, 36, ${0.22 * orbitPopBrightness})`, dash: [6 * dpr, 10 * dpr], tilt: -0.2 },
        { r: 430, color: `rgba(52, 211, 153, ${0.15 * orbitPopBrightness})`, dash: [], tilt: 0.4 },
      ]

      for (const ring of rings) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(scaleFactor, scaleFactor)
        ctx.rotate(baseRotation * 0.25 * rotationSpeedFactor)

        ctx.beginPath()
        ctx.ellipse(0, 0, ring.r * dpr, ring.r * 0.52 * dpr, ring.tilt, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = 1 * dpr
        if (ring.dash.length > 0) {
          ctx.setLineDash(ring.dash)
        }
        ctx.stroke()
        ctx.restore()
      }

      // ── C. Central Singularity Pulsar Core (Blitted from Sprite) ──
      ctx.save()
      ctx.translate(cx, cy)
      const coreSize = 90 * dpr * scaleFactor
      ctx.drawImage(spriteCore, -coreSize, -coreSize, coreSize * 2, coreSize * 2)

      // Solid Core Singularity Node
      ctx.fillStyle = '#34d399'
      ctx.beginPath()
      ctx.arc(0, 0, 4.5 * dpr, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── D. Relativistic Accretion Particle Stream ──
      for (const p of accretionParticles) {
        p.angle += p.speed * rotationSpeedFactor
        const cosA = Math.cos(p.angle)
        const sinA = Math.sin(p.angle)
        const cosT = Math.cos(p.tilt)
        const sinT = Math.sin(p.tilt)

        const rawX = p.radius * cosA * dpr
        const rawY = (p.radius * 0.52) * sinA * dpr

        const px = cx + (rawX * cosT - rawY * sinT) * scaleFactor
        const py = cy + (rawX * sinT + rawY * cosT) * scaleFactor

        ctx.fillStyle = p.color === '#34d399' 
          ? `rgba(52, 211, 153, ${p.alpha * orbitPopBrightness})` 
          : `rgba(255, 255, 255, ${p.alpha * 0.6 * orbitPopBrightness})`

        ctx.beginPath()
        ctx.arc(px, py, p.size, 0, Math.PI * 2)
        ctx.fill()
      }

      // ── E. Quantum Planetary Satellites with Sprite Glow & Badge Labels ──
      for (const sat of satellites) {
        sat.angle += sat.speed * rotationSpeedFactor

        const cosAngle = Math.cos(sat.angle)
        const sinAngle = Math.sin(sat.angle)
        const cosTilt = Math.cos(sat.tilt)
        const sinTilt = Math.sin(sat.tilt)

        const rawX = sat.radiusX * cosAngle * dpr
        const rawY = sat.radiusY * sinAngle * dpr

        const px = cx + (rawX * cosTilt - rawY * sinTilt) * scaleFactor
        const py = cy + (rawX * sinTilt + rawY * cosTilt) * scaleFactor

        // 1. Draw Glow Sprite (Zero CPU math overhead)
        const sprite = sat.spriteType === 'emerald' 
          ? spriteEmerald 
          : sat.spriteType === 'amber' 
          ? spriteAmber 
          : spriteWhite
        
        const glowRadius = 26 * dpr
        ctx.drawImage(sprite, px - glowRadius, py - glowRadius, glowRadius * 2, glowRadius * 2)

        // 2. Solid Planet Center
        ctx.fillStyle = sat.color
        ctx.beginPath()
        ctx.arc(px, py, sat.size * dpr, 0, Math.PI * 2)
        ctx.fill()

        // 3. Technical Label with Semi-Translucent Badge Pill
        const fontSize = Math.round(9.5 * dpr)
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`
        const textMetrics = ctx.measureText(sat.label)
        const textWidth = textMetrics.width
        const pillHeight = fontSize + 6 * dpr
        const pillPadding = 6 * dpr
        const pillX = px + 10 * dpr
        const pillY = py - (pillHeight / 2)

        // Subtle dark pill background for crisp readability
        ctx.fillStyle = 'rgba(13, 14, 18, 0.75)'
        ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)'
        ctx.lineWidth = 1 * dpr
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, textWidth + pillPadding * 2, pillHeight, 4 * dpr)
        ctx.fill()
        ctx.stroke()

        // Badge Text
        ctx.fillStyle = '#e4e4e7'
        ctx.fillText(sat.label, pillX + pillPadding, pillY + fontSize + 0.5 * dpr)
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

