import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { FeaturedProjectsSection } from '../components/home/FeaturedProjectsSection'
import { SecondaryProjectsSection } from '../components/home/SecondaryProjectsSection'
import { EditorialSection } from '../components/home/EditorialSection'
import { useLanguage } from '../context/LanguageContext'
import { useRestoreReturnScroll } from '../utils/returnNavigation'

export function Home() {
  useRestoreReturnScroll()
  const { t } = useLanguage()

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <a href="#main-content" className="skip-link">
        {t.nav.skipToContent}
      </a>

      <Header />

      <main id="main-content" tabIndex={-1} className="focus:outline-none">
        <HeroSection />
        <FeaturedProjectsSection />
        <SecondaryProjectsSection />
        <EditorialSection />
      </main>

      <Footer />
    </div>
  )
}

export default Home
