import { useEffect, useId, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  Columns2,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  ShieldCheck,
  Smartphone,
  Workflow,
} from "lucide-react";
import {
  featuredProjects,
  type ArchitectureFlowScenario,
  type FeaturedProject,
} from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";
import type { Language } from "../../i18n/translations";
import { ProjectMark } from "../ui/ProjectVisuals";
import {
  CompactArchitecturePipeline,
  CompactExpandableLayerButton,
  ConnectorBridgeSVG,
  DesktopArchitectureTopology,
  TopologyNodeCard,
} from "../project/ProjectArchitectureFlow";
import {
  getArchitectureNodeById as getNodeById,
  getOrderedArchitectureNodes as getOrderedNodes,
  INSPECTOR_FLOW_VARIANTS,
  ROLE_ICON,
  useDirectionalLayer,
  type NormalizedArchitectureNode as NormalizedNode,
} from "../project/architectureFlow";

export type ArchitectureVariantId =
  | "final-hybrid"
  | "node-topology"
  | "request-trace"
  | "dual-blueprint";

export type ArchitectureContextMode = "full" | "compact";

type FinalHybridPreviewMode =
  | "hybrid-all"
  | "desktop-only"
  | "compact-only"
  | "responsive-live";

function CompactHomeCompanionFrame({
  project,
  language,
  caption,
  children,
}: {
  project: FeaturedProject;
  language: Language;
  caption: string;
  children: React.ReactNode;
}) {
  return (
    <div className="mx-auto w-full max-w-[360px]">
      <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        <span>
          {language === "pt"
            ? "Simulação · Card 4 Colunas (Home)"
            : "Simulation · 4-Col Card (Home)"}
        </span>
        <span>360px</span>
      </div>

      <div className="bento-card flex flex-col overflow-hidden p-3 sm:p-4 shadow-sm">
        {/* Simulated Header Matching CompanionPanelCard */}
        <div className="mb-3 flex items-center justify-between gap-2">
          <div
            aria-hidden="true"
            className="inline-flex items-center gap-1 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]/70 p-0.5"
          >
            <span className="inline-flex items-center gap-1 rounded-[2px] px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              <Smartphone className="h-2.5 w-2.5" />
              <span>Mobile</span>
            </span>
            <span className="inline-flex items-center gap-1 rounded-[2px] bg-[var(--text-primary)] px-2 py-1 font-mono text-[9px] uppercase tracking-wider text-[var(--bg-primary)] font-semibold">
              <Workflow className="h-2.5 w-2.5" />
              <span>{language === "pt" ? "Arquitetura" : "Architecture"}</span>
            </span>
          </div>

          <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] truncate">
            {project.appDomain ?? project.slug}
          </span>
        </div>

        {/* Fixed-Proportion Inner Stage */}
        <div className="relative min-h-[380px] flex flex-col overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
          {children}
        </div>

        {/* Footer Caption */}
        <div className="mt-3 flex items-center justify-between px-1">
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-secondary)] truncate">
            {caption}
          </span>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* IDEIA 1: INTERACTIVE NODE TOPOLOGY + SVG DATA PULSE                        */
/* -------------------------------------------------------------------------- */

function NodeTopologyVariant({
  project,
  contextMode,
  language,
  controlledSelectedId,
  controlledDirection,
  onSelectLayer,
}: {
  project: FeaturedProject;
  contextMode: ArchitectureContextMode;
  language: Language;
  controlledSelectedId?: string;
  controlledDirection?: 1 | -1;
  onSelectLayer?: (id: string) => void;
}) {
  const nodes = getOrderedNodes(project);
  const localSelection = useDirectionalLayer(nodes);
  const selectedId = controlledSelectedId ?? localSelection.selectedId;
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

  if (contextMode === "compact") {
    return (
      <CompactHomeCompanionFrame
        project={project}
        language={language}
        caption={
          language === "pt"
            ? "Topologia vertical · Clique no nó"
            : "Vertical topology · Click node"
        }
      >
        <div className="flex flex-1 flex-col justify-between p-3.5">
          <div className="mb-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
            <span className="inline-flex items-center gap-1.5">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--text-primary)] opacity-50" />
                <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-[var(--text-primary)]" />
              </span>
              <span>
                System Topology · {nodes.length}{" "}
                {language === "pt" ? "nós" : "nodes"}
              </span>
            </span>
            <span>{selectedNode?.item.provider}</span>
          </div>

          <div className="flex flex-1 flex-col justify-center">
            {nodes.map((node, idx) => {
              const isSelected = node.id === selectedNode?.id;
              const isLast = idx === nodes.length - 1;
              const isEdgeActive =
                idx === selectedIndex || idx + 1 === selectedIndex;

              return (
                <div key={node.id} className="flex flex-col">
                  <CompactExpandableLayerButton
                    node={node}
                    index={idx}
                    isSelected={isSelected}
                    language={language}
                    onSelect={() => setSelectedId(node.id)}
                  />

                  {!isLast && (
                    <ConnectorBridgeSVG
                      orientation="vertical"
                      active={isEdgeActive}
                      pulseDelay={idx * 0.25}
                    />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </CompactHomeCompanionFrame>
    );
  }

  return (
    <DesktopArchitectureTopology
      project={project}
      language={language}
      controlledSelectedId={controlledSelectedId}
      controlledDirection={controlledDirection}
      onSelectLayer={onSelectLayer}
    />
  );
}

/* -------------------------------------------------------------------------- */
/* IDEIA 2: INTERACTIVE REQUEST TRACE SIMULATOR                               */
/* -------------------------------------------------------------------------- */

function RequestTraceVariant({
  project,
  contextMode,
  language,
}: {
  project: FeaturedProject;
  contextMode: ArchitectureContextMode;
  language: Language;
}) {
  const traceId = useId();
  const nodes = getOrderedNodes(project);
  const scenarios: ArchitectureFlowScenario[] = project.architectureFlows ?? [];

  const [scenarioIndex, setScenarioIndex] = useState(0);
  const [{ stepIndex, direction: stepDirection }, setStepState] = useState<{
    stepIndex: number;
    direction: 1 | -1;
  }>({ stepIndex: 0, direction: 1 });
  const [isPlaying, setIsPlaying] = useState(false);

  const activeScenario = scenarios[scenarioIndex] ?? scenarios[0];
  const steps = activeScenario?.steps ?? [];
  const safeStepIndex = Math.min(stepIndex, Math.max(0, steps.length - 1));
  const activeStep = steps[safeStepIndex];

  useEffect(() => {
    if (!isPlaying || steps.length <= 1) return;
    const timer = window.setInterval(() => {
      setStepState((prev) => {
        const nextIndex = (prev.stepIndex + 1) % steps.length;
        return {
          stepIndex: nextIndex,
          direction: nextIndex >= prev.stepIndex ? 1 : -1,
        };
      });
    }, 2200);
    return () => window.clearInterval(timer);
  }, [isPlaying, steps.length]);

  const handleSelectScenario = (idx: number) => {
    setScenarioIndex(idx);
    setStepState({
      stepIndex: 0,
      direction: idx >= scenarioIndex ? 1 : -1,
    });
    setIsPlaying(false);
  };

  const handleStepSelect = (idx: number) => {
    setStepState((prev) => ({
      stepIndex: idx,
      direction: idx >= prev.stepIndex ? 1 : -1,
    }));
    setIsPlaying(false);
  };

  const handleAdvanceStep = () => {
    if (steps.length === 0) return;
    setIsPlaying(false);
    setStepState((prev) => {
      const nextIndex = (prev.stepIndex + 1) % steps.length;
      return {
        stepIndex: nextIndex,
        direction: nextIndex >= prev.stepIndex ? 1 : -1,
      };
    });
  };

  const handleReset = () => {
    setIsPlaying(false);
    setStepState({ stepIndex: 0, direction: -1 });
  };

  if (!activeScenario || !activeStep) {
    return (
      <NodeTopologyVariant
        project={project}
        contextMode={contextMode}
        language={language}
      />
    );
  }

  const traversedLayerIds = new Set(
    steps.slice(0, safeStepIndex).map((s) => s.layerId),
  );
  const scenarioLayerIds = new Set(steps.map((s) => s.layerId));
  const activeLayerIndexInNodes = nodes.findIndex(
    (n) => n.id === activeStep.layerId,
  );
  const activeLayerNode = getNodeById(nodes, activeStep.layerId);

  if (contextMode === "compact") {
    return (
      <CompactHomeCompanionFrame
        project={project}
        language={language}
        caption={activeScenario.title[language]}
      >
        <div className="flex flex-1 flex-col justify-between p-3.5 gap-3">
          {/* Compact Scenario Pills + Play Controls */}
          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between gap-2">
              <span className="font-mono text-[9px] uppercase tracking-[0.12em] text-[var(--text-muted)]">
                Request Trace · 0{safeStepIndex + 1}/0{steps.length}
              </span>
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setIsPlaying((p) => !p)}
                  aria-label={isPlaying ? "Pausar simulação" : "Iniciar simulação"}
                  className="cursor-pointer inline-flex h-6 items-center gap-1 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-2 font-mono text-[9px] text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                >
                  {isPlaying ? (
                    <Pause className="h-2.5 w-2.5" />
                  ) : (
                    <Play className="h-2.5 w-2.5" />
                  )}
                  <span>{isPlaying ? "Pause" : "Play"}</span>
                </button>
                <button
                  type="button"
                  onClick={handleAdvanceStep}
                  aria-label="Próximo passo"
                  className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)]"
                >
                  <ArrowRight className="h-2.5 w-2.5" />
                </button>
              </div>
            </div>

            <div className="flex gap-1 overflow-x-auto pb-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
              {scenarios.map((scen, idx) => (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => handleSelectScenario(idx)}
                  className={`cursor-pointer shrink-0 rounded-[2px] px-2 py-0.5 font-mono text-[9px] transition-colors ${
                    idx === scenarioIndex
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "bg-[var(--bg-bento)] text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  {scen.title[language]}
                </button>
              ))}
            </div>
          </div>

          {/* Vertical Compact Pipeline Highlighting Active Step */}
          <div className="flex flex-col">
            {nodes.map((node, idx) => {
              const stepIdx = steps.findIndex((s) => s.layerId === node.id);
              const isCurrent = node.id === activeStep.layerId;
              const isTraversed = traversedLayerIds.has(node.id);
              const isInScenario = scenarioLayerIds.has(node.id);
              const isLast = idx === nodes.length - 1;
              const isBridgeActive =
                idx + 1 === activeLayerIndexInNodes ||
                idx === activeLayerIndexInNodes;

              return (
                <div key={node.id} className="flex flex-col">
                  <button
                    type="button"
                    onClick={() => {
                      if (stepIdx >= 0) handleStepSelect(stepIdx);
                    }}
                    className={`cursor-pointer w-full rounded-[3px] border px-2.5 py-2 text-left transition-all ${
                      isCurrent
                        ? "border-[var(--text-primary)]/70 bg-[var(--bg-bento)] shadow-2xs opacity-100"
                        : isTraversed
                          ? "border-[var(--text-primary)]/25 bg-transparent opacity-90"
                          : isInScenario
                            ? "border-[var(--border-subtle)] opacity-60 hover:opacity-95"
                            : "border-[var(--border-subtle)] opacity-35"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate text-[11px] font-medium text-[var(--text-primary)]">
                        0{idx + 1} · {node.item.layer[language]}
                      </span>
                      <span
                        className={`shrink-0 rounded-[2px] px-1.5 py-0.5 font-mono text-[8px] uppercase ${
                          isCurrent
                            ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                            : "bg-[var(--bg-bento)] text-[var(--text-muted)]"
                        }`}
                      >
                        {isCurrent
                          ? `STEP 0${safeStepIndex + 1}`
                          : isTraversed
                            ? "OK"
                            : (node.item.provider ?? "")}
                      </span>
                    </div>
                  </button>

                  {!isLast && (
                    <ConnectorBridgeSVG
                      orientation="vertical"
                      active={isBridgeActive}
                      traversed={isTraversed}
                      pulseDelay={idx * 0.2}
                    />
                  )}
                </div>
              );
            })}
          </div>

          {/* Bottom Micro Inspector */}
          <div className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/70 p-2.5">
            <div className="truncate font-mono text-[9px] text-[var(--text-primary)]">
              &gt; {activeStep.payload}
            </div>
            <p className="mt-1 text-[10.5px] leading-relaxed text-[var(--text-secondary)]">
              {activeStep.detail[language]}
            </p>
          </div>
        </div>
      </CompactHomeCompanionFrame>
    );
  }

  return (
    <div className="space-y-4">
      {/* Top Scenario Switcher & Transport Bar */}
      <div className="bento-card p-4 sm:p-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex flex-wrap items-center gap-1.5">
            {scenarios.map((scen, idx) => {
              const isSelected = idx === scenarioIndex;
              return (
                <button
                  key={scen.id}
                  type="button"
                  onClick={() => handleSelectScenario(idx)}
                  className={`cursor-pointer relative rounded-[3px] px-3 py-1.5 font-mono text-[10.5px] transition-colors ${
                    isSelected
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  {scen.title[language]}
                </button>
              );
            })}
          </div>

          {/* Playback Controls */}
          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={() => setIsPlaying((prev) => !prev)}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                isPlaying
                  ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-primary)] hover:border-[var(--text-muted)]"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3" />
                  <span>{language === "pt" ? "Pausar" : "Pause"}</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3" />
                  <span>{language === "pt" ? "Simular Fluxo" : "Play Trace"}</span>
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleAdvanceStep}
              aria-label={language === "pt" ? "Próximo passo" : "Next step"}
              className="cursor-pointer inline-flex h-8 items-center gap-1 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 font-mono text-[10px] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>{language === "pt" ? "Passo" : "Step"}</span>
              <ArrowRight className="h-3 w-3" />
            </button>

            <button
              type="button"
              onClick={handleReset}
              aria-label={language === "pt" ? "Reiniciar trace" : "Reset trace"}
              className="cursor-pointer inline-flex h-8 w-8 items-center justify-center rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <RotateCcw className="h-3 w-3" />
            </button>
          </div>
        </div>

        {/* Scenario Trigger Description */}
        <div className="mt-3 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]/70 pt-3 font-mono text-[10.5px]">
          <span className="text-[var(--text-secondary)]">
            <strong className="uppercase text-[var(--text-muted)] mr-2">
              {language === "pt" ? "Gatilho:" : "Trigger:"}
            </strong>
            {activeScenario.trigger[language]}
          </span>
          <span className="tabular-nums text-[var(--text-muted)]">
            STEP {String(safeStepIndex + 1).padStart(2, "0")} /{" "}
            {String(steps.length).padStart(2, "0")}
          </span>
        </div>
      </div>

      {/* Connected Pipeline Highlighting Scenario Execution */}
      <div
        className="bento-card p-5 sm:p-6"
        style={{
          backgroundImage:
            "radial-gradient(var(--border-subtle) 1px, transparent 1px)",
          backgroundSize: "18px 18px",
        }}
      >
        <div className="flex flex-col lg:flex-row lg:items-stretch">
          {nodes.map((node, idx) => {
            const matchingStepIndex = steps.findIndex(
              (s) => s.layerId === node.id,
            );
            const isCurrent = node.id === activeStep.layerId;
            const isTraversed = traversedLayerIds.has(node.id);
            const isInScenario = scenarioLayerIds.has(node.id);
            const isLast = idx === nodes.length - 1;
            const isBridgeActive = idx + 1 === activeLayerIndexInNodes;

            const stepBadge = isCurrent
              ? language === "pt"
                ? `PASSO 0${safeStepIndex + 1} · ATIVO`
                : `STEP 0${safeStepIndex + 1} · ACTIVE`
              : isTraversed
                ? language === "pt"
                  ? `PASSO 0${matchingStepIndex + 1}`
                  : `STEP 0${matchingStepIndex + 1}`
                : isInScenario
                  ? `0${matchingStepIndex + 1}`
                  : undefined;

            return (
              <div
                key={node.id}
                className="flex flex-1 min-w-0 flex-col lg:flex-row lg:items-stretch"
              >
                <div className="flex-1 min-w-0 flex">
                  <TopologyNodeCard
                    node={node}
                    index={idx}
                    isSelected={isCurrent}
                    isTraversed={isTraversed}
                    isDimmed={!isInScenario}
                    stepBadge={stepBadge}
                    activeBarLayoutId={`trace-bar-${traceId}`}
                    language={language}
                    onSelect={() => {
                      if (matchingStepIndex >= 0) {
                        handleStepSelect(matchingStepIndex);
                      }
                    }}
                  />
                </div>

                {!isLast && (
                  <>
                    <div className="hidden lg:flex items-center">
                      <ConnectorBridgeSVG
                        orientation="horizontal"
                        active={isBridgeActive}
                        traversed={isTraversed}
                        protocolLabel={
                          isBridgeActive ? activeStep.payload.split("·")[0] : undefined
                        }
                        pulseDelay={idx * 0.22}
                      />
                    </div>
                    <div className="flex lg:hidden justify-center">
                      <ConnectorBridgeSVG
                        orientation="vertical"
                        active={isBridgeActive}
                        traversed={isTraversed}
                        pulseDelay={idx * 0.22}
                      />
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* Request Inspector Timeline & Payload Output */}
      <motion.div
        layout="size"
        transition={{ layout: { duration: 0.28, ease: [0.22, 1, 0.36, 1] } }}
        className="bento-card relative overflow-hidden p-5 sm:p-6"
      >
        {/* Horizontal Step Timeline Scrubber */}
        <div className="mb-4 flex flex-wrap items-center gap-2 border-b border-[var(--border-subtle)]/70 pb-4">
          {steps.map((step, idx) => {
            const nodeForStep = getNodeById(nodes, step.layerId);
            const isActive = idx === safeStepIndex;
            const isPast = idx < safeStepIndex;
            return (
              <button
                key={`${activeScenario.id}-${step.layerId}-${idx}`}
                type="button"
                onClick={() => handleStepSelect(idx)}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-[2px] border px-2.5 py-1 font-mono text-[10px] transition-all ${
                  isActive
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                    : isPast
                      ? "border-[var(--text-primary)]/30 bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                }`}
              >
                <span className="tabular-nums">0{idx + 1}</span>
                <span>·</span>
                <span>
                  {nodeForStep?.item.provider ??
                    nodeForStep?.item.layer[language] ??
                    step.layerId}
                </span>
              </button>
            );
          })}
        </div>

        {/* Active Step Inspector Readout */}
        <div className="relative overflow-hidden">
          <AnimatePresence
            mode="popLayout"
            custom={stepDirection}
            initial={false}
          >
            <motion.div
              key={`${activeScenario.id}-${safeStepIndex}`}
              custom={stepDirection}
              variants={INSPECTOR_FLOW_VARIANTS}
              initial="enter"
              animate="center"
              exit="exit"
              className="w-full grid grid-cols-1 lg:grid-cols-12 gap-5 items-center"
            >
              <div className="lg:col-span-7">
                <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                  <span>REQUEST INSPECTOR · 0{safeStepIndex + 1}</span>
                  {activeLayerNode?.item.provider && (
                    <>
                      <span>·</span>
                      <span className="text-[var(--text-primary)] font-semibold">
                        {activeLayerNode.item.provider}
                      </span>
                    </>
                  )}
                </div>

                <h4 className="mt-1.5 font-editorial text-2xl text-[var(--text-primary)]">
                  {activeStep.action[language]}
                </h4>

                <p className="mt-2 text-sm leading-relaxed text-[var(--text-secondary)]">
                  {activeStep.detail[language]}
                </p>
              </div>

              <div className="lg:col-span-5">
                <div className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5 sm:p-4">
                  <div className="mb-1.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                    <span>
                      {language === "pt"
                        ? "Payload / Contrato"
                        : "Payload / Contract"}
                    </span>
                    <span>{activeLayerNode?.item.protocol ?? "JSON"}</span>
                  </div>
                  <code className="block break-words font-mono text-[11px] leading-relaxed text-[var(--text-primary)]">
                    &gt; {activeStep.payload}
                  </code>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>
      </motion.div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* IDEIA 3: COMPACT VERTICAL RAIL + DUAL-CONTEXT BLUEPRINT                    */
/* -------------------------------------------------------------------------- */

const CompactRailPipeline = CompactArchitecturePipeline;

function CompactProjectMobileFrame({
  project,
  nodes,
  selectedId,
  onSelect,
  language,
}: {
  project: FeaturedProject;
  nodes: NormalizedNode[];
  selectedId: string;
  onSelect: (id: string) => void;
  language: Language;
}) {
  return (
    <div className="mx-auto w-full max-w-[390px]">
      <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
        <span>
          {language === "pt"
            ? "Simulação · /project/:slug (Mobile < 1024px)"
            : "Simulation · /project/:slug (Mobile < 1024px)"}
        </span>
        <span>≤ 390px</span>
      </div>

      <div className="bento-card p-4 shadow-sm">
        <div className="mb-3 flex items-center justify-between gap-2 border-b border-[var(--border-subtle)] pb-2.5">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
              03 / {language === "pt" ? "ARQUITETURA" : "ARCHITECTURE"}
            </span>
            <h4 className="mt-0.5 font-editorial text-xl leading-tight text-[var(--text-primary)]">
              {project.name}
            </h4>
          </div>

          <span className="shrink-0 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-0.5 font-mono text-[8.5px] uppercase tracking-wider text-[var(--text-secondary)]">
            {language === "pt" ? "Somente Compacto" : "Compact Only"}
          </span>
        </div>

        <div className="overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
          <CompactRailPipeline
            nodes={nodes}
            selectedId={selectedId}
            onSelect={onSelect}
            language={language}
            showSecurityNote
          />
        </div>
      </div>
    </div>
  );
}

function DualBlueprintVariant({
  project,
  contextMode,
  language,
}: {
  project: FeaturedProject;
  contextMode: ArchitectureContextMode;
  language: Language;
}) {
  const nodes = getOrderedNodes(project);
  const [selectedId, setSelectedId] = useState<string>(nodes[0]?.id ?? "");

  const selectedIndex = Math.max(
    0,
    nodes.findIndex((n) => n.id === selectedId),
  );
  const selectedNode = nodes[selectedIndex] ?? nodes[0];

  const homeCardPreview = (
    <CompactHomeCompanionFrame
      project={project}
      language={language}
      caption={
        language === "pt"
          ? "Pipeline sincronizado · 4 cols Home"
          : "Synchronized pipeline · 4-col Home"
      }
    >
      <CompactRailPipeline
        nodes={nodes}
        selectedId={selectedId}
        onSelect={setSelectedId}
        language={language}
      />
    </CompactHomeCompanionFrame>
  );

  if (contextMode === "compact") {
    return homeCardPreview;
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
      {/* Left 4 Cols: Upgraded Compact Home Pipeline */}
      <div className="lg:col-span-4">{homeCardPreview}</div>

      {/* Right 8 Cols: Upgraded Case Study 03 / Architecture Blueprint */}
      <div className="lg:col-span-8">
        <div className="mb-2 flex items-center justify-between font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <span>
            {language === "pt"
              ? "Simulação · Seção 03 / Arquitetura (Página do Projeto)"
              : "Simulation · Section 03 / Architecture (Project Page)"}
          </span>
          <span>
            {language === "pt"
              ? "Sincronizado com o card ao lado"
              : "Synced with Home card"}
          </span>
        </div>

        <div className="bento-card p-5 sm:p-6 space-y-5">
          {/* Mini Horizontal Topology Ribbon */}
          <div className="rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5">
            <div className="mb-2.5 flex items-center justify-between font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
              <span>DATA FLOW TOPOLOGY</span>
              <span>
                {selectedNode?.item.provider} · {selectedNode?.item.protocol}
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center gap-1.5 md:gap-0">
              {nodes.map((node, idx) => {
                const isSelected = node.id === selectedNode?.id;
                const isLast = idx === nodes.length - 1;
                const RoleIcon = ROLE_ICON[node.role];

                return (
                  <div
                    key={node.id}
                    className="flex flex-1 min-w-0 flex-col md:flex-row md:items-center"
                  >
                    <button
                      type="button"
                      onClick={() => setSelectedId(node.id)}
                      className={`cursor-pointer min-w-0 flex-1 rounded-[2px] border px-2.5 py-2 text-left transition-all ${
                        isSelected
                          ? "border-[var(--text-primary)] bg-[var(--bg-bento)] shadow-2xs"
                          : "border-[var(--border-subtle)] bg-transparent opacity-65 hover:opacity-100"
                      }`}
                    >
                      <div className="flex items-center justify-between gap-1.5 font-mono text-[9px] text-[var(--text-muted)] min-w-0">
                        <span className="inline-flex items-center gap-1 shrink-0">
                          <RoleIcon className="h-2.5 w-2.5" />
                          <span>0{idx + 1}</span>
                        </span>
                        <span className="truncate font-semibold text-[var(--text-primary)]">
                          {node.item.provider}
                        </span>
                      </div>
                      <div className="mt-1 truncate text-[11px] font-medium text-[var(--text-primary)]">
                        {node.item.layer[language]}
                      </div>
                    </button>

                    {!isLast && (
                      <div className="hidden md:flex shrink-0">
                        <ConnectorBridgeSVG
                          orientation="horizontal"
                          active={idx === selectedIndex || idx + 1 === selectedIndex}
                          pulseDelay={idx * 0.25}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>

          {/* Synchronized Full Matrix of Architecture Layers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {nodes.map((node, idx) => {
              const isSelected = node.id === selectedNode?.id;
              return (
                <button
                  key={node.id}
                  type="button"
                  onClick={() => setSelectedId(node.id)}
                  className={`cursor-pointer flex h-full flex-col justify-between rounded-[3px] border p-4 text-left transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--text-primary)]/60 bg-[var(--bg-primary)] ring-1 ring-[var(--text-primary)]/15 opacity-100"
                      : "border-[var(--border-subtle)] bg-[var(--bg-primary)]/60 opacity-65 hover:opacity-95"
                  }`}
                >
                  <div>
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">
                        LAYER 0{idx + 1}
                      </span>
                      {node.item.protocol && (
                        <span className="rounded-[2px] bg-[var(--bg-bento)] px-1.5 py-0.5 font-mono text-[8.5px] text-[var(--text-secondary)]">
                          {node.item.protocol}
                        </span>
                      )}
                    </div>

                    <h4 className="mt-2 font-editorial text-xl sm:text-2xl leading-snug text-[var(--text-primary)]">
                      {node.item.layer[language]}
                    </h4>

                    <p className="mt-2 text-xs leading-relaxed text-[var(--text-secondary)]">
                      {node.item.description[language]}
                    </p>

                    {node.item.securityNote && (
                      <div className="mt-2.5 flex items-start gap-1.5 text-[10.5px] text-[var(--text-muted)]">
                        <ShieldCheck className="h-3 w-3 mt-0.5 shrink-0 text-[var(--text-secondary)]" />
                        <span>{node.item.securityNote[language]}</span>
                      </div>
                    )}
                  </div>

                  <div className="mt-4 flex flex-wrap gap-1.5 pt-2 border-t border-[var(--border-subtle)]/60">
                    {node.item.technologies.map((tech) => (
                      <span
                        key={tech}
                        className="rounded-[2px] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[9.5px] text-[var(--text-primary)]"
                      >
                        {tech}
                      </span>
                    ))}
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* DECISÃO FINAL: HÍBRIDO (IDEIA 1 NO DESKTOP + IDEIA 3 NO COMPACTO/MOBILE)   */
/* -------------------------------------------------------------------------- */

function FinalHybridVariant({
  project,
  previewMode,
  language,
}: {
  project: FeaturedProject;
  previewMode: FinalHybridPreviewMode;
  language: Language;
}) {
  const nodes = getOrderedNodes(project);
  const { selectedId, direction, selectLayer } = useDirectionalLayer(nodes);

  const desktopSection = (
    <div>
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Monitor className="h-3.5 w-3.5 text-[var(--text-primary)]" />
          <span>
            {language === "pt"
              ? "/project/:slug · Desktop (≥ 1024px) — Somente Ideia 1 Completa"
              : "/project/:slug · Desktop (≥ 1024px) — Full Idea 1 Only"}
          </span>
        </div>
        <span className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
          hidden → lg:block
        </span>
      </div>

      <NodeTopologyVariant
        project={project}
        contextMode="full"
        language={language}
        controlledSelectedId={selectedId}
        controlledDirection={direction}
        onSelectLayer={selectLayer}
      />
    </div>
  );

  const compactPairGrid = (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start">
      {/* Compacto 1: Card Lateral de 4 Colunas na Home (/) */}
      <CompactHomeCompanionFrame
        project={project}
        language={language}
        caption={
          language === "pt"
            ? "Rota / · Card 4 colunas (Ideia 3)"
            : "Route / · 4-col Card (Idea 3)"
        }
      >
        <CompactRailPipeline
          nodes={nodes}
          selectedId={selectedId}
          onSelect={selectLayer}
          language={language}
        />
      </CompactHomeCompanionFrame>

      {/* Compacto 2: Somente Container Compacto em Mobile (< 1024px) na rota /project/:slug */}
      <CompactProjectMobileFrame
        project={project}
        nodes={nodes}
        selectedId={selectedId}
        onSelect={selectLayer}
        language={language}
      />
    </div>
  );

  const compactContainers = (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]/70 pt-6">
        <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.14em] text-[var(--text-muted)]">
          <Smartphone className="h-3.5 w-3.5 text-[var(--text-primary)]" />
          <span>
            {language === "pt"
              ? "Contextos Compactos · Ideia 3 (Trilha Vertical Sincronizada)"
              : "Compact Contexts · Idea 3 (Synchronized Vertical Rail)"}
          </span>
        </div>
        <span className="font-mono text-[9.5px] text-[var(--text-muted)]">
          {language === "pt"
            ? "Clique em qualquer camada para sincronizar os containers"
            : "Click any layer to keep containers in sync"}
        </span>
      </div>

      {compactPairGrid}
    </div>
  );

  if (previewMode === "desktop-only") {
    return desktopSection;
  }

  if (previewMode === "compact-only") {
    return <div className="-mt-6">{compactPairGrid}</div>;
  }

  if (previewMode === "responsive-live") {
    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 px-3.5 py-2 font-mono text-[10px] text-[var(--text-secondary)]">
          <span>
            {language === "pt"
              ? "Modo Breakpoint Real ativo: redimensione a janela em 1024px (lg) para alternar automaticamente."
              : "Live Breakpoint Mode: resize viewport at 1024px (lg) to watch Desktop ↔ Mobile swap automatically."}
          </span>
          <span className="font-semibold text-[var(--text-primary)]">
            <span className="hidden lg:inline">
              {language === "pt"
                ? "Viewport atual: Desktop (Ideia 1)"
                : "Current: Desktop (Idea 1)"}
            </span>
            <span className="inline lg:hidden">
              {language === "pt"
                ? "Viewport atual: Mobile (Ideia 3 Compacto)"
                : "Current: Mobile (Idea 3 Compact)"}
            </span>
          </span>
        </div>

        {/* Desktop (>= 1024px): Somente Container Completo (Ideia 1) */}
        <div className="hidden lg:block">
          <NodeTopologyVariant
            project={project}
            contextMode="full"
            language={language}
            controlledSelectedId={selectedId}
            controlledDirection={direction}
            onSelectLayer={selectLayer}
          />
        </div>

        {/* Mobile (< 1024px): Somente Container Compacto (Ideia 3) */}
        <div className="block lg:hidden">
          <CompactProjectMobileFrame
            project={project}
            nodes={nodes}
            selectedId={selectedId}
            onSelect={selectLayer}
            language={language}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {desktopSection}
      {compactContainers}
    </div>
  );
}

/* -------------------------------------------------------------------------- */
/* PUBLIC DESIGN LAB STAGE EXPORT                                             */
/* -------------------------------------------------------------------------- */

export function ArchitectureFlowPrototypeStage({
  variant,
}: {
  variant: ArchitectureVariantId;
}) {
  const { language } = useLanguage();
  const [selectedSlug, setSelectedSlug] = useState<string>("dailycheckout");
  const [contextMode, setContextMode] =
    useState<ArchitectureContextMode>("full");
  const [finalPreviewMode, setFinalPreviewMode] =
    useState<FinalHybridPreviewMode>("hybrid-all");

  const activeProject =
    featuredProjects.find((p) => p.slug === selectedSlug) ??
    featuredProjects[0];

  const finalModeOptions: {
    id: FinalHybridPreviewMode;
    label: string;
    icon: typeof Monitor;
  }[] = [
    {
      id: "hybrid-all",
      label: language === "pt" ? "Visão Completa (1 + 3)" : "All (1 + 3)",
      icon: Columns2,
    },
    {
      id: "desktop-only",
      label: language === "pt" ? "Desktop · Ideia 1" : "Desktop · Idea 1",
      icon: Monitor,
    },
    {
      id: "compact-only",
      label: language === "pt" ? "Compacto · Ideia 3" : "Compact · Idea 3",
      icon: Smartphone,
    },
    {
      id: "responsive-live",
      label: language === "pt" ? "Breakpoint Real (lg)" : "Live Breakpoint",
      icon: Workflow,
    },
  ];

  return (
    <section className="mx-auto max-w-6xl px-6 py-10 sm:py-14 md:px-10">
      {/* Lab Stage Controls: Project Selector + Context Switcher */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-4 border-b border-[var(--border-subtle)] pb-5">
        {/* Project Selector Pills with Circle-Ring Logos */}
        <div
          role="group"
          aria-label={
            language === "pt" ? "Selecionar projeto" : "Select project"
          }
          className="flex flex-wrap items-center gap-2"
        >
          {featuredProjects.map((proj) => {
            const isSelected = proj.slug === activeProject.slug;
            return (
              <button
                key={proj.slug}
                type="button"
                onClick={() => setSelectedSlug(proj.slug)}
                className={`cursor-pointer inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 font-mono text-[11px] transition-all ${
                  isSelected
                    ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold shadow-xs"
                    : "border-[var(--border-subtle)] bg-[var(--bg-bento)]/70 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                }`}
              >
                <ProjectMark
                  slug={proj.slug}
                  name={proj.name}
                  logo={proj.logo}
                  size="xs"
                  shape="circle-ring"
                  inverted={isSelected}
                />
                <span>{proj.name}</span>
                <span
                  className={`rounded-full px-1.5 py-[1px] text-[9px] tabular-nums ${
                    isSelected
                      ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                      : "bg-[var(--bg-primary)] text-[var(--text-muted)]"
                  }`}
                >
                  {proj.architecture.length}
                </span>
              </button>
            );
          })}
        </div>

        {/* Context Switcher */}
        {variant === "final-hybrid" ? (
          <div
            role="group"
            aria-label={
              language === "pt"
                ? "Modo de visualização da decisão final"
                : "Final decision preview mode"
            }
            className="inline-flex flex-wrap items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-0.5"
          >
            {finalModeOptions.map((opt) => {
              const Icon = opt.icon;
              const isSelected = finalPreviewMode === opt.id;
              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => setFinalPreviewMode(opt.id)}
                  className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    isSelected
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Icon className="h-3 w-3" />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        ) : (
          <div
            role="group"
            aria-label={
              language === "pt"
                ? "Contexto de exibição"
                : "Display context mode"
            }
            className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-0.5"
          >
            <button
              type="button"
              onClick={() => setContextMode("full")}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                contextMode === "full"
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              {variant === "dual-blueprint" ? (
                <Columns2 className="h-3 w-3" />
              ) : (
                <Monitor className="h-3 w-3" />
              )}
              <span>
                {variant === "dual-blueprint"
                  ? language === "pt"
                    ? "Duplo (4 + 8 cols)"
                    : "Dual (4 + 8 cols)"
                  : language === "pt"
                    ? "Full-Width (12 cols · Projeto)"
                    : "Full-Width (12 cols · Project)"}
              </span>
            </button>

            <button
              type="button"
              onClick={() => setContextMode("compact")}
              className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                contextMode === "compact"
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                  : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
              }`}
            >
              <Smartphone className="h-3 w-3" />
              <span>
                {language === "pt"
                  ? "Compacta (4 cols · Home)"
                  : "Compact (4 cols · Home)"}
              </span>
            </button>
          </div>
        )}
      </div>

      {/* Render Selected Architecture Prototype keyed by project slug for clean state reset */}
      {variant === "final-hybrid" && (
        <FinalHybridVariant
          key={`final-hybrid-${activeProject.slug}`}
          project={activeProject}
          previewMode={finalPreviewMode}
          language={language}
        />
      )}

      {variant === "node-topology" && (
        <NodeTopologyVariant
          key={`topology-${activeProject.slug}`}
          project={activeProject}
          contextMode={contextMode}
          language={language}
        />
      )}

      {variant === "request-trace" && (
        <RequestTraceVariant
          key={`trace-${activeProject.slug}`}
          project={activeProject}
          contextMode={contextMode}
          language={language}
        />
      )}

      {variant === "dual-blueprint" && (
        <DualBlueprintVariant
          key={`dual-${activeProject.slug}`}
          project={activeProject}
          contextMode={contextMode}
          language={language}
        />
      )}
    </section>
  );
}
