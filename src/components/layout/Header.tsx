import { useState } from 'react'
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion'
import { Moon, Sun } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { useTheme } from '../../context/ThemeContext'
import { scrollToElement, scrollToTopSmooth } from '../../utils/scroll'

export function Header() {
  const { language, setLanguage, t } = useLanguage()
  const { theme, toggleTheme } = useTheme()
  const { scrollY } = useScroll()
  const [showBrandInHeader, setShowBrandInHeader] = useState(false)

  useMotionValueEvent(scrollY, 'change', (latest) => {
    const shouldShow = latest > 130
    if (shouldShow !== showBrandInHeader) {
      setShowBrandInHeader(shouldShow)
    }
  })

  const scrollToTop = () => {
    scrollToTopSmooth()
  }

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
        showBrandInHeader
          ? 'bg-[var(--bg-primary)]/80 backdrop-blur-md'
          : 'bg-transparent'
      }`}
    >
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-6 md:px-10">
        {/* Left: Dynamic VITOR PIRES wordmark (Breeder concept) */}
        <div className="flex min-w-[130px] items-center">
          <AnimatePresence initial={false}>
            {showBrandInHeader && (
              <motion.button
                key="header-wordmark"
                type="button"
                onClick={scrollToTop}
                initial={{ opacity: 0, y: 12, filter: 'blur(6px)' }}
                animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
                exit={{ opacity: 0, y: 10, filter: 'blur(6px)' }}
                transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                className="cursor-pointer font-mono text-xs font-medium tracking-[0.18em] uppercase text-[var(--text-primary)] hover:opacity-75 transition-opacity"
              >
                {t.hero.name}
              </motion.button>
            )}
          </AnimatePresence>
        </div>

        {/* Right: Discrete navigation + PT/EN + Dark/Light */}
        <nav
          aria-label="Primary Navigation"
          className="flex items-center gap-5 sm:gap-7"
        >
          <div className="flex items-center gap-4 sm:gap-6 text-xs sm:text-[13px] text-[var(--text-secondary)]">
            <button
              type="button"
              onClick={() => scrollToElement('projects', 78)}
              className="cursor-pointer hover:text-[var(--text-primary)] transition-colors"
            >
              {t.nav.projects}
            </button>
            <button
              type="button"
              onClick={() => scrollToElement('trajectory', 78)}
              className="cursor-pointer hover:text-[var(--text-primary)] transition-colors"
            >
              {t.nav.trajectory}
            </button>
            <button
              type="button"
              onClick={() => scrollToElement('contact', 78)}
              className="cursor-pointer hover:text-[var(--text-primary)] transition-colors"
            >
              {t.nav.contact}
            </button>
          </div>

          {/* Controls: Language PT/EN & Theme toggle */}
          <div className="flex items-center gap-3 pl-1">
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
          </div>
        </nav>
      </div>
    </header>
  )
}
