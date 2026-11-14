import { Link } from 'react-router-dom'
import { ArrowUpRight } from 'lucide-react'
import type { TimelineItem } from '../../i18n/translations'
import { useLanguage } from '../../context/LanguageContext'
import { BlurReveal } from '../ui/BlurReveal'
import { TechStackColumns } from './TechStackColumns'

export function EditorialSection() {
  const { t } = useLanguage()

  return (
    <section
      id="trajectory"
      className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 py-24 sm:py-32 md:px-10"
    >
      {/* 1. Chronology: Professional Experience & Education */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-20">
        <BlurReveal>
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.editorial.experienceLabel}
          </span>
          <div className="mt-10">
            <TimelineList items={t.editorial.experienceItems} />
          </div>
        </BlurReveal>

        <BlurReveal delay={0.1}>
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.editorial.educationLabel}
          </span>
          <div className="mt-10">
            <TimelineList items={t.editorial.educationItems} />
          </div>
        </BlurReveal>
      </div>

      {/* 2. Technical Arsenal (Stack) */}
      <div id="tech" className="mt-28 sm:mt-36 scroll-mt-24">
        <BlurReveal>
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.editorial.stackLabel}
          </span>
        </BlurReveal>

        <TechStackColumns className="mt-10" />
      </div>

      {/* 3. Goals & Strategic Direction */}
      <BlurReveal className="mt-28 sm:mt-36 max-w-3xl">
        <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
          {t.editorial.goalsLabel}
        </span>
        <h2 className="mt-6 font-editorial text-3xl sm:text-4xl md:text-[42px] leading-[1.15] tracking-[-0.01em] text-[var(--text-primary)]">
          {t.editorial.goalsTitle}
        </h2>
        <div className="mt-7 space-y-5 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
          {t.editorial.goalsParagraphs.map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </BlurReveal>

      {/* 4. Credibility & Real-World Production Impact (SPEC §4.6) */}
      <div className="mt-28 sm:mt-36">
        <BlurReveal className="max-w-2xl">
          <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
            {t.credibility.label}
          </span>
          <h2 className="mt-4 font-editorial text-3xl sm:text-4xl leading-[1.15] text-[var(--text-primary)]">
            {t.credibility.title}
          </h2>
        </BlurReveal>

        <div className="mt-10 grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5">
          {t.credibility.items.map((item, idx) => (
            <BlurReveal key={item.id} delay={idx * 0.08}>
              <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-7">
                <div>
                  {/* Production Metric Highlight */}
                  <div className="inline-block rounded-[2px] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-primary)]">
                    {item.metric}
                  </div>

                  {/* Quote */}
                  <p className="mt-5 text-sm leading-relaxed text-[var(--text-secondary)]">
                    “{item.quote}”
                  </p>
                </div>

                {/* Attribution */}
                <div className="mt-8 pt-2">
                  <Link
                    to={`/project/${item.projectSlug}`}
                    className="group inline-flex items-center gap-1.5 text-xs font-medium text-[var(--text-primary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:decoration-[var(--text-primary)] transition-colors"
                  >
                    <span>{item.project}</span>
                    <ArrowUpRight
                      className="h-3 w-3 text-[var(--text-muted)] group-hover:text-[var(--text-primary)] transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                      strokeWidth={1.8}
                    />
                  </Link>
                  <div className="mt-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                    {item.author} · {item.role}
                  </div>
                </div>
              </div>
            </BlurReveal>
          ))}
        </div>
      </div>
    </section>
  )
}

function TimelineList({ items }: { items: TimelineItem[] }) {
  return (
    <div className="relative space-y-10">
      {items.map((item, index) => {
        const isLast = index === items.length - 1

        return (
          <div key={`${item.role}-${item.period}`} className="relative flex gap-5">
            {/* Circular Marker (● current / ○ past) + subtle vertical connector */}
            <div className="relative flex flex-col items-center pt-1">
              <span
                aria-hidden="true"
                className="font-mono text-xs leading-none text-[var(--text-primary)] select-none"
              >
                {item.isCurrent ? '●' : '○'}
              </span>
              {!isLast && (
                <span
                  aria-hidden="true"
                  className="mt-2 w-px flex-1 bg-[var(--border-subtle)]"
                />
              )}
            </div>

            {/* Content */}
            <div className={isLast ? 'pb-0' : 'pb-2'}>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                {item.period}
              </span>
              <h3 className="mt-1.5 text-base sm:text-[17px] font-medium leading-snug text-[var(--text-primary)]">
                {item.role}
              </h3>
              <div className="mt-0.5 text-xs sm:text-[13px] text-[var(--text-muted)]">
                {item.organization}
              </div>
              <p className="mt-3 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                {item.description}
              </p>
            </div>
          </div>
        )
      })}
    </div>
  )
}
