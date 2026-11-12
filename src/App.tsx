import { useLayoutEffect } from 'react'
import {
  createBrowserRouter,
  Navigate,
  Outlet,
  RouterProvider,
  ScrollRestoration,
  useLocation,
} from 'react-router-dom'
import { ThemeProvider } from './context/ThemeContext'
import { LanguageProvider } from './context/LanguageContext'
import { MiniAudioPlayer } from './components/layout/MiniAudioPlayer'
import { ScrollToTopButton } from './components/layout/ScrollToTopButton'
import { Home } from './pages/Home'
import { ProjectDetail } from './pages/ProjectDetail'
import { DesignLab } from './pages/DesignLab'

function RootLayout() {
  const { pathname, hash } = useLocation()

  // Guarantee instantaneous jump to top between Home and /project/:slug
  // even with `scroll-behavior: smooth` active on `html` for in-page anchors.
  useLayoutEffect(() => {
    if (!hash) {
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' })
    }
  }, [pathname, hash])

  return (
    <>
      <ScrollRestoration getKey={(location) => location.pathname} />
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
      {
        path: '/lab',
        element: <DesignLab />,
      },
      {
        path: '/examples',
        element: <Navigate to="/lab" replace />,
      },
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
