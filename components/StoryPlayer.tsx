'use client';

import { useCallback, useEffect, useRef } from 'react';
import { useStory } from '@/context/StoryContext';
import { useScrollProgress } from '@/hooks/useScrollProgress';
import { useReducedMotion } from '@/hooks/useReducedMotion';
import { scenes, themeConfigs } from '@/data/story';
import { Scene } from '@/components/Scene';
import { EndingSection } from '@/components/EndingSection';
import { ParticleCanvas } from '@/components/ParticleCanvas';
import { SceneTransition } from '@/components/SceneTransition';
import { SceneNav } from '@/components/SceneNav';
import { FloatingControls } from '@/components/FloatingControls';
import { CustomCursor } from '@/components/CustomCursor';

/**
 * The film: 13 video scenes plus the closing section, all in one native scroll
 * flow. CSS scroll-snap (globals.css + snap-start on every section) keeps the
 * viewport resting on a boundary, so a small flick and a hard scroll both land
 * on exactly the next beat.
 */
export function StoryPlayer() {
  const {
    activeSceneIndex,
    currentTheme,
    settings,
    jumpToScene,
    toggleMute,
    getSceneDuration,
  } = useStory();
  const rootRef = useRef<HTMLDivElement>(null);
  const reducedMotion = useReducedMotion();

  useScrollProgress(rootRef);

  // The film grain overlay (body::after) animates a full-viewport layer with
  // large translate steps — over the videos it shows as a pale rectangle
  // bouncing around. Suppress it for as long as the story is on screen.
  useEffect(() => {
    document.body.classList.add('in-story');
    return () => document.body.classList.remove('in-story');
  }, []);

  const lastIndex = scenes.length; // index of the closing section
  const atEnd = activeSceneIndex >= lastIndex;

  // Advance one beat: scene → scene, or scene 13 → closing section.
  const step = useCallback(
    (dir: 1 | -1) => {
      const target = activeSceneIndex + dir;
      if (target < 0 || target > lastIndex) return;
      jumpToScene(target);
    },
    [activeSceneIndex, lastIndex, jumpToScene]
  );

  // Auto-scroll holds each scene until its video actually ENDS (`ended` from
  // the element itself — no guessed timing), then advances. The configured
  // `duration` is only a watchdog for slow/blocked loads. Manual wheel/touch/key
  // input cancels the pending advance so the viewer is never trapped.
  const activeSinceRef = useRef(0);
  useEffect(() => {
    activeSinceRef.current = Date.now();
  }, [activeSceneIndex, settings.autoScroll]);

  const handleVideoEnded = useCallback(
    (sceneIndex: number) => {
      if (!settings.autoScroll || reducedMotion) return;
      if (sceneIndex !== activeSceneIndex) return;
      step(1);
    },
    [settings.autoScroll, reducedMotion, activeSceneIndex, step]
  );

  // Watchdog: if metadata is slow or the network stalls, still advance after
  // the configured fallback so the film never hangs on a black frame.
  useEffect(() => {
    if (!settings.autoScroll || reducedMotion) return;
    if (atEnd) return;

    const holdMs = getSceneDuration(activeSceneIndex) * 1000 + 1500;
    const elapsed = Date.now() - activeSinceRef.current;
    const remaining = Math.max(500, holdMs - elapsed);
    const timer = setTimeout(() => step(1), remaining);

    const cancel = () => clearTimeout(timer);
    window.addEventListener('wheel', cancel, { passive: true });
    window.addEventListener('touchstart', cancel, { passive: true });
    window.addEventListener('keydown', cancel);

    return () => {
      cancel();
      window.removeEventListener('wheel', cancel);
      window.removeEventListener('touchstart', cancel);
      window.removeEventListener('keydown', cancel);
    };
  }, [
    activeSceneIndex,
    atEnd,
    settings.autoScroll,
    reducedMotion,
    step,
    getSceneDuration,
  ]);

  // Keyboard: arrows step beats, M toggles mute. Works on desktop and mobile
  // keyboards alike.
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement | null)?.tagName;
      if (tag === 'INPUT' || tag === 'TEXTAREA') return;

      if (e.key === 'm' || e.key === 'M') {
        toggleMute();
        return;
      }
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        e.preventDefault();
        step(1);
      } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        e.preventDefault();
        step(-1);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [step, toggleMute]);

  // Keep theme CSS vars synced so overlays, controls, and progress read the
  // active palette without prop drilling.
  useEffect(() => {
    const root = document.documentElement;
    root.style.setProperty('--scene-bg', currentTheme.bg);
    root.style.setProperty('--scene-text', currentTheme.textColor);
    root.style.setProperty('--scene-accent', currentTheme.particleColor);
    root.style.backgroundColor = currentTheme.bg;
    root.style.colorScheme = currentTheme.bg > '#808080' ? 'light' : 'dark';
  }, [currentTheme]);

  return (
    <>
      <div ref={rootRef} className="relative w-full">
        {scenes.map((scene, i) => (
          <Scene
            key={scene.id}
            scene={scene}
            sceneIndex={i}
            theme={themeConfigs[scene.theme]}
            total={scenes.length}
            onEnded={handleVideoEnded}
          />
        ))}
        {/* Beat 14 — a snap stop like any scene, not a separate screen. */}
        <EndingSection />
      </div>

      <ParticleCanvas />
      <SceneTransition />
      <SceneNav />
      <FloatingControls />
      <CustomCursor />
    </>
  );
}
