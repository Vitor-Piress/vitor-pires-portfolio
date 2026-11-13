import { motion } from "framer-motion";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { scrollToElement } from "../../utils/scroll";
import { LivePresenceTime } from "../home/HeroSection";
import { ProfileQuickLinks } from "../ui/SocialIcons";

function HeroActionButtons({
  targetSectionId = "lab-projects-preview",
}: {
  targetSectionId?: string;
}) {
  const { t } = useLanguage();

  return (
    <div className="flex flex-wrap items-center gap-3 sm:gap-4">
      <button
        type="button"
        onClick={() => scrollToElement("contact", 78)}
        className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-6 py-2.5 text-sm font-medium text-[var(--bg-primary)] transition-opacity hover:opacity-85"
      >
        <span>{t.hero.ctaContact}</span>
        <ArrowUpRight className="h-4 w-4" strokeWidth={1.8} />
      </button>

      <button
        type="button"
        onClick={() => scrollToElement(targetSectionId, 88)}
        className="cursor-pointer inline-flex items-center gap-2 rounded-full bg-[var(--bg-bento)] px-6 py-2.5 text-sm font-medium text-[var(--text-primary)] transition-colors hover:bg-[var(--bg-bento-elevated)]"
      >
        <span>{t.hero.ctaProjects}</span>
        <ArrowDownRight
          className="h-4 w-4 text-[var(--text-secondary)]"
          strokeWidth={1.8}
        />
      </button>
    </div>
  );
}

function StatusPulseDot() {
  return (
    <span className="relative flex h-2 w-2 shrink-0">
      <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--text-primary)] opacity-40" />
      <span className="relative inline-flex h-2 w-2 rounded-full bg-[var(--text-primary)]" />
    </span>
  );
}

/**
 * Opção 1: Hero em Grid Editorial 7 + 5 espelhando o ritmo dos projetos abaixo.
 * Esquerda (7 cols): Identidade, Título, Descrição e CTAs principais.
 * Direita (5 cols): Ficha técnica sem bordas (Status, Presença ao vivo e Links).
 */
export function HeroGridEditorialPrototype() {
  const { language, t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-16 pb-16 sm:pt-24 sm:pb-20 md:px-10">
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
        className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-end"
      >
        {/* Left (7 cols): Core Narrative & Actions */}
        <div className="lg:col-span-7 flex flex-col">
          <span className="mb-5 inline-block font-mono text-sm sm:text-base font-medium uppercase tracking-[0.22em] text-[var(--text-primary)]">
            {t.hero.name}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-[52px] font-medium tracking-[-0.03em] leading-[1.08] text-[var(--text-primary)]">
            {t.hero.headline}
            <br />
            <span className="font-editorial italic font-normal text-[var(--text-secondary)]">
              {t.hero.subheadline}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-[17px] leading-relaxed text-[var(--text-secondary)]">
            {t.hero.description}
          </p>

          <div className="mt-8">
            <HeroActionButtons />
          </div>
        </div>

        {/* Right (5 cols): Borderless Presence & Quick Links Dossier */}
        <dl className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-6 lg:pb-1">
          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              STATUS
            </dt>
            <dd className="mt-2 inline-flex items-center gap-2.5 text-xs sm:text-[13px] text-[var(--text-primary)]">
              <StatusPulseDot />
              <span>{t.hero.availability}</span>
            </dd>
          </div>

          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {language === "pt" ? "LOCALIZAÇÃO & HORÁRIO" : "LOCATION & TIME"}
            </dt>
            <dd className="mt-2">
              <LivePresenceTime />
            </dd>
          </div>

          <div className="sm:col-span-2 lg:col-span-1">
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {language === "pt" ? "CONEXÕES & CURRÍCULO" : "LINKS & RESUME"}
            </dt>
            <dd className="mt-2.5">
              <ProfileQuickLinks
                cvLabel={t.hero.ctaCv}
                className="gap-5 text-xs tracking-wider"
              />
            </dd>
          </div>
        </dl>
      </motion.div>
    </section>
  );
}

/**
 * Opção 2: 1 Coluna Compacta com Faixa de Metadados Dividida no Topo e Assinatura na Base.
 */
export function HeroCompactSplitPrototype() {
  const { t } = useLanguage();

  return (
    <section className="mx-auto w-full max-w-6xl px-6 pt-12 pb-12 sm:pt-16 sm:pb-16 md:px-10">
      <motion.div
        initial={{ opacity: 0, filter: "blur(8px)", y: 14 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Full-Width Split Top Metadata Bar */}
        <div className="mb-8 flex flex-wrap items-center justify-between gap-x-6 gap-y-2 border-b border-[var(--border-subtle)]/50 pb-4">
          <div className="inline-flex items-center gap-2.5">
            <StatusPulseDot />
            <span className="font-mono text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {t.hero.availability}
            </span>
          </div>

          <LivePresenceTime />
        </div>

        {/* Focused Editorial Statement */}
        <div className="max-w-3xl">
          <span className="mb-4 inline-block font-mono text-sm sm:text-base font-medium uppercase tracking-[0.22em] text-[var(--text-primary)]">
            {t.hero.name}
          </span>

          <h1 className="text-3xl sm:text-5xl md:text-[52px] font-medium tracking-[-0.03em] leading-[1.08] text-[var(--text-primary)]">
            {t.hero.headline}
            <br />
            <span className="font-editorial italic font-normal text-[var(--text-secondary)]">
              {t.hero.subheadline}
            </span>
          </h1>

          <p className="mt-6 max-w-2xl text-base sm:text-[17px] leading-relaxed text-[var(--text-secondary)]">
            {t.hero.description}
          </p>

          <div className="mt-8">
            <HeroActionButtons />
          </div>
        </div>

        {/* Bottom Signature Row */}
        <div className="mt-9 border-t border-[var(--border-subtle)]/50 pt-5">
          <ProfileQuickLinks
            cvLabel={t.hero.ctaCv}
            className="gap-6 text-xs tracking-wider"
          />
        </div>
      </motion.div>
    </section>
  );
}

