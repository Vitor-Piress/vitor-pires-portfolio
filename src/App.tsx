import { lazy, Suspense, useLayoutEffect } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
  useNavigationType,
  type RouteObject,
} from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { MiniAudioPlayer } from './components/layout/MiniAudioPlayer'
import { ScrollToTopButton } from './components/layout/ScrollToTopButton'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import {
  isRestoreTokenConsumed,
  type ProjectNavigationState,
} from './utils/returnNavigation'

const DesignLab = import.meta.env.DEV
  ? lazy(() =>
      import('./pages/DesignLab').then((module) => ({
        default: module.DesignLab,
      })),
    )
  : null

const devOnlyRoutes: RouteObject[] =
  import.meta.env.DEV && DesignLab
    ? [
        {
          path: '/lab',
          element: (
            <Suspense fallback={null}>
              <DesignLab />
            </Suspense>
          ),
        },
        {
          path: '/examples',
          element: <Navigate to="/lab" replace />,
        },
      ]
    : []

function RootLayout() {
  const { pathname, hash, key, state } = useLocation()
  const navigationType = useNavigationType()

  // Guarantee instantaneous jump to top on forward navigation without a hash,
  // while preserving browser POP restoration and explicit return-point restores.
  useLayoutEffect(() => {
    const navState = state as ProjectNavigationState | null
    const hasPendingRestore = Boolean(
      navState?.restoreOrigin &&
        !isRestoreTokenConsumed(navState.restoreOrigin.restoreToken),
    )

    if (navigationType === 'POP' || hasPendingRestore) {
      return
    }

    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash, key, navigationType, state])

  return (
    <>
      <ScrollRestoration />
      <Outlet />
      <MiniAudioPlayer />
      <ScrollToTopButton />
    </>
  )
}

const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      {
        path: '/',
        element: <Home />,
      },
      {
        path: '/project/:slug',
        element: <ProjectDetail />,
      },
      ...devOnlyRoutes,
      {
        path: '*',
        element: <Navigate to="/" replace />,
      },
    ],
  },
])

export function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <RouterProvider router={router} />
      </LanguageProvider>
    </ThemeProvider>
  )
}

export default App
