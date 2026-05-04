import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const BLANK = {
  title: '',
  subtitle: '',
  description: '',
  badge: '',
  image_url: '',
  cta_label: '',
  cta_url: '',
  starts_at: null,
  ends_at: null,
  is_featured: true,
  is_active: true,
  sort_order: 0,
}

// datetime-local takes local time. Render in the admin's timezone, not UTC.
const pad = (n) => String(n).padStart(2, '0')
const isoToLocal = (iso) => {
  if (!iso) return ''
  const d = new Date(iso)
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`
}
const localToIso = (local) => (local ? new Date(local).toISOString() : null)

function OfferModal({ offer, onSave, onClose }) {
  const [form, setForm] = useState({
    ...BLANK,
    ...offer,
    starts_at: isoToLocal(offer?.starts_at),
    ends_at:   isoToLocal(offer?.ends_at),
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
    if (offer?.id) {
      await supabase.from('offers').update(payload).eq('id', offer.id)
    } else {
      await supabase.from('offers').insert(payload)
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
      <div className="glass-card w-full max-w-lg p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{offer?.id ? 'Edit Offer' : 'Add Offer'}</h2>
          <button onClick={onClose} className="icon-button">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="col-span-2">
              <label className="block text-xs text-white/40 mb-1.5">Title</label>
              <input
                required
                type="text"
                value={form.title}
                onChange={(e) => set('title', e.target.value)}
                placeholder="New Year Sale"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Badge</label>
              <input
                type="text"
                value={form.badge || ''}
                onChange={(e) => set('badge', e.target.value)}
                placeholder="20% OFF"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Subtitle (optional)</label>
            <input
              type="text"
              value={form.subtitle || ''}
              onChange={(e) => set('subtitle', e.target.value)}
              placeholder="On all yearly memberships"
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Longer details about the offer…"
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Poster Image (optional)</label>
            <ImageUpload value={form.image_url} onChange={(v) => set('image_url', v)} folder="offers" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">CTA Label</label>
              <input
                type="text"
                value={form.cta_label || ''}
                onChange={(e) => set('cta_label', e.target.value)}
                placeholder="Claim now"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">CTA URL</label>
              <input
                type="text"
                value={form.cta_url || ''}
                onChange={(e) => set('cta_url', e.target.value)}
                placeholder="#contact or https://…"
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

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="accent-brand"
              />
              Featured (show in top banner)
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => set('is_active', e.target.checked)}
                className="accent-brand"
              />
              Active
            </label>
            <div className="flex-1 min-w-[100px]">
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
              {saving ? 'Saving…' : 'Save Offer'}
            </button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function OffersEditor() {
  const [offers, setOffers] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchAll = () => supabase
    .from('offers')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })
    .then(({ data }) => setOffers(data || []))
    .finally(() => setLoading(false))

  useEffect(() => { fetchAll() }, [])

  async function del(id) {
    if (!window.confirm('Delete this offer?')) return
    await supabase.from('offers').delete().eq('id', id)
    fetchAll()
  }

  async function toggleActive(o) {
    await supabase.from('offers').update({ is_active: !o.is_active }).eq('id', o.id)
    fetchAll()
  }

  function statusOf(o) {
    if (!o.is_active) return { label: 'Hidden', color: 'text-white/40' }
    const now = new Date()
    if (o.starts_at && new Date(o.starts_at) > now) return { label: 'Scheduled', color: 'text-amber-400' }
    if (o.ends_at && new Date(o.ends_at) < now) return { label: 'Ended', color: 'text-white/40' }
    return { label: 'Live', color: 'text-emerald-400' }
  }

  return (
    <div className="p-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Offers</h1>
          <p className="text-white/40 text-sm mt-1">Promotions shown in the top banner. Mark as featured to surface them.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2 flex-shrink-0 ml-4">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Offer
        </button>
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : offers.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/40 text-sm">No offers yet. Add one to display it on the site.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {offers.map((o) => {
            const status = statusOf(o)
            return (
              <div key={o.id} className="glass-card p-4 flex items-center gap-4">
                {o.image_url ? (
                  <img src={o.image_url} alt="" className="w-14 h-14 rounded-lg object-cover flex-shrink-0" />
                ) : (
                  <div className="w-14 h-14 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-white/30 text-[10px] uppercase tracking-wider">No image</div>
                )}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-white font-medium truncate">{o.title}</p>
                    {o.badge && <span className="text-[10px] font-bold uppercase tracking-widest bg-brand text-white rounded px-1.5 py-0.5">{o.badge}</span>}
                    {o.is_featured && <span className="text-[10px] uppercase tracking-wider text-brand-light">★ Featured</span>}
                    <span className={`text-[10px] uppercase tracking-wider ${status.color}`}>{status.label}</span>
                  </div>
                  {o.subtitle && <p className="text-white/50 text-xs mt-0.5 truncate">{o.subtitle}</p>}
                  <div className="flex flex-wrap gap-3 text-xs text-white/30 mt-1">
                    {o.starts_at && <span>From {new Date(o.starts_at).toLocaleDateString()}</span>}
                    {o.ends_at &&   <span>Until {new Date(o.ends_at).toLocaleDateString()}</span>}
                  </div>
                </div>
                <div className="flex flex-col gap-1.5 flex-shrink-0">
                  <button onClick={() => toggleActive(o)} className="button-ghost text-xs px-3 py-1">{o.is_active ? 'Hide' : 'Show'}</button>
                  <button onClick={() => { setEditing(o); setShowModal(true) }} className="button-ghost text-xs px-3 py-1">Edit</button>
                  <button onClick={() => del(o.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2 py-1">Delete</button>
                </div>
              </div>
            )
          })}
        </div>
      )}

      {showModal && (
        <OfferModal offer={editing} onSave={() => { setShowModal(false); fetchAll() }} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
