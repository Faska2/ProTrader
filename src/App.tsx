import React, { useEffect } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { MainLayout } from './layouts/MainLayout'
import { useStore } from './store/useStore'
import { ToastProvider } from './components/Toast'
import { DashboardSkeleton } from './components/Skeleton'

// Lazy load pages
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Sessions = React.lazy(() => import('./pages/Sessions'))
const SessionDetails = React.lazy(() => import('./pages/SessionDetails'))
const Trades = React.lazy(() => import('./pages/Trades'))
const TradeDetails = React.lazy(() => import('./pages/TradeDetails'))
const Analytics = React.lazy(() => import('./pages/Analytics'))
const Psychology = React.lazy(() => import('./pages/Psychology'))
const PsychologyAnalysis = React.lazy(() => import('./pages/PsychologyAnalysis'))
const Strategies = React.lazy(() => import('./pages/Strategies'))
const Settings = React.lazy(() => import('./pages/Settings'))
const FAQ = React.lazy(() => import('./pages/FAQ'))

const App: React.FC = () => {
  const { settings, fetchData, loading } = useStore()

  useEffect(() => {
    fetchData()
  }, [])

  useEffect(() => {
    if (settings.theme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [settings.theme])

  if (loading) {
    return (
      <div className="h-screen w-screen flex items-center justify-center bg-background text-foreground">
        <div className="spinner" />
      </div>
    )
  }

  return (
    <ToastProvider>
      <BrowserRouter>
        <MainLayout>
          <React.Suspense fallback={<DashboardSkeleton />}>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/sessions" element={<Sessions />} />
              <Route path="/sessions/:id" element={<SessionDetails />} />
              <Route path="/trades" element={<Trades />} />
              <Route path="/trades/:id" element={<TradeDetails />} />
              <Route path="/analytics" element={<Analytics />} />
              <Route path="/psychology" element={<Psychology />} />
              <Route path="/psychology/analysis" element={<PsychologyAnalysis />} />
              <Route path="/strategies" element={<Strategies />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/faq" element={<FAQ />} />
            </Routes>
          </React.Suspense>
        </MainLayout>
      </BrowserRouter>
    </ToastProvider>
  )
}

export default App
