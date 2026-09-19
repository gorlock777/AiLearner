import { useEffect, useRef } from 'react'

interface Node {
  x: number
  y: number
  vx: number
  vy: number
  r: number
  pulse: number       // 0..1 — current brightness
  pulseSpeed: number
  chargeLevel: number // 0..1 — charge fill
}

interface Arc {
  fromIdx: number
  toIdx: number
  progress: number    // 0..1 travelling spark
  active: boolean
  speed: number
  color: string
}

const EMERALD = 'rgba(52,211,153,'
const CYAN    = 'rgba(96,165,250,'
const VIOLET  = 'rgba(167,139,250,'

function randColor() {
  return [EMERALD, CYAN, VIOLET][Math.floor(Math.random() * 3)]
}

export function NeuralCanvas({ className }: { className?: string }) {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rafRef    = useRef<number>(0)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // ── Resize ─────────────────────────────────────────────
    const resize = () => {
      canvas.width  = canvas.offsetWidth  * window.devicePixelRatio
      canvas.height = canvas.offsetHeight * window.devicePixelRatio
      ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(canvas)

    const W = () => canvas.offsetWidth
    const H = () => canvas.offsetHeight

    // ── Nodes ───────────────────────────────────────────────
    const NODE_COUNT = 38
    const nodes: Node[] = Array.from({ length: NODE_COUNT }, () => ({
      x:          Math.random() * W(),
      y:          Math.random() * H(),
      vx:         (Math.random() - 0.5) * 0.28,
      vy:         (Math.random() - 0.5) * 0.28,
      r:          1.8 + Math.random() * 2.4,
      pulse:      Math.random(),
      pulseSpeed: 0.008 + Math.random() * 0.014,
      chargeLevel: Math.random(),
    }))

    // ── Arcs ────────────────────────────────────────────────
    const MAX_DIST = 160
    const arcs: Arc[] = []

    function spawnArc() {
      const from = Math.floor(Math.random() * nodes.length)
      let to = Math.floor(Math.random() * nodes.length)
      while (to === from) to = Math.floor(Math.random() * nodes.length)
      arcs.push({
        fromIdx: from,
        toIdx:   to,
        progress: 0,
        active: true,
        speed: 0.012 + Math.random() * 0.018,
        color: randColor(),
      })
    }

    // Pre-seed some arcs
    for (let i = 0; i < 8; i++) spawnArc()

    // ── Charge sweep (rising green fill) ────────────────────
    let chargeY = H()   // starts at bottom, rises

    // ── Draw loop ───────────────────────────────────────────
    let frame = 0
    function draw() {
      const w = W()
      const h = H()

      ctx.clearRect(0, 0, w, h)

      // Background fill
      ctx.fillStyle = '#0d0e12'
      ctx.fillRect(0, 0, w, h)

      // ── Charge sweep glow (rises from bottom up) ──
      chargeY -= 0.45
      if (chargeY < -h * 0.3) chargeY = h * 1.1  // reset
      const sweepGrad = ctx.createLinearGradient(0, chargeY - 40, 0, chargeY + 80)
      sweepGrad.addColorStop(0, 'rgba(52,211,153,0)')
      sweepGrad.addColorStop(0.4, 'rgba(52,211,153,0.06)')
      sweepGrad.addColorStop(0.6, 'rgba(52,211,153,0.10)')
      sweepGrad.addColorStop(1, 'rgba(52,211,153,0)')
      ctx.fillStyle = sweepGrad
      ctx.fillRect(0, chargeY - 40, w, 120)

      // ── Static connection lines ──
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x
          const dy = nodes[i].y - nodes[j].y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < MAX_DIST) {
            const alpha = (1 - dist / MAX_DIST) * 0.12
            ctx.strokeStyle = `rgba(52,211,153,${alpha})`
            ctx.lineWidth = 0.6
            ctx.beginPath()
            ctx.moveTo(nodes[i].x, nodes[i].y)
            ctx.lineTo(nodes[j].x, nodes[j].y)
            ctx.stroke()
          }
        }
      }

      // ── Travelling spark arcs ──
      for (let i = arcs.length - 1; i >= 0; i--) {
        const arc = arcs[i]
        if (!arc.active) { arcs.splice(i, 1); continue }

        arc.progress += arc.speed
        if (arc.progress >= 1) {
          arc.active = false
          continue
        }

        const from = nodes[arc.fromIdx]
        const to   = nodes[arc.toIdx]
        const px = from.x + (to.x - from.x) * arc.progress
        const py = from.y + (to.y - from.y) * arc.progress

        // Spark head
        const alpha = Math.sin(arc.progress * Math.PI)
        ctx.beginPath()
        ctx.arc(px, py, 2.5, 0, Math.PI * 2)
        ctx.fillStyle = `${arc.color}${(alpha * 0.9).toFixed(2)})`
        ctx.fill()

        // Spark trail
        const trailLen = 0.08
        const t0 = Math.max(0, arc.progress - trailLen)
        const tx0 = from.x + (to.x - from.x) * t0
        const ty0 = from.y + (to.y - from.y) * t0
        const trailGrad = ctx.createLinearGradient(tx0, ty0, px, py)
        trailGrad.addColorStop(0, `${arc.color}0)`)
        trailGrad.addColorStop(1, `${arc.color}${(alpha * 0.6).toFixed(2)})`)
        ctx.strokeStyle = trailGrad
        ctx.lineWidth = 1.5
        ctx.beginPath()
        ctx.moveTo(tx0, ty0)
        ctx.lineTo(px, py)
        ctx.stroke()
      }

      // ── Nodes ──
      for (const node of nodes) {
        node.x += node.vx
        node.y += node.vy
        if (node.x < 0 || node.x > w) node.vx *= -1
        if (node.y < 0 || node.y > h) node.vy *= -1

        node.pulse += node.pulseSpeed
        node.chargeLevel = Math.min(1, node.chargeLevel + 0.002)

        const brightness = 0.35 + 0.65 * Math.abs(Math.sin(node.pulse))

        // Node glow
        const glow = ctx.createRadialGradient(node.x, node.y, 0, node.x, node.y, node.r * 4)
        glow.addColorStop(0, `rgba(52,211,153,${(brightness * 0.25).toFixed(2)})`)
        glow.addColorStop(1, 'rgba(52,211,153,0)')
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r * 4, 0, Math.PI * 2)
        ctx.fillStyle = glow
        ctx.fill()

        // Node core
        ctx.beginPath()
        ctx.arc(node.x, node.y, node.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(52,211,153,${(brightness * 0.9).toFixed(2)})`
        ctx.fill()
      }

      // ── Spawn new arcs periodically ──
      frame++
      if (frame % 28 === 0 && arcs.length < 20) spawnArc()

      rafRef.current = requestAnimationFrame(draw)
    }

    rafRef.current = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafRef.current)
      ro.disconnect()
    }
  }, [])

  return (
    <canvas
      ref={canvasRef}
      className={className}
      style={{ display: 'block', width: '100%', height: '100%' }}
    />
  )
}

