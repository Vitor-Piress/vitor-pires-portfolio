import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Activity,
  ArrowLeft,
  ChevronLeft,
  ChevronRight,
  Columns2,
  Columns3,
  ExternalLink,
  GalleryHorizontal,
  Layers,
  LayoutGrid,
  LayoutList,
  LayoutPanelTop,
  Maximize,
  MonitorPlay,
  Moon,
  PanelTop,
  Play,
  Rows3,
  SlidersHorizontal,
  Sparkles,
  SplitSquareHorizontal,
  Sun,
  Type,
  Workflow,
  Check,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import { featuredProjects } from "../data/projects";
import { useLanguage } from "../context/LanguageContext";
import { useTheme } from "../context/ThemeContext";
import { ProjectLogo } from "../components/ui/ProjectVisuals";
import { ProjectBentoShowcase } from "../components/home/ProjectBentoShowcase";
import { EditorialBentoShowcase } from "../components/home/EditorialBentoShowcase";
import {
  useProjectLinkClickHandler,
  useRestoreReturnScroll,
} from "../utils/returnNavigation";
import { HeroSection } from "../components/home/HeroSection";
import {
  HeroCompactSplitPrototype,
  HeroGridEditorialPrototype,
} from "../components/lab/HeroPrototypes";
import {
  TechStackPrototypeStage,
  type StackVariantId,
} from "../components/lab/TechStackPrototypes";
import {
  ProjectCarouselPrototypeStage,
  type ProjectCarouselVariantId,
} from "../components/lab/ProjectCarouselPrototypes";
import {
  ArchitectureFlowPrototypeStage,
  type ArchitectureVariantId,
} from "../components/lab/ArchitectureFlowPrototypes";
import {
  DemoShowcasePrototypeStage,
  type DemoShowcaseVariantId,
} from "../components/lab/DemoShowcasePrototypes";

type LabScope =
  | "demo"
  | "architecture"
  | "carousel"
  | "stack"
  | "hero"
  | "projects";

type HeroVariantId = "typographic-balance" | "grid-7-5" | "compact-split";

type VariantId =
  | "editorial-bento"
  | "tabs"
  | "stacked"
  | "slider"
  | "fullwidth"
  | "bento";

type ProjectFilter =
  | "all"
  | "condonot"
  | "moradas-do-gabriel"
  | "dailycheckout"
  | "fixflow";

interface DemoVariantOption {
  id: DemoShowcaseVariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const DEMO_VARIANTS: DemoVariantOption[] = [
  {
    id: "home-supademo",
    label: "Home (/) · Supademo Sem Screenshots",
    subtitle:
      "Remove completamente as screenshots da Home e coloca o embed interativo do Supademo direto na moldura (com opção de comparar 8+4 vs 12 cols ou card leve → rota)",
    icon: LayoutPanelTop,
    tag: "Novo Teste",
  },
  {
    id: "supademo-framed",
    label: "Case · Supademo na Moldura (0px)",
    subtitle:
      "Embed HTML interativo do Condonot encaixado dentro da moldura editorial de janela do /project/:slug com padding 0px por padrão",
    icon: MonitorPlay,
    tag: "Favorito Case",
  },
  {
    id: "supademo-clean",
    label: "Case · Supademo Direto (Sem Moldura)",
    subtitle:
      "Embed direto sem barra superior de janela duplicada, mantendo o aspect-ratio 1.79 do snippet",
    icon: Play,
    tag: "Alternativa",
  },
  {
    id: "supademo-vs-gallery",
    label: "Comparativo · Supademo vs Galeria Atual",
    subtitle:
      "Alterna instantaneamente entre o Tour Interativo em HTML (Supademo) e a galeria de capturas estáticas atual no mesmo bloco",
    icon: SplitSquareHorizontal,
    tag: "Antes / Depois",
  },
];

interface ArchitectureVariantOption {
  id: ArchitectureVariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const ARCHITECTURE_VARIANTS: ArchitectureVariantOption[] = [
  {
    id: "final-hybrid",
    label: "Decisão Final · Ideia 1 (Desktop) + Ideia 3 (Compacto)",
    subtitle:
      "Em /project/:slug: somente Ideia 1 no Desktop (≥ 1024px) e somente Ideia 3 Compacto no Mobile (< 1024px); na Home (/): Ideia 3 Compacto no card de 4 cols",
    icon: Sparkles,
    tag: "Decisão Final",
  },
  {
    id: "node-topology",
    label: "Ideia 1 · Topologia de Nós + Pulso SVG",
    subtitle:
      "Nós interativos (Edge → Front-end → API/Auth → Banco) conectados por linhas ortogonais com pulso de pacotes e inspetor técnico",
    icon: Workflow,
    tag: "Desktop Base",
  },
  {
    id: "request-trace",
    label: "Ideia 2 · Simulador Request Trace",
    subtitle:
      "Simulador passo a passo (Play / Passo) que ilumina nós, conexões e payloads reais em fluxos como Neon Auth, Render API ou Resend + RLS",
    icon: Activity,
    tag: "Alternativa",
  },
  {
    id: "dual-blueprint",
    label: "Ideia 3 · Blueprint Duplo (4 + 8 cols)",
    subtitle:
      "Visualiza lado a lado o mini-pipeline sincronizado no Card da Home (4 cols) e a matriz de arquitetura expandida da página do projeto",
    icon: Columns2,
    tag: "Compacto Base",
  },
];

interface CarouselVariantOption {
  id: ProjectCarouselVariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const CAROUSEL_VARIANTS: CarouselVariantOption[] = [
  {
    id: "carousel-peek-fade",
    label: "Ideia 4 · Peek Fade + Setas",
    subtitle:
      "Projeto ativo centralizado com os vizinhos (anterior e próximo) em fade nas extremidades + setas laterais de navegação",
    icon: GalleryHorizontal,
    tag: "Alternativa",
  },
  {
    id: "carousel-tabs",
    label: "Ideia 1 · Barra de Projetos + Setas",
    subtitle:
      "1 projeto por vez no mesmo design com abas numeradas visíveis no topo, setas ← → e barra de progresso na base",
    icon: SlidersHorizontal,
    tag: "Ativo na Home",
  },
  {
    id: "carousel-cards",
    label: "Ideia 2 · Palco + Mini-Cards",
    subtitle:
      "Palco completo acima + grade compacta de cards na base mostrando todos os projetos publicados para troca instantânea",
    icon: LayoutGrid,
    tag: "Visual",
  },
  {
    id: "carousel-dual",
    label: "Ideia 3 · Modo Duplo (Carrossel / Lista)",
    subtitle:
      "Começa compacto em carrossel de 1 projeto, mas deixa o visitante alternar para 'Ver todos' em lista vertical",
    icon: Columns2,
    tag: "Flexível",
  },
  {
    id: "stacked-current",
    label: "Lista Vertical (Legado)",
    subtitle:
      "Todos os 3 projetos empilhados verticalmente para comparar a redução de scroll",
    icon: LayoutList,
    tag: "Legado",
  },
];

interface StackVariantOption {
  id: StackVariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const STACK_VARIANTS: StackVariantOption[] = [
  {
    id: "columns-3",
    label: "Opção 1 · 3 Colunas Arquiteturais",
    subtitle:
      "3 blocos verticais lado a lado (Front-end, Back-end & Dados, Infra & Ambiente) no mesmo grid de 3 colunas da seção Credibilidade",
    icon: Columns3,
    tag: "Ativo na Home",
  },
  {
    id: "editorial-rows",
    label: "Opção 2 · Ficha Editorial 4+8",
    subtitle:
      "3 faixas horizontais com contexto da camada na esquerda (4 cols) e os 4 cards Bento da área na direita (8 cols)",
    icon: Rows3,
    tag: "Alternativa",
  },
  {
    id: "grouped-bento",
    label: "Opção 3 · Grade Agrupada",
    subtitle:
      "Mantém os cards Bento atuais em grid de 4 colunas divididos em 3 blocos com subtítulo monoespaçado por camada",
    icon: LayoutGrid,
    tag: "Alternativa",
  },
  {
    id: "current",
    label: "Grade Anterior (Legado)",
    subtitle:
      "Grade única anterior de 12 cards (01 a 12) preservada para comparação direta",
    icon: SlidersHorizontal,
    tag: "Legado",
  },
];

interface HeroVariantOption {
  id: HeroVariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const HERO_VARIANTS: HeroVariantOption[] = [
  {
    id: "typographic-balance",
    label: "Opção 3 · Escala & Base Alinhada",
    subtitle:
      "Subtítulo itálico um degrau abaixo do título principal, meta curta no topo, links à direita dos botões e animações originais",
    icon: Type,
    tag: "Ativo na Home",
  },
  {
    id: "grid-7-5",
    label: "Opção 1 · Grid Editorial 7+5",
    subtitle:
      "Espelha as 12 colunas dos projetos: narrativa/botões na esquerda (7 cols) + ficha de status, horário e links à direita (5 cols)",
    icon: Columns2,
    tag: "Alternativa",
  },
  {
    id: "compact-split",
    label: "Opção 2 · Meta Dividida",
    subtitle:
      "1 coluna clássica mais compacta, separando disponibilidade (esq.) e relógio (dir.) no topo + assinatura de links na base",
    icon: PanelTop,
    tag: "Alternativa",
  },
];

interface VariantOption {
  id: VariantId;
  label: string;
  subtitle: string;
  icon: typeof LayoutGrid;
  tag: string;
}

const VARIANTS: VariantOption[] = [
  {
    id: "editorial-bento",
    label: "Editorial 7+5 + Bento 8+4",
    subtitle:
      "Texto respirando no topo (7+5) e Bento Híbrido abaixo (8 cols Desktop + 4 cols Mobile/Arquitetura) com ritmo alternado",
    icon: LayoutPanelTop,
    tag: "Ativo na Home",
  },
  {
    id: "tabs",
    label: "Hero Stage com Tabs",
    subtitle:
      "Uma janela cinematográfica limpa com abas de contexto para cada tela",
    icon: SlidersHorizontal,
    tag: "Anterior na Home",
  },
  {
    id: "stacked",
    label: "Camadas Sobrepostas (Apple/Stripe)",
    subtitle: "Dashboard ao fundo com o e-mail formal flutuando em perspectiva",
    icon: Layers,
    tag: "Marketing de Produto",
  },
  {
    id: "slider",
    label: "Peek Slider Horizontal",
    subtitle:
      "Trilho horizontal onde a próxima tela fica sutilmente visível na lateral",
    icon: ChevronRight,
    tag: "Galeria Dinâmica",
  },
  {
    id: "fullwidth",
    label: "Editorial Panorâmico (Full-Width)",
    subtitle: "Sem divisão lateral: texto no topo e software em largura total",
    icon: Maximize,
    tag: "Editorial Sênior",
  },
  {
    id: "bento",
    label: "Bento Grid Anterior",
    subtitle: "O layout Bento anterior espremido em 7 cols para comparação direta",
    icon: LayoutGrid,
    tag: "Legado",
  },
];

const PROJECT_FILTERS: { id: ProjectFilter; label: string }[] = [
  { id: "all", label: "Todos (4)" },
  { id: "condonot", label: "Condonot" },
  { id: "moradas-do-gabriel", label: "Moradas" },
  { id: "dailycheckout", label: "Dailycheckout" },
  { id: "fixflow", label: "FixFlow" },
];

export function DesignLab() {
  useRestoreReturnScroll();
  const getLabProjectClick = useProjectLinkClickHandler(() => ({}));
  const [labScope, setLabScope] = useState<LabScope>("demo");
  const [demoVariant, setDemoVariant] =
    useState<DemoShowcaseVariantId>("home-supademo");
  const [architectureVariant, setArchitectureVariant] =
    useState<ArchitectureVariantId>("final-hybrid");
  const [carouselVariant, setCarouselVariant] =
    useState<ProjectCarouselVariantId>("carousel-tabs");
  const [stackVariant, setStackVariant] = useState<StackVariantId>("columns-3");
  const [heroVariant, setHeroVariant] = useState<HeroVariantId>(
    "typographic-balance",
  );
  const [showTransitionPreview, setShowTransitionPreview] = useState(true);
  const [activeVariant, setActiveVariant] =
    useState<VariantId>("editorial-bento");
  const [projectFilter, setProjectFilter] = useState<ProjectFilter>("all");
  const [alternatingRhythm, setAlternatingRhythm] = useState(true);
  const { language, setLanguage, t } = useLanguage();
  const { theme, toggleTheme } = useTheme();

  const visibleProjects =
    projectFilter === "all"
      ? featuredProjects
      : featuredProjects.filter((p) => p.slug === projectFilter);

  const singleProject = visibleProjects[0] ?? featuredProjects[0];

  const scopeVariantMap = {
    demo: {
      options: DEMO_VARIANTS,
      selectedId: demoVariant,
      onSelect: (id: string) => setDemoVariant(id as DemoShowcaseVariantId),
    },
    architecture: {
      options: ARCHITECTURE_VARIANTS,
      selectedId: architectureVariant,
      onSelect: (id: string) =>
        setArchitectureVariant(id as ArchitectureVariantId),
    },
    carousel: {
      options: CAROUSEL_VARIANTS,
      selectedId: carouselVariant,
      onSelect: (id: string) =>
        setCarouselVariant(id as ProjectCarouselVariantId),
    },
    stack: {
      options: STACK_VARIANTS,
      selectedId: stackVariant,
      onSelect: (id: string) => setStackVariant(id as StackVariantId),
    },
    hero: {
      options: HERO_VARIANTS,
      selectedId: heroVariant,
      onSelect: (id: string) => setHeroVariant(id as HeroVariantId),
    },
    projects: {
      options: VARIANTS,
      selectedId: activeVariant,
      onSelect: (id: string) => setActiveVariant(id as VariantId),
    },
  } as const;

  const currentScopeConfig = scopeVariantMap[labScope];
  const currentSelectedVariant =
    currentScopeConfig.options.find(
      (v) => v.id === currentScopeConfig.selectedId,
    ) ?? currentScopeConfig.options[0];
  const showAlternatingToggle =
    labScope === "carousel" ||
    (labScope === "projects" && activeVariant === "editorial-bento");

  return (
    <div className="min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)] transition-colors duration-200">
      {/* Sticky Top Control Header */}
      <header className="sticky top-0 z-50 border-b border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-3 px-4 py-3 sm:px-6">
          <div className="flex items-center gap-3">
            <Link
              to="/"
              className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-secondary)] transition-colors"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              <span>Voltar à Home</span>
            </Link>

            <span className="hidden sm:inline-block h-4 w-px bg-[var(--border-subtle)]" />

            <div className="flex items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--text-primary)]/10 px-2 py-0.5 text-[10px] font-mono uppercase tracking-wider text-[var(--text-secondary)]">
                <Sparkles className="h-3 w-3" />
                Design Lab
              </span>
              <span className="hidden md:inline text-xs font-medium text-[var(--text-primary)]">
                Prototipação de Projetos para a Home
              </span>
            </div>
          </div>

          {/* Right Controls: Scope Toggle + Project Switcher + Lang + Theme */}
          <div className="flex flex-wrap items-center gap-2.5 sm:gap-3">
            {/* Lab Section Scope Switcher: Tech Stack vs Hero vs Projects */}
            <div
              role="group"
              aria-label="Seção em prototipação"
              className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-0.5"
            >
              {(
                [
                  { id: "demo", label: "Demo Interativa" },
                  { id: "architecture", label: "Arquitetura" },
                  { id: "carousel", label: "Carrossel Projetos" },
                  { id: "stack", label: "Tech Stack" },
                  { id: "hero", label: "Hero Section" },
                  { id: "projects", label: "Layouts Bento" },
                ] as const
              ).map((item) => {
                const isActive = labScope === item.id;
                return (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setLabScope(item.id)}
                    className={`cursor-pointer rounded-[2px] px-2.5 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                      isActive
                        ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                        : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                    }`}
                  >
                    {item.label}
                  </button>
                );
              })}
            </div>

            {/* Project Filter Pills (only when inspecting projects) */}
            {labScope === "projects" && (
              <div
                role="group"
                aria-label="Selecionar projeto no Lab"
                className="inline-flex items-center gap-1 rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 p-0.5"
              >
                {PROJECT_FILTERS.map((item) => {
                  const isActive = projectFilter === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => setProjectFilter(item.id)}
                      className={`cursor-pointer rounded-[2px] px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider transition-colors ${
                        isActive
                          ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                          : "text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                      }`}
                    >
                      {item.label}
                    </button>
                  );
                })}
              </div>
            )}

            {/* PT / EN Switcher */}
            <div className="inline-flex items-center gap-1 font-mono text-[11px]">
              <button
                type="button"
                onClick={() => setLanguage("pt")}
                className={`cursor-pointer px-1 ${
                  language === "pt"
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                PT
              </button>
              <span className="text-[var(--text-muted)] opacity-40">/</span>
              <button
                type="button"
                onClick={() => setLanguage("en")}
                className={`cursor-pointer px-1 ${
                  language === "en"
                    ? "text-[var(--text-primary)] font-semibold"
                    : "text-[var(--text-muted)] hover:text-[var(--text-secondary)]"
                }`}
              >
                EN
              </button>
            </div>

            {/* Dark / Light Toggle */}
            <button
              type="button"
              onClick={toggleTheme}
              aria-label="Alternar tema"
              className="cursor-pointer inline-flex h-7 w-7 items-center justify-center rounded-full border border-[var(--border-subtle)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {theme === "dark" ? (
                <Sun className="h-3.5 w-3.5" />
              ) : (
                <Moon className="h-3.5 w-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Variant Switcher Pills */}
        <div className="mx-auto max-w-7xl overflow-x-auto px-4 pb-3 sm:px-6 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          <div className="flex items-center gap-2 min-w-max">
            {currentScopeConfig.options.map((variant) => {
              const Icon = variant.icon;
              const isSelected = currentScopeConfig.selectedId === variant.id;
              return (
                <button
                  key={variant.id}
                  type="button"
                  onClick={() => currentScopeConfig.onSelect(variant.id)}
                  className={`cursor-pointer inline-flex items-center gap-2 rounded-[4px] border px-3 py-1.5 text-xs font-mono transition-all duration-200 ${
                    isSelected
                      ? "border-[var(--text-primary)] bg-[var(--text-primary)] text-[var(--bg-primary)] shadow-sm"
                      : "border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)]"
                  }`}
                >
                  <Icon className="h-3.5 w-3.5" />
                  <span className="font-medium">{variant.label}</span>
                  {isSelected && <Check className="h-3 w-3 ml-0.5" />}
                  <span
                    className={`ml-1 text-[9px] uppercase tracking-wider px-1.5 py-0.2 rounded-full ${
                      isSelected
                        ? "bg-[var(--bg-primary)] text-[var(--text-primary)]"
                        : "bg-[var(--bg-primary)] text-[var(--text-muted)]"
                    }`}
                  >
                    {variant.tag}
                  </span>
                </button>
              );
            })}
          </div>
        </div>
      </header>

      {/* Explanatory Banner */}
      <div className="border-b border-[var(--border-subtle)] bg-[var(--bg-bento)]/40 px-4 py-3 sm:px-6">
        <div className="mx-auto flex max-w-7xl flex-wrap items-center justify-between gap-2">
          <p className="text-xs text-[var(--text-secondary)]">
            <span className="font-semibold text-[var(--text-primary)]">
              {currentSelectedVariant.label}:
            </span>{" "}
            {currentSelectedVariant.subtitle}
          </p>

          {showAlternatingToggle ? (
            <button
              type="button"
              onClick={() => setAlternatingRhythm((prev) => !prev)}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>
                Ritmo Bento:{" "}
                <strong className="text-[var(--text-primary)]">
                  {alternatingRhythm
                    ? "Alternado (8+4 / 4+8)"
                    : "Uniforme (8+4)"}
                </strong>
              </span>
            </button>
          ) : labScope === "hero" ? (
            <button
              type="button"
              onClick={() => setShowTransitionPreview((prev) => !prev)}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <span>
                Contexto abaixo:{" "}
                <strong className="text-[var(--text-primary)]">
                  {showTransitionPreview ? "Hero + Projetos" : "Só Hero"}
                </strong>
              </span>
            </button>
          ) : (
            <span className="text-[10px] font-mono text-[var(--text-muted)]">
              {labScope === "demo"
                ? "Condonot · Supademo HTML Embed (teste desktop, tablet e mobile)"
                : labScope === "architecture"
                  ? "Condonot · Moradas · Dailycheckout (Neon, Render & Cloudflare)"
                  : labScope === "stack"
                    ? "3 camadas × 4 tecnologias (PT/EN & Dark/Light)"
                    : "Testando no layout real da página inicial"}
            </span>
          )}
        </div>
      </div>

      {/* Main Preview Stage */}
      {labScope === "demo" ? (
        <main className="pb-20">
          <DemoShowcasePrototypeStage
            variant={demoVariant}
            onSelectVariant={setDemoVariant}
          />
        </main>
      ) : labScope === "architecture" ? (
        <main className="pb-20">
          <ArchitectureFlowPrototypeStage variant={architectureVariant} />
        </main>
      ) : labScope === "carousel" ? (
        <main className="pb-20">
          <ProjectCarouselPrototypeStage
            variant={carouselVariant}
            alternatingRhythm={alternatingRhythm}
          />
        </main>
      ) : labScope === "stack" ? (
        <main className="pb-20">
          <TechStackPrototypeStage variant={stackVariant} />
        </main>
      ) : labScope === "hero" ? (
        <main className="pb-20">
          {heroVariant === "typographic-balance" && (
            <HeroSection compactTop projectsTargetId="lab-projects-preview" />
          )}
          {heroVariant === "grid-7-5" && <HeroGridEditorialPrototype />}
          {heroVariant === "compact-split" && <HeroCompactSplitPrototype />}

          {showTransitionPreview && (
            <section
              id="lab-projects-preview"
              className="mx-auto w-full max-w-6xl scroll-mt-24 px-6 pt-12 pb-16 sm:pt-16 md:px-10 border-t border-dashed border-[var(--border-subtle)]/70"
            >
              <div className="mb-14 sm:mb-20 flex flex-wrap items-center justify-between gap-2">
                <span className="font-mono-meta text-[11px] text-[var(--text-muted)]">
                  {t.projectsSection.featuredLabel}
                </span>
                <span className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
                  Preview da transição Hero → #projects
                </span>
              </div>

              <EditorialBentoShowcase
                project={featuredProjects[0]}
                index={0}
              />
            </section>
          )}
        </main>
      ) : (
        <main className="mx-auto max-w-6xl px-6 py-12 sm:py-16 md:px-10">
          {activeVariant === "editorial-bento" ? (
            <div className="flex flex-col gap-28 sm:gap-36">
              {visibleProjects.map((proj) => {
                const realIndex = featuredProjects.findIndex(
                  (p) => p.slug === proj.slug,
                );
                return (
                  <EditorialBentoShowcase
                    key={`${proj.slug}-${alternatingRhythm}`}
                    project={proj}
                    index={realIndex >= 0 ? realIndex : 0}
                    alternatingRhythm={alternatingRhythm}
                  />
                );
              })}
            </div>
          ) : activeVariant === "fullwidth" ? (
            <div className="flex flex-col gap-24">
              {visibleProjects.map((proj) => (
                <VariantEditorialFullWidth
                  key={proj.slug}
                  project={proj}
                  language={language}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-28">
              {(projectFilter === "all"
                ? visibleProjects
                : [singleProject]
              ).map((proj) => (
                <article
                  key={proj.slug}
                  className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-start"
                >
                  {/* Left Column: Context & Metadata (Legacy Home layout) */}
                  <div className="lg:col-span-5 flex flex-col">
                    <div className="mb-6">
                      <ProjectLogo
                        slug={proj.slug}
                        name={proj.name}
                        logo={proj.logo}
                      />
                    </div>

                    <h2 className="font-editorial text-3xl sm:text-[36px] leading-[1.14] tracking-[-0.01em] text-[var(--text-primary)]">
                      {proj.headline[language]}
                    </h2>

                    <p className="mt-5 text-sm sm:text-[15px] leading-relaxed text-[var(--text-secondary)]">
                      {proj.summary[language]}
                    </p>

                    <div className="mt-7 flex flex-wrap items-center gap-6">
                      <Link
                        to={`/project/${proj.slug}`}
                        onClick={getLabProjectClick(`/project/${proj.slug}`)}
                        className="group inline-flex items-center gap-2 font-mono text-xs text-[var(--text-primary)]"
                      >
                        <span className="underline decoration-[var(--border-subtle)] underline-offset-4 group-hover:decoration-[var(--text-primary)] transition-colors">
                          View Project Details
                        </span>
                        <ExternalLink className="h-3 w-3" />
                      </Link>
                    </div>

                    <dl className="mt-10 grid grid-cols-2 gap-x-6 gap-y-7 border-t border-[var(--border-subtle)] pt-8">
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Categoria
                        </dt>
                        <dd className="mt-1.5 text-xs text-[var(--text-primary)]">
                          {proj.category[language]}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Função
                        </dt>
                        <dd className="mt-1.5 text-xs text-[var(--text-primary)]">
                          {proj.role[language]}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Ano
                        </dt>
                        <dd className="mt-1.5 text-xs text-[var(--text-primary)]">
                          {proj.year}
                        </dd>
                      </div>
                      <div>
                        <dt className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
                          Stack
                        </dt>
                        <dd className="mt-1.5 text-xs text-[var(--text-primary)]">
                          {proj.stack.join(" · ")}
                        </dd>
                      </div>
                    </dl>
                  </div>

                  {/* Right Column: Active Prototype Variant */}
                  <div className="lg:col-span-7 w-full">
                    {activeVariant === "tabs" && (
                      <VariantHeroTabs project={proj} language={language} />
                    )}
                    {activeVariant === "stacked" && (
                      <VariantStackedLayers
                        project={proj}
                        language={language}
                      />
                    )}
                    {activeVariant === "slider" && (
                      <VariantPeekSlider project={proj} language={language} />
                    )}
                    {activeVariant === "bento" && (
                      <ProjectBentoShowcase
                        projectSlug={proj.slug}
                        blocks={proj.bento ?? []}
                      />
                    )}
                  </div>
                </article>
              ),
            )}
          </div>
        )}
        </main>
      )}
    </div>
  );
}

// -------------------------------------------------------------------------------------
// VARIANTE 1: Hero Stage com Tabs de Navegação Rápida, Pan & Zoom e Altura Dinâmica
// -------------------------------------------------------------------------------------
function VariantHeroTabs({
  project,
  language,
}: {
  project: (typeof featuredProjects)[0];
  language: "pt" | "en";
}) {
  const screens = project.gallery ?? [];
  const [activeIndex, setActiveIndex] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isZoomed, setIsZoomed] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  const currentScreen = screens[activeIndex] ?? screens[0];
  const isPortrait = Boolean(
    currentScreen?.orientation === "portrait" ||
    currentScreen?.src?.includes("gmail") ||
    currentScreen?.id === "email",
  );

  // Auto-cycle pause on hover or when zoomed
  useEffect(() => {
    if (isPaused || isZoomed || screens.length <= 1) return;
    const timer = setInterval(() => {
      setIsZoomed(false);
      setActiveIndex((prev) => (prev + 1) % screens.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [isPaused, isZoomed, screens.length]);

  const handlePrev = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  };

  const handleNext = (e?: React.MouseEvent) => {
    e?.stopPropagation();
    setIsZoomed(false);
    setActiveIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  };

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isZoomed) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(
      0,
      Math.min(100, ((e.clientX - rect.left) / rect.width) * 100),
    );
    const y = Math.max(
      0,
      Math.min(100, ((e.clientY - rect.top) / rect.height) * 100),
    );
    setMousePos({ x, y });
  };

  const handleCanvasClick = () => {
    setIsZoomed((prev) => !prev);
  };

  if (screens.length === 0) {
    return (
      <ProjectBentoShowcase
        projectSlug={project.slug}
        blocks={project.bento ?? []}
      />
    );
  }

  return (
    <div
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => {
        setIsPaused(false);
        setIsZoomed(false);
      }}
      className="bento-card overflow-hidden p-3 sm:p-4 transition-all duration-300"
    >
      {/* Category Pills / Navigation Tabs (scrollbar hidden) */}
      <div className="mb-3 flex items-center justify-between gap-2">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
          {screens.map((scr, idx) => (
            <button
              key={scr.id}
              type="button"
              onClick={() => {
                setIsZoomed(false);
                setActiveIndex(idx);
              }}
              className={`cursor-pointer shrink-0 rounded-[3px] px-2.5 py-1 font-mono text-[10px] uppercase tracking-wider transition-all duration-200 ${
                idx === activeIndex
                  ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold shadow-2xs"
                  : "text-[var(--text-muted)] hover:text-[var(--text-secondary)] hover:bg-[var(--border-subtle)]/40"
              }`}
            >
              {scr.label[language].split("&")[0].trim()}
            </button>
          ))}
        </div>

        {/* Quick Prev / Next Arrows on Header */}
        <div className="hidden sm:flex items-center gap-1 shrink-0">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Tela anterior"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próxima tela"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-muted)] transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Dynamic Animated Window Stage (morphs height for portrait/email vs widescreen) */}
      <div
        className={`group/stage relative w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-sm transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          isPortrait
            ? "aspect-[16/14.5] sm:aspect-[16/13.5]"
            : "aspect-[16/10] sm:aspect-[16/9.5]"
        }`}
      >
        {/* Mock Window Header */}
        <div className="flex h-7 items-center justify-between border-b border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 text-[10px] font-mono text-[var(--text-muted)] select-none">
          <div className="flex items-center gap-1.5">
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
            <span className="h-2 w-2 rounded-full bg-[var(--border-subtle)]" />
          </div>
          <span className="truncate px-2 text-[10px] opacity-75">
            https://{project.appDomain ?? `${project.slug}.app`}
            {currentScreen?.appPath}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-[9px] opacity-50 font-mono">
              {String(activeIndex + 1).padStart(2, "0")}/
              {String(screens.length).padStart(2, "0")}
            </span>
          </div>
        </div>

        {/* Image Canvas with Pan & Zoom */}
        <div
          onClick={handleCanvasClick}
          onMouseMove={handleCanvasMouseMove}
          className={`relative flex h-[calc(100%-28px)] w-full items-center justify-center p-2.5 sm:p-3 bg-[var(--bg-bento)]/30 ${
            isZoomed ? "cursor-zoom-out" : "cursor-zoom-in"
          }`}
        >
          {/* Framed Image Container with overflow hidden */}
          <div
            className={`relative flex h-full w-full items-center justify-center overflow-hidden rounded-[2px] border border-[var(--border-subtle)] ${
              currentScreen?.src?.includes("gmail")
                ? "bg-white"
                : "bg-[var(--bg-primary)]"
            }`}
          >
            <AnimatePresence mode="wait">
              {currentScreen?.src && (
                <motion.img
                  key={currentScreen.id}
                  src={currentScreen.src}
                  alt={currentScreen.label[language]}
                  initial={{ opacity: 0, filter: "blur(3px)" }}
                  animate={{ opacity: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, filter: "blur(3px)" }}
                  transition={{ duration: 0.3 }}
                  style={{
                    transform: isZoomed ? "scale(1.7)" : "scale(1)",
                    transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                    transition: isZoomed
                      ? "transform 0.12s ease-out"
                      : "transform 0.35s cubic-bezier(0.22, 1, 0.36, 1)",
                  }}
                  className={`h-full w-full object-contain ${
                    isPortrait ? "object-center" : "object-top"
                  } block select-none pointer-events-none`}
                  loading="lazy"
                />
              )}
            </AnimatePresence>

            {/* Floating Chevrons on Canvas Sides (hidden while zoomed to not block inspection) */}
            {!isZoomed && screens.length > 1 && (
              <>
                <button
                  type="button"
                  onClick={handlePrev}
                  aria-label="Tela anterior"
                  className="cursor-pointer absolute left-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-all duration-200"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>
                <button
                  type="button"
                  onClick={handleNext}
                  aria-label="Próxima tela"
                  className="cursor-pointer absolute right-2.5 top-1/2 -translate-y-1/2 z-20 inline-flex h-7 w-7 sm:h-8 sm:w-8 items-center justify-center rounded-full bg-[var(--bg-primary)]/85 text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:bg-[var(--bg-primary)] border border-[var(--border-subtle)] shadow-md backdrop-blur-md opacity-0 group-hover/stage:opacity-100 transition-all duration-200"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </>
            )}

            {/* Interactive Zoom Indicator Pill */}
            <div className="pointer-events-none absolute bottom-2.5 right-2.5 z-20 inline-flex items-center gap-1.5 rounded-xs border border-[var(--border-subtle)] bg-[var(--bg-primary)]/90 px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)] backdrop-blur-sm transition-opacity duration-200 shadow-2xs opacity-0 transition-opacity group-hover/stage:opacity-100">
              {isZoomed ? (
                <>
                  <ZoomOut className="h-2.5 w-2.5 text-emerald-400" />
                  <span className="text-emerald-400 font-semibold">
                    Zoom ativo · clique p/ sair
                  </span>
                </>
              ) : (
                <span className="inline-flex items-center gap-1">
                  <ZoomIn className="h-2.5 w-2.5" />
                  <span>1 clique p/ zoom</span>
                </span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Caption & Cycle Progress */}
      <div className="mt-3 flex items-center justify-between px-1">
        <span className="font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] truncate pr-3">
          {currentScreen?.label[language]}
        </span>
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          {screens.map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => {
                setIsZoomed(false);
                setActiveIndex(idx);
              }}
              className={`cursor-pointer h-1 rounded-full transition-all duration-300 ${
                idx === activeIndex
                  ? "w-4 bg-[var(--text-primary)]"
                  : "w-1 bg-[var(--border-subtle)] hover:bg-[var(--text-muted)]"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// VARIANTE 2: Camadas Sobrepostas (Stacked Product Layers em Perspectiva)
// -------------------------------------------------------------------------------------
function VariantStackedLayers({
  project: _project,
  language: _language,
}: {
  project: (typeof featuredProjects)[0];
  language: "pt" | "en";
}) {
  return (
    <div className="relative w-full pb-8 pt-2">
      {/* Background Layer: Primary Desktop Dashboard */}
      <div className="bento-card overflow-hidden p-3 sm:p-4 shadow-md transition-all duration-300 hover:shadow-lg">
        <div className="mb-2.5 flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
          <span className="uppercase tracking-wider">
            Painel Administrativo B2B
          </span>
          <span>https://app.condonot.com.br/dashboard</span>
        </div>
        <div className="relative aspect-[16/9.5] w-full overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-2">
          <img
            src="/projects/condonot/condonot-home.webp"
            alt="Dashboard"
            className="h-full w-full object-contain object-top block"
          />
        </div>
      </div>

      {/* Foreground Layer: Overlapping Document / Resident Email */}
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.5 }}
        whileHover={{ y: -6, scale: 1.02 }}
        className="absolute -bottom-4 right-3 sm:right-6 w-[56%] sm:w-[48%] rounded-[6px] border border-[var(--text-primary)]/20 bg-white p-2.5 sm:p-3 shadow-2xl backdrop-blur-md"
      >
        <div className="mb-2 flex items-center justify-between border-b border-neutral-200 pb-1.5 font-mono text-[9px] text-neutral-600">
          <span className="inline-flex items-center gap-1 font-semibold uppercase tracking-wider text-neutral-900">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
            E-mail Notificação Entregue
          </span>
          <span className="text-[8px] text-neutral-400">PDF Anexo</span>
        </div>
        <div className="relative aspect-[1275/1650] max-h-[260px] sm:max-h-[300px] w-full overflow-hidden rounded-[2px] border border-neutral-200 bg-white">
          <img
            src="/projects/condonot/condonot-gmail.webp"
            alt="Notificação formal recebida por e-mail"
            className="h-full w-full object-contain object-top block"
          />
        </div>
        <div className="mt-2 text-center font-mono text-[9px] uppercase tracking-wider text-neutral-500">
          Visão do Morador · Rastreabilidade Resend
        </div>
      </motion.div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// VARIANTE 3: Peek Slider Horizontal (Galeria Contida com Transbordo Sutil)
// -------------------------------------------------------------------------------------
function VariantPeekSlider({
  project,
  language,
}: {
  project: (typeof featuredProjects)[0];
  language: "pt" | "en";
}) {
  const screens = project.gallery ?? [];
  const [index, setIndex] = useState(0);

  const handlePrev = () => {
    setIndex((prev) => (prev > 0 ? prev - 1 : screens.length - 1));
  };

  const handleNext = () => {
    setIndex((prev) => (prev < screens.length - 1 ? prev + 1 : 0));
  };

  if (screens.length === 0) {
    return (
      <ProjectBentoShowcase
        projectSlug={project.slug}
        blocks={project.bento ?? []}
      />
    );
  }

  return (
    <div className="bento-card overflow-hidden p-4 sm:p-5">
      <div className="mb-3 flex items-center justify-between font-mono text-[10px] text-[var(--text-muted)]">
        <span className="uppercase tracking-wider">
          Fluxos da Plataforma em Operação
        </span>
        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={handlePrev}
            aria-label="Anterior"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronLeft className="h-3.5 w-3.5" />
          </button>
          <button
            type="button"
            onClick={handleNext}
            aria-label="Próximo"
            className="cursor-pointer inline-flex h-6 w-6 items-center justify-center rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] hover:text-[var(--text-primary)] transition-colors"
          >
            <ChevronRight className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>

      {/* Main Track with peek effect */}
      <div className="relative overflow-hidden rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3">
        <div className="relative aspect-[16/9.5] w-full overflow-hidden rounded-[2px]">
          <AnimatePresence mode="wait">
            {screens[index] && (
              <motion.img
                key={screens[index].id}
                src={screens[index].src}
                alt={screens[index].label[language]}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.3 }}
                className="h-full w-full object-contain object-top block"
              />
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Miniature Strip Preview Below */}
      <div className="mt-3 grid grid-cols-6 gap-2">
        {screens.map((scr, idx) => (
          <button
            key={scr.id}
            type="button"
            onClick={() => setIndex(idx)}
            className={`cursor-pointer relative aspect-video overflow-hidden rounded-[2px] border transition-all duration-200 ${
              idx === index
                ? "border-[var(--text-primary)] opacity-100 ring-1 ring-[var(--text-primary)]"
                : "border-[var(--border-subtle)] opacity-40 hover:opacity-80"
            }`}
          >
            <img
              src={scr.src}
              alt=""
              className="h-full w-full object-cover object-top"
              loading="lazy"
            />
          </button>
        ))}
      </div>

      <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        {screens[index]?.label[language]}
      </div>
    </div>
  );
}

// -------------------------------------------------------------------------------------
// VARIANTE 4: Editorial Panorâmico (Full-Width)
// -------------------------------------------------------------------------------------
function VariantEditorialFullWidth({
  project,
  language,
}: {
  project: (typeof featuredProjects)[0];
  language: "pt" | "en";
}) {
  const getLabProjectClick = useProjectLinkClickHandler(() => ({}));
  const [activeTab, setActiveTab] = useState(0);
  const screens = project.gallery ?? [];
  const activeScreen = screens[activeTab] ?? screens[0];

  return (
    <div className="w-full space-y-10">
      {/* Top Header Block (Editorial Style) */}
      <div className="border-b border-[var(--border-subtle)] pb-8">
        <div className="flex items-center gap-3">
          <ProjectLogo
            slug={project.slug}
            name={project.name}
            logo={project.logo}
            size="md"
          />
          <span className="font-mono text-xs text-[var(--text-muted)]">
            · {project.year}
          </span>
        </div>

        <h2 className="mt-4 font-editorial text-3xl sm:text-5xl leading-[1.1] tracking-[-0.01em] text-[var(--text-primary)] max-w-4xl">
          {project.headline[language]}
        </h2>

        <p className="mt-4 text-base sm:text-lg leading-relaxed text-[var(--text-secondary)] max-w-3xl">
          {project.summary[language]}
        </p>

        <div className="mt-6 flex flex-wrap items-center gap-3 font-mono text-xs text-[var(--text-muted)]">
          <span>Stack: {project.stack.join(" · ")}</span>
          <span>·</span>
          <span>{project.category[language]}</span>
        </div>
      </div>

      {/* Full-Width Panoramic Showcase */}
      {screens.length === 0 ? (
        <ProjectBentoShowcase
          projectSlug={project.slug}
          blocks={project.bento ?? []}
        />
      ) : (
        <div className="bento-card overflow-hidden p-4 sm:p-6 shadow-xl">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2 overflow-x-auto">
              {screens.map((scr, idx) => (
                <button
                  key={scr.id}
                  type="button"
                  onClick={() => setActiveTab(idx)}
                  className={`cursor-pointer shrink-0 rounded-[3px] px-3 py-1.5 font-mono text-xs uppercase tracking-wider transition-all duration-200 ${
                    idx === activeTab
                      ? "bg-[var(--text-primary)] text-[var(--bg-primary)] font-semibold"
                      : "text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-[var(--border-subtle)]/50"
                  }`}
                >
                  {scr.label[language].split("&")[0].trim()}
                </button>
              ))}
            </div>

            <span className="font-mono text-xs text-[var(--text-muted)]">
              https://{project.appDomain ?? `${project.slug}.app`}
              {activeScreen?.appPath}
            </span>
          </div>

          <div className="relative aspect-[16/9] w-full overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3 sm:p-5">
            <AnimatePresence mode="wait">
              {activeScreen?.src && (
                <motion.img
                  key={activeScreen.id}
                  src={activeScreen.src}
                  alt={activeScreen.label[language]}
                  initial={{ opacity: 0, scale: 0.995 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.995 }}
                  transition={{ duration: 0.35 }}
                  className="h-full w-full object-contain object-top block"
                />
              )}
            </AnimatePresence>
          </div>

          <div className="mt-4 flex items-center justify-between font-mono text-xs text-[var(--text-secondary)]">
            <span>{activeScreen?.label[language]}</span>
            <Link
              to={`/project/${project.slug}`}
              onClick={getLabProjectClick(`/project/${project.slug}`)}
              className="inline-flex items-center gap-1.5 underline underline-offset-4 text-[var(--text-primary)] hover:opacity-80"
            >
              <span>Ver Arquitetura Técnica & Estudo de Caso</span>
              <ExternalLink className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
