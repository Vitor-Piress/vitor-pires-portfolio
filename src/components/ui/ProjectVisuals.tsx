import type { ProjectScreen } from "../../data/projects";
import type { Language } from "../../i18n/translations";

interface ProjectLogoProps {
  slug: string;
  name: string;
  logo: string | null;
  size?: "sm" | "md";
}

/**
 * Renders the official project logo when available, or a crisp monochromatic
 * geometric mark + wordmark placeholder tailored to each product.
 */
export function ProjectLogo({
  slug,
  name,
  logo,
  size = "md",
}: ProjectLogoProps) {
  const iconBox = size === "sm" ? "h-6 w-6" : "h-7 w-7";
  const textSize = size === "sm" ? "text-sm" : "text-base";

  if (logo) {
    // Circular self-contained badges (e.g. Dailycheckout SVG) render natively without a white square halo
    const isNativeCircle = slug === "dailycheckout" || logo.endsWith(".svg");

    return (
      <div className="inline-flex items-center gap-2.5 select-none">
        <span
          className={`${iconBox} inline-flex items-center justify-center overflow-hidden shrink-0 ${
            isNativeCircle
              ? "rounded-full ring-1 ring-[var(--border-subtle)]"
              : "rounded-[4px] bg-white p-0.5 shadow-sm"
          }`}
          aria-hidden="true"
        >
          <img
            src={logo}
            alt={name}
            className={`h-full w-full ${isNativeCircle ? "object-cover" : "object-contain"}`}
          />
        </span>
        <span
          className={`${textSize} font-medium tracking-tight text-[var(--text-primary)]`}
        >
          {name}
        </span>
      </div>
    );
  }

  return (
    <div className="inline-flex items-center gap-2.5 select-none">
      <span
        className={`${iconBox} inline-flex items-center justify-center rounded-[2px] bg-[var(--text-primary)] text-[var(--bg-primary)]`}
        aria-hidden="true"
      >
        {slug === "condonot" && (
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3" y="3" width="6" height="14" />
            <rect x="11" y="7" width="6" height="10" />
            <line x1="5.5" y1="6.5" x2="6.5" y2="6.5" />
            <line x1="5.5" y1="9.5" x2="6.5" y2="9.5" />
          </svg>
        )}
        {slug === "moradas-do-gabriel" && (
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <path d="M3 10.5L10 4l7 6.5" />
            <path d="M5.5 9.5V16h9V9.5" />
          </svg>
        )}
        {slug === "dailycheckout" && (
          <svg
            viewBox="0 0 20 20"
            className="h-3.5 w-3.5"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
          >
            <rect x="3.5" y="3.5" width="13" height="13" />
            <path d="M6.8 10.2l2.2 2.2 4.4-4.6" />
          </svg>
        )}
        {slug !== "condonot" &&
          slug !== "moradas-do-gabriel" &&
          slug !== "dailycheckout" && (
            <span className="font-mono text-[10px] font-semibold">
              {name.slice(0, 2).toUpperCase()}
            </span>
          )}
      </span>
      <span
        className={`${textSize} font-medium tracking-tight text-[var(--text-primary)]`}
      >
        {name}
      </span>
    </div>
  );
}

interface ScreenVisualProps {
  projectSlug: string;
  screen: ProjectScreen;
  language: Language;
}

/**
 * Renders a real project screenshot if `screen.src` is provided,
 * otherwise renders an architectural B&W UI wireframe tailored to the screen flow
 * so the 4-second Bento auto-cycle visibly demonstrates distinct system states.
 */
export function ScreenVisual({
  projectSlug,
  screen,
  language,
}: ScreenVisualProps) {
  if (screen.src) {
    const isPortrait =
      screen.device === "mobile" || screen.src.includes("gmail");
    return (
      <div className="flex h-full w-full items-center justify-center p-2.5 sm:p-3 select-none">
        <div
          className={`flex h-full w-full items-center justify-center overflow-hidden rounded-[3px] border border-[var(--border-subtle)] ${
            isPortrait ? "bg-white" : "bg-[var(--bg-primary)]"
          } shadow-2xs`}
        >
          <img
            src={screen.src}
            alt={screen.label[language]}
            className="h-full w-full object-contain object-top block"
            loading="lazy"
          />
        </div>
      </div>
    );
  }

  if (screen.device === "mobile") {
    return (
      <MobileWireframe screenId={screen.id} label={screen.label[language]} />
    );
  }

  return (
    <DesktopWireframe
      projectSlug={projectSlug}
      screenId={screen.id}
      label={screen.label[language]}
    />
  );
}

function MobileWireframe({
  screenId,
  label,
}: {
  screenId: string;
  label: string;
}) {
  const isQrFlow = screenId.includes("pix") || screenId.includes("wifi");
  const isChecklist =
    screenId.includes("checklist") || screenId.includes("checkout");

  return (
    <div className="flex h-full w-full items-center justify-center p-4 sm:p-5 select-none">
      <div className="flex h-full max-h-[340px] w-full max-w-[186px] flex-col justify-between rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-3.5 shadow-sm">
        {/* Status bar */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[9px] text-[var(--text-muted)]">
            09:41
          </span>
          <div className="h-1 w-8 rounded-full bg-[var(--border-subtle)]" />
          <div className="flex gap-1">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] opacity-60" />
            <span className="h-1.5 w-2.5 rounded-[1px] bg-[var(--text-primary)] opacity-80" />
          </div>
        </div>

        {/* Dynamic body */}
        <div className="my-3 flex flex-1 flex-col justify-center gap-2.5">
          <div className="font-mono text-[9px] uppercase tracking-wider text-[var(--text-muted)]">
            {label}
          </div>

          {isQrFlow ? (
            <>
              {/* QR / Pix / Wi-Fi stylized matrix */}
              <div className="mx-auto my-1 grid h-24 w-24 grid-cols-5 gap-1 rounded-[2px] border border-[var(--border-subtle)] p-2">
                {Array.from({ length: 25 }).map((_, idx) => {
                  const active = [
                    0, 1, 3, 4, 5, 6, 8, 10, 12, 14, 16, 18, 20, 21, 23, 24,
                  ].includes(idx);
                  return (
                    <span
                      key={idx}
                      className={`rounded-[1px] ${
                        active
                          ? "bg-[var(--text-primary)] opacity-85"
                          : "bg-[var(--border-subtle)] opacity-40"
                      }`}
                    />
                  );
                })}
              </div>
              <div className="rounded-[2px] border border-[var(--border-subtle)] px-2 py-1.5 text-center font-mono text-[8px] text-[var(--text-secondary)]">
                {screenId.includes("pix")
                  ? "00020126580014BR.GOV.BCB.PIX"
                  : "WPA2 • AUTO-CONNECT"}
              </div>
            </>
          ) : isChecklist ? (
            <div className="space-y-1.5">
              {[true, true, screenId.includes("checkout"), false].map(
                (checked, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 rounded-[2px] border border-[var(--border-subtle)] px-2 py-1.5"
                  >
                    <span
                      className={`h-2.5 w-2.5 rounded-[1px] border ${
                        checked
                          ? "border-[var(--text-primary)] bg-[var(--text-primary)]"
                          : "border-[var(--text-muted)]"
                      }`}
                    />
                    <span className="h-1.5 flex-1 rounded-full bg-[var(--text-muted)] opacity-40" />
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="space-y-2">
              <div className="rounded-[2px] border border-[var(--border-subtle)] p-2.5 space-y-1.5">
                <div className="flex items-center justify-between">
                  <span className="h-1.5 w-12 rounded-full bg-[var(--text-primary)] opacity-80" />
                  <span className="h-3 w-8 rounded-[1px] bg-[var(--border-subtle)]" />
                </div>
                <div className="h-1.5 w-full rounded-full bg-[var(--text-muted)] opacity-35" />
                <div className="h-1.5 w-3/4 rounded-full bg-[var(--text-muted)] opacity-35" />
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                <div className="h-12 rounded-[2px] border border-[var(--border-subtle)] p-2 flex flex-col justify-between">
                  <span className="h-1.5 w-6 rounded-full bg-[var(--text-muted)] opacity-50" />
                  <span className="font-mono text-[10px] text-[var(--text-primary)]">
                    A-302
                  </span>
                </div>
                <div className="h-12 rounded-[2px] border border-[var(--border-subtle)] p-2 flex flex-col justify-between">
                  <span className="h-1.5 w-6 rounded-full bg-[var(--text-muted)] opacity-50" />
                  <span className="font-mono text-[10px] text-[var(--text-primary)]">
                    OK
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Bottom CTA */}
        <div className="h-6 w-full rounded-[2px] bg-[var(--text-primary)] opacity-90 flex items-center justify-center">
          <span className="h-1 w-12 rounded-full bg-[var(--bg-primary)] opacity-80" />
        </div>
      </div>
    </div>
  );
}

function DesktopWireframe({
  projectSlug,
  screenId,
  label,
}: {
  projectSlug: string;
  screenId: string;
  label: string;
}) {
  const isDocument = screenId.includes("pdf") || screenId.includes("rules");
  const isMap = screenId.includes("map");
  const isTerminalOrApi =
    screenId.includes("api") || screenId.includes("emails");
  const isTable =
    screenId.includes("units") ||
    screenId.includes("history") ||
    screenId.includes("tasks") ||
    screenId.includes("shift");

  return (
    <div className="flex h-full w-full flex-col justify-between p-4 sm:p-5 select-none">
      <div className="flex h-full w-full flex-col overflow-hidden rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)]">
        {/* Window Top Chrome */}
        <div className="flex items-center justify-between border-b border-[var(--border-subtle)] px-3 py-2">
          <div className="flex items-center gap-1.5">
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
            <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-muted)] opacity-50" />
          </div>
          <span className="font-mono text-[9px] uppercase tracking-widest text-[var(--text-muted)] truncate max-w-[180px]">
            {projectSlug} / {screenId}
          </span>
          <span className="font-mono text-[9px] text-[var(--text-muted)] opacity-60">
            v2.4
          </span>
        </div>

        {/* Screen Body */}
        <div className="flex flex-1 flex-col justify-between p-3.5 gap-3">
          {isDocument ? (
            <div className="mx-auto flex h-full w-4/5 flex-col justify-between rounded-[2px] border border-[var(--border-subtle)] p-3">
              <div className="flex items-center justify-between border-b border-[var(--border-subtle)] pb-2">
                <span className="font-mono text-[9px] text-[var(--text-primary)]">
                  DOC #0194 — PDF
                </span>
                <span className="h-2 w-10 rounded-[1px] bg-[var(--text-primary)] opacity-80" />
              </div>
              <div className="space-y-1.5 my-2">
                <div className="h-1.5 w-full rounded-full bg-[var(--text-muted)] opacity-40" />
                <div className="h-1.5 w-11/12 rounded-full bg-[var(--text-muted)] opacity-40" />
                <div className="h-1.5 w-4/5 rounded-full bg-[var(--text-muted)] opacity-40" />
                <div className="h-1.5 w-3/5 rounded-full bg-[var(--text-muted)] opacity-30" />
              </div>
              <div className="flex items-center justify-between pt-1">
                <span className="font-mono text-[8px] text-[var(--text-muted)]">
                  SHA-256 VERIFIED
                </span>
                <span className="h-3 w-3 border border-[var(--text-primary)]" />
              </div>
            </div>
          ) : isMap ? (
            <div className="relative flex-1 rounded-[2px] border border-[var(--border-subtle)] overflow-hidden p-3">
              {/* Minimalist vector grid lines */}
              <div
                className="absolute inset-0 opacity-25"
                style={{
                  backgroundImage:
                    "linear-gradient(to right, var(--border-subtle) 1px, transparent 1px), linear-gradient(to bottom, var(--border-subtle) 1px, transparent 1px)",
                  backgroundSize: "20px 20px",
                }}
              />
              <div className="relative flex h-full flex-col justify-between">
                <div className="inline-flex w-fit items-center gap-1.5 rounded-[2px] bg-[var(--bg-bento)] px-2 py-1 font-mono text-[8px] text-[var(--text-primary)]">
                  <span className="h-1.5 w-1.5 rounded-full bg-[var(--text-primary)]" />
                  GPS • -27.5954, -48.5480
                </div>
                <div className="self-center flex items-center gap-1.5 rounded-full bg-[var(--text-primary)] px-2.5 py-1 text-[var(--bg-primary)] font-mono text-[8px]">
                  ● {label}
                </div>
                <div className="flex justify-end">
                  <span className="font-mono text-[8px] text-[var(--text-muted)]">
                    4 POIs NEARBY
                  </span>
                </div>
              </div>
            </div>
          ) : isTerminalOrApi ? (
            <div className="flex flex-1 flex-col justify-between font-mono text-[9px] space-y-1.5">
              <div className="flex items-center justify-between rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5">
                <span className="text-[var(--text-primary)]">
                  POST /v1/dispatch
                </span>
                <span className="text-[var(--text-muted)]">200 OK • 38ms</span>
              </div>
              <div className="flex items-center justify-between rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5">
                <span className="text-[var(--text-secondary)]">
                  GET /v1/audit/logs
                </span>
                <span className="text-[var(--text-muted)]">200 OK • 14ms</span>
              </div>
              <div className="flex items-center justify-between rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5">
                <span className="text-[var(--text-secondary)]">
                  WEBHOOK delivered
                </span>
                <span className="text-[var(--text-primary)]">✓ VERIFIED</span>
              </div>
            </div>
          ) : isTable ? (
            <div className="flex flex-1 flex-col justify-between space-y-1.5">
              <div className="flex items-center justify-between pb-1">
                <span className="font-mono text-[9px] text-[var(--text-primary)]">
                  {label}
                </span>
                <span className="h-4 w-14 rounded-[1px] bg-[var(--text-primary)] opacity-85" />
              </div>
              {[0, 1, 2].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5"
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[8px] text-[var(--text-muted)]">
                      #{104 + row}
                    </span>
                    <span className="h-1.5 w-16 sm:w-24 rounded-full bg-[var(--text-secondary)] opacity-50" />
                  </div>
                  <span className="font-mono text-[8px] text-[var(--text-primary)]">
                    {row === 0 ? "ACTIVE" : row === 1 ? "SYNCED" : "DONE"}
                  </span>
                </div>
              ))}
            </div>
          ) : (
            /* Default Dashboard / Overview Metrics + Bar Chart */
            <div className="flex flex-1 flex-col justify-between gap-2.5">
              <div className="grid grid-cols-3 gap-2">
                {[
                  { k: "STATUS", v: "99.9%" },
                  { k: "FLOWS", v: "1,284" },
                  { k: "LATENCY", v: "24ms" },
                ].map((stat) => (
                  <div
                    key={stat.k}
                    className="rounded-[2px] border border-[var(--border-subtle)] p-2"
                  >
                    <div className="font-mono text-[7px] text-[var(--text-muted)]">
                      {stat.k}
                    </div>
                    <div className="mt-0.5 font-mono text-[11px] font-medium text-[var(--text-primary)]">
                      {stat.v}
                    </div>
                  </div>
                ))}
              </div>
              <div className="flex flex-1 items-end gap-1.5 rounded-[2px] border border-[var(--border-subtle)] p-2.5 min-h-[64px]">
                {[38, 62, 48, 80, 56, 92, 70, 86, 64, 96].map((h, idx) => (
                  <div
                    key={idx}
                    className="flex-1 rounded-t-[1px] bg-[var(--text-primary)] transition-all duration-500"
                    style={{
                      height: `${h}%`,
                      opacity: idx === 9 ? 0.9 : 0.22 + (idx % 3) * 0.12,
                    }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

interface SecondaryProjectVisualProps {
  slug: string;
  name: string;
  image: string | null;
}

/**
 * Architectural B&W schematic placeholder for the 3 secondary technical modules.
 */
export function SecondaryProjectVisual({
  slug,
  name,
  image,
}: SecondaryProjectVisualProps) {
  if (image) {
    return (
      <img
        src={image}
        alt={name}
        className="h-full w-full rounded-[2px] object-cover"
        loading="lazy"
      />
    );
  }

  return (
    <div className="flex h-44 w-full flex-col justify-between rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-4 select-none">
      {slug === "motor-cobrancas" && (
        <>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>PIX BR CODE ENGINE</span>
            <span>CRC16-CCITT</span>
          </div>
          <div className="space-y-1.5 font-mono text-[10px]">
            <div className="rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5 text-[var(--text-secondary)] truncate">
              00020126580014br.gov.bcb.pix0136...
            </div>
            <div className="flex items-center justify-between rounded-[2px] bg-[var(--bg-bento)] px-2.5 py-1.5 text-[var(--text-primary)]">
              <span>PAYLOAD GENERATED</span>
              <span>✓ 0.4ms</span>
            </div>
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>EMV® QRCPS-MPM</span>
            <span>AUTOMATED</span>
          </div>
        </>
      )}

      {slug === "chatbot-condominio-a3" && (
        <>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>GROQ • LLAMA INFERENCE</span>
            <span>PYTHON</span>
          </div>
          <div className="space-y-2">
            <div className="ml-auto w-4/5 rounded-[2px] border border-[var(--border-subtle)] px-2.5 py-1.5 font-mono text-[9px] text-[var(--text-secondary)]">
              Qual o horário de mudança no regimento?
            </div>
            <div className="w-11/12 rounded-[2px] bg-[var(--bg-bento)] px-2.5 py-1.5 font-mono text-[9px] text-[var(--text-primary)]">
              Art. 14: Seg–Sex 08h às 18h, Sáb 08h às 12h.
            </div>
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>CONTEXT: BYLAWS RAG</span>
            <span>~280 TOK/S</span>
          </div>
        </>
      )}

      {slug === "kac" && (
        <>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>KANBAN WORKFLOW</span>
            <span>3 COLUMNS</span>
          </div>
          <div className="grid flex-1 grid-cols-3 gap-2 my-2">
            {[
              { col: "BACKLOG", items: 2 },
              { col: "DOING", items: 2 },
              { col: "DONE", items: 3 },
            ].map((c, colIdx) => (
              <div
                key={c.col}
                className="flex flex-col gap-1.5 rounded-[2px] border border-[var(--border-subtle)] p-1.5"
              >
                <span className="font-mono text-[7px] text-[var(--text-muted)]">
                  {c.col}
                </span>
                {Array.from({ length: c.items }).map((_, i) => (
                  <span
                    key={i}
                    className={`h-3 rounded-[1px] ${
                      colIdx === 1 && i === 0
                        ? "bg-[var(--text-primary)] opacity-85"
                        : "bg-[var(--border-subtle)]"
                    }`}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center justify-between font-mono text-[9px] text-[var(--text-muted)]">
            <span>MAINTENANCE OPS</span>
            <span>REAL-TIME</span>
          </div>
        </>
      )}
    </div>
  );
}
