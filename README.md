<div align="center">

# Vitor Pires — Portfolio & SaaS Showcase

**Portfólio editorial e vitrine de produtos de software de alta precisão.**  
Construído com React 19, TypeScript, Tailwind CSS v4, Vite 8 e Framer Motion.

[![React](https://img.shields.io/badge/React-19.3-black?style=flat-square&logo=react)](https://react.dev/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-black?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-v4-black?style=flat-square&logo=tailwindcss)](https://tailwindcss.com/)
[![Vite](https://img.shields.io/badge/Vite-8.x-black?style=flat-square&logo=vite)](https://vitejs.dev/)
[![License](https://img.shields.io/badge/License-MIT-black?style=flat-square)](LICENSE)

[Visão Geral](#visao-geral) • [Design System](#design-system) • [Projetos](#projetos) • [Stack](#stack) • [Arquitetura](#arquitetura) • [Instalação](#instalacao)

---

</div>

<a id="visao-geral"></a>
## ✦ Visão Geral

Este repositório contém o código-fonte do portfólio pessoal e vitrine de produtos SaaS de **Vitor Pires** ([@Vitor-Piress](https://github.com/Vitor-Piress)), Desenvolvedor Full-Stack e fundador de software B2B.

A interface foi projetada com base em princípios editoriais contemporâneos inspirados em referências como **cagd.as**, **paco.me**, **upclose.studio** e **emilkowal.ski**:

- **Espaço negativo e fundo contínuo:** Sem grades pesadas ou linhas de tabela cruzando a tela; os elementos flutuam com hierarquia clara sobre fundo preto profundo.
- **Tipografia editorial:** Contraste intencional entre títulos serifados clássicos (_Editorial Serif_), corpo de texto limpo (_Inter/Geist_) e metadados técnicos monoespaçados (_Geist Mono_).
- **Interatividade refinada:** Vitrines com auto-ciclo suave, inspeção microscópica via _Pan & Zoom_, redimensionamento dinâmico de viewport e mini-player de áudio ambiental.

---

<a id="design-system"></a>
## ✦ Design System & Experiência do Usuário

### 1. Hero Stage com Abas & Altura Dinâmica

Na página inicial (`/`), a vitrine de produtos substitui carrosséis convencionais por um **estágio único cinematográfico**:

- **Navegação rápida por abas:** Seletor superior de fluxos (`Painel Geral`, `Gestão de Unidades`, `Modelos & Regimento`, `Auditoria`, `E-mail`) com barra de rolagem oculta (`scrollbar-none`).
- **Pan & Zoom em 1 clique:** Ao clicar na tela, a interface amplia em **2.3x** acompanhando suavemente o cursor do mouse para inspeção de tabelas, menus e regras de negócio, saindo do zoom com novo clique.
- **Morphing Height:** Quando um documento vertical (como a notificação formal por e-mail) é selecionado, a janela se expande dinamicamente para baixo via transição elástica moderna, evitando cortes ou barras de rolagem artificiais.
- **Auto-ciclo inteligente:** Alternância sutil de telas a cada 4,5 segundos com pausa instantânea ao passar o cursor ou acionar o zoom.

### 2. Estudo de Caso Aprofundado (`/project/:slug`)

Páginas dedicadas estruturadas para apresentação direta a clientes comerciais, parceiros e recrutadores:

- Sumário de âncoras rápidas: _Visão Geral_, _Fluxos do Sistema_, _Arquitetura Técnica_ e _Resultados_.
- Moldura de aplicação interativa com simulador de rota/URL, navegação lateral e indicadores de posição.
- Decomposição técnica da arquitetura (banco de dados, segurança RLS, pipelines de e-mail e borda Cloudflare).

### 3. Sistema de Temas e Internacionalização (i18n)

- **Modo Escuro / Claro:** Paleta monocromática com fundo `#050505` no dark mode e `#FAFAFA` no light mode, sem cinzas desbotados.
- **Bilingue nativo (PT / EN):** Dicionário fortemente tipado com persistência local e troca instantânea sem recarregar a página.

### 4. Mini-Player de Áudio Ambiental

Componente fixo no rodapé (`MiniAudioPlayer`) com ondas sonoras monocromáticas, expansão no hover, controle de volume/mudo e reprodução contínua em loop.

### 5. Laboratório de Design (`/lab`)

Área interativa isolada construída para prototipação e validação comparativa de 5 abordagens visuais de exibição de produtos (Hero Stage, Camadas Sobrepostas, Peek Slider, Editorial Panorâmico e Bento Grid).

---

<a id="projetos"></a>
## ✦ Projetos em Destaque

| Projeto                | Categoria                     | Stack Principal                                           | Destaque Técnico                                                                                                  |
| :--------------------- | :---------------------------- | :-------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------- |
| **Condonot**           | SaaS B2B / Gestão Condominial | React, TypeScript, Tailwind, Supabase, Cloudflare, Resend | Isolamento multi-tenant (RLS), motor de cobrança Pix, geração de PDFs formais e e-mails transacionais rastreados. |
| **Moradas do Gabriel** | Hospedagem & Turismo          | React, TypeScript, Tailwind, Supabase                     | Portal interativo para hóspedes com mapa interativo, guia local dinâmico e gestão de regras da casa.              |
| **Dailycheckout**      | Operações & Rotinas           | React, Tailwind, Fastify, PostgreSQL                      | Projeto fullstack, API dedicada com fluxos diários de auditoria operacional e rotinas de abertura/fechamento.     |

---

<a id="stack"></a>
## ✦ Stack Tecnológica

- **Framework:** [React 19](https://react.dev/) + [Vite 8](https://vitejs.dev/)
- **Linguagem:** [TypeScript 5](https://www.typescriptlang.org/) (Strict Mode)
- **Estilização:** [Tailwind CSS v4](https://tailwindcss.com/) com suporte a tokens CSS nativos
- **Roteamento:** [React Router v7](https://reactrouter.com/) com `ScrollRestoration`
- **Animações:** [Framer Motion](https://www.framer.com/motion/)
- **Ícones:** [Lucide React](https://lucide.dev/)
- **Linter & Formatter:** [Oxlint](https://oxc.rs/docs/guide/usage/linter.html) (de alta velocidade)

---

<a id="arquitetura"></a>
## ✦ Arquitetura & Estrutura de Diretórios

```bash
meu-portfolio/
├── public/
│   ├── audio/                 # Áudios ambientes para o mini-player
│   └── projects/
│       └── condonot/          # Capturas de tela WebP em alta definição e logos oficiais
├── src/
│   ├── components/
│   │   ├── home/              # Seções da página inicial (Hero, Featured, Showcase, Trajetória)
│   │   ├── layout/            # Header dinâmico, navegação e MiniAudioPlayer
│   │   ├── project/           # Componentes da página interna de projeto e lightboxes
│   │   └── ui/                # Primitivas visuais (BlurReveal, ProjectVisuals, Badges)
│   ├── context/               # Contextos globais (LanguageContext, ThemeContext)
│   ├── data/                  # Fontes de dados estáticas (projects.ts, profile.ts)
│   ├── i18n/                  # Dicionários de tradução (pt / en)
│   ├── pages/                 # Rotas principais (Home, ProjectDetail, DesignLab)
│   ├── App.tsx                # Configuração do React Router
│   └── main.tsx               # Ponto de entrada da aplicação
├── index.html
├── package.json
└── vite.config.ts
```

---

<a id="instalacao"></a>
## ✦ Instalação e Execução

### Pré-requisitos

- [Node.js](https://nodejs.org/) (versão 20 LTS ou superior)
- `npm`, `pnpm` ou `yarn`

### 1. Clonar o repositório

```bash
git clone https://github.com/Vitor-Piress/meu-portfolio.git
cd meu-portfolio
```

### 2. Instalar as dependências

```bash
npm install
```

### 3. Iniciar o servidor de desenvolvimento

```bash
npm run dev
```

O servidor iniciará em `http://localhost:5173`.

### 4. Compilar para produção

```bash
npm run build
```

Os arquivos otimizados serão gerados na pasta `dist/`.

### 5. Executar o linter

```bash
npm run lint
```

---

<a id="licenca"></a>
## ✦ Licença

Distribuído sob a licença **MIT**. Consulte o arquivo `LICENSE` para mais informações.

---

<div align="center">
  <sub>Desenvolvido com rigor técnico e atenção aos detalhes por <strong>Vitor Pires</strong>.</sub>
</div>
