<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->

# A Little Journey — Claude Code Project Instructions

## Mission

Build and maintain a production-ready, immersive cinematic web experience for **A Little Journey**.

This is an interactive short film / digital storybook, not a dashboard, portfolio, SaaS landing page, generic video gallery, or corporate site.

The source brief is captured in `DESIGN.md`. Treat `DESIGN.md` as the design authority unless a newer explicit user instruction overrides it.

## Non-negotiable rules

1. **Inspect assets before implementing UI.**
   - Inspect `assets/v/` and `assets/i/`.
   - Never invent video filenames when real files exist.
   - Print a concise asset inventory during development.
2. **Never duplicate, transcode, rename, or mutate original media** unless explicitly requested.
3. **Use local assets.**
   - Videos: `/assets/v/`
   - Images/logo/OG: `/assets/i/`
4. **Centralize story configuration** in `/data/story.ts`.
5. Components must consume story data; do not hardcode the complete story into scene components.
6. Audio must start only after an explicit user interaction. Never fight browser autoplay policy.
7. Respect `prefers-reduced-motion` and the user's Motion setting.
8. Optimize for large local video files. Never load every video on first render.
9. Avoid visual excess. Every animation must have a storytelling/emotional purpose.
10. Do not add permissions for camera, microphone, location, notifications, or other capabilities unless a real feature requires them.
11. Do not create a new logo when `/assets/i/logo.png` exists.
12. Use `/assets/i/opengraph.png` for Open Graph when available.
13. Keep the experience responsive at 1920×1080, 1440×900, tablet, 390×844, 393×873, and 430×932.
14. Do not add horizontal overflow.
15. Do not expose native browser video controls as the primary UI.

## Preferred stack

- Next.js
- TypeScript
- Tailwind CSS
- GSAP + ScrollTrigger where useful
- Three.js only where it materially improves the experience
- HTML5 Video
- Web Audio API

Prefer the simplest implementation that achieves the cinematic result. Do not add Three.js merely because the brief says 3D.

## Architecture target

```text
app/
components/
  IntroScreen/
  ExperienceSettings/
  LoadingScreen/
  StoryPlayer/
  Scene/
  AudioManager/
  ProgressIndicator/
  FloatingControls/
  ParticleBackground/
  SceneTransition/
  FinalScreen/
data/
  story.ts
assets/
  v/
  i/
.claude/
  skills/
DESIGN.md
CLAUDE.md
```

If the existing project already has a sound architecture, adapt rather than rewrite unnecessarily.

## Development workflow

### Phase 1 — Discovery
- Inspect repository structure.
- Inspect `assets/v/` and `assets/i/`.
- Identify video formats and image dimensions where practical.
- Map real files to story scenes.
- Record assumptions in `data/story.ts` or a short development note.

### Phase 2 — Foundation
- Establish global typography, color tokens, spacing, responsive behavior.
- Implement intro/settings/loading states.
- Establish a single story state machine/controller.

### Phase 3 — Story engine
Implement:
- scene lifecycle
- video loading/play/pause/unload
- scene transitions
- progress
- auto-scroll
- manual-scroll takeover
- audio state
- reduced motion
- mobile optimization

### Phase 4 — Art direction
Tune each story theme:
- warm morning
- sky/journey
- Japan
- sakura
- snow
- night city
- goodbye / warm cream ending

### Phase 5 — QA
Test:
- no horizontal overflow
- no console errors
- no broken media
- no accidental autoplay audio
- mute works
- auto-scroll can be disabled
- reduced motion works
- keyboard focus is visible
- mobile controls are usable
- scene sequence cannot silently skip
- refresh/re-entry is safe

## Code quality

- TypeScript strictness preferred.
- Keep components small and cohesive.
- Use semantic HTML.
- Prefer CSS transforms/opacity for animation.
- Clean up GSAP timelines, observers, event listeners, and video resources.
- Avoid unnecessary client components.
- Avoid global state unless it solves a real cross-scene problem.
- Add comments only where behavior is non-obvious.

## Asset rules

Use public URLs only when the local project exposes the corresponding file.

Expected public paths:
- `/assets/v/<filename>`
- `/assets/i/logo.png`
- `/assets/i/opengraph.png`

If the source asset directory is outside `public/`, configure the app so the browser can still access the files at those exact paths, or use the project's established asset serving mechanism. Do not silently create permanent duplicate copies.

## Design authority

Read `DESIGN.md` before making substantial visual decisions.

When there is a conflict:
1. explicit latest user instruction
2. `CLAUDE.md`
3. `DESIGN.md`
4. implementation convenience

Do not sacrifice the story for technical novelty.