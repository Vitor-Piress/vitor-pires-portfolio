import { useEffect, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useScroll,
} from "framer-motion";
import { ArrowUpRight, Menu, Moon, Sun, X } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import { useTheme } from "../../context/ThemeContext";
import { scrollToElement, scrollToTopSmooth } from "../../utils/scroll";
import { ProfileQuickLinks } from "../ui/SocialIcons";

export function Header() {
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { scrollY } = useScroll();
  const [showBrandInHeader, setShowBrandInHeader] = useState(
    () => typeof window !== "undefined" && window.scrollY > 130,
  );
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const triggerBtnRef = useRef<HTMLButtonElement | null>(null);
  const drawerRef = useRef<HTMLElement | null>(null);
  const skipFocusRestoreRef = useRef(false);

  useEffect(() => {
    const rafId = window.requestAnimationFrame(() => {
      setShowBrandInHeader(window.scrollY > 130);
    });
    return () => window.cancelAnimationFrame(rafId);
  }, []);

  useMotionValueEvent(scrollY, "change", (latest) => {
    const shouldShow = latest > 130;
    if (shouldShow !== showBrandInHeader) {
      setShowBrandInHeader(shouldShow);
    }
  });

  useEffect(() => {
    if (!mobileMenuOpen) return;

    const prevOverflow = document.body.style.overflow;
    const triggerEl = triggerBtnRef.current;
    document.body.style.overflow = "hidden";

    const getFocusable = () => {
      if (!drawerRef.current) return [];
      return Array.from(
        drawerRef.current.querySelectorAll<HTMLElement>(
          'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((el) => !el.hasAttribute("disabled"));
    };

    const rafFocus = window.requestAnimationFrame(() => {
      const focusable = getFocusable();
      focusable[0]?.focus();
    });

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setMobileMenuOpen(false);
        return;
      }
      if (e.key !== "Tab") return;

      const focusable = getFocusable();
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];

      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    const handleResize = () => {
      if (window.innerWidth >= 640) {
        setMobileMenuOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("resize", handleResize);

    return () => {
      window.cancelAnimationFrame(rafFocus);
      document.body.style.overflow = prevOverflow;
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("resize", handleResize);
      if (!skipFocusRestoreRef.current) {
        triggerEl?.focus();
      }
      skipFocusRestoreRef.current = false;
    };
  }, [mobileMenuOpen]);

  const navItems = [
    { id: "projects", index: "01", label: t.nav.projects, offset: 78 },
    { id: "trajectory", index: "02", label: t.nav.trajectory, offset: 78 },
    { id: "tech", index: "03", label: t.nav.tech, offset: 78 },
    { id: "contact", index: "04", label: t.nav.contact, offset: 78 },
  ] as const;

  const scrollToTop = () => {
    scrollToTopSmooth();
  };

  const handleMobileNavigate = (id: string, offset: number) => {
    // Release body lock before scheduling smooth scroll so mobile Safari/Chrome
    // never blocks programmatic scrolling when closing the drawer.
    skipFocusRestoreRef.current = true;
    document.body.style.overflow = "";
    setMobileMenuOpen(false);
    window.requestAnimationFrame(() => {
      scrollToElement(id, offset);
    });
  };

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-40 transition-colors duration-300 ${
          showBrandInHeader
            ? "bg-[var(--bg-primary)]/80 backdrop-blur-md"
            : "bg-transparent"
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
                  initial={{ opacity: 0, y: 12, filter: "blur(6px)" }}
                  animate={{ opacity: 1, y: 0, filter: "blur(0px)" }}
                  exit={{ opacity: 0, y: 10, filter: "blur(6px)" }}
                  transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
                  className="cursor-pointer font-mono text-xs font-medium tracking-[0.18em] uppercase text-[var(--text-primary)] hover:opacity-75 transition-opacity"
                >
                  {t.hero.name}
                </motion.button>
              )}
            </AnimatePresence>
          </div>

          {/* Right: Desktop Navigation + PT/EN + Dark/Light + Mobile Menu Trigger */}
          <nav
            aria-label="Primary Navigation"
            className="flex items-center gap-4 sm:gap-7"
          >
            <div className="hidden sm:flex items-center gap-6 text-[13px] text-[var(--text-secondary)]">
              {navItems.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => scrollToElement(item.id, item.offset)}
                  className="cursor-pointer hover:text-[var(--text-primary)] transition-colors"
                >
                  {item.label}
                </button>
              ))}
            </div>

            {/* Controls: Language PT/EN & Theme toggle */}
            <div className="flex items-center gap-1.5 sm:gap-3 sm:pl-1">
              <div
                role="group"
                aria-label="Language selector"
                className="inline-flex items-center gap-0.5 sm:gap-1 font-mono text-[11px] tracking-wider"
              >
                <button
                  type="button"
                  onClick={() => setLanguage("pt")}
                  className={`cursor-pointer inline-flex min-h-[44px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center px-1.5 sm:px-1 py-1 sm:py-0.5 transition-colors ${
                    language === "pt"
                      ? "font-medium text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  PT
                </button>
                <span className="text-[var(--text-muted)] opacity-40">/</span>
                <button
                  type="button"
                  onClick={() => setLanguage("en")}
                  className={`cursor-pointer inline-flex min-h-[44px] min-w-[32px] sm:min-h-0 sm:min-w-0 items-center justify-center px-1.5 sm:px-1 py-1 sm:py-0.5 transition-colors ${
                    language === "en"
                      ? "font-medium text-[var(--text-primary)]"
                      : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                  }`}
                >
                  EN
                </button>
              </div>

              <button
                type="button"
                onClick={toggleTheme}
                aria-label={
                  theme === "dark"
                    ? "Switch to light mode"
                    : "Switch to dark mode"
                }
                className="cursor-pointer inline-flex h-11 w-11 sm:h-7 sm:w-7 items-center justify-center rounded-full text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-bento)] transition-colors"
              >
                {theme === "dark" ? (
                  <Sun className="h-4 w-4 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />
                ) : (
                  <Moon className="h-4 w-4 sm:h-3.5 sm:w-3.5" strokeWidth={1.75} />
                )}
              </button>

              {/* Mobile Hamburger Drawer Trigger (< 640px) */}
              <button
                ref={triggerBtnRef}
                type="button"
                onClick={() => setMobileMenuOpen((prev) => !prev)}
                aria-expanded={mobileMenuOpen}
                aria-controls="mobile-nav-drawer"
                aria-label={
                  mobileMenuOpen
                    ? language === "pt"
                      ? "Fechar menu de navegação"
                      : "Close navigation menu"
                    : language === "pt"
                      ? "Abrir menu de navegação"
                      : "Open navigation menu"
                }
                className="sm:hidden cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-[3px] text-[var(--text-primary)] hover:bg-[var(--bg-bento-elevated)] transition-colors"
              >
                {mobileMenuOpen ? (
                  <X className="h-4 w-4" strokeWidth={1.75} />
                ) : (
                  <Menu className="h-4 w-4" strokeWidth={1.75} />
                )}
              </button>
            </div>
          </nav>
        </div>
      </header>

      {/* Mobile side navigation drawer (< 640px) outside <header> so backdrop-blur does not clip fixed inset */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            key="mobile-drawer-backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.22 }}
            onClick={() => setMobileMenuOpen(false)}
            className="fixed inset-0 z-50 flex justify-end bg-black/65 backdrop-blur-xs sm:hidden"
          >
            <motion.aside
              ref={drawerRef}
              id="mobile-nav-drawer"
              role="dialog"
              aria-modal="true"
              aria-label={
                language === "pt" ? "Menu de navegação" : "Navigation menu"
              }
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              onClick={(e) => e.stopPropagation()}
              className="flex h-full w-[min(82vw,320px)] flex-col justify-between border-l border-[var(--border-subtle)] bg-[var(--bg-primary)] px-6 py-5 shadow-2xl"
            >
              {/* Top Row: Menu label + Close */}
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)]/70 pb-4">
                <span className="font-mono text-[10px] uppercase tracking-[0.18em] text-[var(--text-muted)]">
                  / {language === "pt" ? "Navegação" : "Navigation"}
                </span>
                <button
                  type="button"
                  onClick={() => setMobileMenuOpen(false)}
                  aria-label={language === "pt" ? "Fechar menu" : "Close menu"}
                  className="cursor-pointer inline-flex h-11 w-11 items-center justify-center rounded-[3px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                >
                  <X className="h-4 w-4" strokeWidth={1.75} />
                </button>
              </div>

              {/* Center Navigation Stack in Semantic Order */}
              <nav
                aria-label="Mobile Navigation"
                className="my-auto flex flex-col divide-y divide-[var(--border-subtle)]/70"
              >
                {navItems.map((item, idx) => (
                  <motion.button
                    key={item.id}
                    type="button"
                    initial={{ opacity: 0, x: 16 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{
                      duration: 0.25,
                      delay: 0.05 + idx * 0.04,
                      ease: [0.22, 1, 0.36, 1],
                    }}
                    onClick={() => handleMobileNavigate(item.id, item.offset)}
                    className="group cursor-pointer flex items-center justify-between py-4 text-left transition-colors"
                  >
                    <div className="flex items-baseline gap-3.5">
                      <span className="font-mono text-[10px] tabular-nums text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-colors">
                        {item.index}
                      </span>
                      <span className="font-editorial text-2xl tracking-[-0.01em] text-[var(--text-secondary)] group-hover:text-[var(--text-primary)] transition-colors">
                        {item.label}
                      </span>
                    </div>
                    <ArrowUpRight
                      className="h-4 w-4 text-[var(--text-muted)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-[var(--text-primary)]"
                      strokeWidth={1.6}
                    />
                  </motion.button>
                ))}
              </nav>

              {/* Drawer Footer: Profile Quick Links + Signature */}
              <div className="space-y-4 border-t border-[var(--border-subtle)]/70 pt-5">
                <ProfileQuickLinks
                  cvLabel={t.hero.ctaCv}
                  className="justify-between gap-3 text-[10.5px] tracking-[0.12em]"
                />
                <div className="font-mono text-[9.5px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {t.footer.roleSignature}
                </div>
              </div>
            </motion.aside>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
