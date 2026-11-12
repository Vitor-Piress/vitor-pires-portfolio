import { Link } from 'react-router-dom'
import { ArrowRight, ArrowUpRight } from 'lucide-react'
import { featuredProjects, type FeaturedProject } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'
import { BlurReveal } from '../ui/BlurReveal'
import { ProjectLogo } from '../ui/ProjectVisuals'
import { ProjectBentoShowcase } from './ProjectBentoShowcase'
import { ProjectHeroTabsShowcase } from './ProjectHeroTabsShowcase'

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
        {featuredProjects.map((project) => (
          <FeaturedProjectItem key={project.slug} project={project} />
        ))}
      </div>
    </section>
  )
}

function FeaturedProjectItem({ project }: { project: FeaturedProject }) {
  const { language, t } = useLanguage()

  return (
    <article className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start">
      {/* Left Column: Context & Metadata floating directly on the deep background */}
      <BlurReveal className="lg:col-span-5 flex flex-col">
        {/* Official Identity / Logo */}
        <div className="mb-6">
          <ProjectLogo
            slug={project.slug}
            name={project.name}
            logo={project.logo}
          />
        </div>

        {/* Large Editorial Serif Headline (cagd.as style) */}
        <h2 className="font-editorial text-3xl sm:text-[36px] leading-[1.14] tracking-[-0.01em] text-[var(--text-primary)]">
          {project.headline[language]}
        </h2>

        {/* Short Product Summary */}
        <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
          {project.summary[language]}
        </p>

        {/* Action Links: View Project Details → & Live Website ↗ */}
        <div className="mt-7 flex flex-wrap items-center gap-6">
          <Link
            to={`/project/${project.slug}`}
            className="group inline-flex items-center gap-2 text-sm font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--text-primary)] transition-colors"
          >
            <span>{t.projectsSection.viewDetails}</span>
            <ArrowRight
              className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5"
              strokeWidth={1.8}
            />
          </Link>

          {project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{t.projectsSection.liveWebsite}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </a>
          ) : project.repoUrl ? (
            <a
              href={project.repoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{t.projectsSection.repository}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </a>
          ) : (
            <Link
              to={`/project/${project.slug}`}
              className="group inline-flex items-center gap-1.5 text-sm text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{t.projectsSection.liveWebsite}</span>
              <ArrowUpRight
                className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                strokeWidth={1.8}
              />
            </Link>
          )}
        </div>

        {/* Borderless Two-Column Metadata Grid (Maxus Capital / cagd.as layout) */}
        <dl className="mt-10 grid grid-cols-2 gap-x-8 gap-y-6">
          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.categoryClient}
            </dt>
            <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
              {project.category[language]}
            </dd>
          </div>

          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.role}
            </dt>
            <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
              {project.role[language]}
            </dd>
          </div>

          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.year}
            </dt>
            <dd className="mt-1.5 font-mono text-xs sm:text-[13px] text-[var(--text-primary)]">
              {project.year}
            </dd>
          </div>

          <div>
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.stack}
            </dt>
            <dd className="mt-1.5 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
              {project.stack.join(' · ')}
            </dd>
          </div>
        </dl>

        {/* DETAILS Architectural Block */}
        <div className="mt-7">
          <h3 className="font-mono-meta text-[10px] text-[var(--text-muted)]">
            {t.projectsSection.meta.details}
          </h3>
          <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
            {project.details[language]}
          </p>
        </div>
      </BlurReveal>

      {/* Right Column: Hero Stage com Tabs (para projetos com prints reais) ou Bento (wireframes) */}
      <BlurReveal delay={0.12} className="lg:col-span-7 w-full">
        {project.gallery && project.gallery.length > 0 ? (
          <ProjectHeroTabsShowcase project={project} />
        ) : (
          <ProjectBentoShowcase
            projectSlug={project.slug}
            blocks={project.bento}
          />
        )}
      </BlurReveal>
    </article>
  )
}
