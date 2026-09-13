'use client'

import { useEffect, useRef } from 'react'
import { useStory } from '@/context/StoryContext'
import { useScrollProgress } from '@/hooks/useScrollProgress'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import { useLenis } from '@/hooks/useLenis'
import { scenes, themeConfigs } from '@/data/story'
import { Scene } from '@/components/Scene'
import { ParticleCanvas } from '@/components/ParticleCanvas'
import { SceneTransition } from '@/components/SceneTransition'
import { ProgressIndicator } from '@/components/ProgressIndicator'
import { SceneNav } from '@/components/SceneNav'
import { FloatingControls } from '@/components/FloatingControls'
import { CustomCursor } from '@/components/CustomCursor'
import { ScrollCue } from '@/components/ScrollCue'

/**
 * Main scroll container. Lenis smooth scroll + GSAP ScrollTrigger drive scene
 * activation; a ScrollTrigger listener on the last scene switches to the
 * final screen once the viewer reaches the end of the film.
 */
export function StoryPlayer() {
  const { activeSceneIndex, currentTheme, settings, setPhase, jumpToScene, toggleMute } =
    useStory()
  const rootRef = useRef<HTMLDivElement>(null)
  const reducedMotion = useReducedMotion()
  const lenisRef = useLenis(!reducedMotion)

  useScrollProgress(rootRef)

  // Auto-scroll: advance after each scene settles. Any manual wheel/touch
  // input cancels the pending advance (user is never trapped, DESIGN.md §11).
  useEffect(() => {
    if (!settings.autoScroll || reducedMotion) return
    if (activeSceneIndex >= scenes.length - 1) return

    const timer = setTimeout(() => {
      const next = document.getElementById(`scene-${activeSceneIndex + 1}`)
      if (!next) return
      const lenis = lenisRef.current
      if (lenis) lenis.scrollTo(next, { duration: 2 })
      else next.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 8000)

    const cancel = () => clearTimeout(timer)
    window.addEventListener('wheel', cancel, { passive: true })
    window.addEventListener('touchstart', cancel, { passive: true })
    window.addEventListener('keydown', cancel)

    return () => {
      cancel()
      window.removeEventListener('wheel', cancel)
      window.removeEventListener('touchstart', cancel)
      window.removeEventListener('keydown', cancel)
    }
  }, [activeSceneIndex, settings.autoScroll, reducedMotion, lenisRef])

  // Keyboard: arrows jump scenes, M toggles mute.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't hijack keys while typing in a field.
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'm' || e.key === 'M') {
        toggleMute()
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        jumpToScene(Math.min(activeSceneIndex + 1, scenes.length - 1))
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        jumpToScene(Math.max(activeSceneIndex - 1, 0))
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [activeSceneIndex, jumpToScene, toggleMute])

  // Reach the end of the last scene -> ending phase (once).
  // The last scene has nothing to scroll past, so watch for scroll position
  // rather than relying on a ScrollTrigger boundary.
  const endedRef = useRef(false)
  const onLastScene = activeSceneIndex >= scenes.length - 1
  useEffect(() => {
    if (!onLastScene || endedRef.current) return

    const handler = () => {
      if (endedRef.current) return
      const max = document.documentElement.scrollHeight - window.innerHeight
      if (max <= 0) return
      if (window.scrollY / max > 0.9) {
        endedRef.current = true
        setPhase('ending')
      }
    }

    window.addEventListener('scroll', handler, { passive: true })
    handler()
    return () => window.removeEventListener('scroll', handler)
  }, [onLastScene, setPhase])

  // Keep theme CSS vars synced so overlays, controls, and progress read the
  // active palette without prop drilling.
  useEffect(() => {
    const root = document.documentElement
    root.style.setProperty('--scene-bg', currentTheme.bg)
    root.style.setProperty('--scene-text', currentTheme.textColor)
    root.style.setProperty('--scene-accent', currentTheme.particleColor)
    root.style.backgroundColor = currentTheme.bg
    root.style.colorScheme =
      currentTheme.bg > '#808080' ? 'light' : 'dark'
  }, [currentTheme])

  return (
    <>
      <div ref={rootRef} className="relative w-full snap-y snap-mandatory">
        {scenes.map((scene, i) => (
          <Scene
            key={scene.id}
            scene={scene}
            sceneIndex={i}
            theme={themeConfigs[scene.theme]}
            total={scenes.length}
          />
        ))}
      </div>

      <ParticleCanvas />
      <SceneTransition />
      <ProgressIndicator />
      <SceneNav />
      <ScrollCue visible={activeSceneIndex === 0 && !reducedMotion} />
      <FloatingControls />
      <CustomCursor />
    </>
  )
}
