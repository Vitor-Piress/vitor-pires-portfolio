import { useCallback, useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Check,
  ChevronLeft,
  ChevronRight,
  Columns2,
  LayoutList,
  SlidersHorizontal,
} from "lucide-react";
import { featuredProjects, type FeaturedProject } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";
import { ProjectLogo, ProjectMark } from "../ui/ProjectVisuals";
import { EditorialBentoShowcase } from "../home/EditorialBentoShowcase";

export type ProjectCarouselVariantId =
  | "carousel-peek-fade"
  | "carousel-tabs"
  | "carousel-cards"
  | "carousel-dual"
  | "stacked-current";

function wrapIndex(index: number, length: number): number {
  if (length <= 0) return 0;
  return ((index % length) + length) % length;
}

function useProjectCarousel(
  projects: FeaturedProject[],
  enableKeyboard = true,
) {
  const [{ step, direction }, setState] = useState<{
    step: number;
    direction: 1 | -1;
  }>({ step: 0, direction: 1 });

  const count = projects.length;
  const safeIndex = wrapIndex(step, count);

  const goPrev = useCallback(() => {
    setState((prev) => ({ step: prev.step - 1, direction: -1 }));
  }, []);

  const goNext = useCallback(() => {
    setState((prev) => ({ step: prev.step + 1, direction: 1 }));
  }, []);

  const goTo = useCallback(
    (nextIndex: number) => {
      if (count <= 0) return;
      const targetIndex = wrapIndex(nextIndex, count);
      setState((prev) => {
        const currentIndex = wrapIndex(prev.step, count);
        if (targetIndex === currentIndex) return prev;
        const delta = targetIndex - currentIndex;
        return {
          step: prev.step + delta,
          direction: delta > 0 ? 1 : -1,
        };
      });
    },
    [count],
  );

  useEffect(() => {
    if (!enableKeyboard || count <= 1) return;
    const handleKeyDown = (event: KeyboardEvent) => {
      const target = event.target as HTMLElement | null;
      if (
        target &&
        (target.tagName === "INPUT" ||
          target.tagName === "TEXTAREA" ||
          target.tagName === "SELECT" ||
          target.isContentEditable)
      ) {
        return;
      }
      if (event.key === "ArrowLeft") goPrev();
      if (event.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [enableKeyboard, count, goPrev, goNext]);

  const prevIndex = wrapIndex(safeIndex - 1, count);
  const nextIndex = wrapIndex(safeIndex + 1, count);

  return {
    step,
    activeIndex: safeIndex,
    direction,
    prevIndex,
    nextIndex,
    activeProject: projects[safeIndex],
    prevProject: projects[prevIndex],
    nextProject: projects[nextIndex],
    goPrev,
    goNext,
    goTo,
  };
}

type TabsMotionPresetId =
  | "stagger-layers"
  | "depth-scale"
  | "curtain-spring";

const TABS_MOTION_OPTIONS: {
  id: TabsMotionPresetId;
  label: string;
  hint: string;
}[] = [
  {
    id: "stagger-layers",
    label: "1 · Stagger 2 Camadas + Spring",
    hint: "Pílula layoutId com mola + Header 7+5 entra primeiro e Bento 8+4 assenta 65ms depois",
  },
  {
    id: "depth-scale",
    label: "2 · Profundidade Óptica (Scale & Blur)",
    hint: "Projeto anterior recua em escala/desfoque (0.955) enquanto o próximo emerge em foco (1.028 → 1)",
  },
  {
    id: "curtain-spring",
    label: "3 · Curtain Wipe + Spring Direcional",
    hint: "Revelação por máscara clip-path na direção clicada combinada com deslize suave",
  },
];

function getSlideVariants(preset?: TabsMotionPresetId) {
  if (preset === "stagger-layers") {
    return {
      enter: () => ({ opacity: 1, x: 0, y: 0, scale: 1, filter: "blur(0px)" }),
      center: {
        opacity: 1,
        x: 0,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: { duration: 0.1 },
      },
      exit: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction * -16,
        scale: 0.99,
        filter: "blur(6px)",
        transition: { duration: 0.18, ease: [0.22, 1, 0.36, 1] as const },
      }),
    };
  }

  if (preset === "depth-scale") {
    return {
      enter: () => ({
        opacity: 0,
        scale: 1.028,
        y: -8,
        filter: "blur(10px)",
      }),
      center: {
        opacity: 1,
        scale: 1,
        y: 0,
        filter: "blur(0px)",
        transition: { duration: 0.42, ease: [0.16, 1, 0.3, 1] as const },
      },
      exit: () => ({
        opacity: 0,
        scale: 0.955,
        y: 8,
        filter: "blur(10px)",
        transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
      }),
    };
  }

  if (preset === "curtain-spring") {
    return {
      enter: (direction: 1 | -1) => ({
        opacity: 0.25,
        x: direction * 38,
        scale: 0.99,
        filter: "blur(6px)",
        clipPath:
          direction > 0 ? "inset(0% 0% 0% 100%)" : "inset(0% 100% 0% 0%)",
      }),
      center: {
        opacity: 1,
        x: 0,
        scale: 1,
        filter: "blur(0px)",
        clipPath: "inset(0% 0% 0% 0%)",
        transition: { duration: 0.46, ease: [0.22, 1, 0.36, 1] as const },
      },
      exit: (direction: 1 | -1) => ({
        opacity: 0,
        x: direction * -28,
        scale: 0.985,
        filter: "blur(6px)",
        clipPath:
          direction > 0 ? "inset(0% 100% 0% 0%)" : "inset(0% 0% 0% 100%)",
        transition: { duration: 0.24, ease: [0.22, 1, 0.36, 1] as const },
      }),
    };
  }

  return {
    enter: (direction: 1 | -1) => ({
      opacity: 0,
      x: direction * 24,
      filter: "blur(4px)",
    }),
    center: {
      opacity: 1,
      x: 0,
      filter: "blur(0px)",
      transition: { duration: 0.28, ease: [0.22, 1, 0.36, 1] as const },
    },
    exit: (direction: 1 | -1) => ({
      opacity: 0,
      x: direction * -24,
      filter: "blur(4px)",
      transition: { duration: 0.22, ease: [0.22, 1, 0.36, 1] as const },
    }),
  };
}

function AnimatedShowcaseSlide({
  project,
  index,
  direction,
  alternatingRhythm,
  motionPreset,
}: {
  project: FeaturedProject;
  index: number;
  direction: 1 | -1;
  alternatingRhythm: boolean;
  motionPreset?: TabsMotionPresetId;
}) {
  const variants = getSlideVariants(motionPreset);

  return (
    <AnimatePresence mode="wait" custom={direction} initial={false}>
      <motion.div
        key={`${project.slug}-${alternatingRhythm}-${motionPreset ?? "default"}`}
        custom={direction}
        variants={variants}
        initial="enter"
        animate="center"
        exit="exit"
      >
        <EditorialBentoShowcase
          project={project}
          index={index}
          alternatingRhythm={alternatingRhythm}
          staggerDirection={
            motionPreset === "stagger-layers" ? direction : undefined
          }
        />
      </motion.div>
    </AnimatePresence>
  );
}

function CarouselArrowControls({
  activeIndex,
  total,
  onPrev,
  onNext,
  prevLabel,
  nextLabel,
}: {
  activeIndex: number;
  total: number;
  onPrev: () => void;
  onNext: () => void;
  prevLabel: string;
  nextLabel: string;
}) {
  return (
    <div className="inline-flex items-center gap-2">
      <button
        type="button"
        onClick={onPrev}
        aria-label={prevLabel}
        title={prevLabel}
        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ChevronLeft className="h-4 w-4" strokeWidth={1.75} />
      </button>

      <span className="min-w-[44px] text-center font-mono text-[11px] text-[var(--text-muted)] tabular-nums">
        {String(activeIndex + 1).padStart(2, "0")} /{" "}
        {String(total).padStart(2, "0")}
      </span>

      <button
        type="button"
        onClick={onNext}
        aria-label={nextLabel}
        title={nextLabel}
        className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
      >
        <ChevronRight className="h-4 w-4" strokeWidth={1.75} />
      </button>
    </div>
  );
}

/**
 * Unified Featured-Project Carousel prototyping stage for `/lab`.
 */
export function ProjectCarouselPrototypeStage({
  variant,
  alternatingRhythm,
}: {
  variant: ProjectCarouselVariantId;
  alternatingRhythm: boolean;
}) {
  if (variant === "carousel-peek-fade") {
    return (
      <CarouselPeekFadeStage
        projects={featuredProjects}
        alternatingRhythm={alternatingRhythm}
      />
    );
  }

  if (variant === "carousel-tabs") {
    return (
      <CarouselTabsStage
        projects={featuredProjects}
        alternatingRhythm={alternatingRhythm}
      />
    );
  }

  if (variant === "carousel-cards") {
    return (
      <CarouselCardsStage
        projects={featuredProjects}
        alternatingRhythm={alternatingRhythm}
      />
    );
  }

  if (variant === "carousel-dual") {
    return (
      <CarouselDualModeStage
        projects={featuredProjects}
        alternatingRhythm={alternatingRhythm}
      />
    );
  }

  return (
    <StackedCurrentStage
      projects={featuredProjects}
      alternatingRhythm={alternatingRhythm}
    />
  );
}

const CONVEYOR_EDGE_VARIANTS = {
  enter: (direction: 1 | -1) => ({
    x: direction > 0 ? "208%" : "-208%",
    opacity: 0,
    scale: 0.94,
    filter: "blur(1px)",
  }),
  exit: (direction: 1 | -1) => ({
    x: direction > 0 ? "-208%" : "208%",
    opacity: 0,
    scale: 0.94,
    filter: "blur(1px)",
  }),
};

/** Ideia 4: Carrossel Peek em Fade nas Extremidades + Esteira Horizontal Sincronizada */
function CarouselPeekFadeStage({
  projects,
  alternatingRhythm,
}: {
  projects: FeaturedProject[];
  alternatingRhythm: boolean;
}) {
  const { language, t } = useLanguage();
  const carousel = useProjectCarousel(projects, true);

  const prevAria =
    language === "pt"
      ? `Projeto anterior: ${carousel.prevProject.name}`
      : `Previous project: ${carousel.prevProject.name}`;
  const nextAria =
    language === "pt"
      ? `Próximo projeto: ${carousel.nextProject.name}`
      : `Next project: ${carousel.nextProject.name}`;

  const visibleSlots = [-1, 0, 1] as const;

  return (
    <section className="w-full py-12 sm:py-16">
      {/* Centered Header Bar */}
      <div className="mx-auto mb-8 sm:mb-12 flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 px-6 md:px-8">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.featuredLabel}
        </span>

        {/* Subtle Quick Jump Indicators */}
        <div className="flex flex-wrap items-center gap-1.5">
          {projects.map((proj, idx) => {
            const isActive = idx === carousel.activeIndex;
            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => carousel.goTo(idx)}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  isActive
                    ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-bento)]"
                }`}
              >
                <span className="tabular-nums opacity-70">
                  {String(idx + 1).padStart(2, "0")}
                </span>
                <span>{proj.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-bleed Horizontal Conveyor Track */}
      <div className="relative w-full overflow-hidden py-4">
        {/* Centered Width Container + Padding */}
        <div className="mx-auto w-full max-w-5xl px-6 md:px-8">
          {/* Zero-padding Anchor Box so relative & absolute slides share identical width/x=0 */}
          <div className="relative w-full">
            <AnimatePresence custom={carousel.direction} initial={false}>
              {visibleSlots.map((slot) => {
                const slideStep = carousel.step + slot;
                const slideIndex = wrapIndex(slideStep, projects.length);
                const slideProject = projects[slideIndex];
                const isCenter = slot === 0;

                return (
                  <motion.div
                    key={slideStep}
                    custom={carousel.direction}
                    variants={CONVEYOR_EDGE_VARIANTS}
                    initial="enter"
                    animate={{
                      x: isCenter ? "0%" : slot < 0 ? "-104%" : "104%",
                      opacity: isCenter ? 1 : 0.42,
                      scale: isCenter ? 1 : 0.96,
                      filter: isCenter ? "blur(0px)" : "blur(0.5px)",
                    }}
                    exit="exit"
                    transition={{
                      duration: 0.52,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    inert={!isCenter}
                    aria-hidden={!isCenter}
                    className={
                      isCenter
                        ? "relative z-20 w-full"
                        : "pointer-events-none select-none absolute top-0 inset-x-0 z-10 w-full"
                    }
                  >
                    <EditorialBentoShowcase
                      project={slideProject}
                      index={slideIndex}
                      alternatingRhythm={alternatingRhythm}
                    />
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {/* Clickable Side Peek Margins (Desktop md+) */}
            <button
              type="button"
              onClick={carousel.goPrev}
              aria-label={prevAria}
              title={prevAria}
              className="hidden md:block cursor-pointer absolute inset-y-0 right-[calc(100%+16px)] w-[45vw] z-30"
            />
            <button
              type="button"
              onClick={carousel.goNext}
              aria-label={nextAria}
              title={nextAria}
              className="hidden md:block cursor-pointer absolute inset-y-0 left-[calc(100%+16px)] w-[45vw] z-30"
            />
          </div>
        </div>

        {/* Left & Right Atmospheric Edge Fade Masks (auto-sized to exact outer gutters) */}
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute inset-y-0 left-0 w-[max(0px,calc(50vw-31rem))] z-30 bg-gradient-to-r from-[var(--bg-primary)] via-[var(--bg-primary)]/75 to-transparent"
        />
        <div
          aria-hidden="true"
          className="hidden md:block pointer-events-none absolute inset-y-0 right-0 w-[max(0px,calc(50vw-31rem))] z-30 bg-gradient-to-l from-[var(--bg-primary)] via-[var(--bg-primary)]/75 to-transparent"
        />

        {/* Outer Extremity Navigation Buttons (md+) */}
        <button
          type="button"
          onClick={carousel.goPrev}
          aria-label={prevAria}
          title={prevAria}
          className="hidden md:inline-flex cursor-pointer group absolute left-3 lg:left-6 top-[44%] -translate-y-1/2 z-40 h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] shadow-md backdrop-blur-md hover:border-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronLeft
            className="h-5 w-5 transition-transform duration-150 group-hover:-translate-x-0.5"
            strokeWidth={1.75}
          />
        </button>

        <button
          type="button"
          onClick={carousel.goNext}
          aria-label={nextAria}
          title={nextAria}
          className="hidden md:inline-flex cursor-pointer group absolute right-3 lg:right-6 top-[44%] -translate-y-1/2 z-40 h-11 w-11 items-center justify-center rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 text-[var(--text-primary)] shadow-md backdrop-blur-md hover:border-[var(--text-primary)] hover:scale-105 active:scale-95 transition-all"
        >
          <ChevronRight
            className="h-5 w-5 transition-transform duration-150 group-hover:translate-x-0.5"
            strokeWidth={1.75}
          />
        </button>
      </div>

      {/* Bottom Status & Mobile Controls */}
      <div className="mx-auto mt-8 sm:mt-10 flex w-full max-w-5xl flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)]/60 px-6 pt-5 md:px-8">
        <div className="flex items-center gap-2 font-mono text-[10px] text-[var(--text-muted)]">
          <span className="text-[var(--text-primary)] font-medium">
            {String(carousel.activeIndex + 1).padStart(2, "0")}/
            {String(projects.length).padStart(2, "0")}
          </span>
          <span>·</span>
          <span>
            {language === "pt"
              ? `Próximo: ${carousel.nextProject.name}`
              : `Next: ${carousel.nextProject.name}`}
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {projects.map((proj, idx) => {
            const isActive = idx === carousel.activeIndex;
            return (
              <button
                key={proj.slug}
                type="button"
                aria-label={proj.name}
                onClick={() => carousel.goTo(idx)}
                className={`cursor-pointer h-1.5 rounded-full transition-all duration-300 ${
                  isActive
                    ? "w-7 bg-[var(--text-primary)]"
                    : "w-2 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]"
                }`}
              />
            );
          })}
        </div>

        <div className="md:hidden">
          <CarouselArrowControls
            activeIndex={carousel.activeIndex}
            total={projects.length}
            onPrev={carousel.goPrev}
            onNext={carousel.goNext}
            prevLabel={prevAria}
            nextLabel={nextAria}
          />
        </div>

        <span className="hidden md:inline font-mono text-[10px] text-[var(--text-muted)]">
          {language === "pt"
            ? "Use ← → ou clique nas laterais em fade"
            : "Use ← → or click the faded side previews"}
        </span>
      </div>
    </section>
  );
}

/** Ideia 1: Palco Único com Barra de Projetos & Setas */
function CarouselTabsStage({
  projects,
  alternatingRhythm,
}: {
  projects: FeaturedProject[];
  alternatingRhythm: boolean;
}) {
  const { language, t } = useLanguage();
  const carousel = useProjectCarousel(projects, true);
  const [motionPreset, setMotionPreset] =
    useState<TabsMotionPresetId>("stagger-layers");

  const activeMotionOption =
    TABS_MOTION_OPTIONS.find((opt) => opt.id === motionPreset) ??
    TABS_MOTION_OPTIONS[0];

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 md:px-10">
      {/* Lab Motion Preset Selector for Ideia 1 */}
      <div className="mb-8 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/55 p-3.5 sm:p-4 space-y-2.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Animação:
          </span>
          {TABS_MOTION_OPTIONS.map((option) => {
            const isSelected = option.id === motionPreset;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => setMotionPreset(option.id)}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  isSelected
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                    : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check aria-hidden="true" className="h-3 w-3" />}
              </button>
            );
          })}
        </div>
        <p className="font-mono text-[10px] text-[var(--text-muted)]">
          {activeMotionOption.hint}
        </p>
      </div>

      {/* Header Row */}
      <div className="mb-10 sm:mb-12 flex flex-col gap-5 border-b border-[var(--border-subtle)]/70 pb-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.projectsSection.featuredLabel}
          </span>

          <CarouselArrowControls
            activeIndex={carousel.activeIndex}
            total={projects.length}
            onPrev={carousel.goPrev}
            onNext={carousel.goNext}
            prevLabel={
              language === "pt" ? "Projeto anterior" : "Previous project"
            }
            nextLabel={language === "pt" ? "Próximo projeto" : "Next project"}
          />
        </div>

        {/* Project Switcher Tabs with Sliding Spring Pill */}
        <div className="flex flex-wrap items-center gap-2">
          {projects.map((proj, idx) => {
            const isActive = idx === carousel.activeIndex;
            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => carousel.goTo(idx)}
                className={`relative overflow-hidden cursor-pointer inline-flex items-center gap-2.5 rounded-[4px] border px-3.5 py-2 text-left transition-colors duration-200 ${
                  isActive
                    ? "border-[var(--text-primary)] text-[var(--bg-primary)]"
                    : "border-[var(--border-subtle)] bg-[var(--bg-bento)]/55 text-[var(--text-secondary)] hover:border-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                {isActive && (
                  <motion.span
                    layoutId="ideia1-active-project-pill"
                    transition={{
                      type: "spring",
                      stiffness: 420,
                      damping: 32,
                    }}
                    className="absolute inset-0 bg-[var(--text-primary)] shadow-sm"
                  />
                )}

                <span className="relative z-10 inline-flex items-center gap-2.5">
                  <span className="font-mono text-[10px] opacity-65 tabular-nums">
                    {String(idx + 1).padStart(2, "0")}
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
                      isActive ? "opacity-75" : "text-[var(--text-muted)]"
                    }`}
                  >
                    · {proj.year}
                  </span>
                </span>
              </button>
            );
          })}
        </div>
      </div>

      <AnimatedShowcaseSlide
        project={carousel.activeProject}
        index={carousel.activeIndex}
        direction={carousel.direction}
        alternatingRhythm={alternatingRhythm}
        motionPreset={motionPreset}
      />
    </section>
  );
}

/** Ideia 2: Palco Principal + Mini-Cards Seletor na Base */
function CarouselCardsStage({
  projects,
  alternatingRhythm,
}: {
  projects: FeaturedProject[];
  alternatingRhythm: boolean;
}) {
  const { language, t } = useLanguage();
  const carousel = useProjectCarousel(projects, true);

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 md:px-10">
      <div className="mb-10 sm:mb-12 flex flex-wrap items-center justify-between gap-4">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.featuredLabel}
        </span>

        <CarouselArrowControls
          activeIndex={carousel.activeIndex}
          total={projects.length}
          onPrev={carousel.goPrev}
          onNext={carousel.goNext}
          prevLabel={
            language === "pt" ? "Projeto anterior" : "Previous project"
          }
          nextLabel={language === "pt" ? "Próximo projeto" : "Next project"}
        />
      </div>

      <AnimatedShowcaseSlide
        project={carousel.activeProject}
        index={carousel.activeIndex}
        direction={carousel.direction}
        alternatingRhythm={alternatingRhythm}
      />

      {/* Bottom Deck of Compact Project Cards */}
      <div className="mt-12 sm:mt-14 border-t border-[var(--border-subtle)]/70 pt-8">
        <div className="mb-4 flex items-center justify-between gap-2">
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            {language === "pt"
              ? "Selecionar outro projeto"
              : "Select another project"}
          </span>
          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {String(projects.length).padStart(2, "0")}{" "}
            {language === "pt" ? "projetos publicados" : "published projects"}
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 sm:gap-4">
          {projects.map((proj, idx) => {
            const isActive = idx === carousel.activeIndex;
            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => carousel.goTo(idx)}
                className={`cursor-pointer bento-card flex flex-col justify-between p-4 sm:p-5 text-left border transition-all ${
                  isActive
                    ? "border-[var(--text-primary)] bg-[var(--bg-bento)] shadow-sm"
                    : "border-transparent hover:border-[var(--border-subtle)] opacity-75 hover:opacity-100"
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="scale-90 origin-left pointer-events-none">
                    <ProjectLogo
                      slug={proj.slug}
                      name={proj.name}
                      logo={proj.logo}
                    />
                  </div>
                  <span
                    className={`rounded-full px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider ${
                      isActive
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                        : "bg-[var(--bg-primary)] text-[var(--text-muted)]"
                    }`}
                  >
                    {isActive
                      ? language === "pt"
                        ? "No palco"
                        : "Active"
                      : String(idx + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="mt-4">
                  <div className="text-sm font-medium text-[var(--text-primary)] line-clamp-1">
                    {proj.headline[language]}
                  </div>
                  <div className="mt-1.5 flex items-center justify-between gap-2 font-mono text-[10px] text-[var(--text-muted)]">
                    <span className="truncate">{proj.category[language]}</span>
                    <span className="shrink-0 tabular-nums">{proj.year}</span>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </section>
  );
}

/** Ideia 3: Modo Duplo (Alternar entre Carrossel Compacto e Lista Completa) */
function CarouselDualModeStage({
  projects,
  alternatingRhythm,
}: {
  projects: FeaturedProject[];
  alternatingRhythm: boolean;
}) {
  const { language, t } = useLanguage();
  const [viewMode, setViewMode] = useState<"carousel" | "list">("carousel");
  const carousel = useProjectCarousel(projects, viewMode === "carousel");

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 md:px-10">
      {/* Header Bar: Title + Dual Mode Switch + Carousel Controls */}
      <div className="mb-10 sm:mb-14 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)]/70 pb-5">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.featuredLabel}
        </span>

        <div className="flex flex-wrap items-center gap-3">
          {viewMode === "carousel" && (
            <CarouselArrowControls
              activeIndex={carousel.activeIndex}
              total={projects.length}
              onPrev={carousel.goPrev}
              onNext={carousel.goNext}
              prevLabel={
                language === "pt" ? "Projeto anterior" : "Previous project"
              }
              nextLabel={language === "pt" ? "Próximo projeto" : "Next project"}
            />
          )}

          {/* Segmented Switch: Carousel vs Full List */}
          <div
            role="group"
            aria-label={language === "pt" ? "Modo de exibição" : "Display mode"}
            className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-0.5"
          >
            <button
              type="button"
              onClick={() => setViewMode("carousel")}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                viewMode === "carousel"
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Columns2 className="h-3 w-3" />
              <span>
                {language === "pt" ? "Carrossel (1)" : "Carousel (1)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setViewMode("list")}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                viewMode === "list"
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <LayoutList className="h-3 w-3" />
              <span>
                {language === "pt"
                  ? `Ver todos (${projects.length})`
                  : `View all (${projects.length})`}
              </span>
            </button>
          </div>
        </div>
      </div>

      {viewMode === "carousel" ? (
        <div>
          <AnimatedShowcaseSlide
            project={carousel.activeProject}
            index={carousel.activeIndex}
            direction={carousel.direction}
            alternatingRhythm={alternatingRhythm}
          />

          <div className="mt-10 flex flex-wrap items-center justify-between gap-4 border-t border-[var(--border-subtle)]/50 pt-5">
            <div className="flex flex-wrap items-center gap-2">
              {projects.map((proj, idx) => (
                <button
                  key={proj.slug}
                  type="button"
                  onClick={() => carousel.goTo(idx)}
                  className={`cursor-pointer font-mono text-[10px] uppercase tracking-wider px-2.5 py-1 rounded-[2px] transition-colors ${
                    idx === carousel.activeIndex
                      ? "bg-[var(--bg-bento)] text-[var(--text-primary)] font-semibold border border-[var(--border-subtle)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {String(idx + 1).padStart(2, "0")} · {proj.name}
                </button>
              ))}
            </div>

            <span className="font-mono text-[10px] text-[var(--text-muted)]">
              <SlidersHorizontal className="inline h-3 w-3 mr-1 opacity-70" />
              {language === "pt"
                ? "Visitante escolhe entre resumo rápido ou rolagem completa"
                : "Visitors choose compact stage or full vertical list"}
            </span>
          </div>
        </div>
      ) : (
        <div className="flex flex-col gap-28 sm:gap-36">
          {projects.map((proj, idx) => (
            <EditorialBentoShowcase
              key={`${proj.slug}-${alternatingRhythm}`}
              project={proj}
              index={idx}
              alternatingRhythm={alternatingRhythm}
            />
          ))}
        </div>
      )}
    </section>
  );
}

/** Atual na Home: Lista Vertical Completa */
function StackedCurrentStage({
  projects,
  alternatingRhythm,
}: {
  projects: FeaturedProject[];
  alternatingRhythm: boolean;
}) {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 md:px-10">
      <div className="mb-14 sm:mb-20">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.featuredLabel}
        </span>
      </div>

      <div className="flex flex-col gap-28 sm:gap-36">
        {projects.map((proj, idx) => (
          <EditorialBentoShowcase
            key={`${proj.slug}-${alternatingRhythm}`}
            project={proj}
            index={idx}
            alternatingRhythm={alternatingRhythm}
          />
        ))}
      </div>
    </section>
  );
}
