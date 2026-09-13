# A Little Journey — Design System & Experience Specification

> This document is the canonical implementation brief for the cinematic website.
> Preserve the emotional intent even when implementation details evolve.

## 1. Product identity

**Name:** A Little Journey

**Core message:**
> He went to Japan to reward himself. He didn't know the journey would become the memory.

Alternative:
> Sometimes, the best part of a journey is who you meet along the way.

### Experience category

The site should feel like:
- interactive short film
- digital storybook
- cinematic experience
- premium interactive art website

It must not feel like:
- dashboard
- portfolio template
- video gallery
- generic landing page
- SaaS template
- corporate website

### Emotional arc

```text
curiosity
   ↓
journey
   ↓
discovery
   ↓
meeting
   ↓
connection
   ↓
romance
   ↓
nostalgia
   ↓
ending
   ↓
emotion
```

Every major interaction should support this arc.

---

## 2. Story

A young man wakes in his room, sees a flight promotion to Japan, and buys it as a self-reward.

He travels to Japan.

Under a cherry blossom tree, he meets a girl.

They introduce themselves and exchange Instagram.

Over the following days they become closer.

She invites him to play in a snowy place.

That night they walk through a crowded Japanese city holding hands.

Before he leaves Japan, they meet again beneath the same cherry blossom tree where they first met and take a photo together.

---

## 3. Visual direction

### Keywords

romantic · cinematic · cozy · Japanese travel · dreamy · emotional · cute · elegant · premium · interactive 3D

### Principles

- Premium first, effects second.
- Whitespace is intentional.
- Typography is restrained.
- Motion is soft and purposeful.
- Depth should feel atmospheric rather than game-like.
- Use blur, grain, glow and parallax sparingly.
- Rounded forms and soft shadows.
- Avoid sharp, aggressive UI.
- Avoid neon/gaming aesthetics.
- Avoid excessive glassmorphism.
- Avoid spinning 3D objects.
- Avoid flashy transitions.

### Suggested technology

- WebGL / Three.js only when it provides meaningful depth.
- GSAP + ScrollTrigger for cinematic motion.
- Smooth scrolling.
- Parallax.
- Subtle particles.
- Ambient lighting.
- HTML5 video.
- Web Audio API.

---

## 4. Asset contract

All primary assets are local.

```text
assets/
├── v/
│   └── video files
└── i/
    ├── logo
    └── opengraph
```

Do not:
- make mock videos
- use external video URLs when local assets exist
- duplicate videos
- encode videos
- modify originals

Expected browser paths:

```text
/public/assets/v/<filename>
/public/assets/i/logo.png
/public/assets/i/opengraph.png
```

Before UI implementation, inventory the actual directory and map real files to the story.

### Format preference

If equivalent files exist:
1. WebM
2. MP4
3. other browser-compatible format

Do not convert assets automatically.

---

## 5. Story data architecture

Create:

```text
/data/story.ts
```

All scenes are defined there.

Suggested type:

```ts
export type StoryScene = {
  id: string
  title: string
  subtitle?: string
  video: string
  poster?: string
  theme: StoryTheme
  transition?: TransitionType
  musicCue?: string
}
```

Suggested scene sequence:

1. Morning
2. The Ticket
3. The Journey
4. Japan
5. The First Meeting
6. Instagram
7. Snow
8. The City
9. Before Goodbye
10. Back to Sakura
11. The Photo

Do not hardcode this sequence into UI components.

---

## 6. Opening experience

On first visit, show a cinematic intro instead of the main story.

Background:
- deep navy / almost black

Center:
- existing logo/icon
- subtle floating/breathing animation
- tiny particles
- soft glow

Copy:

> A little story.

or

> Some journeys change you.

Supporting line:

> Best experienced with sound.

Primary action:

> ENTER THE STORY

Experience settings:
- Sound: ON/OFF
- Motion: ON/REDUCED
- Auto Scroll: ON/OFF
- Quality: AUTO

Do not request microphone, camera, location, notifications, etc.

### Browser audio policy

The Enter action is the explicit user interaction that unlocks:
- AudioContext
- soundtrack
- cinematic animation
- story playback

If autoplay is blocked, provide an elegant fallback:
> Tap anywhere to begin the soundtrack.

---

## 7. Loading experience

Show:
- animated small logo
- progress indicator
- "Preparing your journey..."
- percentage

Preload only what is needed to enter the experience:
- first video
- required poster
- initial audio
- fonts

Do not make the user wait for the entire film.

---

## 8. Hero / first scene

Use a cinematic full-screen presentation:
- `100vw`
- `100vh`
- preserve video aspect ratio
- gradient overlay for readability

Initial text:
> One ordinary morning...

Then:
> He decided to go somewhere.

Text should reveal with fade + slight upward movement.

Never flood the screen with text.

---

## 9. Scene engine

The video is the core storytelling medium.

Each scene owns:
- video
- title
- subtitle
- ambient animation
- transition
- optional music cue

The scenes must feel like one film, not isolated webpage sections.

### Cinematic scroll

Scroll may drive:
- scene changes
- text reveal
- background movement
- particle changes
- camera/depth movement
- transitions

Use GSAP ScrollTrigger where it is actually beneficial.

Keep scrolling smooth and avoid heavy work on every frame.

---

## 10. Scene art direction

### Sakura

Palette:
- soft pink
- warm cream

Atmosphere:
- slowly falling cherry blossom petals
- warm ambient light
- soft depth

Copy:
> Then, something unexpected happened.

Then:
> He met her.

### Snow

Transition:
- pink → cool blue

Atmosphere:
- snow particles
- cool blue gradient
- white glow
- soft blur

Copy:
> Somewhere between laughter and snow...

Then:
> they became a little closer.

### Night city

Background:
- dark navy

Atmosphere:
- glowing city lights
- bokeh
- subtle particles
- parallax buildings

When hand-holding appears:
- slightly increase ambient glow

Copy:
> In a city full of people...

Then:
> ...it felt like there were only two.

### Ending

Slow everything down:
- reduce animation intensity
- fade music
- return to warm cream
- return to cherry blossom

Copy:
> Before he went home...

Then:
> he went back to where it all began.

After the photo:
> Some journeys end.

Pause.

> Some memories stay.

Pause.

> And some people...

Pause.

> ...become part of the journey.

---

## 11. Auto-scroll

Auto Scroll is optional.

When enabled:
- after a scene/video milestone, smoothly advance
- user can always take control
- manual scroll pauses auto-scroll
- after inactivity, auto-scroll may resume

Show a tiny indicator:

`AUTO STORY ●`

Also provide a floating Auto Scroll toggle.

Never make the user feel trapped.

---

## 12. Audio & Soundtrack

The soundtrack is an important part of the emotional storytelling.

All soundtrack files are local assets stored in:

```text
public/assets/m/
```

Before implementation:
- Inspect the actual files inside `public/assets/m/`.
- Do not invent filenames.
- Map the actual MP3 filenames to the soundtrack roles below.
- Do not download replacement tracks.
- Do not use external audio URLs.
- Do not embed Spotify, YouTube, or other external players.

### Soundtrack Map

| Scene | Emotional Direction | Soundtrack |
|---|---|---|
| Opening | mysterious, dreamy | About You — The 1975 |
| Morning + Ticket | hopeful | Sunset Lover — Petit Biscuit |
| The Journey / Airplane | freedom | Sweet Disposition — The Temper Trap |
| Japan | wonder | Itte rasshai — Yorushika |
| First Meeting | romantic | Until I Found You — Stephen Sanchez |
| Instagram / Chat | cute, intimate | I Like Me Better — Lauv |
| Snow | happy romance | Glue Song — beabadoobee |
| Night City | dreamy | About You — The 1975 |
| Before Goodbye | nostalgic | Multo — Cup of Joe |
| Final Photo | emotional climax | Iris — The Goo Goo Dolls |
| Fade to White | emotional | Turning Page — Sleeping At Last |

### Emotional Music Arc

The soundtrack should feel like one continuous emotional journey rather than a playlist.

The intended progression is:

```text
mystery
   ↓
hope
   ↓
freedom
   ↓
wonder
   ↓
romance
   ↓
connection
   ↓
happy romance
   ↓
deepening emotion
   ↓
nostalgia
   ↓
emotional climax
   ↓
closure
```

### Scene Music Behavior

Do not necessarily change music on every video transition.

If multiple short scenes belong to the same emotional sequence, allow the current soundtrack to continue naturally.

For example:

```text
Morning
   ↓
Ticket
   ↓
Preparation
```

may share:

```text
Sunset Lover
```

Likewise:

```text
Japan
   ↓
Walking through Japan
   ↓
Discovering the city
```

may allow:

```text
Itte rasshai
```

to continue naturally.

Music changes should happen at meaningful emotional moments.

### Japan Arrival

The Japan arrival is a major emotional transition.

Use:

**Itte rasshai — Yorushika**

for the arrival sequence.

The transition should feel like:

```text
airplane
   ↓
arrival
   ↓
first view of Japan
   ↓
walking through Japan
   ↓
discovering the surroundings
```

The music should communicate:

- wonder
- freshness
- curiosity
- a feeling that something unexpected may happen

Avoid making this scene immediately feel like a romantic climax.

The romance should begin with the First Meeting scene.

### First Meeting

Transition from:

**Itte rasshai**

to:

**Until I Found You**

when the story visually establishes the meeting with the girl.

The transition should be subtle and emotionally motivated.

Avoid an abrupt audio cut.

### Night City

Use:

**About You — The 1975**

again during the night-city hand-holding sequence.

Reusing the opening song is intentional.

It creates a musical callback:

```text
Opening
About You
↓
mystery

Night City
About You
↓
emotional meaning
```

The same song should feel different because the meaning of the story has changed.

### Before Goodbye

Use:

**Multo — Cup of Joe**

for the transition toward leaving Japan.

The pacing should become slower and more nostalgic.

Reduce ambient effects gradually.

### Final Photo

Use:

**Iris — The Goo Goo Dolls**

as the emotional climax.

The final photo sequence should feel intimate and reflective.

Allow the music to carry the emotion instead of adding excessive visual effects.

### Fade to White

Transition into:

**Turning Page — Sleeping At Last**

for the final emotional closure.

Visual intensity should decrease:

```text
video
↓
photo
↓
falling petals
↓
soft cream / white
↓
final text
```

Music should gradually fade with the visual transition.

---

### AudioManager

Create a centralized `AudioManager` abstraction.

Required capabilities:

```text
play()
pause()
stop()
mute()
unmute()
setVolume()
fadeIn()
fadeOut()
crossfade()
switchTrack()
getCurrentTrack()
getPlaybackTime()
```

Do not create separate independent audio systems inside individual scene components.

The scene system should communicate with the centralized AudioManager.

### Scene Music Configuration

Music should be defined through the story data architecture.

Extend the scene configuration when necessary:

```ts
type StoryScene = {
  id: string
  title: string
  subtitle?: string
  video: string
  poster?: string
  theme: StoryTheme
  transition?: TransitionType
  musicCue?: string
  musicStart?: number
  musicFadeIn?: number
  musicFadeOut?: number
}
```

Music configuration must remain separate from UI components.

### Music Transitions

Use cinematic transitions between tracks.

Recommended defaults:

```text
fade out: 800–1500ms
fade in: 1000–2000ms
crossfade: when emotionally appropriate
```

Adapt the timing to the actual scene transition.

Never:

- abruptly cut between unrelated tracks
- allow two tracks to remain playing accidentally
- create duplicate audio instances
- restart a song unnecessarily when the same soundtrack continues into another scene

### Volume

Default music volume:

```text
approximately 20–35%
```

Music must never overpower:

- dialogue
- important sound effects
- video content
- story text

Provide a global music volume control.

### Browser Audio Policy

The `ENTER THE STORY` interaction is the explicit user gesture that unlocks:

- AudioContext
- soundtrack playback
- cinematic animation
- story playback

Never attempt to autoplay music before user interaction.

If autoplay is blocked, provide an elegant fallback:

> Tap anywhere to begin the soundtrack.

The story must remain fully usable when Sound is OFF.

### Mobile Audio

Pay special attention to:

- iOS Safari
- mobile Chrome
- browser autoplay restrictions

The first interaction must initialize/unlock the audio system.

Audio state must remain synchronized with the sound control UI.

### Music Control

Use a minimal floating music control.

Desktop:

```text
♫
```

Mobile:

```text
♫
```

States:

```text
Music ON
Music OFF
```

The control should feel like part of the cinematic interface, not a generic media player.

Do not create a large traditional audio player.

### Performance

- Avoid loading every soundtrack unnecessarily.
- Load the current and upcoming soundtrack intelligently.
- Prevent memory leaks.
- Remove unused audio event listeners.
- Never allow multiple soundtrack instances to play simultaneously.
- Reuse the AudioManager.
- Do not create a new Audio object for every render.
- Handle browser playback interruption gracefully.

### Reduced Motion / Sound

Sound settings and motion settings are independent.

If the user chooses:

```text
Motion: REDUCED
```

music should still work normally unless the user also disables Sound.

### Asset Location

All soundtrack assets must resolve from:

```text
/public/assets/m/<actual-filename>
```

Do not hardcode assumed filenames.

The implementation must first inspect:

```text
public/assets/m/
```

and then create the mapping based on the actual files present.

---

## 13. Ambient 3D / particles

Use subtle:
- petals
- stars
- snow
- clouds
- glowing dots
- depth layers

Desktop can use more particles.

Mobile must reduce:
- particle count
- blur layers
- parallax
- WebGL workload

Respect `prefers-reduced-motion`.

Reduced motion:
- no excessive particles
- no camera movement
- no parallax
- simple fade transitions

---

## 14. Ending / final screen

Minimal composition.

Background:
- soft cream / sakura gradient

Show small couple image if available.

Copy:
> Thank you for being part of the story.

Actions:
- Replay the journey
- Sound ON
- Share

Use Web Share API when supported.
Fallback to copying the URL when unsupported.

---

## 15. Navigation

No large navbar.

Use minimal floating navigation:

```text
01 — Morning
02 — Japan
03 — Meeting
04 — Snow
05 — Night
06 — Goodbye
```

Desktop:
- small side navigation

Mobile:
- bottom progress indicator

---

## 16. Progress

Use a cinematic progress system:

```text
01 ───────── 06
```

or a vertical progress line.

When scene changes:
- progress updates
- scene name updates

---

## 17. Cursor and micro-interactions

Desktop:
- subtle glowing-dot cursor
- expands slightly over interactive elements

Mobile:
- native cursor

Micro-interactions:
- light magnetic buttons
- hover scale
- text reveal
- image parallax
- soft blur
- fade
- floating elements
- subtle grain
- depth movement

Avoid:
- bounce-heavy motion
- neon gaming effects
- huge cursors
- flashy transitions

---

## 18. Responsive targets

Must look intentional at:
- 1920×1080
- 1440×900
- tablet
- 390×844
- 393×873
- 430×932

Mobile:
- fullscreen video
- smaller typography
- fewer particles
- bottom navigation
- no custom cursor
- reduced 3D
- audio waits for interaction

---

## 19. Performance

Video is likely the largest payload.

Implement:
- poster-first rendering
- preload only first scene
- lazy-load upcoming scene
- pause distant video
- unload distant media where safe
- IntersectionObserver where useful
- `requestAnimationFrame` only while animation is active
- GPU-friendly transforms
- mobile quality optimization

Target behavior:

```text
poster → load video → play → pause/unload when no longer needed
```

Never make the browser download every video on initial page load.

---

## 20. Accessibility

Required:
- reduced motion
- keyboard navigation
- visible focus states
- ARIA labels for icon controls
- pause controls
- mute controls
- adequate contrast

Cinematic design must not come at the expense of accessibility.

---

## 21. SEO / metadata

Title:

**A Little Journey — A Story Worth Remembering**

Description:

**A small journey, an unexpected meeting, and a memory that stayed.**

Open Graph:
- `/public/assets/i/opengraph.png`
- intended landscape artwork: 1200×630 when the asset supports that use

Also configure:
- Twitter card metadata
- favicon
- apple-touch-icon when dimensions are suitable
- theme-color

---

## 22. Easter egg

Optional, unobtrusive detail:

After clicking the couple logo 3 times:

> you found a little secret ♡

Or after completion:

> Maybe the journey was never really about the destination.

Never interrupt the main story.

---

## 23. Quality gate

Before declaring the work complete:

### Browser / device
- Chrome desktop
- Safari
- mobile Chrome
- iPhone Safari when available

### Functional
- no console errors
- no horizontal overflow
- no layout shift
- audio starts only after interaction
- mute works
- auto-scroll can be disabled
- reduced motion works
- scene sequence is reliable
- transitions do not visibly break
- loading state works
- refresh is safe
- share works/falls back correctly

### Creative
The final reaction should be:

> "Wow, this is not a normal website."

and after completion:

> "It started as a trip to Japan... and became a story."

---

## 24. Production rule

Build the complete production-ready experience, not a mockup.

If an asset is genuinely missing:
- use a clearly structured placeholder
- keep the placeholder isolated behind the same asset/data interface
- make replacement require no architectural rewrite

The website should feel like an experience, not merely look impressive.
