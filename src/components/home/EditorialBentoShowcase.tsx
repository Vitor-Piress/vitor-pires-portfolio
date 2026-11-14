import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  GitFork,
  Monitor,
  Smartphone,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import type {
  FeaturedProject,
  ProjectGalleryItem,
  ProjectScreen,
} from "../../data/projects";
import type { Language } from "../../i18n/translations";
import { useLanguage } from "../../context/LanguageContext";
import {
  getSavedCompanionMode,
  saveCompanionMode,
  useProjectLinkClickHandler,
} from "../../utils/returnNavigation";
import { ProjectLogo, ScreenVisual } from "../ui/ProjectVisuals";
import { CompactArchitecturePipeline } from "../project/ProjectArchitectureFlow";
import {
  getOrderedArchitectureNodes,
  useDirectionalLayer,
} from "../project/architectureFlow";

interface EditorialBentoShowcaseProps {
  project: FeaturedProject;
  index: number;
  /** Reverses the 8+4 Bento row on odd items; mobile-first projects always lead with the 4-col mobile card. */
  alternatingRhythm?: boolean;
  /** Optional directional 2-layer staggered entrance (used by Carousel Tabs prototype). */
  staggerDirection?: 1 | -1;
}

/**
 * Editorial Featured Project Showcase (`7+5` Narrative + `8+4` Hybrid Bento):
 * 1. Top Editorial Split (7 cols narrative/CTA + 5 cols 2x2 metadata & details).
 * 2. Bottom Full-Width Hybrid Bento (8 + 4 cols; `mobileFirst` projects or odd alternating items place the 4-col companion first on lg+, and `mobileFirst` also leads with it on small screens):
 *    - 8 cols: Widescreen interactive browser stage with Pan & Zoom (or desktop wireframes).
 *    - 4 cols: Dual-mode companion [ Mobile / Screen | Interactive Architecture Flow ].
 */
export function EditorialBentoShowcase({
  project,
  index,
  alternatingRhythm = true,
  staggerDirection,
}: EditorialBentoShowcaseProps) {
  const { language, t } = useLanguage();
  const { pathname } = useLocation();
  const getProjectClick = useProjectLinkClickHandler(() => ({
    sectionId: pathname === "/" ? "projects" : undefined,
    activeProjectSlug: project.slug,
  }));
  const isMobileFirst = Boolean(project.mobileFirst);
  const isCompanionFirstDesktop =
    isMobileFirst || (alternatingRhythm && index % 2 === 1);
  const widescreenOrderClass = isMobileFirst
    ? "order-2"
    : isCompanionFirstDesktop
      ? "order-1 lg:order-2"
      : "order-1";
  const companionOrderClass = isMobileFirst
    ? "order-1"
    : isCompanionFirstDesktop
      ? "order-2 lg:order-1"
      : "order-2";

  const headerMotionProps = staggerDirection
    ? {
        initial: {
          opacity: 0,
          x: staggerDirection * 20,
          y: 6,
          filter: "blur(8px)",
        },
        animate: { opacity: 1, x: 0, y: 0, filter: "blur(0px)" },
        transition: { duration: 0.36, ease: [0.22, 1, 0.36, 1] as const },
      }
    : {};

  const bentoMotionProps = staggerDirection
    ? {
        initial: {
          opacity: 0,
          x: staggerDirection * 28,
          y: 14,
          scale: 0.985,
          filter: "blur(10px)",
        },
        animate: { opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" },
        transition: {
          duration: 0.46,
          delay: 0.065,
          ease: [0.22, 1, 0.36, 1] as const,
        },
      }
    : {};

  return (
    <article className="flex flex-col gap-9 sm:gap-11">
      {/* =================================================================== */}
      {/* LAYER 1: EDITORIAL HEADER SPLIT (7 cols Left + 5 cols Right)        */}
      {/* =================================================================== */}
      <motion.div
        {...headerMotionProps}
        className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start"
      >
        {/* Left (7 cols): Identity, Serif Headline, Summary, Primary Actions */}
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-5 flex items-center gap-3">
            <ProjectLogo
              slug={project.slug}
              name={project.name}
              logo={project.logo}
            />
            {project.mobileFirst && (
              <span className="hidden sm:inline-flex items-center rounded-[2px] border border-[var(--border-subtle)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {language === "pt"
                  ? "Experiência Mobile-First"
                  : "Mobile-First Experience"}
              </span>
            )}
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)]">
            {project.headline[language]}
          </h2>

          <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {project.summary[language]}
          </p>

          {/* Action Links */}
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <Link
              to={`/project/${project.slug}`}
              onClick={getProjectClick(`/project/${project.slug}`)}
              className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--text-primary)] transition-colors"
            >
              <span>{t.projectsSection.viewDetails}</span>
              <ArrowRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
                strokeWidth={1.8}
              />
            </Link>

            {project.liveUrl ? (
              <a
                href={project.liveUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{t.projectsSection.liveWebsite}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </a>
            ) : project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{t.projectsSection.repository}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </a>
            ) : (
              <Link
                to={`/project/${project.slug}`}
                onClick={getProjectClick(`/project/${project.slug}`)}
                className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>{t.projectsSection.liveWebsite}</span>
                <ArrowUpRight
                  className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  strokeWidth={1.8}
                />
              </Link>
            )}
          </div>
        </div>

        {/* Right (5 cols): Borderless 2x2 Metadata + Details */}
        <div className="lg:col-span-5 flex flex-col gap-6 pt-1">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
            <div>
              <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.categoryClient}
              </dt>
              <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
                {project.category[language]}
              </dd>
            </div>

            <div>
              <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.role}
              </dt>
              <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
                {project.role[language]}
              </dd>
            </div>

            <div>
              <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.year}
              </dt>
              <dd className="mt-1.5 font-mono text-xs sm:text-[13px] text-[var(--text-primary)]">
                {project.year}
              </dd>
            </div>

            <div>
              <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                {t.projectsSection.meta.stack}
              </dt>
              <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
                {project.stack.join(" · ")}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.details}
            </h3>
            <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {project.details[language]}
            </p>
          </div>
        </div>
      </motion.div>

      {/* =================================================================== */}
      {/* LAYER 2: HYBRID BENTO SHOWCASE (8 cols + 4 cols, mobile-first leads)*/}
      {/* =================================================================== */}
      <motion.div
        {...bentoMotionProps}
        className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch"
      >
        {/* 8-col Widescreen Stage */}
        <div className={`lg:col-span-8 flex flex-col ${widescreenOrderClass}`}>
          <WidescreenStageCard project={project} language={language} />
        </div>

        {/* 4-col Companion Vertical / Architecture Stage */}
        <div className={`lg:col-span-4 flex flex-col ${companionOrderClass}`}>
          <CompanionPanelCard project={project} language={language} />
        </div>
      </motion.div>
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* 8-COL CARD: WIDESCREEN INTERACTIVE STAGE (REAL SCREENSHOTS OR WIREFRAMES)  */
/* -------------------------------------------------------------------------- */

function isPortraitGalleryItem(item: ProjectGalleryItem): boolean {
  return Boolean(
    item.orientation === "portrait" ||
      item.src.includes("gmail") ||
      item.id === "email",
  );
}

function WidescreenStageCard({
  project,
  language,
}: {
  project: FeaturedProject;
  language: Language;
}) {
  const landscapeScreens = (project.gallery ?? []).filter(
    (item) => !isPortraitGalleryItem(item),
  );

  const wireframeScreens: ProjectScreen[] = project.bento
    .flatMap((block) => block.screens)
    .filter((screen) => screen.device === "desktop")
    .slice(0, 4);

  const hasRealScreens = landscapeScreens.length > 0;
  const totalCount = hasRealScreens
    ? landscapeScreens.length
    : wireframeScreens.length;

  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  useEffect(() => {
    if (isPaused || isZoomed || totalCount <= 1) return;
    const timer = window.setInterval(() => {
      setIsZoomed(false);
      setActiveIndex((prev) => (prev + 1) % totalCount);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [isPaused, isZoomed, totalCount]);

  const currentReal = landscapeScreens[activeIndex] ?? landscapeScreens[0];
  const currentWireframe = wireframeScreens[activeIndex] ?? wireframeScreens[0];

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : totalCount - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev < totalCount - 1 ? prev + 1 : 0));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed || !hasRealScreens) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    );
    setMousePos({ x, y });
  };

  const activeLabel = hasRealScreens
    ? currentReal?.label[language]
    : currentWireframe?.label[language];

  const domainHost = project.appDomain ?? `${project.slug}.app`;
  const activeUrl = hasRealScreens
    ? `https://${domainHost}${currentReal?.appPath ?? ""}`
    : `https://${domainHost}/${currentWireframe?.id ?? ""}`;

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsZoomed(false);
      }}
      className="bento-card flex h-full flex-col justify-between overflow-hidden p-3 sm:p-4"
    >
      {/* Top Bar: Tabs + Arrows */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <span
            aria-hidden="true"
            className="hidden sm:inline-flex items-center justify-center pr-1 text-[var(--text-muted)]"
          >
            <Monitor className="h-3.5 w-3.5" strokeWidth={1.75} />
          </span>

          {(hasRealScreens ? landscapeScreens : wireframeScreens).map(
            (scr, idx) => (
              <button
                key={scr.id}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setActiveIndex(idx);
                }}
                className={`cursor-pointer shrink-0 rounded-[3px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                  idx === activeIndex
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold shadow-2xs"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]/40"
                }`}
              >
                {scr.label[language].split("&")[0].trim()}
              </button>
            ),
          )}
        </div>

        {totalCount > 1 && (
          <div className="hidden sm:flex items-center gap-1 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              aria-label={language === "pt" ? "Tela anterior" : "Previous screen"}
              className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={handleNext}
              aria-label={language === "pt" ? "Próxima tela" : "Next screen"}
              className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        )}
      </div>

      {/* Widescreen Browser Window */}
      <div className="group/stage relative aspect-[16/10] sm:aspect-[16/9.2] w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-sm">
        {/* Window Titlebar */}
        <div className="flex h-7 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 font-mono text-[10px] text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
          </div>
          <span className="truncate px-2 text-[10px] opacity-80">{activeUrl}</span>
          <span className="text-[9px] opacity-60 tabular-nums">
            {String(activeIndex + 1).padStart(2, "0")}/
            {String(totalCount).padStart(2, "0")}
          </span>
        </div>

        {/* Viewport Content */}
        {hasRealScreens && currentReal ? (
          <div
            onClick={() => setIsZoomed((prev) => !prev)}
            onMouseMove={handleMouseMove}
            className={`relative flex h-[calc(100%-28px)] w-full items-center justify-center p-2 sm:p-2.5 bg-[var(--bg-bento)]/30 ${
              isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
            }`}
          >
            <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={currentReal.id}
                  src={currentReal.src}
                  alt={currentReal.label[language]}
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.28 }}
                  style={{
                    transform: isZoomed ? "scale(2.1)" : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: isZoomed
                      ? "transform 0.12s ease-out"
                      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className="h-full w-full object-contain object-top block select-none pointer-events-none"
                  loading="lazy"
                />
              </AnimatePresence>

              {/* Floating Chevrons */}
              {!isZoomed && totalCount > 1 && (
                <>
                  <button
                    type="button"
                    onClick={handlePrev}
                    aria-label={language === "pt" ? "Tela anterior" : "Previous screen"}
                    className="cursor-pointer absolute left-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronLeft className="h-3.5 w-3.5" />
                  </button>
                  <button
                    type="button"
                    onClick={handleNext}
                    aria-label={language === "pt" ? "Próxima tela" : "Next screen"}
                    className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-opacity duration-200"
                  >
                    <ChevronRight className="h-3.5 w-3.5" />
                  </button>
                </>
              )}

              {/* Zoom Pill */}
              <div className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] backdrop-blur-sm opacity-0 transition-opacity duration-200 group-hover/stage:opacity-100">
                {isZoomed ? (
                  <>
                    <ZoomOut className="h-2.5 w-2.5 text-[var(--text-primary)]" />
                    <span>
                      {language === "pt"
                        ? "Zoom ativo · clique p/ sair"
                        : "Zoom active · click to exit"}
                    </span>
                  </>
                ) : (
                  <>
                    <ZoomIn className="h-2.5 w-2.5" />
                    <span>
                      {language === "pt" ? "1 clique p/ zoom" : "Click to zoom"}
                    </span>
                  </>
                )}
              </div>
            </div>
          </div>
        ) : currentWireframe ? (
          <div className="relative flex h-[calc(100%-28px)] w-full items-center justify-center bg-[var(--bg-bento)]/20">
            <AnimatePresence mode="wait">
              <motion.div
                key={currentWireframe.id}
                initial={{ opacity: 0, filter: "blur(3px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(3px)" }}
                transition={{ duration: 0.28 }}
                className="h-full w-full"
              >
                <ScreenVisual
                  projectSlug={project.slug}
                  screen={currentWireframe}
                  language={language}
                />
              </motion.div>
            </AnimatePresence>

            <span className="pointer-events-none absolute right-3 top-3 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              {language === "pt" ? "Wireframe · Capturas em breve" : "Wireframe · Screenshots soon"}
            </span>
          </div>
        ) : null}
      </div>

      {/* Bottom Caption & Dots */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] truncate pr-3">
          {activeLabel}
        </span>

        {totalCount > 1 && (
          <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
            {Array.from({ length: totalCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  setIsZoomed(false);
                  setActiveIndex(idx);
                }}
                className={`cursor-pointer h-1 rounded-full transition-all duration-300 ${
                  idx === activeIndex
                    ? "w-4 bg-[var(--text-primary)]"
                    : "w-1 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* 4-COL CARD: PORTRAIT/MOBILE VIEW + INTERACTIVE ARCHITECTURE PIPELINE       */
/* -------------------------------------------------------------------------- */

type CompanionMode = "portrait" | "architecture";

function CompanionPanelCard({
  project,
  language,
}: {
  project: FeaturedProject;
  language: Language;
}) {
  const portraitScreens = (project.gallery ?? []).filter(isPortraitGalleryItem);
  const mobileWireframes = project.bento
    .flatMap((block) => block.screens)
    .filter((screen) => screen.device === "mobile");

  const hasRealPortrait = portraitScreens.length > 0;

  const [mode, setMode] = useState<CompanionMode>(
    () =>
      getSavedCompanionMode(project.slug) ??
      (hasRealPortrait ? "portrait" : "architecture"),
  );
  const [portraitIndex, setPortraitIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  useEffect(() => {
    saveCompanionMode(project.slug, mode);
  }, [project.slug, mode]);

  const portraitCount = hasRealPortrait
    ? portraitScreens.length
    : mobileWireframes.length;

  useEffect(() => {
    if (mode !== "portrait" || isPaused || portraitCount <= 1) return;
    const timer = window.setInterval(() => {
      setPortraitIndex((prev) => (prev + 1) % portraitCount);
    }, 4500);
    return () => window.clearInterval(timer);
  }, [mode, isPaused, portraitCount]);

  const activePortraitReal =
    portraitScreens[portraitIndex] ?? portraitScreens[0];
  const activePortraitWireframe =
    mobileWireframes[portraitIndex] ?? mobileWireframes[0];

  const isGmailScreen = Boolean(
    activePortraitReal?.src.includes("gmail") ||
      activePortraitReal?.id === "email",
  );

  const secondaryTabLabel = hasRealPortrait
    ? project.slug === "condonot"
      ? language === "pt"
        ? "Notificação"
        : "Email"
      : "Mobile"
    : "Wireframe";

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      className="bento-card flex h-full min-h-[430px] lg:min-h-0 flex-col justify-between overflow-hidden p-3 sm:p-4"
    >
      {/* Top Mode Switcher: [ Mobile/Portrait | Arquitetura ] */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div
          role="tablist"
          aria-label={language === "pt" ? "Modo do painel" : "Panel mode"}
          className="inline-flex items-center gap-1 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 p-0.5"
        >
          <button
            type="button"
            role="tab"
            aria-selected={mode === "portrait"}
            onClick={() => setMode("portrait")}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
              mode === "portrait"
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <Smartphone className="h-3 w-3" strokeWidth={1.75} />
            <span>{secondaryTabLabel}</span>
            {portraitCount > 1 && (
              <span className="opacity-70 text-[9px]">({portraitCount})</span>
            )}
          </button>

          <button
            type="button"
            role="tab"
            aria-selected={mode === "architecture"}
            onClick={() => setMode("architecture")}
            className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
              mode === "architecture"
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
            }`}
          >
            <GitFork className="h-3 w-3" strokeWidth={1.75} />
            <span>{language === "pt" ? "Arquitetura" : "Architecture"}</span>
          </button>
        </div>

        {/* Counter or Stack badge */}
        {mode === "portrait" && portraitCount > 1 ? (
          <div className="flex items-center gap-1">
            <button
              type="button"
              onClick={() =>
                setPortraitIndex((prev) =>
                  prev > 0 ? prev - 1 : portraitCount - 1,
                )
              }
              aria-label={language === "pt" ? "Tela anterior" : "Previous"}
              className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronLeft className="h-3.5 w-3.5" />
            </button>
            <button
              type="button"
              onClick={() =>
                setPortraitIndex((prev) => (prev + 1) % portraitCount)
              }
              aria-label={language === "pt" ? "Próxima tela" : "Next"}
              className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <ChevronRight className="h-3.5 w-3.5" />
            </button>
          </div>
        ) : mode === "architecture" ? (
          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] tabular-nums">
            {project.architecture.length}{" "}
            {language === "pt" ? "camadas" : "layers"}
          </span>
        ) : null}
      </div>

      {/* Main Content Area (Synchronized Height with 8-col Widescreen Card) */}
      <div className="relative flex flex-1 min-h-[360px] lg:min-h-0 flex-col w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        <AnimatePresence mode="wait">
          {mode === "portrait" ? (
            <motion.div
              key="companion-portrait"
              initial={{ opacity: 0, filter: "blur(3px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-1 w-full flex-col justify-between lg:absolute lg:inset-0"
            >
              {hasRealPortrait && activePortraitReal ? (
                <>
                  {/* Portrait App Path Header */}
                  <div className="flex h-7 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 font-mono text-[9px] text-[var(--text-muted)]">
                    <span className="truncate opacity-80">
                      {project.appDomain}
                      {activePortraitReal.appPath}
                    </span>
                    <span className="shrink-0 pl-2 tabular-nums">
                      {String(portraitIndex + 1).padStart(2, "0")}/
                      {String(portraitCount).padStart(2, "0")}
                    </span>
                  </div>

                  {/* Crisp Centered Portrait Container (zero cropping, bounded height) */}
                  <div
                    className={`relative flex-1 min-h-0 flex items-center justify-center p-3 overflow-hidden ${
                      isGmailScreen ? "bg-white" : "bg-[var(--bg-primary)]"
                    }`}
                  >
                    <AnimatePresence mode="wait">
                      <motion.img
                        key={activePortraitReal.id}
                        src={activePortraitReal.src}
                        alt={activePortraitReal.label[language]}
                        initial={{ opacity: 0, scale: 0.985, filter: "blur(3px)" }}
                        animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                        exit={{ opacity: 0, scale: 0.985, filter: "blur(3px)" }}
                        transition={{ duration: 0.28 }}
                        className="h-full max-h-[340px] lg:max-h-full w-auto max-w-full object-contain rounded-[4px] select-none"
                        loading="lazy"
                      />
                    </AnimatePresence>
                  </div>
                </>
              ) : activePortraitWireframe ? (
                <div className="flex h-full w-full items-center justify-center p-2">
                  <ScreenVisual
                    projectSlug={project.slug}
                    screen={activePortraitWireframe}
                    language={language}
                  />
                </div>
              ) : null}
            </motion.div>
          ) : (
            <motion.div
              key="companion-architecture"
              initial={{ opacity: 0, filter: "blur(3px)" }}
              animate={{ opacity: 1, filter: "blur(0px)" }}
              exit={{ opacity: 0, filter: "blur(3px)" }}
              transition={{ duration: 0.25 }}
              className="flex h-full flex-1 w-full flex-col lg:absolute lg:inset-0"
            >
              <CompanionArchitectureView
                project={project}
                language={language}
              />
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Bottom Footer Caption */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] truncate pr-2">
          {mode === "portrait"
            ? hasRealPortrait
              ? activePortraitReal?.label[language]
              : activePortraitWireframe?.label[language]
            : language === "pt"
              ? "Fluxo de Arquitetura · Clique p/ inspecionar"
              : "Architecture Flow · Click node to inspect"}
        </span>

        {mode === "portrait" && portraitCount > 1 && (
          <div className="flex items-center gap-1 shrink-0" aria-hidden="true">
            {Array.from({ length: portraitCount }).map((_, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => setPortraitIndex(idx)}
                className={`cursor-pointer h-1 rounded-full transition-all duration-300 ${
                  idx === portraitIndex
                    ? "w-3.5 bg-[var(--text-primary)]"
                    : "w-1 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* INTERACTIVE ARCHITECTURE TOPOLOGY PIPELINE (IDEA 3 COMPACT RAIL)           */
/* -------------------------------------------------------------------------- */

function CompanionArchitectureView({
  project,
  language,
}: {
  project: FeaturedProject;
  language: Language;
}) {
  const { pathname } = useLocation();
  const getProjectClick = useProjectLinkClickHandler(() => ({
    sectionId: pathname === "/" ? "projects" : undefined,
    activeProjectSlug: project.slug,
  }));
  const nodes = getOrderedArchitectureNodes(project);
  const { selectedId, selectLayer } = useDirectionalLayer(nodes);
  const architectureUrl = `/project/${project.slug}#architecture`;

  return (
    <CompactArchitecturePipeline
      nodes={nodes}
      selectedId={selectedId}
      onSelect={selectLayer}
      language={language}
      headerAction={
        <Link
          to={architectureUrl}
          onClick={getProjectClick(architectureUrl)}
          className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span>{language === "pt" ? "Ver completo" : "Full spec"}</span>
          <ArrowUpRight className="h-2.5 w-2.5" />
        </Link>
      }
    />
  );
}
