import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'

const TONES = [
  { value: 'info',    label: 'Info',    color: 'bg-brand' },
  { value: 'success', label: 'Success', color: 'bg-emerald-600' },
  { value: 'warning', label: 'Warning', color: 'bg-amber-500' },
  { value: 'danger',  label: 'Urgent',  color: 'bg-red-600' },
]

const BLANK = {
  message: '',
  link_url: '',
  link_label: '',
  tone: 'info',
  starts_at: null,
  ends_at: null,
  sort_order: 0,
  is_active: true,
}

// Convert between Postgres timestamptz (ISO) and the value expected by
// <input type="datetime-local"> ("YYYY-MM-DDTHH:mm"). The input takes/returns
// local time, so we render in the admin's timezone — not UTC.
const pad = (n) => String(n).padStart(2, '0')
const isoToLocal = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const localToIso = (local) => (local ? new Date(local).toISOString() : null)

function NoticeModal({ notice, onSave, onClose }) {
  const [form, setForm] = useState({
    ...BLANK,
    ...notice,
    starts_at: isoToLocal(notice?.starts_at),
    ends_at:   isoToLocal(notice?.ends_at),
  })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const payload = {
      ...form,
      starts_at: localToIso(form.starts_at),
      ends_at:   localToIso(form.ends_at),
    }
    if (notice?.id) {
      await supabase.from('notices').update(payload).eq('id', notice.id)
    } else {
      await supabase.from('notices').insert(payload)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={(e) => { if (e.target === e.currentTarget) onClose() }}
    >
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{notice?.id ? 'Edit Notice' : 'Add Notice'}</h2>
          <button onClick={onClose} className="icon-button">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Message</label>
            <textarea
              required
              rows={3}
              value={form.message}
              onChange={(e) => set('message', e.target.value)}
              placeholder="e.g. Holiday hours: club opens at 9am on Saturday"
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Tone</label>
            <div className="grid grid-cols-4 gap-2">
              {TONES.map((t) => (
                <button
                  key={t.value}
                  type="button"
                  onClick={() => set('tone', t.value)}
                  className={`px-2 py-1.5 rounded-lg text-xs font-medium transition-all border ${
                    form.tone === t.value
                      ? `${t.color} text-white border-transparent`
                      : 'bg-white/5 text-white/60 border-white/10 hover:border-white/20'
                  }`}
                >
                  {t.label}
                </button>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Link URL (optional)</label>
              <input
                type="text"
                value={form.link_url || ''}
                onChange={(e) => set('link_url', e.target.value)}
                placeholder="https://… or #section"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Link Label</label>
              <input
                type="text"
                value={form.link_label || ''}
                onChange={(e) => set('link_label', e.target.value)}
                placeholder="See details"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Starts at (optional)</label>
              <input
                type="datetime-local"
                value={form.starts_at || ''}
                onChange={(e) => set('starts_at', e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Ends at (optional)</label>
              <input
                type="datetime-local"
                value={form.ends_at || ''}
                onChange={(e) => set('ends_at', e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="accent-brand"
              />
              Active
            </label>
            <div className="flex-1">
              <label className="block text-xs text-white/40 mb-1.5">Order</label>
              <input
                type="number"
                value={form.sort_order}
                onChange={(e) => set('sort_order', Number(e.target.value))}
                className="block w-full p-2 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="button flex-1 justify-center disabled:opacity-60">
              {saving ? 'Saving…' : 'Save Notice'}
            </button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function NoticesEditor() {
  const [notices, setNotices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchAll = () => supabase
    .from('notices')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })
    .then(({ data }) => setNotices(data || []))
    .finally(() => setLoading(false))

  useEffect(() => { fetchAll() }, [])

  async function del(id) {
    if (!window.confirm('Delete this notice?')) return
    await supabase.from('notices').delete().eq('id', id)
    fetchAll()
  }

  async function toggleActive(n) {
    await supabase.from('notices').update({ is_active: !n.is_active }).eq('id', n.id)
    fetchAll()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Notices</h1>
          <p className="text-white/40 text-sm mt-1">Short messages that appear in the top banner of the public site.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2 flex-shrink-0 ml-4">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Notice
        </button>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : notices.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/40 text-sm">No notices yet. Add one to display it on the site.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {notices.map((n) => {
            const tone = TONES.find((t) => t.value === n.tone) || TONES[0]
            return (
              <div key={n.id} className="glass-card p-4 flex items-start gap-4">
                <span className={`w-2 h-2 rounded-full ${tone.color} mt-2 flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white text-sm font-medium">{n.message}</p>
                    {!n.is_active && (
                      <span className="text-[10px] uppercase tracking-wider text-white/40 bg-white/5 px-2 py-0.5 rounded-full border border-white/10">
                        Inactive
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3 text-xs text-white/40 mt-1">
                    <span className="capitalize">{tone.label}</span>
                    {n.starts_at && <span>From {new Date(n.starts_at).toLocaleString()}</span>}
                    {n.ends_at &&   <span>Until {new Date(n.ends_at).toLocaleString()}</span>}
                    {n.link_url && <span className="text-brand-light truncate max-w-[200px]">→ {n.link_label || n.link_url}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(n)} className="button-ghost text-xs px-3 py-1">{n.is_active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => { setEditing(n); setShowModal(true) }} className="button-ghost text-xs px-3 py-1">Edit</button>
                  <button onClick={() => del(n.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2 py-1">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <NoticeModal notice={editing} onSave={() => { setShowModal(false); fetchAll() }} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
