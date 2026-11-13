import { featuredProjects } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'
import { BlurReveal } from '../ui/BlurReveal'
import { EditorialBentoShowcase } from './EditorialBentoShowcase'

export function FeaturedProjectsSection() {
  const { t } = useLanguage()

  return (
    <section
      id="projects"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-16 sm:py-24 md:px-10"
    >
      <BlurReveal className="mb-16 sm:mb-24">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.featuredLabel}
        </span>
      </BlurReveal>

      {/* Generous negative space between featured showcases — zero divider lines */}
      <div className="flex flex-col gap-28 sm:gap-36 lg:gap-44">
        {featuredProjects.map((project, index) => (
          <BlurReveal key={project.slug}>
            <EditorialBentoShowcase project={project} index={index} />
          </BlurReveal>
        ))}
      </div>
    </section>
  )
}
