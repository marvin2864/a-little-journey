'use client';

import { useEffect, useRef } from 'react';
import { useStory } from '@/context/StoryContext';
import { scenes } from '@/data/story';

/**
 * Minimal scroll progress. Bars animate via direct style writes on scroll
 * (no React re-render per frame, per performance-a11y).
 */
export function ProgressIndicator() {
  const { activeSceneIndex, jumpToScene } = useStory();
  const mobileRef = useRef<HTMLDivElement>(null);
  const desktopRef = useRef<HTMLDivElement>(null);

  // Beats = 13 scenes + the closing section.
  const total = scenes.length + 1;
  const atEnd = activeSceneIndex >= scenes.length;

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      const pct = (window.scrollY / max) * 100;
      if (mobileRef.current) mobileRef.current.style.width = `${pct}%`;
      if (desktopRef.current) desktopRef.current.style.height = `${pct}%`;
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const accent = 'var(--scene-accent, #ffb7c5)';
  const text = 'var(--scene-text, #faf5eb)';

  return (
    <>
      {/* Mobile: bottom horizontal bar + tap targets for prev/next */}
      <div
        className="fixed bottom-0 left-0 right-0 z-40 h-[2px] bg-black/20 md:hidden"
        role="progressbar"
        aria-valuenow={activeSceneIndex + 1}
        aria-valuemin={1}
        aria-valuemax={total}
        aria-label={`Story progress, scene ${activeSceneIndex + 1} of ${total}`}
      >
        <div
          ref={mobileRef}
          className="h-full w-0"
          style={{ background: accent }}
        />
      </div>

      {/* Mobile prev/next — the arrows are the only way to step beats on a
          phone without relying on precise snapping. Left side: the scene dots
          are desktop-only, so this edge is free. */}
      <div className="fixed bottom-5 left-4 z-50 flex flex-col gap-2 md:hidden">
        <button
          type="button"
          onClick={() => jumpToScene(activeSceneIndex - 1)}
          disabled={activeSceneIndex === 0}
          data-interactive
          aria-label="Previous scene"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--scene-text,#faf5eb)]/20 bg-black/35 text-[var(--scene-text,#faf5eb)]/75 backdrop-blur-sm transition-all active:scale-95 disabled:opacity-25"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="M18 15l-6-6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <button
          type="button"
          onClick={() => jumpToScene(activeSceneIndex + 1)}
          disabled={atEnd}
          data-interactive
          aria-label="Next scene"
          className="flex h-9 w-9 items-center justify-center rounded-full border border-[var(--scene-text,#faf5eb)]/20 bg-black/35 text-[var(--scene-text,#faf5eb)]/75 backdrop-blur-sm transition-all active:scale-95 disabled:opacity-25"
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>

      {/* Desktop: vertical line + prev/next arrows (replaces 01/13 numbers) */}
      <div className="fixed right-6 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-center gap-3 md:flex">
        <button
          type="button"
          onClick={() => jumpToScene(activeSceneIndex - 1)}
          disabled={activeSceneIndex === 0}
          data-interactive
          aria-label="Previous scene"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--scene-text,#faf5eb)]/20 text-[var(--scene-text,#faf5eb)]/70 backdrop-blur-sm transition-all hover:border-[var(--scene-text,#faf5eb)]/50 hover:text-[var(--scene-text,#faf5eb)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="M18 15l-6-6-6 6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
        <div className="relative h-48 w-px" style={{ background: `${text}26` }}>
          <div
            ref={desktopRef}
            className="absolute left-0 top-0 w-px"
            style={{ background: `${text}b3`, height: 0 }}
          />
        </div>
        <button
          type="button"
          onClick={() => jumpToScene(activeSceneIndex + 1)}
          disabled={atEnd}
          data-interactive
          aria-label="Next scene"
          className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--scene-text,#faf5eb)]/20 text-[var(--scene-text,#faf5eb)]/70 backdrop-blur-sm transition-all hover:border-[var(--scene-text,#faf5eb)]/50 hover:text-[var(--scene-text,#faf5eb)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5] disabled:cursor-not-allowed disabled:opacity-30"
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            aria-hidden="true"
          >
            <path
              d="M6 9l6 6 6-6"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </button>
      </div>
    </>
  );
}
