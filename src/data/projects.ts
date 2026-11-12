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

export interface ProjectArchitectureItem {
  layer: Localized;
  technologies: string[];
  description: Localized;
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

export interface FeaturedProject {
  tier: "featured";
  slug: string;
  name: string;
  logo: string | null;
  previewImage: string | null;
  demoUrl: string | null;
  appDomain?: string;
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
  bento: ProjectBentoBlock[];
  overview: {
    problem: Localized;
    solution: Localized;
  };
  features: ProjectFeature[];
  architecture: ProjectArchitectureItem[];
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
      en: "Condonot is a SaaS platform that automates management and billing for condominiums.",
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
      pt: "Arquitetura multi-tenant sobre Supabase (PostgreSQL + Row Level Security) com deploy na borda via Cloudflare. Unifica em um único fluxo o que antes exigia planilhas, editores de texto e controles manuais: da identificação da infração ao PDF formal, payload Pix e entrega por e-mail em segundos.",
      en: "Multi-tenant architecture on Supabase (PostgreSQL + Row Level Security) deployed at the edge via Cloudflare. It merges into a single pipeline what used to require spreadsheets, word processors and manual tracking: from infraction logging to a formal PDF, Pix payload and email delivery in seconds.",
    },
    liveUrl: null,
    repoUrl: null,
    gallery: [
      {
        id: "dashboard",
        label: {
          pt: "Painel Geral & Centro de Ações",
          en: "Operations Dashboard & Action Center",
        },
        src: "/projects/condonot/condonot-home.webp",
        appPath: "/dashboard",
      },
      {
        id: "unidades",
        label: {
          pt: "Gestão de Unidades & Moradores",
          en: "Units & Residents Management",
        },
        src: "/projects/condonot/condonot-unidades.webp",
        appPath: "/unidades",
      },
      {
        id: "modelos",
        label: {
          pt: "Modelos de Notificação & Artigos do Regimento",
          en: "Notice Templates & Bylaws Framing",
        },
        src: "/projects/condonot/condonot-modelos.webp",
        appPath: "/modelos",
      },
      {
        id: "relatorios",
        label: {
          pt: "Relatórios de Gestão & Rastreabilidade",
          en: "Management Reports & Delivery Tracking",
        },
        src: "/projects/condonot/condonot-relatorio.webp",
        appPath: "/relatorios",
      },
      {
        id: "condominios",
        label: {
          pt: "Configurações de Condomínio & Regras",
          en: "Condominium Settings & Rules",
        },
        src: "/projects/condonot/condonot-condominios.webp",
        appPath: "/configuracoes",
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
            src: "/projects/condonot/condonot-modelos.webp",
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
        pt: "Administradoras de condomínio emitem notificações formais de forma manual: documentos montados em editores de texto, cálculos e registros em planilhas e e-mails enviados sem rastreabilidade. O resultado é retrabalho, erros e baixa taxa de assertividade.",
        en: "Condominium management companies issue formal notices manually: documents assembled in text editors, calculations and records in spreadsheets, and emails sent without tracking. The result is rework, errors, and a low success rate.",
      },
      solution: {
        pt: "Uma plataforma única que centraliza unidades e moradores, gera notificações formais em PDF com fundamentação no regimento e dispara e-mails transacionais com status de entrega — tudo com isolamento total de dados entre condomínios.",
        en: "A single platform that centralizes units and residents, generates formal PDF notices grounded in the bylaws, and dispatches transactional emails with delivery tracking — all with complete data isolation between condominiums.",
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
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "TypeScript", "Tailwind CSS", "Vite"],
        description: {
          pt: "SPA tipada de ponta a ponta, com componentes reutilizáveis e formulários validados.",
          en: "End-to-end typed SPA with reusable components and validated forms.",
        },
      },
      {
        layer: { pt: "Dados & Autenticação", en: "Data & Auth" },
        technologies: ["Supabase", "PostgreSQL", "Row Level Security"],
        description: {
          pt: "Modelo multi-tenant com políticas RLS garantindo que cada administradora acesse apenas seus próprios dados.",
          en: "Multi-tenant model with RLS policies ensuring each administrator only accesses its own data.",
        },
      },
      {
        layer: { pt: "Infraestrutura", en: "Infrastructure" },
        technologies: ["Cloudflare"],
        description: {
          pt: "Deploy na borda com CDN global, HTTPS e baixa latência.",
          en: "Edge deployment with global CDN, HTTPS and low latency.",
        },
      },
      {
        layer: { pt: "Integrações", en: "Integrations" },
        technologies: ["Resend", "Pix BR Code"],
        description: {
          pt: "E-mails transacionais e geração de cobranças no padrão do Banco Central.",
          en: "Transactional emails and charges generated following the Brazilian Central Bank standard.",
        },
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
          pt: "Notificação, PDF, cobrança e envio em um único fluxo de segundos.",
          en: "Notice, PDF, charge and delivery in a single flow that takes seconds.",
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
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "TypeScript", "Tailwind CSS"],
        description: {
          pt: "Interface mobile-first, leve e rápida, pensada para o primeiro acesso do hóspede.",
          en: "Lightweight, fast mobile-first interface designed for the guest’s first access.",
        },
      },
      {
        layer: { pt: "Dados & Autenticação", en: "Data & Auth" },
        technologies: ["Supabase", "PostgreSQL"],
        description: {
          pt: "Conteúdo público para hóspedes e área administrativa protegida por autenticação e políticas de acesso.",
          en: "Public content for guests and an admin area protected by authentication and access policies.",
        },
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
    logo: null,
    previewImage: null,
    demoUrl: null,
    appDomain: "dailycheckout.app",
    headline: {
      pt: "Dailycheckout é uma aplicação Full-Stack para controle operacional e rotinas diárias de checkout.",
      en: "Dailycheckout is a Full-Stack application for operational control and daily checkout routines.",
    },
    summary: {
      pt: "Front-end reativo e API própria dedicada para controlar rotinas de checkout, tarefas diárias e fluxos operacionais com rastreabilidade completa.",
      en: "A reactive frontend and a dedicated in-house API to manage checkout routines, daily tasks and operational workflows with full traceability.",
    },
    category: {
      pt: "Aplicação Full-Stack / Operações",
      en: "Full-Stack Application / Operations",
    },
    role: {
      pt: "Engenheiro Full-Stack",
      en: "Full-Stack Engineer",
    },
    year: "2026",
    stack: ["React", "Tailwind CSS", "Node.js", "Fastify", "PostgreSQL"],
    details: {
      pt: "Separação clara entre cliente e servidor: front-end em React consumindo uma API REST própria em Node.js + Fastify, com persistência em PostgreSQL. Cada checkout, tarefa e troca de turno fica registrado com autor e horário, garantindo auditoria das rotinas diárias.",
      en: "Clear client/server separation: a React frontend consuming a custom REST API built with Node.js + Fastify, persisted in PostgreSQL. Every checkout, task and shift handover is recorded with author and timestamp, ensuring auditable daily routines.",
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
            label: { pt: "Painel do Dia", en: "Daily Dashboard" },
            src: null,
            device: "desktop",
          },
          {
            id: "history",
            label: { pt: "Histórico & Auditoria", en: "History & Audit" },
            src: null,
            device: "desktop",
          },
        ],
      },
      {
        id: "mobile",
        span: "tall",
        screens: [
          {
            id: "mobile-checklist",
            label: { pt: "Checklist Mobile", en: "Mobile Checklist" },
            src: null,
            device: "mobile",
          },
          {
            id: "mobile-checkout",
            label: { pt: "Checkout", en: "Checkout" },
            src: null,
            device: "mobile",
          },
        ],
      },
      {
        id: "flow-tasks",
        span: "square",
        screens: [
          {
            id: "tasks",
            label: { pt: "Tarefas Diárias", en: "Daily Tasks" },
            src: null,
            device: "desktop",
          },
          {
            id: "shift",
            label: { pt: "Troca de Turno", en: "Shift Handover" },
            src: null,
            device: "desktop",
          },
        ],
      },
      {
        id: "flow-api",
        span: "square",
        screens: [
          {
            id: "api",
            label: { pt: "API Fastify", en: "Fastify API" },
            src: null,
            device: "desktop",
          },
          {
            id: "reports",
            label: { pt: "Relatórios", en: "Reports" },
            src: null,
            device: "desktop",
          },
        ],
      },
    ],
    overview: {
      problem: {
        pt: "Rotinas operacionais diárias controladas em papel ou mensagens se perdem em trocas de turno, sem histórico confiável de quem fez o quê e quando.",
        en: "Daily operational routines tracked on paper or chat messages get lost during shift handovers, with no reliable record of who did what and when.",
      },
      solution: {
        pt: "Uma aplicação Full-Stack com API dedicada que padroniza checklists, registra cada checkout e mantém um histórico auditável de todas as operações.",
        en: "A Full-Stack application with a dedicated API that standardizes checklists, records every checkout and keeps an auditable history of all operations.",
      },
    },
    features: [
      {
        id: "checkout",
        title: { pt: "Rotinas de Checkout", en: "Checkout Routines" },
        description: {
          pt: "Fluxo guiado de encerramento diário com validação de cada etapa.",
          en: "Guided daily closing flow with validation of every step.",
        },
      },
      {
        id: "tasks",
        title: { pt: "Gestão de Tarefas Diárias", en: "Daily Task Management" },
        description: {
          pt: "Checklists recorrentes atribuídos por turno e responsável.",
          en: "Recurring checklists assigned by shift and owner.",
        },
      },
      {
        id: "audit",
        title: { pt: "Histórico & Auditoria", en: "History & Audit" },
        description: {
          pt: "Registro de autor, data e hora de cada ação para rastreabilidade total.",
          en: "Author, date and time recorded for every action for full traceability.",
        },
      },
      {
        id: "api",
        title: { pt: "API Própria Dedicada", en: "Dedicated In-House API" },
        description: {
          pt: "Endpoints REST em Fastify com validação de schemas e alta performance.",
          en: "Fastify REST endpoints with schema validation and high performance.",
        },
      },
    ],
    architecture: [
      {
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "Tailwind CSS"],
        description: {
          pt: "Interface reativa e responsiva para uso em desktop e celular durante a operação.",
          en: "Reactive, responsive interface for desktop and mobile use during operations.",
        },
      },
      {
        layer: { pt: "Back-end / API", en: "Backend / API" },
        technologies: ["Node.js", "Fastify"],
        description: {
          pt: "API REST dedicada com rotas tipadas, validação de entrada e tratamento centralizado de erros.",
          en: "Dedicated REST API with typed routes, input validation and centralized error handling.",
        },
      },
      {
        layer: { pt: "Banco de Dados", en: "Database" },
        technologies: ["PostgreSQL"],
        description: {
          pt: "Modelagem relacional com integridade referencial para histórico e auditoria.",
          en: "Relational modeling with referential integrity for history and auditing.",
        },
      },
    ],
    results: [
      {
        metric: { pt: "Zero perda de registros", en: "Zero record loss" },
        description: {
          pt: "Todas as rotinas preservadas entre trocas de turno.",
          en: "Every routine preserved across shift handovers.",
        },
      },
      {
        metric: { pt: "Arquitetura desacoplada", en: "Decoupled architecture" },
        description: {
          pt: "Front-end e API independentes, prontos para escalar ou receber novos clientes (ex: app mobile).",
          en: "Independent frontend and API, ready to scale or support new clients (e.g. a mobile app).",
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
    slug: "motor-cobrancas-condonot",
    name: "Motor de Cobranças Condonot",
    image: null,
    summary: {
      pt: "Motor dedicado à geração de payloads Pix e automação financeira condominial.",
      en: "Dedicated engine for Pix payload generation and condominium financial automation.",
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
    repoUrl: GITHUB,
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
    repoUrl: GITHUB,
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
