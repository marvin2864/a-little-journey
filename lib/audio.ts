/**
 * Centralized soundtrack controller.
 *
 * One instance for the whole app (see context/StoryContext). Scene components
 * never create their own <audio> element — they call playTrack() and the
 * manager handles crossfading, muting, and cleanup.
 *
 * Browser audio policy: nothing may sound before the user presses
 * ENTER THE STORY. unlock() must be called from inside that click handler.
 */

const DEFAULT_VOLUME = 0.28 // ~28%, per DESIGN.md §12 (20–35%)
const FADE_OUT_MS = 1200
const FADE_IN_MS = 1500

/** ~330ms of silence. Base64 so the unlock gesture never triggers a network request. */
const SILENT_WAV =
  'data:audio/wav;base64,UklGRigAAABXQVZFZm10IBIAAAABAAEARKwAAIhYAQACABAAAABkYXRhAgAAAAEA'

type Track = { el: HTMLAudioElement; src: string }

export class AudioManager {
  private tracks = new Set<Track>()
  private current: Track | null = null
  private volume = DEFAULT_VOLUME
  private muted = false
  private unlocked = false
  /** Fires when playback is blocked despite a gesture — UI shows the
   * "tap anywhere to begin the soundtrack" fallback (DESIGN.md §6). */
  onBlocked: (() => void) | null = null

  /**
   * Call synchronously inside a user gesture. Safari/iOS require a play()
   * attempt within the handler to mark audio as user-activated. Uses a tiny
   * inlined silent WAV (no network request, no 404 in console).
   */
  unlock(): void {
    if (this.unlocked) return
    this.unlocked = true
    const warm = this.createTrack(SILENT_WAV)
    warm.el.volume = 0
    warm.el.loop = false
    void warm.el
      .play()
      .then(() => {
        warm.el.pause()
        this.destroyTrack(warm)
      })
      .catch(() => {
        // Blocked despite the gesture — the tap-to-begin fallback covers this.
        this.unlocked = false
        this.destroyTrack(warm)
      })
  }

  get isUnlocked(): boolean {
    return this.unlocked
  }

  getCurrentTrack(): string | null {
    return this.current?.src ?? null
  }

  getPlaybackTime(): number {
    return this.current?.el.currentTime ?? 0
  }

  /**
   * Ensure `src` is the audible track. Same src → no-op (a song continuing
   * across scenes must not restart, per DESIGN.md). Different src → crossfade.
   */
  playTrack(src: string, fadeInMs = FADE_IN_MS): void {
    if (!this.unlocked) return
    if (this.current?.src === src) {
      // Re-assert intent in case a previous scene paused it.
      void this.current.el.play().catch(() => {})
      return
    }
    const previous = this.current
    const next = this.createTrack(src)
    next.el.volume = 0
    void next.el.play().catch(() => {
      // Autoplay/IO failure: drop the candidate, surface the fallback UI.
      this.destroyTrack(next)
      if (this.current === next) this.current = previous ?? null
      this.onBlocked?.()
    })
    this.current = next
    this.fadeIn(next, fadeInMs)
    if (previous) this.fadeOutAndDestroy(previous, FADE_OUT_MS)
  }

  pause(): void {
    this.current?.el.pause()
  }

  resume(): void {
    if (!this.current) return
    void this.current.el.play().catch(() => {})
  }

  stop(): void {
    for (const t of this.tracks) {
      t.el.pause()
      this.destroyTrack(t)
    }
    this.current = null
  }

  setVolume(v: number): void {
    this.volume = Math.min(1, Math.max(0, v))
    if (this.current && !this.muted) this.current.el.volume = this.volume
  }

  getVolume(): number {
    return this.volume
  }

  mute(): void {
    this.muted = true
    if (this.current) this.current.el.volume = 0
  }

  unmute(): void {
    this.muted = false
    if (this.current) this.current.el.volume = this.volume
  }

  isMuted(): boolean {
    return this.muted
  }

  /** Frees every media element. Call on unmount of the provider. */
  dispose(): void {
    for (const t of [...this.tracks]) this.destroyTrack(t)
    this.current = null
  }

  private createTrack(src: string): Track {
    const el = new Audio(src)
    el.preload = 'auto'
    el.loop = true
    el.volume = this.muted ? 0 : this.volume
    const track: Track = { el, src }
    this.tracks.add(track)
    return track
  }

  private destroyTrack(track: Track): void {
    if (!this.tracks.has(track)) return
    this.tracks.delete(track)
    track.el.pause()
    track.el.removeAttribute('src')
    track.el.load()
  }

  private fadeIn(track: Track, durationMs: number): void {
    const target = this.muted ? 0 : this.volume
    this.animateVolume(track, track.el.volume, target, durationMs)
  }

  private fadeOutAndDestroy(track: Track, durationMs: number): void {
    this.animateVolume(track, track.el.volume, 0, durationMs, () => {
      // Only destroy if it is no longer the active track (guard against the
      // user scrubbing back and forth quickly).
      if (this.current !== track) this.destroyTrack(track)
    })
  }

  /**
   * Steps volume on a ~50ms tick. Using setTargetAtTime would be cleaner, but
   * HTMLAudioElement exposes no gain node without an AudioContext per element,
   * and a 20–30 step ramp is inaudibly smooth for a music fade.
   */
  private animateVolume(
    track: Track,
    from: number,
    to: number,
    durationMs: number,
    onDone?: () => void,
  ): void {
    const steps = Math.max(1, Math.round(durationMs / 50))
    const delta = (to - from) / steps
    let step = 0
    track.el.volume = clamp01(from)
    const id = window.setInterval(() => {
      step += 1
      if (step >= steps || !this.tracks.has(track)) {
        window.clearInterval(id)
        if (this.tracks.has(track)) track.el.volume = clamp01(to)
        onDone?.()
        return
      }
      track.el.volume = clamp01(track.el.volume + delta)
    }, 50)
  }
}

function clamp01(n: number): number {
  return Math.min(1, Math.max(0, n))
}
