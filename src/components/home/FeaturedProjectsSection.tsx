import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { featuredProjects } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'
import {
  readActiveProjectSlug,
  saveActiveProjectSlug,
  type ProjectNavigationState,
} from '../../utils/returnNavigation'
import { BlurReveal } from '../ui/BlurReveal'
import { ProjectMark } from '../ui/ProjectVisuals'
import { EditorialBentoShowcase } from './EditorialBentoShowcase'

function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0
  return ((index % length) + length) % length
}

const SLIDE_VARIANTS = {
  enter: () => ({ opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' }),
  center: {
    opacity: 1,
    x: 0,
    y: 0,
    scale: 1,
    filter: 'blur(0px)',
    transition: { duration: 0.1 },
  },
  exit: (direction: 1 | -1) => ({
    opacity: 0,
    x: direction * -16,
    scale: 0.99,
    filter: 'blur(6px)',
    transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
  }),
}

export function FeaturedProjectsSection() {
  const { language, t } = useLanguage()
  const location = useLocation()
  const navState = location.state as ProjectNavigationState | null
  const restoreProjectSlug = navState?.restoreOrigin?.activeProjectSlug

  const tabListRef = useRef<HTMLDivElement | null>(null)
  const tabRefs = useRef<(HTMLButtonElement | null)[]>([])
  const hasMountedRef = useRef(false)
  const [canScrollLeft, setCanScrollLeft] = useState(false)
  const [canScrollRight, setCanScrollRight] = useState(false)

  const [{ step, direction }, setCarouselState] = useState<{
    step: number
    direction: 1 | -1
  }>(() => {
    const targetSlug = restoreProjectSlug ?? readActiveProjectSlug()
    const idx = targetSlug
      ? featuredProjects.findIndex((p) => p.slug === targetSlug)
      : -1
    return { step: idx >= 0 ? idx : 0, direction: 1 }
  })

  const count = featuredProjects.length
  const activeIndex = wrapIndex(step, count)
  const activeProject = featuredProjects[activeIndex]

  useEffect(() => {
    saveActiveProjectSlug(activeProject.slug)
  }, [activeProject.slug])

  const updateScrollFades = useCallback(() => {
    const el = tabListRef.current
    if (!el) return
    const maxScroll = el.scrollWidth - el.clientWidth
    setCanScrollLeft(el.scrollLeft > 6)
    setCanScrollRight(maxScroll - el.scrollLeft > 6)
  }, [])

  useEffect(() => {
    const el = tabListRef.current
    if (!el) return

    updateScrollFades()
    el.addEventListener('scroll', updateScrollFades, { passive: true })
    const ro = new ResizeObserver(updateScrollFades)
    ro.observe(el)

    return () => {
      el.removeEventListener('scroll', updateScrollFades)
      ro.disconnect()
    }
  }, [updateScrollFades])

  // Horizontally center the active tab on narrow rails without shifting vertical page scroll
  useEffect(() => {
    if (!hasMountedRef.current) {
      hasMountedRef.current = true
      return
    }
    const container = tabListRef.current
    const activeBtn = tabRefs.current[activeIndex]
    if (!container || !activeBtn) return
    if (container.scrollWidth <= container.clientWidth) return

    const targetLeft =
      activeBtn.offsetLeft - container.clientWidth / 2 + activeBtn.offsetWidth / 2
    container.scrollTo({
      left: Math.max(0, targetLeft),
      behavior: 'smooth',
    })
  }, [activeIndex])

  const goPrev = useCallback(() => {
    setCarouselState((prev) => ({ step: prev.step - 1, direction: -1 }))
  }, [])

  const goNext = useCallback(() => {
    setCarouselState((prev) => ({ step: prev.step + 1, direction: 1 }))
  }, [])

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count <= 0) return
      const targetIndex = wrapIndex(nextIndex, count)
      setCarouselState((prev) => {
        const currentIndex = wrapIndex(prev.step, count)
        if (targetIndex === currentIndex) return prev
        const delta = targetIndex - currentIndex
        return {
          step: prev.step + delta,
          direction: delta > 0 ? 1 : -1,
        }
      })
    },
    [count],
  )

  const handleTabKeyDown = (e: KeyboardEvent<HTMLButtonElement>, idx: number) => {
    if (e.key === 'ArrowRight') {
      e.preventDefault()
      const next = wrapIndex(idx + 1, count)
      goTo(next)
      tabRefs.current[next]?.focus()
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault()
      const prev = wrapIndex(idx - 1, count)
      goTo(prev)
      tabRefs.current[prev]?.focus()
    } else if (e.key === 'Home') {
      e.preventDefault()
      goTo(0)
      tabRefs.current[0]?.focus()
    } else if (e.key === 'End') {
      e.preventDefault()
      goTo(count - 1)
      tabRefs.current[count - 1]?.focus()
    }
  }

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-12 sm:py-24 md:px-10"
    >
      {/* Header Row: Section Label + Circular Arrows + Project Tabs */}
      <BlurReveal className="mb-8 sm:mb-12 flex flex-col gap-4 sm:gap-5 border-b border-[var(--border-subtle)]/70 pb-5 sm:pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.projectsSection.featuredLabel}
          </span>

          <div className="inline-flex items-center gap-2.5 md:gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label={
                language === 'pt' ? 'Projeto anterior' : 'Previous project'
              }
              title={
                language === 'pt' ? 'Projeto anterior' : 'Previous project'
              }
              className="cursor-pointer inline-flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
            </button>

            <span className="min-w-[44px] text-center font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
              {String(activeIndex + 1).padStart(2, '0')} /{' '}
              {String(count).padStart(2, '0')}
            </span>

            <button
              type="button"
              onClick={goNext}
              aria-label={
                language === 'pt' ? 'Próximo projeto' : 'Next project'
              }
              title={language === 'pt' ? 'Próximo projeto' : 'Next project'}
              className="cursor-pointer inline-flex h-11 w-11 md:h-8 md:w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Project Switcher Tabs: 1-row horizontal rail with snap on mobile, wrapped on md+ */}
        <div className="relative">
          {canScrollLeft && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 left-0 z-20 w-7 bg-gradient-to-r from-[var(--bg-primary)] to-transparent md:hidden"
            />
          )}
          {canScrollRight && (
            <div
              aria-hidden="true"
              className="pointer-events-none absolute inset-y-0 right-0 z-20 w-7 bg-gradient-to-l from-[var(--bg-primary)] to-transparent md:hidden"
            />
          )}

          <div
            ref={tabListRef}
            role="tablist"
            aria-label={
              language === 'pt'
                ? 'Selecionar projeto em destaque'
                : 'Select featured project'
            }
            className="flex flex-nowrap items-center gap-2 overflow-x-auto scroll-smooth snap-x snap-mandatory py-0.5 md:flex-wrap md:overflow-visible [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
          >
            {featuredProjects.map((proj, idx) => {
              const isActive = idx === activeIndex
              return (
                <button
                  key={proj.slug}
                  ref={(el) => {
                    tabRefs.current[idx] = el
                  }}
                  id={`project-tab-${proj.slug}`}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  aria-controls="featured-project-panel"
                  tabIndex={isActive ? 0 : -1}
                  onClick={() => goTo(idx)}
                  onKeyDown={(e) => handleTabKeyDown(e, idx)}
                  className={`relative shrink-0 whitespace-nowrap snap-start overflow-hidden cursor-pointer inline-flex min-h-[44px] md:min-h-0 items-center gap-2.5 rounded-[4px] border px-3.5 py-2.5 md:py-2 text-left transition-colors duration-200 ${
                    isActive
                      ? 'border-[var(--text-primary)] text-[var(--bg-primary)]'
                      : 'border-[var(--border-subtle)] bg-[var(--bg-bento)]/55 text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]'
                  }`}
                >
                  {isActive && (
                    <motion.span
                      layoutId="home-active-project-pill"
                      transition={{
                        type: 'spring',
                        stiffness: 420,
                        damping: 32,
                      }}
                      className="absolute inset-0 bg-[var(--text-primary)] shadow-sm"
                    />
                  )}

                  <span className="relative z-10 inline-flex items-center gap-2.5">
                    <span className="font-mono text-[10px] opacity-65 tabular-nums">
                      {String(idx + 1).padStart(2, '0')}
                    </span>
                    <ProjectMark
                      slug={proj.slug}
                      name={proj.name}
                      logo={proj.logo}
                      size="pill"
                      shape="circle-ring"
                      inverted={isActive}
                    />
                    <span className="text-xs sm:text-[13px] font-medium">
                      {proj.name}
                    </span>
                    <span
                      className={`hidden sm:inline font-mono text-[9px] uppercase tracking-wider ${
                        isActive ? 'opacity-75' : 'text-[var(--text-muted)]'
                      }`}
                    >
                      · {proj.year}
                    </span>
                  </span>
                </button>
              )
            })}
          </div>
        </div>
      </BlurReveal>

      {/* Active Project Stage with 2-Layer Staggered Reveal */}
      <BlurReveal delay={0.08}>
        <div
          id="featured-project-panel"
          role="tabpanel"
          aria-labelledby={`project-tab-${activeProject.slug}`}
        >
          <AnimatePresence mode="wait" custom={direction} initial={false}>
            <motion.div
              key={activeProject.slug}
              custom={direction}
              variants={SLIDE_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
            >
              <EditorialBentoShowcase
                project={activeProject}
                index={activeIndex}
                staggerDirection={direction}
              />
            </motion.div>
          </AnimatePresence>
        </div>
      </BlurReveal>
    </section>
  )
}
