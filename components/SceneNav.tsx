'use client'

import { useStory } from '@/context/StoryContext'
import { scenes } from '@/data/story'

/** Desktop-only scene navigation (left edge, vertical dots). */
export function SceneNav() {
  const { activeSceneIndex, jumpToScene } = useStory()

  return (
    <nav
      className="fixed left-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col gap-3 md:flex"
      aria-label="Scene navigation"
    >
      {scenes.map((scene, i) => (
        <button
          key={scene.id}
          type="button"
          onClick={() => jumpToScene(i)}
          className={`group relative flex h-3 w-3 items-center justify-center rounded-full transition-all ${
            i === activeSceneIndex
              ? 'scale-125 bg-white'
              : 'bg-white/40 hover:bg-white/70'
          }`}
          aria-label={`Jump to scene ${i + 1}: ${scene.text[0]?.slice(0, 30)}...`}
        >
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {scene.text[0]?.slice(0, 40)}
          </span>
        </button>
      ))}
    </nav>
  )
}
