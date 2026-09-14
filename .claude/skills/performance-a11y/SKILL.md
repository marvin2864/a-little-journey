---
name: performance-a11y
description: Audit video performance, motion, accessibility, and responsive behavior.
---

# Performance & Accessibility

Use after major UI/story changes and before release.

## Video

Check:

- first scene is the only eagerly loaded scene
- future scenes are lazy
- distant videos pause/unload safely
- posters prevent blank flashes
- no accidental preload of the entire story
- no duplicate media copies
- browser-compatible formats are selected

## Motion

Check:

- `prefers-reduced-motion`
- user Motion setting
- no animation loops when offscreen
- cleanup of GSAP timelines
- cleanup of observers/listeners
- no unnecessary RAF loops

## Accessibility

Check:

- keyboard access
- visible focus
- ARIA labels
- contrast
- mute/pause controls
- reduced-motion behavior
- no essential information communicated only by animation

## Responsive

Check:

- 390×844
- 393×873
- 430×932
- tablet
- 1440×900
- 1920×1080

Confirm no horizontal overflow and no controls are hidden behind browser UI.
