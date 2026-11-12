import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Maximize2 } from "lucide-react";
import type { ProjectBentoBlock, ProjectScreen } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";
import { ScreenVisual } from "../ui/ProjectVisuals";

interface ProjectBentoShowcaseProps {
  projectSlug: string;
  blocks: ProjectBentoBlock[];
  size?: "compact" | "expanded";
  onExpandScreen?: (screen: ProjectScreen) => void;
}

export function ProjectBentoShowcase({
  projectSlug,
  blocks,
  size = "compact",
  onExpandScreen,
}: ProjectBentoShowcaseProps) {
  return (
    <div
      className={`grid grid-cols-1 sm:grid-cols-2 ${size === "expanded" ? "gap-5" : "gap-4"}`}
    >
      {blocks.map((block, idx) => (
        <BentoBlockCard
          key={block.id}
          projectSlug={projectSlug}
          block={block}
          index={idx}
          staggerMs={idx * 850}
          onExpandScreen={onExpandScreen}
        />
      ))}
    </div>
  );
}

interface BentoBlockCardProps {
  projectSlug: string;
  block: ProjectBentoBlock;
  index: number;
  staggerMs: number;
  onExpandScreen?: (screen: ProjectScreen) => void;
}

function BentoBlockCard({
  projectSlug,
  block,
  index,
  staggerMs,
  onExpandScreen,
}: BentoBlockCardProps) {
  const { language, t } = useLanguage();
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const screenCount = block.screens.length;
  const activeScreen = block.screens[activeIndex] ?? block.screens[0];

  useEffect(() => {
    if (screenCount <= 1 || isPaused) return;

    let intervalId: number | undefined;

    const startTimeout = window.setTimeout(() => {
      setActiveIndex((prev) => (prev + 1) % screenCount);
      intervalId = window.setInterval(() => {
        setActiveIndex((prev) => (prev + 1) % screenCount);
      }, 4000);
    }, 4000 + staggerMs);

    return () => {
      window.clearTimeout(startTimeout);
      if (intervalId !== undefined) {
        window.clearInterval(intervalId);
      }
    };
  }, [screenCount, isPaused, staggerMs]);

  let spanClasses = "";
  if (block.span === "wide") {
    spanClasses = "sm:col-span-2 aspect-[16/10] sm:aspect-[16/9.4]";
  } else if (block.span === "tall") {
    spanClasses =
      "sm:col-start-2 sm:row-start-2 sm:row-span-2 h-full min-h-[380px] sm:min-h-0";
  } else {
    const isFirstHalf =
      index === 2 ||
      block.id === "flow-notices" ||
      block.id === "flow-guide" ||
      block.id === "flow-tasks";
    spanClasses = isFirstHalf
      ? "sm:col-start-1 sm:row-start-2 sm:col-span-1 aspect-[16/11.5]"
      : "sm:col-start-1 sm:row-start-3 sm:col-span-1 aspect-[16/11.5]";
  }

  const isExpandable = Boolean(onExpandScreen);

  return (
    <div
      role={isExpandable ? "button" : undefined}
      tabIndex={isExpandable ? 0 : undefined}
      aria-label={
        isExpandable
          ? `${t.projectDetail.sections.clickToExpand}: ${activeScreen.label[language]}`
          : undefined
      }
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
      onClick={() => onExpandScreen?.(activeScreen)}
      onKeyDown={(e) => {
        if (isExpandable && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault();
          onExpandScreen?.(activeScreen);
        }
      }}
      className={`bento-card group relative flex flex-col justify-between overflow-hidden outline-none ${
        isExpandable ? "cursor-pointer" : ""
      } ${spanClasses}`}
    >
      {/* Expand Hover Indicator (when click-to-expand is enabled) */}
      {isExpandable && (
        <div className="pointer-events-none absolute right-3.5 top-3.5 z-10 inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] opacity-0 backdrop-blur-sm transition-opacity duration-200 group-hover:opacity-100 group-focus-visible:opacity-100">
          <Maximize2 className="h-2.5 w-2.5" strokeWidth={1.8} />
          <span>{t.projectDetail.sections.clickToExpand}</span>
        </div>
      )}

      {/* Crossfading Screen Viewport */}
      <div className="relative flex-1 w-full overflow-hidden">
        <AnimatePresence initial={false}>
          <motion.div
            key={activeScreen.id}
            initial={{ opacity: 0, filter: "blur(4px)", scale: 1.01 }}
            animate={{ opacity: 1, filter: "blur(0px)", scale: 1 }}
            exit={{ opacity: 0, filter: "blur(4px)", scale: 0.995 }}
            transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <ScreenVisual
              projectSlug={projectSlug}
              screen={activeScreen}
              language={language}
            />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* Subtle Bottom Flow Caption + Cycle Dots */}
      <div className="flex items-center justify-between px-4 pb-3.5 pt-1">
        <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-[var(--text-muted)] group-hover:text-[var(--text-secondary)] transition-colors truncate pr-2">
          {activeScreen.label[language]}
        </span>

        {screenCount > 1 && (
          <div className="flex items-center gap-1.5" aria-hidden="true">
            {block.screens.map((scr, idx) => (
              <button
                key={scr.id}
                type="button"
                tabIndex={-1}
                onClick={(e) => {
                  e.stopPropagation();
                  setActiveIndex(idx);
                }}
                className={`cursor-pointer h-1 transition-all duration-300 rounded-full ${
                  idx === activeIndex
                    ? "w-3.5 bg-[var(--text-primary)] opacity-85"
                    : "w-1 bg-[var(--text-muted)] opacity-40 hover:opacity-70"
                }`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
