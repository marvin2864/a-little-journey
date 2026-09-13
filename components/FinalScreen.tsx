'use client'

import { useRef, useState } from 'react'
import Image from 'next/image'
import { useStory } from '@/context/StoryContext'
import { LOGO } from '@/data/story'

/**
 * Closing screen (DESIGN.md §14). Soft cream / sakura gradient. Minimal.
 * Replay button resets to intro; Share button uses Web Share API when
 * available, falls back to copying the URL.
 */
export function FinalScreen() {
  const { settings, toggleMute, isMuted, setPhase } = useStory()
  const [secretShown, setSecretShown] = useState(false)
  const [copied, setCopied] = useState(false)
  const clickCount = useRef(0)

  const onLogoClick = () => {
    clickCount.current += 1
    if (clickCount.current >= 3 && !secretShown) {
      setSecretShown(true)
      // Auto-hide after 6s so the screen stays tidy.
      setTimeout(() => {
        setSecretShown(false)
        clickCount.current = 0
      }, 6000)
    }
  }

  const onReplay = () => {
    window.scrollTo(0, 0)
    setPhase('intro')
  }

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : ''
    const title = 'A Little Journey'
    const text = 'A small journey, an unexpected meeting, and a memory that stayed.'

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url })
        return
      } catch {
        // User cancelled or share unavailable — fall through to clipboard.
      }
    }

    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch {
      /* clipboard blocked */
    }
  }

  const musicOn = settings.sound && !isMuted

  return (
    <main
      className="fixed inset-0 z-50 flex items-center justify-center px-6"
      style={{
        background:
          'radial-gradient(ellipse at top, #fff5ee 0%, #f8e9e0 55%, #f0dcd3 100%)',
      }}
    >
      <div className="flex max-w-xl flex-col items-center gap-10 text-center">
        <button
          type="button"
          onClick={onLogoClick}
          className="group relative"
          aria-label="A Little Journey — click 3 times for a secret"
        >
          <Image
            src={LOGO}
            alt=""
            width={96}
            height={96}
            className="opacity-80 transition-opacity group-hover:opacity-100"
          />
        </button>

        <div className="space-y-4">
          <h1 className="text-3xl font-extralight leading-tight tracking-wide text-[#2a1a12] md:text-4xl">
            Thank you for being part of the story.
          </h1>
          <p className="text-sm tracking-[0.2em] text-[#2a1a12]/50">
            Some memories stay.
          </p>
        </div>

        {secretShown && (
          <p
            className="animate-fade-in text-sm italic text-[#2a1a12]/70"
            role="status"
          >
            you found a little secret ♡
          </p>
        )}

        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={onReplay}
            data-interactive
            className="rounded-full bg-[#2a1a12] px-7 py-3 text-xs tracking-[0.3em] text-[#faf5eb] transition-all hover:scale-[1.03] hover:bg-[#1a0a06] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12]"
          >
            REPLAY THE JOURNEY
          </button>
          <button
            type="button"
            onClick={toggleMute}
            data-interactive
            className="rounded-full border border-[#2a1a12]/20 bg-white/40 px-7 py-3 text-xs tracking-[0.3em] text-[#2a1a12] backdrop-blur-sm transition-all hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12]"
            aria-pressed={!musicOn}
            aria-label={musicOn ? 'Mute sound' : 'Unmute sound'}
          >
            {musicOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
          <button
            type="button"
            onClick={onShare}
            data-interactive
            className="rounded-full border border-[#2a1a12]/20 bg-white/40 px-7 py-3 text-xs tracking-[0.3em] text-[#2a1a12] backdrop-blur-sm transition-all hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12]"
          >
            {copied ? 'LINK COPIED' : 'SHARE'}
          </button>
        </div>
      </div>
    </main>
  )
}
