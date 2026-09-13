'use client'

import { useEffect, useRef, useState } from 'react'
import { useReducedMotion } from '@/hooks/useReducedMotion'

/**
 * Subtle glowing-dot cursor (DESIGN.md §17). Desktop fine-pointer only.
 * Position is written directly to the DOM (no per-move React state); size
 * toggles via a class when hovering [data-interactive] elements.
 */
export function CustomCursor() {
  const ref = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const [enabled, setEnabled] = useState(false)

  useEffect(() => {
    setEnabled(window.matchMedia('(pointer: fine)').matches)
    if (!window.matchMedia('(pointer: fine)').matches || reducedMotion) return

    let x = window.innerWidth / 2
    let y = window.innerHeight / 2
    let cx = x
    let cy = y
    let rafId = 0

    const onMove = (e: MouseEvent) => {
      x = e.clientX
      y = e.clientY
      const target = e.target as HTMLElement | null
      const interactive = target?.closest('[data-interactive], a, button')
      ref.current?.classList.toggle('h-6', Boolean(interactive))
      ref.current?.classList.toggle('w-6', Boolean(interactive))
    }

    const tick = () => {
      cx += (x - cx) * 0.15
      cy += (y - cy) * 0.15
      const el = ref.current
      if (el) el.style.transform = `translate3d(${cx}px, ${cy}px, 0) translate(-50%, -50%)`
      rafId = requestAnimationFrame(tick)
    }

    window.addEventListener('mousemove', onMove, { passive: true })
    rafId = requestAnimationFrame(tick)

    return () => {
      window.removeEventListener('mousemove', onMove)
      cancelAnimationFrame(rafId)
    }
  }, [reducedMotion])

  if (!enabled || reducedMotion) return null

  return (
    <div
      ref={ref}
      className="pointer-events-none fixed left-0 top-0 z-[100] h-2 w-2 rounded-full bg-white mix-blend-difference transition-[width,height] duration-300 scale-1"
      style={{ boxShadow: '0 0 12px rgba(255,255,255,0.5)' }}
      aria-hidden="true"
    />
  )
}
