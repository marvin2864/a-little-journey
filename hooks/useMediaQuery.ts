'use client';

import { useCallback, useSyncExternalStore } from 'react';

/**
 * Subscribe to a media query. Reads through useSyncExternalStore so the value
 * arrives with the client render rather than a post-mount setState — the
 * server snapshot is false, which keeps SSR and hydration in agreement.
 */
export function useMediaQuery(query: string): boolean {
  const subscribe = useCallback(
    (onChange: () => void) => {
      const mq = window.matchMedia(query);
      mq.addEventListener('change', onChange);
      return () => mq.removeEventListener('change', onChange);
    },
    [query]
  );
  const getSnapshot = useCallback(
    () => window.matchMedia(query).matches,
    [query]
  );

  return useSyncExternalStore(subscribe, getSnapshot, () => false);
}
