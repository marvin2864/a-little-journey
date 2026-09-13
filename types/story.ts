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
