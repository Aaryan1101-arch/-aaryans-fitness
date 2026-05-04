import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const BLANK = { title: '', image_url: '', morning_hours: '7 AM to 9 AM', evening_hours: '6 PM to 8 PM', sort_order: 0, is_active: true }

function ServiceModal({ service, onSave, onClose }) {
  const [form, setForm] = useState({ ...BLANK, ...service })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (service?.id) await supabase.from('services').update(form).eq('id', service.id)
    else await supabase.from('services').insert(form)
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{service?.id ? 'Edit Service' : 'Add Service'}</h2>
          <button onClick={onClose} className="icon-button"><svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Service Title</label>
            <input required type="text" value={form.title} onChange={e => set('title', e.target.value)}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Morning Hours</label>
              <input type="text" value={form.morning_hours} onChange={e => set('morning_hours', e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Evening Hours</label>
              <input type="text" value={form.evening_hours} onChange={e => set('evening_hours', e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Image</label>
            <ImageUpload value={form.image_url} onChange={v => set('image_url', v)} folder="services" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Display Order</label>
            <input type="number" value={form.sort_order} onChange={e => set('sort_order', Number(e.target.value))}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="button flex-1 justify-center disabled:opacity-60">{saving ? 'Saving…' : 'Save'}</button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ServicesEditor() {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetch = () => supabase.from('services').select('*').order('sort_order')
    .then(({ data }) => setServices(data || [])).finally(() => setLoading(false))

  useEffect(() => { fetch() }, [])

  async function del(id) {
    if (!window.confirm('Delete this service?')) return
    await supabase.from('services').delete().eq('id', id)
    fetch()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Services</h1>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Service
        </button>
      </div>

      {loading ? <p className="text-white/30 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {services.map(s => (
            <div key={s.id} className="glass-card p-4 flex items-center gap-4">
              {s.image_url && <img src={s.image_url} alt="" className="w-12 h-12 rounded-lg object-cover flex-shrink-0" />}
              {!s.image_url && <div className="w-12 h-12 rounded-lg bg-white/5 flex-shrink-0" />}
              <div className="flex-1">
                <p className="text-white font-medium">{s.title}</p>
                <p className="text-white/30 text-xs mt-0.5">{s.morning_hours} · {s.evening_hours}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(s); setShowModal(true) }} className="button-ghost text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => del(s.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && <ServiceModal service={editing} onSave={() => { setShowModal(false); fetch() }} onClose={() => setShowModal(false)} />}
    </div>
  )
}
