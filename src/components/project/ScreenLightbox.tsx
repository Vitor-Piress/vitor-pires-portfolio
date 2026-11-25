import { useEffect } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight, X } from 'lucide-react'
import type { ProjectScreen } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'
import { ScreenVisual } from '../ui/ProjectVisuals'

interface ScreenLightboxProps {
  projectSlug: string
  projectName: string
  screens: ProjectScreen[]
  selectedId: string | null
  onSelectId: (id: string | null) => void
}

export function ScreenLightbox({
  projectSlug,
  projectName,
  screens,
  selectedId,
  onSelectId,
}: ScreenLightboxProps) {
  const { language, t } = useLanguage()

  const activeIndex = selectedId
    ? screens.findIndex((s) => s.id === selectedId)
    : -1
  const activeScreen = activeIndex >= 0 ? screens[activeIndex] : null

  useEffect(() => {
    if (!activeScreen) return

    const prevOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onSelectId(null)
      } else if (e.key === 'ArrowRight' && screens.length > 1) {
        const next = screens[(activeIndex + 1) % screens.length]
        onSelectId(next.id)
      } else if (e.key === 'ArrowLeft' && screens.length > 1) {
        const prev = screens[(activeIndex - 1 + screens.length) % screens.length]
        onSelectId(prev.id)
      }
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = prevOverflow
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [activeScreen, activeIndex, screens, onSelectId])

  return (
    <AnimatePresence>
      {activeScreen && (
        <motion.div
          key="screen-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label={`${projectName}: ${activeScreen.label[language]}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.22 }}
          onClick={() => onSelectId(null)}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 p-4 sm:p-8 backdrop-blur-md"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.97, filter: 'blur(8px)', y: 10 }}
            animate={{ opacity: 1, scale: 1, filter: 'blur(0px)', y: 0 }}
            exit={{ opacity: 0, scale: 0.97, filter: 'blur(6px)', y: 8 }}
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="flex w-full max-w-5xl flex-col rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] overflow-hidden"
          >
            {/* Top Bar */}
            <div className="flex items-center justify-between px-5 py-3.5">
              <div className="flex items-center gap-3 min-w-0">
                <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                  {String(activeIndex + 1).padStart(2, '0')} /{' '}
                  {String(screens.length).padStart(2, '0')}
                </span>
                <span className="truncate text-xs sm:text-sm font-medium text-[var(--text-primary)]">
                  {activeScreen.label[language]}
                </span>
              </div>

              <div className="flex items-center gap-2">
                {screens.length > 1 && (
                  <>
                    <button
                      type="button"
                      onClick={() => {
                        const prev =
                          screens[(activeIndex - 1 + screens.length) % screens.length]
                        onSelectId(prev.id)
                      }}
                      aria-label="Previous screen"
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-[2px] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <ChevronLeft className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        const next = screens[(activeIndex + 1) % screens.length]
                        onSelectId(next.id)
                      }}
                      aria-label="Next screen"
                      className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-[2px] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                    >
                      <ChevronRight className="h-4 w-4" strokeWidth={1.8} />
                    </button>
                  </>
                )}

                <button
                  type="button"
                  onClick={() => onSelectId(null)}
                  aria-label={t.projectDetail.sections.closePreview}
                  className="cursor-pointer ml-1 inline-flex items-center gap-1.5 rounded-[2px] bg-[var(--bg-primary)] px-2.5 py-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <span>ESC</span>
                  <X className="h-3.5 w-3.5" strokeWidth={1.8} />
                </button>
              </div>
            </div>

            {/* Enlarged Screen Stage */}
            <div className="relative h-[60vh] min-h-[340px] max-h-[640px] w-full bg-[var(--bg-primary)]/40">
              <AnimatePresence mode="wait" initial={false}>
                <motion.div
                  key={activeScreen.id}
                  initial={{ opacity: 0, filter: 'blur(4px)' }}
                  animate={{ opacity: 1, filter: 'blur(0px)' }}
                  exit={{ opacity: 0, filter: 'blur(4px)' }}
                  transition={{ duration: 0.25 }}
                  className="h-full w-full"
                >
                  <ScreenVisual
                    projectSlug={projectSlug}
                    screen={activeScreen}
                    language={language}
                  />
                </motion.div>
              </AnimatePresence>
            </div>

            {/* Bottom Quick Screen Strip */}
            <div className="flex flex-wrap items-center gap-1.5 px-5 py-3">
              {screens.map((scr) => {
                const isSelected = scr.id === activeScreen.id
                return (
                  <button
                    key={scr.id}
                    type="button"
                    onClick={() => onSelectId(scr.id)}
                    className={`cursor-pointer rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      isSelected
                        ? 'bg-[var(--text-primary)] text-[var(--bg-primary)]'
                        : 'bg-[var(--bg-primary)] text-[var(--text-muted)] hover:text-[var(--text-primary)]'
                    }`}
                  >
                    {scr.label[language]}
                  </button>
                )
              })}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
