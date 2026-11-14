import { useEffect, useLayoutEffect, type MouseEvent } from 'react'
import {
  useLocation,
  useNavigate,
  useNavigationType,
  type NavigateFunction,
} from 'react-router-dom'

export type PortfolioOriginSection = 'projects' | 'credibility'

export interface ReturnOriginPoint {
  /** Route + search string to return to (e.g. '/' or '/lab') */
  returnPath: string
  /** Optional Home section ID used for layout-resilient scroll restoration */
  sectionId?: PortfolioOriginSection
  /** Relative vertical offset from `sectionId` top (`window.scrollY - sectionTop`) */
  sectionRelativeOffset?: number
  /** Exact scrollY captured when navigating away from the origin page */
  scrollY: number
  /** Selected project slug on `/` at click time */
  activeProjectSlug?: string
  /** Unique token ensuring a return jump is applied once even across reloads */
  restoreToken?: string
}

export interface ProjectNavigationState {
  returnOrigin?: ReturnOriginPoint
  restoreOrigin?: ReturnOriginPoint
}

const ACTIVE_PROJECT_STORAGE_KEY = 'portfolio:active-project-slug'
const RETURN_ORIGIN_STORAGE_KEY = 'portfolio:return-origin'
const CONSUMED_RESTORES_STORAGE_KEY = 'portfolio:consumed-restore-tokens'

const companionModes = new Map<string, 'portrait' | 'architecture'>()

export function saveCompanionMode(
  slug: string,
  mode: 'portrait' | 'architecture',
): void {
  companionModes.set(slug, mode)
}

export function getSavedCompanionMode(
  slug: string,
): 'portrait' | 'architecture' | undefined {
  return companionModes.get(slug)
}

export function saveActiveProjectSlug(slug: string): void {
  try {
    window.sessionStorage.setItem(ACTIVE_PROJECT_STORAGE_KEY, slug)
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function readActiveProjectSlug(): string | null {
  try {
    return window.sessionStorage.getItem(ACTIVE_PROJECT_STORAGE_KEY)
  } catch {
    return null
  }
}

export function saveReturnOrigin(origin: ReturnOriginPoint): void {
  try {
    window.sessionStorage.setItem(
      RETURN_ORIGIN_STORAGE_KEY,
      JSON.stringify(origin),
    )
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function readReturnOrigin(): ReturnOriginPoint | null {
  try {
    const raw = window.sessionStorage.getItem(RETURN_ORIGIN_STORAGE_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as Partial<ReturnOriginPoint>
    if (
      typeof parsed?.returnPath === 'string' &&
      typeof parsed?.scrollY === 'number'
    ) {
      return parsed as ReturnOriginPoint
    }
    return null
  } catch {
    return null
  }
}

export function clearReturnOrigin(): void {
  try {
    window.sessionStorage.removeItem(RETURN_ORIGIN_STORAGE_KEY)
  } catch {
    // Ignore storage errors in restricted environments
  }
}

export function generateRestoreToken(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function isRestoreTokenConsumed(token?: string): boolean {
  if (!token) return false
  try {
    const raw = window.sessionStorage.getItem(CONSUMED_RESTORES_STORAGE_KEY)
    if (!raw) return false
    const list = JSON.parse(raw) as unknown
    return Array.isArray(list) && list.includes(token)
  } catch {
    return false
  }
}

export function markRestoreTokenConsumed(token?: string): void {
  if (!token) return
  try {
    const raw = window.sessionStorage.getItem(CONSUMED_RESTORES_STORAGE_KEY)
    const prev = raw ? (JSON.parse(raw) as unknown) : []
    const list = Array.isArray(prev)
      ? prev.filter((item): item is string => typeof item === 'string')
      : []
    if (!list.includes(token)) {
      const next = [...list.slice(-19), token]
      window.sessionStorage.setItem(
        CONSUMED_RESTORES_STORAGE_KEY,
        JSON.stringify(next),
      )
    }
  } catch {
    // Ignore storage errors in restricted environments
  }
}

/**
 * Captures the user's exact viewport scroll position and relative section offset
 * at click time so Back/Voltar navigation returns to the exact starting point.
 */
export function captureProjectOrigin(options?: {
  sectionId?: PortfolioOriginSection
  activeProjectSlug?: string
}): ReturnOriginPoint {
  const scrollY = window.scrollY || window.pageYOffset || 0
  let sectionRelativeOffset: number | undefined

  if (options?.sectionId) {
    const el = document.getElementById(options.sectionId)
    if (el) {
      const sectionTopDoc = el.getBoundingClientRect().top + scrollY
      sectionRelativeOffset = scrollY - sectionTopDoc
    }
  }

  return {
    returnPath: `${window.location.pathname}${window.location.search}`,
    sectionId: options?.sectionId,
    sectionRelativeOffset,
    scrollY,
    activeProjectSlug: options?.activeProjectSlug,
  }
}

/**
 * Computes the target document scrollY on return, preferring the relative offset
 * inside the origin section (resilient to minor height shifts) with scrollY fallback.
 */
export function computeRestoreScrollY(origin: ReturnOriginPoint): number {
  if (origin.sectionId && typeof origin.sectionRelativeOffset === 'number') {
    const el = document.getElementById(origin.sectionId)
    if (el) {
      const currentSectionTopDoc = el.getBoundingClientRect().top + window.scrollY
      return Math.max(0, currentSectionTopDoc + origin.sectionRelativeOffset)
    }
  }
  return Math.max(0, origin.scrollY)
}

/**
 * Returns true when a link click should be left to default browser handling
 * (already handled, non-primary button, or modifier key for new-tab/window).
 */
export function isModifiedNavigationClick(
  e: MouseEvent<HTMLAnchorElement>,
): boolean {
  return (
    e.defaultPrevented ||
    e.button !== 0 ||
    e.metaKey ||
    e.altKey ||
    e.ctrlKey ||
    e.shiftKey
  )
}

/**
 * Preserves native `<Link>` semantics (middle-click, Cmd+click, right-click)
 * while capturing the live click-time origin point on normal left-click navigation.
 */
export function createProjectLinkClickHandler(
  navigate: NavigateFunction,
  to: string,
  getOriginOptions: () => {
    sectionId?: PortfolioOriginSection
    activeProjectSlug?: string
  },
) {
  return (e: MouseEvent<HTMLAnchorElement>) => {
    if (isModifiedNavigationClick(e)) {
      return
    }

    e.preventDefault()
    const returnOrigin = captureProjectOrigin(getOriginOptions())
    saveReturnOrigin(returnOrigin)
    navigate(to, {
      state: { returnOrigin } satisfies ProjectNavigationState,
    })
  }
}

/**
 * Returns a factory binding `<Link onClick>` handlers for project detail navigation
 * while recording the origin section, scroll offset, and active carousel project.
 */
export function useProjectLinkClickHandler(
  getOriginOptions: () => {
    sectionId?: PortfolioOriginSection
    activeProjectSlug?: string
  },
) {
  const navigate = useNavigate()

  return (to: string) =>
    createProjectLinkClickHandler(navigate, to, getOriginOptions)
}

/**
 * Restores the exact scroll point when returning from `/project/:slug` via an in-app
 * Back/Voltar button (browser `POP` is handled natively by `<ScrollRestoration />`).
 */
export function useRestoreReturnScroll(): void {
  const { state } = useLocation()
  const navigationType = useNavigationType()
  const navState = state as ProjectNavigationState | null
  const restoreOrigin = navState?.restoreOrigin

  useEffect(() => {
    clearReturnOrigin()
  }, [])

  useLayoutEffect(() => {
    if (navigationType === 'POP' || !restoreOrigin) return
    if (isRestoreTokenConsumed(restoreOrigin.restoreToken)) return

    const targetY = computeRestoreScrollY(restoreOrigin)
    window.scrollTo({ top: targetY, left: 0, behavior: 'instant' })

    const token = restoreOrigin.restoreToken
    const timer = window.setTimeout(() => {
      if (token) markRestoreTokenConsumed(token)
    }, 80)

    return () => window.clearTimeout(timer)
  }, [navigationType, restoreOrigin])
}
