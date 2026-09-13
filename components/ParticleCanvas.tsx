'use client'

import { useEffect, useRef } from 'react'
import { useStory } from '@/context/StoryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/** Ambient particle layer (petals, snow, bokeh, stars). Canvas-based. */
export function ParticleCanvas() {
  const { currentTheme } = useStory()
  const reducedMotion = useReducedMotion()
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (reducedMotion || currentTheme.particle === 'none') return

    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const resize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Array<{
      x: number
      y: number
      vx: number
      vy: number
      size: number
      opacity: number
    }> = []

    const count = window.innerWidth < 768 ? 40 : 100

    for (let i = 0; i < count; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.5,
        vy: Math.random() * 0.5 + 0.2,
        size: Math.random() * 3 + 1,
        opacity: Math.random() * 0.5 + 0.2,
      })
    }

    let animId: number

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      particles.forEach((p) => {
        ctx.beginPath()

        if (currentTheme.particle === 'petals') {
          // Rotating ellipse
          ctx.save()
          ctx.translate(p.x, p.y)
          ctx.rotate((Date.now() * 0.001 + p.x) % (Math.PI * 2))
          ctx.ellipse(0, 0, p.size * 2, p.size, 0, 0, Math.PI * 2)
          ctx.restore()
        } else if (currentTheme.particle === 'snow') {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        } else if (currentTheme.particle === 'bokeh') {
          ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2)
        } else if (currentTheme.particle === 'stars') {
          ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2)
        }

        ctx.fillStyle = currentTheme.particleColor
        ctx.globalAlpha = p.opacity
        ctx.fill()

        p.x += p.vx
        p.y += p.vy

        if (p.y > canvas.height) {
          p.y = -10
          p.x = Math.random() * canvas.width
        }
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width) p.x = 0
      })

      animId = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(animId)
      window.removeEventListener('resize', resize)
    }
  }, [currentTheme.particle, currentTheme.particleColor, reducedMotion])

  if (reducedMotion || currentTheme.particle === 'none') return null

  return (
    <canvas
      ref={canvasRef}
      className="pointer-events-none fixed inset-0 z-20"
      aria-hidden="true"
    />
  )
}
