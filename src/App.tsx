import { useEffect, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { Session } from '@supabase/supabase-js'
import Layout from './components/Layout'
import TopPage from './pages/TopPage'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import DataSourcePage from './pages/DataSourcePage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import { supabase } from './utils/supabase'
import { loadFromSupabase } from './utils/syncDB'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  const [session, setSession] = useState<Session | null | undefined>(undefined)

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => setSession(session))
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_e, session) => setSession(session))
    return () => subscription.unsubscribe()
  }, [])

  if (session === undefined) return null
  if (!session) return <Navigate to="/admin/login" state={{ from: location }} replace />
  return <>{children}</>
}

function App() {
  const [synced, setSynced] = useState(false)

  useEffect(() => {
    loadFromSupabase().finally(() => setSynced(true))
  }, [])

  if (!synced) return null

  return (
    <HelmetProvider>
      <Layout>
        <ScrollToTop />
        <Routes>
          <Route path="/" element={<TopPage />} />
          <Route path="/events" element={<EventListPage />} />
          <Route path="/events/:id" element={<EventDetailPage />} />
          <Route path="/products/:id" element={<ProductDetailPage />} />
          <Route path="/datasource" element={<ProtectedRoute><DataSourcePage /></ProtectedRoute>} />
          <Route path="/admin/login" element={<AdminLoginPage />} />
          <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
          <Route path="/privacy" element={<PrivacyPolicyPage />} />
        </Routes>
      </Layout>
    </HelmetProvider>
  )
}

export default App
