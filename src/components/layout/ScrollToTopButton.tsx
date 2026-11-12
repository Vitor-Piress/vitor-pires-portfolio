import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { ArrowUp } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import { scrollToTopSmooth } from '../../utils/scroll'

/**
 * Modern, monochromatic "Scroll to Top" button (matching upclose.studio / breeder design).
 * - Appears only when the user scrolls near or reaches the bottom of the page.
 * - Smoothly glides back to top using the project's rAF cubic-bezier easing.
 * - Sits at bottom-right (z-40) avoiding conflict with the centered MiniAudioPlayer (z-50).
 */
export function ScrollToTopButton() {
  const { t } = useLanguage()
  const { pathname } = useLocation()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    let ticking = false

    const checkScrollBottom = () => {
      const scrollY = window.scrollY || document.documentElement.scrollTop
      const windowHeight = window.innerHeight
      const fullHeight = document.documentElement.scrollHeight

      // Distance remaining to the absolute bottom of the document
      const distanceFromBottom = fullHeight - (scrollY + windowHeight)

      // Only reveal when scrolled significantly (scrollY > 300) and within 360px of the page bottom
      const isAtBottom = distanceFromBottom <= 360 && scrollY > 300

      setIsVisible(isAtBottom)
      ticking = false
    }

    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(checkScrollBottom)
        ticking = true
      }
    }

    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll, { passive: true })

    // Initial check
    checkScrollBottom()

    return () => {
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [pathname])

  const handleScrollToTop = () => {
    scrollToTopSmooth()
  }

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.button
          type="button"
          onClick={handleScrollToTop}
          aria-label={t.footer.scrollToTop}
          title={t.footer.scrollToTop}
          initial={{ opacity: 0, y: 16, scale: 0.9, filter: 'blur(4px)' }}
          animate={{ opacity: 1, y: 0, scale: 1, filter: 'blur(0px)' }}
          exit={{ opacity: 0, y: 12, scale: 0.9, filter: 'blur(4px)' }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="group fixed bottom-5 right-4 sm:bottom-6 sm:right-8 z-40 flex h-8 w-8 sm:h-9 sm:w-auto items-center justify-center sm:px-3.5 gap-2 rounded-full border border-[var(--border-subtle)] bg-[#F0F0F2]/90 dark:bg-[#0D0D0D]/90 text-[var(--text-secondary)] shadow-sm backdrop-blur-md hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] hover:shadow-md transition-colors duration-200 cursor-pointer active:scale-95 select-none focus:outline-none focus-visible:ring-1 focus-visible:ring-[var(--text-primary)]"
        >
          <ArrowUp
            className="h-3.5 w-3.5 transition-transform duration-200 group-hover:-translate-y-0.5"
            strokeWidth={2}
          />
          <span className="hidden sm:inline font-mono text-[10px] sm:text-[11px] uppercase tracking-[0.14em]">
            {t.footer.scrollToTop}
          </span>
        </motion.button>
      )}
    </AnimatePresence>
  )
}
