'use client'

import { useEffect, useRef, useState } from 'react'
import { useStory } from '@/context/StoryContext'
import { useReducedMotion } from '@/hooks/useReducedMotion'
import type { SceneThemeConfig, StoryScene } from '@/types/story'

/** How many scenes away a video may still be mounted. */
const MOUNT_RADIUS = 1

type Props = {
  scene: StoryScene
  sceneIndex: number
  theme: SceneThemeConfig
  total: number
}

export function Scene({ scene, sceneIndex, theme, total }: Props) {
  const { activeSceneIndex, audioManager } = useStory()
  const reducedMotion = useReducedMotion()
  const sectionRef = useRef<HTMLElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [ready, setReady] = useState(false)

  const distance = Math.abs(sceneIndex - activeSceneIndex)
  const shouldMount = distance <= MOUNT_RADIUS
  const isActive = sceneIndex === activeSceneIndex

  // Play only the active scene; pause everything else so offscreen videos
  // stop decoding frames.
  useEffect(() => {
    const video = videoRef.current
    if (!video) return
    if (isActive) {
      void video.play().catch(() => {})
    } else {
      video.pause()
    }
  }, [isActive, shouldMount])

  // Report video progress to audio manager for end-cue triggering.
  // Only the active scene's video drives tickEndCue.
  useEffect(() => {
    if (!isActive || !scene.musicEndCue) return
    const video = videoRef.current
    if (!video) return

    const onTimeUpdate = () => {
      if (!video.duration || !video.currentTime) return
      const progress = video.currentTime / video.duration
      audioManager.tickEndCue(progress)
    }

    video.addEventListener('timeupdate', onTimeUpdate)
    return () => video.removeEventListener('timeupdate', onTimeUpdate)
  }, [isActive, scene.musicEndCue, audioManager])

  // Scroll-driven text reveal. Each line fades up in sequence, holds, then the
  // whole block fades as the scene leaves. Skipped under reduced motion.
  useEffect(() => {
    if (reducedMotion || !sectionRef.current) return
    let killed = false
    let cleanup: (() => void) | undefined

    void (async () => {
      const { gsap } = await import('gsap')
      const { ScrollTrigger } = await import('gsap/ScrollTrigger')
      if (killed) return
      gsap.registerPlugin(ScrollTrigger)

      const section = sectionRef.current
      if (!section) return
      const lines = section.querySelectorAll<HTMLElement>('[data-line]')
      if (!lines.length) return

      const ctx = gsap.context(() => {
        gsap.set(lines, { opacity: 0, y: 40 })
        const tl = gsap.timeline({
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            end: 'bottom 30%',
            scrub: 0.6,
          },
        })
        tl.to(lines, {
          opacity: 1,
          y: 0,
          duration: 1,
          stagger: 0.6,
          ease: 'power2.out',
        })
        tl.to(lines, { opacity: 0, y: -30, duration: 0.8, stagger: 0.2 })
      }, section)

      cleanup = () => ctx.revert()
    })()

    return () => {
      killed = true
      cleanup?.()
    }
  }, [reducedMotion, sceneIndex])

  // Reduced motion: text is simply visible, no scrub.
  useEffect(() => {
    if (!reducedMotion || !sectionRef.current) return
    const lines = sectionRef.current.querySelectorAll<HTMLElement>('[data-line]')
    lines.forEach((l) => {
      l.style.opacity = ''
      l.style.transform = ''
    })
  }, [reducedMotion])

  const isEnding = sceneIndex === total - 1

  return (
    <section
      ref={sectionRef}
      id={`scene-${sceneIndex}`}
      data-scene
      data-ending={isEnding ? '' : undefined}
      aria-label={`Scene ${sceneIndex + 1} of ${total}`}
      className="relative h-screen w-full overflow-hidden"
      style={{ background: theme.bg }}
    >
      {shouldMount ? (
        <video
          ref={videoRef}
          className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-700 ${
            ready ? 'opacity-100' : 'opacity-0'
          }`}
          src={scene.video}
          poster={scene.poster}
          muted
          playsInline
          loop
          preload={isActive ? 'auto' : 'metadata'}
          onCanPlay={() => setReady(true)}
          aria-hidden="true"
        />
      ) : (
        <div
          className="absolute inset-0"
          style={{ background: theme.bg }}
          aria-hidden="true"
        />
      )}

      {/* Readability gradient — stronger at the bottom where text sits. */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          background: `linear-gradient(to top, ${theme.bg}cc 0%, transparent 45%, ${theme.bg}80 100%)`,
        }}
        aria-hidden="true"
      />

      {/* Story text */}
      <div className="absolute inset-0 z-10 flex items-center justify-center px-6 sm:px-10">
        <div className="max-w-3xl space-y-4 text-center">
          {scene.text.map((line, i) => (
            <p
              key={i}
              data-line
              className="text-balance text-[clamp(1.5rem,5vw,3.25rem)] font-extralight leading-tight tracking-wide"
              style={{ color: theme.textColor }}
            >
              {line}
            </p>
          ))}
        </div>
      </div>

      {/* Scene marker — tiny, unobtrusive */}
      <div
        className="absolute bottom-6 left-6 z-10 text-[0.65rem] tabular-nums tracking-[0.3em] opacity-40"
        style={{ color: theme.textColor }}
        aria-hidden="true"
      >
        {String(sceneIndex + 1).padStart(2, '0')} / {String(total).padStart(2, '0')}
      </div>
    </section>
  )
}
