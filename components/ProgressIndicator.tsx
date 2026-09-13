'use client'

import { useEffect, useRef } from 'react'
import { useStory } from '@/context/StoryContext'
import { scenes } from '@/data/story'

/**
 * Minimal scroll progress. Bars animate via direct style writes on scroll
 * (no React re-render per frame, per performance-a11y).
 */
export function ProgressIndicator() {
  const { activeSceneIndex } = useStory()
  const mobileRef = useRef<HTMLDivElement>(null)
  const desktopRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      const pct = (window.scrollY / max) * 100
      if (mobileRef.current) mobileRef.current.style.width = `${pct}%`
      if (desktopRef.current) desktopRef.current.style.height = `${pct}%`
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const accent = 'var(--scene-accent, #ffb7c5)'
  const text = 'var(--scene-text, #faf5eb)'

  return (
    <>
      {/* Mobile: bottom horizontal bar */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-black/20 md:hidden"
        role="progressbar"
        aria-valuenow={activeSceneIndex + 1}
        aria-valuemin={1}
        aria-valuemax={scenes.length}
        aria-label={`Story progress, scene ${activeSceneIndex + 1} of ${scenes.length}`}
      >
        <div ref={mobileRef} className="h-full w-0" style={{ background: accent }} />
      </div>

      {/* Desktop: vertical line + chapter numbers */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 items-center gap-3 md:flex">
        <span
          className="text-[0.65rem] tabular-nums tracking-[0.3em]"
          style={{ color: `${text}99` }}
        >
          {String(activeSceneIndex + 1).padStart(2, '0')}
        </span>
        <div className="relative h-48 w-px" style={{ background: `${text}26` }}>
          <div
            ref={desktopRef}
            className="absolute left-0 top-0 w-px"
            style={{ background: `${text}b3`, height: 0 }}
          />
        </div>
        <span
          className="text-[0.65rem] tabular-nums tracking-[0.3em]"
          style={{ color: `${text}66` }}
        >
          {String(scenes.length).padStart(2, '0')}
        </span>
      </div>
    </>
  )
}
