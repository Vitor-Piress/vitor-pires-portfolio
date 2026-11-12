import { useEffect, useRef, useState } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { Pause, Play, Volume2, VolumeX } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'

interface SynthSession {
  ctx: AudioContext
  masterGain: GainNode
  stop: () => void
}

/**
 * Fixed Bottom Mini-Audio Player (upclose.studio concept — SPEC §6).
 * - Minimized default: discrete bar (h-6 px-3) with B&W soundwaves.
 * - Hover / Click: smoothly expands to reveal [ Play / Pause ], [ Mute / Unmute ] and mono caption.
 * - Connects to `<audio loop src="/audio/ambient.mp3" />`, with a gentle Web Audio ambient pad
 *   fallback if `/audio/ambient.mp3` has not been placed in `public/audio/` yet.
 */
export function MiniAudioPlayer() {
  const { t } = useLanguage()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const synthRef = useRef<SynthSession | null>(null)
  const usingFallbackRef = useRef(false)

  const [isExpanded, setIsExpanded] = useState(false)
  const [isPlaying, setIsPlaying] = useState(false)
  const [isMuted, setIsMuted] = useState(false)

  // Clean up Web Audio fallback on unmount
  useEffect(() => {
    return () => {
      synthRef.current?.stop()
      synthRef.current = null
    }
  }, [])

  const startFallbackSynth = () => {
    if (synthRef.current) {
      void synthRef.current.ctx.resume()
      synthRef.current.masterGain.gain.setTargetAtTime(
        isMuted ? 0 : 0.035,
        synthRef.current.ctx.currentTime,
        0.2,
      )
      return
    }

    const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext
    const ctx = new AudioCtx()
    const masterGain = ctx.createGain()
    masterGain.gain.value = isMuted ? 0 : 0.035

    const filter = ctx.createBiquadFilter()
    filter.type = 'lowpass'
    filter.frequency.value = 320

    const osc1 = ctx.createOscillator()
    osc1.type = 'sine'
    osc1.frequency.value = 110 // A2 warm drone

    const osc2 = ctx.createOscillator()
    osc2.type = 'triangle'
    osc2.frequency.value = 164.81 // E3 fifth

    osc1.connect(filter)
    osc2.connect(filter)
    filter.connect(masterGain)
    masterGain.connect(ctx.destination)

    osc1.start()
    osc2.start()

    synthRef.current = {
      ctx,
      masterGain,
      stop: () => {
        try {
          osc1.stop()
          osc2.stop()
          void ctx.close()
        } catch {
          // Ignore already stopped context
        }
      },
    }
  }

  const handleTogglePlay = async (e: React.MouseEvent) => {
    e.stopPropagation()
    const audio = audioRef.current

    if (isPlaying) {
      audio?.pause()
      if (synthRef.current) {
        await synthRef.current.ctx.suspend()
      }
      setIsPlaying(false)
      return
    }

    if (audio && !usingFallbackRef.current) {
      try {
        audio.muted = isMuted
        audio.volume = 0.45
        await audio.play()
        setIsPlaying(true)
        return
      } catch {
        usingFallbackRef.current = true
      }
    }

    startFallbackSynth()
    setIsPlaying(true)
  }

  const handleToggleMute = (e: React.MouseEvent) => {
    e.stopPropagation()
    const nextMuted = !isMuted
    setIsMuted(nextMuted)

    if (audioRef.current) {
      audioRef.current.muted = nextMuted
    }
    if (synthRef.current) {
      synthRef.current.masterGain.gain.setTargetAtTime(
        nextMuted ? 0 : 0.035,
        synthRef.current.ctx.currentTime,
        0.1,
      )
    }
  }

  const waveDelays = [0, 0.18, 0.32, 0.12, 0.26]

  return (
    <div
      className="fixed bottom-5 left-1/2 -translate-x-1/2 z-50"
      onMouseEnter={() => setIsExpanded(true)}
      onMouseLeave={() => setIsExpanded(false)}
    >
      <audio
        ref={audioRef}
        loop
        preload="none"
        src="/audio/ambient.mp3"
        onError={() => {
          usingFallbackRef.current = true
        }}
      />

      <motion.div
        layout
        onClick={() => {
          if (!isExpanded) setIsExpanded(true)
        }}
        transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
        className={`flex items-center gap-3 rounded-full border border-[var(--border-subtle)] bg-[#F0F0F2]/90 dark:bg-[#0D0D0D]/90 backdrop-blur-md shadow-sm select-none ${
          isExpanded ? 'h-9 px-3.5' : 'h-6 px-3 cursor-pointer'
        }`}
      >
        {/* Minimalist B&W Soundwave Bars */}
        <div
          className="flex h-3 items-center gap-[2.5px]"
          aria-hidden="true"
        >
          {waveDelays.map((delay, idx) => (
            <motion.span
              key={idx}
              animate={
                isPlaying && !isMuted
                  ? { height: ['3px', idx % 2 === 0 ? '11px' : '8px', '4px', '10px', '3px'] }
                  : { height: '3px' }
              }
              transition={
                isPlaying && !isMuted
                  ? {
                      duration: 1.1,
                      repeat: Infinity,
                      delay,
                      ease: 'easeInOut',
                    }
                  : { duration: 0.2 }
              }
              className="w-[1.5px] rounded-full bg-[var(--text-primary)] opacity-85"
            />
          ))}
        </div>

        {/* Expandable Controls & Mono Caption */}
        <AnimatePresence initial={false}>
          {isExpanded && (
            <motion.div
              key="player-controls"
              initial={{ opacity: 0, width: 0, filter: 'blur(4px)' }}
              animate={{ opacity: 1, width: 'auto', filter: 'blur(0px)' }}
              exit={{ opacity: 0, width: 0, filter: 'blur(4px)' }}
              transition={{ duration: 0.24, ease: [0.22, 1, 0.36, 1] }}
              className="flex items-center gap-2.5 overflow-hidden whitespace-nowrap"
            >
              <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {t.audioPlayer.label} ·{' '}
                <span className="text-[var(--text-secondary)]">
                  {isPlaying ? t.audioPlayer.playing : t.audioPlayer.paused}
                </span>
              </span>

              <button
                type="button"
                onClick={handleTogglePlay}
                aria-label={isPlaying ? t.audioPlayer.paused : t.audioPlayer.playing}
                className="cursor-pointer inline-flex h-5 w-5 items-center justify-center rounded-full bg-[var(--text-primary)] text-[var(--bg-primary)] hover:opacity-80 transition-opacity"
              >
                {isPlaying ? (
                  <Pause className="h-2.5 w-2.5" strokeWidth={2.2} />
                ) : (
                  <Play className="h-2.5 w-2.5 translate-x-[0.5px]" strokeWidth={2.2} />
                )}
              </button>

              <button
                type="button"
                onClick={handleToggleMute}
                aria-label={isMuted ? t.audioPlayer.unmute : t.audioPlayer.mute}
                className="cursor-pointer inline-flex h-5 w-5 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                {isMuted ? (
                  <VolumeX className="h-3 w-3" strokeWidth={1.9} />
                ) : (
                  <Volume2 className="h-3 w-3" strokeWidth={1.9} />
                )}
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  )
}
