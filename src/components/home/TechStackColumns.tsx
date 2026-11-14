import { AppWindow, Server, Workflow, type LucideIcon } from 'lucide-react'
import { useLanguage } from '../../context/LanguageContext'
import type { StackItem, StackLayerId } from '../../i18n/translations'
import { BlurReveal } from '../ui/BlurReveal'

const STACK_LAYER_ICONS: Record<StackLayerId, LucideIcon> = {
  frontend: AppWindow,
  backend: Server,
  infra: Workflow,
}

/** Shared divided item list for architectural tech-stack column cards. */
export function TechStackItemList({ items }: { items: StackItem[] }) {
  return (
    <ul className="mt-7 divide-y divide-[var(--border-subtle)]/60">
      {items.map((item) => (
        <li
          key={item.name}
          className="flex items-center justify-between gap-3 py-3 first:pt-2 last:pb-0"
        >
          <span className="text-sm font-medium text-[var(--text-primary)]">
            {item.name}
          </span>
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] text-right">
            {item.category}
          </span>
        </li>
      ))}
    </ul>
  )
}

/** 3-column architectural Tech Stack grid with inline layer icons in the meta header. */
export function TechStackColumns({ className = '' }: { className?: string }) {
  const { t } = useLanguage()

  return (
    <div
      className={`grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch ${className}`.trim()}
    >
      {t.editorial.stackGroups.map((group, idx) => {
        const Icon = STACK_LAYER_ICONS[group.id]

        return (
          <BlurReveal key={group.id} delay={idx * 0.08} className="h-full">
            <div className="bento-card flex h-full flex-col justify-between p-6 sm:p-7 border border-transparent hover:border-[var(--border-subtle)] transition-colors">
              <div>
                <div className="flex items-center justify-between gap-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <Icon
                      aria-hidden="true"
                      className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]"
                      strokeWidth={1.75}
                    />
                    <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] truncate">
                      {group.indexLabel} · {group.layerCode}
                    </span>
                  </div>

                  <span className="font-mono text-[10px] text-[var(--text-muted)] opacity-55 tabular-nums shrink-0">
                    {String(group.items.length).padStart(2, '0')}
                  </span>
                </div>

                <h3 className="mt-3 text-lg sm:text-[19px] font-medium tracking-[-0.01em] text-[var(--text-primary)]">
                  {group.title}
                </h3>

                <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                  {group.subtitle}
                </p>
              </div>

              <TechStackItemList items={group.items} />
            </div>
          </BlurReveal>
        )
      })}
    </div>
  )
}
