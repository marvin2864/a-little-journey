'use client'

import { useEffect } from 'react'
import Image from 'next/image'
import { useStory } from '@/context/StoryContext'
import { scenes, LOGO } from '@/data/story'

export function IntroScreen() {
  const { settings, updateSettings, enterStory } = useStory()

  // Warm up the first scene video over the network so ENTER feels instant.
  // <link rel=preload as=video> isn't a supported combo (console warning);
  // a paused, muted <video> preload does the job.
  useEffect(() => {
    const warm = document.createElement('video')
    warm.src = scenes[0].video
    warm.preload = 'auto'
    warm.muted = true
    warm.playsInline = true
    warm.style.display = 'none'
    document.body.appendChild(warm)
    return () => {
      warm.removeAttribute('src')
      warm.load()
      warm.remove()
    }
  }, [])

  return (
    <main className="fixed inset-0 z-50 flex flex-col items-center justify-center overflow-hidden bg-[#07070f]">
      {/* Soft glow behind the logo */}
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[520px] w-[520px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-gradient-radial from-[#ffb7c5]/10 to-transparent blur-3xl" />

      {/* Logo with breathing animation */}
      <div className="animate-breathe relative mb-10">
        <Image
          src={LOGO}
          alt="A Little Journey"
          width={128}
          height={128}
          priority
          className="drop-shadow-[0_0_40px_rgba(255,183,197,0.25)]"
        />
      </div>

      {/* Copy */}
      <h1 className="sr-only">A Little Journey</h1>
      <p className="text-balance px-6 text-center text-2xl font-extralight tracking-[0.12em] text-[#faf5eb]/90 md:text-3xl">
        A little story.
      </p>
      <p className="mt-3 text-sm tracking-[0.2em] text-[#faf5eb]/40">
        Best experienced with sound.
      </p>

      {/* Experience settings */}
      <fieldset className="mt-10 flex flex-wrap items-center justify-center gap-x-8 gap-y-3">
        <legend className="sr-only">Experience settings</legend>
        <SettingToggle
          label="Sound"
          value={settings.sound ? 'ON' : 'OFF'}
          onToggle={() =>
            updateSettings({ sound: !settings.sound })
          }
        />
        <SettingToggle
          label="Motion"
          value={settings.motion ? 'ON' : 'REDUCED'}
          onToggle={() =>
            updateSettings({ motion: !settings.motion })
          }
        />
        <SettingToggle
          label="Auto Scroll"
          value={settings.autoScroll ? 'ON' : 'OFF'}
          onToggle={() =>
            updateSettings({ autoScroll: !settings.autoScroll })
          }
        />
      </fieldset>

      {/* Enter */}
      <button
        type="button"
        onClick={enterStory}
        data-interactive
        className="group mt-14 rounded-full border border-[#faf5eb]/25 bg-[#faf5eb]/5 px-10 py-4 text-xs tracking-[0.35em] text-[#faf5eb]/80 backdrop-blur-sm transition-all duration-500 hover:scale-[1.03] hover:border-[#faf5eb]/50 hover:bg-[#faf5eb]/10 hover:text-[#faf5eb] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#ffb7c5]"
      >
        ENTER THE STORY
      </button>
    </main>
  )
}

function SettingToggle({
  label,
  value,
  onToggle,
}: {
  label: string
  value: string
  onToggle: () => void
}) {
  return (
    <button
      type="button"
      onClick={onToggle}
      data-interactive
      aria-pressed={value !== 'OFF' && value !== 'REDUCED'}
      className="flex items-baseline gap-2 text-xs tracking-[0.15em] text-[#faf5eb]/50 transition-colors hover:text-[#faf5eb]/80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#ffb7c5]"
    >
      <span>{label}:</span>
      <span className="text-[#faf5eb]/90">{value}</span>
    </button>
  )
}
