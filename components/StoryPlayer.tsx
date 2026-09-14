'use client'

import { useCallback, useEffect, useRef } from 'react'
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
  const lenisRef = useLenis(!reducedMotion && settings.autoScroll)

  useScrollProgress(rootRef)

  // FINAL_SHOT (scene 13) must be watched before the closing screen — beat 14 —
  // can appear. Because every section is exactly one viewport tall and scene 13
  // is last, snapping onto it already sits at the scroll bottom, so the ending
  // can't key off position. It fires only after a full scene duration on the
  // final scene, then on a deliberate down-move in manual mode or on its own in
  // auto mode.
  const endedRef = useRef(false)
  const lastSceneSince = useRef(0)
  const onLastScene = activeSceneIndex >= scenes.length - 1
  useEffect(() => {
    if (onLastScene && !endedRef.current) {
      lastSceneSince.current = performance.now()
    }
  }, [onLastScene])

  const tryFinish = useCallback(() => {
    if (endedRef.current) return
    const minDwell = (scenes[scenes.length - 1]?.duration ?? 9) * 1000
    if (performance.now() - lastSceneSince.current < minDwell) return
    endedRef.current = true
    setPhase('ending')
  }, [setPhase])

  // Advance one scene; a move off the final scene ends the film once watched.
  const step = useCallback(
    (dir: 1 | -1) => {
      const target = activeSceneIndex + dir
      if (target < 0) return
      if (target >= scenes.length) {
        tryFinish()
        return
      }
      jumpToScene(target)
    },
    [activeSceneIndex, jumpToScene, tryFinish],
  )

  // Manual scroll is handled by CSS scroll-snap on the root scroller (see
  // app/globals.css + snap-start on each Scene). The platform guarantees the
  // page always rests on a scene boundary, so a small flick and a hard scroll
  // both land on exactly the next section. No JS gesture interception — wheel
  // notch timing varies too much by hardware to distinguish a long burst from
  // a new gesture, which is what let fast scrolls skip scenes.
  // Keyboard arrows below still jump one scene at a time.

  // Native snap fights Lenis's per-frame programmatic scroll, so auto mode
  // (which drives scrolling with Lenis) disables it via a class on <html>.
  useEffect(() => {
    document.documentElement.classList.toggle('no-snap', settings.autoScroll)
    return () => document.documentElement.classList.remove('no-snap')
  }, [settings.autoScroll])

  // Auto mode: after FINAL_SHOT's duration + grace, roll to closing screen.
  // User input cancels.
  useEffect(() => {
    if (!settings.autoScroll || reducedMotion || !onLastScene) return
    if (endedRef.current) return

    const grace = (scenes[activeSceneIndex]?.duration ?? 9) * 1000 + 1500
    const timer = setTimeout(tryFinish, grace)

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
  }, [settings.autoScroll, reducedMotion, onLastScene, activeSceneIndex, tryFinish])

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
    }, scenes[activeSceneIndex]?.duration != null ? scenes[activeSceneIndex].duration * 1000 : 8000)

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

  // Keyboard: arrows jump scenes, M toggles mute. ArrowDown on last scene
  // calls step(1) which triggers tryFinish().
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA') return

      if (e.key === 'm' || e.key === 'M') {
        toggleMute()
        return
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown') {
        e.preventDefault()
        step(1)
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault()
        step(-1)
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [step, toggleMute])

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
      <div ref={rootRef} className="relative w-full">
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
