import { useEffect, useState } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { scrollToElement } from "../../utils/scroll";
import { ProfileQuickLinks } from "../ui/SocialIcons";

export function HeroSection() {
  const { t } = useLanguage();
  const { scrollY } = useScroll();

  // Smooth upward lift & fade of the Hero wordmark as it hands off to the fixed Header
  const nameOpacity = useTransform(scrollY, [20, 140], [1, 0]);
  const nameY = useTransform(scrollY, [0, 140], [0, -28]);

  return (
    <section className="relative mx-auto w-full max-w-6xl px-6 pt-32 pb-24 sm:pt-40 sm:pb-32 md:px-10">
      <div className="max-w-3xl">
        {/* Top Metadata + Availability + Live Presence */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(8px)", y: 12 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
          className="mb-8 flex flex-wrap items-center gap-x-4 gap-y-2"
        >
          <div className="inline-flex items-center gap-2.5">
            <span className="relative flex h-2 w-2">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--text-primary)] opacity-40" />
              <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--text-primary)]" />
            </span>
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {t.hero.availability}
            </span>
          </div>

          <span
            aria-hidden="true"
            className="hidden sm:inline-block h-3 w-px bg-[var(--border-subtle)]"
          />

          <LivePresenceTime />
        </motion.div>

        {/* Author Name — Breeder-inspired handoff to top-left Header on scroll */}
        <motion.div
          style={{ opacity: nameOpacity, y: nameY }}
          className="mb-5 origin-left will-change-transform"
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

        {/* Main Typographic Statement */}
        <motion.h1
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="text-3xl sm:text-5xl md:text-[54px] font-medium tracking-[-0.03em] leading-[1.08] text-[var(--text-primary)]"
        >
          {t.hero.headline}
          <br />
          <span className="font-editorial italic font-normal text-[var(--text-secondary)]">
            {t.hero.subheadline}
          </span>
        </motion.h1>

        {/* Concise Vision Paragraph */}
        <motion.p
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.18, ease: [0.22, 1, 0.36, 1] }}
          className="mt-7 max-w-2xl text-base sm:text-lg leading-relaxed text-[var(--text-secondary)]"
        >
          {t.hero.description}
        </motion.p>

        {/* Direct Action Pills + Quick Social Links */}
        <motion.div
          initial={{ opacity: 0, filter: "blur(10px)", y: 16 }}
          animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
          transition={{ duration: 0.7, delay: 0.26, ease: [0.22, 1, 0.36, 1] }}
          className="mt-10 flex flex-col items-start gap-6"
        >
          <div className="flex flex-wrap items-center gap-3 sm:gap-4">
            {/* Primary Pill: White on Black in dark mode / Black on White in light mode */}
            <button
              type="button"
              onClick={() => scrollToElement("contact", 78)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-85"
            >
              <span>{t.hero.ctaContact}</span>
              <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
            </button>

            {/* Secondary Action: Clean subtle pill */}
            <button
              type="button"
              onClick={() => scrollToElement("projects", 78)}
              className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[var(--bg-bento)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-bento-elevated)]"
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
function LivePresenceTime() {
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
      title="Horário local — Santa Catarina, Brasil (America/Sao_Paulo)"
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
