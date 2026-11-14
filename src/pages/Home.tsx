import { Header } from '../components/layout/Header'
import { Footer } from '../components/layout/Footer'
import { HeroSection } from '../components/home/HeroSection'
import { FeaturedProjectsSection } from '../components/home/FeaturedProjectsSection'
import { SecondaryProjectsSection } from '../components/home/SecondaryProjectsSection'
import { EditorialSection } from '../components/home/EditorialSection'
import { useRestoreReturnScroll } from '../utils/returnNavigation'

export function Home() {
  useRestoreReturnScroll()

  return (
    <div className="min-h-svh bg-[var(--bg-primary)] text-[var(--text-primary)]">
      <Header />

      <main>
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
