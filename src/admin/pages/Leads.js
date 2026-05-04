import { useState, useMemo, Fragment } from 'react'
import { useLeads } from '../hooks/useLeads'
import StatusBadge from '../components/StatusBadge'
import EmptyState from '../components/EmptyState'

const STATUSES = ['new', 'contacted', 'trialed', 'converted', 'lost']
const STATUS_ORDER = { new: 0, contacted: 1, trialed: 2, converted: 3, lost: 4 }

function timeAgo(dateStr) {
  const diff = Date.now() - new Date(dateStr)
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  const d = Math.floor(h / 24)
  if (d === 1) return 'yesterday'
  const opts = { month: 'short', day: 'numeric' }
  return new Date(dateStr).toLocaleDateString('en-US', opts)
}

function cycleStatus(current) {
  const idx = STATUS_ORDER[current] ?? 0
  return STATUSES[(idx + 1) % STATUSES.length]
}

export default function Leads() {
  const { leads, loading, error, stats, updateStatus, updateNotes } = useLeads()
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [expanded, setExpanded] = useState(null)
  const [editingNote, setEditingNote] = useState(null)
  const [noteText, setNoteText] = useState('')
  const [saving, setSaving] = useState(null)

  const filtered = useMemo(() => {
    let list = leads
    if (filter !== 'all') list = list.filter((l) => l.status === filter)
    if (search.trim()) {
      const q = search.toLowerCase()
      list = list.filter(
        (l) =>
          l.name?.toLowerCase().includes(q) ||
          l.phone?.toLowerCase().includes(q) ||
          l.email?.toLowerCase().includes(q) ||
          l.message?.toLowerCase().includes(q)
      )
    }
    return list
  }, [leads, filter, search])

  async function handleStatusClick(e, lead) {
    e.stopPropagation()
    const next = cycleStatus(lead.status)
    setSaving(lead.id)
    try { await updateStatus(lead.id, next) } catch {}
    setSaving(null)
  }

  async function handleSaveNote(id) {
    setSaving(id)
    try {
      await updateNotes(id, noteText)
      setEditingNote(null)
    } catch {}
    setSaving(null)
  }

  const tabs = [
    { key: 'all', label: 'All', count: leads.length },
    ...STATUSES.map((s) => ({ key: s, label: s.charAt(0).toUpperCase() + s.slice(1), count: stats.byStatus[s] || 0 })),
  ]

  return (
    <div className="p-8">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-eyebrow text-left mb-1">Inbox</p>
          <h1 className="text-2xl font-semibold text-white">
            Leads
            {stats.new > 0 && (
              <span className="ml-3 text-sm bg-brand/20 text-brand-light px-2.5 py-0.5 rounded-full font-medium">
                {stats.new} new
              </span>
            )}
          </h1>
        </div>
      </div>

      {/* Filters + search */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl overflow-x-auto no-scrollbar flex-shrink-0">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setFilter(tab.key)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap transition-all duration-150 ${
                filter === tab.key
                  ? 'bg-white/10 text-white'
                  : 'text-white/40 hover:text-white'
              }`}
            >
              {tab.label}
              {tab.count > 0 && (
                <span className={`ml-1.5 text-xs ${filter === tab.key ? 'text-white/60' : 'text-white/20'}`}>
                  {tab.count}
                </span>
              )}
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

      {/* Table */}
      <div className="glass-card overflow-hidden">
        {error ? (
          <p className="p-8 text-center text-brand-light text-sm">{error}</p>
        ) : loading ? (
          <p className="p-8 text-center text-white/30 text-sm">Loading…</p>
        ) : filtered.length === 0 ? (
          <EmptyState
            title={search ? 'No results for that search' : `No ${filter === 'all' ? '' : filter + ' '}leads yet`}
            sub={filter === 'all' && !search ? 'Leads will appear here when someone submits the contact form.' : undefined}
            icon={
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
              </svg>
            }
          />
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-white/[0.07]">
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Name</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden sm:table-cell">Phone</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider hidden lg:table-cell">Message</th>
                  <th className="text-left px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">Status</th>
                  <th className="text-right px-5 py-3 text-white/30 font-medium text-xs uppercase tracking-wider">When</th>
                  <th className="px-3 py-3" />
                </tr>
              </thead>
              <tbody>
                {filtered.map((lead) => (
                  <Fragment key={lead.id}>
                    <tr
                      onClick={() => setExpanded((p) => (p === lead.id ? null : lead.id))}
                      className="border-b border-white/[0.04] hover:bg-white/[0.02] transition-colors cursor-pointer"
                    >
                      <td className="px-5 py-3.5">
                        <span className="text-white font-medium">{lead.name}</span>
                        {lead.email && (
                          <span className="block text-xs text-white/30 mt-0.5">{lead.email}</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 hidden sm:table-cell">
                        {lead.phone ? (
                          <a
                            href={`tel:${lead.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            className="text-white/60 hover:text-brand-light transition-colors"
                          >
                            {lead.phone}
                          </a>
                        ) : (
                          <span className="text-white/20">—</span>
                        )}
                      </td>
                      <td className="px-5 py-3.5 hidden lg:table-cell max-w-xs">
                        <span className="line-clamp-1 text-white/40">{lead.message || '—'}</span>
                      </td>
                      <td className="px-5 py-3.5">
                        <StatusBadge
                          status={saving === lead.id ? '…' : lead.status}
                          onClick={(e) => handleStatusClick(e, lead)}
                          className={saving === lead.id ? 'opacity-50' : ''}
                        />
                      </td>
                      <td className="px-5 py-3.5 text-right text-white/30 whitespace-nowrap">
                        {timeAgo(lead.created_at)}
                      </td>
                      <td className="px-3 py-3.5">
                        <svg
                          fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor"
                          className={`w-4 h-4 text-white/20 transition-transform duration-200 ${expanded === lead.id ? 'rotate-90' : ''}`}
                        >
                          <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                      </td>
                    </tr>

                    {/* Expanded row */}
                    {expanded === lead.id && (
                      <tr className="bg-white/[0.02] border-b border-white/[0.07]">
                        <td colSpan={6} className="px-5 py-4">
                          <div className="grid sm:grid-cols-2 gap-6">
                            <div>
                              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Full message</p>
                              <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap">
                                {lead.message || <span className="text-white/20">No message</span>}
                              </p>
                            </div>
                            <div>
                              <p className="text-xs text-white/30 uppercase tracking-wider mb-2">Notes</p>
                              {editingNote === lead.id ? (
                                <div>
                                  <textarea
                                    value={noteText}
                                    onChange={(e) => setNoteText(e.target.value)}
                                    rows={3}
                                    className="w-full p-2.5 bg-white/5 border border-white/10 rounded-lg text-sm text-white placeholder:text-white/20 focus:outline-none focus:border-brand resize-none"
                                    placeholder="Add a note…"
                                  />
                                  <div className="flex gap-2 mt-2">
                                    <button
                                      onClick={() => handleSaveNote(lead.id)}
                                      disabled={saving === lead.id}
                                      className="button text-sm py-1.5 disabled:opacity-60"
                                    >
                                      {saving === lead.id ? 'Saving…' : 'Save'}
                                    </button>
                                    <button
                                      onClick={() => setEditingNote(null)}
                                      className="button-ghost text-sm py-1.5"
                                    >
                                      Cancel
                                    </button>
                                  </div>
                                </div>
                              ) : (
                                <div>
                                  <p className="text-white/50 text-sm leading-relaxed whitespace-pre-wrap mb-2">
                                    {lead.notes || <span className="text-white/20">No notes yet</span>}
                                  </p>
                                  <button
                                    onClick={() => { setEditingNote(lead.id); setNoteText(lead.notes || '') }}
                                    className="text-xs text-brand-light hover:text-white transition-colors"
                                  >
                                    {lead.notes ? 'Edit note' : '+ Add note'}
                                  </button>
                                </div>
                              )}
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </Fragment>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      <p className="text-xs text-white/20 mt-3 text-center">
        Click a status badge to cycle it forward · Click a row to expand
      </p>
    </div>
  )
}
