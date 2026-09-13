import type {
  SceneThemeConfig,
  StoryScene,
  StoryTheme,
} from '@/types/story'

/**
 * Scene sequence. Video + music paths point at real files under
 * public/assets/ (see asset-audit skill). Do not invent filenames.
 * Paths contain spaces (and one en-dash); browsers encode them automatically
 * when set as src/href, and static file serving resolves both forms.
 *
 * Scenes that belong to one emotional sequence intentionally reuse the same
 * soundtrack (see DESIGN.md §12 "Scene Music Behavior").
 */
export const scenes: StoryScene[] = [
  {
    id: 'morning',
    video: '/assets/v/SCENE 01 - A Normal Morning.mp4',
    theme: 'morning',
    musicCue: '/assets/m/Petit Biscuit - Sunset Lover.mp3',
    transition: 'fade',
    text: ['One ordinary morning…', 'He decided to go somewhere.'],
  },
  {
    id: 'ticket',
    video: '/assets/v/SCENE 02 - The Unexpected Ticket.mp4',
    theme: 'morning',
    musicCue: '/assets/m/Petit Biscuit - Sunset Lover.mp3',
    transition: 'fade',
    text: ['A flight. A promotion.', 'A chance to reward himself.'],
  },
  {
    id: 'reward',
    video: '/assets/v/SCENE 03 - Self Reward.mp4',
    theme: 'morning',
    musicCue: '/assets/m/Petit Biscuit - Sunset Lover.mp3',
    transition: 'dissolve',
    text: ['Sometimes you just have to go.'],
  },
  {
    id: 'flying',
    video: '/assets/v/SCENE 04 - Flying to Japan.mp4',
    theme: 'journey',
    musicCue: '/assets/m/The Temper Trap - Sweet Disposition.mp3',
    transition: 'dissolve',
    text: ['Above the clouds,', 'a new chapter began.'],
  },
  {
    id: 'japan',
    video: '/assets/v/SCENE 05 - Japan.mp4',
    theme: 'japan',
    musicCue: '/assets/m/Yorushika – Itte rasshai.mp3',
    transition: 'dissolve',
    text: ['A world he had only dreamed of.'],
  },
  {
    id: 'meeting',
    video: '/assets/v/SCENE 06 - The First Meeting.mp4',
    theme: 'sakura',
    musicCue: '/assets/m/Stephen Sanchez - Until I Found You.mp3',
    transition: 'fade',
    text: ['Then, something unexpected happened.', 'He met her.'],
  },
  {
    id: 'instagram',
    video: '/assets/v/SCENE 07 - Instagram.mp4',
    theme: 'sakura',
    musicCue: '/assets/m/Lauv - I Like Me Better.mp3',
    transition: 'dissolve',
    text: ['A name. A smile.', 'One follow that started everything.'],
  },
  {
    id: 'days-later',
    video: '/assets/v/SCENE 08 - A Few Days Later.mp4',
    theme: 'sakura',
    musicCue: '/assets/m/Lauv - I Like Me Better.mp3',
    transition: 'dissolve',
    text: ['Days turned into moments', 'neither of them wanted to end.'],
  },
  {
    id: 'snow',
    video: "/assets/v/SCENE 09 - Let's Play in the Snow.mp4",
    theme: 'snow',
    musicCue: '/assets/m/beabadoobee - Glue Song.mp3',
    transition: 'pink-to-blue',
    text: ['Somewhere between laughter and snow…', 'they became a little closer.'],
  },
  {
    id: 'night-city',
    video: '/assets/v/SCENE 10 - The Night City.mp4',
    theme: 'night',
    musicCue: '/assets/m/The 1975 - About You.mp3',
    transition: 'blue-to-navy',
    text: ['In a city full of people…', '…it felt like there were only two.'],
  },
  {
    id: 'before-home',
    video: '/assets/v/SCENE 11 - Before Going Home.mp4',
    theme: 'night',
    musicCue: '/assets/m/Multo - Cup of Joe.mp3',
    transition: 'fade',
    text: ['Before he went home…'],
  },
  {
    id: 'back-sakura',
    video: '/assets/v/SCENE 12 - Back Where It Started.mp4',
    theme: 'sakura',
    musicCue: '/assets/m/Goo Goo Dolls - Iris.mp3',
    transition: 'dark-to-cream',
    text: ['…he went back', 'to where it all began.'],
  },
  {
    id: 'photo',
    video: '/assets/v/FINAL SHOT - The Photo.mp4',
    theme: 'ending',
    musicCue: '/assets/m/Turning Page - Sleeping At Last.mp3',
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

export const LOGO = '/assets/i/logo.png'
export const OPENGRAPH = '/assets/i/opengraph.png'
