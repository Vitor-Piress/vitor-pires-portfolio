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
    liveUrl: "https://condonot.com.br/demo",
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
    logo: "/projects/dailycheckout/dailycheckout-logo.svg",
    previewImage:
      "/projects/dailycheckout/dailycheckout-desktop-management.png",
    demoUrl: null,
    appDomain: "dailycheckout.app",
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
        layer: { pt: "Front-end", en: "Frontend" },
        technologies: ["React", "Tailwind CSS"],
        description: {
          pt: "Experiência mobile-first para registro instantâneo na barbearia e visão analítica expandida no desktop de gestão.",
          en: "Mobile-first experience for instant floor capture paired with an expanded desktop management dashboard.",
        },
      },
      {
        layer: { pt: "Back-end / API", en: "Backend / API" },
        technologies: ["Node.js", "Fastify"],
        description: {
          pt: "API REST dedicada para regras de comissionamento, fechamento diário, consolidação por método e consolidação mensal.",
          en: "Dedicated REST API handling commission rules, daily closing locks, payment-method aggregation and monthly P&L.",
        },
      },
      {
        layer: { pt: "Banco de Dados", en: "Database" },
        technologies: ["PostgreSQL"],
        description: {
          pt: "Modelagem relacional preservando histórico de atendimentos, gorjetas, operadores e lançamentos de despesas.",
          en: "Relational schema preserving full history of services, tips, operators and categorized expense entries.",
        },
      },
    ],
    results: [
      {
        metric: {
          pt: "Rastreabilidade total do caixa",
          en: "100% cash traceability",
        },
        description: {
          pt: "Em produção na Barbearia Dom Domênico com histórico auditável por barbeiro, serviço e forma de pagamento.",
          en: "Running in production at Barbearia Dom Domênico with full per-barber, service and payment-method auditability.",
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
      pt: "Motor dedicado à geração de payloads Pix e automação financeira.",
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
