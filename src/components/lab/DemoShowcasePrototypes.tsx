import { useState } from "react";
import { Link } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  ArrowUpRight,
  ChevronLeft,
  ChevronRight,
  Columns2,
  ExternalLink,
  GitFork,
  Lock,
  Maximize2,
  Monitor,
  Play,
  RotateCcw,
  Smartphone,
  Tablet,
} from "lucide-react";
import { featuredProjects } from "../../data/projects";
import { useLanguage } from "../../context/LanguageContext";
import { ProjectLogo } from "../ui/ProjectVisuals";
import { CompactArchitecturePipeline } from "../project/ProjectArchitectureFlow";
import {
  getOrderedArchitectureNodes,
  useDirectionalLayer,
} from "../project/architectureFlow";

export type DemoShowcaseVariantId =
  | "home-supademo"
  | "supademo-framed"
  | "supademo-clean"
  | "supademo-vs-gallery";

type ViewportPreview = "desktop" | "tablet" | "mobile";
type HomeGridLayout = "bento-8-4" | "full-12";
type HomeEmbedMode = "live-embed" | "route-card";

const CONDONOT_SUPADEMO = {
  embedUrl:
    "https://app.supademo.com/embed/cmwuwhw840s29qmmgjni8rjk2?embed_v=2&utm_source=embed",
  title:
    "Registre e envie notificações de advertência no condomínio com a condonot",
  aspectRatio: 1.79,
  stepsPreview: {
    pt: [
      {
        code: "01",
        title: "Painel & Ações",
        detail: "Inicia nova notificação a partir do centro de operações",
      },
      {
        code: "02",
        title: "Unidade & Regimento",
        detail: "Vincula morador, modelo e artigo do regimento interno",
      },
      {
        code: "03",
        title: "Refinar com IA + A4",
        detail: "Ajusta redação formal respeitando a ocupação da folha A4",
      },
      {
        code: "04",
        title: "PDF & Disparo",
        detail: "Gera carta oficial em PDF e envia e-mail rastreado",
      },
    ],
    en: [
      {
        code: "01",
        title: "Action Center",
        detail: "Starts a new infraction notice from the main dashboard",
      },
      {
        code: "02",
        title: "Unit & Bylaws",
        detail: "Links resident, template and condominium bylaw article",
      },
      {
        code: "03",
        title: "AI Refine + A4",
        detail: "Refines formal text while respecting the A4 page budget",
      },
      {
        code: "04",
        title: "PDF & Delivery",
        detail: "Renders official PDF letter and dispatches tracked email",
      },
    ],
  },
} as const;

const VIEWPORT_WIDTH_CLASS: Record<ViewportPreview, string> = {
  desktop: "max-w-full",
  tablet: "max-w-3xl mx-auto",
  mobile: "max-w-[390px] mx-auto",
};

interface SupademoFrameProps {
  reloadKey: number;
  withVerticalPadding: boolean;
}

function SupademoIframe({
  reloadKey,
  withVerticalPadding,
}: SupademoFrameProps) {
  return (
    <div
      style={{
        position: "relative",
        boxSizing: "content-box",
        maxHeight: "80svh",
        width: "100%",
        aspectRatio: String(CONDONOT_SUPADEMO.aspectRatio),
        padding: withVerticalPadding ? "40px 0 40px 0" : "0",
      }}
    >
      <iframe
        key={reloadKey}
        src={CONDONOT_SUPADEMO.embedUrl}
        loading="lazy"
        title={CONDONOT_SUPADEMO.title}
        allow="clipboard-write; fullscreen"
        allowFullScreen
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          border: 0,
        }}
      />
    </div>
  );
}

/**
 * Interactive Product Demo prototyping stage for `/lab`.
 * - Home route (`/`) prototype with NO screenshots, embedding Supademo directly (8+4 or 12 cols)
 *   or using a zero-screenshot editorial launcher card to `/project/condonot#flows`.
 * - Case Study (`/project/condonot#flows`) framed Supademo with 0px embed padding default.
 */
export function DemoShowcasePrototypeStage({
  variant,
  onSelectVariant,
}: {
  variant: DemoShowcaseVariantId;
  onSelectVariant?: (next: DemoShowcaseVariantId) => void;
}) {
  const { language, t } = useLanguage();
  const condonot =
    featuredProjects.find((p) => p.slug === "condonot") ?? featuredProjects[0];

  const [viewport, setViewport] = useState<ViewportPreview>("desktop");
  const [withVerticalPadding, setWithVerticalPadding] = useState(false);
  const [reloadKey, setReloadKey] = useState(0);
  const [compareMode, setCompareMode] = useState<"supademo" | "gallery">(
    "supademo",
  );
  const [homeGrid, setHomeGrid] = useState<HomeGridLayout>("bento-8-4");
  const [homeEmbedMode, setHomeEmbedMode] =
    useState<HomeEmbedMode>("live-embed");
  const [simulatedOpenFromHome, setSimulatedOpenFromHome] = useState(false);

  const handleOpenDemoFromHome = () => {
    setSimulatedOpenFromHome(true);
    onSelectVariant?.("supademo-framed");
  };

  const handleBackToHomePreview = () => {
    setSimulatedOpenFromHome(false);
    onSelectVariant?.("home-supademo");
  };

  const isHomeVariant = variant === "home-supademo";

  return (
    <section className="mx-auto w-full max-w-6xl px-6 py-10 sm:py-14 md:px-10">
      {/* Return banner when jumping from Home route-card simulation into the Framed Case */}
      {!isHomeVariant && simulatedOpenFromHome && (
        <div className="mb-5 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--text-primary)]/25 bg-[var(--bg-bento)] px-4 py-2.5">
          <div className="flex items-center gap-2.5 font-mono text-[11px] text-[var(--text-primary)]">
            <span className="h-2 w-2 rounded-full bg-emerald-500" />
            <span>
              Simulação de rota:{" "}
              <strong>/project/condonot#flows</strong> (iframe carregado sob demanda)
            </span>
          </div>
          <button
            type="button"
            onClick={handleBackToHomePreview}
            className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ArrowLeft className="h-3 w-3" />
            <span>Voltar ao preview da Home</span>
          </button>
        </div>
      )}

      {/* Lab Utility Toolbar */}
      <div className="mb-8 flex flex-wrap items-center justify-between gap-3 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 px-3.5 py-2.5">
        <div className="flex items-center gap-3">
          <ProjectLogo
            slug={condonot.slug}
            name={condonot.name}
            logo={condonot.logo}
            size="sm"
          />
          <span className="hidden sm:inline-block h-4 w-px bg-[var(--border-subtle)]" />
          <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
            {isHomeVariant
              ? "Home (/) · Sem Screenshots · Supademo HTML"
              : "Case /project/condonot#flows · Supademo HTML"}
          </span>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isHomeVariant ? (
            <>
              {/* Home Grid Proportion Switcher: 8+4 vs Full-Width 12 cols */}
              <div
                role="group"
                aria-label="Proporção do grid na Home"
                className="inline-flex items-center gap-0.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setHomeGrid("bento-8-4")}
                  className={`cursor-pointer inline-flex items-center gap-1 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    homeGrid === "bento-8-4"
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Columns2 className="h-3 w-3" />
                  <span>8+4 (Embed + Arq.)</span>
                </button>
                <button
                  type="button"
                  onClick={() => setHomeGrid("full-12")}
                  className={`cursor-pointer inline-flex items-center gap-1 rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    homeGrid === "full-12"
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  <Maximize2 className="h-3 w-3" />
                  <span>12 cols (Largura Total)</span>
                </button>
              </div>

              {/* Embed directly vs Zero-Screenshot Launcher Card */}
              <div
                role="group"
                aria-label="Modo do embed na Home"
                className="inline-flex items-center gap-0.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setHomeEmbedMode("live-embed")}
                  className={`cursor-pointer rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    homeEmbedMode === "live-embed"
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Embed Direto
                </button>
                <button
                  type="button"
                  onClick={() => setHomeEmbedMode("route-card")}
                  className={`cursor-pointer rounded-[2px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                    homeEmbedMode === "route-card"
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                  }`}
                >
                  Card Leve → Rota
                </button>
              </div>

              {homeEmbedMode === "live-embed" && (
                <>
                  <button
                    type="button"
                    onClick={() => setWithVerticalPadding((prev) => !prev)}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span>
                      Padding:{" "}
                      <strong className="text-[var(--text-primary)]">
                        {withVerticalPadding ? "40px" : "0px"}
                      </strong>
                    </span>
                  </button>

                  <button
                    type="button"
                    onClick={() => setReloadKey((prev) => prev + 1)}
                    className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <RotateCcw className="h-3 w-3" />
                    <span>Reiniciar</span>
                  </button>
                </>
              )}
            </>
          ) : (
            <>
              {/* Simulated Viewport Switcher */}
              <div
                role="group"
                aria-label="Simular largura da tela"
                className="inline-flex items-center gap-0.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-0.5"
              >
                {(
                  [
                    { id: "desktop", label: "Desktop", icon: Monitor },
                    { id: "tablet", label: "Tablet", icon: Tablet },
                    { id: "mobile", label: "Mobile", icon: Smartphone },
                  ] as const
                ).map((item) => {
                  const Icon = item.icon;
                  const isActive = viewport === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setViewport(item.id)}
                      className={`cursor-pointer inline-flex items-center gap-1 rounded-[2px] px-2 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        isActive
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Icon className="h-3 w-3" />
                      <span className="hidden sm:inline">{item.label}</span>
                    </button>
                  );
                })}
              </div>

              {/* Toggle 40px vs 0px vertical embed padding */}
              <button
                type="button"
                onClick={() => setWithVerticalPadding((prev) => !prev)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <span>
                  Padding Embed:{" "}
                  <strong className="text-[var(--text-primary)]">
                    {withVerticalPadding ? "40px" : "0px"}
                  </strong>
                </span>
              </button>

              {/* Reload iframe to restart tour from step 1 */}
              <button
                type="button"
                onClick={() => setReloadKey((prev) => prev + 1)}
                className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
              >
                <RotateCcw className="h-3 w-3" />
                <span>Reiniciar</span>
              </button>
            </>
          )}
        </div>
      </div>

      {/* Stage Content */}
      {isHomeVariant ? (
        <motion.div
          key={`home-${homeGrid}-${homeEmbedMode}`}
          initial={{ opacity: 0, y: 6 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
        >
          <HomeSupademoShowcase
            project={condonot}
            language={language}
            gridLayout={homeGrid}
            embedMode={homeEmbedMode}
            reloadKey={reloadKey}
            withVerticalPadding={withVerticalPadding}
            onSimulateOpenCase={handleOpenDemoFromHome}
          />
        </motion.div>
      ) : (
        <>
          {/* Simulated Section 02 Header (same rhythm as ProjectDetail) */}
          <div className="mb-8 max-w-2xl">
            <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
              02 / {t.projectDetail.toc.flows}
            </span>
            <h2 className="mt-3 font-editorial text-3xl sm:text-4xl leading-[1.15] text-[var(--text-primary)]">
              {t.projectDetail.sections.flowsTitle}
            </h2>
            <p className="mt-2.5 text-sm sm:text-base leading-relaxed text-[var(--text-secondary)]">
              {t.projectDetail.sections.flowsSubtitle}
            </p>
          </div>

          <motion.div
            key={`${variant}-${viewport}`}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
            className={`w-full transition-all duration-300 ${VIEWPORT_WIDTH_CLASS[viewport]}`}
          >
            {variant === "supademo-framed" && (
              <FramedSupademoShowcase
                project={condonot}
                reloadKey={reloadKey}
                withVerticalPadding={withVerticalPadding}
                demoActionLabel={t.projectsSection.liveWebsite}
              />
            )}

            {variant === "supademo-clean" && (
              <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/40 p-2 sm:p-4 overflow-hidden">
                <SupademoIframe
                  reloadKey={reloadKey}
                  withVerticalPadding={withVerticalPadding}
                />
              </div>
            )}

            {variant === "supademo-vs-gallery" && (
              <div className="space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div
                    role="group"
                    aria-label="Alternar modo de demonstração"
                    className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] p-1"
                  >
                    <button
                      type="button"
                      onClick={() => setCompareMode("supademo")}
                      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        compareMode === "supademo"
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <Play className="h-3 w-3" />
                      <span>Tour Interativo (Supademo HTML)</span>
                    </button>
                    <button
                      type="button"
                      onClick={() => setCompareMode("gallery")}
                      className={`cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] px-3 py-1 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        compareMode === "gallery"
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      <span>Galeria Estática Atual</span>
                    </button>
                  </div>

                  <a
                    href={CONDONOT_SUPADEMO.embedUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                  >
                    <span>Abrir embed em nova aba</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>

                {compareMode === "supademo" ? (
                  <FramedSupademoShowcase
                    project={condonot}
                    reloadKey={reloadKey}
                    withVerticalPadding={withVerticalPadding}
                    demoActionLabel={t.projectsSection.liveWebsite}
                  />
                ) : (
                  <CurrentGalleryPreview
                    project={condonot}
                    language={language}
                    demoActionLabel={t.projectsSection.liveWebsite}
                  />
                )}
              </div>
            )}
          </motion.div>
        </>
      )}
    </section>
  );
}

/* -------------------------------------------------------------------------- */
/* HOME SHOWCASE PROTOTYPE — ZERO SCREENSHOTS, SUPADEMO HTML DIRECTLY ON /    */
/* -------------------------------------------------------------------------- */

function HomeSupademoShowcase({
  project,
  language,
  gridLayout,
  embedMode,
  reloadKey,
  withVerticalPadding,
  onSimulateOpenCase,
}: {
  project: (typeof featuredProjects)[number];
  language: "pt" | "en";
  gridLayout: HomeGridLayout;
  embedMode: HomeEmbedMode;
  reloadKey: number;
  withVerticalPadding: boolean;
  onSimulateOpenCase: () => void;
}) {
  const { t } = useLanguage();
  const isPt = language === "pt";
  const flowsUrl = `/project/${project.slug}#flows`;

  const archNodes = getOrderedArchitectureNodes(project);
  const { selectedId, selectLayer } = useDirectionalLayer(archNodes);
  const steps = CONDONOT_SUPADEMO.stepsPreview[language];

  const renderMainDemoCard = () => (
    <div className="bento-card flex h-full flex-col justify-between overflow-hidden p-3 sm:p-4">
      {/* Card Top Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
          <Monitor className="h-3.5 w-3.5 text-[var(--text-muted)]" strokeWidth={1.75} />
          <span>
            {isPt
              ? "Demonstração Interativa HTML"
              : "Interactive HTML Demo"}
          </span>
        </div>

        <Link
          to={flowsUrl}
          className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
        >
          <span>{isPt ? "Abrir em tela dedicada" : "Open full walkthrough"}</span>
          <ArrowUpRight className="h-3 w-3" />
        </Link>
      </div>

      {/* Browser Window Frame — Zero Screenshots */}
      <div className="flex flex-1 flex-col overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-sm">
        {/* Window Titlebar */}
        <div className="flex h-8 shrink-0 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 font-mono text-[10px] text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
          </div>

          <div className="hidden sm:inline-flex items-center gap-1.5 truncate px-2 text-[10px] text-[var(--text-secondary)]">
            <Lock className="h-2.5 w-2.5 shrink-0" strokeWidth={1.8} />
            <span className="truncate">
              https://{project.appDomain}/notificacoes/nova
            </span>
          </div>

          <span className="inline-flex items-center gap-1.5 text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>{embedMode === "live-embed" ? "Ao vivo" : "Sob demanda"}</span>
          </span>
        </div>

        {/* Viewport: Live Supademo Embed OR Zero-Screenshot Editorial Launcher */}
        {embedMode === "live-embed" ? (
          <div className="w-full bg-[var(--bg-primary)]">
            <SupademoIframe
              reloadKey={reloadKey}
              withVerticalPadding={withVerticalPadding}
            />
          </div>
        ) : (
          <div className="flex flex-1 flex-col justify-between bg-[var(--bg-primary)] p-5 sm:p-7">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div className="max-w-lg">
                <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                  {isPt ? "FLUXO INTERATIVO GUIADO" : "GUIDED INTERACTIVE FLOW"}
                </span>
                <h3 className="mt-2 font-editorial text-2xl sm:text-3xl leading-[1.15] text-[var(--text-primary)]">
                  {isPt
                    ? "Percorra a emissão de uma notificação formal direto na interface."
                    : "Walk through formal infraction notice delivery directly inside the UI."}
                </h3>
                <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
                  {isPt
                    ? "Demo interativa em HTML com scroll real e marcadores passo a passo, carregada sob demanda na rota dedicada do projeto."
                    : "Interactive HTML demo with live scrolling and step-by-step markers, loaded on demand in the dedicated project route."}
                </p>
              </div>

              <button
                type="button"
                onClick={onSimulateOpenCase}
                className="group cursor-pointer inline-flex items-center gap-2.5 rounded-full bg-[var(--text-primary)] px-4 py-2.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity shrink-0"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>
                  {isPt ? "Iniciar Demo Interativa" : "Launch Interactive Demo"}
                </span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5" />
              </button>
            </div>

            {/* 4 Step Cards (Pure Editorial UI — Zero Screenshots) */}
            <div className="mt-6 grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              {steps.map((step) => (
                <button
                  key={step.code}
                  type="button"
                  onClick={onSimulateOpenCase}
                  className="group cursor-pointer rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-3 text-left hover:border-[var(--text-primary)]/40 hover:bg-[var(--bg-bento)] transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono text-[10px] text-[var(--text-muted)]">
                      {step.code}
                    </span>
                    <ArrowUpRight className="h-3 w-3 text-[var(--text-muted)] opacity-0 group-hover:opacity-100 transition-opacity" />
                  </div>
                  <div className="mt-1.5 text-xs sm:text-[13px] font-medium text-[var(--text-primary)]">
                    {step.title}
                  </div>
                  <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                    {step.detail}
                  </p>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Bottom Caption Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <span className="text-[var(--text-secondary)]">
          {isPt
            ? "Tour Interativo HTML · Emissão de Notificação de Advertência"
            : "Interactive HTML Tour · Formal Warning Notice Flow"}
        </span>
        <button
          type="button"
          onClick={onSimulateOpenCase}
          className="cursor-pointer inline-flex items-center gap-1 text-[var(--text-primary)] hover:opacity-75 transition-opacity"
        >
          <span>{isPt ? "Expandir no Case" : "Expand in Case Study"}</span>
          <ArrowRight className="h-3 w-3" />
        </button>
      </div>
    </div>
  );

  return (
    <article className="flex flex-col gap-9 sm:gap-11">
      {/* LAYER 1: EXACT HOME EDITORIAL HEADER SPLIT (7 + 5) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-14 items-start">
        <div className="lg:col-span-7 flex flex-col">
          <div className="mb-5 flex items-center gap-3">
            <ProjectLogo
              slug={project.slug}
              name={project.name}
              logo={project.logo}
            />
            <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-[0.14em] text-[var(--text-secondary)]">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
              {isPt ? "Demo Interativa" : "Interactive Demo"}
            </span>
          </div>

          <h2 className="font-editorial text-3xl sm:text-4xl lg:text-[42px] leading-[1.1] tracking-[-0.015em] text-[var(--text-primary)]">
            {project.headline[language]}
          </h2>

          <p className="mt-4 max-w-2xl text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
            {project.summary[language]}
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6">
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

            {project.liveUrl && (
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
            )}
          </div>
        </div>

        {/* Right (5 cols): Metadata */}
        <div className="lg:col-span-5 flex flex-col gap-6 pt-1">
          <dl className="grid grid-cols-2 gap-x-6 gap-y-5">
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
                {project.stack.join(" · ")}
              </dd>
            </div>
          </dl>

          <div>
            <h3 className="font-mono-meta text-[10px] text-[var(--text-muted)]">
              {t.projectsSection.meta.details}
            </h3>
            <p className="mt-2 text-xs sm:text-[13px] leading-relaxed text-[var(--text-secondary)]">
              {project.details[language]}
            </p>
          </div>
        </div>
      </div>

      {/* LAYER 2: ZERO-SCREENSHOT BENTO (8+4 WITH ARCHITECTURE OR FULL 12-COL) */}
      {gridLayout === "bento-8-4" ? (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-5 items-stretch">
          <div className="lg:col-span-8 flex flex-col">
            {renderMainDemoCard()}
          </div>

          {/* 4-Col Companion: Pure Interactive Architecture (No Screenshots) */}
          <div className="lg:col-span-4 flex flex-col">
            <div className="bento-card flex h-full min-h-[420px] lg:min-h-0 flex-col justify-between overflow-hidden p-3 sm:p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
                  <GitFork className="h-3 w-3 text-[var(--text-muted)]" strokeWidth={1.75} />
                  <span>{isPt ? "Arquitetura" : "Architecture"}</span>
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)] tabular-nums">
                  {project.architecture.length} {isPt ? "camadas" : "layers"}
                </span>
              </div>

              <div className="relative flex flex-1 min-h-[350px] lg:min-h-0 flex-col w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
                <div className="flex h-full flex-1 w-full flex-col lg:absolute lg:inset-0">
                  <CompactArchitecturePipeline
                    nodes={archNodes}
                    selectedId={selectedId}
                    onSelect={selectLayer}
                    language={language}
                    headerAction={
                      <Link
                        to={`/project/${project.slug}#architecture`}
                        className="inline-flex items-center gap-1 text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
                      >
                        <span>{isPt ? "Ver completo" : "Full spec"}</span>
                        <ArrowUpRight className="h-2.5 w-2.5" />
                      </Link>
                    }
                  />
                </div>
              </div>

              <div className="mt-3 flex items-center justify-between px-1">
                <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] truncate">
                  {isPt
                    ? "Fluxo de Arquitetura · Clique p/ inspecionar"
                    : "Architecture Flow · Click node to inspect"}
                </span>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="w-full">{renderMainDemoCard()}</div>
      )}
    </article>
  );
}

/* -------------------------------------------------------------------------- */
/* CASE STUDY FRAMED SUPADEMO (0PX PADDING DEFAULT)                           */
/* -------------------------------------------------------------------------- */

function FramedSupademoShowcase({
  project,
  reloadKey,
  withVerticalPadding,
  demoActionLabel,
}: {
  project: (typeof featuredProjects)[number];
  reloadKey: number;
  withVerticalPadding: boolean;
  demoActionLabel: string;
}) {
  return (
    <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] shadow-sm overflow-hidden">
      {/* Window Top Chrome matching ProjectDetail */}
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)] max-w-sm truncate">
          <Lock
            className="h-3 w-3 shrink-0 text-[var(--text-secondary)]"
            strokeWidth={1.8}
          />
          <span className="truncate text-[var(--text-secondary)]">
            https://{project.appDomain ?? `${project.slug}.app`}/notificacoes/nova
          </span>
        </div>

        <div className="shrink-0">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
            >
              <span>{demoActionLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          )}
        </div>
      </div>

      {/* Supademo Embedded Canvas */}
      <div className="w-full bg-[var(--bg-primary)] px-2 sm:px-4">
        <SupademoIframe
          reloadKey={reloadKey}
          withVerticalPadding={withVerticalPadding}
        />
      </div>

      {/* Window Bottom Caption */}
      <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-4 py-2.5 bg-[var(--bg-bento)]/50 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <span className="text-[var(--text-secondary)]">
          Tour Interativo HTML · Emissão de Notificação de Advertência
        </span>
        <span>Interaja ou role dentro da interface</span>
      </div>
    </div>
  );
}

function CurrentGalleryPreview({
  project,
  language,
  demoActionLabel,
}: {
  project: (typeof featuredProjects)[number];
  language: "pt" | "en";
  demoActionLabel: string;
}) {
  const galleryItems = project.gallery ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const currentItem = galleryItems[activeIndex] ?? galleryItems[0];

  if (!currentItem) return null;

  return (
    <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] shadow-sm overflow-hidden">
      <div className="flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] px-4 py-3 bg-[var(--bg-primary)]/80 backdrop-blur-xs">
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
          <span className="h-2.5 w-2.5 rounded-full bg-[var(--border-subtle)]" />
        </div>

        <div className="hidden sm:inline-flex items-center gap-2 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)] max-w-sm truncate">
          <Lock
            className="h-3 w-3 shrink-0 text-[var(--text-secondary)]"
            strokeWidth={1.8}
          />
          <span className="truncate text-[var(--text-secondary)]">
            https://{project.appDomain ?? `${project.slug}.app`}
            {currentItem.appPath ?? ""}
          </span>
        </div>

        <div className="shrink-0">
          {project.liveUrl && (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
            >
              <span>{demoActionLabel}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          )}
        </div>
      </div>

      <div className="flex items-center gap-1.5 overflow-x-auto border-b border-[var(--border-subtle)] px-4 py-2 bg-[var(--bg-primary)]/50 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
        {galleryItems.map((scr, idx) => (
          <button
            key={scr.id}
            type="button"
            onClick={() => setActiveIndex(idx)}
            className={`cursor-pointer shrink-0 rounded-[3px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
              idx === activeIndex
                ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]/40"
            }`}
          >
            {scr.label[language].split("&")[0].trim()}
          </button>
        ))}
      </div>

      <div className="group/gallery relative w-full bg-[var(--bg-primary)] overflow-hidden select-none">
        <div className="relative aspect-[16/10] sm:aspect-[16/9] w-full p-2.5 sm:p-4 flex items-center justify-center">
          <div className="relative flex h-full w-full items-center justify-center overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]">
            <AnimatePresence mode="wait" initial={false}>
              <motion.img
                key={currentItem.id}
                src={currentItem.src}
                alt={currentItem.label[language]}
                initial={{ opacity: 0, filter: "blur(4px)" }}
                animate={{ opacity: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0, filter: "blur(4px)" }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-contain object-top block"
              />
            </AnimatePresence>
          </div>

          <button
            type="button"
            onClick={() =>
              setActiveIndex(
                (prev) => (prev - 1 + galleryItems.length) % galleryItems.length,
              )
            }
            aria-label="Tela anterior"
            className="cursor-pointer absolute left-6 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() =>
              setActiveIndex((prev) => (prev + 1) % galleryItems.length)
            }
            aria-label="Próxima tela"
            className="cursor-pointer absolute right-6 top-1/2 -translate-y-1/2 inline-flex h-8 w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] border border-[var(--border-subtle)] shadow-md opacity-0 group-hover/gallery:opacity-100 transition-opacity"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}
