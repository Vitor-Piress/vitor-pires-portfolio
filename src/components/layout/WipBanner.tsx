import { AlertTriangle } from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

/**
 * Glassmorphic yellow demarcation strip anchored directly beneath the top header bar
 * with slowly drifting diagonal stripes to signal an active preview build.
 */
export function WipBanner() {
  const { t } = useLanguage();

  return (
    <div
      role="status"
      aria-live="polite"
      className="relative flex h-7 w-full items-center justify-center overflow-hidden border-y border-zinc-950/15 dark:border-yellow-200/25 bg-yellow-400/80 px-4 text-zinc-950 backdrop-blur-md shadow-[inset_0_1px_0_rgba(255,255,255,0.28)] select-none"
    >
      {/* Slowly drifting diagonal stripe layer (28px horizontal period matches background-size) */}
      <div
        aria-hidden="true"
        className="wip-stripes-layer pointer-events-none absolute inset-y-0 -left-7 w-[calc(100%+56px)]"
      />

      <div className="relative z-10 flex max-w-6xl items-center justify-center gap-2 truncate font-mono text-[10px] sm:text-[11px] font-semibold uppercase tracking-[0.12em]">
        <AlertTriangle
          className="h-3 w-3 shrink-0 text-zinc-950"
          strokeWidth={2.2}
          aria-hidden="true"
        />
        <span className="truncate sm:hidden">{t.wipBanner.short}</span>
        <span className="hidden truncate sm:inline">{t.wipBanner.full}</span>
      </div>
    </div>
  );
}
