'use client';

import { useStory } from '@/context/StoryContext';
import { scenes } from '@/data/story';

/** Scene navigation (left edge, vertical dots): one per scene plus the closing
 * section. On mobile the same rail, scaled down so it stays out of the way. */
export function SceneNav() {
  const { activeSceneIndex, jumpToScene } = useStory();
  const beats = [...scenes.map((s) => s.text[0] ?? ''), 'The end'];

  return (
    <nav
      className="fixed left-3 top-1/2 z-40 flex max-h-[80vh] -translate-y-1/2 flex-col gap-1.5 md:left-4 md:gap-2"
      aria-label="Scene navigation"
    >
      {beats.map((label, i) => (
        <button
          key={i}
          type="button"
          onClick={() => jumpToScene(i)}
          data-interactive
          className="group relative flex h-4 w-4 items-center justify-center md:h-5 md:w-5"
          aria-label={`Jump to ${label ? `${label.slice(0, 30)}…` : `beat ${i + 1}`}`}
          aria-current={i === activeSceneIndex ? 'true' : undefined}
        >
          {/* The visible dot — kept 8px on mobile / 12px on desktop inside a
              larger tap target. */}
          <span
            className={`rounded-full transition-all ${
              i === activeSceneIndex
                ? 'h-2 w-2 scale-125 bg-white md:h-3 md:w-3'
                : 'h-2 w-2 bg-white/40 md:h-3 md:w-3'
            }`}
          />
          {/* Tooltip — pointer devices only */}
          <span className="pointer-events-none absolute left-8 hidden whitespace-nowrap rounded bg-black/80 px-2 py-1 text-xs text-white opacity-0 transition-opacity group-hover:opacity-100 md:block">
            {label || `Beat ${i + 1}`}
          </span>
        </button>
      ))}
    </nav>
  );
}
