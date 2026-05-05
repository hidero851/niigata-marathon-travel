import { useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import Layout from './components/Layout'
import TopPage from './pages/TopPage'
import EventListPage from './pages/EventListPage'
import EventDetailPage from './pages/EventDetailPage'
import ProductDetailPage from './pages/ProductDetailPage'
import DataSourcePage from './pages/DataSourcePage'
import AdminPage from './pages/AdminPage'
import AdminLoginPage from './pages/AdminLoginPage'
import { isAdminLoggedIn } from './utils/auth'

function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])
  return null
}

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const location = useLocation()
  if (!isAdminLoggedIn()) {
    return <Navigate to="/admin/login" state={{ from: location }} replace />
  }
  return <>{children}</>
}

function App() {
  return (
    <Layout>
      <ScrollToTop />
      <Routes>
        <Route path="/" element={<TopPage />} />
        <Route path="/events" element={<EventListPage />} />
        <Route path="/events/:id" element={<EventDetailPage />} />
        <Route path="/products/:id" element={<ProductDetailPage />} />
        <Route path="/datasource" element={<DataSourcePage />} />
        <Route path="/admin/login" element={<AdminLoginPage />} />
        <Route path="/admin" element={<ProtectedRoute><AdminPage /></ProtectedRoute>} />
      </Routes>
    </Layout>
  )
}

export default App
