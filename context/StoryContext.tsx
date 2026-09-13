'use client'

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react'
import { scenes, themeConfigs } from '@/data/story'
import { AudioManager } from '@/lib/audio'
import type {
  AppPhase,
  ExperienceSettings,
  SceneThemeConfig,
} from '@/types/story'

type StoryContextValue = {
  phase: AppPhase
  setPhase: (p: AppPhase) => void
  activeSceneIndex: number
  settings: ExperienceSettings
  currentTheme: SceneThemeConfig
  audioManager: AudioManager
  enterStory: () => void
  updateScene: (index: number) => void
  updateSettings: (patch: Partial<ExperienceSettings>) => void
  toggleMute: () => void
  isMuted: boolean
  jumpToScene: (index: number) => void
}

const StoryContext = createContext<StoryContextValue | null>(null)

// Singleton — one audio system for the whole app (DESIGN.md §12).
const audioManager = new AudioManager()

const SETTINGS_KEY = 'alittlejourney:settings'

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<AppPhase>('intro')
  const [activeSceneIndex, setActiveSceneIndex] = useState(0)
  const [isMuted, setIsMuted] = useState(false)
  const [settings, setSettingsState] = useState<ExperienceSettings>({
    sound: true,
    motion: true,
    autoScroll: false,
  })
  const settingsRef = useRef(settings)
  settingsRef.current = settings

  // Restore persisted settings once.
  useEffect(() => {
    try {
      const raw = localStorage.getItem(SETTINGS_KEY)
      if (raw) {
        const parsed = JSON.parse(raw) as Partial<ExperienceSettings>
        setSettingsState((prev) => ({ ...prev, ...parsed }))
      }
    } catch {
      /* first visit or storage blocked */
    }
  }, [])

  const currentTheme: SceneThemeConfig = useMemo(
    () => themeConfigs[scenes[activeSceneIndex].theme],
    [activeSceneIndex],
  )

  const enterStory = useCallback(() => {
    setPhase('loading')
    // Unlock inside the user gesture (browser audio policy).
    audioManager.unlock()
    if (settingsRef.current.sound) {
      audioManager.playTrack(scenes[0].musicCue)
      armEndCue(scenes[0])
    }
    window.scrollTo(0, 0)
    // Brief breathing room so the loading screen is perceptible, then play.
    const t = window.setTimeout(() => setPhase('playing'), 1200)
    return () => window.clearTimeout(t)
  }, [])

  const updateScene = useCallback((index: number) => {
    if (index < 0 || index >= scenes.length) return
    setActiveSceneIndex((prev) => {
      if (prev === index) return prev
      if (settingsRef.current.sound) {
        audioManager.playTrack(scenes[index].musicCue)
        armEndCue(scenes[index])
      }
      return index
    })
  }, [])

  // Arm the optional mid-scene end-cue track (final-scene handoff). No-op for
  // scenes without musicEndCue / musicEndAt.
  const armEndCue = useCallback((scene: (typeof scenes)[number]) => {
    if (settingsRef.current.sound && scene.musicEndCue) {
      audioManager.setEndCue(
        scene.musicEndCue,
        scene.musicEndAt,
        scene.musicEndFadeIn,
        scene.musicEndFadeOut,
      )
    } else {
      audioManager.setEndCue(undefined)
    }
  }, [])

  const updateSettings = useCallback((patch: Partial<ExperienceSettings>) => {
    setSettingsState((prev) => {
      const next = { ...prev, ...patch }
      if (patch.sound !== undefined && patch.sound !== prev.sound) {
        if (patch.sound) {
          audioManager.unmute()
          setIsMuted(false)
          audioManager.resume()
        } else {
          audioManager.pause()
        }
      }
      try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(next))
      } catch {
        /* ignore quota errors */
      }
      return next
    })
  }, [])

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev
      if (next) audioManager.mute()
      else audioManager.unmute()
      return next
    })
  }, [])

  const jumpToScene = useCallback((index: number) => {
    if (index < 0 || index >= scenes.length) return
    const target = document.getElementById(`scene-${index}`)
    if (!target) return
    // Route through Lenis when smooth scroll is active, else native scroll.
    const lenis = (window as typeof window & { __lenis?: { scrollTo: (t: unknown, o: unknown) => void } }).__lenis
    if (lenis) lenis.scrollTo(target, { duration: 1.6 })
    else target.scrollIntoView({ behavior: 'smooth', block: 'start' })
  }, [])

  return (
    <StoryContext.Provider
      value={{
        phase,
        setPhase,
        activeSceneIndex,
        settings,
        currentTheme,
        audioManager,
        enterStory,
        updateScene,
        updateSettings,
        toggleMute,
        isMuted,
        jumpToScene,
      }}
    >
      {children}
    </StoryContext.Provider>
  )
}

export function useStory(): StoryContextValue {
  const ctx = useContext(StoryContext)
  if (!ctx) throw new Error('useStory must be used within a StoryProvider')
  return ctx
}
