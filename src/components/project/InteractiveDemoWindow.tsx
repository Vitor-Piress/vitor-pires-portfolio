import {
  type MouseEventHandler,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
} from "react";
import { Link } from "react-router-dom";
import {
  ArrowRight,
  ArrowUpRight,
  Lock,
  Monitor,
  Pause,
  Play,
  RotateCcw,
  Smartphone,
} from "lucide-react";
import type {
  FeaturedProject,
  ProjectInteractiveDemo,
} from "../../data/projects";
import type { Language } from "../../i18n/translations";
import { useLanguage } from "../../context/LanguageContext";

const DESKTOP_MEDIA_QUERY = "(min-width: 768px)";

function subscribeDesktopMedia(callback: () => void): () => void {
  const mql = window.matchMedia(DESKTOP_MEDIA_QUERY);
  mql.addEventListener("change", callback);
  return () => mql.removeEventListener("change", callback);
}

function getDesktopSnapshot(): boolean {
  return window.matchMedia(DESKTOP_MEDIA_QUERY).matches;
}

function getServerDesktopSnapshot(): boolean {
  return true;
}

function useIsDesktop(): boolean {
  return useSyncExternalStore(
    subscribeDesktopMedia,
    getDesktopSnapshot,
    getServerDesktopSnapshot,
  );
}

interface InteractiveDemoWindowProps {
  project: FeaturedProject;
  demo: ProjectInteractiveDemo;
  language: Language;
  variant: "home" | "detail";
  /** Home route link pointing directly to `/project/:slug#flows`. */
  flowsUrl?: string;
  onFlowsClick?: MouseEventHandler<HTMLAnchorElement>;
  /** Case Study fallback action when neither liveUrl nor demoUrl exists. */
  onCommercialCtaClick?: () => void;
}

/**
 * Shared editorial window showcasing an interactive HTML demo (Supademo, 0px padding)
 * on desktop (>= 768px) and an editorial step-card fallback on mobile (< 768px) or when
 * the demo embed URL is still pending — never mounting the desktop iframe on mobile.
 */
export function InteractiveDemoWindow({
  project,
  demo,
  language,
  variant,
  flowsUrl,
  onFlowsClick,
  onCommercialCtaClick,
}: InteractiveDemoWindowProps) {
  const { t } = useLanguage();
  const isDesktop = useIsDesktop();
  const [reloadKey, setReloadKey] = useState(0);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(true);

  const isNativeVideo = Boolean(demo.videoSrc);
  const hasEmbed = Boolean(demo.embedUrl);
  const hasMedia = hasEmbed || isNativeVideo;
  const showDesktopIframe = isDesktop && hasEmbed && !isNativeVideo;
  const isVideo = demo.kind === "video" || isNativeVideo;
  const playbackRate = demo.videoPlaybackRate ?? 1;
  const numericAspectRatio = demo.aspectRatio ?? 1.79;

  useEffect(() => {
    if (!isNativeVideo || !videoRef.current) return;
    videoRef.current.playbackRate = playbackRate;
  }, [isNativeVideo, playbackRate]);
  const isPortrait = demo.orientation === "portrait" || numericAspectRatio < 1;
  const aspectRatio = String(numericAspectRatio);
  const verticalPadding = demo.embedPaddingPx
    ? `${demo.embedPaddingPx}px 0`
    : "0";
  const displayUrl = `https://${project.appDomain ?? `${project.slug}.app`}${demo.appPath ?? ""}`;
  const steps = demo.steps ?? [];

  const handleToggleVideo = () => {
    const el = videoRef.current;
    if (!el) return;
    if (el.paused) {
      void el.play().catch(() => {});
    } else {
      el.pause();
    }
  };

  const handleRestart = () => {
    if (isNativeVideo && videoRef.current) {
      videoRef.current.currentTime = 0;
      void videoRef.current.play().catch(() => {});
      return;
    }
    setReloadKey((prev) => prev + 1);
  };

  const renderWindowFrame = () => (
    <div
      className={`flex flex-col overflow-hidden rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] shadow-sm ${
        variant === "home" ? "flex-1" : ""
      }`}
    >
      {/* Window Top Chrome */}
      <div
        className={`flex items-center justify-between gap-3 border-b border-[var(--border-subtle)] ${
          variant === "home"
            ? "h-8 shrink-0 bg-[var(--bg-bento)] px-3"
            : "bg-[var(--bg-primary)]/80 px-4 py-3 backdrop-blur-xs"
        }`}
      >
        <div className="flex items-center gap-1.5 shrink-0" aria-hidden="true">
          <span
            className={`${
              variant === "home" ? "h-2 w-2" : "h-2.5 w-2.5"
            } rounded-full bg-[var(--border-subtle)]`}
          />
          <span
            className={`${
              variant === "home" ? "h-2 w-2" : "h-2.5 w-2.5"
            } rounded-full bg-[var(--border-subtle)]`}
          />
          <span
            className={`${
              variant === "home" ? "h-2 w-2" : "h-2.5 w-2.5"
            } rounded-full bg-[var(--border-subtle)]`}
          />
        </div>

        <div
          className={
            variant === "home"
              ? "hidden sm:inline-flex items-center gap-1.5 truncate px-2 font-mono text-[10px] text-[var(--text-secondary)]"
              : "hidden sm:inline-flex items-center gap-2 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-3 py-1 font-mono text-[11px] text-[var(--text-muted)] max-w-sm truncate"
          }
        >
          <Lock
            className={`${
              variant === "home" ? "h-2.5 w-2.5" : "h-3 w-3"
            } shrink-0 text-[var(--text-secondary)]`}
            strokeWidth={1.8}
          />
          <span className="truncate text-[var(--text-secondary)]">
            {displayUrl}
          </span>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          {isNativeVideo && (
            <button
              type="button"
              onClick={handleToggleVideo}
              aria-label={
                isPlaying ? t.interactiveDemo.pause : t.interactiveDemo.play
              }
              title={
                isPlaying ? t.interactiveDemo.pause : t.interactiveDemo.play
              }
              className="cursor-pointer inline-flex items-center gap-1 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              {isPlaying ? (
                <Pause className="h-3 w-3" strokeWidth={1.8} />
              ) : (
                <Play className="h-3 w-3 fill-current" strokeWidth={1.8} />
              )}
              <span className="hidden sm:inline">
                {isPlaying ? t.interactiveDemo.pause : t.interactiveDemo.play}
              </span>
            </button>
          )}

          {(showDesktopIframe || isNativeVideo) && (
            <button
              type="button"
              onClick={handleRestart}
              aria-label={t.interactiveDemo.restart}
              title={t.interactiveDemo.restart}
              className="cursor-pointer inline-flex items-center gap-1 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] hover:border-[var(--text-primary)] hover:text-[var(--text-primary)] transition-colors"
            >
              <RotateCcw className="h-3 w-3" strokeWidth={1.8} />
              <span className="hidden sm:inline">
                {t.interactiveDemo.restart}
              </span>
            </button>
          )}

          {variant === "home" ? (
            <span className="inline-flex items-center gap-1.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
              <span
                className={`h-1.5 w-1.5 rounded-full ${
                  isNativeVideo
                    ? isPlaying
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-[var(--text-muted)]"
                    : hasMedia
                      ? "bg-emerald-500 animate-pulse"
                      : "bg-[var(--text-muted)]"
                }`}
              />
              <span>
                {isNativeVideo
                  ? isPlaying
                    ? t.interactiveDemo.liveTag
                    : t.interactiveDemo.pausedTag
                  : hasMedia
                    ? t.interactiveDemo.liveTag
                    : t.interactiveDemo.comingSoonTag}
              </span>
            </span>
          ) : project.liveUrl ? (
            <a
              href={project.liveUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
            >
              <span>{t.projectsSection.liveWebsite}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          ) : project.demoUrl ? (
            <a
              href={project.demoUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 rounded-[3px] bg-[var(--text-primary)] px-3.5 py-1.5 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
            >
              <span>{t.projectDetail.sections.demoAction}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </a>
          ) : (
            <button
              type="button"
              onClick={onCommercialCtaClick}
              className="cursor-pointer inline-flex items-center gap-1.5 rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] px-3 py-1.5 text-xs font-mono text-[var(--text-secondary)] hover:text-[var(--text-primary)] hover:border-[var(--text-primary)] transition-all"
            >
              <span>{t.projectDetail.sections.demoOnRequest}</span>
              <ArrowUpRight className="h-3.5 w-3.5" strokeWidth={1.8} />
            </button>
          )}
        </div>
      </div>

      {/* Viewport Body: Native Video Loop, Desktop Iframe, OR Mobile/Pending Editorial Steps Card */}
      {isNativeVideo && demo.videoSrc ? (
        <div className="group/video relative w-full bg-[var(--bg-primary)]">
          <div
            style={{
              position: "relative",
              maxHeight: "80svh",
              width: "100%",
              maxWidth: `calc(80svh * ${numericAspectRatio})`,
              marginInline: "auto",
              aspectRatio,
              overflow: "hidden",
            }}
          >
            <video
              ref={videoRef}
              src={demo.videoSrc}
              poster={demo.posterSrc}
              autoPlay
              loop
              muted
              playsInline
              preload="metadata"
              aria-label={demo.title[language]}
              onLoadedMetadata={(event) => {
                event.currentTarget.playbackRate = playbackRate;
              }}
              onPlay={(event) => {
                event.currentTarget.playbackRate = playbackRate;
                setIsPlaying(true);
              }}
              onPause={() => setIsPlaying(false)}
              onClick={handleToggleVideo}
              className="block h-full w-full cursor-pointer object-contain bg-[var(--bg-primary)]"
            />

            {!isPlaying && (
              <button
                type="button"
                onClick={handleToggleVideo}
                aria-label={t.interactiveDemo.play}
                className="cursor-pointer absolute inset-0 m-auto h-fit w-fit inline-flex items-center gap-2 rounded-full border border-white/20 bg-neutral-950/80 px-4 py-2 text-xs font-medium text-white shadow-lg backdrop-blur-md transition-transform duration-200 hover:scale-105"
              >
                <Play className="h-3.5 w-3.5 fill-current" />
                <span>{t.interactiveDemo.play}</span>
              </button>
            )}

            <button
              type="button"
              onClick={handleToggleVideo}
              aria-label={
                isPlaying ? t.interactiveDemo.pause : t.interactiveDemo.play
              }
              className={`cursor-pointer absolute bottom-3 right-3 inline-flex items-center gap-1.5 rounded-full border border-white/15 bg-neutral-950/75 px-3 py-1.5 font-mono text-[10px] uppercase tracking-wider text-white shadow-md backdrop-blur-md transition-opacity duration-200 hover:bg-neutral-950 ${
                isPlaying
                  ? "opacity-100 sm:opacity-0 sm:group-hover/video:opacity-100"
                  : "opacity-100"
              }`}
            >
              {isPlaying ? (
                <>
                  <Pause className="h-3 w-3" strokeWidth={2} />
                  <span>{t.interactiveDemo.pause}</span>
                </>
              ) : (
                <>
                  <Play className="h-3 w-3 fill-current" strokeWidth={2} />
                  <span>{t.interactiveDemo.play}</span>
                </>
              )}
            </button>
          </div>
        </div>
      ) : showDesktopIframe && demo.embedUrl ? (
        isPortrait ? (
          <div className="flex flex-1 flex-col md:flex-row items-stretch bg-[var(--bg-primary)]">
            {/* Left: Aspect-locked Portrait Mobile Frame */}
            <div className="flex shrink-0 items-center justify-center border-b md:border-b-0 md:border-r border-[var(--border-subtle)] bg-[var(--bg-bento)]/35 p-4 sm:p-5">
              <div className="rounded-[12px] border border-[var(--border-subtle)] bg-[var(--bg-primary)] p-1.5 shadow-md">
                <div
                  style={{
                    position: "relative",
                    height:
                      variant === "home"
                        ? "min(500px, 62svh)"
                        : "min(640px, 76svh)",
                    width: "auto",
                    aspectRatio,
                    maxWidth: "100%",
                    borderRadius: "6px",
                    overflow: "hidden",
                    padding: verticalPadding,
                  }}
                >
                  <iframe
                    key={reloadKey}
                    src={demo.embedUrl}
                    loading="lazy"
                    title={demo.title[language]}
                    allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                    allowFullScreen
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: 0,
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Right: Editorial Flow Companion */}
            <div
              className={`flex flex-1 min-w-0 flex-col justify-between ${
                variant === "home" ? "p-4 sm:p-5" : "p-6 sm:p-8"
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                    {t.interactiveDemo.stepsHeading}
                  </span>
                  <span className="rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
                    Mobile · 9:19
                  </span>
                </div>

                <h3
                  className={`mt-3 font-editorial leading-[1.18] text-[var(--text-primary)] ${
                    variant === "home"
                      ? "text-lg sm:text-xl"
                      : "text-2xl sm:text-3xl"
                  }`}
                >
                  {demo.title[language]}
                </h3>

                {steps.length > 0 && (
                  <div
                    className={
                      variant === "home"
                        ? "mt-4 space-y-2"
                        : "mt-6 grid grid-cols-1 sm:grid-cols-2 gap-3"
                    }
                  >
                    {steps.map((step) => (
                      <div
                        key={step.code}
                        className={`rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/55 ${
                          variant === "home" ? "px-3 py-2" : "p-3.5"
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
                            {step.code}
                          </span>
                          <span className="text-xs font-medium text-[var(--text-primary)]">
                            {step.title[language]}
                          </span>
                        </div>
                        {variant !== "home" && (
                          <p className="mt-1 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                            {step.detail[language]}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)]/70 pt-3">
                <span className="font-mono text-[9.5px] uppercase tracking-wider text-[var(--text-muted)]">
                  {isVideo
                    ? t.interactiveDemo.videoInteractHint
                    : t.interactiveDemo.interactHint}
                </span>

                <a
                  href={demo.embedUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-primary)] hover:opacity-75 transition-opacity"
                >
                  <span>{t.interactiveDemo.openFullscreen}</span>
                  <ArrowUpRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </div>
          </div>
        ) : (
          <div className="w-full bg-[var(--bg-primary)]">
            <div
              style={{
                position: "relative",
                boxSizing: "content-box",
                maxHeight: "80svh",
                width: "100%",
                maxWidth: `calc(80svh * ${numericAspectRatio})`,
                marginInline: "auto",
                aspectRatio,
                padding: verticalPadding,
              }}
            >
              <iframe
                key={reloadKey}
                src={demo.embedUrl}
                loading="lazy"
                title={demo.title[language]}
                allow="autoplay; fullscreen; picture-in-picture; clipboard-write"
                allowFullScreen
                style={{
                  position: "absolute",
                  top: 0,
                  left: 0,
                  width: "100%",
                  height: "100%",
                  border: 0,
                }}
              />
            </div>
          </div>
        )
      ) : (
        <div className="flex flex-1 flex-col justify-between bg-[var(--bg-primary)] p-5 sm:p-7">
          <div>
            <div className="flex flex-wrap items-center justify-between gap-2">
              <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-[var(--text-muted)]">
                {t.interactiveDemo.stepsHeading}
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-[2px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] px-2 py-0.5 font-mono text-[9px] uppercase tracking-wider text-[var(--text-secondary)]">
                <span
                  className={`h-1.5 w-1.5 rounded-full ${
                    hasEmbed ? "bg-emerald-500" : "bg-[var(--text-muted)]"
                  }`}
                />
                <span>
                  {hasEmbed
                    ? t.interactiveDemo.mobileNotice
                    : t.interactiveDemo.comingSoonTag}
                </span>
              </span>
            </div>

            <h3 className="mt-3 font-editorial text-2xl sm:text-3xl leading-[1.15] text-[var(--text-primary)]">
              {demo.title[language]}
            </h3>

            <p className="mt-2 text-xs sm:text-sm leading-relaxed text-[var(--text-secondary)]">
              {hasEmbed
                ? demo.caption[language]
                : t.interactiveDemo.pendingNotice}
            </p>
          </div>

          {steps.length > 0 && (
            <div
              className={`grid grid-cols-1 sm:grid-cols-2 ${
                variant === "home" ? "mt-5 gap-2" : "mt-6 gap-2.5"
              }`}
            >
              {steps.map((step) => (
                <div
                  key={step.code}
                  className={`rounded-[3px] border border-[var(--border-subtle)] bg-[var(--bg-bento)]/60 ${
                    variant === "home" ? "px-3 py-2.5" : "p-3.5"
                  }`}
                >
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-[10px] text-[var(--text-muted)] tabular-nums">
                      {step.code}
                    </span>
                    <span className="text-xs sm:text-[13px] font-medium text-[var(--text-primary)]">
                      {step.title[language]}
                    </span>
                  </div>
                  {variant !== "home" && (
                    <p className="mt-1.5 text-[11px] leading-relaxed text-[var(--text-secondary)]">
                      {step.detail[language]}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {/* Action Row for Mobile Fallback / Pending Demo */}
          <div className="mt-6 flex flex-wrap items-center gap-4">
            {demo.embedUrl ? (
              <a
                href={demo.embedUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center gap-2 rounded-full bg-[var(--text-primary)] px-4 py-2 text-xs font-medium text-[var(--bg-primary)] hover:opacity-85 transition-opacity"
              >
                <Play className="h-3 w-3 fill-current" />
                <span>{t.interactiveDemo.openFullscreen}</span>
                <ArrowUpRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
              </a>
            ) : null}

            {variant === "home" && flowsUrl && (
              <Link
                to={flowsUrl}
                onClick={onFlowsClick}
                className="group inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)] underline underline-offset-4 decoration-[var(--border-subtle)] hover:text-[var(--text-primary)] hover:decoration-[var(--text-primary)] transition-colors"
              >
                <span>
                  {demo.embedUrl
                    ? t.interactiveDemo.openFullWalkthrough
                    : t.projectsSection.viewDetails}
                </span>
                <ArrowRight className="h-3 w-3 transition-transform duration-200 group-hover:translate-x-0.5" />
              </Link>
            )}
          </div>
        </div>
      )}

      {/* Detail Variant Bottom Caption Bar */}
      {variant === "detail" && (
        <div className="flex flex-wrap items-center justify-between gap-2 border-t border-[var(--border-subtle)] px-4 py-2.5 bg-[var(--bg-bento)]/50 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
          <span className="text-[var(--text-secondary)]">
            {demo.caption[language]}
          </span>
          {(showDesktopIframe || isNativeVideo) && (
            <span>
              {isVideo
                ? t.interactiveDemo.videoInteractHint
                : t.interactiveDemo.interactHint}
            </span>
          )}
        </div>
      )}
    </div>
  );

  if (variant === "detail") {
    return (
      <div className="rounded-[4px] border border-[var(--border-subtle)] bg-[var(--bg-bento)] shadow-sm overflow-hidden">
        {renderWindowFrame()}
      </div>
    );
  }

  return (
    <div className="bento-card flex h-full flex-col justify-between overflow-hidden p-3 sm:p-4">
      {/* Card Top Bar */}
      <div className="mb-3 flex flex-wrap items-center justify-between gap-2">
        <div className="inline-flex items-center gap-2 font-mono text-[10px] uppercase tracking-wider text-[var(--text-secondary)]">
          {isPortrait ? (
            <Smartphone
              className="h-3.5 w-3.5 text-[var(--text-muted)]"
              strokeWidth={1.75}
            />
          ) : (
            <Monitor
              className="h-3.5 w-3.5 text-[var(--text-muted)]"
              strokeWidth={1.75}
            />
          )}
          <span>
            {isVideo
              ? t.interactiveDemo.videoWindowLabel
              : t.interactiveDemo.windowLabel}
          </span>
        </div>

        {flowsUrl && (
          <Link
            to={flowsUrl}
            onClick={onFlowsClick}
            className="inline-flex items-center gap-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
          >
            <span>{t.interactiveDemo.openFullWalkthrough}</span>
            <ArrowUpRight className="h-3 w-3" />
          </Link>
        )}
      </div>

      {renderWindowFrame()}

      {/* Bottom Caption Bar */}
      <div className="mt-3 flex flex-wrap items-center justify-between gap-2 px-1 font-mono text-[10px] uppercase tracking-wider text-[var(--text-muted)]">
        <span className="text-[var(--text-secondary)] truncate">
          {demo.caption[language]}
        </span>

        {flowsUrl && (
          <Link
            to={flowsUrl}
            onClick={onFlowsClick}
            className="inline-flex items-center gap-1 text-[var(--text-primary)] hover:opacity-75 transition-opacity shrink-0"
          >
            <span>{t.interactiveDemo.expandInCase}</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
        )}
      </div>
    </div>
  );
}
