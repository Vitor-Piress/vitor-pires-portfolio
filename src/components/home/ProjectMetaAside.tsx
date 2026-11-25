import { Layers } from "lucide-react";
import type { FeaturedProject } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";

interface ProjectMetaAsideProps {
  project: FeaturedProject;
  index: number;
  className?: string;
}

/**
 * Compact editorial specification aside rendered next to a featured project's
 * presentation on Home (`/`). Keeps metadata scannable (Category, Role, Year,
 * Stack) while leaving long-form details on `/project/:slug`.
 */
export function ProjectMetaAside({
  project,
  index,
  className = "",
}: ProjectMetaAsideProps) {
  const { language, t } = useLanguage();
  const indexLabel = String(index + 1).padStart(2, "0");

  return (
    <aside
      aria-label={
        language === "pt"
          ? `Ficha técnica de ${project.name}`
          : `${project.name} technical specifications`
      }
      className={`bento-card flex h-full flex-col justify-between rounded-[3px] border border-[var(--border-subtle)]/80 p-5 sm:p-6 ${className}`.trim()}
    >
      {/* Top Spec Header */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)]/70 pb-3">
        <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Layers className="h-3 w-3 shrink-0" strokeWidth={1.75} />
          <span className="tabular-nums">{indexLabel}</span>
          <span aria-hidden="true" className="opacity-45">
            ·
          </span>
          <span>{language === "pt" ? "Ficha Técnica" : "Project Spec"}</span>
        </span>

        {project.appDomain && (
          <span className="truncate font-mono text-[10px] text-[var(--text-muted)] opacity-80">
            {project.appDomain}
          </span>
        )}
      </div>

      {/* Structured Spec Rows: Category, Role + Year, Stack */}
      <dl className="flex flex-1 flex-col justify-between divide-y divide-[var(--border-subtle)]/60">
        {/* Category / Client */}
        <div className="py-3.5">
          <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
            {t.projectsSection.meta.categoryClient}
          </dt>
          <dd className="mt-1 text-xs sm:text-[13px] font-medium leading-snug text-[var(--text-primary)]">
            {project.category[language]}
          </dd>
        </div>

        {/* Role + Year */}
        <div className="grid grid-cols-[minmax(0,1fr)_auto] items-start gap-4 py-3.5">
          <div className="min-w-0">
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.role}
            </dt>
            <dd className="mt-1 text-xs sm:text-[13px] leading-snug text-[var(--text-primary)]">
              {project.role[language]}
            </dd>
          </div>

          <div className="text-right">
            <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.year}
            </dt>
            <dd className="mt-1 font-mono text-xs sm:text-[13px] tabular-nums text-[var(--text-primary)]">
              {project.year}
            </dd>
          </div>
        </div>

        {/* Tech Stack Chips */}
        <div className="pt-3.5">
          <dt className="font-mono-meta text-[10px] text-[var(--text-muted)]">
            {t.projectsSection.meta.stack}
          </dt>
          <dd className="mt-2 flex flex-wrap gap-1.5">
            {project.stack.map((tech) => (
              <span
                key={tech}
                className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]"
              >
                {tech}
              </span>
            ))}
          </dd>
        </div>
      </dl>
    </aside>
  );
}
