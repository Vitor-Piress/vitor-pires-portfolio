import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown, ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { scrollToElement } from "../../utils/scroll";
import { ProfileQuickLinks } from "../ui/SocialIcons";

interface HeroSectionProps {
  /** Tighter top clearance when previewed beneath Design Lab's sticky bar. */
  compactTop?: boolean;
  projectsTargetId?: string;
}

export function HeroSection({
  compactTop = false,
  projectsTargetId = "projects",
}: HeroSectionProps = {}) {
  const { t } = useLanguage();
  const { scrollY } = useScroll();

  // Smooth upward lift & fade of the Hero wordmark as it hands off to the fixed Header
  const nameOpacity = useTransform(scrollY, [20, 140], [1, 0]);
  const nameY = useTransform(scrollY, [0, 140], [0, -28]);
  const scrollCueOpacity = useTransform(scrollY, [0, 72], [1, 0]);

  return (
    <section
      className={`relative mx-auto w-full max-w-6xl px-6 md:px-10 ${
        compactTop
          ? "pt-16 pb-14 sm:pt-22 sm:pb-20"
          : "flex min-h-svh flex-col justify-between pt-24 pb-4 sm:pt-32 sm:pb-8"
      }`}
    >
      <div className={compactTop ? undefined : "my-auto py-2 sm:py-8"}>
        {/* Top Metadata, Availability & Live Presence */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-4 sm:mb-6 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <div className="inline-flex items-center gap-2.5">
            <span
              aria-hidden="true"
              className="inline-flex h-2 w-2 rounded-full bg-[var(--text-primary)]"
            />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {t.hero.availabilityCompact}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="hidden sm:inline-block h-3 w-px bg-[var(--border-subtle)]"
          />

          <LivePresenceTime />
        </motion.div>

        {/* Author Name: Breeder-inspired handoff to top-left Header on scroll */}
        <motion.div
          style={{ opacity: nameOpacity, y: nameY }}
          className="mb-3 sm:mb-4 origin-left will-change-transform"
        >
          <motion.span
            initial={{ opacity: 0, filter: "blur(10px)", y: 14 }}
            animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
            transition={{
              duration: 0.6,
              delay: 0.05,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="inline-block font-mono text-sm sm:text-base font-medium uppercase tracking-[0.22em] text-[var(--text-primary)]"
          >
            {t.hero.name}
          </motion.span>
        </motion.div>

        {/* Main Typographic Statement: Two-Step Editorial Scale */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="max-w-4xl text-3xl sm:text-5xl md:text-[52px] font-medium tracking-[-0.03em] leading-[1.06] text-[var(--text-primary)]"
        >
          {t.hero.headline}
          <span className="mt-2 sm:mt-2.5 block font-editorial italic font-normal text-2xl sm:text-[32px] md:text-[38px] leading-[1.18] tracking-[-0.01em] text-[var(--text-secondary)]">
            {t.hero.subheadline}
          </span>
        </motion.h1>

        {/* Concise Vision Paragraph */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-4 sm:mt-6 max-w-2xl text-[15px] sm:text-base leading-relaxed text-[var(--text-secondary)]"
        >
          {t.hero.description}
        </motion.p>

        {/* Full-Width Balanced Action Rail: Pills Left, Quick Links Right */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-6 sm:mt-9 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 sm:gap-6"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Primary Pill: White on Black in dark mode / Black on White in light mode */}
            <button
              type="button"
              onClick={() => scrollToElement("contact", 106)}
              className="cursor-pointer inline-flex min-h-[44px] sm:min-h-0 items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-3 sm:py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-85"
            >
              <span>{t.hero.ctaContact}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </button>

            {/* Secondary Action: Clean subtle pill */}
            <button
              type="button"
              onClick={() => scrollToElement(projectsTargetId, 106)}
              className="cursor-pointer inline-flex min-h-[44px] sm:min-h-0 items-center gap-2 rounded-full bg-[var(--bg-bento)] px-6 py-3 sm:py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-bento-elevated)]"
            >
              <span>{t.hero.ctaProjects}</span>
              <ArrowDownRight
                className="h-4 w-4 text-[var(--text-secondary)]"
                strokeWidth={1.8}
              />
            </button>
          </div>

          {/* Quick Social & CV Links */}
          <ProfileQuickLinks
            cvLabel={t.hero.ctaCv}
            className="gap-5 text-xs tracking-wider"
          />
        </motion.div>
      </div>

      {!compactTop && (
        <motion.div style={{ opacity: scrollCueOpacity }} className="pt-2">
          <button
            type="button"
            onClick={() => scrollToElement(projectsTargetId, 106)}
            aria-label={t.hero.scrollHintAria}
            className="group inline-flex min-h-[44px] items-center gap-2 font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>{t.hero.scrollHint}</span>
            <ArrowDown
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-y-0.5"
              strokeWidth={1.75}
              aria-hidden="true"
            />
          </button>
        </motion.div>
      )}
    </section>
  );
}

function formatBrazilLocalTime(): string {
  return new Intl.DateTimeFormat("pt-BR", {
    timeZone: "America/Sao_Paulo",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    hour12: false,
  }).format(new Date());
}

/**
 * Isolated live local clock (America/Sao_Paulo) so 1s ticks never re-render HeroSection.
 */
export function LivePresenceTime() {
  const [localTime, setLocalTime] = useState<string>(() =>
    formatBrazilLocalTime(),
  );

  useEffect(() => {
    const timerId = window.setInterval(() => {
      setLocalTime(formatBrazilLocalTime());
    }, 1000);

    return () => window.clearInterval(timerId);
  }, []);

  return (
    <div
      className="inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)] tabular-nums"
      title="Horário local · Santa Catarina, Brasil (America/Sao_Paulo)"
    >
      <span>SC, BR</span>
      <span aria-hidden="true" className="opacity-40">
        ·
      </span>
      <time dateTime={localTime} className="text-[var(--text-secondary)]">
        {localTime}
      </time>
      <span className="opacity-65">GMT-3</span>
    </div>
  );
}
