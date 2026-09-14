'use client';

import { useStory } from '@/context/StoryContext';
import { useMediaQuery } from '@/hooks/useMediaQuery';

/**
 * True when either the OS prefers reduced motion OR the user turned Motion off
 * in the intro settings. Sound and motion are independent (DESIGN.md §12).
 */
export function useReducedMotion(): boolean {
  const { settings } = useStory();
  const osPrefers = useMediaQuery('(prefers-reduced-motion: reduce)');

  return osPrefers || !settings.motion;
}
