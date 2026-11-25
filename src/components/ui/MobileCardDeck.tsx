import {
  useCallback,
  useEffect,
  useId,
  useRef,
  useState,
  type KeyboardEvent,
  type ReactNode,
  type TouchEvent,
} from 'react'
import { AnimatePresence, motion, useReducedMotion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'

export interface MobileCardDeckItem {
  id: string
  shortLabel: string
  content: ReactNode
}

interface MobileCardDeckProps {
  items: MobileCardDeckItem[]
  ariaLabel: string
  prevLabel: string
  nextLabel: string
  className?: string
}

function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

/**
 * Mobile-only (< 768px) single-row lateral selector + swipeable card stage.
 * Keeps multi-card sections compact on small screens without touching Desktop grids.
 */
export function MobileCardDeck({
  items,
  ariaLabel,
  prevLabel,
  nextLabel,
  className = '',
}: MobileCardDeckProps) {
  const deckId = useId()
  const prefersReducedMotion = Boolean(useReducedMotion())
  const [{ index, direction }, setState] = useState<{
    index: number
    direction: 1 | -1
  }>({ index: 0, direction: 1 })
  const [announcement, setAnnouncement] = useState('')

  const railRef = useRef<HTMLDivElement | null>(null)
  const chipRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hasMountedRef = useRef(false)
  const touchStartRef = useRef<{ x: number; y: number } | null>(null)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const count = items.length
  const activeIndex = wrapIndex(index, count)
  const activeItem = items[activeIndex]

  const updateFades = useCallback(() => {
    const el = railRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(maxScroll - el.scrollLeft > 6)
  }, [])

  useEffect(() => {
    const el = railRef.current
    if (!el) return
    updateFades()
    el.addEventListener('scroll', updateFades, { passive: true })
    const ro = new ResizeObserver(updateFades)
    ro.observe(el)
    return () => {
      el.removeEventListener('scroll', updateFades)
      ro.disconnect()
    }
  }, [updateFades, count])

  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    const container = railRef.current
    const activeChip = chipRefs.current[activeIndex]
    if (!container || !activeChip) return
    if (container.scrollWidth <= container.clientWidth) return

    const targetLeft =
      activeChip.offsetLeft -
      container.clientWidth / 2 +
      activeChip.offsetWidth / 2
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: prefersReducedMotion ? 'instant' : 'smooth',
    })
  }, [activeIndex, prefersReducedMotion])

  const selectIndex = useCallback(
    (nextIdx: number, dir?: 1 | -1) => {
      if (count <= 0) return
      const target = wrapIndex(nextIdx, count)
      setState((prev) => {
        const current = wrapIndex(prev.index, count)
        if (target === current) return prev
        const computedDir: 1 | -1 = dir ?? (target > current ? 1 : -1)
        return { index: target, direction: computedDir }
      })
      const nextItem = items[target]
      if (nextItem) {
        setAnnouncement(`${nextItem.shortLabel} (${target + 1}/${count})`)
      }
    },
    [count, items],
  )

  const handlePrev = () => selectIndex(activeIndex - 1, -1)
  const handleNext = () => selectIndex(activeIndex + 1, 1)

  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = wrapIndex(idx + 1, count)
      selectIndex(next, 1)
      chipRefs.current[next]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = wrapIndex(idx - 1, count)
      selectIndex(prev, -1)
      chipRefs.current[prev]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      selectIndex(0, -1)
      chipRefs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      selectIndex(count - 1, 1)
      chipRefs.current[count - 1]?.focus()
    }
  }

  const handleTouchStart = (e: TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0]
    if (!touch) return
    touchStartRef.current = { x: touch.clientX, y: touch.clientY }
  }

  const handleTouchEnd = (e: TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current
    touchStartRef.current = null
    if (!start || count <= 1) return
    const touch = e.changedTouches[0]
    if (!touch) return
    const dx = touch.clientX - start.x
    const dy = touch.clientY - start.y
    if (Math.abs(dx) >= 48 && Math.abs(dx) > Math.abs(dy) * 1.2) {
      if (dx < 0) {
        handleNext()
      } else {
        handlePrev()
      }
    }
  }

  if (!activeItem) return null

  return (
    <div className={`md:hidden ${className}`.trim()}>
      {/* Single-row lateral switcher: scrollable chips left, < 01/N > right */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="relative min-w-0 flex-1">
          {canScrollLeft && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-10 w-6 bg-gradient-to-r from-[var(--bg-primary)] to-transparent"
            />
          )}
          {canScrollRight && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-10 w-6 bg-gradient-to-l from-[var(--bg-primary)] to-transparent"
            />
          )}

          <div
            ref={railRef}
            role="tablist"
            aria-label={ariaLabel}
            className="flex flex-nowrap items-center gap-1.5 overflow-x-auto scroll-smooth snap-x snap-mandatory py-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {items.map((item, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={item.id}
                  ref={(el) => {
                    chipRefs.current[idx] = el
                  }}
                  id={`${deckId}-tab-${item.id}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls={`${deckId}-panel`}
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => selectIndex(idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                  className={`cursor-pointer shrink-0 whitespace-nowrap snap-start min-h-[44px] rounded-[3px] border px-3 py-2 font-mono text-[10.5px] uppercase tracking-wider transition-colors ${
                    isActive
                      ? 'border-[var(--text-primary)] bg-[var(--text-primary)] font-semibold text-[var(--bg-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {item.shortLabel}
                </button>
              )
            })}
          </div>
        </div>

        <div className="flex shrink-0 items-center gap-1">
          <button
            type="button"
            onClick={handlePrev}
            aria-label={prevLabel}
            className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
          </button>

          <span className="min-w-[34px] text-center font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
            {String(activeIndex + 1).padStart(2, '0')}/
            {String(count).padStart(2, '0')}
          </span>

          <button
            type="button"
            onClick={handleNext}
            aria-label={nextLabel}
            className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </div>

      <span className="sr-only" aria-live="polite">
        {announcement}
      </span>

      <div
        id={`${deckId}-panel`}
        role="tabpanel"
        aria-labelledby={`${deckId}-tab-${activeItem.id}`}
        onTouchStart={handleTouchStart}
        onTouchEnd={handleTouchEnd}
        className="overflow-hidden"
      >
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={activeItem.id}
            initial={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * 18 }
            }
            animate={
              prefersReducedMotion ? { opacity: 1 } : { opacity: 1, x: 0 }
            }
            exit={
              prefersReducedMotion
                ? { opacity: 0 }
                : { opacity: 0, x: direction * -18 }
            }
            transition={{
              duration: prefersReducedMotion ? 0.12 : 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
          >
            {activeItem.content}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  )
}
