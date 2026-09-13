'use client'

import { StoryProvider, useStory } from '@/context/StoryContext'
import { IntroScreen } from '@/components/IntroScreen'
import { LoadingScreen } from '@/components/LoadingScreen'
import { StoryPlayer } from '@/components/StoryPlayer'
import { FinalScreen } from '@/components/FinalScreen'
import { AudioBlockedOverlay } from '@/components/AudioBlockedOverlay'

function StoryOrchestrator() {
  const { phase } = useStory()

  return (
    <>
      {phase === 'intro' && <IntroScreen />}
      {phase === 'loading' && <LoadingScreen />}
      {phase === 'playing' && <StoryPlayer />}
      {phase === 'ending' && <FinalScreen />}
      {phase !== 'intro' && <AudioBlockedOverlay />}
    </>
  )
}

export default function Home() {
  return (
    <StoryProvider>
      <StoryOrchestrator />
    </StoryProvider>
  )
}
