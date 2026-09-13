'use client'

import { useEffect, useRef, useState } from 'react'
import { useStory } from '@/context/StoryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { scenes, themeConfigs } from '@/data/story'

/**
 * Scene-change wash: a brief fill of the incoming theme color that fades out,
 * so consecutive scenes read as one film (DESIGN.md §9) rather than hard cuts.
 */
export function SceneTransition() {
  const { activeSceneIndex } = useStory()
  const reducedMotion = useReducedMotion()
  const [color, setColor] = useState<string | null>(null)
  const first = useRef(true)

  useEffect(() => {
    if (reducedMotion) return
    if (first.current) {
      first.current = false
      return
    }
    const next = scenes[activeSceneIndex]
    if (!next) return
    setColor(themeConfigs[next.theme].gradientFrom)
    const t = setTimeout(() => setColor(null), 900)
    return () => clearTimeout(t)
  }, [activeSceneIndex, reducedMotion])

  if (!color) return null

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[25] animate-wash"
      style={{ background: color }}
      aria-hidden="true"
    />
  )
}
