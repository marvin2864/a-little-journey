'use client';

import { useEffect, useRef } from 'react';
import { useStory } from '@/context/StoryContext';
import { scenes } from '@/data/story';

/** Shared rail chrome: layout, focus ring, disabled state. Border/text/bg are
 * left to each button so the active accent variant never fights these. */
const ROUND =
  'flex items-center justify-center rounded-full border backdrop-blur-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5] disabled:cursor-not-allowed disabled:opacity-30';
const IDLE =
  'border-[var(--scene-text,#faf5eb)]/20 bg-black/30 text-[var(--scene-text,#faf5eb)]/75 hover:border-[var(--scene-text,#faf5eb)]/45 hover:text-[var(--scene-text,#faf5eb)]';
const SIZE = 'h-8 w-8';

/**
 * Right-edge controls (DESIGN.md §11–12), in two groups sharing one column so
 * nothing drifts into a corner or collides on a phone.
 *
 * Top: the scene rail — previous / next arrows held far apart by the progress
 * line running between them, centred vertically.
 * Bottom: the music and auto-scroll toggles as a tight pair, sitting at the
 * same baseline as the scene counter (`bottom-6`, matching Scene.tsx), well
 * clear of the arrows above.
 *
 * The line animates with a direct style write on scroll — no React re-render
 * per frame (performance-a11y).
 */
export function FloatingControls() {
  const {
    settings,
    updateSettings,
    toggleMute,
    isMuted,
    activeSceneIndex,
    jumpToScene,
  } = useStory();
  const lineRef = useRef<HTMLDivElement>(null);

  const total = scenes.length + 1; // 13 scenes + the closing section
  const atEnd = activeSceneIndex >= scenes.length;
  const musicOn = settings.sound && !isMuted;
  const text = 'var(--scene-text, #faf5eb)';

  useEffect(() => {
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      if (max <= 0) return;
      if (lineRef.current) {
        lineRef.current.style.height = `${(window.scrollY / max) * 100}%`;
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      {/* Scene rail — the two arrows held far apart by the progress line, in
          the middle of the viewport. */}
      <div className="fixed right-4 top-1/2 z-50 flex -translate-y-1/2 flex-col items-center md:right-6">
        <button
          type="button"
          onClick={() => jumpToScene(activeSceneIndex - 1)}
          disabled={activeSceneIndex === 0}
          data-interactive
          aria-label="Previous scene"
          className={`${ROUND} ${IDLE} ${SIZE}`}
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

        {/* The tall span that keeps the two arrows far apart — and the only
            progress readout now that the mobile bottom bar is gone. */}
        <div
          role="progressbar"
          aria-valuenow={activeSceneIndex + 1}
          aria-valuemin={1}
          aria-valuemax={total}
          aria-label={`Story progress, scene ${activeSceneIndex + 1} of ${total}`}
          className="relative my-2 h-20 w-px md:my-4 md:h-40"
          style={{ background: `${text}26` }}
        >
          <div
            ref={lineRef}
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
          className={`${ROUND} ${IDLE} ${SIZE}`}
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

      {/* Audio toggles — a tight pair on the scene counter's baseline
          (`bottom-6`, matching the 01 / 13 marker in Scene.tsx), in the same
          column as the arrows above. */}
      <div className="fixed bottom-6 right-4 z-50 flex flex-col items-center gap-1.5 md:right-6">
        <button
          type="button"
          onClick={toggleMute}
          disabled={!settings.sound}
          data-interactive
          title={musicOn ? 'Music on' : 'Music off'}
          className={`${ROUND} ${IDLE} ${SIZE}`}
          aria-label={musicOn ? 'Mute music' : 'Unmute music'}
          aria-pressed={!musicOn}
        >
          {musicOn ? (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d="M9 18V5l12-2v13"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          ) : (
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              aria-hidden="true"
            >
              <path
                d="M9 18V5l12-2v13M3 3l18 18"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle cx="6" cy="18" r="3" />
              <circle cx="18" cy="16" r="3" />
            </svg>
          )}
        </button>

        <button
          type="button"
          onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
          data-interactive
          className={`${ROUND} ${SIZE} ${
            settings.autoScroll
              ? 'border-[#ffb7c5]/60 bg-[#ffb7c5]/20 text-[#ffb7c5]'
              : IDLE
          }`}
          aria-pressed={settings.autoScroll}
          aria-label={
            settings.autoScroll ? 'Pause auto story' : 'Start auto story'
          }
          title={settings.autoScroll ? 'AUTO STORY ●' : 'Auto story off'}
        >
          {settings.autoScroll ? (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <rect x="6" y="4" width="4" height="16" rx="1" />
              <rect x="14" y="4" width="4" height="16" rx="1" />
            </svg>
          ) : (
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <path d="M8 5v14l11-7z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
