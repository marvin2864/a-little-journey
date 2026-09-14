'use client';

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useSyncExternalStore,
} from 'react';
import { scenes, themeConfigs } from '@/data/story';
import { AudioManager } from '@/lib/audio';
import type {
  AppPhase,
  ExperienceSettings,
  SceneThemeConfig,
} from '@/types/story';

type StoryContextValue = {
  phase: AppPhase;
  setPhase: (p: AppPhase) => void;
  activeSceneIndex: number;
  settings: ExperienceSettings;
  currentTheme: SceneThemeConfig;
  audioManager: AudioManager;
  enterStory: () => void;
  updateScene: (index: number) => void;
  updateSettings: (patch: Partial<ExperienceSettings>) => void;
  toggleMute: () => void;
  isMuted: boolean;
  jumpToScene: (index: number) => void;
  /** Report a scene's real video duration (seconds) once known. */
  reportVideoDuration: (index: number, seconds: number) => void;
  /** Auto-scroll hold time for a scene: real video duration, else the
   * configured fallback. */
  getSceneDuration: (index: number) => number;
};

const StoryContext = createContext<StoryContextValue | null>(null);

// Singleton — one audio system for the whole app (DESIGN.md §12).
const audioManager = new AudioManager();

const SETTINGS_KEY = 'alittlejourney:settings';

const DEFAULT_SETTINGS: ExperienceSettings = {
  sound: true,
  motion: true,
  autoScroll: false,
};

/**
 * Experience settings as an external store, so the persisted value can be read
 * during the render that needs it. Reading localStorage in an effect and
 * calling setState there would cost a second render pass on every load, and a
 * ref mirror of the current value cannot be written during render at all.
 * `getServerSnapshot` keeps the server/hydration render on defaults — React
 * re-reads the real value right after hydration.
 */
let settingsCache: ExperienceSettings | null = null;
const settingsListeners = new Set<() => void>();

function readPersistedSettings(): ExperienceSettings | null {
  if (typeof window === 'undefined') return null;
  try {
    const raw = localStorage.getItem(SETTINGS_KEY);
    return raw
      ? {
          ...DEFAULT_SETTINGS,
          ...(JSON.parse(raw) as Partial<ExperienceSettings>),
        }
      : null;
  } catch {
    return null; // first visit, or storage blocked
  }
}

function getSettingsSnapshot(): ExperienceSettings {
  settingsCache ??= readPersistedSettings() ?? DEFAULT_SETTINGS;
  return settingsCache;
}

function getServerSettingsSnapshot(): ExperienceSettings {
  return DEFAULT_SETTINGS;
}

function subscribeSettings(onChange: () => void): () => void {
  settingsListeners.add(onChange);
  return () => {
    settingsListeners.delete(onChange);
  };
}

function writeSettings(patch: Partial<ExperienceSettings>): void {
  settingsCache = { ...getSettingsSnapshot(), ...patch };
  try {
    localStorage.setItem(SETTINGS_KEY, JSON.stringify(settingsCache));
  } catch {
    /* ignore quota / blocked storage */
  }
  for (const onChange of settingsListeners) onChange();
}

/** Active section index for the closing screen (the "14th beat"). */
export const ENDING_INDEX = scenes.length;

export function StoryProvider({ children }: { children: React.ReactNode }) {
  const [phase, setPhase] = useState<AppPhase>('intro');
  const [activeSceneIndex, setActiveSceneIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(false);
  const settings = useSyncExternalStore(
    subscribeSettings,
    getSettingsSnapshot,
    getServerSettingsSnapshot
  );

  const currentTheme: SceneThemeConfig = useMemo(
    () =>
      themeConfigs[
        activeSceneIndex >= scenes.length
          ? 'ending'
          : scenes[activeSceneIndex].theme
      ],
    [activeSceneIndex]
  );

  const updateScene = useCallback((index: number) => {
    if (index < 0 || index > ENDING_INDEX) return;
    setActiveSceneIndex((prev) => (prev === index ? prev : index));
  }, []);

  // Arm the optional mid-scene end-cue track (final-scene handoff). No-op for
  // scenes without musicEndCue / musicEndAt.
  const armEndCue = useCallback((scene: (typeof scenes)[number]) => {
    if (getSettingsSnapshot().sound && scene.musicEndCue) {
      audioManager.setEndCue(
        scene.musicEndCue,
        scene.musicEndAt,
        scene.musicEndFadeIn,
        scene.musicEndFadeOut
      );
    } else {
      audioManager.setEndCue(undefined);
    }
  }, []);

  const enterStory = useCallback(() => {
    setPhase('loading');
    // Unlock inside the user gesture (browser audio policy).
    audioManager.unlock();
    if (getSettingsSnapshot().sound) {
      audioManager.playTrack(scenes[0].musicCue);
      armEndCue(scenes[0]);
    }
    window.scrollTo(0, 0);
    // Brief breathing room so the loading screen is perceptible, then play.
    const t = window.setTimeout(() => setPhase('playing'), 1200);
    return () => window.clearTimeout(t);
  }, [armEndCue]);

  /** Point the soundtrack at a scene, or hand off to the end cue on the
   * closing beat. */
  const syncAudio = useCallback(
    (index: number) => {
      if (index === ENDING_INDEX) {
        // The end cue armed by FINAL_SHOT may never have reached its
        // video-progress threshold if the viewer scrolled fast. Force the
        // handoff so the closing section is never left on the wrong track.
        audioManager.tickEndCue(1);
        return;
      }
      if (!getSettingsSnapshot().sound) return;
      audioManager.playTrack(scenes[index].musicCue);
      armEndCue(scenes[index]);
    },
    [armEndCue]
  );

  // Sync the soundtrack only once scrolling SETTLES on a scene. A fast scroll
  // crosses intermediate scenes in a few frames each; playing their musicCue
  // on the way past produces the wrong song for the scene you land on.
  useEffect(() => {
    if (phase !== 'playing') return;
    const t = window.setTimeout(() => syncAudio(activeSceneIndex), 260);
    return () => window.clearTimeout(t);
  }, [activeSceneIndex, phase, syncAudio]);

  const updateSettings = useCallback((patch: Partial<ExperienceSettings>) => {
    const prev = getSettingsSnapshot();
    if (patch.sound !== undefined && patch.sound !== prev.sound) {
      if (patch.sound) {
        audioManager.unmute();
        setIsMuted(false);
        audioManager.resume();
      } else {
        audioManager.pause();
      }
    }
    writeSettings(patch);
  }, []);

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      if (next) audioManager.mute();
      else audioManager.unmute();
      return next;
    });
  }, []);

  // Real video durations, learned lazily as scenes mount (see Scene.tsx).
  // State (not a ref) so a pending auto-scroll timer re-arms with the true
  // length the moment metadata arrives, instead of finishing on the estimate.
  const [videoDurations, setVideoDurations] = useState<Record<number, number>>(
    {}
  );
  const reportVideoDuration = useCallback((index: number, seconds: number) => {
    if (!Number.isFinite(seconds) || seconds <= 0) return;
    setVideoDurations((prev) =>
      prev[index] === seconds ? prev : { ...prev, [index]: seconds }
    );
  }, []);
  const getSceneDuration = useCallback(
    (index: number) => videoDurations[index] ?? scenes[index]?.duration ?? 8,
    [videoDurations]
  );

  const jumpToScene = useCallback((index: number) => {
    if (index < 0 || index > ENDING_INDEX) return;
    const target =
      index === ENDING_INDEX
        ? document.getElementById('ending')
        : document.getElementById(`scene-${index}`);
    if (!target) return;
    // Native smooth scroll: works with CSS scroll-snap and on mobile, where
    // Lenis (wheel-based) would stall touch scrolling.
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
  }, []);

  return (
    <StoryContext.Provider
      value={{
        phase,
        setPhase,
        activeSceneIndex,
        settings,
        currentTheme,
        audioManager,
        enterStory,
        updateScene,
        updateSettings,
        toggleMute,
        isMuted,
        jumpToScene,
        reportVideoDuration,
        getSceneDuration,
      }}
    >
      {children}
    </StoryContext.Provider>
  );
}

export function useStory(): StoryContextValue {
  const ctx = useContext(StoryContext);
  if (!ctx) throw new Error('useStory must be used within a StoryProvider');
  return ctx;
}
