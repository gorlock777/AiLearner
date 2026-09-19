import { useEffect, useRef } from 'react'

interface WarpStar {
  x: number
  y: number
  z: number
  pz: number
  size: number
  color: string
}

interface SatelliteNode {
  angle: number
  radiusX: number
  radiusY: number
  tilt: number
  speed: number
  size: number
  color: string
  label: string
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

    let width = 0
    let height = 0

    const updateDimensions = () => {
      if (!canvas) return
      const rect = canvas.getBoundingClientRect()
      const w = rect.width || window.innerWidth
      const h = rect.height || window.innerHeight
      width = canvas.width = Math.floor(w * dpr)
      height = canvas.height = Math.floor(h * dpr)
    }

    updateDimensions()
    window.addEventListener('resize', updateDimensions)

    // ── 1. Create Pre-rendered High-Performance Sprites (Offscreen BitBLT) ──
    const createGlowSprite = (color: string, radius: number) => {
      const sprite = document.createElement('canvas')
      const size = radius * 2
      sprite.width = size
      sprite.height = size
      const sCtx = sprite.getContext('2d')
      if (sCtx) {
        const grad = sCtx.createRadialGradient(radius, radius, 0, radius, radius, radius)
        grad.addColorStop(0, color)
        grad.addColorStop(0.3, color.replace('1)', '0.4)').replace('0.9)', '0.35)'))
        grad.addColorStop(0.7, color.replace('1)', '0.08)').replace('0.9)', '0.05)'))
        grad.addColorStop(1, 'transparent')
        sCtx.fillStyle = grad
        sCtx.beginPath()
        sCtx.arc(radius, radius, radius, 0, Math.PI * 2)
        sCtx.fill()
      }
      return sprite
    }

    const spriteEmerald = createGlowSprite('rgba(52, 211, 153, 0.9)', 30 * dpr)
    const spriteWhite = createGlowSprite('rgba(255, 255, 255, 0.85)', 24 * dpr)
    const spriteAmber = createGlowSprite('rgba(251, 191, 36, 0.9)', 30 * dpr)
    const spriteWarpCore = createGlowSprite('rgba(52, 211, 153, 0.75)', 110 * dpr)
    const spriteBlastFlare = createGlowSprite('rgba(147, 197, 253, 0.8)', 130 * dpr)

    // ── 2. Warp Drive Hyperspace Starfield (3D Radial Vector Projection) ──
    const starCount = 90
    const warpStars: WarpStar[] = Array.from({ length: starCount }, () => {
      const initialZ = Math.random() * 1000 + 50
      return {
        x: (Math.random() - 0.5) * 2000,
        y: (Math.random() - 0.5) * 2000,
        z: initialZ,
        pz: initialZ,
        size: Math.random() * 1.5 + 0.8,
        color: Math.random() > 0.3 ? '#34d399' : '#e4e4e7',
      }
    })

    // ── 3. Quantum Satellites (Containment Coil Nodes) ──
    const satellites: SatelliteNode[] = [
      {
        angle: 0.8,
        radiusX: 230,
        radiusY: 115,
        tilt: -0.38,
        speed: 0.007,
        size: 5.5,
        color: '#34d399',
        label: '|ψ⟩ QUBIT STATE',
      },
      {
        angle: 2.6,
        radiusX: 310,
        radiusY: 150,
        tilt: 0.3,
        speed: -0.005,
        size: 4.5,
        color: '#f4f4f5',
        label: 'ħ = 1.054×10⁻³⁴ J·s',
      },
      {
        angle: 4.2,
        radiusX: 390,
        radiusY: 185,
        tilt: -0.2,
        speed: 0.0045,
        size: 5.5,
        color: '#fbbf24',
        label: 'ΔS ≥ 0 RECALL',
      },
      {
        angle: 5.5,
        radiusX: 470,
        radiusY: 220,
        tilt: 0.42,
        speed: -0.0035,
        size: 4.5,
        color: '#34d399',
        label: 'Ω QUORUM NODE',
      },
    ]

    // ── 4. Scroll Tracking with Dampened RAF Lerp ──
    let targetScroll = 0
    let currentScroll = 0
    let baseRotation = 0

    const handleScroll = () => {
      targetScroll = window.scrollY || 0
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    const render = () => {
      // Butter-smooth lerp (Eliminates scroll wheel jank)
      currentScroll += (targetScroll - currentScroll) * 0.08
      baseRotation += 0.0015

      ctx.clearRect(0, 0, width, height)

      // Center the warp engine directly in the viewport
      const cx = width / 2
      const cy = height * 0.44

      // Warp drive ignition calculations
      const scrollRatio = Math.min(Math.max(currentScroll / 300, 0), 4)
      
      // Stage 1 -> Stage 2 -> Stage 3 Warp Intensity
      const isWarping = scrollRatio > 0.04
      const warpSpeed = 1.2 + Math.pow(scrollRatio, 1.8) * 14
      const blastScale = 1 + scrollRatio * 0.35
      const brightnessBoost = Math.min(1.5, 1 + scrollRatio * 0.3)

      // ── A. 3D Hyperspace Warp Stars (Radial Streak Projection) ──
      for (let i = 0; i < warpStars.length; i++) {
        const star = warpStars[i]
        star.pz = star.z
        star.z -= warpSpeed

        if (star.z <= 10) {
          star.z = 1000
          star.pz = 1000
          star.x = (Math.random() - 0.5) * 2000
          star.y = (Math.random() - 0.5) * 2000
        }

        const k = 400 / star.z
        const px = cx + star.x * k * dpr
        const py = cy + star.y * k * dpr

        const pk = 400 / star.pz
        const prevX = cx + star.x * pk * dpr
        const prevY = cy + star.y * pk * dpr

        // Out of viewport check
        if (px < 0 || px > width || py < 0 || py > height) {
          star.z = 1000
          star.pz = 1000
          continue
        }

        const starAlpha = Math.min(1, (1 - star.z / 1000) * (isWarping ? 0.95 : 0.5))

        if (scrollRatio > 0.08) {
          // Warp light streaks when scrolling
          ctx.beginPath()
          ctx.moveTo(prevX, prevY)
          ctx.lineTo(px, py)
          ctx.strokeStyle = star.color === '#34d399'
            ? `rgba(52, 211, 153, ${starAlpha})`
            : `rgba(255, 255, 255, ${starAlpha})`
          ctx.lineWidth = Math.max(1, star.size * dpr * (0.8 + scrollRatio * 0.6))
          ctx.stroke()
        } else {
          // Calm idling stardust points when idle
          ctx.fillStyle = star.color === '#34d399'
            ? `rgba(52, 211, 153, ${starAlpha})`
            : `rgba(255, 255, 255, ${starAlpha})`
          ctx.beginPath()
          ctx.arc(px, py, star.size * dpr, 0, Math.PI * 2)
          ctx.fill()
        }
      }

      // ── B. Warp Containment Rings (Always Luminous & Active) ──
      const rings = [
        { r: 150, color: `rgba(52, 211, 153, ${0.45 * brightnessBoost})`, dash: [3 * dpr, 6 * dpr], tilt: -0.32, spinSpeed: 0.6 },
        { r: 230, color: `rgba(52, 211, 153, ${0.35 * brightnessBoost})`, dash: [], tilt: -0.38, spinSpeed: 0.4 },
        { r: 310, color: `rgba(255, 255, 255, ${0.25 * brightnessBoost})`, dash: [5 * dpr, 10 * dpr], tilt: 0.3, spinSpeed: -0.35 },
        { r: 390, color: `rgba(251, 191, 36, ${0.35 * brightnessBoost})`, dash: [6 * dpr, 12 * dpr], tilt: -0.2, spinSpeed: 0.3 },
        { r: 470, color: `rgba(52, 211, 153, ${0.25 * brightnessBoost})`, dash: [], tilt: 0.42, spinSpeed: -0.25 },
      ]

      for (const ring of rings) {
        ctx.save()
        ctx.translate(cx, cy)
        ctx.scale(blastScale, blastScale)
        ctx.rotate(baseRotation * ring.spinSpeed * (1 + scrollRatio * 1.8))

        ctx.beginPath()
        ctx.ellipse(0, 0, ring.r * dpr, ring.r * 0.52 * dpr, ring.tilt, 0, Math.PI * 2)
        ctx.strokeStyle = ring.color
        ctx.lineWidth = (1 + scrollRatio * 0.3) * dpr
        if (ring.dash.length > 0) {
          ctx.setLineDash(ring.dash)
        }
        ctx.stroke()
        ctx.restore()
      }

      // ── C. Warp Core Reactor Singularity (Persistent Blast Core) ──
      ctx.save()
      ctx.translate(cx, cy)
      const coreSize = 100 * dpr * blastScale
      ctx.drawImage(spriteWarpCore, -coreSize, -coreSize, coreSize * 2, coreSize * 2)

      // Extra Blast Flare when scrolling
      if (scrollRatio > 0.2) {
        const flareSize = 120 * dpr * blastScale * (scrollRatio * 0.5)
        ctx.drawImage(spriteBlastFlare, -flareSize, -flareSize, flareSize * 2, flareSize * 2)
      }

      // Solid Core Node
      ctx.fillStyle = scrollRatio > 0.3 ? '#ffffff' : '#34d399'
      ctx.beginPath()
      ctx.arc(0, 0, (5 + scrollRatio * 1.5) * dpr, 0, Math.PI * 2)
      ctx.fill()
      ctx.restore()

      // ── D. Quantum Satellite Beacons with Dynamic Orbits & Labels ──
      for (const sat of satellites) {
        sat.angle += sat.speed * (1 + scrollRatio * 2)

        const cosAngle = Math.cos(sat.angle)
        const sinAngle = Math.sin(sat.angle)
        const cosTilt = Math.cos(sat.tilt)
        const sinTilt = Math.sin(sat.tilt)

        const rawX = sat.radiusX * cosAngle * dpr
        const rawY = sat.radiusY * sinAngle * dpr

        const px = cx + (rawX * cosTilt - rawY * sinTilt) * blastScale
        const py = cy + (rawX * sinTilt + rawY * cosTilt) * blastScale

        // Draw Glow Sprite
        const sprite = sat.color === '#fbbf24' 
          ? spriteAmber 
          : sat.color === '#f4f4f5' 
          ? spriteWhite 
          : spriteEmerald
        
        const glowR = (28 + scrollRatio * 8) * dpr
        ctx.drawImage(sprite, px - glowR, py - glowR, glowR * 2, glowR * 2)

        // Solid Satellite Planet
        ctx.fillStyle = sat.color
        ctx.beginPath()
        ctx.arc(px, py, sat.size * dpr, 0, Math.PI * 2)
        ctx.fill()

        // Crisp Tech Badge Pill
        const fontSize = Math.round(10 * dpr)
        ctx.font = `${fontSize}px "JetBrains Mono", monospace`
        const textMetrics = ctx.measureText(sat.label)
        const textWidth = textMetrics.width
        const pillHeight = fontSize + 7 * dpr
        const pillPadding = 7 * dpr
        const pillX = px + 10 * dpr
        const pillY = py - (pillHeight / 2)

        ctx.fillStyle = 'rgba(13, 14, 18, 0.85)'
        ctx.strokeStyle = sat.color === '#34d399' ? 'rgba(52, 211, 153, 0.35)' : 'rgba(255, 255, 255, 0.18)'
        ctx.lineWidth = 1 * dpr
        ctx.setLineDash([])
        ctx.beginPath()
        ctx.roundRect(pillX, pillY, textWidth + pillPadding * 2, pillHeight, 4 * dpr)
        ctx.fill()
        ctx.stroke()

        ctx.fillStyle = '#ffffff'
        ctx.fillText(sat.label, pillX + pillPadding, pillY + fontSize + 0.5 * dpr)
      }

      animationFrameId = requestAnimationFrame(render)
    }

    render()

    return () => {
      cancelAnimationFrame(animationFrameId)
      window.removeEventListener('resize', updateDimensions)
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

