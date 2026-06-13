import { createContext, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { HelmetProvider } from 'react-helmet-async'
import type { Session } from '@supabase/supabase-js'
import Layout from './components/Layout'
import TopPage from './pages/TopPage'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import DataSourcePage from './pages/DataSourcePage'
import AdminLoginPage from './pages/AdminLoginPage'
import PrivacyPolicyPage from './pages/PrivacyPolicyPage'
import ContactPage from './pages/ContactPage'
import { supabase } from './utils/supabase'
import { loadFromSupabase } from './utils/syncDB'

// AdminPage はXLSX等を含むため遅延ロード（初期バンドルから除外）
const AdminPage = lazy(() => import('./pages/AdminPage'))

export const SyncedContext = createContext({ synced: false, version: 0 })

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

declare function gtag(...args: unknown[]): void

function PageViewTracker() {
  const { pathname } = useLocation()
  const mounted = useRef(false)
  useEffect(() => {
    if (!mounted.current) {
      mounted.current = true
      return // 初回は gtag('config') が自動送信するためスキップ
    }
    if (typeof gtag !== 'undefined') {
      gtag('event', 'page_view', {
        page_path: pathname,
        page_location: window.location.href,
        page_title: document.title,
      })
    }
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
  // localStorageに管理データがあればすぐに表示（再訪問者）、なければSpinner
  const [synced, setSynced] = useState(
    () => localStorage.getItem('adminCreatedEvents') !== null
  )
  const [version, setVersion] = useState(0)

  useEffect(() => {
    loadFromSupabase().finally(() => {
      setSynced(true)
      setVersion(v => v + 1)  // Supabase完了後に全ページを最新データで再描画
    })
  }, [])

  if (!synced) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent" />
      </div>
    )
  }

  return (
    <SyncedContext.Provider value={{ synced, version }}>
      <HelmetProvider>
        <Layout>
          <ScrollToTop />
          <PageViewTracker />
          <Routes>
            <Route path="/" element={<TopPage />} />
            <Route path="/events" element={<EventListPage />} />
            <Route path="/events/:id" element={<EventDetailPage />} />
            <Route path="/products/:id" element={<ProductDetailPage />} />
            <Route path="/datasource" element={<ProtectedRoute><DataSourcePage /></ProtectedRoute>} />
            <Route path="/admin/login" element={<AdminLoginPage />} />
            <Route path="/admin" element={
              <ProtectedRoute>
                <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-10 w-10 border-2 border-orange-500 border-t-transparent" /></div>}>
                  <AdminPage />
                </Suspense>
              </ProtectedRoute>
            } />
            <Route path="/privacy" element={<PrivacyPolicyPage />} />
            <Route path="/contact" element={<ContactPage />} />
          </Routes>
        </Layout>
      </HelmetProvider>
    </SyncedContext.Provider>
  )
}

export default App
