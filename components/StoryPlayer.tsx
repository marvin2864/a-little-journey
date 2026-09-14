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

  // One deliberate advance past FINAL_SHOT (scene 13) rolls to the closing
  // screen — beat 14 of the film. The FINAL_SHOT video is always seen first:
  // the ending never fires from scroll position or a timer, only from a
  // down-move while the last scene is active. A cooldown keeps a held key or
  // fast trackpad flicks from skipping the final video.
  const endedRef = useRef(false)
  const edgeCooldown = useRef(false)
  const step = useCallback(
    (dir: 1 | -1) => {
      const target = activeSceneIndex + dir
      if (target < 0) return
      if (target >= scenes.length) {
        if (endedRef.current || edgeCooldown.current) return
        edgeCooldown.current = true
        window.setTimeout(() => {
          edgeCooldown.current = false
        }, 800)
        endedRef.current = true
        setPhase('ending')
        return
      }
      jumpToScene(target)
    },
    [activeSceneIndex, jumpToScene, setPhase],
  )

  // Manual scroll stepper: with auto-scroll off, one scroll gesture — however
  // big — advances exactly ONE scene. A gesture is a continuous stream of
  // wheel/touch events; every event during a locked gesture only postpones the
  // unlock (idle timer). Scrolling stops counting as the same gesture after
  // 450ms of silence, so a long wheel drag = +1, a small flick = +1.
  // Lock state lives in refs: `step`'s identity changes mid-burst when the
  // active index updates, and the effect re-run must not re-arm a second step.
  const wheelLockedRef = useRef(false)
  const wheelIdleTimerRef = useRef(0)
  const touchLockedRef = useRef(false)
  useEffect(() => {
    if (settings.autoScroll) return

    const GESTURE_IDLE_MS = 450

    const armIdle = () => {
      window.clearTimeout(wheelIdleTimerRef.current)
      wheelIdleTimerRef.current = window.setTimeout(() => {
        wheelLockedRef.current = false
      }, GESTURE_IDLE_MS)
    }

    const onWheel = (e: WheelEvent) => {
      e.preventDefault()
      if (Math.abs(e.deltaY) < 2) return
      if (wheelLockedRef.current) {
        // Still the same gesture — absorb it, keep postponing the unlock.
        armIdle()
        return
      }
      wheelLockedRef.current = true
      armIdle()
      step(e.deltaY > 0 ? 1 : -1)
    }

    // Touch: one finger-down drag = one step. touchstart re-arms the lock,
    // so lifting and swiping again is required for the next scene.
    let touchY = 0
    const onTouchStart = (e: TouchEvent) => {
      touchY = e.touches[0].clientY
      touchLockedRef.current = false
    }
    const onTouchMove = (e: TouchEvent) => {
      e.preventDefault()
      const dy = touchY - e.touches[0].clientY
      if (touchLockedRef.current || Math.abs(dy) < 30) return
      touchLockedRef.current = true
      step(dy > 0 ? 1 : -1)
    }

    window.addEventListener('wheel', onWheel, { passive: false })
    window.addEventListener('touchstart', onTouchStart, { passive: true })
    window.addEventListener('touchmove', onTouchMove, { passive: false })
    return () => {
      window.clearTimeout(wheelIdleTimerRef.current)
      window.removeEventListener('wheel', onWheel)
      window.removeEventListener('touchstart', onTouchStart)
      window.removeEventListener('touchmove', onTouchMove)
    }
  }, [settings.autoScroll, step])

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
