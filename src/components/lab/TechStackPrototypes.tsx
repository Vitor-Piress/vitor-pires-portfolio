import { useState } from "react";
import { motion } from "framer-motion";
import {
  AppWindow,
  Check,
  Cloud,
  CloudCog,
  Database,
  LayoutTemplate,
  Monitor,
  PanelsTopLeft,
  Server,
  Terminal,
  Workflow,
  type LucideIcon,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";
import type {
  StackGroup,
  StackItem,
  StackLayerId,
} from "../../i18n/translations";
import { TechStackItemList } from "../home/TechStackColumns";

export type StackVariantId =
  | "columns-3"
  | "editorial-rows"
  | "grouped-bento"
  | "current";

function StackBentoTile({ item, badge }: { item: StackItem; badge?: string }) {
  return (
    <div className="bento-card flex flex-col justify-between p-4 sm:p-5 h-full border border-transparent hover:border-[var(--border-subtle)] transition-colors">
      <div className="flex items-start justify-between gap-2">
        <span className="text-sm sm:text-[15px] font-medium text-[var(--text-primary)]">
          {item.name}
        </span>
        {badge && (
          <span
            aria-hidden="true"
            className="font-mono text-[10px] text-[var(--text-muted)] opacity-55 tabular-nums pt-0.5"
          >
            {badge}
          </span>
        )}
      </div>
      <span className="mt-4 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {item.category}
      </span>
    </div>
  );
}

/**
 * Unified Tech Stack prototyping stage for `/lab`.
 */
export function TechStackPrototypeStage({
  variant,
}: {
  variant: StackVariantId;
}) {
  const { t } = useLanguage();
  const { stackGroups, stackItems } = t.editorial;

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-12 sm:py-16 md:px-10">
      <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
        {t.editorial.stackLabel}
      </span>

      <motion.div
        key={variant}
        initial={{ opacity: 0, filter: "blur(6px)", y: 8 }}
        animate={{ opacity: 1, filter: "blur(0px)", y: 0 }}
        transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
        className="mt-10"
      >
        {variant === "columns-3" && (
          <ColumnsArchitecturalVariant groups={stackGroups} />
        )}
        {variant === "editorial-rows" && (
          <EditorialRowsVariant groups={stackGroups} />
        )}
        {variant === "grouped-bento" && (
          <GroupedBentoVariant groups={stackGroups} />
        )}
        {variant === "current" && <CurrentFlatGridVariant items={stackItems} />}
      </motion.div>
    </section>
  );
}

type StackIconPresetId =
  | "architecture"
  | "panels-server"
  | "cloud-pipeline"
  | "edge-cloud"
  | "showcase-sync"
  | "none";

type StackIconPlacement = "badge" | "meta-inline" | "title-inline";

interface StackIconEntry {
  icon: LucideIcon;
  name: string;
}

interface StackIconPreset {
  id: StackIconPresetId;
  label: string;
  tag: string;
  icons: Record<StackLayerId, StackIconEntry> | null;
}

const STACK_ICON_PRESETS: StackIconPreset[] = [
  {
    id: "architecture",
    label: "1 · Arquitetura",
    tag: "Alternativa",
    icons: {
      frontend: { icon: LayoutTemplate, name: "LayoutTemplate" },
      backend: { icon: Database, name: "Database" },
      infra: { icon: Terminal, name: "Terminal" },
    },
  },
  {
    id: "panels-server",
    label: "2 · Painéis & API",
    tag: "Editorial",
    icons: {
      frontend: { icon: PanelsTopLeft, name: "PanelsTopLeft" },
      backend: { icon: Server, name: "Server" },
      infra: { icon: Terminal, name: "Terminal" },
    },
  },
  {
    id: "cloud-pipeline",
    label: "3 · Cloud & CI/CD",
    tag: "Ativo na Home",
    icons: {
      frontend: { icon: AppWindow, name: "AppWindow" },
      backend: { icon: Server, name: "Server" },
      infra: { icon: Workflow, name: "Workflow" },
    },
  },
  {
    id: "edge-cloud",
    label: "4 · App & Nuvem",
    tag: "Edge",
    icons: {
      frontend: { icon: AppWindow, name: "AppWindow" },
      backend: { icon: Server, name: "Server" },
      infra: { icon: Cloud, name: "Cloud" },
    },
  },
  {
    id: "showcase-sync",
    label: "5 · Sync Projetos",
    tag: "Consistente",
    icons: {
      frontend: { icon: Monitor, name: "Monitor" },
      backend: { icon: Database, name: "Database" },
      infra: { icon: CloudCog, name: "CloudCog" },
    },
  },
  {
    id: "none",
    label: "Sem ícones",
    tag: "Base",
    icons: null,
  },
];

const STACK_ICON_PLACEMENTS: {
  id: StackIconPlacement;
  label: string;
  hint: string;
}[] = [
  {
    id: "badge",
    label: "Badge topo",
    hint: "Caixa 32×32 sutil alinhada à direita",
  },
  {
    id: "meta-inline",
    label: "Inline no meta",
    hint: "Ícone solto ao lado de 01 · CLIENT",
  },
  {
    id: "title-inline",
    label: "Junto ao título",
    hint: "Ícone solto à esquerda do título",
  },
];

function formatPresetIconNames(preset: StackIconPreset): string {
  if (!preset.icons) return "Somente tipografia";
  return `${preset.icons.frontend.name} · ${preset.icons.backend.name} · ${preset.icons.infra.name}`;
}

function StackColumnHeader({
  group,
  iconEntry,
  placement,
  compact = false,
}: {
  group: StackGroup;
  iconEntry?: StackIconEntry | null;
  placement: StackIconPlacement;
  compact?: boolean;
}) {
  const Icon = iconEntry?.icon ?? null;
  const itemCount = String(group.items.length).padStart(2, "0");
  const layerLabel = `${group.indexLabel} · ${group.layerCode}`;
  const HeadingTag = compact ? "span" : "h3";

  return (
    <div>
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2 min-w-0">
          {Icon && placement === "meta-inline" && (
            <Icon
              aria-hidden="true"
              className="h-3.5 w-3.5 shrink-0 text-[var(--text-secondary)]"
              strokeWidth={1.75}
            />
          )}
          <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)] truncate">
            {layerLabel}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span
            className={`font-mono text-[10px] text-[var(--text-muted)] tabular-nums ${
              Icon && placement === "badge" ? "opacity-45" : "opacity-55"
            }`}
          >
            {itemCount}
          </span>
          {Icon && placement === "badge" && (
            <span
              aria-hidden="true"
              className="inline-flex h-8 w-8 items-center justify-center rounded-[3px] border border-[var(--border-subtle)]/80 bg-[var(--bg-primary)] text-[var(--text-secondary)]"
            >
              <Icon className="h-4 w-4" strokeWidth={1.65} />
            </span>
          )}
        </div>
      </div>

      <div
        className={`${Icon && placement === "badge" ? "mt-2.5" : "mt-3"} flex items-center gap-2.5`}
      >
        {Icon && placement === "title-inline" && (
          <Icon
            aria-hidden="true"
            className="h-[18px] w-[18px] shrink-0 text-[var(--text-secondary)]"
            strokeWidth={1.65}
          />
        )}
        <HeadingTag
          className={`block font-medium tracking-[-0.01em] text-[var(--text-primary)] ${
            compact ? "text-[15px] sm:text-base" : "text-lg sm:text-[19px]"
          }`}
        >
          {group.title}
        </HeadingTag>
      </div>

      {compact ? (
        <span className="mt-2 block font-mono text-[10px] leading-relaxed text-[var(--text-muted)] truncate">
          {group.items.map((item) => item.name).join(" · ")}
        </span>
      ) : (
        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
          {group.subtitle}
        </p>
      )}
    </div>
  );
}

function StackComparisonRow({
  title,
  tag,
  metaRight,
  isSelected,
  onSelect,
  groups,
  icons,
  placement,
}: {
  title: string;
  tag?: string;
  metaRight: string;
  isSelected: boolean;
  onSelect: () => void;
  groups: StackGroup[];
  icons: Record<StackLayerId, StackIconEntry> | null;
  placement: StackIconPlacement;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={`cursor-pointer w-full text-left rounded-[6px] border p-3.5 sm:p-4 transition-colors ${
        isSelected
          ? "border-[var(--text-primary)]/50 bg-[var(--bg-bento)]/45"
          : "border-[var(--border-subtle)]/70 bg-transparent hover:border-[var(--text-muted)]/60"
      }`}
    >
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-medium text-[var(--text-primary)]">
            {title}
          </span>
          {tag && (
            <span className="rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              {tag}
            </span>
          )}
        </div>
        <span className="font-mono text-[10px] text-[var(--text-muted)]">
          {metaRight}
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bento-card p-4 border border-transparent"
          >
            <StackColumnHeader
              group={group}
              iconEntry={icons?.[group.id]}
              placement={placement}
              compact
            />
          </div>
        ))}
      </div>
    </button>
  );
}

/** Opção 1: 3 Colunas Arquiteturais (md:grid-cols-3) com prototipação de ícones */
function ColumnsArchitecturalVariant({ groups }: { groups: StackGroup[] }) {
  const [iconPreset, setIconPreset] =
    useState<StackIconPresetId>("cloud-pipeline");
  const [iconPlacement, setIconPlacement] =
    useState<StackIconPlacement>("meta-inline");

  const activePreset =
    STACK_ICON_PRESETS.find((preset) => preset.id === iconPreset) ??
    STACK_ICON_PRESETS[0];
  const comparablePresets = STACK_ICON_PRESETS.filter((p) => p.icons !== null);
  const previewIcons = activePreset.icons ?? STACK_ICON_PRESETS[0].icons;

  const handleSelectPlacement = (nextPlacement: StackIconPlacement) => {
    setIconPlacement(nextPlacement);
    if (iconPreset === "none") {
      setIconPreset("architecture");
    }
  };

  return (
    <div className="space-y-12">
      {/* Lab Interactive Controls for Icon Trios & Placement */}
      <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/55 p-3.5 sm:p-4 space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div className="flex flex-wrap items-center gap-1.5">
            <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
              Trio:
            </span>
            {STACK_ICON_PRESETS.map((preset) => {
              const isSelected = preset.id === iconPreset;
              const trioIcons = preset.icons
                ? [
                    preset.icons.frontend.icon,
                    preset.icons.backend.icon,
                    preset.icons.infra.icon,
                  ]
                : [];
              return (
                <button
                  key={preset.id}
                  type="button"
                  onClick={() => setIconPreset(preset.id)}
                  className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                    isSelected
                      ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {trioIcons.length > 0 && (
                    <span className="inline-flex items-center gap-1 opacity-85">
                      {trioIcons.map((IconComp, idx) => (
                        <IconComp
                          key={idx}
                          aria-hidden="true"
                          className="h-3 w-3"
                          strokeWidth={1.75}
                        />
                      ))}
                    </span>
                  )}
                  <span>{preset.label}</span>
                  {isSelected && (
                    <Check aria-hidden="true" className="h-3 w-3" />
                  )}
                </button>
              );
            })}
          </div>

          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {formatPresetIconNames(activePreset)}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-1.5 border-t border-[var(--border-subtle)]/50 pt-2.5">
          <span className="mr-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            Encaixe:
          </span>
          {STACK_ICON_PLACEMENTS.map((option) => {
            const isSelected =
              iconPreset !== "none" && iconPlacement === option.id;
            return (
              <button
                key={option.id}
                type="button"
                onClick={() => handleSelectPlacement(option.id)}
                title={option.hint}
                className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border px-2.5 py-1 font-mono text-[10px] transition-colors ${
                  isSelected
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                    : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                }`}
              >
                <span>{option.label}</span>
                {isSelected && <Check aria-hidden="true" className="h-3 w-3" />}
              </button>
            );
          })}
          <span className="ml-auto font-mono text-[10px] text-[var(--text-muted)] hidden sm:inline">
            {STACK_ICON_PLACEMENTS.find((p) => p.id === iconPlacement)?.hint}
          </span>
        </div>
      </div>

      {/* Full-Scale Opção 1 Preview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-5 items-stretch">
        {groups.map((group) => (
          <div
            key={group.id}
            className="bento-card flex h-full flex-col justify-between p-6 sm:p-7 border border-transparent hover:border-[var(--border-subtle)] transition-colors"
          >
            <StackColumnHeader
              group={group}
              iconEntry={activePreset.icons?.[group.id]}
              placement={iconPlacement}
            />

            <TechStackItemList items={group.items} />
          </div>
        ))}
      </div>

      {/* Simultaneous Comparison Matrix: All 5 Icon Trios + All 3 Placements */}
      <div className="space-y-12 border-t border-dashed border-[var(--border-subtle)]/70 pt-10">
        {/* Matrix 1: All 5 Icon Trios */}
        <div>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Comparativo simultâneo · Todos os trios
              </span>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Clique em qualquer combinação para testá-la completa na seção
                acima (exibindo no estilo{" "}
                <strong className="font-medium text-[var(--text-primary)]">
                  {
                    STACK_ICON_PLACEMENTS.find((p) => p.id === iconPlacement)
                      ?.label
                  }
                </strong>
                ).
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {comparablePresets.map((preset) => (
              <StackComparisonRow
                key={preset.id}
                title={preset.label}
                tag={preset.tag}
                metaRight={formatPresetIconNames(preset)}
                isSelected={preset.id === iconPreset}
                onSelect={() => setIconPreset(preset.id)}
                groups={groups}
                icons={preset.icons}
                placement={iconPlacement}
              />
            ))}
          </div>
        </div>

        {/* Matrix 2: All 3 Placement Styles */}
        <div>
          <div className="mb-5 flex flex-wrap items-baseline justify-between gap-2">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
                Comparativo de encaixe ·{" "}
                {activePreset.icons ? activePreset.label : "1 · Arquitetura"}
              </span>
              <p className="mt-1 text-xs text-[var(--text-secondary)]">
                Compare os 3 posicionamentos visuais lado a lado e clique para
                selecionar.
              </p>
            </div>
          </div>

          <div className="space-y-4">
            {STACK_ICON_PLACEMENTS.map((option) => (
              <StackComparisonRow
                key={option.id}
                title={option.label}
                metaRight={option.hint}
                isSelected={
                  iconPreset !== "none" && iconPlacement === option.id
                }
                onSelect={() => handleSelectPlacement(option.id)}
                groups={groups}
                icons={previewIcons}
                placement={option.id}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** Opção 2: Ficha Técnica Editorial (4 cols + 8 cols) */
function EditorialRowsVariant({ groups }: { groups: StackGroup[] }) {
  return (
    <div className="flex flex-col gap-12 sm:gap-14">
      {groups.map((group, idx) => (
        <div
          key={group.id}
          className={`grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-10 items-start ${
            idx > 0
              ? "border-t border-[var(--border-subtle)]/60 pt-10 sm:pt-12"
              : ""
          }`}
        >
          {/* Left 4 cols: Area Context */}
          <div className="lg:col-span-4 flex flex-col">
            <span className="font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              {group.indexLabel} / {group.id.toUpperCase()}
            </span>
            <h3 className="mt-2 text-lg sm:text-xl font-medium tracking-[-0.01em] text-[var(--text-primary)]">
              {group.title}
            </h3>
            <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)] max-w-sm">
              {group.subtitle}
            </p>
          </div>

          {/* Right 8 cols: 4 Bento Cards of this layer */}
          <div className="lg:col-span-8 grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {group.items.map((item) => (
              <StackBentoTile key={item.name} item={item} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Opção 3: Grade Agrupada (3 blocos de 4 cards Bento) */
function GroupedBentoVariant({ groups }: { groups: StackGroup[] }) {
  return (
    <div className="flex flex-col gap-10 sm:gap-12">
      {groups.map((group) => (
        <div key={group.id}>
          <div className="mb-4 flex items-center justify-between gap-2">
            <h3 className="font-mono text-[11px] uppercase tracking-[0.12em] text-[var(--text-secondary)]">
              <span className="text-[var(--text-muted)] mr-2">
                {group.indexLabel} ·
              </span>
              {group.title}
            </h3>
            <span className="font-mono text-[10px] text-[var(--text-muted)] opacity-60 tabular-nums">
              {String(group.items.length).padStart(2, "0")}
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 sm:gap-4">
            {group.items.map((item, itemIdx) => (
              <StackBentoTile
                key={item.name}
                item={item}
                badge={`${group.indexLabel}.${itemIdx + 1}`}
              />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Grade anterior na Home: 12 cards (01..12) */
function CurrentFlatGridVariant({ items }: { items: StackItem[] }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3.5 sm:gap-4">
      {items.map((item, idx) => (
        <StackBentoTile
          key={item.name}
          item={item}
          badge={String(idx + 1).padStart(2, "0")}
        />
      ))}
    </div>
  );
}
