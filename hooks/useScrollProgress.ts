'use client';

import { useEffect } from 'react';
import { useStory } from '@/context/StoryContext';

/**
 * Watches every [data-scene] section inside the scroll container. Updates the
 * active scene index when a scene crosses the viewport centre. Uses a plain
 * scroll listener (not ScrollTrigger) because it must work under reduced
 * motion and does not need scrub values. The closing [data-ending] section
 * reports index `scenes.length` so it counts as the final beat.
 */
export function useScrollProgress(
  rootRef: React.RefObject<HTMLDivElement | null>
) {
  const { updateScene } = useStory();

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;

    let ticking = false;

    const onScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        ticking = false;
        const sections = root.querySelectorAll<HTMLElement>(
          '[data-scene], [data-ending]'
        );
        const mid = window.innerHeight * 0.5;
        let best = 0;
        let bestDist = Infinity;
        sections.forEach((s) => {
          const rect = s.getBoundingClientRect();
          const center = rect.top + rect.height / 2;
          const dist = Math.abs(center - mid);
          if (dist < bestDist) {
            bestDist = dist;
            // The closing section has no numeric id — it is the last index.
            const index = s.hasAttribute('data-ending')
              ? sections.length - 1
              : Number(s.id.replace('scene-', ''));
            if (Number.isFinite(index)) best = index;
          }
        });
        // No local "did it change" guard: updateScene bails on an unchanged
        // index, so the ref mirror of activeSceneIndex was dead weight.
        updateScene(best);
      });
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    onScroll();
    return () => {
      window.removeEventListener('scroll', onScroll);
      ticking = false;
    };
  }, [rootRef, updateScene]);
}
