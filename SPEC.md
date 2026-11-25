# MASTER PROMPT: Portfólio Autoral & Vitrine de Produtos — Vitor Pires

## 1. Visão Geral e Conceito Central

Você vai arquitetar e desenvolver o portfólio pessoal e vitrine de produtos SaaS de **Vitor Pires** (GitHub: `https://github.com/Vitor-Piress`).
O design e o fluxo de uso são diretamente inspirados na combinação de **cagd.as**, **upclose.studio**, **paco.me** e **emilkowal.ski**:

- **Fundo Contínuo e Espaço Negativo:** O site NÃO deve usar linhas de grade visíveis ou divisórias estilo tabela. Os elementos de texto flutuam de forma limpa sobre o fundo preto profundo, usando o espaço vazio para criar hierarquia e elegância.
- **Bento Grids Modulares:** A organização visual de projetos, interfaces e informações é feita através de **Bento Grids** (mosaicos assimétricos de blocos independentes separados por `gap`, sem linhas cruzando a página).
- **Fluxo de Uso Contínuo e Objetivo:** Navegação fluida, leitura direta, animações sutis de entrada com _blur_ e troca automática das telas dos sistemas dentro dos blocos do Bento Grid para demonstrar diferentes fluxos de uso da aplicação.
- **Zero "Fru-fru":** Cursor 100% nativo do sistema. Sem fotos pessoais ou vídeos do autor na Hero section.

---

## 2. Stack Tecnológica e Arquitetura

- **Core:** React + Vite + TypeScript.
- **Roteamento:** `react-router-dom` (v6+) com `ScrollRestoration` (garantindo que a navegação entre a Home e a página de cada projeto seja instantânea e inicie no topo).
- **Estilização:** Tailwind CSS.
- **Animações:** `framer-motion` (usado para: 1. Entrance animations com blur no scroll; 2. Auto-ciclo de imagens dentro dos Bento Grids; 3. Transição do nome da Hero para o Header; 4. Expansão suave do mini-player de áudio).
- **Ícones:** `lucide-react`.
- **Internacionalização (i18n):** Suporte completo a **Português (`PT`)** e **Inglês (`EN`)** com seletor rápido.
- **Temas:** **Dark Mode (Padrão)** e **Light Mode** via classe `dark` no Tailwind.

---

## 3. Design System & Comportamento Visual

### 3.1. Paleta Monocromática (Preto & Branco)

- **Dark Mode (Default):**
  - Background da Página: `#050505` (Preto profundo contínuo, sem áreas de cinza lavado).
  - Blocos do Bento Grid: `#0D0D0D` ou `#111111` (destacando-se sutilmente do fundo pelo contraste de tom e pelo conteúdo interno).
  - Textos: Primário `#FAFAFA` | Secundário `#A1A1AA` | Metadados/Labels `#52525B`.
- **Light Mode:**
  - Background da Página: `#FAFAFA` | Blocos do Bento Grid: `#F0F0F2` ou `#FFFFFF` com sombra ultra-suave.
  - Textos: Primário `#09090B` | Secundário `#52525B`.

### 3.2. Formato dos Bento Grids

- Os blocos dos Bento Grids têm **arestas retas** (ou raio mínimo de `2px`/`4px` apenas para acabamento das imagens, seguindo a estética do _upclose.studio_ e _cagd.as_).
- O agrupamento visual acontece pelo **espaçamento consistente (`gap-4` ou `gap-6`)** entre os cards de tamanhos diferentes (ex: 1 bloco largo no topo + 2 blocos menores lado a lado embaixo).

### 3.3. Tipografia

1. **Serif Editorial (`Instrument Serif` ou `Newsreader`):** Usada nos títulos dos blocos de projeto (estilo _cagd.as_) e na frase final de contato no rodapé.
2. **Sans-Serif Limpa (`Inter` ou `Geist`):** Usada em toda a leitura principal, descrições e navegação (estilo _paco.me_ / _emilkowal.ski_).
3. **Monoespaçada (`Geist Mono` ou `JetBrains Mono`):** Usada em pequenos rótulos de metadados (`ROLE`, `YEAR`, `CLIENT`), datas e indicadores técnicos.

### 3.4. Fluxo de Animações (Inspirado em upclose.studio, breeder e emilkowal.ski)

- **Scroll Blur & Appear:** Conforme o usuário rola a página, as seções e os blocos do Bento Grid entram suavemente saindo de `opacity: 0, filter: blur(10px), y: 15` para `opacity: 1, filter: blur(0px), y: 0`. Conteúdos que saem de foco ou cards não selecionados em um grupo recebem um leve desfoque (`blur(2px)`) e redução de opacidade.
- **Header Dinâmico (Conceito Breeder):** O nome `VITOR PIRES` inicia na Hero section e, ao rolar a página, sobe e se fixa de forma limpa no canto superior esquerdo do Header.
- **Auto-Ciclo de Fluxos nos Projetos (Conceito Upclose):** Dentro dos blocos do Bento Grid de cada projeto, as telas do sistema alternam automaticamente a cada 4 segundos (transição suave de crossfade), mostrando diferentes telas/fluxos da interface sem que o usuário precise clicar em carrosséis.

---

## 4. Fluxo de Uso e Estrutura da Página Inicial (`/`)

### 4.1. Navegação Superior (Discreta)

- Topo limpo, sem barras pesadas. Links diretos alinhados à direita (`Projetos`, `Trajetória`, `Contato`) + Seletor `PT / EN` + Toggle `Dark / Light`.

### 4.2. Hero Section (Objetiva e Sem Fotos)

- Inspirada na simplicidade direta de _paco.me_, _emilkowal.ski_ e no print minimalista de referência:
- Nome `VITOR PIRES` + Frase de impacto curta e forte apresentando sua atuação como Desenvolvedor Full-Stack e Criador de Produtos SaaS.
- Um parágrafo conciso introduzindo sua visão e objetivos iniciais (construir softwares reais, escaláveis e com estética refinada que resolvem dores operacionais).
- Botões de ação diretos (ex: botão pill branco sobre fundo preto `"Entrar em contato"` / `"Ver projetos"` + links rápidos para GitHub e LinkedIn).

### 4.3. Vitrine de Projetos Principais (Fluxo `cagd.as` + `upclose.studio`)

Para cada um dos **3 Projetos Principais**, crie uma seção ampla usando o layout assimétrico consagrado no _cagd.as_:

- **Lado Esquerdo (Coluna de Contexto e Metadados — Solta no fundo preto):**
  - Identidade visual / Logo oficial do projeto.
  - Título/Chamada editorial em fonte grande (ex: _"Condonot é uma plataforma SaaS para automatizar a gestão e cobrança em condomínios."_).
  - Parágrafo curto explicando o que foi construído.
  - Link em destaque: **`View Project Details →`** (navega para `/project/:slug`) e link externo **`Live Website ↗`**.
  - Abaixo, alinhado de forma limpa em duas colunas sem bordas (exatamente como no print do _Maxus Capital / cagd.as_):
    - `CATEGORY / CLIENT` | `ROLE` | `YEAR` | `STACK`
    - Seguido do bloco `DETAILS` com um texto objetivo sobre a arquitetura e o impacto real do projeto.
- **Lado Direito (O Bento Grid Visual do Projeto):**
  - Um mosaico Bento Grid contendo 3 a 4 blocos de proporções variadas (ex: um bloco grande superior mostrando o Dashboard principal, um bloco vertical à direita mostrando a versão Mobile, e dois blocos inferiores mostrando fluxos específicos).
  - As imagens dentro desses blocos alternam automaticamente (auto-cycle) para exibir o fluxo de uso do sistema.

**Lista dos 3 Projetos Principais (Com Página Dedicada `/project/:slug`):**

1. **`condonot` (Condonot):** Plataforma SaaS B2B para administração condominial (licenciada comercialmente e em operação). Gestão de unidades, emissão de notificações de infração formais, motor automatizado de cobrança Pix, geração de PDFs e disparo de e-mails via Resend. (React, TypeScript, Tailwind, Supabase, Cloudflare, Resend).
2. **`moradas-do-gabriel` (Moradas do Gabriel):** Portal digital interativo para hóspedes e sistema de gestão para pousada/hospedagem. Guia local, mapas interativos, conectividade Wi-Fi rápida e painel administrativo completo. (React, TypeScript, Tailwind, Supabase).
3. **`dailycheckout` (Dailycheckout):** Aplicação Full-Stack completa (Front-end + API própria dedicada) para controle operacional, rotinas de checkout e gestão de fluxos diários. (React, Tailwind, Node.js/Fastify, PostgreSQL).

### 4.4. Bento Grid de Projetos Secundários & Módulos Técnicos

Logo após os 3 destaques principais, um Bento Grid único de 3 blocos para apresentar os projetos específicos/locais.

- Cada bloco mostra uma imagem/referência técnica e o título. Ao passar o mouse (`:hover`), revela de forma nítida o resumo de 1 linha do projeto enquanto desfoca sutilmente os blocos vizinhos:

1. **Motor de Cobranças:** Motor dedicado à geração de payloads Pix e automação financeira.
2. **Chatbot Condomínio:** Assistente inteligente em Python utilizando Groq LLM API e modelos Llama para respostas imediatas sobre regimento e condomínio.
3. **KAC (Kanban de Administração Condominial):** Sistema e arquitetura de gestão visual de demandas e manutenções condominiais.

### 4.5. Seção Editorial: Cronologia, Stack & Objetivos (Inspirada na referência Editorial e `leerob.com`)

Uma seção limpa, focada em leitura e hierarquia tipográfica, apresentando sua trajetória sem poluição visual:

- **`/ EXPERIÊNCIA PROFISSIONAL` & `/ EDUCAÇÃO`:**
  - Linha do tempo limpa (com marcadores circulares simples `●` e `○` conectando a evolução):
  - **Profissional:** Desenvolvedor de Software Independente & SaaS Founder (Atual) + Analista Administrativo em Gestão Condominial (2+ anos de experiência prática que fundamentam seus softwares de gestão).
  - **Acadêmico:** Bacharelado em Sistemas de Informação (UNISUL — 5º semestre) + Formação Full-Stack SCTEC Carreira Tech + Técnico em Desenvolvimento de Sistemas.
- **`/ ARSENAL TÉCNICO (STACK)`:**
  - Apresentação elegante e direta das tecnologias que domina (React, Vite, TypeScript, Tailwind CSS, Node.js, Fastify, Python, Supabase, PostgreSQL, Linux Ubuntu, Cloudflare, Git) com indicadores visuais minimalistas de domínio.
- **`/ OBJETIVOS & DIRECIONAMENTO`:**
  - Bloco editorial fechando a seção sobre você: aprofunda seus objetivos de expandir seus produtos SaaS no mercado, atuar em projetos desafiadores de engenharia Full-Stack e criar soluções digitais de alta precisão.

### 4.6. Seção de Credibilidade (Testimonials / Impacto Real)

- Inspirada na seção de testemunhos do _cagd.as_: blocos escuros em formato Bento Grid trazendo depoimentos e resultados reais do uso dos seus sistemas (como a validação comercial do Condonot em condomínios reais e o uso prático do Moradas do Gabriel).

### 4.7. Rodapé de Conversão (Inspirado no Footer do `cagd.as`)

- Muito espaço livre em preto profundo.
- No centro, a chamada em fonte Serifada elegante:
  - PT: _"Tem um novo projeto ou desafio em mente? Estou pronto para conversar."_
  - EN: _"Have a new project or challenge in mind? I'm ready to talk."_
- Logo abaixo, dois links sublinhados minimalistas: **`Agendar uma conversa / WhatsApp`** ou **`Enviar uma mensagem (Copiar E-mail)`**.
- Na base inferior extrema: `VITOR PIRES — FULL-STACK DEVELOPER` à esquerda, links sociais no centro (`GitHub`, `LinkedIn`) e `© 2026 Vitor Pires. All rights reserved.` à direita.

---

## 5. Fluxo da Página Individual de Projeto (`/project/:slug`)

Pensada para ser enviada diretamente a clientes comerciais ou recrutadores:

1. **Header da Página:** Botão limpo `← Voltar` + Identidade Oficial (Logo) do Projeto + Botão `Acessar Sistema ↗`.
2. **Índice de Navegação Rápida:** Um sumário minimalista no topo permitindo pular direto para: `Visão Geral`, `Fluxos do Sistema`, `Arquitetura Técnica` e `Resultados`.
3. **Vitrine em Bento Grid Ampliado:** Um Bento Grid dedicado mostrando todas as principais telas do projeto (com auto-ciclo nos fluxos principais e possibilidade de clicar para ampliar uma tela), acompanhado de blocos explicando cada funcionalidade (ex: no Condonot, blocos explicando o Motor Pix, a geração de PDFs e o disparo de e-mails).
4. **Fechamento Comercial:** Mesma estética do rodapé da Home, convidando o cliente a licenciar o produto ou solicitar um orçamento/conversa.

---

## 6. Componente Fixo no Bottom: Mini-Player de Áudio (Conceito `upclose.studio`)

Fixo na parte inferior central da tela (`fixed bottom-5 left-1/2 -translate-x-1/2 z-50`):

- **Estado Padrão (Minimizado):** Apenas uma barrinha fina e discreta (`h-6 px-3 bg-[#0D0D0D]/90 backdrop-blur-md`), exibindo ondas sonoras minimalistas em P&B que se movem conforme a música.
- **Ao Interagir (Hover ou Clique):** A barrinha expande suavemente revelando controles simples: `[ Play / Pause ]`, `[ Mute / Unmute ]` e uma pequena legenda em fonte mono.
- Conecta-se a um elemento `<audio loop src="/audio/ambient.mp3" />`.

---

## 7. Diretrizes Finais de Código para o Agent

- Crie uma arquitetura limpa em `src/` separando componentes, páginas (`Home.tsx`, `ProjectDetail.tsx`), dicionário de idiomas (`pt` / `en`) e arquivo de dados dos projetos (`projects.ts`).
- Nos dados dos projetos, estruture já os textos reais dos 6 projetos citados (3 principais + 3 secundários) em Português e Inglês, e crie um componente de _Placeholder_ elegante em P&B para as logos e prints de tela que serão substituídos pelas imagens reais depois.
