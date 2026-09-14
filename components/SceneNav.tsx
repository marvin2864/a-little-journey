'use client';

import { useStory } from '@/context/StoryContext';
import { scenes } from '@/data/story';

/** Desktop-only navigation (left edge, vertical dots): one per scene plus the
 * closing section. */
export function SceneNav() {
  const { activeSceneIndex, jumpToScene } = useStory();
  const beats = [...scenes.map((s) => s.text[0] ?? ''), 'The end'];

  return (
    <nav
      className="fixed left-4 top-1/2 z-40 hidden max-h-[80vh] -translate-y-1/2 flex-col gap-2 md:flex"
      aria-label="Scene navigation"
    >
      {beats.map((label, i) => (
        <button
          key={i}
          type="button"
          onClick={() => jumpToScene(i)}
          data-interactive
          className={`group relative flex h-3 w-3 items-center justify-center rounded-full transition-all ${
            i === activeSceneIndex
              ? 'scale-125 bg-white'
              : 'bg-white/40 hover:bg-white/70'
          }`}
          aria-label={`Jump to ${label ? `${label.slice(0, 30)}…` : `beat ${i + 1}`}`}
          aria-current={i === activeSceneIndex ? 'true' : undefined}
        >
          {/* Tooltip */}
          <span className="pointer-events-none absolute left-8 whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100">
            {label || `Beat ${i + 1}`}
          </span>
        </button>
      ))}
    </nav>
  );
}
