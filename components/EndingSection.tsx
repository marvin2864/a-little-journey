'use client';

import { useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { useStory } from '@/context/StoryContext';
import { LOGO } from '@/data/story';

/**
 * Closing section — the film's 14th beat, in-flow after FINAL_SHOT rather than
 * a separate screen. Same full-viewport geometry as a Scene so CSS scroll-snap
 * treats it as just another stop and a plain scroll into it is enough to end
 * the story.
 *
 * Music is deliberately left alone: FINAL_SHOT's end cue keeps playing.
 */
export function EndingSection() {
  const { settings, toggleMute, isMuted } = useStory();
  const ref = useRef<HTMLElement>(null);
  const [shown, setShown] = useState(false);
  const [copied, setCopied] = useState(false);
  const [secretShown, setSecretShown] = useState(false);
  const clickCount = useRef(0);

  // Reveal on entry, and drive the particle-free fade so the section doesn't
  // just appear as a hard cut from the final video.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setShown(true);
      },
      { threshold: 0.45 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const onLogoClick = () => {
    clickCount.current += 1;
    if (clickCount.current >= 3 && !secretShown) {
      setSecretShown(true);
      window.setTimeout(() => {
        setSecretShown(false);
        clickCount.current = 0;
      }, 6000);
    }
  };

  const onReplay = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const onShare = async () => {
    const url = typeof window !== 'undefined' ? window.location.href : '';
    const title = 'A Little Journey';
    const text =
      'A small journey, an unexpected meeting, and a memory that stayed.';

    if (typeof navigator !== 'undefined' && 'share' in navigator) {
      try {
        await navigator.share({ title, text, url });
        return;
      } catch {
        // Cancelled or unavailable — fall through to clipboard.
      }
    }
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard blocked */
    }
  };

  const musicOn = settings.sound && !isMuted;

  return (
    <section
      ref={ref}
      id="ending"
      data-ending
      aria-label="The end"
      className="relative flex h-[100svh] w-full snap-start flex-col items-center justify-center overflow-hidden px-6"
      style={{
        background:
          'radial-gradient(ellipse at 50% 0%, #fff6ec 0%, #f7e9e0 55%, #efdcd2 100%)',
      }}
    >
      {/* Soft sakura glow — the film's last light. */}
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[560px] w-[560px] -translate-x-1/2 -translate-y-1/2 rounded-full blur-3xl"
        style={{
          background:
            'radial-gradient(circle, rgba(246,185,198,0.28) 0%, transparent 70%)',
        }}
        aria-hidden="true"
      />

      <div
        className={`relative flex max-w-xl flex-col items-center gap-8 text-center transition-all duration-1000 ease-out ${
          shown ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'
        }`}
      >
        <button
          type="button"
          onClick={onLogoClick}
          data-interactive
          className="group"
          aria-label="A Little Journey — click three times for a little secret"
        >
          <Image
            src={LOGO}
            alt=""
            width={88}
            height={88}
            className="opacity-85 transition-opacity group-hover:opacity-100"
          />
        </button>

        <div className="space-y-4">
          <h2 className="text-balance text-[clamp(1.6rem,6vw,2.5rem)] font-extralight leading-tight tracking-wide text-[#2a1a12]">
            Thank you for being part of the story.
          </h2>
          <p className="text-xs tracking-[0.25em] text-[#2a1a12]/45 sm:text-sm">
            SOME MEMORIES STAY
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

        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
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
            onClick={onShare}
            data-interactive
            className="rounded-full border border-[#2a1a12]/20 bg-white/40 px-7 py-3 text-xs tracking-[0.3em] text-[#2a1a12] backdrop-blur-sm transition-all hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12]"
          >
            {copied ? 'LINK COPIED' : 'SHARE'}
          </button>
          <button
            type="button"
            onClick={toggleMute}
            disabled={!settings.sound}
            data-interactive
            aria-pressed={!musicOn}
            className="rounded-full border border-[#2a1a12]/20 bg-white/40 px-7 py-3 text-xs tracking-[0.3em] text-[#2a1a12] backdrop-blur-sm transition-all hover:bg-white/60 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#2a1a12] disabled:cursor-not-allowed disabled:opacity-40"
          >
            {musicOn ? 'SOUND ON' : 'SOUND OFF'}
          </button>
        </div>

        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
          data-interactive
          className="mt-2 text-[0.65rem] tracking-[0.3em] text-[#2a1a12]/40 transition-colors hover:text-[#2a1a12]/70"
        >
          BACK TO THE BEGINNING
        </button>
      </div>
    </section>
  );
}
