'use client'

import { useEffect, useRef } from 'react'
import { useStory } from '@/context/StoryContext'

/**
 * Watches every [data-scene] section inside the scroll container. Updates the
 * active scene index when a scene crosses the viewport centre. Uses a plain
 * scroll listener (not ScrollTrigger) because it must work under reduced
 * motion and does not need scrub values.
 */
export function useScrollProgress(rootRef: React.RefObject<HTMLDivElement | null>) {
  const { activeSceneIndex, updateScene } = useStory()
  const activeRef = useRef(activeSceneIndex)
  activeRef.current = activeSceneIndex

  useEffect(() => {
    const root = rootRef.current
    if (!root) return

    let ticking = false

    const onScroll = () => {
      if (ticking) return
      ticking = true
      window.requestAnimationFrame(() => {
        ticking = false
        const sections = root.querySelectorAll<HTMLElement>('[data-scene]')
        const mid = window.innerHeight * 0.5
        let best = 0
        let bestDist = Infinity
        sections.forEach((s) => {
          const rect = s.getBoundingClientRect()
          const center = rect.top + rect.height / 2
          const dist = Math.abs(center - mid)
          if (dist < bestDist) {
            bestDist = dist
            best = Number(s.id.replace('scene-', ''))
          }
        })
        if (best !== activeRef.current) {
          updateScene(best)
        }
      })
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    onScroll()
    return () => {
      window.removeEventListener('scroll', onScroll)
      ticking = false
    }
  }, [rootRef, updateScene])
}
