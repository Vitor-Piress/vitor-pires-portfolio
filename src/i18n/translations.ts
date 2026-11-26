export type Language = "pt" | "en";

export interface TimelineItem {
  period: string;
  role: string;
  organization: string;
  description: string;
  isCurrent?: boolean;
}

export interface StackItem {
  name: string;
  category: string;
}

export type StackLayerId = "frontend" | "backend" | "infra";

export interface StackGroup {
  id: StackLayerId;
  indexLabel: string;
  layerCode: string;
  title: string;
  subtitle: string;
  items: StackItem[];
}

export interface TestimonialItem {
  id: string;
  projectSlug: string;
  quote: string;
  author: string;
  role: string;
  project: string;
  metric: string;
}

export interface TranslationSchema {
  nav: {
    projects: string;
    trajectory: string;
    tech: string;
    contact: string;
    backToHome: string;
    accessSystem: string;
    skipToContent: string;
  };
  hero: {
    name: string;
    headline: string;
    subheadline: string;
    description: string;
    ctaContact: string;
    ctaProjects: string;
    ctaCv: string;
    availability: string;
    availabilityCompact: string;
    scrollHint: string;
    scrollHintAria: string;
  };
  projectsSection: {
    featuredLabel: string;
    secondaryLabel: string;
    secondarySubtitle: string;
    viewDetails: string;
    liveWebsite: string;
    repository: string;
    meta: {
      categoryClient: string;
      role: string;
      year: string;
      stack: string;
      details: string;
    };
  };
  projectDetail: {
    back: string;
    accessSystem: string;
    toc: {
      overview: string;
      flows: string;
      architecture: string;
      results: string;
    };
    sections: {
      overviewTitle: string;
      problemLabel: string;
      solutionLabel: string;
      flowsTitle: string;
      flowsSubtitle: string;
      architectureTitle: string;
      architectureSubtitle: string;
      featuresTitle: string;
      resultsTitle: string;
      clickToExpand: string;
      closePreview: string;
      demoAction: string;
      demoOnRequest: string;
    };
    commercialCta: {
      badge: string;
      headline: string;
      subtext: string;
      licenseAction: string;
      customAction: string;
    };
  };
  interactiveDemo: {
    badge: string;
    videoBadge: string;
    windowLabel: string;
    videoWindowLabel: string;
    liveTag: string;
    pausedTag: string;
    comingSoonTag: string;
    openFullWalkthrough: string;
    expandInCase: string;
    restart: string;
    pause: string;
    play: string;
    interactHint: string;
    videoInteractHint: string;
    mobileNotice: string;
    openFullscreen: string;
    pendingNotice: string;
    stepsHeading: string;
    desktopOnlyBadge: string;
    desktopOnlyTitle: string;
    desktopOnlyDescription: string;
  };
  mobileDeck: {
    previousItem: string;
    nextItem: string;
  };
  editorial: {
    experienceLabel: string;
    educationLabel: string;
    stackLabel: string;
    goalsLabel: string;
    experienceItems: TimelineItem[];
    educationItems: TimelineItem[];
    stackItems: StackItem[];
    stackGroups: StackGroup[];
    goalsTitle: string;
    goalsParagraphs: string[];
  };
  credibility: {
    label: string;
    title: string;
    items: TestimonialItem[];
  };
  footer: {
    headline: string;
    scheduleAction: string;
    copyEmailAction: string;
    emailCopied: string;
    roleSignature: string;
    rights: string;
    scrollToTop: string;
  };
  audioPlayer: {
    label: string;
    playing: string;
    paused: string;
    mute: string;
    unmute: string;
  };
}

const SHARED_STACK_ITEMS: StackItem[] = [
  { name: "React", category: "Frontend" },
  { name: "TypeScript", category: "Language" },
  { name: "Vite", category: "Tooling" },
  { name: "Tailwind CSS", category: "Styling" },
  { name: "Node.js", category: "Backend" },
  { name: "Fastify", category: "API Framework" },
  { name: "Supabase", category: "BaaS / Auth / DB" },
  { name: "PostgreSQL", category: "Database" },
  { name: "GitHub Actions", category: "CI / CD" },
  { name: "Cloudflare", category: "Edge & Infra" },
  { name: "Linux Ubuntu", category: "Environment" },
  { name: "Git", category: "Version Control" },
];

const STACK_ITEMS_BY_NAME = new Map(
  SHARED_STACK_ITEMS.map((item) => [item.name, item]),
);

const STACK_GROUP_DEFS: {
  id: StackLayerId;
  indexLabel: string;
  layerCode: string;
  itemNames: string[];
}[] = [
  {
    id: "frontend",
    indexLabel: "01",
    layerCode: "CLIENT",
    itemNames: ["React", "TypeScript", "Tailwind CSS", "Vite"],
  },
  {
    id: "backend",
    indexLabel: "02",
    layerCode: "SERVER & SQL",
    itemNames: ["Node.js", "Fastify", "PostgreSQL", "Supabase"],
  },
  {
    id: "infra",
    indexLabel: "03",
    layerCode: "EDGE & OPS",
    itemNames: ["Cloudflare", "GitHub Actions", "Linux Ubuntu", "Git"],
  },
];

function buildStackGroups(
  copy: Record<StackLayerId, { title: string; subtitle: string }>,
): StackGroup[] {
  return STACK_GROUP_DEFS.map((def) => ({
    id: def.id,
    indexLabel: def.indexLabel,
    layerCode: def.layerCode,
    title: copy[def.id].title,
    subtitle: copy[def.id].subtitle,
    items: def.itemNames
      .map((name) => STACK_ITEMS_BY_NAME.get(name))
      .filter((item): item is StackItem => Boolean(item)),
  }));
}

export const translations: Record<Language, TranslationSchema> = {
  pt: {
    nav: {
      projects: "Projetos",
      trajectory: "Trajetória",
      tech: "Tech",
      contact: "Contato",
      backToHome: "Voltar",
      accessSystem: "Acessar Sistema",
      skipToContent: "Pular para o conteúdo principal",
    },
    hero: {
      name: "VITOR PIRES",
      headline: "Desenvolvedor Full-Stack & Criador de Produtos SaaS.",
      subheadline:
        "Produtos próprios e sistemas sob medida em operação diária.",
      description:
        "Construo softwares reais, licenciados comercialmente e projetados para resolver dores operacionais complexas com estética refinada, performance e engenharia sólida de ponta a ponta.",
      ctaContact: "Entrar em contato",
      ctaProjects: "Ver projetos",
      ctaCv: "Currículo",
      availability: "Disponível para novos projetos & licenciamento SaaS",
      availabilityCompact: "Disponível para projetos & SaaS",
      scrollHint: "Rolar",
      scrollHintAria: "Rolar para a seção de projetos",
    },
    projectsSection: {
      featuredLabel: "/ PROJETOS PRINCIPAIS & PRODUTOS SAAS",
      secondaryLabel: "/ MÓDULOS TÉCNICOS & PROJETOS ESPECÍFICOS",
      secondarySubtitle:
        "Motores dedicados, integrações com IA e arquiteturas modulares desenvolvidas para operação crítica.",
      viewDetails: "Ver detalhes do projeto",
      liveWebsite: "Acessar site",
      repository: "Acessar site",
      meta: {
        categoryClient: "CATEGORY / CLIENT",
        role: "ROLE",
        year: "YEAR",
        stack: "STACK",
        details: "DETAILS",
      },
    },
    projectDetail: {
      back: "Voltar",
      accessSystem: "Acessar Sistema",
      toc: {
        overview: "Visão Geral",
        flows: "Fluxos do Sistema",
        architecture: "Arquitetura Técnica",
        results: "Resultados",
      },
      sections: {
        overviewTitle: "Contexto & Proposta de Valor",
        problemLabel: "DESAFIO OPERACIONAL",
        solutionLabel: "SOLUÇÃO ARQUITETADA",
        flowsTitle: "Fluxos do Sistema & Interfaces",
        flowsSubtitle:
          "Interface real da plataforma em operação. Projetada para produtividade, clareza visual e eliminação de processos manuais.",
        architectureTitle: "Arquitetura Técnica & Engenharia",
        architectureSubtitle:
          "Decisões de infraestrutura, banco de dados, segurança e integrações.",
        featuresTitle: "Módulos & Funcionalidades-Chave",
        resultsTitle: "Impacto Real & Métricas de Produção",
        clickToExpand: "Expandir tela",
        closePreview: "Fechar visualização",
        demoAction: "Visualizar Demonstração",
        demoOnRequest: "Demonstração sob consulta",
      },
      commercialCta: {
        badge: "LICENCIAMENTO & ENGENHARIA SOB MEDIDA",
        headline:
          "Interessado em licenciar este produto ou construir uma arquitetura similar?",
        subtext:
          "Disponível para demonstrações técnicas, implantação comercial ou desenvolvimento de novos sistemas Full-Stack.",
        licenseAction: "Solicitar demonstração / WhatsApp",
        customAction: "Enviar proposta por E-mail",
      },
    },
    interactiveDemo: {
      badge: "Demo Interativa",
      videoBadge: "Demo em Vídeo",
      windowLabel: "Demonstração Interativa HTML",
      videoWindowLabel: "Demonstração em Vídeo · Desktop",
      liveTag: "Ao vivo",
      pausedTag: "Pausado",
      comingSoonTag: "Em gravação",
      openFullWalkthrough: "Abrir em tela dedicada",
      expandInCase: "Expandir no Case",
      restart: "Reiniciar",
      pause: "Pausar",
      play: "Reproduzir",
      interactHint: "Interaja ou role dentro da interface",
      videoInteractHint:
        "Em loop automático · Clique para pausar ou reproduzir",
      mobileNotice: "Tour interativo HTML otimizado para desktop",
      openFullscreen: "Abrir demo em tela cheia",
      pendingNotice:
        "Demonstração interativa em preparação. Explore abaixo as etapas do fluxo principal.",
      stepsHeading: "FLUXO INTERATIVO GUIADO",
      desktopOnlyBadge: "Somente Desktop",
      desktopOnlyTitle: "Demo interativa disponível apenas no Desktop/PC",
      desktopOnlyDescription:
        "O tour interativo em HTML deste sistema foi projetado para telas maiores. Acesse pelo computador para explorar a interface completa.",
    },
    mobileDeck: {
      previousItem: "Item anterior",
      nextItem: "Próximo item",
    },
    editorial: {
      experienceLabel: "/ EXPERIÊNCIA PROFISSIONAL",
      educationLabel: "/ EDUCAÇÃO",
      stackLabel: "/ ARSENAL TÉCNICO (TECH STACK)",
      goalsLabel: "/ OBJETIVOS & DIRECIONAMENTO",
      experienceItems: [
        {
          period: "2025 - ATUAL",
          role: "Desenvolvedor de Software Independente & SaaS Founder",
          organization: "Produtos Autorais & Desenvolvimento Full-Stack",
          description:
            "Concepção, arquitetura e operação comercial de plataformas SaaS B2B (como o Condonot) e sistemas Full-Stack sob demanda. Responsável por todo o ciclo de engenharia: modelagem PostgreSQL/Supabase, APIs em Node.js/Fastify, interfaces React/TypeScript, automação financeira Pix e deploy em nuvem (Cloudflare).",
          isCurrent: true,
        },
        {
          period: "2024 - ATUAL (2+ ANOS)",
          role: "Analista Administrativo em Gestão Condominial",
          organization: "Administração & Operações Condominiais",
          description:
            "Vivência prática intensiva nas rotinas financeiras, jurídicas e operacionais de condomínios. Essa experiência real de domínio fundamentou a criação de softwares precisos para resolver gargalos de cobrança, emissão de notificações de infração e atendimento a moradores.",
          isCurrent: true,
        },
      ],
      educationItems: [
        {
          period: "EM ANDAMENTO · 5º SEMESTRE",
          role: "Bacharelado em Sistemas de Informação",
          organization: "UNISUL · Universidade do Sul de Santa Catarina",
          description:
            "Foco em engenharia de software, arquitetura de sistemas distribuídos, estrutura de dados, bancos de dados relacionais e gestão de projetos tecnológicos.",
          isCurrent: true,
        },
        {
          period: "CONCLUÍDO",
          role: "Técnico em Desenvolvimento de Sistemas",
          organization: "Formação Técnica Profissionalizante",
          description:
            "Base sólida em lógica de programação, orientação a objetos, modelagem de dados e desenvolvimento de aplicações desktop e web.",
          isCurrent: false,
        },
      ],
      stackItems: SHARED_STACK_ITEMS,
      stackGroups: buildStackGroups({
        frontend: {
          title: "Front-end & Interfaces",
          subtitle:
            "Interfaces reativas, tipagem estrita, design systems e build rápido.",
        },
        backend: {
          title: "Back-end, APIs & Dados",
          subtitle:
            "APIs REST dedicadas, modelagem relacional, regras de negócio e RLS.",
        },
        infra: {
          title: "Infra, Automação & Ambiente",
          subtitle:
            "Deploy na borda, pipelines CI/CD automatizados e operação diária em Linux/Git.",
        },
      }),
      goalsTitle:
        "Engenharia orientada a produto: software que combina rigor técnico, velocidade operacional e estética intencional.",
      goalsParagraphs: [
        "Meu direcionamento profissional une duas frentes complementares: a expansão contínua dos meus produtos SaaS no mercado B2B e a atuação em projetos desafiadores de engenharia Full-Stack onde performance, confiabilidade e experiência de uso são inegociáveis.",
        "Por ter vivenciado na prática a dor operacional antes de escrever a primeira linha de código dos meus sistemas, projeto cada tela e cada endpoint com foco no resultado real: eliminando retrabalho manual, automatizando fluxos financeiros e entregando interfaces que transmitem autoridade imediata.",
      ],
    },
    credibility: {
      label: "/ CREDIBILIDADE & IMPACTO REAL",
      title: "Sistemas validados em operação comercial e uso diário.",
      items: [
        {
          id: "condonot-validation",
          projectSlug: "condonot",
          quote:
            "O Condonot substituiu controles manuais em planilhas e editores de texto por um fluxo único: da identificação da infração à geração do PDF formal e envio rastreado por e-mail em segundos.",
          author: "Operação Comercial Licenciada",
          role: "Administração Condominial B2B",
          project: "Condonot SaaS",
          metric: "-85% no tempo de emissão de notificações",
        },
        {
          id: "moradas-validation",
          projectSlug: "moradas-do-gabriel",
          quote:
            "Hóspedes passaram a acessar painéis digitais, trazendo maior facilidade, modernidade e profissionalismo para o negócio, enquanto a administração gerencia tudo em tempo real pelo painel.",
          author: "Gestão de Hospedagem",
          role: "Operação Hoteleira & Pousada",
          project: "Moradas do Gabriel",
          metric: "100% digitalização do atendimento ao hóspede",
        },
        {
          id: "dailycheckout-validation",
          projectSlug: "dailycheckout",
          quote:
            "O sistema simplificou completamente a nossa rotina de caixa. Hoje fazemos qualquer lançamento em poucos segundos e temos controle e rastreabilidade total de cada centavo, tudo de forma clara e imediata.",
          author: "Arquitetura Full-Stack em Produção",
          role: "Controle de Processos Operacionais",
          project: "Dailycheckout",
          metric: "Rastreadibilidade TOTAL do caixa da Barbearia",
        },
        {
          id: "fixflow-validation",
          projectSlug: "fixflow",
          quote:
            "Aumentou o controle e diminuiu a inconsistência e informalidade na geração de orçamentos e no acompanhamento de pagamentos. O sistema trouxe clareza, velocidade e confiabilidade para a nossas operações.",
          author: "FixFlow",
          role: "PWA Operacional & Financeiro · Serviços Técnicos",
          project: "FixFlow",
          metric: "Facilidade e controle na palma da mão",
        },
      ],
    },
    footer: {
      headline:
        "Tem um novo projeto ou desafio em mente? Estou pronto para conversar.",
      scheduleAction: "Agendar uma conversa / WhatsApp",
      copyEmailAction: "Enviar uma mensagem (Copiar E-mail)",
      emailCopied: "E-mail copiado para a área de transferência",
      roleSignature: "VITOR PIRES · FULL-STACK DEVELOPER",
      rights: "© 2026 Vitor Pires. All rights reserved.",
      scrollToTop: "Voltar ao topo",
    },
    audioPlayer: {
      label: "AMBIENT SOUNDTRACK",
      playing: "PLAYING",
      paused: "PAUSED",
      mute: "MUTE",
      unmute: "UNMUTE",
    },
  },
  en: {
    nav: {
      projects: "Projects",
      trajectory: "Trajectory",
      tech: "Tech",
      contact: "Contact",
      backToHome: "Back",
      accessSystem: "Live System",
      skipToContent: "Skip to main content",
    },
    hero: {
      name: "VITOR PIRES",
      headline: "Full-Stack Developer & SaaS Product Creator.",
      subheadline:
        "Clean architecture, scalable systems, and high-precision interfaces.",
      description:
        "I build real-world, commercially licensed software designed to solve complex operational pain points with refined aesthetics, high performance, and end-to-end engineering rigor.",
      ctaContact: "Get in touch",
      ctaProjects: "View projects",
      ctaCv: "Resume",
      availability: "Available for new projects & SaaS licensing",
      availabilityCompact: "Available for projects & SaaS",
      scrollHint: "Scroll",
      scrollHintAria: "Scroll to projects section",
    },
    projectsSection: {
      featuredLabel: "/ FEATURED PROJECTS & SAAS PRODUCTS",
      secondaryLabel: "/ TECHNICAL MODULES & SPECIALIZED SYSTEMS",
      secondarySubtitle:
        "Dedicated engines, AI integrations, and modular architectures built for mission-critical operations.",
      viewDetails: "View Project Details",
      liveWebsite: "Live Website",
      repository: "GitHub Repo",
      meta: {
        categoryClient: "CATEGORY / CLIENT",
        role: "ROLE",
        year: "YEAR",
        stack: "STACK",
        details: "DETAILS",
      },
    },
    projectDetail: {
      back: "Back",
      accessSystem: "Live System",
      toc: {
        overview: "Overview",
        flows: "System Flows",
        architecture: "Technical Architecture",
        results: "Results",
      },
      sections: {
        overviewTitle: "Context & Value Proposition",
        problemLabel: "OPERATIONAL CHALLENGE",
        solutionLabel: "ARCHITECTED SOLUTION",
        flowsTitle: "System Flows & Interfaces",
        flowsSubtitle:
          "Real production interface. Designed for operational clarity, speed, and zero manual friction.",
        architectureTitle: "Technical Architecture & Engineering",
        architectureSubtitle:
          "Infrastructure decisions, database modeling, security, and integrations.",
        featuresTitle: "Core Modules & Key Capabilities",
        resultsTitle: "Real-World Impact & Production Metrics",
        clickToExpand: "Expand screen",
        closePreview: "Close preview",
        demoAction: "Live Demo",
        demoOnRequest: "Demo on request",
      },
      commercialCta: {
        badge: "LICENSING & BESPOKE ENGINEERING",
        headline:
          "Interested in licensing this product or building a similar architecture?",
        subtext:
          "Available for technical walkthroughs, commercial deployment, or full-stack engineering engagements.",
        licenseAction: "Book a walkthrough / WhatsApp",
        customAction: "Send proposal via Email",
      },
    },
    interactiveDemo: {
      badge: "Interactive Demo",
      videoBadge: "Video Demo",
      windowLabel: "Interactive HTML Demo",
      videoWindowLabel: "Desktop Video Walkthrough",
      liveTag: "Live",
      pausedTag: "Paused",
      comingSoonTag: "Coming soon",
      openFullWalkthrough: "Open full walkthrough",
      expandInCase: "Expand in Case Study",
      restart: "Restart",
      pause: "Pause",
      play: "Play",
      interactHint: "Interact or scroll inside the interface",
      videoInteractHint: "Auto-looping · Click to pause or play",
      mobileNotice: "Interactive HTML tour optimized for desktop",
      openFullscreen: "Open fullscreen demo",
      pendingNotice:
        "Interactive walkthrough in progress. Explore the core system flow steps below.",
      stepsHeading: "GUIDED INTERACTIVE FLOW",
      desktopOnlyBadge: "Desktop only",
      desktopOnlyTitle: "Interactive demo available on Desktop only",
      desktopOnlyDescription:
        "This system's interactive HTML walkthrough is built for larger screens. Visit on a desktop computer to explore the full interface.",
    },
    mobileDeck: {
      previousItem: "Previous item",
      nextItem: "Next item",
    },
    editorial: {
      experienceLabel: "/ PROFESSIONAL EXPERIENCE",
      educationLabel: "/ EDUCATION",
      stackLabel: "/ TECHNICAL ARSENAL (STACK)",
      goalsLabel: "/ GOALS & DIRECTION",
      experienceItems: [
        {
          period: "2024 - PRESENT",
          role: "Independent Software Developer & SaaS Founder",
          organization: "Proprietary SaaS Products & Full-Stack Engineering",
          description:
            "Conception, architecture, and commercial operation of B2B SaaS platforms (such as Condonot) and custom Full-Stack systems. Responsible for the entire engineering lifecycle: PostgreSQL/Supabase modeling, Node.js/Fastify APIs, React/TypeScript interfaces, automated Pix billing, and Cloudflare deployment.",
          isCurrent: true,
        },
        {
          period: "2022 - 2024 (2+ YEARS)",
          role: "Condominium Management Administrative Technician",
          organization: "Property Administration & Operations",
          description:
            "Hands-on domain experience across financial, legal, and operational workflows in condominium management. This direct field background shaped the architecture of high-precision software that eliminates billing bottlenecks, formalizes infraction notices, and streamlines resident support.",
          isCurrent: false,
        },
      ],
      educationItems: [
        {
          period: "IN PROGRESS · 5TH SEMESTER",
          role: "B.S. in Information Systems",
          organization: "UNISUL · University of Southern Santa Catarina",
          description:
            "Focused on software engineering, distributed systems architecture, data structures, relational databases, and technology project management.",
          isCurrent: true,
        },
        {
          period: "INTENSIVE TRACK",
          role: "Full-Stack Engineering Program (Carreira Tech)",
          organization: "SCTEC · Santa Catarina Technology",
          description:
            "Practical specialization in modern Full-Stack web development, RESTful APIs, database design, and production-grade software practices.",
          isCurrent: false,
        },
        {
          period: "COMPLETED",
          role: "Systems Development Technician",
          organization: "Technical Vocational Education",
          description:
            "Strong foundation in programming logic, object-oriented design, data modeling, and full-cycle application development.",
          isCurrent: false,
        },
      ],
      stackItems: SHARED_STACK_ITEMS,
      stackGroups: buildStackGroups({
        frontend: {
          title: "Frontend & Interfaces",
          subtitle:
            "Reactive UIs, strict typing, design systems, and fast build pipelines.",
        },
        backend: {
          title: "Backend, APIs & Data",
          subtitle:
            "Dedicated REST APIs, relational modeling, business logic, and RLS.",
        },
        infra: {
          title: "Infra, Automation & Tooling",
          subtitle:
            "Edge delivery, automated CI/CD pipelines, and Linux/Git workflows.",
        },
      }),
      goalsTitle:
        "Product-driven engineering: software that combines technical rigor, operational speed, and intentional aesthetics.",
      goalsParagraphs: [
        "My professional focus bridges two complementary tracks: scaling my proprietary B2B SaaS products in the market and contributing to high-impact Full-Stack engineering challenges where performance, reliability, and user experience are non-negotiable.",
        "Having experienced operational friction firsthand before writing the first line of code for my platforms, I architect every interface and endpoint around measurable outcomes: eliminating manual rework, automating financial pipelines, and crafting interfaces that convey immediate authority.",
      ],
    },
    credibility: {
      label: "/ CREDIBILITY & REAL-WORLD IMPACT",
      title: "Systems validated in commercial production and daily operations.",
      items: [
        {
          id: "condonot-validation",
          projectSlug: "condonot",
          quote:
            "Condonot replaced fragmented spreadsheets and manual word processors with a single unified pipeline: from infraction logging to formal PDF generation and tracked email delivery in seconds.",
          author: "Licensed Commercial Operation",
          role: "B2B Condominium Administration",
          project: "Condonot SaaS",
          metric: "-85% time spent issuing formal notices",
        },
        {
          id: "moradas-validation",
          projectSlug: "moradas-do-gabriel",
          quote:
            "Guests now access instant Wi-Fi onboarding, curated local guides, and house rules directly from their phones, while property managers update every module in real time via the admin dashboard.",
          author: "Hospitality Management",
          role: "Boutique Guesthouse Operations",
          project: "Moradas do Gabriel",
          metric: "100% digitalized guest onboarding",
        },
        {
          id: "dailycheckout-validation",
          projectSlug: "dailycheckout",
          quote:
            "Decoupling the reactive frontend from the dedicated Fastify + PostgreSQL API brought complete auditability to daily checkout routines and multi-shift task verification.",
          author: "Production Full-Stack Architecture",
          role: "Operational Process Control",
          project: "Dailycheckout",
          metric: "Zero record loss across shift handovers",
        },
        {
          id: "fixflow-validation",
          projectSlug: "fixflow",
          quote:
            "Replaced ad-hoc WhatsApp quotes and scattered spreadsheets with a single mobile PWA: technicians build frozen-price proposals, share A4 PDFs with Pix QR codes, and reconcile settled installments automatically in the cashbook.",
          author: "FixFlow",
          role: "Operations & Finance PWA · Field Service Trades",
          project: "FixFlow",
          metric: "100% integer-cent ledger · EMV Pix + client-side A4 + RLS",
        },
      ],
    },
    footer: {
      headline: "Have a new project or challenge in mind? I'm ready to talk.",
      scheduleAction: "Schedule a call / WhatsApp",
      copyEmailAction: "Send a message (Copy Email)",
      emailCopied: "Email copied to clipboard",
      roleSignature: "VITOR PIRES · FULL-STACK DEVELOPER",
      rights: "© 2026 Vitor Pires. All rights reserved.",
      scrollToTop: "Back to top",
    },
    audioPlayer: {
      label: "AMBIENT SOUNDTRACK",
      playing: "PLAYING",
      paused: "PAUSED",
      mute: "MUTE",
      unmute: "UNMUTE",
    },
  },
};
