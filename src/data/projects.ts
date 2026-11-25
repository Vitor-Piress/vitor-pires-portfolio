import type { Language } from "../i18n/translations";
import { BENTO_FLOW_META as CONDONOT_FLOW_META } from "../components/mockups/CondonotBentoMockups";

/**
 * Projects data source.
 *
 * - 3 featured projects (with dedicated page at /project/:slug)
 * - 3 secondary projects / technical modules (Bento Grid with hover reveal)
 *
 * All human-readable text is localized (PT / EN).
 * Images are `null` for now: the UI renders an elegant B&W placeholder
 * until real logos and screenshots are added to /public/projects/<slug>/.
 */

export type Localized<T = string> = Record<Language, T>;

export type ProjectTier = "featured" | "secondary";

/** Layout hint for the screen inside the project Bento Grid. */
export type BentoSpan = "wide" | "tall" | "square";

export interface ProjectScreen {
  id: string;
  label: Localized;
  /** Path to the real screenshot (e.g. /projects/condonot/dashboard.webp). `null` renders a placeholder. */
  src: string | null;
  /** Device type, used by the placeholder to choose its aspect ratio. */
  device: "desktop" | "mobile";
}

/** A Bento block: one or more screens that auto-cycle every 4s. */
export interface ProjectBentoBlock {
  id: string;
  span: BentoSpan;
  screens: ProjectScreen[];
}

export interface ProjectFeature {
  id: string;
  title: Localized;
  description: Localized;
}

export type ArchitectureNodeRole =
  | "edge"
  | "frontend"
  | "compute"
  | "data"
  | "integration";

export interface ProjectArchitectureItem {
  id?: string;
  nodeRole?: ArchitectureNodeRole;
  provider?: string;
  protocol?: string;
  securityNote?: Localized;
  layer: Localized;
  technologies: string[];
  description: Localized;
}

export interface ArchitectureFlowStep {
  layerId: string;
  action: Localized;
  payload: string;
  detail: Localized;
}

export interface ArchitectureFlowScenario {
  id: string;
  title: Localized;
  trigger: Localized;
  steps: ArchitectureFlowStep[];
}

export interface ProjectResult {
  metric: Localized;
  description: Localized;
}

export interface ProjectGalleryItem {
  id: string;
  label: Localized;
  src: string;
  appPath?: string;
  orientation?: "landscape" | "portrait";
}

export interface ProjectInteractiveDemoStep {
  code: string;
  title: Localized;
  detail: Localized;
}

export interface ProjectInteractiveDemo {
  provider: "supademo" | "video";
  kind?: "interactive" | "video";
  /** Keep the 4-col mobile screenshot + architecture companion card on Home (`/`). */
  keepPortraitCompanion?: boolean;
  /** Direct Supademo embed iframe URL, or null while demo recording is pending. */
  embedUrl: string | null;
  /** Local MP4/WebM source for native looping video walkthroughs. */
  videoSrc?: string;
  /** Optional poster image shown while video metadata loads. */
  posterSrc?: string;
  /** Playback speed multiplier for native video demos (e.g. 1.4). */
  videoPlaybackRate?: number;
  orientation?: "landscape" | "portrait";
  title: Localized;
  aspectRatio?: number;
  appPath?: string;
  caption: Localized;
  embedPaddingPx?: number;
  steps?: ProjectInteractiveDemoStep[];
}

export interface FeaturedProject {
  tier: "featured";
  slug: string;
  name: string;
  logo: string | null;
  previewImage: string | null;
  demoUrl: string | null;
  appDomain?: string;
  mobileFirst?: boolean;
  interactiveDemo?: ProjectInteractiveDemo | null;
  gallery?: ProjectGalleryItem[];
  /** Editorial headline (serif) shown on the Home showcase. */
  headline: Localized;
  summary: Localized;
  category: Localized;
  role: Localized;
  year: string;
  stack: string[];
  details: Localized;
  liveUrl: string | null;
  repoUrl: string | null;
  bento?: ProjectBentoBlock[];
  overview: {
    problem: Localized;
    solution: Localized;
  };
  features: ProjectFeature[];
  architecture: ProjectArchitectureItem[];
  architectureFlows?: ArchitectureFlowScenario[];
  results: ProjectResult[];
}

export interface SecondaryProject {
  tier: "secondary";
  slug: string;
  name: string;
  image: string | null;
  /** One-line summary revealed on hover. */
  summary: Localized;
  category: Localized;
  stack: string[];
  repoUrl: string | null;
}

export type Project = FeaturedProject | SecondaryProject;

const GITHUB = "https://github.com/Vitor-Piress";

/* -------------------------------------------------------------------------- */
/*                              FEATURED PROJECTS                             */
/* -------------------------------------------------------------------------- */

export const featuredProjects: FeaturedProject[] = [
  {
    tier: "featured",
    slug: "condonot",
    name: "Condonot",
    logo: "/projects/condonot/logo_rbg.png",
    previewImage: "/projects/condonot/condonot-home.webp",
    demoUrl: "https://condonot.com.br/demo",
    appDomain: "app.condonot.com.br",
    headline: {
      pt: "Condonot é uma plataforma para automatizar a gestão e fiscalização de notificações formais em condomínios.",
      en: "Condonot is a SaaS platform that automates formal infraction notices and management for condominiums.",
    },
    summary: {
      pt: "Plataforma SaaS B2B licenciada comercialmente e em operação: gestão de unidades, notificações de infração formais, geração de PDFs e disparo de e-mails rastreados.",
      en: "A commercially licensed SaaS B2B platform in production: unit management, formal infraction notices, PDF generation and tracked email delivery.",
    },
    category: {
      pt: "SaaS B2B / Administração Condominial",
      en: "B2B SaaS / Condominium Management",
    },
    role: {
      pt: "Founder & Engenheiro Full-Stack",
      en: "Founder & Full-Stack Engineer",
    },
    year: "2026",
    stack: [
      "React",
      "TypeScript",
      "Tailwind CSS",
      "Supabase",
      "Cloudflare",
      "Resend",
    ],
    details: {
      pt: "Arquitetura multi-tenant sobre Supabase (PostgreSQL + Row Level Security) com deploy na borda via Cloudflare. Unifica em um único fluxo o que antes exigia planilhas, editores de texto e controles manuais: da identificação da infração à geração do PDF formal e entrega rastreada por e-mail em segundos.",
      en: "Multi-tenant architecture on Supabase (PostgreSQL + Row Level Security) deployed at the edge via Cloudflare. It merges into a single pipeline what used to require spreadsheets, word processors and manual tracking: from infraction logging to formal PDF generation and tracked email delivery in seconds.",
    },
    liveUrl: "https://condonot.com.br/demo",
    repoUrl: null,
    interactiveDemo: {
      provider: "supademo",
      embedUrl:
        "https://app.supademo.com/embed/cmwuwhw840s29qmmgjni8rjk2?embed_v=2&utm_source=embed",
      title: {
        pt: "Registre e envie notificações de advertência no condomínio com a Condonot",
        en: "Register and dispatch formal warning notices with Condonot",
      },
      aspectRatio: 1.79,
      appPath: "/notificacoes/nova",
      embedPaddingPx: 0,
      caption: {
        pt: "Tour Interativo HTML · Emissão de Notificação de Advertência",
        en: "Interactive HTML Tour · Formal Warning Notice Flow",
      },
      steps: [
        {
          code: "01",
          title: {
            pt: "Painel & Ações",
            en: "Action Center",
          },
          detail: {
            pt: "Inicia nova notificação a partir do centro de operações.",
            en: "Starts a new infraction notice from the main dashboard.",
          },
        },
        {
          code: "02",
          title: {
            pt: "Unidade & Regimento",
            en: "Unit & Bylaws",
          },
          detail: {
            pt: "Vincula morador, modelo e artigo do regimento interno.",
            en: "Links resident, template and condominium bylaw article.",
          },
        },
        {
          code: "03",
          title: {
            pt: "Refinar com IA + A4",
            en: "AI Refine + A4",
          },
          detail: {
            pt: "Ajusta redação formal respeitando a ocupação da folha A4.",
            en: "Refines formal text while respecting the A4 page budget.",
          },
        },
        {
          code: "04",
          title: {
            pt: "PDF & Disparo",
            en: "PDF & Delivery",
          },
          detail: {
            pt: "Gera carta oficial em PDF e envia e-mail rastreado.",
            en: "Renders official PDF letter and dispatches tracked email.",
          },
        },
      ],
    },
    gallery: [
      {
        id: "dashboard",
        label: {
          pt: "Painel Geral & Centro de Ações",
          en: "Operations Dashboard & Action Center",
        },
        src: "/projects/condonot/condonot-home.webp",
        appPath: "/dashboard",
        orientation: "landscape",
      },
      {
        id: "inserir-notificacao",
        label: {
          pt: "Inserir Notificação & Parâmetros A4",
          en: "New Notice & A4 Parameters",
        },
        src: "/projects/condonot/condonot-inserir-notificacao.png",
        appPath: "/notificacoes/nova",
        orientation: "landscape",
      },
      {
        id: "inserir-notificacao-ia",
        label: {
          pt: "Refinar com IA & Ocupação A4",
          en: "AI Refinement & A4 Page Budget",
        },
        src: "/projects/condonot/condonot-inserir-notificacao-IA-refinando-texto.png",
        appPath: "/notificacoes/nova#refinar-ia",
        orientation: "landscape",
      },
      {
        id: "unidades",
        label: {
          pt: "Gestão de Unidades & Moradores",
          en: "Units & Residents Management",
        },
        src: "/projects/condonot/condonot-unidades.webp",
        appPath: "/unidades",
        orientation: "landscape",
      },
      {
        id: "modelos",
        label: {
          pt: "Modelos de Notificação & Artigos do Regimento",
          en: "Notice Templates & Bylaws Framing",
        },
        src: "/projects/condonot/condonot-modelos.webp",
        appPath: "/modelos",
        orientation: "landscape",
      },
      {
        id: "modelo-individual",
        label: {
          pt: "Modelo Individual & Leitura do Regimento",
          en: "Individual Template & Bylaws Preview",
        },
        src: "/projects/condonot/condonot-modelos-notificacao-individual.png",
        appPath: "/modelos/1",
        orientation: "landscape",
      },
      {
        id: "relatorios",
        label: {
          pt: "Relatórios de Gestão & Rastreabilidade",
          en: "Management Reports & Delivery Tracking",
        },
        src: "/projects/condonot/condonot-relatorio.webp",
        appPath: "/relatorios",
        orientation: "landscape",
      },
      {
        id: "condominios",
        label: {
          pt: "Configurações de Condomínio & Regras",
          en: "Condominium Settings & Rules",
        },
        src: "/projects/condonot/condonot-condominios.webp",
        appPath: "/configuracoes",
        orientation: "landscape",
      },
      {
        id: "email",
        label: {
          pt: "E-mail Formal Recebido pelo Morador com PDF",
          en: "Formal Notice Email Received by Resident with PDF",
        },
        src: "/projects/condonot/condonot-gmail.webp",
        appPath: "/notificacao/email",
        orientation: "portrait",
      },
    ],
    bento: [
      {
        id: "main",
        span: "wide",
        screens: [
          {
            id: "dashboard",
            label: CONDONOT_FLOW_META.wide.step0,
            src: "/projects/condonot/condonot-home.webp",
            device: "desktop",
          },
          {
            id: "units",
            label: CONDONOT_FLOW_META.wide.step1,
            src: "/projects/condonot/condonot-unidades.webp",
            device: "desktop",
          },
        ],
      },
      {
        id: "mobile",
        span: "tall",
        screens: [
          {
            id: "gmail-notice",
            label: {
              pt: "E-mail Formal com PDF Anexo",
              en: "Formal Notice Email with Attached PDF",
            },
            src: "/projects/condonot/condonot-gmail.webp",
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-notices",
        span: "square",
        screens: [
          {
            id: "notice-form",
            label: CONDONOT_FLOW_META.squareA.step0,
            src: "/projects/condonot/condonot-inserir-notificacao.png",
            device: "desktop",
          },
          {
            id: "notice-form-ai",
            label: {
              pt: "Refinar com IA & Ocupação A4",
              en: "AI Refinement & A4 Page Budget",
            },
            src: "/projects/condonot/condonot-inserir-notificacao-IA-refinando-texto.png",
            device: "desktop",
          },
          {
            id: "notice-templates",
            label: CONDONOT_FLOW_META.squareB.step0,
            src: "/projects/condonot/condonot-modelos.webp",
            device: "desktop",
          },
          {
            id: "notice-template-detail",
            label: {
              pt: "Modelo Individual & Leitura do Regimento",
              en: "Individual Template & Bylaws Preview",
            },
            src: "/projects/condonot/condonot-modelos-notificacao-individual.png",
            device: "desktop",
          },
        ],
      },
      {
        id: "flow-billing",
        span: "square",
        screens: [
          {
            id: "relatorios",
            label: {
              pt: "Relatórios e Auditoria de Notificações",
              en: "Reports and Notification Audit",
            },
            src: "/projects/condonot/condonot-relatorio.webp",
            device: "desktop",
          },
          {
            id: "condominios",
            label: {
              pt: "Configurações & Parâmetros Condominiais",
              en: "Condominium Settings & Parameters",
            },
            src: "/projects/condonot/condonot-condominios.webp",
            device: "desktop",
          },
        ],
      },
    ],
    overview: {
      problem: {
        pt: "Administradoras de condomínio emitem notificações formais de forma manual: documentos montados em editores de texto, cálculos, registros em planilhas e e-mails enviados sem rastreabilidade. O resultado é retrabalho, erros e baixa taxa de assertividade.",
        en: "Condominium management companies issue formal notices manually: documents assembled in text editors, calculations, records in spreadsheets and emails sent without tracking. The result is rework, errors, and a low success rate.",
      },
      solution: {
        pt: "Uma plataforma única que centraliza unidades e moradores, gera notificações formais em PDF com fundamentação no regimento e dispara e-mails transacionais com status de entrega, tudo com isolamento total de dados entre condomínios.",
        en: "A single platform that centralizes units and residents, generates formal PDF notices grounded in the bylaws, and dispatches transactional emails with delivery tracking, all with complete data isolation between condominiums.",
      },
    },
    features: [
      {
        id: "units",
        title: {
          pt: "Gestão de Unidades & Moradores",
          en: "Units & Residents Management",
        },
        description: {
          pt: "Cadastro estruturado de blocos, unidades, proprietários e inquilinos, com histórico completo de ocorrências por unidade.",
          en: "Structured registry of blocks, units, owners and tenants, with a complete incident history per unit.",
        },
      },
      {
        id: "notices",
        title: {
          pt: "Notificações de Infração Formais",
          en: "Formal Infraction Notices",
        },
        description: {
          pt: "Emissão de advertências e multas com modelos padronizados, referência ao artigo do regimento e numeração sequencial.",
          en: "Warnings and fines issued from standardized templates, referencing the bylaw article with sequential numbering.",
        },
      },
      {
        id: "pdf",
        title: { pt: "Geração de PDFs", en: "PDF Generation" },
        description: {
          pt: "Documentos oficiais gerados com identidade do condomínio, prontos para envio ou impressão.",
          en: "Official documents rendered with the condominium branding, ready to send or print.",
        },
      },
      {
        id: "email",
        title: {
          pt: "E-mails Transacionais via Resend",
          en: "Transactional Emails via Resend",
        },
        description: {
          pt: "Disparo automático das notificações com anexo em PDF e acompanhamento do status de entrega.",
          en: "Automatic delivery of notices with PDF attachments and delivery status tracking.",
        },
      },
    ],
    architecture: [
      {
        id: "frontend",
        nodeRole: "frontend",
        provider: "React SPA",
        protocol: "HTTPS · TypeScript",
        securityNote: {
          pt: "Componentes tipados de ponta a ponta & validação de formulários",
          en: "End-to-end typed components & client-side form validation",
        },
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        description: {
          pt: "SPA tipada de ponta a ponta, com componentes reutilizáveis e formulários validados.",
          en: "End-to-end typed SPA with reusable components and validated forms.",
        },
      },
      {
        id: "database",
        nodeRole: "data",
        provider: "Supabase",
        protocol: "TLS · PostgREST / RLS",
        securityNote: {
          pt: "Isolamento multi-tenant via Row Level Security por administradora",
          en: "Multi-tenant isolation enforced per administrator via RLS",
        },
        layer: { pt: "Dados & Autenticação", en: "Data & Auth" },
        technologies: ["Supabase", "PostgreSQL", "Row Level Security"],
        description: {
          pt: "Modelo multi-tenant com políticas RLS garantindo que cada administradora acesse apenas seus próprios dados.",
          en: "Multi-tenant model with RLS policies ensuring each administrator only accesses its own data.",
        },
      },
      {
        id: "edge",
        nodeRole: "edge",
        provider: "Cloudflare",
        protocol: "Edge CDN · TLS 1.3",
        securityNote: {
          pt: "Entrega global na borda com proxy HTTPS e proteção DNS",
          en: "Global edge delivery with HTTPS proxy and DNS protection",
        },
        layer: { pt: "Infraestrutura", en: "Infrastructure" },
        technologies: ["Cloudflare"],
        description: {
          pt: "Deploy na borda com CDN global, HTTPS e baixa latência.",
          en: "Edge deployment with global CDN, HTTPS and low latency.",
        },
      },
      {
        id: "integrations",
        nodeRole: "integration",
        provider: "Resend · PDF",
        protocol: "REST API · Webhook",
        securityNote: {
          pt: "Anexo oficial em PDF & rastreamento do status de entrega via Resend",
          en: "Official PDF notice attachment & email delivery tracking via Resend",
        },
        layer: {
          pt: "Integrações & Documentos",
          en: "Integrations & Documents",
        },
        technologies: ["Resend", "PDF Generation"],
        description: {
          pt: "Geração de documentos oficiais em PDF e disparo de e-mails transacionais com acompanhamento do status de entrega.",
          en: "Official PDF document rendering and transactional emails with tracked delivery status.",
        },
      },
    ],
    architectureFlows: [
      {
        id: "infraction-notice",
        title: {
          pt: "01. Emissão de Notificação & PDF",
          en: "01. Notice & PDF Dispatch",
        },
        trigger: {
          pt: "Síndico/operador registra advertência ou multa com artigo do regimento",
          en: "Manager issues a warning or fine tied to a bylaw article",
        },
        steps: [
          {
            layerId: "edge",
            action: {
              pt: "Roteamento seguro na borda",
              en: "Secure edge routing",
            },
            payload: "TLS 1.3 → app.condonot.com.br/notificacoes",
            detail: {
              pt: "Cloudflare entrega o bundle estático cacheado globalmente e protege a sessão sob HTTPS.",
              en: "Cloudflare serves the globally cached bundle and secures traffic under HTTPS.",
            },
          },
          {
            layerId: "frontend",
            action: {
              pt: "Validação e geração do documento PDF",
              en: "Form validation & PDF document generation",
            },
            payload: "{ unidadeId, artigoRegimento, numSequencial }",
            detail: {
              pt: "Interface React compila o modelo oficial padronizado com numeração sequencial e identidade do condomínio.",
              en: "React UI compiles the standardized notice template with sequential numbering and condo branding.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Gravação isolada por tenant (RLS)",
              en: "Tenant-isolated database write (RLS)",
            },
            payload: "INSERT notices WHERE tenant_id = auth.uid()",
            detail: {
              pt: "Supabase valida as políticas Row Level Security para assegurar acesso exclusivo da administradora.",
              en: "Supabase evaluates Row Level Security policies so only the owning administrator owns the record.",
            },
          },
          {
            layerId: "integrations",
            action: {
              pt: "Disparo transacional rastreado via Resend",
              en: "Tracked transactional dispatch via Resend",
            },
            payload: "POST /emails · attachment: notificacao.pdf",
            detail: {
              pt: "Envia o e-mail formal ao morador com o PDF anexado e atualiza o status de entrega no histórico.",
              en: "Delivers the formal notice email with PDF attached and tracks delivery events in audit history.",
            },
          },
        ],
      },
      {
        id: "tenant-audit",
        title: {
          pt: "02. Isolamento Multi-Tenant & Auditoria",
          en: "02. Multi-Tenant Isolation & Audit",
        },
        trigger: {
          pt: "Administradora consulta histórico por unidade e confirma recebimento de e-mails",
          en: "Administrator reviews unit history & confirms email delivery logs",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Consulta filtrada de unidades e relatórios",
              en: "Scoped unit & report query",
            },
            payload: "GET /relatorios?condoId=active_tenant",
            detail: {
              pt: "Painel em React solicita os registros e status de entrega filtrados pelo condomínio ativo.",
              en: "React console requests notice records and delivery metrics scoped to the active condominium.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Enforce de políticas RLS no PostgreSQL",
              en: "PostgreSQL RLS policy enforcement",
            },
            payload: "SELECT notices, logs · RLS auth.uid() match",
            detail: {
              pt: "Supabase garante no nível do banco que dados de outras administradoras nunca cruzem a consulta.",
              en: "Supabase enforces row-level tenant isolation directly in PostgreSQL.",
            },
          },
          {
            layerId: "integrations",
            action: {
              pt: "Retorno de eventos de entrega via Resend",
              en: "Delivery telemetry via Resend",
            },
            payload: "webhook: email.delivered · notificacao_id",
            detail: {
              pt: "Os eventos de entrega e abertura ficam anexados à notificação para respaldo administrativo.",
              en: "Delivery events remain attached to each notice for operational and legal traceability.",
            },
          },
        ],
      },
    ],
    results: [
      {
        metric: {
          pt: "Licenciado comercialmente",
          en: "Commercially licensed",
        },
        description: {
          pt: "Em operação real em condomínios, validado por administradoras.",
          en: "Running in real condominiums, validated by property administrators.",
        },
      },
      {
        metric: { pt: "-85% no tempo de emissão", en: "-85% issuing time" },
        description: {
          pt: "Notificação, PDF e disparo rastreado por e-mail em um único fluxo de segundos.",
          en: "Notice, PDF and tracked email delivery in a single flow that takes seconds.",
        },
      },
      {
        metric: { pt: "100% rastreável", en: "100% traceable" },
        description: {
          pt: "Histórico completo de cada notificação e status de entrega de cada e-mail.",
          en: "Full history of every notice and the delivery status of every email.",
        },
      },
    ],
  },
  {
    tier: "featured",
    slug: "moradas-do-gabriel",
    name: "Moradas do Gabriel",
    logo: "/projects/moradas-do-gabriel/moradas-logo.webp",
    previewImage: "/projects/moradas-do-gabriel/moradas-lading-hero.webp",
    demoUrl: null,
    appDomain: "moradasdogabriel.com.br",
    mobileFirst: true,
    headline: {
      pt: "Moradas do Gabriel é um portal digital que transforma a experiência do hóspede e a gestão da hospedagem.",
      en: "Moradas do Gabriel is a digital portal that transforms the guest experience and property management.",
    },
    summary: {
      pt: "Portal interativo para hóspedes com guia local, mapas interativos e conexão Wi-Fi rápida, acompanhado de um painel administrativo completo para a pousada.",
      en: "An interactive guest portal with a local guide, interactive maps and quick Wi-Fi access, paired with a complete admin dashboard for the guesthouse.",
    },
    category: {
      pt: "Hospitalidade / Pousada",
      en: "Hospitality / Guesthouse",
    },
    role: {
      pt: "Engenheiro Full-Stack & Designer de Produto",
      en: "Full-Stack Engineer & Product Designer",
    },
    year: "2026",
    stack: ["React", "TypeScript", "Tailwind CSS", "Supabase"],
    details: {
      pt: "Aplicação mobile-first acessada pelo hóspede via QR Code, sem instalação. Todo o conteúdo — guia local, pontos no mapa, regras da casa e credenciais de Wi-Fi — é gerenciado em tempo real pela administração através de um painel protegido sobre Supabase.",
      en: "A mobile-first app accessed by guests via QR Code, no install required. All content — local guide, map points, house rules and Wi-Fi credentials — is managed in real time by the staff through a protected Supabase-backed dashboard.",
    },
    liveUrl: "https://moradasdogabriel.com.br",
    repoUrl: null,
    interactiveDemo: {
      provider: "video",
      kind: "video",
      embedUrl: null,
      videoSrc: "/projects/moradas-do-gabriel/moradas-desktop-tour.mp4",
      posterSrc: "/projects/moradas-do-gabriel/moradas-lading-hero.webp",
      videoPlaybackRate: 1.4,
      aspectRatio: 2880 / 1606,
      appPath: "/",
      embedPaddingPx: 0,
      title: {
        pt: "Tour pela landing page da Pousada Moradas do Gabriel",
        en: "Pousada Moradas do Gabriel website tour",
      },
      caption: {
        pt: "Demonstração em Vídeo · Landing Page & Reserva Direta",
        en: "Video Walkthrough · Landing Page & Direct Booking",
      },
      steps: [
        {
          code: "01",
          title: {
            pt: "Apresentação & Proposta",
            en: "Hero & Brand Showcase",
          },
          detail: {
            pt: "Navegação pela landing page responsiva com foco em hospitalidade e reserva direta.",
            en: "Walkthrough of the responsive landing page focused on hospitality and direct bookings.",
          },
        },
        {
          code: "02",
          title: {
            pt: "Estrutura & Acomodações",
            en: "Property & Facilities",
          },
          detail: {
            pt: "Apresentação das suítes, áreas comuns e diferenciais da pousada.",
            en: "Highlights suites, common areas, and guesthouse amenities.",
          },
        },
        {
          code: "03",
          title: {
            pt: "Guia Digital do Hóspede",
            en: "Digital Guest Guide",
          },
          detail: {
            pt: "Integração com o portal mobile via QR Code para Wi-Fi, regras e mapa local.",
            en: "Connects seamlessly with the QR-code mobile portal for Wi-Fi, rules, and local map.",
          },
        },
        {
          code: "04",
          title: {
            pt: "Reserva & Atendimento",
            en: "Booking & Direct Support",
          },
          detail: {
            pt: "Atalhos rápidos de contato e disponibilidade sem intermediários.",
            en: "Direct contact and availability shortcuts with zero middlemen.",
          },
        },
      ],
    },
    gallery: [
      {
        id: "landing-hero",
        label: {
          pt: "Landing Page & Reserva Direta",
          en: "Landing Page & Direct Booking",
        },
        src: "/projects/moradas-do-gabriel/moradas-lading-hero.webp",
        appPath: "/",
        orientation: "landscape",
      },
      {
        id: "landing-sobre",
        label: {
          pt: "Apresentação & Estrutura da Pousada",
          en: "Guesthouse Overview & Facilities",
        },
        src: "/projects/moradas-do-gabriel/moradas-lading-sobre.webp",
        appPath: "/#sobre",
        orientation: "landscape",
      },
      {
        id: "guia-1",
        label: {
          pt: "Guia do Hóspede · Check-in & Wi-Fi",
          en: "Guest Guide · Check-in & Wi-Fi",
        },
        src: "/projects/moradas-do-gabriel/moradas-guia-hospede-1.webp",
        appPath: "/guia",
        orientation: "portrait",
      },
      {
        id: "guia-2",
        label: {
          pt: "Guia do Hóspede · Regras & Informações",
          en: "Guest Guide · Rules & Info",
        },
        src: "/projects/moradas-do-gabriel/moradas-guia-hospede-2.webp",
        appPath: "/guia/regras",
        orientation: "portrait",
      },
      {
        id: "guia-3",
        label: {
          pt: "Guia do Hóspede · Mapa & Recomendações",
          en: "Guest Guide · Map & Local Tips",
        },
        src: "/projects/moradas-do-gabriel/moradas-guia-hospede-3.webp",
        appPath: "/guia/local",
        orientation: "portrait",
      },
      {
        id: "linktree",
        label: {
          pt: "Hub Rápido de Atendimento & Links",
          en: "Quick Support & Links Hub",
        },
        src: "/projects/moradas-do-gabriel/moradas-linktree.webp",
        appPath: "/links",
        orientation: "portrait",
      },
    ],
    bento: [
      {
        id: "main",
        span: "wide",
        screens: [
          {
            id: "landing-hero",
            label: {
              pt: "Landing Page & Reserva Direta",
              en: "Landing Page & Direct Booking",
            },
            src: "/projects/moradas-do-gabriel/moradas-lading-hero.webp",
            device: "desktop",
          },
          {
            id: "landing-sobre",
            label: {
              pt: "Apresentação & Estrutura da Pousada",
              en: "Guesthouse Overview & Facilities",
            },
            src: "/projects/moradas-do-gabriel/moradas-lading-sobre.webp",
            device: "desktop",
          },
        ],
      },
      {
        id: "mobile",
        span: "tall",
        screens: [
          {
            id: "guia-1",
            label: {
              pt: "Guia do Hóspede · Check-in & Wi-Fi",
              en: "Guest Guide · Check-in & Wi-Fi",
            },
            src: "/projects/moradas-do-gabriel/moradas-guia-hospede-1.webp",
            device: "mobile",
          },
          {
            id: "linktree",
            label: {
              pt: "Hub Rápido de Atendimento & Links",
              en: "Quick Support & Links Hub",
            },
            src: "/projects/moradas-do-gabriel/moradas-linktree.webp",
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-guide",
        span: "square",
        screens: [
          {
            id: "guia-2",
            label: {
              pt: "Guia do Hóspede · Regras da Casa",
              en: "Guest Guide · House Rules",
            },
            src: "/projects/moradas-do-gabriel/moradas-guia-hospede-2.webp",
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-admin",
        span: "square",
        screens: [
          {
            id: "guia-3",
            label: {
              pt: "Guia do Hóspede · Mapa & Dicas Locais",
              en: "Guest Guide · Map & Local Tips",
            },
            src: "/projects/moradas-do-gabriel/moradas-guia-hospede-3.webp",
            device: "mobile",
          },
        ],
      },
    ],
    overview: {
      problem: {
        pt: "Informações essenciais para o hóspede (senha do Wi-Fi, regras, recomendações locais) ficavam espalhadas em papéis, mensagens repetidas e atendimento manual, sobrecarregando a gestão e prejudicando a experiência.",
        en: "Essential guest information (Wi-Fi password, rules, local recommendations) was scattered across printed notes, repeated messages and manual support, overloading the staff and hurting the experience.",
      },
      solution: {
        pt: "Um portal digital acessível por QR Code que entrega tudo ao hóspede em segundos, com um painel administrativo que permite atualizar qualquer módulo sem depender de desenvolvedor.",
        en: "A digital portal accessible via QR Code that delivers everything to the guest in seconds, with an admin dashboard that lets staff update any module without a developer.",
      },
    },
    features: [
      {
        id: "wifi",
        title: { pt: "Conectividade Wi-Fi Rápida", en: "Quick Wi-Fi Access" },
        description: {
          pt: "Credenciais exibidas com cópia em um toque e conexão facilitada.",
          en: "Credentials displayed with one-tap copy and simplified connection.",
        },
      },
      {
        id: "guide",
        title: { pt: "Guia Local Curado", en: "Curated Local Guide" },
        description: {
          pt: "Restaurantes, praias, serviços e passeios recomendados pela própria hospedagem.",
          en: "Restaurants, beaches, services and tours recommended by the property itself.",
        },
      },
      {
        id: "maps",
        title: { pt: "Mapas Interativos", en: "Interactive Maps" },
        description: {
          pt: "Pontos de interesse georreferenciados com rota direta a partir da pousada.",
          en: "Geo-referenced points of interest with direct routes from the guesthouse.",
        },
      },
      {
        id: "admin",
        title: { pt: "Painel Administrativo", en: "Admin Dashboard" },
        description: {
          pt: "Gestão completa de conteúdo, regras e informações com atualização em tempo real.",
          en: "Full management of content, rules and information with real-time updates.",
        },
      },
    ],
    architecture: [
      {
        id: "frontend",
        nodeRole: "frontend",
        provider: "Mobile-First SPA",
        protocol: "QR Entry · HTTPS",
        securityNote: {
          pt: "Acesso instantâneo sem instalação pelo navegador do celular",
          en: "Zero-install instant guest access via mobile browser",
        },
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        description: {
          pt: "Interface mobile-first, leve e rápida, pensada para o primeiro acesso do hóspede.",
          en: "Lightweight, fast mobile-first interface designed for the guest’s first access.",
        },
      },
      {
        id: "database",
        nodeRole: "data",
        provider: "Supabase",
        protocol: "TLS · RLS Policies",
        securityNote: {
          pt: "Leitura pública para hóspedes + painel administrativo autenticado",
          en: "Public read policies for guests + authenticated staff admin panel",
        },
        layer: { pt: "Dados & Autenticação", en: "Data & Auth" },
        technologies: ["Supabase", "PostgreSQL"],
        description: {
          pt: "Conteúdo público para hóspedes e área administrativa protegida por autenticação e políticas de acesso.",
          en: "Public content for guests and an admin area protected by authentication and access policies.",
        },
      },
    ],
    architectureFlows: [
      {
        id: "guest-qr-portal",
        title: {
          pt: "01. Acesso do Hóspede via QR Code",
          en: "01. Guest Access via QR Code",
        },
        trigger: {
          pt: "Hóspede escaneia o QR Code na suíte para consultar Wi-Fi, regras e mapa",
          en: "Guest scans suite QR Code to view Wi-Fi, house rules & local map",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Abertura imediata da interface mobile-first",
              en: "Instant load of mobile-first guest portal",
            },
            payload: "GET /guia · Viewport Mobile (Zero Install)",
            detail: {
              pt: "Renderiza atalhos de Wi-Fi em 1 toque, horários da pousada e pontos georreferenciados no navegador.",
              en: "Renders one-tap Wi-Fi access, guesthouse rules and geo-referenced map pins right in mobile browser.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Consulta pública controlada por políticas",
              en: "Policy-scoped public read query",
            },
            payload: "SELECT guide_items, wifi_config (read-only)",
            detail: {
              pt: "Supabase retorna dados atualizados da hospedagem em tempo real mantendo tabelas administrativas protegidas.",
              en: "Supabase serves real-time guesthouse info while keeping admin mutation endpoints locked down.",
            },
          },
        ],
      },
      {
        id: "admin-realtime-cms",
        title: {
          pt: "02. Atualização em Tempo Real no Painel",
          en: "02. Real-Time Admin Update",
        },
        trigger: {
          pt: "Equipe da pousada altera regras, recomendações locais ou senha de Wi-Fi",
          en: "Guesthouse staff edits house rules, map tips or Wi-Fi credentials",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Edição autenticada no Painel Administrativo",
              en: "Authenticated edit in Admin Dashboard",
            },
            payload: "PUT /admin/content · Session Token",
            detail: {
              pt: "Painel em React + TypeScript valida coordenadas, textos e categorias com prévia responsiva imediata.",
              en: "Typed React dashboard validates map coordinates, copy and categories with immediate preview.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Persistência protegida no Supabase Auth + PostgreSQL",
              en: "Protected write via Supabase Auth + PostgreSQL",
            },
            payload: "UPDATE property_content · AUTH = staff_role",
            detail: {
              pt: "Política RLS autoriza gravação apenas para usuários autenticados, refletindo no portal dos hóspedes no mesmo instante.",
              en: "RLS policy permits writes solely for authenticated staff, reflecting live across guest QR sessions.",
            },
          },
        ],
      },
    ],
    results: [
      {
        metric: { pt: "100% digital", en: "100% digital" },
        description: {
          pt: "Atendimento ao hóspede totalmente digitalizado, sem materiais impressos.",
          en: "Fully digitalized guest support, no printed materials.",
        },
      },
      {
        metric: {
          pt: "Menos atendimento repetitivo",
          en: "Fewer repetitive requests",
        },
        description: {
          pt: "Dúvidas recorrentes resolvidas pelo próprio portal.",
          en: "Recurring questions answered by the portal itself.",
        },
      },
    ],
  },
  {
    tier: "featured",
    slug: "dailycheckout",
    name: "Dailycheckout",
    logo: "/projects/dailycheckout/dailycheckout-logo.svg",
    previewImage:
      "/projects/dailycheckout/dailycheckout-desktop-management.png",
    demoUrl: null,
    appDomain: "dailycheckout.app",
    mobileFirst: true,
    interactiveDemo: {
      provider: "supademo",
      orientation: "portrait",
      embedUrl:
        "https://app.supademo.com/embed/cmwv8g0aq00dgqmn5ec12uiad?embed_v=2&utm_source=embed",
      aspectRatio: 0.46,
      appPath: "/operacao",
      embedPaddingPx: 0,
      title: {
        pt: "Registrar atendimentos, pacotes e fechamento de caixa no Dailycheckout",
        en: "Log services, packages, and daily cash closing in Dailycheckout",
      },
      caption: {
        pt: "Tour Interativo Mobile · PDV na Bancada & Fechamento de Caixa",
        en: "Interactive Mobile Tour · Chairside POS & Daily Closing",
      },
      steps: [
        {
          code: "01",
          title: {
            pt: "Catálogo & Atendimento",
            en: "Service Catalog & POS",
          },
          detail: {
            pt: "Seleciona o serviço na bancada em 2 toques com registro instantâneo.",
            en: "Picks a chairside service in 2 taps for instant logging.",
          },
        },
        {
          code: "02",
          title: {
            pt: "Pagamento & Gorjeta",
            en: "Payment & Tip Capture",
          },
          detail: {
            pt: "Define Dinheiro, Pix, Crédito ou Débito com gorjeta separada.",
            en: "Captures Cash, Pix, Credit, or Debit with pass-through tips.",
          },
        },
        {
          code: "03",
          title: {
            pt: "Pacotes & Rateio 50%",
            en: "Packages & 50% Split",
          },
          detail: {
            pt: "Aplica pacotes de serviços e calcula automaticamente a comissão do barbeiro.",
            en: "Applies service packages and automatically splits barber 50% commissions.",
          },
        },
        {
          code: "04",
          title: {
            pt: "Fechamento & Caixa",
            en: "Daily Closing & P&L",
          },
          detail: {
            pt: "Consolida o caixa diário por operador, despesas e lucro líquido real.",
            en: "Reconciles daily cash per operator, expenses, and true net profit.",
          },
        },
      ],
    },
    gallery: [
      {
        id: "desktop-management",
        label: {
          pt: "Acompanhamento · Gestão",
          en: "Daily Tracking · Management",
        },
        src: "/projects/dailycheckout/dailycheckout-desktop-management.png",
        appPath: "/gestao",
        orientation: "landscape",
      },
      {
        id: "desktop-expenses",
        label: {
          pt: "Controle Financeiro · Despesas",
          en: "Financial Control · Expenses",
        },
        src: "/projects/dailycheckout/dailycheckout-desktop-management-2.png",
        appPath: "/gestao/despesas",
        orientation: "landscape",
      },
      {
        id: "desktop-reports",
        label: {
          pt: "Análise Financeira · Comissões & Lucro",
          en: "Financial Analysis · Commissions & Profit",
        },
        src: "/projects/dailycheckout/dailycheckout-desktop-management-3.png",
        appPath: "/gestao/relatorios",
        orientation: "landscape",
      },
      {
        id: "mobile-home",
        label: {
          pt: "Operação · Catálogo de Serviços",
          en: "Operations · Service Catalog",
        },
        src: "/projects/dailycheckout/dailycheckout-home.png",
        appPath: "/operacao",
        orientation: "portrait",
      },
      {
        id: "mobile-payment",
        label: {
          pt: "Registrar Atendimento · Pagamento",
          en: "Log Service · Payment Method",
        },
        src: "/projects/dailycheckout/dailycheckout-home-2.png",
        appPath: "/operacao/atendimento",
        orientation: "portrait",
      },
      {
        id: "mobile-tip",
        label: { pt: "Registro de Gorjeta", en: "Tip Recording" },
        src: "/projects/dailycheckout/dailycheckout-home-3.png",
        appPath: "/operacao/gorjeta",
        orientation: "portrait",
      },
      {
        id: "mobile-management",
        label: {
          pt: "Gestão · Resumo do Dia",
          en: "Management · Daily Summary",
        },
        src: "/projects/dailycheckout/dailycheckout-management.png",
        appPath: "/gestao",
        orientation: "portrait",
      },
      {
        id: "mobile-breakdown",
        label: {
          pt: "Resumo por Serviço & Pagamento",
          en: "Service & Payment Breakdown",
        },
        src: "/projects/dailycheckout/dailycheckout-management-2.png",
        appPath: "/gestao/resumo",
        orientation: "portrait",
      },
      {
        id: "mobile-closing",
        label: {
          pt: "Apuração Financeira · Fechamento",
          en: "Daily Closing · Split Settlement",
        },
        src: "/projects/dailycheckout/dailycheckout-management-3.png",
        appPath: "/gestao/fechamento",
        orientation: "portrait",
      },
      {
        id: "mobile-expenses",
        label: { pt: "Controle de Despesas", en: "Expense Tracking" },
        src: "/projects/dailycheckout/dailycheckout-management-4.png",
        appPath: "/gestao/despesas",
        orientation: "portrait",
      },
      {
        id: "mobile-expense-form",
        label: { pt: "Lançamento de Despesa", en: "New Expense Entry" },
        src: "/projects/dailycheckout/dailycheckout-management-5.png",
        appPath: "/gestao/despesas/nova",
        orientation: "portrait",
      },
      {
        id: "mobile-periodic",
        label: { pt: "Relatório Periódico", en: "Periodic P&L Report" },
        src: "/projects/dailycheckout/dailycheckout-management-6.png",
        appPath: "/gestao/relatorios",
        orientation: "portrait",
      },
      {
        id: "mobile-composition",
        label: {
          pt: "Composição Fixas & Comissões",
          en: "Fixed Costs & Commission Split",
        },
        src: "/projects/dailycheckout/dailycheckout-management-7.png",
        appPath: "/gestao/composicao",
        orientation: "portrait",
      },
    ],
    headline: {
      pt: "Dailycheckout é uma aplicação Full-Stack de PDV, fechamento de caixa e gestão financeira para barbearias.",
      en: "Dailycheckout is a Full-Stack POS, daily cash closing and financial management app for barbershops.",
    },
    summary: {
      pt: "Registro ágil de atendimentos e gorjetas na bancada via mobile e painel de gestão completo com apuração automática de comissões (50%), despesas e lucro líquido.",
      en: "Fast mobile service & tip logging at the chair paired with a management console for automated commission splits (50%), expenses and net profit.",
    },
    category: {
      pt: "Aplicação Full-Stack / PDV & Gestão Financeira",
      en: "Full-Stack App / POS & Financial Ops",
    },
    role: {
      pt: "Engenheiro Full-Stack",
      en: "Full-Stack Engineer",
    },
    year: "2026",
    stack: ["React", "Tailwind CSS", "Node.js", "Fastify", "PostgreSQL"],
    details: {
      pt: "Front-end em React consumindo uma API REST própria em Node.js + Fastify, com persistência relacional em PostgreSQL. Separa a operação rápida no celular (lançamento em 2 toques por serviço, forma de pagamento e gorjeta) da gestão gerencial no desktop com fechamento de caixa diário, rateio de operadores, despesas fixas/variáveis e relatório imprimível.",
      en: "A React frontend powered by a custom Node.js + Fastify REST API with PostgreSQL persistence. Separates fast mobile floor operations (2-tap service, payment method and tip logging) from desktop management featuring daily cash closing, operator commission splits, fixed/variable expenses and printable periodic reports.",
    },
    liveUrl: null,
    repoUrl: GITHUB,
    bento: [
      {
        id: "main",
        span: "wide",
        screens: [
          {
            id: "dashboard",
            label: {
              pt: "Acompanhamento · Gestão",
              en: "Daily Tracking · Management",
            },
            src: "/projects/dailycheckout/dailycheckout-desktop-management.png",
            device: "desktop",
          },
          {
            id: "reports",
            label: {
              pt: "Análise Financeira & Comissões",
              en: "Financial Analysis & Commissions",
            },
            src: "/projects/dailycheckout/dailycheckout-desktop-management-3.png",
            device: "desktop",
          },
        ],
      },
      {
        id: "mobile",
        span: "tall",
        screens: [
          {
            id: "mobile-pos",
            label: { pt: "Operação Diária (PDV)", en: "Daily POS Operations" },
            src: "/projects/dailycheckout/dailycheckout-home.png",
            device: "mobile",
          },
          {
            id: "mobile-closing",
            label: { pt: "Fechamento do Dia", en: "Daily Cash Closing" },
            src: "/projects/dailycheckout/dailycheckout-management-3.png",
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-tasks",
        span: "square",
        screens: [
          {
            id: "expenses",
            label: { pt: "Controle de Despesas", en: "Expense Control" },
            src: "/projects/dailycheckout/dailycheckout-desktop-management-2.png",
            device: "desktop",
          },
          {
            id: "payment",
            label: { pt: "Pagamentos & Gorjetas", en: "Payments & Tips" },
            src: "/projects/dailycheckout/dailycheckout-home-2.png",
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-api",
        span: "square",
        screens: [
          {
            id: "periodic-report",
            label: { pt: "Relatório Periódico", en: "Periodic P&L Report" },
            src: "/projects/dailycheckout/dailycheckout-management-6.png",
            device: "mobile",
          },
          {
            id: "composition",
            label: { pt: "Composição das Despesas", en: "Expense Composition" },
            src: "/projects/dailycheckout/dailycheckout-management-7.png",
            device: "mobile",
          },
        ],
      },
    ],
    overview: {
      problem: {
        pt: "Fechamentos de caixa em caderno ou planilhas misturam receita bruta, gorjetas em formas distintas e comissões por barbeiro, gerando divergências no fim do expediente e zero visibilidade do lucro real.",
        en: "Paper notebooks or ad-hoc spreadsheets mix gross revenue, multi-method tips and barber commissions, creating end-of-day discrepancies and zero visibility into true net profit.",
      },
      solution: {
        pt: "Um PDV mobile ultrarrápido conectado a uma API REST dedicada que separa receita de serviços, gorjetas, repasse de operadores (50%) e despesas fixas, entregando apuração diária e relatório periódico pronto para impressão.",
        en: "A fast mobile POS backed by a dedicated REST API that separates service revenue, tips, 50% operator payouts and fixed bills—delivering instant daily closings and print-ready periodic P&L reports.",
      },
    },
    features: [
      {
        id: "checkout",
        title: { pt: "Registro Rápido na Bancada", en: "Fast Chairside POS" },
        description: {
          pt: "Catálogo visual de serviços com seleção de forma de pagamento (Dinheiro, Pix, Crédito, Débito) e gorjeta integrada.",
          en: "Visual service catalog with multi-method payment capture (Cash, Pix, Credit, Debit) and optional split-method tip logging.",
        },
      },
      {
        id: "tasks",
        title: {
          pt: "Fechamento & Repasse 50%",
          en: "Closing & 50% Split Settlement",
        },
        description: {
          pt: "Apuração automática separando serviços próprios do administrador, participação da casa, comissão dos operadores e gorjetas.",
          en: "Automated daily settlement distinguishing admin services, house share, operator 50% commissions and pass-through tips.",
        },
      },
      {
        id: "audit",
        title: {
          pt: "Despesas Fixas & Análise Mensal",
          en: "Expenses & Monthly P&L",
        },
        description: {
          pt: "Controle de contas fixas por vencimento, composição entre custos fixos e variáveis, lucro líquido e exportação para impressão.",
          en: "Due-date tracking for fixed bills, fixed vs. variable cost composition, net profit calculation and print-ready periodic reports.",
        },
      },
      {
        id: "api",
        title: {
          pt: "API Própria em Fastify",
          en: "Dedicated Fastify REST API",
        },
        description: {
          pt: "Endpoints tipados em Node.js + Fastify garantindo cálculo consistente de caixa e auditoria por usuário no PostgreSQL.",
          en: "Typed Node.js + Fastify endpoints guaranteeing consistent cash calculations and per-operator audit trails in PostgreSQL.",
        },
      },
    ],
    architecture: [
      {
        id: "frontend",
        nodeRole: "frontend",
        provider: "Cloudflare",
        protocol: "Edge CDN · SPA",
        securityNote: {
          pt: "PDV mobile na bancada & visão analítica desktop servidos na borda",
          en: "Mobile chairside POS & desktop analytics served on Cloudflare edge",
        },
        layer: {
          pt: "Front-end Mobile-First & Edge",
          en: "Mobile-First Frontend & Edge",
        },
        technologies: ["React", "Tailwind CSS", "Cloudflare"],
        description: {
          pt: "Experiência mobile-first para registro instantâneo na bancada e visão analítica expandida no desktop, entregues pela Cloudflare.",
          en: "Mobile-first experience for instant floor capture paired with an expanded desktop management dashboard, delivered via Cloudflare.",
        },
      },
      {
        id: "api",
        nodeRole: "compute",
        provider: "Render",
        protocol: "HTTPS · REST JSON",
        securityNote: {
          pt: "Regras de comissão (50%) e validação transacional isoladas no servidor",
          en: "50% payout rules & payload validation enforced server-side",
        },
        layer: {
          pt: "API & Regras de Negócio (Deploy Render)",
          en: "API & Business Logic (Render Deploy)",
        },
        technologies: ["Node.js", "Fastify", "Render"],
        description: {
          pt: "API REST dedicada hospedada no Render para regras de comissionamento (50%), fechamento diário, consolidação por método e DRE mensal.",
          en: "Dedicated REST API deployed on Render handling 50% commission rules, daily closing locks, payment-method aggregation and monthly P&L.",
        },
      },
      {
        id: "database",
        nodeRole: "data",
        provider: "Neon",
        protocol: "SSL · Serverless Pool",
        securityNote: {
          pt: "Sessões via Neon Auth + integridade relacional ACID no PostgreSQL",
          en: "Neon Auth sessions + ACID relational integrity on PostgreSQL",
        },
        layer: {
          pt: "Autenticação & Persistência Serverless (Neon)",
          en: "Auth & Serverless Persistence (Neon)",
        },
        technologies: ["Neon", "Neon Auth", "PostgreSQL"],
        description: {
          pt: "Autenticação integrada com Neon Auth e PostgreSQL serverless preservando histórico auditável de atendimentos, gorjetas, operadores e despesas.",
          en: "Integrated Neon Auth and serverless PostgreSQL preserving an auditable history of services, tips, operators and expense entries.",
        },
      },
    ],
    architectureFlows: [
      {
        id: "neon-auth",
        title: {
          pt: "01. Autenticação (Neon Auth)",
          en: "01. Authentication (Neon Auth)",
        },
        trigger: {
          pt: "Barbeiro ou administrador abre o aplicativo na bancada ou escritório",
          en: "Barber or shop manager opens the app at the chair or desk",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Captura credencial e inicia contexto do operador",
              en: "Captures credentials & initializes operator session",
            },
            payload: "HTTPS · dailycheckout.app/operacao",
            detail: {
              pt: "SPA React hospedada na Cloudflare solicita autenticação sem recarregamento e adapta a UI ao perfil.",
              en: "Cloudflare-hosted React SPA negotiates session seamlessly and switches between floor POS or admin view.",
            },
          },
          {
            layerId: "api",
            action: {
              pt: "Validação de token e escopo de permissões",
              en: "Token validation & role scope guard",
            },
            payload: "Authorization: Bearer <neon_jwt> @ Render",
            detail: {
              pt: "Fastify no Render verifica a sessão antes de liberar rotas de lançamento de caixa ou relatórios.",
              en: "Render-hosted Fastify validates the bearer session before exposing POS or P&L routes.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Sessão e perfil persistidos no Neon",
              en: "Session & operator profile verified in Neon",
            },
            payload: "Neon Auth + PostgreSQL (user_role, commission_rate)",
            detail: {
              pt: "Neon Auth confirma identidade e associa o usuário ao seu histórico real de atendimentos e taxas de comissão.",
              en: "Neon Auth verifies identity and binds the operator to their commission rules and historical ledger.",
            },
          },
        ],
      },
      {
        id: "pos-closing",
        title: {
          pt: "02. Registro & Fechamento (Fastify @ Render)",
          en: "02. POS Log & Closing (Fastify @ Render)",
        },
        trigger: {
          pt: "Operador registra atendimento em 2 toques e executa o fechamento do dia",
          en: "Operator logs a service in 2 taps and runs the daily register closing",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Lançamento mobile de serviço, pagamento e gorjeta",
              en: "Mobile capture of service, payment method & tip",
            },
            payload: "{ service: 'Corte', method: 'PIX', tipCents: 1000 }",
            detail: {
              pt: "Fluxo pensado para agilidade na bancada: seleciona o catálogo visual, meio de pagamento e gorjeta opcional.",
              en: "Chairside UX optimized for speed: pick visual service tile, payment method and optional pass-through tip.",
            },
          },
          {
            layerId: "api",
            action: {
              pt: "Cálculo de rateio 50% & consolidação no servidor",
              en: "50% split calculation & server-side aggregation",
            },
            payload: "POST /api/closings · houseShare(50%) + tip(100%)",
            detail: {
              pt: "Fastify no Render separa serviços do admin, participação da casa, repasse dos operadores e gorjetas integrais.",
              en: "Fastify API on Render splits admin own services, 50% shop/barber share and full pass-through tips.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Transação ACID e trilha de auditoria no Neon Postgres",
              en: "ACID transaction & audit trail in Neon Postgres",
            },
            payload: "BEGIN; INSERT entries; INSERT daily_closing; COMMIT;",
            detail: {
              pt: "PostgreSQL serverless na Neon grava o fechamento diário de forma atômica, impedindo divergências de centavos.",
              en: "Serverless Neon PostgreSQL commits the daily closing atomically so totals stay 100% auditable.",
            },
          },
        ],
      },
      {
        id: "monthly-dre",
        title: {
          pt: "03. Despesas & DRE Mensal (Neon Postgres)",
          en: "03. Expenses & Monthly P&L (Neon Postgres)",
        },
        trigger: {
          pt: "Gestor consulta despesas fixas/variáveis e gera relatório periódico no desktop",
          en: "Owner inspects fixed/variable bills and exports periodic desktop P&L",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Filtro de período e preparação para impressão",
              en: "Date-range filtering & print-ready report view",
            },
            payload: "GET /gestao/relatorios?period=monthly",
            detail: {
              pt: "Painel desktop solicita composição entre custos fixos, repasses e receita líquida pronta para impressão.",
              en: "Desktop console requests fixed vs. variable cost composition and net profit layout ready for print.",
            },
          },
          {
            layerId: "api",
            action: {
              pt: "Consolidação financeira por método e categoria",
              en: "Method & expense-category aggregation",
            },
            payload: "GET /v1/reports/pnl · Cash | Pix | Credit | Debit",
            detail: {
              pt: "API no Render cruza receitas por meio de pagamento com contas fixas por vencimento e retorna DTO tipado.",
              en: "Render API aggregates payment methods against scheduled fixed expenses into a clean summary payload.",
            },
          },
          {
            layerId: "database",
            action: {
              pt: "Consulta relacional agregada no Neon PostgreSQL",
              en: "Aggregated relational query on Neon PostgreSQL",
            },
            payload: "SELECT SUM(...) GROUP BY method, category",
            detail: {
              pt: "Pooler serverless do Neon responde agregações sobre atendimentos, comissões e despesas com latência estável.",
              en: "Neon serverless Postgres runs relational aggregations across bookings, commissions and bills cleanly.",
            },
          },
        ],
      },
    ],
    results: [
      {
        metric: {
          pt: "Rastreabilidade total do caixa",
          en: "100% cash traceability",
        },
        description: {
          pt: "Em produção na Barbearia Pires com histórico auditável por barbeiro, serviço e forma de pagamento.",
          en: "Running in production at Barbearia Pires with full per-barber, service and payment-method auditability.",
        },
      },
      {
        metric: {
          pt: "Fechamento & DRE instantâneos",
          en: "Instant closing & P&L",
        },
        description: {
          pt: "Cálculo automático de comissões de 50%, repasse de gorjetas e lucro líquido mensal em tempo real.",
          en: "Real-time calculation of 50% operator commissions, tip payouts and monthly net profit.",
        },
      },
    ],
  },
  {
    tier: "featured",
    slug: "fixflow",
    name: "FixFlow",
    logo: "/projects/fixflow/logo-black.svg",
    previewImage: null,
    demoUrl: null,
    appDomain: "fixflow.app",
    mobileFirst: true,
    liveUrl: null,
    repoUrl: null,
    year: "2026",
    headline: {
      pt: "FixFlow é um PWA mobile-first para prestadores emitirem orçamentos com Pix, contratos e livro-caixa.",
      en: "FixFlow is a mobile-first PWA for field technicians to issue Pix quotes, contracts, and cashbook closings.",
    },
    summary: {
      pt: "Aplicação mobile-first para serviços em campo: orçamentos com snapshot de preços, PDF A4 com QR Code Pix, contratos privados e livro-caixa com alertas Web Push.",
      en: "Mobile-first field operations app: frozen-price quotes, A4 PDFs with Pix QR codes, private contracts, and a monthly cashbook with scheduled Web Push alerts.",
    },
    category: {
      pt: "PWA Mobile-First / Gestão Operacional & Financeira",
      en: "Mobile-First PWA / Field Operations & Finance",
    },
    role: {
      pt: "Autor & Engenheiro Full-Stack",
      en: "Author & Full-Stack Engineer",
    },
    stack: [
      "React",
      "TypeScript",
      "Vite PWA",
      "Tailwind CSS",
      "Supabase",
      "PostgreSQL",
    ],
    details: {
      pt: "PWA single-user sobre React 19, TypeScript e Supabase (PostgreSQL 17 + RLS em todas as 14 tabelas e bucket privado de PDFs). Toda a contabilidade opera em centavos inteiros, delegando recálculo de parcelas, conciliação do Livro-Caixa, recorrências idempotentes e Web Push agendado a RPCs e Edge Function.",
      en: "Single-user PWA built on React 19, TypeScript, and Supabase (PostgreSQL 17 + RLS across all 14 tables and private PDF storage). All accounting runs strictly in integer cents, delegating installment recalculation, cashbook reconciliation, idempotent recurrences, and scheduled Web Push to PostgreSQL RPCs and an Edge Function.",
    },
    bento: [],
    interactiveDemo: {
      provider: "supademo",
      embedUrl:
        "https://app.supademo.com/embed/cmwv130uf01xyqmm1574j15ah?embed_v=2&utm_source=embed",
      title: {
        pt: "Do orçamento ao caixa: prévia A4 com Pix, baixa de parcela e Livro-Caixa",
        en: "From quote to cashbook: A4 Pix preview, installment settlement, and ledger sync",
      },
      aspectRatio: 1.79,
      appPath: "/quotes",
      embedPaddingPx: 0,
      caption: {
        pt: "Tour Interativo HTML · Orçamento A4 com Pix & Livro-Caixa",
        en: "Interactive HTML Tour · A4 Pix Quote & Cashbook Sync",
      },
      steps: [
        {
          code: "01",
          title: {
            pt: "Orçamento com preços congelados",
            en: "Quote with frozen price snapshots",
          },
          detail: {
            pt: "Abre o detalhe do orçamento com itens copiados do catálogo em snapshot imutável, taxa de adversidades e progresso de recebimento.",
            en: "Opens the quote detail view with immutable catalog item snapshots, adversity fee adjustments, and payment progress.",
          },
        },
        {
          code: "02",
          title: {
            pt: "Prévia A4 com Pix EMV e exportação",
            en: "A4 preview with EMV Pix and export",
          },
          detail: {
            pt: "Gera a folha documental pronta para PDF/PNG com QR Code Pix calculado exatamente para a próxima parcela pendente e atalho para WhatsApp.",
            en: "Renders the client-ready A4 sheet for PDF/PNG export with a static BACEN EMV Pix QR code targeting the next unpaid installment.",
          },
        },
        {
          code: "03",
          title: {
            pt: "Baixa da parcela e bloqueio automático",
            en: "Installment settlement and auto-lock",
          },
          detail: {
            pt: "Um toque em Receber liquida a parcela via RPC no PostgreSQL, marca o orçamento como pago (somente leitura) e registra a receita no caixa.",
            en: "One tap settles the installment through a PostgreSQL RPC, transitions the quote to read-only paid status, and posts the cashbook entry.",
          },
        },
        {
          code: "04",
          title: {
            pt: "Livro-Caixa, contratos e alertas",
            en: "Cashbook, contracts, and alerts",
          },
          detail: {
            pt: "Navega para o saldo mensal conciliado com recorrências idempotentes, carteira de contratos com PDF privado e central de alertas sincronizada.",
            en: "Switches to the reconciled monthly ledger with idempotent recurrences, active contracts with private PDFs, and the synced alerts center.",
          },
        },
      ],
    },
    overview: {
      problem: {
        pt: "Prestadores de serviços autônomos multidisciplinares (climatização, elétrica, alvenaria e manutenção) costumam montar orçamentos manualmente no WhatsApp e planilhas, perdendo o histórico de preços quando peças sofrem reajuste. Sem vínculo entre proposta aprovada, parcelas, contratos mensais e despesas fixas, serviços concluídos ficam sem baixa e o caixa mensal exige conciliação manual.",
        en: "Independent multidisciplinary field technicians (HVAC, electrical, masonry, general maintenance) typically draft quotes via ad-hoc WhatsApp messages and spreadsheets, losing historical price integrity whenever material costs change. Without a link between approved quotes, split installments, monthly retainers, and fixed bills, completed jobs go untracked and cash flow requires manual reconciliation.",
      },
      solution: {
        pt: "O FixFlow consolida toda a rotina operacional em um PWA mobile-first de alto contraste operável com uma mão em campo (375px–430px). Serviços e materiais entram no orçamento como snapshots imutáveis em centavos inteiros, geram prévia A4 com QR Code Pix estático (EMV/CRC16) e exportação local em PDF/PNG, enquanto triggers e RPCs no PostgreSQL sincronizam automaticamente parcelas, contratos mensais, despesas fixas e notificações Web Push.",
        en: "FixFlow unifies daily field operations into a high-contrast, one-handed mobile-first PWA (375px–430px). Catalog services and materials are copied into immutable integer-cent quote snapshots that generate single-page A4 PDF/PNG exports with static BACEN EMV/CRC16 Pix QR codes, while PostgreSQL triggers and RPCs automatically reconcile installments, monthly contracts, recurring expenses, and scheduled Web Push alerts.",
      },
    },
    features: [
      {
        id: "snapshot-quotes",
        title: {
          pt: "Orçamentos com Snapshot Histórico e Controle de Exibição",
          en: "Historical-Snapshot Quotes & Price Visibility Control",
        },
        description: {
          pt: "Congela descrição, unidade e preço unitário em quote_items para que reajustes no catálogo não alterem propostas existentes, com opção explícita de atualizar o material no catálogo, taxa de adversidades, toggle show_item_prices e trava somente leitura após quitação.",
          en: "Freezes item descriptions, units, and unit prices inside quote_items so catalog updates never mutate existing proposals, with opt-in catalog price sync on material edits, adversity fees, show_item_prices visibility toggle, and automatic read-only lock once paid.",
        },
      },
      {
        id: "payments-pix-export",
        title: {
          pt: "Parcelamento Estruturado, Pix EMV e Exportação A4",
          en: "Structured Payment Plans, EMV Pix & A4 Export",
        },
        description: {
          pt: "Configura planos à vista, entrada e saldo, parcelado (até 24x) ou personalizado via RPC atômica save_quote_payment_plan, gera BR Code Pix estático (EMV/CRC16-CCITT) direcionado à próxima parcela pendente e exporta PDF (jsPDF) ou PNG (html-to-image) com compartilhamento nativo e wa.me.",
          en: "Configures cash, split deposit, installment (up to 24x), or custom schedules via the atomic save_quote_payment_plan RPC, builds a validated static BACEN EMV/CRC16-CCITT Pix payload targeting the next unpaid installment, and exports A4 PDF (jsPDF) or PNG (html-to-image) via navigator.share or wa.me.",
        },
      },
      {
        id: "cashbook-recurrences",
        title: {
          pt: "Livro-Caixa Mensal e Recorrências Idempotentes",
          en: "Monthly Cashbook & Idempotent Recurrences",
        },
        description: {
          pt: "Controla saldo realizado, previsto, entradas, saídas e atrasos por competência (YYYY-MM) em centavos inteiros, com baixa em um toque e geração idempotente de contratos ativos e despesas fixas pela RPC generate_monthly_recurring_transactions protegida por índices únicos parciais.",
          en: "Tracks realized and projected balances, inflows, outflows, and overdue items per billing month (YYYY-MM) in integer cents, supporting one-tap settlement and idempotent monthly generation of active contracts and fixed expenses via generate_monthly_recurring_transactions backed by partial unique indexes.",
        },
      },
      {
        id: "contracts-private-pdf",
        title: {
          pt: "Contratos Mensais com Storage Privado de PDF",
          en: "Monthly Contracts with Private PDF Storage",
        },
        description: {
          pt: "Gerencia carteira de mensalistas com indicador de receita recorrente mensal, desativação sem perda histórica (is_active) e anexo de PDFs de até 10 MB no bucket privado contract-pdfs, acessados por URLs assinadas com expiração de 60 segundos.",
          en: "Manages recurring retainers with a monthly recurring revenue summary, non-destructive archiving (is_active), and 10 MB PDF attachments stored in the private contract-pdfs bucket accessed via 60-second signed URLs.",
        },
      },
      {
        id: "unified-catalog",
        title: {
          pt: "Catálogo Integrado e Diretório Deduplicado de Clientes",
          en: "Unified Catalog & Deduplicated Client Directory",
        },
        description: {
          pt: "Centraliza serviços por categoria/unidade, materiais com fornecedor e data da última cotação (price_updated_at), fornecedores com atalho direto para WhatsApp e clientes deduplicados por telefone normalizado (normalize_br_phone_digits) no PostgreSQL.",
          en: "Organizes services by category and unit, materials with supplier references and price_updated_at tracking, suppliers with one-tap WhatsApp links, and clients deduplicated via PostgreSQL generated Brazilian phone normalization (normalize_br_phone_digits).",
        },
      },
      {
        id: "alerts-web-push",
        title: {
          pt: "Central de Alertas e Web Push Agendado",
          en: "Alerts Center & Scheduled Web Push",
        },
        description: {
          pt: "Sincroniza vencimentos, atrasos, contratos, serviços concluídos sem baixa e propostas paradas na RPC sync_notifications, com adiamento (snooze), resolução automática e envio agendado às 08h e 18h BRT via pg_cron, pg_net e criptografia Web Push RFC 8291/8292.",
          en: "Synchronizes upcoming/overdue bills, contracts, unpaid completed jobs, and stale quotes via the sync_notifications RPC with snooze and auto-resolution, paired with 08:00 and 18:00 BRT digests sent through pg_cron, pg_net, and RFC 8291/8292 Web Push encryption.",
        },
      },
    ],
    architecture: [
      {
        id: "frontend",
        nodeRole: "frontend",
        provider: "Cloudflare PWA",
        protocol: "HTTPS · Service Worker",
        securityNote: {
          pt: "Acesso ao Supabase isolado em serviços tipados, validação Zod e zero HTML inline",
          en: "Supabase access isolated in typed services, Zod validation, and zero inline HTML",
        },
        layer: {
          pt: "Front-end PWA",
          en: "Mobile-First PWA",
        },
        technologies: ["React 19", "TypeScript", "Vite PWA", "TanStack Query"],
        description: {
          pt: "Interface mobile-first instalável com 4 abas fixas, bottom sheets, cache offline e renderização A4 no navegador.",
          en: "Installable mobile-first UI with 4 bottom tabs, touch sheets, offline font precache, and in-browser A4 rendering.",
        },
      },
      {
        id: "auth-data",
        nodeRole: "data",
        provider: "Supabase",
        protocol: "TLS · RPC / RLS",
        securityNote: {
          pt: "RLS nas 14 tabelas e bucket privado com URLs assinadas de 60s e segredos no Vault",
          en: "RLS across 14 tables, private PDF bucket with 60s signed URLs, and Vault secrets",
        },
        layer: {
          pt: "Dados, Auth & Storage",
          en: "Data, Auth & Storage",
        },
        technologies: ["Supabase", "PostgreSQL 17", "RLS", "PL/pgSQL"],
        description: {
          pt: "Autenticação single-user, storage privado de PDFs e regras críticas em PL/pgSQL com centavos inteiros e baixa idempotente.",
          en: "Single-user auth, private contract PDF storage, and PL/pgSQL domain logic with integer cents and idempotent ledger sync.",
        },
      },
      {
        id: "edge-push",
        nodeRole: "compute",
        provider: "Edge · pg_cron",
        protocol: "HTTPS · VAPID ES256",
        securityNote: {
          pt: "Validação JWT/x-cron-secret em tempo constante e limpeza automática de endpoints 404/410",
          en: "Constant-time JWT/x-cron-secret checks and auto-deactivation of expired 404/410 endpoints",
        },
        layer: {
          pt: "Edge & Web Push",
          en: "Edge & Web Push",
        },
        technologies: ["Deno 2", "Edge Functions", "pg_cron", "Web Crypto"],
        description: {
          pt: "Jobs pg_cron (08h e 18h BRT) acionam a Edge Function que agrupa pendências e cifra alertas Web Push em aes128gcm.",
          en: "Scheduled pg_cron jobs (08:00/18:00 BRT) invoke the Edge Function to batch pending alerts and encrypt Web Push payloads.",
        },
      },
      {
        id: "client-integrations",
        nodeRole: "integration",
        provider: "Pix · A4 · Share",
        protocol: "EMV CRC16 · Web Share",
        securityNote: {
          pt: "Zero gateways externos: BR Code validado localmente e cliques de push restritos à origem",
          en: "Zero external payment gateways: local BR Code validation and same-origin push routing",
        },
        layer: {
          pt: "Pix & Exportação A4",
          en: "Pix & A4 Export",
        },
        technologies: ["Pix EMV", "jsPDF", "html-to-image", "WhatsApp"],
        description: {
          pt: "Gera BR Code Pix estático para a próxima parcela, exporta folha A4 em PDF/PNG e compartilha direto no WhatsApp.",
          en: "Builds static Pix QR codes for the next unpaid installment, exports A4 PDF/PNG locally, and hands off via WhatsApp.",
        },
      },
    ],
    architectureFlows: [
      {
        id: "single-user-auth",
        title: {
          pt: "01. Autenticação Single-User e Isolamento por RLS",
          en: "01. Single-User Auth & RLS Isolation",
        },
        trigger: {
          pt: "Prestador envia credenciais em /login ou acessa qualquer rota protegida do app.",
          en: "Technician submits credentials on /login or navigates to any protected route.",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Validação Zod e submissão de login",
              en: "Zod validation and sign-in request",
            },
            payload: "auth.service.ts → supabase.auth.signInWithPassword()",
            detail: {
              pt: "LoginPage valida e-mail/senha sem expor rota de cadastro público e delega a autenticação à camada de serviço.",
              en: "LoginPage validates email/password with no public sign-up flow and delegates authentication to the service layer.",
            },
          },
          {
            layerId: "auth-data",
            action: {
              pt: "Emissão de sessão JWT e avaliação de RLS",
              en: "JWT session issuance & RLS enforcement",
            },
            payload: "GoTrue JWT + RLS policies (to authenticated)",
            detail: {
              pt: "O Supabase Auth emite token com rotação de refresh token; todas as consultas REST, RPCs e leituras de Storage exigem papel authenticated.",
              en: "Supabase Auth issues a JWT with refresh token rotation; every REST query, RPC call, and Storage operation requires the authenticated role.",
            },
          },
          {
            layerId: "frontend",
            action: {
              pt: "Hidratação da sessão e limpeza no logout",
              en: "Session hydration & cache teardown",
            },
            payload: "AuthProvider → ProtectedRoute → /quotes",
            detail: {
              pt: "AuthProvider libera as rotas protegidas no AppShell e limpa integralmente o cache do TanStack Query no evento SIGNED_OUT.",
              en: "AuthProvider unlocks protected routes inside AppShell and flushes the entire TanStack Query cache on SIGNED_OUT.",
            },
          },
        ],
      },
      {
        id: "quote-to-cashbook",
        title: {
          pt: "02. Emissão de Orçamento, Pix e Conciliação no Livro-Caixa",
          en: "02. Quote Issuance, Pix Export & Cashbook Reconciliation",
        },
        trigger: {
          pt: "Prestador monta itens e parcelas em /quotes/:id, exporta a proposta e confirma o recebimento.",
          en: "Technician adds snapshot items and installments on /quotes/:id, exports the proposal, and settles payment.",
        },
        steps: [
          {
            layerId: "frontend",
            action: {
              pt: "Inserção de snapshots e plano de parcelas",
              en: "Snapshot item insert & payment schedule save",
            },
            payload: "INSERT quote_items + RPC save_quote_payment_plan(...)",
            detail: {
              pt: "quotes.service.ts persiste itens congelados em centavos inteiros e salva o cronograma validado (à vista, entrada/saldo, até 24x ou customizado).",
              en: "quotes.service.ts persists frozen integer-cent item snapshots and saves the validated schedule (cash, split, up to 24x, or custom).",
            },
          },
          {
            layerId: "auth-data",
            action: {
              pt: "Cálculo automático e recálculo de parcelas",
              en: "Trigger totals & pending installment recalculation",
            },
            payload:
              "trg_quote_items_sync_quote_subtotal → recalculate_quote_payments_for_total()",
            detail: {
              pt: "Triggers recalculam subtotal_cents, total_cents e redistribuem parcelas pendentes sem perder centavos nem alterar parcelas já pagas.",
              en: "Database triggers recompute subtotal_cents and total_cents and rebalance pending installments without cent drift or touching paid entries.",
            },
          },
          {
            layerId: "client-integrations",
            action: {
              pt: "Prévia A4 com Pix EMV e exportação local",
              en: "A4 preview with EMV Pix & local export",
            },
            payload:
              "generateQuoteStaticPix() → html-to-image + jsPDF → navigator.share / wa.me",
            detail: {
              pt: "Calcula o BR Code Pix (CRC16-CCITT) para o total ou próxima parcela em aberto e gera PDF/PNG em folha A4 diretamente no navegador.",
              en: "Computes the static Pix BR Code (CRC16-CCITT) for the quote total or next unpaid installment and exports a single-page A4 PDF/PNG in-browser.",
            },
          },
          {
            layerId: "auth-data",
            action: {
              pt: "Baixa da parcela e lançamento idempotente no caixa",
              en: "Installment settlement & idempotent ledger sync",
            },
            payload:
              "RPC set_quote_payment_status() → sync_quote_payments_to_cashbook()",
            detail: {
              pt: "Atualiza financial_transactions protegido pelo índice único parcial uq_financial_transactions_quote_payment_id e promove o orçamento a paid (bloqueado para edição) ao quitar todas as parcelas.",
              en: "Upserts financial_transactions guarded by partial unique index uq_financial_transactions_quote_payment_id and transitions the quote to read-only paid once fully settled.",
            },
          },
        ],
      },
      {
        id: "scheduled-web-push",
        title: {
          pt: "03. Sincronização de Pendências e Web Push Agendado (08h / 18h BRT)",
          en: "03. Pending Alerts Sync & Scheduled Web Push (08:00 / 18:00 BRT)",
        },
        trigger: {
          pt: "Jobs pg_cron (0 11 * * * e 0 21 * * * UTC) disparam a rotina de resumo diário.",
          en: "pg_cron jobs (0 11 * * * and 0 21 * * * UTC) trigger the daily digest routine.",
        },
        steps: [
          {
            layerId: "auth-data",
            action: {
              pt: "Disparo autenticado via Vault e pg_net",
              en: "Vault-authenticated dispatch via pg_net",
            },
            payload:
              "private.invoke_push_dispatch('morning' | 'evening') → net.http_post",
            detail: {
              pt: "Função SECURITY DEFINER no schema privado lê fixflow_project_url e fixflow_push_cron_secret do Supabase Vault e chama a Edge Function.",
              en: "A SECURITY DEFINER function in the private schema reads fixflow_project_url and fixflow_push_cron_secret from Supabase Vault and calls the Edge Function.",
            },
          },
          {
            layerId: "edge-push",
            action: {
              pt: "Sincronização de regras e montagem do digest",
              en: "Rule evaluation & digest assembly",
            },
            payload:
              "POST /functions/v1/push-notifications → RPC sync_notifications()",
            detail: {
              pt: "Valida x-cron-secret, executa sync_notifications() (incluindo recorrências do mês), filtra alertas não lidos/não adiados e agrupa mensagens sem duplicidade no turno.",
              en: "Validates x-cron-secret, runs sync_notifications() (including monthly recurrences), filters unread/unsnoozed alerts, and compiles slot-deduplicated messages.",
            },
          },
          {
            layerId: "client-integrations",
            action: {
              pt: "Criptografia RFC 8291/8292 e entrega aos endpoints",
              en: "RFC 8291/8292 encryption & push delivery",
            },
            payload:
              "VAPID ES256 + ECDH P-256 / AES-128-GCM → Web Push Endpoint",
            detail: {
              pt: "webPush.ts assina o token VAPID e cifra o JSON em aes128gcm via Web Crypto API nativa, desativando inscrições que retornam 404/410.",
              en: "webPush.ts signs the VAPID JWT and encrypts the JSON payload as aes128gcm via native Web Crypto API, automatically deactivating 404/410 subscriptions.",
            },
          },
          {
            layerId: "frontend",
            action: {
              pt: "Exibição nativa, badge e deep link no PWA",
              en: "Native notification, app badge & deep link",
            },
            payload: "src/sw.ts (push / notificationclick) → FIXFLOW_NAVIGATE",
            detail: {
              pt: "O Service Worker exibe a notificação, atualiza setAppBadge e ao clique foca o app abrindo diretamente a rota da pendência (com validação same-origin).",
              en: "The Service Worker shows the notification, updates setAppBadge, and on click focuses the PWA directly on the pending item's same-origin route.",
            },
          },
        ],
      },
    ],
    results: [
      {
        metric: {
          pt: "Zero erros de ponto flutuante · 14 tabelas sob RLS",
          en: "Zero floating-point math · 14 RLS-protected tables",
        },
        description: {
          pt: "Toda a contabilidade opera em centavos inteiros (INTEGER) com integridade imposta por triggers, índices únicos parciais e 7 migrations SQL versionadas.",
          en: "All financial calculations run strictly in integer cents (INTEGER) with integrity enforced by PostgreSQL triggers, partial unique indexes, and 7 versioned SQL migrations.",
        },
      },
      {
        metric: {
          pt: "41 testes unitários + 15 E2E mobile · WCAG AA",
          en: "41 unit tests + 15 mobile E2E tests · WCAG AA",
        },
        description: {
          pt: "Regras críticas (Pix EMV/CRC16, parcelamento, máscaras BR, paginação A4 e criptografia Web Push) cobertas em node --test, fluxos touch 390×844 validados no Playwright e 14 pares de cor auditados em contraste >= 4.5:1.",
          en: "Core domain logic (EMV/CRC16 Pix, installments, BR masks, A4 layout, Web Push crypto) covered by node --test, 390×844 touch flows verified in Playwright, and 14 color pairs audited at >= 4.5:1 contrast.",
        },
      },
    ],
  },
];

/* -------------------------------------------------------------------------- */
/*                        SECONDARY PROJECTS / MODULES                        */
/* -------------------------------------------------------------------------- */

export const secondaryProjects: SecondaryProject[] = [
  {
    tier: "secondary",
    slug: "motor-cobrancas",
    name: "Motor de Cobranças",
    image: null,
    summary: {
      pt: "Motor dedicado à geração de payloads Pix e automação financeira para cobrança do licenciamento do Condonot.",
      en: "Dedicated engine for Pix payload generation and automated SaaS licensing billing for Condonot.",
    },
    category: { pt: "Módulo Financeiro", en: "Financial Module" },
    stack: ["TypeScript", "Node.js", "Pix BR Code"],
    repoUrl: null,
  },
  {
    tier: "secondary",
    slug: "chatbot-condominio-a3",
    name: "Chatbot Condomínio",
    image: null,
    summary: {
      pt: "Assistente inteligente em Python com Groq LLM API e modelos Llama para respostas imediatas sobre regimento e condomínio.",
      en: "Intelligent Python assistant using the Groq LLM API and Llama models for instant answers about bylaws and the condominium.",
    },
    category: { pt: "Inteligência Artificial", en: "Artificial Intelligence" },
    stack: ["Python", "Groq API", "Llama"],
    repoUrl: null,
  },
  {
    tier: "secondary",
    slug: "kac",
    name: "Kanban de Administração Condominial",
    image: null,
    summary: {
      pt: "Sistema de gestão visual de demandas e manutenções condominiais em formato Kanban.",
      en: "Kanban-based visual management system for condominium requests and maintenance.",
    },
    category: { pt: "Gestão & Produtividade", en: "Management & Productivity" },
    stack: ["React", "TypeScript", "Tailwind CSS"],
    repoUrl: null,
  },
];

/* -------------------------------------------------------------------------- */
/*                                   HELPERS                                  */
/* -------------------------------------------------------------------------- */

export const allProjects: Project[] = [
  ...featuredProjects,
  ...secondaryProjects,
];

export function getFeaturedProjectBySlug(
  slug: string | undefined,
): FeaturedProject | undefined {
  return featuredProjects.find((project) => project.slug === slug);
}

/** Returns the next featured project (circular), useful for "next project" navigation. */
export function getNextFeaturedProject(slug: string): FeaturedProject {
  const index = featuredProjects.findIndex((project) => project.slug === slug);
  return featuredProjects[(index + 1) % featuredProjects.length];
}
