import { useCallback, useEffect, useState } from 'react'
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

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-6xl scroll-mt-28 px-6 py-16 sm:py-24 md:px-10"
    >
      {/* Header Row: Section Label + Circular Arrows + Project Tabs */}
      <BlurReveal className="mb-10 sm:mb-12 flex flex-col gap-5 border-b border-[var(--border-subtle)]/70 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.projectsSection.featuredLabel}
          </span>

          <div className="inline-flex items-center gap-2">
            <button
              type="button"
              onClick={goPrev}
              aria-label={
                language === 'pt' ? 'Projeto anterior' : 'Previous project'
              }
              title={
                language === 'pt' ? 'Projeto anterior' : 'Previous project'
              }
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
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
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
            </button>
          </div>
        </div>

        {/* Project Switcher Tabs with Sliding Spring Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {featuredProjects.map((proj, idx) => {
            const isActive = idx === activeIndex
            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => goTo(idx)}
                className={`relative overflow-hidden cursor-pointer inline-flex items-center gap-2.5 rounded-[4px] border px-3.5 py-2 text-left transition-colors duration-200 ${
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
      </BlurReveal>

      {/* Active Project Stage with 2-Layer Staggered Reveal */}
      <BlurReveal delay={0.08}>
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
      </BlurReveal>
    </section>
  )
}
