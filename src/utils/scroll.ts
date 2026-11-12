let activeRafId: number | null = null
let cleanupUserAbortListeners: (() => void) | null = null

function cancelActiveScroll() {
  if (activeRafId !== null) {
    window.cancelAnimationFrame(activeRafId)
    activeRafId = null
  }
  if (cleanupUserAbortListeners) {
    cleanupUserAbortListeners()
    cleanupUserAbortListeners = null
  }
}

/** Smooth cubic-bezier-like easing (easeInOutCubic) */
function easeInOutCubic(t: number): number {
  return t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2
}

/**
 * Runs a requestAnimationFrame scroll animation that is completely immune
 * to mouse movement, hover state changes, or React re-renders.
 * Only explicit user wheel/touch scroll gestures can cancel it.
 */
export function animateWindowScrollTo(
  getTargetY: () => number,
  options?: {
    duration?: number
    onComplete?: () => void
  },
) {
  cancelActiveScroll()

  const startY = window.scrollY
  const initialTargetY = Math.max(0, getTargetY())
  const distance = Math.abs(initialTargetY - startY)

  if (distance < 2) {
    window.scrollTo({ top: initialTargetY, left: 0, behavior: 'instant' })
    options?.onComplete?.()
    return
  }

  // Adaptive duration between 420ms and 680ms based on scroll distance
  const duration =
    options?.duration ?? Math.min(680, Math.max(420, Math.sqrt(distance) * 16))
  const startTime = performance.now()

  const abortOnUserScroll = () => {
    cancelActiveScroll()
    options?.onComplete?.()
  }

  window.addEventListener('wheel', abortOnUserScroll, { passive: true, once: true })
  window.addEventListener('touchstart', abortOnUserScroll, { passive: true, once: true })

  cleanupUserAbortListeners = () => {
    window.removeEventListener('wheel', abortOnUserScroll)
    window.removeEventListener('touchstart', abortOnUserScroll)
  }

  const step = (now: number) => {
    const elapsed = now - startTime
    const progress = Math.min(1, elapsed / duration)
    const eased = easeInOutCubic(progress)

    // Re-read target Y on each frame in case layout shifts slightly
    const currentTargetY = Math.max(0, getTargetY())
    const nextY = startY + (currentTargetY - startY) * eased

    window.scrollTo({ top: nextY, left: 0, behavior: 'instant' })

    if (progress < 1) {
      activeRafId = window.requestAnimationFrame(step)
    } else {
      window.scrollTo({ top: currentTargetY, left: 0, behavior: 'instant' })
      cancelActiveScroll()
      options?.onComplete?.()
    }
  }

  activeRafId = window.requestAnimationFrame(step)
}

/**
 * Smoothly scrolls to a target element by ID, aligning the element's inner
 * content (accounting for top padding) right below the fixed header at `offset` px.
 */
export function scrollToElement(
  elementId: string,
  offset = 78,
  onComplete?: () => void,
) {
  const element = document.getElementById(elementId)
  if (!element) {
    onComplete?.()
    return
  }

  animateWindowScrollTo(
    () => {
      const paddingTop = parseFloat(window.getComputedStyle(element).paddingTop) || 0
      const contentTop = element.getBoundingClientRect().top + window.scrollY + paddingTop
      return contentTop - offset
    },
    { onComplete },
  )
}

/**
 * Smoothly scrolls to the top of the page (y = 0) without being interrupted
 * by mouse movement.
 */
export function scrollToTopSmooth(onComplete?: () => void) {
  animateWindowScrollTo(() => 0, { onComplete })
}
