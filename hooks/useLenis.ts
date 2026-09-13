'use client'

import { useEffect, useRef } from 'react'
import Lenis from 'lenis'

/**
 * Smooth momentum scrolling. Disabled under reduced motion (simple fades
 * instead of hijacked scroll). The instance is registered on window.__lenis
 * so context-level jumpToScene can route through it.
 */
export function useLenis(enabled: boolean) {
  const lenisRef = useRef<Lenis | null>(null)

  useEffect(() => {
    if (!enabled) return
    const lenis = new Lenis({
      smoothWheel: true,
      wheelMultiplier: 0.8,
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    })

    lenisRef.current = lenis
    ;(window as typeof window & { __lenis?: Lenis }).__lenis = lenis

    let rafId = 0
    function raf(time: number) {
      lenis.raf(time)
      rafId = requestAnimationFrame(raf)
    }
    rafId = requestAnimationFrame(raf)

    return () => {
      cancelAnimationFrame(rafId)
      lenis.destroy()
      lenisRef.current = null
      delete (window as typeof window & { __lenis?: Lenis }).__lenis
    }
  }, [enabled])

  return lenisRef
}
