import { useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useLeads } from '../hooks/useLeads'
import { useMembers } from '../hooks/useMembers'
import StatCard from '../components/StatCard'
import StatusBadge from '../components/StatusBadge'

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  return d === 1 ? 'yesterday' : `${d}d ago`
}

function greeting() {
  const h = new Date().getHours()
  if (h < 12) return 'Good morning'
  if (h < 17) return 'Good afternoon'
  return 'Good evening'
}

export default function Dashboard({ admin }) {
  const { leads, loading: leadsLoading, stats: leadStats } = useLeads()
  const { stats: memberStats, loading: membersLoading } = useMembers()

  const recent = useMemo(() => leads.slice(0, 8), [leads])

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long', month: 'long', day: 'numeric',
  })

  return (
    <div className="p-8">
      {/* Header */}
      <div className="mb-8">
        <p className="section-eyebrow text-left mb-1">{today}</p>
        <h1 className="text-2xl font-semibold text-white">
          {greeting()}{admin?.email ? `, ${admin.email.split('@')[0]}` : ''}.
        </h1>
      </div>

      {/* Stats grid */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <StatCard
          label="New leads today"
          value={leadsLoading ? '…' : leadStats.today}
          accent={leadStats.today > 0}
          icon={
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
            </svg>
          }
        />
        <StatCard
          label="Leads this week"
          value={leadsLoading ? '…' : leadStats.thisWeek}
          icon={
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
            </svg>
          }
        />
        <StatCard
          label="Total leads"
          value={leadsLoading ? '…' : leadStats.total}
          sub={leadStats.new > 0 ? `${leadStats.new} unopened` : undefined}
          icon={
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
            </svg>
          }
        />
        <StatCard
          label="Active members"
          value={membersLoading ? '…' : memberStats.active}
          sub={memberStats.expiringSoon > 0 ? `${memberStats.expiringSoon} expiring soon` : undefined}
          icon={
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
            </svg>
          }
        />
      </div>

      {/* Recent leads */}
      <div className="glass-card overflow-hidden">
        <div className="px-6 py-4 border-b border-white/[0.07] flex items-center justify-between">
          <h2 className="text-white font-semibold">Recent Leads</h2>
          <Link to="/admin/leads" className="text-sm text-brand-light hover:text-white transition-colors">
            View all →
          </Link>
        </div>

        {leadsLoading ? (
          <div className="px-6 py-12 text-center text-white/30 text-sm">Loading…</div>
        ) : recent.length === 0 ? (
          <div className="px-6 py-12 text-center text-white/30 text-sm">
            No leads yet — they'll appear here when someone submits the contact form.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-6 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-6 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Phone</th>
                  <th className="text-left px-6 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Message</th>
                  <th className="text-left px-6 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-6 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">When</th>
                </tr>
              </thead>
              <tbody>
                {recent.map((lead) => (
                  <tr key={lead.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-6 py-3 text-white font-medium">{lead.name}</td>
                    <td className="px-6 py-3">
                      {lead.phone ? (
                        <a href={`tel:${lead.phone}`} className="text-white/60 hover:text-brand-light transition-colors">
                          {lead.phone}
                        </a>
                      ) : (
                        <span className="text-white/20">—</span>
                      )}
                    </td>
                    <td className="px-6 py-3 text-white/40 max-w-xs hidden md:table-cell">
                      <span className="line-clamp-1">{lead.message || '—'}</span>
                    </td>
                    <td className="px-6 py-3">
                      <StatusBadge status={lead.status} />
                    </td>
                    <td className="px-6 py-3 text-right text-white/30">{timeAgo(lead.created_at)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )
}
