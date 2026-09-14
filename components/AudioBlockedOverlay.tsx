'use client';

import { useEffect, useState } from 'react';
import { useStory } from '@/context/StoryContext';

/**
 * Fallback overlay shown when browser blocks audio playback.
 * "Tap anywhere to begin the soundtrack" — per DESIGN.md §6.
 */
export function AudioBlockedOverlay() {
  const { audioManager } = useStory();
  const [show, setShow] = useState(false);

  useEffect(() => {
    // Subscribe (don't assign) — the manager is shared, not owned here.
    return audioManager.onBlocked(() => setShow(true));
  }, [audioManager]);

  if (!show) return null;

  const handleDismiss = () => {
    audioManager.unlock();
    audioManager.resume();
    setShow(false);
  };

  return (
    <div
      onClick={handleDismiss}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault();
          handleDismiss();
        }
      }}
      role="button"
      tabIndex={0}
      className="fixed inset-0 z-[999] flex cursor-pointer items-center justify-center bg-black/80 backdrop-blur-sm"
      aria-label="Tap to begin the soundtrack"
    >
      <p className="text-center text-lg text-white/90 sm:text-xl">
        Tap anywhere to begin the soundtrack
      </p>
    </div>
  );
}
