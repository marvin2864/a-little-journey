'use client';

import { useEffect, useRef } from 'react';
import { useStory } from '@/context/StoryContext';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scenes, themeConfigs } from '@/data/story';

/**
 * Scene-change wash: a brief fill of the incoming theme color that fades out,
 * so consecutive scenes read as one film (DESIGN.md §9) rather than hard cuts.
 *
 * Driven imperatively through the Web Animations API rather than React state:
 * the fill is a fire-and-forget visual with no value the render depends on, so
 * animating the element directly keeps the effect a pure "sync the DOM" step
 * and drops a state + effect pair (and the render it would have forced).
 */
export function SceneTransition() {
  const { activeSceneIndex } = useStory();
  const reducedMotion = useReducedMotion();
  const washRef = useRef<HTMLDivElement>(null);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      return;
    }
    if (reducedMotion) return;
    const scene = scenes[activeSceneIndex];
    const el = washRef.current;
    if (!scene || !el) return;
    el.style.background = themeConfigs[scene.theme].gradientFrom;
    // Cancel any in-flight wash so a fast scroll doesn't stack fades.
    el.getAnimations().forEach((a) => a.cancel());
    el.animate([{ opacity: 1 }, { opacity: 0 }], {
      duration: 900,
      easing: 'ease-out',
    });
  }, [activeSceneIndex, reducedMotion]);

  return (
    <div
      ref={washRef}
      className="pointer-events-none fixed inset-0 z-[25] opacity-0"
      aria-hidden="true"
    />
  );
}
