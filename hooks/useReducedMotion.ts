'use client'

import { useEffect, useState } from 'react'
import { useStory } from '@/context/StoryContext'

/**
 * True when either the OS prefers reduced motion OR the user turned Motion off
 * in the intro settings. Sound and motion are independent (DESIGN.md §12).
 */
export function useReducedMotion(): boolean {
  const { settings } = useStory()
  const [osPrefers, setOsPrefers] = useState(false)

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    setOsPrefers(mq.matches)
    const onChange = (e: MediaQueryListEvent) => setOsPrefers(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])

  return osPrefers || !settings.motion
}
