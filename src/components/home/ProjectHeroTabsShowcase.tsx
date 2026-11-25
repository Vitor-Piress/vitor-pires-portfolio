import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, ZoomIn, ZoomOut } from "lucide-react";
import type { FeaturedProject } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";

interface ProjectHeroTabsShowcaseProps {
  project: FeaturedProject;
}

export function ProjectHeroTabsShowcase({
  project,
}: ProjectHeroTabsShowcaseProps) {
  const { language } = useLanguage();
  const screens = project.gallery ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const currentScreen = screens[activeIndex] ?? screens[0];
  const isPortrait = Boolean(
    currentScreen?.orientation === "portrait" ||
    currentScreen?.src?.includes("gmail") ||
    currentScreen?.id === "email",
  );

  // Auto-cycle pause on hover or when zoomed
  useEffect(() => {
    if (isPaused || isZoomed || screens.length <= 1) return;
    const timer = setInterval(() => {
      setIsZoomed(false);
      setActiveIndex((prev) => (prev + 1) % screens.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isZoomed, screens.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
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

  const handleCanvasClick = () => {
    setIsZoomed((prev) => !prev);
  };

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsZoomed(false);
      }}
      className="bento-card overflow-hidden p-3 sm:p-4 transition-all duration-300"
    >
      {/* Category Pills / Navigation Tabs (scrollbar hidden) */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {screens.map((scr, idx) => (
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
          ))}
        </div>

        {/* Quick Prev / Next Arrows on Header */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Tela anterior"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima tela"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Animated Window Stage (morphs height for portrait/email vs widescreen) */}
      <div
        className={`group/stage relative w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isPortrait
            ? "aspect-[16/14.5] sm:aspect-[16/13.5]"
            : "aspect-[16/10] sm:aspect-[16/9.5]"
        }`}
      >
        {/* Mock Window Header */}
        <div className="flex h-7 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 text-[10px] font-mono text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
          </div>
          <span className="truncate px-2 text-[10px] opacity-75">
            https://{project.appDomain ?? "condonot.com.br"}
            {currentScreen?.appPath}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] opacity-50 font-mono">
              {String(activeIndex + 1).padStart(2, "0")}/
              {String(screens.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Image Canvas with Pan & Zoom */}
        <div
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className={`relative flex h-[calc(100%-28px)] w-full items-center justify-center p-2.5 sm:p-3 bg-[var(--bg-bento)]/30 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          {/* Framed Image Container with overflow hidden */}
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2px] border border-[var(--border-subtle)] ${
              currentScreen?.src?.includes("gmail")
                ? "bg-white"
                : "bg-[var(--bg-primary)]"
            }`}
          >
            <AnimatePresence mode="wait">
              {currentScreen?.src && (
                <motion.img
                  key={currentScreen.id}
                  src={currentScreen.src}
                  alt={currentScreen.label[language]}
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transform: isZoomed ? "scale(2.3)" : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: isZoomed
                      ? "transform 0.12s ease-out"
                      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`h-full w-full object-contain ${
                    isPortrait ? "object-center" : "object-top"
                  } block select-none pointer-events-none`}
                  loading="lazy"
                />
              )}
            </AnimatePresence>

            {/* Floating Chevrons on Canvas Sides (hidden while zoomed to not block inspection) */}
            {!isZoomed && screens.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Tela anterior"
                  className="cursor-pointer absolute left-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-all duration-200"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Próxima tela"
                  className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-all duration-200"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            {/* Interactive Zoom Indicator Pill */}
            <div className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] backdrop-blur-sm transition-opacity duration-200 shadow-2xs opacity-0 group-hover/stage:opacity-100 transition-opacity">
              {isZoomed ? (
                <>
                  <ZoomOut className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    Zoom ativo · clique p/ sair
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <ZoomIn className="h-2.5 w-2.5" />
                  <span>1 clique p/ zoom</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Caption & Cycle Progress */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] truncate pr-3">
          {currentScreen?.label[language]}
        </span>
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          {screens.map((_, idx) => (
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
      </div>
    </div>
  );
}
