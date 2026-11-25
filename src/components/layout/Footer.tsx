import { useState } from 'react'
import { ArrowUpRight, Check, Copy } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { PROFILE_LINKS } from '../../data/profile'
import { BlurReveal } from '../ui/BlurReveal'
import { ProfileQuickLinks } from '../ui/SocialIcons'

export function Footer() {
  const { t } = useLanguage()
  const [copied, setCopied] = useState(false)

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PROFILE_LINKS.email)
      setCopied(true)
      window.setTimeout(() => setCopied(false), 2600)
    } catch {
      window.location.href = `mailto:${PROFILE_LINKS.email}`
    }
  }

  return (
    <footer
      id="contact"
      className="mx-auto w-full max-w-6xl scroll-mt-20 px-6 pt-20 pb-[calc(6.5rem+env(safe-area-inset-bottom))] sm:pt-40 sm:pb-28 md:px-10"
    >
      {/* Centered Editorial Conversion Statement (cagd.as inspired) */}
      <BlurReveal className="mx-auto max-w-3xl text-center">
        <h2 className="font-editorial text-4xl sm:text-5xl md:text-6xl leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)]">
          {t.footer.headline}
        </h2>

        {/* Minimalist Underlined Conversion Links */}
        <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 sm:gap-10">
          <a
            href={PROFILE_LINKS.whatsapp}
            target="_blank"
            rel="noopener noreferrer"
            className="group inline-flex min-h-[44px] sm:min-h-0 items-center gap-1.5 text-sm sm:text-base text-[var(--text-primary)] underline underline-offset-8 decoration-[var(--text-muted)] hover:decoration-[var(--text-primary)] transition-colors"
          >
            <span>{t.footer.scheduleAction}</span>
            <ArrowUpRight
              className="h-4 w-4 text-[var(--text-secondary)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
              strokeWidth={1.75}
            />
          </a>

          <button
            type="button"
            onClick={handleCopyEmail}
            className="group cursor-pointer inline-flex min-h-[44px] sm:min-h-0 items-center gap-2 text-sm sm:text-base text-[var(--text-primary)] underline underline-offset-8 decoration-[var(--text-muted)] hover:decoration-[var(--text-primary)] transition-colors"
          >
            <span>{copied ? t.footer.emailCopied : t.footer.copyEmailAction}</span>
            {copied ? (
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
  )
}

/** Shared bottom signature, quick links (GitHub, LinkedIn, CV), and copyright bar. */
export function FooterBottomBar() {
  const { t } = useLanguage()

  return (
    <div className="mt-20 sm:mt-44 flex flex-col sm:flex-row items-center justify-between gap-4 text-center sm:text-left">
      <div className="font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        {t.footer.roleSignature}
      </div>

      <ProfileQuickLinks
        cvLabel="CV"
        className="justify-center gap-5 sm:gap-6 text-[11px] tracking-[0.12em]"
      />

      <div className="font-mono text-[10px] sm:text-[11px] tracking-wider text-[var(--text-muted)]">
        {t.footer.rights}
      </div>
    </div>
  )
}
