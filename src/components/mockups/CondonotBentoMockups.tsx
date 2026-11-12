import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Archive,
  ArrowLeft,
  Bell,
  BellPlus,
  Building2,
  Check,
  CheckCircle2,
  ClipboardList,
  Eye,
  FileText,
  House,
  KeyRound,
  Layers2,
  LayoutList,
  LogOut,
  Mail,
  Maximize2,
  Printer,
  Search,
  ShieldOff,
  Tags,
  Users,
} from "lucide-react";

export interface BentoMockupProps {
  /** Idioma ativo no portfólio ('pt' | 'en') */
  language?: "pt" | "en";
  /**
   * Estado/tela ativa dentro do bloco (0 ou 1).
   * Se fornecido, exibe o estado correspondente.
   * Se omitido, o próprio componente pode alternar internamente a cada 4s.
   */
  step?: 0 | 1;
}

// eslint-disable-next-line react-refresh/only-export-components
export const BENTO_FLOW_META = {
  wide: {
    step0: {
      pt: "Tela Inicial: Centro de Ações e Últimas Notificações",
      en: "Home Screen: Action Center & Recent Notifications",
    },
    step1: {
      pt: "Relatórios, Filtros e Ações em Lote",
      en: "Reports, Filters & Batch Actions",
    },
  },
  tall: {
    step0: {
      pt: "E-mail Recebido pelo Morador com PDF Anexo",
      en: "Resident Notification Email with Attached PDF",
    },
    step1: {
      pt: "Página Pública de Confirmação de Ciência",
      en: "Public Acknowledgment Confirmation Page",
    },
  },
  squareA: {
    step0: {
      pt: "Cadastro de Nova Notificação e Ocupação A4",
      en: "New Notification Form & A4 Page Budget",
    },
    step1: {
      pt: "Carta de Multa Formatada na Folha A4",
      en: "Formatted Fine Letter on A4 Sheet",
    },
  },
  squareB: {
    step0: {
      pt: "Modelos de Notificação e Artigos do Regimento",
      en: "Notification Templates & Bylaws Articles",
    },
    step1: {
      pt: "Detalhe da Notificação e Envio de E-mail",
      en: "Notification Detail & Email Delivery Status",
    },
  },
} as const;

function useResolvedStep(externalStep?: 0 | 1, intervalMs = 4000): 0 | 1 {
  const [internalStep, setInternalStep] = useState<0 | 1>(0);

  useEffect(() => {
    if (externalStep !== undefined) {
      return;
    }

    const timerId = window.setInterval(() => {
      setInternalStep((prev) => (prev === 0 ? 1 : 0));
    }, intervalMs);

    return () => window.clearInterval(timerId);
  }, [externalStep, intervalMs]);

  return externalStep ?? internalStep;
}

const STEP_TRANSITION = {
  initial: { opacity: 0, y: 5, filter: "blur(2px)" },
  animate: { opacity: 1, y: 0, filter: "blur(0px)" },
  exit: { opacity: 0, y: -5, filter: "blur(2px)" },
  transition: { duration: 0.26, ease: "easeOut" as const },
};

/* ============================================================================
 * 1. WideMainMockup — Janela Desktop Real do Condonot (Início -> Notificações)
 * ========================================================================== */

export function WideMainMockup({ language = "pt", step }: BentoMockupProps) {
  const activeStep = useResolvedStep(step);
  const isPt = language === "pt";

  const sidebarItems = [
    { label: isPt ? "Início" : "Home", icon: House, active: activeStep === 0 },
    {
      label: isPt ? "Notificações" : "Notifications",
      icon: ClipboardList,
      active: activeStep === 1,
    },
    { label: isPt ? "Unidades" : "Units", icon: Building2, active: false },
    {
      label: isPt ? "Modelo de notificação" : "Templates",
      icon: Tags,
      active: false,
    },
    {
      label: isPt ? "Regimento interno" : "Bylaws PDF",
      icon: FileText,
      active: false,
    },
  ];

  const recentNotifications = [
    {
      id: "401",
      title: isPt
        ? "Perturbação do sossego • B-302"
        : "Noise disturbance • B-302",
      motivo: isPt
        ? "Barulho após horário permitido no salão."
        : "Loud noise after quiet hours.",
      modelo: isPt ? "Horário de Silêncio" : "Quiet Hours",
      date: "10/08/2026",
    },
    {
      id: "402",
      title: isPt ? "Advertência • A-101" : "Warning • A-101",
      motivo: isPt
        ? "Uso irregular de vaga de visitante."
        : "Improper use of visitor parking spot.",
      modelo: isPt ? "Comunicado Geral" : "General Notice",
      date: "09/08/2026",
    },
    {
      id: "403",
      title: isPt ? "Convivência • C-210" : "Conduct • C-210",
      motivo: isPt
        ? "Objetos deixados no corredor comum."
        : "Personal items left in common hallway.",
      modelo: isPt ? "Ocorrência" : "Occurrence",
      date: "08/08/2026",
    },
  ];

  const reportRows = [
    {
      id: "401",
      unit: isPt ? "Unidade B-302" : "Unit B-302",
      category: isPt ? "Multa" : "Fine",
      emailSent: true,
      motivo: isPt
        ? "Barulho após horário permitido."
        : "Loud noise after quiet hours.",
      author: "Administrador Geral",
      modelo: isPt ? "Perturbação do sossego" : "Noise disturbance",
      date: "10/08/2026",
      fine: isPt ? "Multa: R$ 150,00" : "Fine: R$ 150.00",
      selected: true,
    },
    {
      id: "402",
      unit: isPt ? "Unidade A-101" : "Unit A-101",
      category: isPt ? "Advertência" : "Warning",
      emailSent: false,
      motivo: isPt
        ? "Uso irregular de vaga de visitante."
        : "Improper use of visitor parking.",
      author: "Portaria Goiabinha",
      modelo: isPt ? "Estacionamento" : "Parking rules",
      date: "09/08/2026",
      fine: isPt ? "Sem multa" : "No fine",
      selected: true,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between p-3 sm:p-4 select-none overflow-hidden">
      <div className="flex h-full w-full flex-col overflow-hidden border border-slate-300 bg-[#f8fafc] text-slate-900 shadow-sm">
        {/* Barra Superior Real (AppLayout.tsx: bg-slate-900) */}
        <header className="flex shrink-0 items-center justify-between gap-2 border-b border-black/10 bg-slate-900 px-3 py-2 text-slate-100">
          <div className="flex items-center gap-2">
            <div className="inline-flex h-6 items-center gap-1 rounded-lg bg-white px-2 py-0.5 text-slate-900">
              <Building2 className="size-3.5 text-slate-800" />
              <span className="text-[10px] font-bold tracking-tight">
                Condonot
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <div className="flex h-6 items-center rounded-md border border-slate-700 bg-slate-800 px-2 text-[10px] text-white">
              <span className="truncate max-w-[140px]">
                Condomínio Residencial Jardins
              </span>
            </div>
            <span className="flex size-6 items-center justify-center rounded-md border border-slate-700 bg-white text-slate-600">
              <Building2 className="size-3.5" />
            </span>
            <span className="hidden sm:inline-flex size-6 items-center justify-center rounded-md border border-slate-700 text-slate-200">
              <Users className="size-3" />
            </span>
            <span className="hidden sm:inline-flex size-6 items-center justify-center rounded-md border border-slate-700 text-slate-200">
              <KeyRound className="size-3" />
            </span>
            <span className="inline-flex size-6 items-center justify-center rounded-md border border-slate-700 text-slate-200">
              <LogOut className="size-3" />
            </span>
          </div>
        </header>

        {/* Área Principal com SidebarNav à esquerda e Panel à direita */}
        <div className="grid min-h-0 flex-1 grid-cols-1 gap-2.5 p-2.5 sm:grid-cols-[132px_minmax(0,1fr)] overflow-hidden">
          {/* SidebarNav Real */}
          <aside className="hidden sm:flex flex-col rounded-xl border border-slate-200 bg-white p-2 shadow-2xs">
            <div className="mb-1.5 flex items-center gap-1.5 px-1.5">
              <LayoutList className="size-3 text-slate-500" />
              <span className="text-[8px] font-semibold uppercase tracking-[0.18em] text-slate-500">
                {isPt ? "Principal" : "Main"}
              </span>
            </div>
            <nav className="space-y-0.5">
              {sidebarItems.map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.label}
                    className={`flex h-6 items-center gap-1.5 rounded-lg px-2 text-[9px] font-medium transition-colors ${
                      item.active ? "bg-slate-900 text-white" : "text-slate-600"
                    }`}
                  >
                    <Icon className="size-3 shrink-0" />
                    <span className="truncate">{item.label}</span>
                  </div>
                );
              })}
            </nav>
          </aside>

          {/* Conteúdo Dinâmico: Step 0 (HomePage) vs Step 1 (NotificationsPage) */}
          <div className="relative min-h-0 flex-1 overflow-hidden">
            <AnimatePresence mode="wait">
              {activeStep === 0 ? (
                <motion.div
                  key="wide-home"
                  {...STEP_TRANSITION}
                  className="grid h-full grid-cols-1 gap-2 sm:grid-cols-[1.05fr_1fr] overflow-hidden"
                >
                  {/* Panel: Centro de ações */}
                  <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs overflow-hidden">
                    <div>
                      <h3 className="text-[11px] font-semibold tracking-tight text-slate-900">
                        {isPt ? "Centro de ações" : "Action center"}
                      </h3>
                      <p className="text-[8px] text-slate-500">
                        {isPt
                          ? "Atalhos para as operações principais"
                          : "Shortcuts for main operations"}
                      </p>
                    </div>

                    <div className="mt-1.5 grid flex-1 grid-cols-2 gap-1.5">
                      {/* ActionCard Highlight */}
                      <div className="flex flex-col justify-between rounded-xl border border-slate-900 bg-slate-900 p-2 text-white shadow-xs">
                        <span className="inline-flex size-5 items-center justify-center rounded-lg border border-white/20">
                          <BellPlus className="size-3" />
                        </span>
                        <div>
                          <p className="text-[9px] font-semibold leading-tight">
                            {isPt
                              ? "Inserir notificação"
                              : "Create notification"}
                          </p>
                          <p className="text-[7px] text-white/75 truncate">
                            {isPt ? "Cadastro principal" : "New occurrence"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 text-slate-900">
                        <span className="inline-flex size-5 items-center justify-center rounded-lg border border-slate-200">
                          <Layers2 className="size-3" />
                        </span>
                        <div>
                          <p className="text-[9px] font-semibold leading-tight">
                            {isPt ? "Inserir modelo" : "New template"}
                          </p>
                          <p className="text-[7px] text-slate-500 truncate">
                            {isPt ? "Modelos padrão" : "Bylaws models"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 text-slate-900">
                        <span className="inline-flex size-5 items-center justify-center rounded-lg border border-slate-200">
                          <Building2 className="size-3" />
                        </span>
                        <div>
                          <p className="text-[9px] font-semibold leading-tight">
                            {isPt ? "Editar unidade" : "Edit unit"}
                          </p>
                          <p className="text-[7px] text-slate-500 truncate">
                            {isPt ? "Moradores e bloco" : "Residents & block"}
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2 text-slate-900">
                        <span className="inline-flex size-5 items-center justify-center rounded-lg border border-slate-200">
                          <Eye className="size-3" />
                        </span>
                        <div>
                          <p className="text-[9px] font-semibold leading-tight">
                            {isPt ? "Visualizar lista" : "View all"}
                          </p>
                          <p className="text-[7px] text-slate-500 truncate">
                            {isPt ? "Busca e filtros" : "Search & filters"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </section>

                  {/* Panel: Últimas notificações */}
                  <section className="flex flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs overflow-hidden">
                    <div className="flex items-start justify-between gap-1">
                      <div>
                        <h3 className="text-[11px] font-semibold tracking-tight text-slate-900">
                          {isPt
                            ? "Últimas notificações"
                            : "Recent notifications"}
                        </h3>
                        <p className="text-[8px] text-slate-500">
                          {isPt
                            ? "Resumo inicial com acesso ao detalhe"
                            : "Quick summary with detail view"}
                        </p>
                      </div>
                      <span className="inline-flex size-5 items-center justify-center rounded-lg border border-slate-300 text-slate-600">
                        <Maximize2 className="size-2.5" />
                      </span>
                    </div>

                    <div className="mt-1.5 flex flex-1 flex-col justify-between space-y-1 overflow-hidden">
                      {recentNotifications.map((item) => (
                        <div
                          key={item.id}
                          className="flex items-start justify-between gap-1.5 rounded-lg border border-slate-200 bg-white px-2 py-1 text-left"
                        >
                          <div className="min-w-0">
                            <p className="truncate text-[9px] font-semibold text-slate-900">
                              {item.title}
                            </p>
                            <p className="truncate text-[8px] text-slate-500">
                              {item.motivo}
                            </p>
                          </div>
                          <span className="shrink-0 text-[8px] text-slate-400">
                            {item.date.slice(0, 5)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </section>
                </motion.div>
              ) : (
                <motion.div
                  key="wide-notifications"
                  {...STEP_TRANSITION}
                  className="flex h-full flex-col justify-between rounded-xl border border-slate-200 bg-white p-2.5 shadow-2xs overflow-hidden"
                >
                  {/* Header do Panel (NotificationsPage.tsx) */}
                  <div className="flex items-center justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-[11px] font-semibold tracking-tight text-slate-900">
                        {isPt
                          ? "Relatórios e visualização de notificações"
                          : "Notification reports & management"}
                      </h3>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="rounded-lg bg-slate-900 px-2 py-1 text-[8px] font-semibold uppercase tracking-wider text-white">
                        {isPt ? "Inserir notificação" : "New notification"}
                      </span>
                      <span className="inline-flex size-5 items-center justify-center rounded-lg border border-slate-300 text-slate-600">
                        <Printer className="size-3" />
                      </span>
                    </div>
                  </div>

                  {/* Barra Preta de Seleção em Lote Real (NotificationsPage.tsx) */}
                  <div className="my-1.5 flex items-center justify-between gap-2 rounded-lg border border-slate-300 bg-slate-900 px-2.5 py-1.5 text-white">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <span className="truncate text-[9px] font-semibold">
                        {isPt
                          ? "2 notificações selecionadas"
                          : "2 notifications selected"}
                      </span>
                      <span className="hidden md:inline-flex rounded border border-slate-700 bg-slate-800 px-1.5 py-0.5 text-[8px] text-slate-200">
                        {isPt ? "Limpar seleção" : "Clear"}
                      </span>
                    </div>
                    <div className="flex items-center gap-1 shrink-0">
                      <span className="inline-flex items-center gap-1 rounded-md bg-white px-2 py-0.5 text-[8px] font-semibold text-slate-900">
                        <Bell className="size-2.5" />
                        {isPt ? "Enviar e-mail em lote" : "Send batch email"}
                      </span>
                      <span className="inline-flex items-center gap-1 rounded-md bg-rose-600 px-2 py-0.5 text-[8px] font-semibold text-white">
                        <ShieldOff className="size-2.5" />
                        {isPt ? "Dar baixa em lote" : "Batch cancel"}
                      </span>
                    </div>
                  </div>

                  {/* Lista de Cards de Notificações Selecionadas */}
                  <div className="flex flex-1 flex-col justify-between space-y-1.5 overflow-hidden">
                    {reportRows.map((row) => (
                      <div
                        key={row.id}
                        className="flex items-center gap-2 rounded-lg border border-slate-900 bg-slate-50/90 px-2.5 py-1.5"
                      >
                        <span className="flex size-3.5 shrink-0 items-center justify-center rounded bg-slate-900 text-white">
                          <Check className="size-2.5" />
                        </span>

                        <div className="min-w-0 flex-1">
                          <div className="flex flex-wrap items-center gap-1.5">
                            <p className="text-[10px] font-bold text-slate-900">
                              {row.unit}
                              <span className="font-semibold text-slate-600">
                                {" • "}
                                {row.category}
                              </span>
                            </p>
                            {row.emailSent ? (
                              <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-emerald-700">
                                {isPt ? "E-mail enviado" : "Email sent"}
                              </span>
                            ) : (
                              <span className="rounded-full bg-slate-200 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-wider text-slate-600">
                                {isPt ? "E-mail pendente" : "Email pending"}
                              </span>
                            )}
                          </div>
                          <p className="truncate text-[8px] text-slate-500">
                            {row.motivo} •{" "}
                            <span className="text-slate-400">
                              {isPt ? "Criada por:" : "By:"} {row.author}
                            </span>
                          </p>
                        </div>

                        <div className="text-right shrink-0">
                          <p className="text-[9px] font-medium text-slate-700">
                            {row.date}
                          </p>
                          <p className="text-[8px] font-semibold uppercase tracking-wider text-slate-500">
                            {row.fine}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 2. TallMobileMockup — Celular do Morador (E-mail Recebido -> Página de Ciência)
 * ========================================================================== */

export function TallMobileMockup({ language = "pt", step }: BentoMockupProps) {
  const activeStep = useResolvedStep(step);
  const isPt = language === "pt";

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-5 select-none overflow-hidden">
      <div className="flex h-full max-h-[360px] w-full max-w-[198px] flex-col justify-between border border-slate-300 bg-[#f1f5f9] p-2.5 text-slate-900 shadow-sm overflow-hidden">
        {/* Topo do Smartphone */}
        <div className="shrink-0 space-y-1 pb-1.5">
          <div className="mx-auto h-1 w-10 rounded-full bg-slate-300" />
          <div className="flex items-center justify-between px-1 text-[8px] font-medium text-slate-500">
            <span>09:41</span>
            <span className="truncate">
              {activeStep === 0
                ? isPt
                  ? "Caixa de Entrada"
                  : "Inbox"
                : "condonot.com.br/ciencia"}
            </span>
          </div>
        </div>

        {/* Tela Mobile: Step 0 (E-mail HTML Real) vs Step 1 (CienciaPage.tsx Real) */}
        <div className="relative flex-1 overflow-hidden">
          <AnimatePresence mode="wait">
            {activeStep === 0 ? (
              <motion.div
                key="tall-email"
                {...STEP_TRANSITION}
                className="flex h-full flex-col justify-between border border-slate-200 bg-white p-3 shadow-2xs overflow-hidden"
              >
                <div className="space-y-1">
                  <p className="text-[7px] font-semibold uppercase tracking-[0.08em] text-slate-500">
                    Condomínio Residencial Jardins
                  </p>
                  <h4 className="text-[11px] font-bold leading-snug text-slate-900">
                    {isPt
                      ? "Você recebeu um aviso de multa"
                      : "You received a fine notice"}
                  </h4>
                  <p className="text-[8.5px] leading-snug text-slate-600">
                    {isPt
                      ? "Prezado(a) Marina Lopes, informamos que foi registrado um aviso de multa referente à sua unidade. O documento completo segue em PDF."
                      : "Dear Marina Lopes, a fine notice was registered for your unit. The full document is attached as a PDF."}
                  </p>
                </div>

                {/* Tabela cinza de resumo do e-mail (notificationEmail.ts) */}
                <div className="rounded-lg border border-slate-200 bg-slate-50 p-2 text-[8.5px]">
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">
                      {isPt ? "Unidade" : "Unit"}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {isPt ? "Bloco B, unidade 302" : "Block B, unit 302"}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">
                      {isPt ? "Assunto" : "Subject"}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {isPt ? "Perturbação do sossego" : "Noise disturbance"}
                    </span>
                  </div>
                  <div className="flex justify-between py-0.5">
                    <span className="text-slate-500">
                      {isPt ? "Data" : "Date"}
                    </span>
                    <span className="font-semibold text-slate-900">
                      {isPt ? "10 de agosto de 2026" : "August 10, 2026"}
                    </span>
                  </div>
                </div>

                {/* Anexo PDF */}
                <div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2 py-1">
                  <FileText className="size-3 shrink-0 text-slate-600" />
                  <span className="truncate text-[8px] font-medium text-slate-700">
                    condonot-B302-notification-401.pdf
                  </span>
                </div>

                {/* Botão Confirmar ciência (notificationEmail.ts) */}
                <div className="space-y-1">
                  <div className="w-full rounded-lg bg-slate-900 py-1.5 text-center text-[9px] font-bold text-white">
                    {isPt ? "Confirmar ciência" : "Confirm acknowledgment"}
                  </div>
                  <p className="text-center text-[7px] text-slate-400">
                    {isPt
                      ? "Administração — Cond. Residencial Jardins"
                      : "Management — Residencial Jardins"}
                  </p>
                </div>
              </motion.div>
            ) : (
              <motion.div
                key="tall-ciencia"
                {...STEP_TRANSITION}
                className="flex h-full flex-col justify-between rounded-2xl border border-slate-200 bg-white p-3 shadow-2xs overflow-hidden"
              >
                <div>
                  <h4 className="text-xs font-semibold text-slate-900">
                    {isPt
                      ? "Confirmação de ciência"
                      : "Acknowledgment confirmation"}
                  </h4>

                  {/* Lista dl real de CienciaPage.tsx */}
                  <dl className="mt-2 space-y-1.5 text-[9px]">
                    <div>
                      <dt className="text-[7px] uppercase text-slate-400">
                        {isPt ? "Condomínio" : "Condominium"}
                      </dt>
                      <dd className="font-medium text-slate-800">
                        Condomínio Residencial Jardins
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[7px] uppercase text-slate-400">
                        {isPt ? "Unidade" : "Unit"}
                      </dt>
                      <dd className="font-medium text-slate-800">
                        {isPt ? "Unidade B-302" : "Unit B-302"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[7px] uppercase text-slate-400">
                        {isPt ? "Assunto" : "Subject"}
                      </dt>
                      <dd className="font-medium text-slate-800">
                        {isPt ? "Perturbação do sossego" : "Noise disturbance"}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[7px] uppercase text-slate-400">
                        {isPt ? "Data" : "Date"}
                      </dt>
                      <dd className="font-medium text-slate-800">
                        {isPt ? "10 de agosto de 2026" : "August 10, 2026"}
                      </dd>
                    </div>
                  </dl>
                </div>

                {/* Banner Verde Real de CienciaPage.tsx */}
                <div className="space-y-1.5">
                  <div className="rounded-xl border border-emerald-200 bg-emerald-50 px-2.5 py-2 text-[8.5px] font-medium text-emerald-700">
                    <div className="flex items-center gap-1 font-semibold">
                      <CheckCircle2 className="size-3 shrink-0" />
                      <span>
                        {isPt ? "Ciência registrada!" : "Receipt confirmed!"}
                      </span>
                    </div>
                    <p className="mt-0.5 leading-snug">
                      {isPt
                        ? "Registrada em 10/08/2026, 14:32. Obrigado."
                        : "Logged on 08/10/2026, 2:32 PM. Thank you."}
                    </p>
                  </div>

                  <p className="text-[7.5px] leading-snug text-slate-500">
                    {isPt
                      ? "Ao confirmar, você registra que tomou conhecimento desta notificação."
                      : "By confirming, you acknowledge receipt of this notification."}
                  </p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Barra Inferior do Celular */}
        <div className="pt-1.5">
          <div className="mx-auto h-1 w-12 rounded-full bg-slate-300" />
        </div>
      </div>
    </div>
  );
}

/* ============================================================================
 * 3. SquareFlowAMockup — Formulário de Emissão -> Folha A4 Branca da Carta
 * ========================================================================== */

export function SquareFlowAMockup({ language = "pt", step }: BentoMockupProps) {
  const activeStep = useResolvedStep(step);
  const isPt = language === "pt";

  return (
    <div className="flex h-full w-full flex-col justify-between p-3.5 select-none overflow-hidden">
      <div className="relative h-full w-full overflow-hidden border border-slate-300 bg-[#f8fafc] text-slate-900 shadow-2xs">
        <AnimatePresence mode="wait">
          {activeStep === 0 ? (
            <motion.div
              key="square-a-form"
              {...STEP_TRANSITION}
              className="flex h-full flex-col justify-between bg-white p-3 overflow-hidden"
            >
              {/* Cabeçalho do Panel (CreateNotificationPage.tsx) */}
              <div className="flex items-center justify-between gap-2 border-b border-slate-100 pb-1.5">
                <h4 className="text-[11px] font-semibold text-slate-900">
                  {isPt ? "Inserir notificação" : "Create notification"}
                </h4>
                <span className="rounded-lg bg-slate-900 px-2 py-0.5 text-[8px] font-semibold text-white">
                  {isPt ? "Salvar" : "Save"}
                </span>
              </div>

              {/* Campos Reais Preenchidos (CreateNotificationForm.tsx) */}
              <div className="grid grid-cols-2 gap-1.5">
                <div>
                  <span className="block text-[7.5px] font-medium text-slate-600">
                    {isPt ? "Unidade" : "Unit"}
                  </span>
                  <div className="mt-0.5 truncate rounded-lg border border-slate-300 bg-white px-2 py-1 text-[8.5px] font-medium text-slate-800">
                    {isPt ? "Unidade B-302" : "Unit B-302"}
                  </div>
                </div>
                <div>
                  <span className="block text-[7.5px] font-medium text-slate-600">
                    {isPt ? "Categoria / Multa" : "Category / Fine"}
                  </span>
                  <div className="mt-0.5 truncate rounded-lg border border-slate-300 bg-slate-50 px-2 py-1 text-[8.5px] font-semibold text-slate-800">
                    {isPt ? "Multa • R$ 150,00" : "Fine • R$ 150.00"}
                  </div>
                </div>
              </div>

              {/* Motivo */}
              <div>
                <div className="flex items-center justify-between text-[7.5px]">
                  <span className="font-medium text-slate-700">
                    {isPt ? "Motivo" : "Reason"}
                  </span>
                  <span className="text-slate-400">
                    84/420 {isPt ? "caracteres" : "chars"}
                  </span>
                </div>
                <div className="mt-0.5 truncate rounded-lg border border-slate-300 bg-white px-2 py-1 text-[8px] text-slate-700">
                  {isPt
                    ? "Barulho excessivo após as 22h no apartamento."
                    : "Excessive noise after 10 PM in the apartment."}
                </div>
              </div>

              {/* Barra Real de Ocupação na Folha A4 (CreateNotificationForm.tsx) */}
              <div className="rounded-lg border border-slate-200 bg-slate-50 px-2 py-1.5">
                <div className="flex items-center justify-between text-[7.5px] font-semibold text-slate-700">
                  <span>
                    {isPt
                      ? "Ocupação estimada na folha A4"
                      : "Estimated A4 page usage"}
                  </span>
                  <span>14/20 {isPt ? "linhas (70%)" : "lines (70%)"}</span>
                </div>
                <div className="mt-1 h-1.5 w-full overflow-hidden rounded-full bg-slate-200">
                  <div className="h-full w-[70%] bg-slate-800" />
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="square-a-pdf"
              {...STEP_TRANSITION}
              className="flex h-full items-center justify-center bg-slate-200/75 p-2 overflow-hidden"
            >
              {/* Folha A4 Branca Real com Moldura Dupla (NotificationPdf.tsx) */}
              <div className="relative flex h-full w-full flex-col justify-between bg-white p-2.5 font-serif text-slate-900 shadow-sm">
                {/* Borda dupla idêntica ao NotificationPdf */}
                <div className="pointer-events-none absolute inset-1 border border-slate-700" />
                <div className="pointer-events-none absolute inset-1.5 border border-slate-700" />

                <div className="relative z-10 text-center">
                  <h4 className="inline-block border-b border-slate-400 pb-0.5 text-[10px] font-bold text-slate-900">
                    {isPt ? "Notificação de Multa" : "Fine Notification"}
                  </h4>
                  <div className="mt-1 border-y border-slate-300 py-0.5 text-[7.5px] font-bold">
                    <p>
                      {isPt ? "Perturbação do sossego" : "Noise disturbance"} —{" "}
                      {isPt ? "10 de agosto de 2026" : "August 10, 2026"}
                    </p>
                  </div>
                </div>

                <div className="relative z-10 space-y-1 px-1 text-[7.5px] leading-snug text-justify">
                  <p>
                    {isPt ? "Ao condômino(a) " : "To the resident "}
                    <span className="font-bold underline">
                      {isPt
                        ? 'da unidade "302" do Bloco "B"'
                        : 'of unit "302", Block "B"'}
                    </span>
                    , Condomínio Residencial Jardins.
                  </p>
                  <p>
                    {isPt
                      ? "Na qualidade de Síndica, comunico a aplicação de "
                      : "As Building Manager, I hereby notify a "}
                    <span className="font-bold">
                      {isPt
                        ? "MULTA REGIMENTAL no valor de R$ 150,00"
                        : "BYLAWS FINE of R$ 150.00"}
                    </span>{" "}
                    {isPt
                      ? "por infração ao Art. 14º do Regimento Interno."
                      : "for violating Art. 14 of the Internal Bylaws."}
                  </p>
                </div>

                <div className="relative z-10 mx-auto w-28 border-t border-slate-500 pt-0.5 text-center text-[7px] leading-tight">
                  <p className="font-semibold">Ana Paula Palmezan</p>
                  <p className="text-slate-600">
                    {isPt ? "Síndica" : "Building Manager"}
                  </p>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

/* ============================================================================
 * 4. SquareFlowBMockup — Modelos de Regimento -> Detalhe e Envio de E-mail
 * ========================================================================== */

export function SquareFlowBMockup({ language = "pt", step }: BentoMockupProps) {
  const activeStep = useResolvedStep(step);
  const isPt = language === "pt";

  const models = [
    {
      id: "1",
      title: isPt ? "Perturbação do sossego" : "Noise disturbance",
      preview: isPt
        ? "Do Sossego / Art. 14º — Horário de silêncio após 22h"
        : "Quiet Hours / Art. 14 — No noise after 10 PM",
      count: 14,
    },
    {
      id: "2",
      title: isPt ? "Uso irregular de vaga" : "Visitor parking misuse",
      preview: isPt
        ? "Da Garagem / Art. 22º — Vagas de visitantes"
        : "Parking / Art. 22 — Visitor parking spots",
      count: 6,
    },
  ];

  return (
    <div className="flex h-full w-full flex-col justify-between p-3.5 select-none overflow-hidden">
      <div className="relative h-full w-full overflow-hidden border border-slate-300 bg-white text-slate-900 shadow-2xs">
        <AnimatePresence mode="wait">
          {activeStep === 0 ? (
            <motion.div
              key="square-b-models"
              {...STEP_TRANSITION}
              className="flex h-full flex-col justify-between p-3 overflow-hidden"
            >
              {/* Cabeçalho de Modelos (NotificationTypesPage.tsx) */}
              <div className="flex items-center justify-between gap-2">
                <h4 className="truncate text-[10.5px] font-semibold text-slate-900">
                  {isPt ? "Modelos de notificação" : "Notification templates"}
                </h4>
                <span className="shrink-0 rounded-lg bg-slate-900 px-2 py-0.5 text-[7.5px] font-semibold uppercase tracking-wider text-white">
                  {isPt ? "Inserir modelo" : "New template"}
                </span>
              </div>

              {/* Busca */}
              <div className="relative">
                <Search className=" absolute left-2 top-1.5 size-3 text-slate-400" />
                <div className="w-full rounded-lg border border-slate-300 bg-white py-1 pl-6 pr-2 text-[8px] text-slate-400">
                  {isPt
                    ? "Buscar por título ou texto padrão"
                    : "Search by title or bylaws text"}
                </div>
              </div>

              {/* Lista de Modelos com Contagem e Botão Arquivar */}
              <div className="space-y-1.5">
                {models.map((model) => (
                  <div key={model.id} className="flex items-center gap-1.5">
                    <div className="flex min-w-0 flex-1 items-center justify-between gap-2 rounded-lg border border-slate-200 bg-white px-2.5 py-1.5">
                      <div className="min-w-0">
                        <p className="truncate text-[9px] font-semibold text-slate-900">
                          {model.title}
                        </p>
                        <p className="truncate text-[7.5px] text-slate-500">
                          {model.preview}
                        </p>
                      </div>
                      <div className="text-right shrink-0">
                        <p className="text-[6.5px] uppercase tracking-wider text-slate-400">
                          {isPt ? "Usos" : "Uses"}
                        </p>
                        <p className="text-[9.5px] font-bold text-slate-700">
                          {model.count}
                        </p>
                      </div>
                    </div>
                    <span className="inline-flex size-7 shrink-0 items-center justify-center rounded-lg border border-slate-300 text-slate-600">
                      <Archive className="size-3" />
                    </span>
                  </div>
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="square-b-detail"
              {...STEP_TRANSITION}
              className="flex h-full flex-col justify-between p-3 overflow-hidden"
            >
              {/* Topo do Panel: Notificação individual (NotificationDetailPage.tsx) */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-1.5 min-w-0">
                  <span className="inline-flex size-5 shrink-0 items-center justify-center rounded-md border border-slate-300 text-slate-600">
                    <ArrowLeft className="size-3" />
                  </span>
                  <h4 className="truncate text-[10.5px] font-semibold text-slate-900">
                    {isPt ? "Notificação individual" : "Notification detail"}
                  </h4>
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <span className="inline-flex size-5 items-center justify-center rounded-md border border-emerald-300 bg-emerald-50 text-emerald-600">
                    <Bell className="size-3" />
                  </span>
                  <span className="inline-flex size-5 items-center justify-center rounded-md border border-slate-300 text-slate-600">
                    <ShieldOff className="size-3" />
                  </span>
                  <span className="inline-flex size-5 items-center justify-center rounded-md border border-slate-300 text-slate-600">
                    <Printer className="size-3" />
                  </span>
                </div>
              </div>

              {/* Alerta verde de e-mail enviado (NotificationDetailPage.tsx) */}
              <div className="flex items-center gap-1.5 rounded-lg border border-emerald-200 bg-emerald-50 px-2 py-1 text-[8px] font-medium text-emerald-700">
                <Mail className="size-3 shrink-0" />
                <span className="truncate">
                  {isPt
                    ? "E-mail enviado para marina.lopes@email.com."
                    : "Email sent to marina.lopes@email.com."}
                </span>
              </div>

              {/* Card de Detalhes da Notificação */}
              <div className="space-y-1.5 rounded-xl border border-slate-200 p-2">
                <div className="flex items-center justify-between gap-1">
                  <p className="truncate text-[9.5px] font-bold text-slate-900">
                    {isPt ? "Multa • Unidade B-302" : "Fine • Unit B-302"}
                  </p>
                  <span className="rounded-full bg-emerald-100 px-1.5 py-0.5 text-[7px] font-semibold uppercase tracking-widest text-emerald-700">
                    {isPt ? "Ativa" : "Active"}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-1 border-t border-slate-100 pt-1 text-[7.5px]">
                  <div>
                    <span className="block uppercase text-slate-400">
                      {isPt ? "Valor da multa" : "Fine amount"}
                    </span>
                    <span className="font-semibold text-slate-800">
                      R$ 150,00
                    </span>
                  </div>
                  <div>
                    <span className="block uppercase text-slate-400">
                      {isPt ? "Confirmação de ciência" : "Acknowledgment"}
                    </span>
                    <span className="font-semibold text-emerald-700">
                      {isPt ? "Confirmada (10/08)" : "Confirmed (08/10)"}
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
