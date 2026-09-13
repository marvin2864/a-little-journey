import { useEffect, useState } from 'react'

export function ScrollCue({ visible }: { visible: boolean }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted || !visible) return null

  return (
    <div className="pointer-events-none fixed bottom-8 left-1/2 z-40 flex -translate-x-1/2 flex-col items-center gap-2 text-white/60 transition-opacity duration-500">
      <span className="text-sm tracking-wide">Scroll to begin</span>
      <svg
        className="h-6 w-6 animate-bounce"
        fill="none"
        stroke="currentColor"
        viewBox="0 0 24 24"
      >
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M19 14l-7 7m0 0l-7-7m7 7V3"
        />
      </svg>
    </div>
  )
}
