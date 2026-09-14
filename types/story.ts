export type StoryTheme =
  | 'morning'
  | 'journey'
  | 'japan'
  | 'sakura'
  | 'snow'
  | 'night'
  | 'ending'

export type TransitionType =
  | 'fade'
  | 'dissolve'
  | 'pink-to-blue'
  | 'blue-to-navy'
  | 'dark-to-cream'

export type StoryScene = {
  id: string
  video: string
  poster?: string
  theme: StoryTheme
  /** Soundtrack file (public path) for this scene. */
  musicCue: string
  /** Lines of story text revealed sequentially as the scene scrolls. */
  text: string[]
  /** Visual transition into this scene. */
  transition?: TransitionType
  /** How long the scene holds before auto-scroll advances, in seconds. */
  duration: number
  /** Optional secondary track that plays partway through the scene (final scene handoff). */
  musicEndCue?: string
  /** Scene progress (0..1) at which the end cue should start. */
  musicEndAt?: number
  /** Fade-in duration for the end cue (ms). */
  musicEndFadeIn?: number
  /** Fade-out duration for the main cue when the end cue begins (ms). */
  musicEndFadeOut?: number
}

export type AppPhase = 'intro' | 'loading' | 'playing' | 'ending'

export type ExperienceSettings = {
  sound: boolean
  motion: boolean
  autoScroll: boolean
}

export type ParticleKind = 'petals' | 'snow' | 'bokeh' | 'stars' | 'none'

export type SceneThemeConfig = {
  bg: string
  /** CSS gradient stop colors used for the ambient backdrop. */
  gradientFrom: string
  gradientTo: string
  textColor: string
  particle: ParticleKind
  particleColor: string
}
