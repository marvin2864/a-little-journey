'use client'

import { useStory } from '@/context/StoryContext'

/** Floating controls: music toggle + auto-scroll toggle (DESIGN.md §11–12). */
export function FloatingControls() {
  const { settings, updateSettings, toggleMute, isMuted } = useStory()

  const musicOn = settings.sound && !isMuted

  return (
    <div className="fixed bottom-5 right-4 z-50 flex flex-col gap-2 md:bottom-6 md:right-6">
      <button
        type="button"
        onClick={toggleMute}
        disabled={!settings.sound}
        data-interactive
        className="flex h-8 w-8 items-center justify-center rounded-full border border-[var(--scene-text,#faf5eb)]/20 bg-black/30 text-base backdrop-blur-sm transition-all hover:border-[var(--scene-text,#faf5eb)]/40 hover:bg-black/50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5] disabled:cursor-not-allowed disabled:opacity-40"
        aria-label={musicOn ? 'Mute music' : 'Unmute music'}
        aria-pressed={!musicOn}
      >
        {musicOn ? (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M9 18V5l12-2v13" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        ) : (
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" aria-hidden="true">
            <path d="M9 18V5l12-2v13M3 3l18 18" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="6" cy="18" r="3" />
            <circle cx="18" cy="16" r="3" />
          </svg>
        )}
      </button>

      <button
        type="button"
        onClick={() => updateSettings({ autoScroll: !settings.autoScroll })}
        data-interactive
        className={`flex h-8 w-8 items-center justify-center rounded-full border backdrop-blur-sm transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5] ${
          settings.autoScroll
            ? 'border-[#ffb7c5]/60 bg-[#ffb7c5]/20 text-[#ffb7c5]'
            : 'border-[var(--scene-text,#faf5eb)]/20 bg-black/30 text-[var(--scene-text,#faf5eb)]/70 hover:border-[var(--scene-text,#faf5eb)]/40'
        }`}
        aria-pressed={settings.autoScroll}
        aria-label={settings.autoScroll ? 'Pause auto story' : 'Start auto story'}
        title={settings.autoScroll ? 'AUTO STORY ●' : 'Auto story off'}
      >
        {settings.autoScroll ? (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <rect x="6" y="4" width="4" height="16" rx="1" />
            <rect x="14" y="4" width="4" height="16" rx="1" />
          </svg>
        ) : (
          <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
            <path d="M8 5v14l11-7z" />
          </svg>
        )}
      </button>
    </div>
  )
}
