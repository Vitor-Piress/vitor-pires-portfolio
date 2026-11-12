import { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowUpRight } from 'lucide-react'
import { secondaryProjects } from '../../data/projects'
import { useLanguage } from '../../context/LanguageContext'
import { BlurReveal } from '../ui/BlurReveal'
import { SecondaryProjectVisual } from '../ui/ProjectVisuals'

export function SecondaryProjectsSection() {
  const { language, t } = useLanguage()
  const [hoveredSlug, setHoveredSlug] = useState<string | null>(null)

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-20 sm:py-28 md:px-10">
      <BlurReveal className="mb-12 max-w-2xl">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.projectsSection.secondaryLabel}
        </span>
        <p className="mt-3 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
          {t.projectsSection.secondarySubtitle}
        </p>
      </BlurReveal>

      {/* Single 3-Block Bento Grid with neighbor blur(2px) & hover summary reveal */}
      <div
        className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5"
        onMouseLeave={() => setHoveredSlug(null)}
      >
        {secondaryProjects.map((project, idx) => {
          const isHovered = hoveredSlug === project.slug
          const isDimmed = hoveredSlug !== null && !isHovered

          return (
            <BlurReveal key={project.slug} delay={idx * 0.08}>
              <div
                tabIndex={0}
                onMouseEnter={() => setHoveredSlug(project.slug)}
                onFocus={() => setHoveredSlug(project.slug)}
                onBlur={() => setHoveredSlug(null)}
                onClick={() =>
                  setHoveredSlug((prev) => (prev === project.slug ? null : project.slug))
                }
                style={{
                  filter: isDimmed ? 'blur(2px)' : 'blur(0px)',
                  opacity: isDimmed ? 0.45 : 1,
                }}
                className="bento-card flex h-full flex-col justify-between p-5 sm:p-6 outline-none transition-all duration-300"
              >
                <div>
                  {/* Category + Repo External Link */}
                  <div className="mb-4 flex items-center justify-between">
                    <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
                      {project.category[language]}
                    </span>

                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`${project.name} GitHub`}
                        onClick={(e) => e.stopPropagation()}
                        className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <span>GitHub</span>
                        <ArrowUpRight className="h-3 w-3" strokeWidth={1.8} />
                      </a>
                    )}
                  </div>

                  {/* Technical Schematic / Image */}
                  <SecondaryProjectVisual
                    slug={project.slug}
                    name={project.name}
                    image={project.image}
                  />

                  {/* Project Title */}
                  <h3 className="mt-5 font-editorial text-2xl leading-snug text-[var(--text-primary)]">
                    {project.name}
                  </h3>

                  {/* 1-Line Summary: crisp reveal on hover/focus (always accessible on small screens) */}
                  <motion.p
                    initial={false}
                    animate={{
                      opacity: isHovered ? 1 : 0.62,
                      filter: isHovered ? 'blur(0px)' : 'blur(0.4px)',
                      y: isHovered ? 0 : 2,
                    }}
                    transition={{ duration: 0.25, ease: 'easeOut' }}
                    className={`mt-2.5 text-xs sm:text-[13px] leading-relaxed transition-colors duration-200 ${
                      isHovered
                        ? 'text-[var(--text-primary)]'
                        : 'text-[var(--text-secondary)] md:opacity-55'
                    }`}
                  >
                    {project.summary[language]}
                  </motion.p>
                </div>

                {/* Tech Stack Metadata */}
                <div className="mt-6 flex flex-wrap gap-2 pt-2">
                  {project.stack.map((tech) => (
                    <span
                      key={tech}
                      className="rounded-[2px] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-muted)]"
                    >
                      {tech}
                    </span>
                  ))}
                </div>
              </div>
            </BlurReveal>
          )
        })}
      </div>
    </section>
  )
}
