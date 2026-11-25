import { useId, type ReactNode } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { Activity, Check, Layers, ShieldCheck } from "lucide-react";
import type { FeaturedProject } from "../../data/projects";
import type { Language } from "../../i18n/translations";
import {
  getOrderedArchitectureNodes,
  INSPECTOR_FLOW_VARIANTS,
  ROLE_ICON,
  ROLE_LABELS,
  useDirectionalLayer,
  type NormalizedArchitectureNode,
} from "./architectureFlow";

export function ConnectorBridgeSVG({
  orientation,
  active = false,
  traversed = false,
  protocolLabel,
  pulseDelay = 0,
}: {
  orientation: "horizontal" | "vertical";
  active?: boolean;
  traversed?: boolean;
  protocolLabel?: string;
  pulseDelay?: number;
}) {
  const prefersReducedMotion = Boolean(useReducedMotion());
  const railOpacity = active ? 0.85 : traversed ? 0.45 : 0.2;

  if (orientation === "vertical") {
    return (
      <div
        aria-hidden="true"
        className="relative flex flex-col items-center justify-center py-0.5 select-none"
      >
        <svg viewBox="0 0 24 28" className="h-7 w-6 text-[var(--text-primary)]">
          <line
            x1="12"
            y1="2"
            x2="12"
            y2="24"
            stroke="currentColor"
            strokeWidth={active ? 1.5 : 1}
            strokeDasharray={active ? undefined : "2.5 2.5"}
            opacity={railOpacity}
          />
          <polyline
            points="8.5,20.5 12,24.5 15.5,20.5"
            fill="none"
            stroke="currentColor"
            strokeWidth={active ? 1.4 : 1.1}
            strokeLinecap="round"
            strokeLinejoin="round"
            opacity={active ? 0.9 : 0.4}
          />
          {!prefersReducedMotion && (
            <motion.circle
              cx="12"
              r={active ? 2.6 : 1.8}
              fill="currentColor"
              animate={{
                cy: [3, 23],
                opacity: active ? [0.2, 1, 1, 0.2] : [0, 0.55, 0.55, 0],
              }}
              transition={{
                duration: active ? 1.15 : 2.1,
                repeat: Infinity,
                delay: pulseDelay,
                ease: "easeInOut",
              }}
            />
          )}
        </svg>
        {protocolLabel && (
          <span className="font-mono text-[8px] uppercase tracking-wider text-[var(--text-muted)] -mt-1 mb-0.5">
            {protocolLabel}
          </span>
        )}
      </div>
    );
  }

  return (
    <div
      aria-hidden="true"
      className="relative flex shrink-0 flex-col items-center justify-center px-1 select-none"
    >
      {protocolLabel && (
        <span
          className={`mb-1 max-w-[78px] truncate font-mono text-[8px] uppercase tracking-wider transition-colors ${
            active ? "text-[var(--text-primary)]" : "text-[var(--text-muted)]"
          }`}
        >
          {protocolLabel}
        </span>
      )}
      <svg
        viewBox="0 0 56 20"
        className="h-5 w-11 xl:w-14 text-[var(--text-primary)]"
      >
        <line
          x1="2"
          y1="10"
          x2="51"
          y2="10"
          stroke="currentColor"
          strokeWidth={active ? 1.5 : 1}
          strokeDasharray={active ? undefined : "2.5 2.5"}
          opacity={railOpacity}
        />
        <polyline
          points="47,6.5 51.5,10 47,13.5"
          fill="none"
          stroke="currentColor"
          strokeWidth={active ? 1.5 : 1.1}
          strokeLinecap="round"
          strokeLinejoin="round"
          opacity={active ? 0.95 : 0.45}
        />
        {!prefersReducedMotion && (
          <motion.circle
            cy="10"
            r={active ? 2.7 : 1.9}
            fill="currentColor"
            animate={{
              cx: [4, 49],
              opacity: active ? [0.2, 1, 1, 0.2] : [0, 0.55, 0.55, 0],
            }}
            transition={{
              duration: active ? 1.1 : 2.2,
              repeat: Infinity,
              delay: pulseDelay,
              ease: "easeInOut",
            }}
          />
        )}
      </svg>
    </div>
  );
}

export function TopologyNodeCard({
  node,
  index,
  isSelected,
  isTraversed = false,
  isDimmed = false,
  stepBadge,
  compact = false,
  activeBarLayoutId,
  language,
  onSelect,
}: {
  node: NormalizedArchitectureNode;
  index: number;
  isSelected: boolean;
  isTraversed?: boolean;
  isDimmed?: boolean;
  stepBadge?: string;
  compact?: boolean;
  activeBarLayoutId?: string;
  language: Language;
  onSelect: () => void;
}) {
  const RoleIcon = ROLE_ICON[node.role];
  const roleLabel = ROLE_LABELS[node.role][language];

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`cursor-pointer group relative overflow-hidden flex w-full flex-col justify-between text-left rounded-[3px] border transition-colors duration-200 ${
        compact ? "p-3" : "p-4 sm:p-4.5"
      } ${
        isSelected
          ? "border-[var(--text-primary)]/70 bg-[var(--bg-bento-elevated)] shadow-sm ring-1 ring-[var(--text-primary)]/15 opacity-100"
          : isTraversed
            ? "border-[var(--text-primary)]/30 bg-[var(--bg-primary)]/90 opacity-95 hover:border-[var(--text-primary)]/50"
            : isDimmed
              ? "border-[var(--border-subtle)] bg-[var(--bg-primary)]/40 opacity-45 hover:opacity-85"
              : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/80 opacity-80 hover:opacity-100 hover:border-[var(--text-muted)]"
      }`}
    >
      {isSelected && activeBarLayoutId && (
        <motion.span
          layoutId={activeBarLayoutId}
          transition={{ type: "spring", stiffness: 420, damping: 34 }}
          className="pointer-events-none absolute inset-x-0 top-0 h-[2px] bg-[var(--text-primary)]"
          aria-hidden="true"
        />
      )}
      <div>
        {/* Top Row: Index + Role + Provider Pill */}
        <div className="flex flex-wrap items-center justify-between gap-1.5">
          <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
            <span
              className={`tabular-nums font-semibold ${
                isSelected
                  ? "text-[var(--text-primary)]"
                  : "text-[var(--text-muted)]"
              }`}
            >
              0{index + 1}
            </span>
            <span>·</span>
            <RoleIcon className="h-3 w-3 shrink-0" strokeWidth={1.75} />
            <span className="truncate">{roleLabel}</span>
          </span>

          {stepBadge ? (
            <span
              className={`inline-flex items-center gap-1 rounded-[2px] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider ${
                isSelected
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "border border-[var(--border-subtle)] bg-[var(--bg-bento)] text-[var(--text-secondary)]"
              }`}
            >
              {isTraversed && !isSelected && <Check className="h-2.5 w-2.5" />}
              <span>{stepBadge}</span>
            </span>
          ) : (
            node.item.provider && (
              <span
                title={node.item.provider}
                className={`max-w-full truncate rounded-[2px] px-1.5 py-0.5 font-mono text-[8.5px] uppercase tracking-wider border ${
                  isSelected
                    ? "border-[var(--text-primary)]/30 bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                    : "border-[var(--border-subtle)] bg-[var(--bg-bento)] text-[var(--text-secondary)]"
                }`}
              >
                {node.item.provider}
              </span>
            )
          )}
        </div>

        {/* Layer Title */}
        <h4
          className={`mt-2.5 font-medium leading-snug text-[var(--text-primary)] ${
            compact ? "text-xs" : "text-sm sm:text-[15px]"
          }`}
        >
          {node.item.layer[language]}
        </h4>

        {!compact && node.item.protocol && (
          <div className="mt-1 font-mono text-[9.5px] text-[var(--text-muted)]">
            {node.item.protocol}
          </div>
        )}
      </div>

      {/* Tech Pills */}
      <div className="mt-3 flex flex-wrap gap-1.5">
        {node.item.technologies.map((tech) => (
          <span
            key={tech}
            className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-primary)]"
          >
            {tech}
          </span>
        ))}
      </div>
    </button>
  );
}

export function CompactExpandableLayerButton({
  node,
  index,
  isSelected,
  language,
  showAllTechChips = true,
  onSelect,
}: {
  node: NormalizedArchitectureNode;
  index: number;
  isSelected: boolean;
  language: Language;
  showAllTechChips?: boolean;
  onSelect: () => void;
}) {
  const visibleTechs = showAllTechChips
    ? node.item.technologies
    : node.item.technologies.slice(0, 3);
  const hiddenTechCount = Math.max(
    0,
    node.item.technologies.length - visibleTechs.length,
  );

  return (
    <button
      type="button"
      onClick={onSelect}
      className={`cursor-pointer w-full overflow-hidden text-left rounded-[3px] border px-3 py-2 transition-all duration-200 ${
        isSelected
          ? "border-[var(--text-primary)]/50 bg-[var(--bg-bento)] shadow-2xs opacity-100"
          : "border-[var(--border-subtle)] bg-transparent opacity-65 hover:opacity-95 hover:border-[var(--text-muted)]"
      }`}
    >
      <div className="flex min-w-0 items-center justify-between gap-2">
        <span className="flex items-center gap-2 min-w-0">
          <span className="shrink-0 font-mono text-[9px] tabular-nums font-semibold text-[var(--text-primary)]">
            0{index + 1}
          </span>
          <span className="truncate text-xs font-medium text-[var(--text-primary)]">
            {node.item.layer[language]}
          </span>
        </span>
        {node.item.provider && (
          <span
            title={node.item.provider}
            className="max-w-[44%] shrink-0 truncate rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-1.5 py-0.5 font-mono text-[8px] uppercase text-[var(--text-secondary)]"
          >
            {node.item.provider}
          </span>
        )}
      </div>

      <AnimatePresence initial={false}>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{
              duration: 0.22,
              ease: [0.22, 1, 0.36, 1],
            }}
            className="overflow-hidden"
          >
            <p className="mt-1.5 line-clamp-3 text-[11px] leading-relaxed text-[var(--text-secondary)]">
              {node.item.description[language]}
            </p>
            <div className="mt-2 flex flex-wrap gap-1.5">
              {visibleTechs.map((tech) => (
                <span
                  key={tech}
                  className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-primary)]"
                >
                  {tech}
                </span>
              ))}
              {hiddenTechCount > 0 && (
                <span className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-1.5 py-0.5 font-mono text-[9px] text-[var(--text-muted)] tabular-nums">
                  +{hiddenTechCount}
                </span>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}

/**
 * Idea 1 Full Desktop View: Interactive horizontal node topology canvas paired
 * with a non-flickering directional Layer Inspector card.
 */
export function DesktopArchitectureTopology({
  project,
  language,
  controlledSelectedId,
  controlledDirection,
  onSelectLayer,
}: {
  project: FeaturedProject;
  language: Language;
  controlledSelectedId?: string;
  controlledDirection?: 1 | -1;
  onSelectLayer?: (id: string) => void;
}) {
  const instanceId = useId();
  const nodes = getOrderedArchitectureNodes(project);
  const localSelection = useDirectionalLayer(nodes);
  const selectedId = controlledSelectedId ?? localSelection.selectedId;
  const direction = controlledDirection ?? localSelection.direction;

  const setSelectedId = (id: string) => {
    if (onSelectLayer) {
      onSelectLayer(id);
    } else {
      localSelection.selectLayer(id);
    }
  };

  const selectedIndex = Math.max(
    0,
    nodes.findIndex((n) => n.id === selectedId),
  );
  const selectedNode = nodes[selectedIndex] ?? nodes[0];
  const prevNode = selectedIndex > 0 ? nodes[selectedIndex - 1] : null;
  const nextNode =
    selectedIndex < nodes.length - 1 ? nodes[selectedIndex + 1] : null;

  return (
    <div className="space-y-4">
      {/* Main Blueprint Topology Canvas */}
      <div
        className="bento-card relative overflow-hidden p-5 sm:p-7"
        style={{
          backgroundImage:
            "radial-gradient(var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-2.5">
            <span className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              /{" "}
              {language === "pt"
                ? "TOPOLOGIA INTERATIVA DE SISTEMA"
                : "INTERACTIVE SYSTEM TOPOLOGY"}
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[9px] text-[var(--text-secondary)]">
              <Activity className="h-2.5 w-2.5 text-[var(--text-primary)]" />
              <span>
                {nodes.length} {language === "pt" ? "camadas" : "layers"}
              </span>
            </span>
          </div>

          <span className="font-mono text-[10px] text-[var(--text-muted)]">
            {language === "pt"
              ? "Clique em qualquer nó para inspecionar conexões e garantias"
              : "Click any node to inspect upstream/downstream links & specs"}
          </span>
        </div>

        {/* Connected Horizontal Graph on Desktop, Vertical on Narrow Containers */}
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {nodes.map((node, idx) => {
            const isSelected = node.id === selectedNode?.id;
            const isLast = idx === nodes.length - 1;
            const isBridgeActive =
              idx === selectedIndex || idx + 1 === selectedIndex;

            return (
              <div
                key={node.id}
                className="flex flex-1 min-w-0 flex-col lg:flex-row lg:items-stretch"
              >
                <div className="flex-1 min-w-0 flex">
                  <TopologyNodeCard
                    node={node}
                    index={idx}
                    isSelected={isSelected}
                    activeBarLayoutId={`node-bar-${instanceId}`}
                    language={language}
                    onSelect={() => setSelectedId(node.id)}
                  />
                </div>

                {!isLast && (
                  <>
                    <div className="hidden lg:flex items-center">
                      <ConnectorBridgeSVG
                        orientation="horizontal"
                        active={isBridgeActive}
                        protocolLabel={nodes[idx + 1]?.item.protocol
                          ?.split("·")[0]
                          ?.trim()}
                        pulseDelay={idx * 0.28}
                      />
                    </div>
                    <div className="flex lg:hidden justify-center">
                      <ConnectorBridgeSVG
                        orientation="vertical"
                        active={isBridgeActive}
                        protocolLabel={nodes[idx + 1]?.item.protocol
                          ?.split("·")[0]
                          ?.trim()}
                        pulseDelay={idx * 0.28}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Inspector Panel (Persistent shell prevents outer card flicker) */}
      {selectedNode && (
        <motion.div
          layout="size"
          transition={{ layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
          className="bento-card relative overflow-hidden"
        >
          {/* Stationary Top Telemetry Header Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[var(--border-subtle)]/70 bg-[var(--bg-primary)]/40 px-5 py-2.5 sm:px-7">
            <span className="font-mono text-[9.5px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              LAYER INSPECTOR · 0{selectedIndex + 1} / 0{nodes.length}
            </span>

            <div className="flex flex-wrap items-center gap-1">
              {nodes.map((node, idx) => {
                const isActive = node.id === selectedNode.id;
                return (
                  <button
                    key={node.id}
                    type="button"
                    onClick={() => setSelectedId(node.id)}
                    className={`cursor-pointer relative rounded-[2px] px-2 py-0.5 font-mono text-[9.5px] transition-colors ${
                      isActive
                        ? "text-[var(--bg-primary)] font-semibold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {isActive && (
                      <motion.span
                        layoutId={`inspector-pill-${instanceId}`}
                        transition={{
                          type: "spring",
                          stiffness: 430,
                          damping: 34,
                        }}
                        className="absolute inset-0 rounded-[2px] bg-[var(--text-primary)]"
                        aria-hidden="true"
                      />
                    )}
                    <span className="relative z-10">
                      0{idx + 1}
                      {node.item.provider ? ` · ${node.item.provider}` : ""}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Directional Non-Flickering Layer Content */}
          <div className="relative overflow-hidden">
            <AnimatePresence mode="popLayout" custom={direction} initial={false}>
              <motion.div
                key={selectedNode.id}
                custom={direction}
                variants={INSPECTOR_FLOW_VARIANTS}
                initial="enter"
                animate="center"
                exit="exit"
                className="w-full p-5 sm:p-7"
              >
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  {/* Left 7 cols: Layer Summary & Upstream/Downstream Jumpers */}
                  <div className="lg:col-span-7">
                    <div className="flex flex-wrap items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                      <span>
                        NODE 0{selectedIndex + 1} /{" "}
                        {ROLE_LABELS[selectedNode.role][language]}
                      </span>
                      {selectedNode.item.provider && (
                        <>
                          <span>·</span>
                          <span className="text-[var(--text-primary)] font-semibold">
                            {selectedNode.item.provider}
                          </span>
                        </>
                      )}
                    </div>

                    <h3 className="mt-2 font-editorial text-2xl sm:text-3xl leading-tight text-[var(--text-primary)]">
                      {selectedNode.item.layer[language]}
                    </h3>

                    <p className="mt-3 text-sm leading-relaxed text-[var(--text-secondary)] max-w-2xl">
                      {selectedNode.item.description[language]}
                    </p>

                    {/* Graph Neighbor Navigation */}
                    <div className="mt-5 flex flex-wrap items-center gap-2.5 pt-4 border-t border-[var(--border-subtle)]/70">
                      {prevNode && (
                        <button
                          type="button"
                          onClick={() => setSelectedId(prevNode.id)}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
                        >
                          <span>
                            ← {language === "pt" ? "Entrada:" : "From:"}
                          </span>
                          <strong className="text-[var(--text-primary)]">
                            {prevNode.item.provider ??
                              prevNode.item.layer[language]}
                          </strong>
                        </button>
                      )}

                      {nextNode && (
                        <button
                          type="button"
                          onClick={() => setSelectedId(nextNode.id)}
                          className="cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
                        >
                          <span>{language === "pt" ? "Saída:" : "To:"}</span>
                          <strong className="text-[var(--text-primary)]">
                            {nextNode.item.provider ??
                              nextNode.item.layer[language]}
                          </strong>
                          <span>→</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Right 5 cols: Engineering Metadata Spec Grid */}
                  <div className="lg:col-span-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 gap-3">
                    <div className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
                      <div className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                        {language === "pt"
                          ? "INFRAESTRUTURA & PROTOCOLO"
                          : "INFRASTRUCTURE & PROTOCOL"}
                      </div>
                      <div className="mt-1.5 flex flex-wrap items-center justify-between gap-2">
                        <span className="text-xs font-medium text-[var(--text-primary)]">
                          {selectedNode.item.provider ?? "Core Runtime"}
                        </span>
                        <span className="rounded-[2px] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[10px] text-[var(--text-secondary)]">
                          {selectedNode.item.protocol ?? "HTTPS"}
                        </span>
                      </div>
                    </div>

                    {selectedNode.item.securityNote && (
                      <div className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
                        <div className="flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                          <ShieldCheck className="h-3 w-3 text-[var(--text-primary)]" />
                          <span>
                            {language === "pt"
                              ? "GARANTIA ARQUITETURAL"
                              : "ARCHITECTURAL GUARANTEE"}
                          </span>
                        </div>
                        <p className="mt-1.5 text-xs leading-relaxed text-[var(--text-secondary)]">
                          {selectedNode.item.securityNote[language]}
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </div>
  );
}

/**
 * Idea 3 Compact View: Continuous vertical trace line with flowing signal pulse,
 * spring halo on the active dot, and smooth inline layer expansion.
 */
export function CompactArchitecturePipeline({
  nodes,
  selectedId,
  onSelect,
  language,
  showSecurityNote = false,
  headerAction,
}: {
  nodes: NormalizedArchitectureNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  language: Language;
  showSecurityNote?: boolean;
  headerAction?: ReactNode;
}) {
  const railId = useId();
  const prefersReducedMotion = Boolean(useReducedMotion());
  const selectedIndex = Math.max(
    0,
    nodes.findIndex((n) => n.id === selectedId),
  );
  const selectedNode = nodes[selectedIndex] ?? nodes[0];

  return (
    <div className="flex h-full min-h-0 flex-1 flex-col justify-between p-3.5">
      <div className="mb-2.5 flex shrink-0 items-center justify-between gap-2 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        <span className="inline-flex items-center gap-1.5 min-w-0 truncate">
          <Layers className="h-3 w-3 shrink-0" />
          <span>System Pipeline</span>
        </span>
        {headerAction ? (
          <div className="shrink-0">{headerAction}</div>
        ) : (
          <span className="shrink-0 tabular-nums">
            0{selectedIndex + 1}/0{nodes.length}
          </span>
        )}
      </div>

      {/* Scroll-safe Continuous Vertical Trace Line + Nodes */}
      <div className="flex flex-1 min-h-0 flex-col overflow-y-auto pr-0.5 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        <div className="relative my-auto w-full min-w-0 py-0.5 pl-5">
          <div
            aria-hidden="true"
            className="absolute left-[9px] top-4 bottom-4 w-px overflow-hidden bg-[var(--border-subtle)]"
          >
            {!prefersReducedMotion && (
              <motion.div
                className="absolute inset-x-0 h-10 bg-gradient-to-b from-transparent via-[var(--text-primary)] to-transparent opacity-60"
                animate={{ top: ["0%", "78%", "0%"] }}
                transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
              />
            )}
          </div>

          <div className="flex flex-col gap-2">
            {nodes.map((node, idx) => {
              const isSelected = node.id === selectedNode?.id;
              return (
                <div key={node.id} className="relative min-w-0">
                  {/* Node Dot on Vertical Rail */}
                  <span
                    aria-hidden="true"
                    className="absolute -left-[15px] top-3.5 z-10 flex h-2.5 w-2.5 items-center justify-center"
                  >
                    {isSelected && (
                      <motion.span
                        layoutId={`rail-dot-${railId}`}
                        transition={{
                          type: "spring",
                          stiffness: 460,
                          damping: 34,
                        }}
                        className="absolute -inset-1 rounded-full border border-[var(--text-primary)]/45 bg-[var(--text-primary)]/12"
                      />
                    )}
                    <span
                      className={`relative h-2.5 w-2.5 rounded-full border transition-all duration-200 ${
                        isSelected
                          ? "border-[var(--text-primary)] bg-[var(--text-primary)] scale-110"
                          : "border-[var(--text-muted)] bg-[var(--bg-primary)]"
                      }`}
                    />
                  </span>

                  <CompactExpandableLayerButton
                    node={node}
                    index={idx}
                    isSelected={isSelected}
                    language={language}
                    showAllTechChips={showSecurityNote}
                    onSelect={() => onSelect(node.id)}
                  />
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showSecurityNote && selectedNode?.item.securityNote && (
        <div className="mt-3 flex shrink-0 items-start gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 px-2.5 py-2 text-[10px] text-[var(--text-secondary)]">
          <ShieldCheck className="h-3 w-3 mt-0.5 shrink-0 text-[var(--text-primary)]" />
          <span>{selectedNode.item.securityNote[language]}</span>
        </div>
      )}
    </div>
  );
}

/**
 * Responsive Architecture Block for `/project/:slug`:
 * - Desktop (`>= 1024px`): Full Interactive System Topology (Idea 1) only.
 * - Mobile (`< 1024px`): Compact Vertical Rail Pipeline (Idea 3) only.
 * Both share the same active layer state seamlessly across viewport resizes.
 */
export function ResponsiveProjectArchitecture({
  project,
  language,
}: {
  project: FeaturedProject;
  language: Language;
}) {
  const nodes = getOrderedArchitectureNodes(project);
  const { selectedId, direction, selectLayer } = useDirectionalLayer(nodes);

  return (
    <>
      <div className="hidden lg:block">
        <DesktopArchitectureTopology
          project={project}
          language={language}
          controlledSelectedId={selectedId}
          controlledDirection={direction}
          onSelectLayer={selectLayer}
        />
      </div>

      <div className="block lg:hidden">
        <div className="bento-card p-3 sm:p-4">
          <div className="overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
            <CompactArchitecturePipeline
              nodes={nodes}
              selectedId={selectedId}
              onSelect={selectLayer}
              language={language}
              showSecurityNote
            />
          </div>
        </div>
      </div>
    </>
  );
}
