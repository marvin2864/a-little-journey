---
name: cinematic-story
description: Implement and tune the A Little Journey immersive story experience.
---

# Cinematic Story

Use this skill for story-engine, animation, interaction, and visual work.

## Priorities

1. Story clarity
2. Emotional pacing
3. Cinematic continuity
4. Performance
5. Accessibility
6. Visual novelty

## Rules

- Read `DESIGN.md` first.
- Keep scene data in `data/story.ts`.
- Prefer GSAP for orchestrated transitions.
- Use Three.js only when atmospheric depth materially improves the result.
- Favor opacity, transform, blur and subtle depth over complex effects.
- Keep text sparse.
- Do not let animation compete with the video.
- Keep controls minimal and temporary.
- User input must always be able to override auto-scroll.
- Audio must be explicitly unlocked by user interaction.

## Scene transition guidance

Target transition duration: roughly 0.8–1.5 seconds.

Suggested moods:
- morning → ticket: soft white
- ticket → Japan: airy/cloud-like
- Japan → sakura: petal/warm transition
- sakura → snow: pink to blue
- snow → night: blue to navy
- night → ending: dark to warm cream

## Review question

For every new animation, ask:

> What emotional or navigational purpose does this animation serve?

If the answer is "none", remove it.
