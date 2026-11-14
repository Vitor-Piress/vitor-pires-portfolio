import { type MouseEvent, useEffect, useMemo, useRef, useState } from 'react'
import {
  Link,
  Navigate,
  useLocation,
  useNavigate,
  useNavigationType,
  useParams,
} from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  Check,
  ChevronLeft,
  ChevronRight,
  Copy,
  Lock,
  Moon,
  Sun,
} from 'lucide-react'
import {
  getFeaturedProjectBySlug,
  getNextFeaturedProject,
  type FeaturedProject,
} from '../data/projects'
import { PROFILE_LINKS } from '../data/profile'
import { useLanguage } from '../context/LanguageContext'
import { useTheme } from '../context/ThemeContext'
import { BlurReveal } from '../components/ui/BlurReveal'
import { ProjectLogo, ScreenVisual } from '../components/ui/ProjectVisuals'
import { ResponsiveProjectArchitecture } from '../components/project/ProjectArchitectureFlow'
import { FooterBottomBar } from '../components/layout/Footer'
import { scrollToElement, scrollToTopSmooth } from '../utils/scroll'
import {
  clearReturnOrigin,
  generateRestoreToken,
  isModifiedNavigationClick,
  readReturnOrigin,
  type ProjectNavigationState,
} from '../utils/returnNavigation'

type SectionId = 'overview' | 'flows' | 'architecture' | 'results'

const SECTION_IDS: SectionId[] = ['overview', 'flows', 'architecture', 'results']

export function ProjectDetail() {
  const { slug } = useParams<{ slug: string }>()
  const project = getFeaturedProjectBySlug(slug)

  if (!project) {
    return <Navigate to="/" replace />
  }

  return <ProjectDetailContent key={project.slug} project={project} />
}

function ProjectDetailContent({ project }: { project: FeaturedProject }) {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { hash, state } = useLocation()
  const navigate = useNavigate()
  const navigationType = useNavigationType()

  const navState = state as ProjectNavigationState | null
  const returnOrigin = navState?.returnOrigin ?? readReturnOrigin()

  const handleBackClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (!returnOrigin || isModifiedNavigationClick(e)) {
      return
    }

    e.preventDefault()
    clearReturnOrigin()
    const restoreOrigin = {
      ...returnOrigin,
      restoreToken: generateRestoreToken(),
    }
    navigate(returnOrigin.returnPath, {
      preventScrollReset: true,
      state: { restoreOrigin } satisfies ProjectNavigationState,
    })
  }

  const [activeSection, setActiveSection] = useState<SectionId>('overview')
  const [copiedEmail, setCopiedEmail] = useState(false)
  const isProgrammaticScrollRef = useRef(false)
  const scrollUnlockTimeoutRef = useRef<number | undefined>(undefined)

  const galleryItems = useMemo(() => {
    if (project.gallery && project.gallery.length > 0) {
      return project.gallery
    }
    if (project.previewImage) {
      return [
        {
          id: 'main',
          label: { pt: project.name, en: project.name },
          src: project.previewImage,
          appPath: '/dashboard',
        },
      ]
    }
    return []
  }, [project])

  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0)
  const [isGalleryPaused, setIsGalleryPaused] = useState(false)

  // Auto-cycle through project gallery screens every 4.5s (pausing on hover)
  useEffect(() => {
    if (galleryItems.length <= 1 || isGalleryPaused) return

    const timer = window.setInterval(() => {
      setActiveGalleryIndex((prev) => (prev + 1) % galleryItems.length)
    }, 4500)

    return () => window.clearInterval(timer)
  }, [galleryItems.length, isGalleryPaused])

  const currentGalleryItem = galleryItems[activeGalleryIndex] ?? galleryItems[0]
  const isPortrait = Boolean(
    currentGalleryItem?.orientation === 'portrait' ||
    currentGalleryItem?.src?.includes('gmail') ||
    currentGalleryItem?.id === 'email'
  )

  const handlePrevGallery = () => {
    setActiveGalleryIndex((prev) => (prev - 1 + galleryItems.length) % galleryItems.length)
  }

  const handleNextGallery = () => {
    setActiveGalleryIndex((prev) => (prev + 1) % galleryItems.length)
  }

  // Ensure direct/hash navigations (e.g. /project/condonot#architecture)
  // land cleanly below the sticky header & TOC instead of restoring stale scroll.
  useEffect(() => {
    if (!hash || navigationType === 'POP') return
    const targetId = decodeURIComponent(hash.slice(1))
    const el = document.getElementById(targetId)
    if (!el) return

    const rafId = window.requestAnimationFrame(() => {
      const stickyOffset = window.innerWidth >= 640 ? 128 : 144
      const targetTop = Math.max(
        0,
        el.getBoundingClientRect().top + window.scrollY - stickyOffset,
      )
      if (Math.abs(window.scrollY - targetTop) > 8) {
        window.scrollTo({ top: targetTop, left: 0, behavior: 'instant' })
      }
      if (SECTION_IDS.includes(targetId as SectionId)) {
        setActiveSection(targetId as SectionId)
      }
    })

    return () => window.cancelAnimationFrame(rafId)
  }, [hash, navigationType, project.slug])

  // Deterministic scroll-spy for the Quick Navigation TOC
  useEffect(() => {
    const updateActiveFromScroll = () => {
      if (isProgrammaticScrollRef.current) return

      if (window.scrollY < 80) {
        setActiveSection('overview')
        return
      }

      const nearBottom =
        window.innerHeight + window.scrollY >=
        document.documentElement.scrollHeight - 100
      if (nearBottom) {
        setActiveSection('results')
        return
      }

      const triggerOffset = 160
      let current: SectionId = 'overview'

      for (const id of SECTION_IDS) {
        const el = document.getElementById(id)
        if (el && el.getBoundingClientRect().top <= triggerOffset) {
          current = id
        }
      }

      setActiveSection(current)
    }

    updateActiveFromScroll()
    window.addEventListener('scroll', updateActiveFromScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', updateActiveFromScroll)
      if (scrollUnlockTimeoutRef.current !== undefined) {
        window.clearTimeout(scrollUnlockTimeoutRef.current)
      }
    }
  }, [project])

  const handleSelectSection = (id: SectionId) => {
    setActiveSection(id)
    isProgrammaticScrollRef.current = true
    if (scrollUnlockTimeoutRef.current !== undefined) {
      window.clearTimeout(scrollUnlockTimeoutRef.current)
    }

    const unlockScrollSpy = () => {
      scrollUnlockTimeoutRef.current = window.setTimeout(() => {
        isProgrammaticScrollRef.current = false
      }, 80)
    }

    if (id === 'overview') {
      scrollToTopSmooth(unlockScrollSpy)
    } else {
      scrollToElement(id, 124, unlockScrollSpy)
    }
  }

  const nextProject = getNextFeaturedProject(project.slug)
  const externalSystemUrl = project.liveUrl ?? project.repoUrl

  const whatsappBase = PROFILE_LINKS.whatsapp.split('?')[0]
  const whatsappMessage =
    language === 'pt'
      ? `Olá Vitor, vi a página do projeto ${project.name} no seu portfólio e gostaria de conversar sobre licenciamento ou engenharia sob medida.`
      : `Hi Vitor, I checked the ${project.name} case study on your portfolio and would like to discuss licensing or custom engineering.`
  const whatsappCommercialUrl = `${whatsappBase}?text=${encodeURIComponent(whatsappMessage)}`

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_LINKS.email)
      setCopiedEmail(true)
      window.setTimeout(() => setCopiedEmail(false), 2600)
    } catch {
      window.location.href = `mailto:${PROFILE_LINKS.email}?subject=${encodeURIComponent(project.name)}`
    }
  }

  const tocItems: { id: SectionId; label: string }[] = [
    { id: 'overview', label: t.projectDetail.toc.overview },
    { id: 'flows', label: t.projectDetail.toc.flows },
    { id: 'architecture', label: t.projectDetail.toc.architecture },
    { id: 'results', label: t.projectDetail.toc.results },
  ]

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--text-primary)]">
      {/* 1. Project Page Header: ← Back | Official Logo | PT/EN + Theme + Access System ↗ */}
      <header className="sticky top-0 z-40 bg-[var(--bg-primary)]/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between gap-4 px-6 md:px-10">
          <Link
            to={returnOrigin?.returnPath ?? '/'}
            onClick={handleBackClick}
            className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-[0.14em] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-x-0.5"
              strokeWidth={1.8}
            />
            <span>{t.projectDetail.back}</span>
          </Link>

          <button
            type="button"
            onClick={() => handleSelectSection('overview')}
            className="hidden sm:flex cursor-pointer items-center justify-center hover:opacity-80 transition-opacity"
          >
            <ProjectLogo
              slug={project.slug}
              name={project.name}
              logo={project.logo}
              size="sm"
            />
          </button>

          <div className="flex items-center gap-3 sm:gap-4">
            {/* Discrete Language & Theme controls for direct case-study links */}
            <div
              role="group"
              aria-label="Language selector"
              className="inline-flex items-center gap-1 font-mono text-[11px] tracking-wider"
            >
              <button
                type="button"
                onClick={() => setLanguage('pt')}
                className={`cursor-pointer px-1 py-0.5 transition-colors ${
                  language === 'pt'
                    ? 'font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                PT
              </button>
              <span className="text-[var(--text-muted)] opacity-40">/</span>
              <button
                type="button"
                onClick={() => setLanguage('en')}
                className={`cursor-pointer px-1 py-0.5 transition-colors ${
                  language === 'en'
                    ? 'font-medium text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                EN
              </button>
            </div>

            <button
              type="button"
              onClick={toggleTheme}
              aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
              className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-bento)] transition-colors"
            >
              {theme === 'dark' ? (
                <Sun className="h-3.5 w-3.5" strokeWidth={1.75} />
              ) : (
                <Moon className="h-3.5 w-3.5" strokeWidth={1.75} />
              )}
            </button>

            {externalSystemUrl ? (
              <a
                href={externalSystemUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
              >
                <span>{project.liveUrl ? t.projectsSection.liveWebsite : t.projectDetail.accessSystem}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </a>
            ) : (
              <button
                type="button"
                onClick={() => scrollToElement('commercial-cta', 96)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-4 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
              >
                <span>{t.projectDetail.accessSystem}</span>
                <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
              </button>
            )}
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-6 pt-8 pb-16 sm:pt-12 md:px-10">
        {/* Mobile Project Identity */}
        <div className="mb-6 sm:hidden">
          <ProjectLogo
            slug={project.slug}
            name={project.name}
            logo={project.logo}
          />
        </div>

        {/* 2. Quick Navigation Index (Sticky Minimalist TOC) */}
        <nav
          aria-label="Project Sections"
          className="sticky top-16 z-30 -mx-2 mb-12 sm:mb-16 flex flex-wrap items-center gap-x-6 gap-y-2.5 bg-[var(--bg-primary)]/85 px-2 py-3.5 backdrop-blur-md"
        >
          {tocItems.map((item, idx) => {
            const isActive = activeSection === item.id
            return (
              <button
                key={item.id}
                type="button"
                onClick={() => handleSelectSection(item.id)}
                className={`cursor-pointer inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] transition-colors ${
                  isActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                }`}
              >
                <span aria-hidden="true" className="text-[9px]">
                  {isActive ? '●' : `0${idx + 1}`}
                </span>
                <span>{item.label}</span>
              </button>
            )
          })}
        </nav>

        {/* ================================================================ */}
        {/* SECTION 01: OVERVIEW                                             */}
        {/* ================================================================ */}
        <section id="overview" className="scroll-mt-36 sm:scroll-mt-32">
          <BlurReveal className="max-w-4xl">
            <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
              01 / {t.projectDetail.toc.overview}
            </span>

            <h1 className="mt-5 font-editorial text-4xl sm:text-5xl md:text-[56px] leading-[1.08] tracking-[-0.015em] text-[var(--text-primary)]">
              {project.headline[language]}
            </h1>

            <p className="mt-6 max-w-3xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]">
              {project.summary[language]}
            </p>
          </BlurReveal>

          {/* Clean Borderless Metadata Columns */}
          <BlurReveal delay={0.08} className="mt-12 grid grid-cols-2 sm:grid-cols-4 gap-8">
            <div>
              <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.categoryClient}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[var(--text-primary)]">
                {project.category[language]}
              </div>
            </div>

            <div>
              <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.role}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[var(--text-primary)]">
                {project.role[language]}
              </div>
            </div>

            <div>
              <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.year}
              </div>
              <div className="mt-1.5 font-mono text-xs sm:text-sm text-[var(--text-primary)]">
                {project.year}
              </div>
            </div>

            <div>
              <div className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.stack}
              </div>
              <div className="mt-1.5 text-xs sm:text-sm text-[var(--text-primary)]">
                {project.stack.join(' · ')}
              </div>
            </div>
          </BlurReveal>

          {/* Problem & Solution Bento Pair */}
          <div className="mt-14 grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-5">
            <BlurReveal delay={0.1}>
              <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                    {t.projectDetail.sections.problemLabel}
                  </span>
                  <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
                    {project.overview.problem[language]}
                  </p>
                </div>
              </div>
            </BlurReveal>

            <BlurReveal delay={0.16}>
              <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-8">
                <div>
                  <span className="font-mono-meta text-[10px] text-[var(--text-primary)]">
                    {t.projectDetail.sections.solutionLabel}
                  </span>
                  <p className="mt-4 text-sm sm:text-[15px] leading-relaxed text-[var(--text-primary)]/90">
                    {project.overview.solution[language]}
                  </p>
                </div>
              </div>
            </BlurReveal>
          </div>

          {/* Architectural Context Summary */}
          <BlurReveal delay={0.2} className="mt-8 max-w-3xl">
            <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.details}
            </span>
            <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
              {project.details[language]}
            </p>
          </BlurReveal>
        </section>

        {/* ================================================================ */}
        {/* SECTION 02: FULL-WIDTH SYSTEM PREVIEW + CORE MODULES             */}
        {/* ================================================================ */}
        <section id="flows" className="mt-28 sm:mt-36 scroll-mt-36 sm:scroll-mt-32">
          <BlurReveal className="mb-10 max-w-2xl">
            <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
              02 / {t.projectDetail.toc.flows}
            </span>
            <h2 className="mt-4 font-editorial text-3xl sm:text-4xl leading-[1.15] text-[var(--text-primary)]">
              {t.projectDetail.sections.flowsTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              {t.projectDetail.sections.flowsSubtitle}
            </p>
          </BlurReveal>

          {/* Full-Width Interactive Window Showcase */}
          <BlurReveal delay={0.08}>
            <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] shadow-sm overflow-hidden">
              {/* Window Top Chrome */}
              <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-xs">
                {/* 3 Window Dots */}
                <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
                  <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
                </div>

                {/* Simulated Dynamic URL bar */}
                <div className="hidden sm:inline-flex items-center gap-2 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)] max-w-sm truncate">
                  <Lock className="h-3 w-3 shrink-0 text-[var(--text-secondary)]" strokeWidth={1.8} />
                  <span className="truncate text-[var(--text-secondary)]">
                    https://{project.appDomain || `${project.slug}.app`}{currentGalleryItem?.appPath || ''}
                  </span>
                </div>

                {/* Action Button: Live Official Website OR Live Demo OR Contact */}
                <div className="shrink-0">
                  {project.liveUrl ? (
                    <a
                      href={project.liveUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
                    >
                      <span>{t.projectsSection.liveWebsite}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </a>
                  ) : project.demoUrl ? (
                    <a
                      href={project.demoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
                    >
                      <span>{t.projectDetail.sections.demoAction}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </a>
                  ) : (
                    <button
                      type="button"
                      onClick={() => scrollToElement('commercial-cta', 96)}
                      className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
                    >
                      <span>{t.projectDetail.sections.demoOnRequest}</span>
                      <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
                    </button>
                  )}
                </div>
              </div>

              {/* Quick Screen Tabs (with hidden scrollbar) */}
              {galleryItems.length > 1 && (
                <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[var(--border-subtle)] px-4 py-2 bg-[var(--bg-primary)]/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
                  {galleryItems.map((scr, idx) => (
                    <button
                      key={scr.id}
                      type="button"
                      onClick={() => setActiveGalleryIndex(idx)}
                      className={`cursor-pointer shrink-0 rounded-[3px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                        idx === activeGalleryIndex
                          ? 'bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold shadow-2xs'
                          : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]/40'
                      }`}
                    >
                      {scr.label[language].split('&')[0].trim()}
                    </button>
                  ))}
                </div>
              )}

              {/* Window Body: Real Screen Image with Inset Framing & Navigation Chevrons */}
              {galleryItems.length > 0 ? (
                <div
                  onMouseEnter={() => setIsGalleryPaused(true)}
                  onMouseLeave={() => setIsGalleryPaused(false)}
                  className="group/gallery relative w-full bg-[var(--bg-primary)] overflow-hidden select-none"
                >
                  <div
                    className={`relative w-full p-2.5 sm:p-4 flex items-center justify-center transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                      isPortrait
                        ? 'aspect-[16/14.5] sm:aspect-[16/13]'
                        : 'aspect-[16/10] sm:aspect-[16/9]'
                    }`}
                  >
                    <div
                      className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[3px] border border-[var(--border-subtle)] ${
                        currentGalleryItem?.src?.includes('gmail') ? 'bg-white' : 'bg-[var(--bg-bento)]'
                      } shadow-2xs`}
                    >
                      <AnimatePresence mode="wait" initial={false}>
                        {currentGalleryItem && (
                          <motion.img
                            key={currentGalleryItem.id}
                            src={currentGalleryItem.src}
                            alt={currentGalleryItem.label[language]}
                            initial={{ opacity: 0, filter: 'blur(4px)' }}
                            animate={{ opacity: 1, filter: 'blur(0px)' }}
                            exit={{ opacity: 0, filter: 'blur(4px)' }}
                            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                            className={`h-full w-full object-contain ${
                              isPortrait ? 'object-center' : 'object-top'
                            } block`}
                            loading="lazy"
                          />
                        )}
                      </AnimatePresence>
                    </div>

                    {/* Subtle Navigation Chevrons on Image Edges */}
                    {galleryItems.length > 1 && (
                      <>
                        <button
                          type="button"
                          onClick={handlePrevGallery}
                          aria-label="Previous screen"
                          className="cursor-pointer absolute left-4 sm:left-6 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all duration-200"
                        >
                          <ChevronLeft className="h-4 w-4" strokeWidth={2} />
                        </button>

                        <button
                          type="button"
                          onClick={handleNextGallery}
                          aria-label="Next screen"
                          className="cursor-pointer absolute right-4 sm:right-6 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 sm:h-9 sm:w-9 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/gallery:opacity-100 transition-all duration-200"
                        >
                          <ChevronRight className="h-4 w-4" strokeWidth={2} />
                        </button>
                      </>
                    )}
                  </div>

                  {/* Window Bottom Caption & Indicator */}
                  <div className="flex items-center justify-between border-t border-[var(--border-subtle)] px-4 py-2.5 bg-[var(--bg-bento)]/50 font-mono text-[11px] text-[var(--text-muted)]">
                    <div className="flex items-center gap-2 truncate pr-4">
                      <span className="text-[var(--text-secondary)] uppercase tracking-wider text-[10px]">
                        {currentGalleryItem ? currentGalleryItem.label[language] : project.name}
                      </span>
                    </div>

                    {galleryItems.length > 1 && (
                      <div className="flex items-center gap-3 shrink-0">
                        <div className="flex items-center gap-1.5" aria-hidden="true">
                          {galleryItems.map((item, idx) => (
                            <button
                              key={item.id}
                              type="button"
                              onClick={() => setActiveGalleryIndex(idx)}
                              className={`cursor-pointer h-1 rounded-full transition-all duration-300 ${
                                idx === activeGalleryIndex
                                  ? 'w-4 bg-[var(--text-primary)] opacity-90'
                                  : 'w-1.5 bg-[var(--text-muted)] opacity-35 hover:opacity-70'
                              }`}
                            />
                          ))}
                        </div>

                        <span className="text-[10px] tracking-widest text-[var(--text-muted)]">
                          {String(activeGalleryIndex + 1).padStart(2, '0')} / {String(galleryItems.length).padStart(2, '0')}
                        </span>
                      </div>
                    )}
                  </div>
                </div>
              ) : project.bento[0]?.screens[0] ? (
                <div className="min-h-[380px] sm:min-h-[500px] w-full flex items-center justify-center p-4 sm:p-8 bg-[var(--bg-primary)]">
                  <ScreenVisual
                    projectSlug={project.slug}
                    screen={project.bento[0].screens[0]}
                    language={language}
                  />
                </div>
              ) : null}
            </div>
          </BlurReveal>

          {/* Feature Explanation Bento Blocks (e.g., Pix Engine, PDF Generation, Resend) */}
          <div className="mt-20 sm:mt-24">
            <BlurReveal className="mb-8">
              <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                / {t.projectDetail.sections.featuresTitle}
              </span>
            </BlurReveal>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
              {project.features.map((feature, idx) => (
                <BlurReveal key={feature.id} delay={(idx % 3) * 0.07}>
                  <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-7">
                    <div>
                      <span className="font-mono text-[10px] text-[var(--text-muted)]">
                        {String(idx + 1).padStart(2, '0')}
                      </span>
                      <h3 className="mt-3 text-base sm:text-[17px] font-medium leading-snug text-[var(--text-primary)]">
                        {feature.title[language]}
                      </h3>
                      <p className="mt-2.5 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                        {feature.description[language]}
                      </p>
                    </div>
                  </div>
                </BlurReveal>
              ))}
            </div>
          </div>
        </section>

        {/* ================================================================ */}
        {/* SECTION 03: TECHNICAL ARCHITECTURE                               */}
        {/* ================================================================ */}
        <section id="architecture" className="mt-28 sm:mt-36 scroll-mt-36 sm:scroll-mt-32">
          <BlurReveal className="mb-10 max-w-2xl">
            <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
              03 / {t.projectDetail.toc.architecture}
            </span>
            <h2 className="mt-4 font-editorial text-3xl sm:text-4xl leading-[1.15] text-[var(--text-primary)]">
              {t.projectDetail.sections.architectureTitle}
            </h2>
            <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              {t.projectDetail.sections.architectureSubtitle}
            </p>
          </BlurReveal>

          <BlurReveal delay={0.08}>
            <ResponsiveProjectArchitecture project={project} language={language} />
          </BlurReveal>
        </section>

        {/* ================================================================ */}
        {/* SECTION 04: PRODUCTION RESULTS & NEXT PROJECT                    */}
        {/* ================================================================ */}
        <section id="results" className="mt-28 sm:mt-36 scroll-mt-36 sm:scroll-mt-32">
          <BlurReveal className="mb-10 max-w-2xl">
            <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
              04 / {t.projectDetail.toc.results}
            </span>
            <h2 className="mt-4 font-editorial text-3xl sm:text-4xl leading-[1.15] text-[var(--text-primary)]">
              {t.projectDetail.sections.resultsTitle}
            </h2>
          </BlurReveal>

          <div
            className={`grid grid-cols-1 gap-4 sm:gap-5 ${
              project.results.length >= 3 ? 'md:grid-cols-3' : 'md:grid-cols-2'
            }`}
          >
            {project.results.map((result, idx) => (
              <BlurReveal key={result.metric.en} delay={idx * 0.08}>
                <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-8">
                  <div className="font-editorial text-3xl sm:text-4xl leading-tight text-[var(--text-primary)]">
                    {result.metric[language]}
                  </div>
                  <p className="mt-4 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                    {result.description[language]}
                  </p>
                </div>
              </BlurReveal>
            ))}
          </div>

          {/* Subtle Next Case Study Link */}
          <BlurReveal delay={0.14} className="mt-14 pt-8 border-t border-[var(--border-subtle)] flex items-center justify-between">
            <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              {language === 'pt' ? 'Explore também' : 'Next case study'}
            </span>
            <Link
              to={`/project/${nextProject.slug}`}
              state={
                returnOrigin
                  ? ({ returnOrigin } satisfies ProjectNavigationState)
                  : undefined
              }
              className="group inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{nextProject.name}</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1"
                strokeWidth={1.8}
              />
            </Link>
          </BlurReveal>
        </section>
      </main>

      {/* ================================================================ */}
      {/* 5. COMMERCIAL CLOSING FOOTER (SPEC §5.4 — cagd.as aesthetic)     */}
      {/* ================================================================ */}
      <footer
        id="commercial-cta"
        className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 pt-24 pb-24 sm:pt-36 sm:pb-28 md:px-10"
      >
        <BlurReveal className="mx-auto max-w-3xl text-center">
          <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
            {t.projectDetail.commercialCta.badge} · {project.name.toUpperCase()}
          </span>

          <h2 className="mt-5 font-editorial text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)]">
            {t.projectDetail.commercialCta.headline}
          </h2>

          <p className="mx-auto mt-5 max-w-xl text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
            {t.projectDetail.commercialCta.subtext}
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-6 sm:gap-10">
            <a
              href={whatsappCommercialUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm sm:text-base text-[var(--text-primary)] underline underline-offset-8 decoration-[var(--text-muted)] hover:decoration-[var(--text-primary)] transition-colors"
            >
              <span>{t.projectDetail.commercialCta.licenseAction}</span>
              <ArrowUpRight
                className="h-4 w-4 text-[var(--text-secondary)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
                strokeWidth={1.75}
              />
            </a>

            <button
              type="button"
              onClick={handleCopyEmail}
              className="group cursor-pointer inline-flex items-center gap-2 text-sm sm:text-base text-[var(--text-primary)] underline underline-offset-8 decoration-[var(--text-muted)] hover:decoration-[var(--text-primary)] transition-colors"
            >
              <span>
                {copiedEmail
                  ? t.footer.emailCopied
                  : t.projectDetail.commercialCta.customAction}
              </span>
              {copiedEmail ? (
                <Check className="h-3.5 w-3.5 text-[var(--text-primary)]" strokeWidth={2} />
              ) : (
                <Copy
                  className="h-3.5 w-3.5 text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors"
                  strokeWidth={1.75}
                />
              )}
            </button>
          </div>
        </BlurReveal>

        <FooterBottomBar />
      </footer>
    </div>
  )
}

export default ProjectDetail
