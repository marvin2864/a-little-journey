'use client';

import Image from 'next/image';
import { LOGO } from '@/data/story';

export function LoadingScreen() {
  return (
    <main className="fixed inset-0 z-50 flex flex-col items-center justify-center gap-8 bg-[#07070f]">
      <div className="animate-breathe">
        <Image src={LOGO} alt="" width={72} height={72} priority />
      </div>

      <div className="flex w-56 flex-col items-center gap-3">
        <p className="text-center text-xs tracking-[0.25em] text-[#faf5eb]/60">
          Preparing your journey…
        </p>
        <div className="h-px w-full overflow-hidden bg-[#faf5eb]/10">
          <div className="animate-loading-bar h-full w-1/3 bg-gradient-to-r from-transparent via-[#ffb7c5] to-transparent" />
        </div>
      </div>
    </main>
  );
}
