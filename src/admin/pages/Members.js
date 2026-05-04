import { useState } from 'react'
import { useMembers } from '../hooks/useMembers'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const BLANK = { name: '', phone: '', email: '', joined_on: new Date().toISOString().split('T')[0], status: 'active', notes: '' }

function timeAgo(dateStr) {
  if (!dateStr) return '—'
  const d = new Date(dateStr)
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
}

function ActiveSub({ member }) {
  const sub = member.subscriptions?.find((s) => s.status === 'active')
  if (!sub) return <span className="text-white/20">—</span>
  const daysLeft = Math.ceil((new Date(sub.end_date) - new Date()) / 86400000)
  return (
    <div>
      <p className="text-white/70 text-sm">{sub.plan_name}</p>
      <p className={`text-xs ${daysLeft <= 7 ? 'text-brand-light' : 'text-white/30'}`}>
        {daysLeft > 0 ? `${daysLeft}d left` : 'Expired'}
      </p>
    </div>
  )
}

export default function Members() {
  const { members, loading, error, stats, createMember } = useMembers()
  const [showModal, setShowModal] = useState(false)
  const [form, setForm] = useState(BLANK)
  const [saving, setSaving] = useState(false)
  const [formError, setFormError] = useState('')
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const filtered = members.filter((m) => {
    const q = search.toLowerCase()
    const matchSearch = !q || m.name?.toLowerCase().includes(q) || m.phone?.includes(q) || m.email?.toLowerCase().includes(q)
    const matchStatus = statusFilter === 'all' || m.status === statusFilter
    return matchSearch && matchStatus
  })

  async function handleCreate(e) {
    e.preventDefault()
    setFormError('')
    setSaving(true)
    try {
      await createMember({ ...form })
      setShowModal(false)
      setForm(BLANK)
    } catch (err) {
      setFormError(err.message || 'Could not save member.')
    }
    setSaving(false)
  }

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-eyebrow text-left mb-1">Directory</p>
          <h1 className="text-2xl font-semibold text-white">
            Members
            <span className="ml-3 text-sm bg-white/10 text-white/60 px-2.5 py-0.5 rounded-full font-medium">
              {stats.active} active
            </span>
          </h1>
        </div>
        <button onClick={() => setShowModal(true)} className="button flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Member
        </button>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl flex-shrink-0">
          {['all', 'active', 'paused', 'expired', 'cancelled'].map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize whitespace-nowrap transition-all duration-150 ${
                statusFilter === s ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {s}
            </button>
          ))}
        </div>
        <div className="relative flex-1">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor"
            className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-white/30 pointer-events-none">
            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
          </svg>
          <input
            type="text"
            placeholder="Search by name, phone, email…"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder:text-white/25 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all duration-200"
          />
        </div>
      </div>

      {/* Stats bar */}
      {stats.expiringSoon > 0 && (
        <div className="mb-4 px-4 py-3 rounded-xl bg-brand/10 border border-brand/20 flex items-center gap-3">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4 text-brand-light flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
          </svg>
          <p className="text-sm text-brand-light">
            <strong>{stats.expiringSoon}</strong> member{stats.expiringSoon > 1 ? 's' : ''} expiring within 7 days
          </p>
        </div>
      )}

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {error ? (
          <p className="p-8 text-center text-brand-light text-sm">{error}</p>
        ) : loading ? (
          <p className="p-8 text-center text-white/30 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search || statusFilter !== 'all' ? 'No members match that filter' : 'No members yet'}
            sub={!search && statusFilter === 'all' ? 'Click "Add Member" to register your first member.' : undefined}
            action={!search && statusFilter === 'all' && (
              <button onClick={() => setShowModal(true)} className="button">Add First Member</button>
            )}
            icon={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Member</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden md:table-cell">Plan</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Joined</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((m) => (
                  <tr key={m.id} className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors">
                    <td className="px-5 py-3.5">
                      <p className="text-white font-medium">{m.name}</p>
                      {m.email && <p className="text-xs text-white/30 mt-0.5">{m.email}</p>}
                    </td>
                    <td className="px-5 py-3.5 hidden sm:table-cell">
                      {m.phone ? (
                        <a href={`tel:${m.phone}`} className="text-white/60 hover:text-brand-light transition-colors">
                          {m.phone}
                        </a>
                      ) : <span className="text-white/20">—</span>}
                    </td>
                    <td className="px-5 py-3.5 hidden md:table-cell">
                      <ActiveSub member={m} />
                    </td>
                    <td className="px-5 py-3.5">
                      <StatusBadge status={m.status} type="member" />
                    </td>
                    <td className="px-5 py-3.5 hidden lg:table-cell text-white/40">
                      {timeAgo(m.joined_on)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Add Member Modal */}
      {showModal && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
          onClick={(e) => { if (e.target === e.currentTarget) setShowModal(false) }}
        >
          <div className="glass-card w-full max-w-md p-6">
            <div className="flex items-center justify-between mb-5">
              <h2 className="text-white font-semibold text-lg">Add Member</h2>
              <button onClick={() => setShowModal(false)} className="icon-button">
                <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <form onSubmit={handleCreate} className="space-y-4">
              {[
                { label: 'Full Name', key: 'name', required: true, placeholder: 'Ram Bahadur' },
                { label: 'Phone', key: 'phone', required: true, placeholder: '+977 98…' },
                { label: 'Email', key: 'email', type: 'email', placeholder: 'ram@example.com' },
                { label: 'Joined On', key: 'joined_on', type: 'date' },
              ].map(({ label, key, required, placeholder, type = 'text' }) => (
                <div key={key}>
                  <label className="block text-xs font-medium text-white/40 mb-1.5">{label}</label>
                  <input
                    type={type}
                    required={required}
                    value={form[key]}
                    onChange={(e) => setForm((p) => ({ ...p, [key]: e.target.value }))}
                    placeholder={placeholder}
                    className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg placeholder:text-white/20 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all text-sm"
                  />
                </div>
              ))}

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Status</label>
                <select
                  value={form.status}
                  onChange={(e) => setForm((p) => ({ ...p, status: e.target.value }))}
                  className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg focus:outline-none focus:border-brand text-sm"
                >
                  <option value="active">Active</option>
                  <option value="paused">Paused</option>
                  <option value="cancelled">Cancelled</option>
                  <option value="expired">Expired</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-white/40 mb-1.5">Notes (optional)</label>
                <textarea
                  value={form.notes}
                  onChange={(e) => setForm((p) => ({ ...p, notes: e.target.value }))}
                  rows={2}
                  placeholder="Any notes about this member…"
                  className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg placeholder:text-white/20 focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 text-sm resize-none"
                />
              </div>

              {formError && <p className="text-brand-light text-sm">{formError}</p>}

              <div className="flex gap-3 pt-1">
                <button type="submit" disabled={saving} className="button flex-1 justify-center disabled:opacity-60">
                  {saving ? 'Saving…' : 'Add Member'}
                </button>
                <button type="button" onClick={() => setShowModal(false)} className="button-ghost px-4">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
