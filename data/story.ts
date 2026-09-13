import type {
  SceneThemeConfig,
  StoryScene,
  StoryTheme,
} from '@/types/story'
import { cldVideo, cldAudio, cldImage } from '@/lib/cloudinary'

/**
 * 13-scene cinematic story sequence.
 *
 * Music is intentionally reused across related scenes so the experience
 * feels like one continuous film rather than a collection of isolated clips.
 *
 * All media is served from the Cloudinary CDN.
 */
export const scenes: StoryScene[] = [
  // 01 — Opening
  {
    id: 'opening',
    video: cldVideo('SCENE_01_-_A_Normal_Morning'),
    theme: 'morning',
    musicCue: cldAudio('The_1975_-_About_You'),
    transition: 'fade',
    text: ['A little story…', 'Some journeys change you.'],
  },

  // 02 — Bangun
  {
    id: 'morning',
    video: cldVideo('SCENE_02_-_The_Unexpected_Ticket'),
    theme: 'morning',
    musicCue: cldAudio('Petit_Biscuit_-_Sunset_Lover'),
    transition: 'fade',
    text: ['One ordinary morning…', 'He decided to go somewhere.'],
  },

  // 03 — Beli Tiket
  {
    id: 'ticket',
    video: cldVideo('SCENE_03_-_Self_Reward'),
    theme: 'morning',
    musicCue: cldAudio('Petit_Biscuit_-_Sunset_Lover'),
    transition: 'dissolve',
    text: ['A flight. A promotion.', 'A chance to reward himself.'],
  },

  // 04 — Naik Pesawat
  {
    id: 'flying',
    video: cldVideo('SCENE_04_-_Flying_to_Japan'),
    theme: 'journey',
    musicCue: cldAudio('The_Temper_Trap_-_Sweet_Disposition'),
    transition: 'dissolve',
    text: ['Above the clouds,', 'a new chapter began.'],
  },

  // 05 — Tiba di Jepang
  {
    id: 'japan',
    video: cldVideo('SCENE_05_-_Japan'),
    theme: 'japan',
    musicCue: cldAudio('Yorushika_Itte_rasshai'),
    transition: 'dissolve',
    text: ['A world he had only dreamed of.'],
  },

  // 06 — Bertemu Cewek
  {
    id: 'meeting',
    video: cldVideo('SCENE_06_-_The_First_Meeting'),
    theme: 'sakura',
    musicCue: cldAudio('Stephen_Sanchez_-_Until_I_Found_You'),
    transition: 'fade',
    text: ['Then, something unexpected happened.', 'He met her.'],
  },

  // 07 — Mulai Chat
  {
    id: 'instagram',
    video: cldVideo('SCENE_07_-_Instagram'),
    theme: 'sakura',
    musicCue: cldAudio('Lauv_-_I_Like_Me_Better'),
    transition: 'dissolve',
    text: ['A name. A smile.', 'One follow that started everything.'],
  },

  // 08 — Beberapa Hari Kemudian
  {
    id: 'days-later',
    video: cldVideo('SCENE_08_-_A_Few_Days_Later'),
    theme: 'sakura',
    musicCue: cldAudio('Lauv_-_I_Like_Me_Better'),
    transition: 'dissolve',
    text: ['Days turned into moments', 'neither of them wanted to end.'],
  },

  // 09 — Main Salju
  {
    id: 'snow',
    video: cldVideo('SCENE_09_-_Let_s_Play_in_the_Snow'),
    theme: 'snow',
    musicCue: cldAudio('beabadoobee_-_Glue_Song'),
    transition: 'pink-to-blue',
    text: ['Somewhere between laughter and snow…', 'they became a little closer.'],
  },

  // 10 — Jalan Gandengan Malam
  {
    id: 'night-city',
    video: cldVideo('SCENE_10_-_The_Night_City'),
    theme: 'night',
    musicCue: cldAudio('The_1975_-_About_You'),
    transition: 'blue-to-navy',
    text: ['In a city full of people…', '…it felt like there were only two.'],
  },

  // 11 — Menjelang Pulang
  {
    id: 'before-home',
    video: cldVideo('SCENE_11_-_Before_Going_Home'),
    theme: 'night',
    musicCue: cldAudio('Multo_-_Cup_of_Joe'),
    transition: 'fade',
    text: ['But every journey has a moment', 'when you realize it has to end.'],
  },

  // 12 — Kembali ke Sakura
  {
    id: 'back-sakura',
    video: cldVideo('SCENE_12_-_Back_Where_It_Started'),
    theme: 'sakura',
    musicCue: cldAudio('Goo_Goo_Dolls_-_Iris'),
    transition: 'dark-to-cream',
    text: ['Before he went home…', 'he went back to where it all began.'],
  },

  // 13 — Foto Terakhir / Ending
  {
    id: 'photo',
    video: cldVideo('FINAL_SHOT_-_The_Photo'),
    theme: 'ending',
    musicCue: cldAudio('Goo_Goo_Dolls_-_Iris'),
    musicEndCue: cldAudio('Turning_Page_-_Sleeping_At_Last'),
    musicEndAt: 0.70,
    musicEndFadeIn: 1800,
    musicEndFadeOut: 1500,
    transition: 'dark-to-cream',
    text: [
      'Some journeys end.',
      'Some memories stay.',
      'And some people…',
      '…become part of the journey.',
    ],
  },
]

/** Atmosphere per theme. Colors are used for backdrop + text. */
export const themeConfigs: Record<StoryTheme, SceneThemeConfig> = {
  morning: {
    bg: '#0b0b14',
    gradientFrom: '#141423',
    gradientTo: '#0b0b14',
    textColor: '#faf5eb',
    particle: 'none',
    particleColor: '#faf5eb',
  },
  journey: {
    bg: '#0a1628',
    gradientFrom: '#122448',
    gradientTo: '#0a1628',
    textColor: '#e8f0ff',
    particle: 'stars',
    particleColor: '#ffffff',
  },
  japan: {
    bg: '#0a1418',
    gradientFrom: '#123028',
    gradientTo: '#0a1418',
    textColor: '#f0faf5',
    particle: 'none',
    particleColor: '#f0faf5',
  },
  sakura: {
    bg: '#180a14',
    gradientFrom: '#33182a',
    gradientTo: '#180a14',
    textColor: '#fff0f5',
    particle: 'petals',
    particleColor: '#ffb7c5',
  },
  snow: {
    bg: '#0a1428',
    gradientFrom: '#182c52',
    gradientTo: '#0a1428',
    textColor: '#e8f4ff',
    particle: 'snow',
    particleColor: '#e6f2ff',
  },
  night: {
    bg: '#05050e',
    gradientFrom: '#0c0c22',
    gradientTo: '#05050e',
    textColor: '#fff8e0',
    particle: 'bokeh',
    particleColor: '#ffd27a',
  },
  ending: {
    bg: '#f5efe6',
    gradientFrom: '#fff6ec',
    gradientTo: '#f0e2da',
    textColor: '#2a1a12',
    particle: 'petals',
    particleColor: '#f6b9c6',
  },
}

/** Minimal floating navigation chapters (DESIGN.md §15). */
export const chapters: { label: string; sceneIndex: number }[] = [
  { label: 'Morning', sceneIndex: 0 },
  { label: 'Japan', sceneIndex: 4 },
  { label: 'Meeting', sceneIndex: 5 },
  { label: 'Snow', sceneIndex: 8 },
  { label: 'Night', sceneIndex: 9 },
  { label: 'Goodbye', sceneIndex: 11 },
]

export const LOGO = cldImage('logo')
export const OPENGRAPH = cldImage('opengraph')
