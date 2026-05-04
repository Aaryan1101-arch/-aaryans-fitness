import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import { useLeads } from './hooks/useLeads'
import Sidebar from './components/Sidebar'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Members from './pages/Members'
import SiteSettings from './pages/content/SiteSettings'
import HeroEditor from './pages/content/HeroEditor'
import PlansEditor from './pages/content/PlansEditor'
import ServicesEditor from './pages/content/ServicesEditor'
import GalleryEditor from './pages/content/GalleryEditor'
import TeamEditor from './pages/content/TeamEditor'
import ReviewsEditor from './pages/content/ReviewsEditor'

function Spinner() {
  return (
    <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center">
      <svg className="animate-spin w-8 h-8 text-brand" fill="none" viewBox="0 0 24 24">
        <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.2" strokeWidth="4" />
        <path fill="currentColor" d="M4 12a8 8 0 0 1 8-8v4a4 4 0 0 0-4 4H4z" />
      </svg>
    </div>
  )
}

function AdminShell({ admin, onSignOut }) {
  const { stats } = useLeads()
  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      <Sidebar admin={admin} onSignOut={onSignOut} newLeadCount={stats.new} />
      <main className="flex-1 overflow-y-auto">
        <Routes>
          <Route index element={<Dashboard admin={admin} />} />
          <Route path="leads" element={<Leads />} />
          <Route path="members" element={<Members />} />
          <Route path="content/settings" element={<SiteSettings />} />
          <Route path="content/hero" element={<HeroEditor />} />
          <Route path="content/plans" element={<PlansEditor />} />
          <Route path="content/services" element={<ServicesEditor />} />
          <Route path="content/gallery" element={<GalleryEditor />} />
          <Route path="content/team" element={<TeamEditor />} />
          <Route path="content/reviews" element={<ReviewsEditor />} />
          <Route path="*" element={<Navigate to="/admin" replace />} />
        </Routes>
      </main>
    </div>
  )
}

export default function AdminApp() {
  const { session, admin, loading, signOut } = useAuth()

  if (loading) return <Spinner />

  if (!session || !admin) {
    return (
      <Routes>
        <Route path="*" element={<Login />} />
      </Routes>
    )
  }

  return <AdminShell admin={admin} onSignOut={signOut} />
}
