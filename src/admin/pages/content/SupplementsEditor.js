import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const CATEGORIES = ['general', 'protein', 'pre-workout', 'creatine', 'vitamin']

const BLANK = {
  name: '',
  brand: '',
  category: 'general',
  description: '',
  serving_info: '',
  price: '',
  image_url: '',
  in_stock: true,
  is_featured: false,
  is_active: true,
  sort_order: 0,
}

function SupplementModal({ supplement, onSave, onClose }) {
  const [form, setForm] = useState({ ...BLANK, ...supplement })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm((p) => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (supplement?.id) {
      await supabase.from('supplements').update(form).eq('id', supplement.id)
    } else {
      await supabase.from('supplements').insert(form)
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
          <h2 className="text-white font-semibold">{supplement?.id ? 'Edit Supplement' : 'Add Supplement'}</h2>
          <button onClick={onClose} className="icon-button">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Product Name</label>
              <input
                required
                type="text"
                value={form.name}
                onChange={(e) => set('name', e.target.value)}
                placeholder="Whey Protein Isolate"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Brand</label>
              <input
                type="text"
                value={form.brand || ''}
                onChange={(e) => set('brand', e.target.value)}
                placeholder="Optimum Nutrition"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Category</label>
              <select
                value={form.category}
                onChange={(e) => set('category', e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              >
                {CATEGORIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs text-white/40 mb-1.5">Price</label>
              <input
                type="text"
                value={form.price || ''}
                onChange={(e) => set('price', e.target.value)}
                placeholder="RS 3,500"
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Serving info (optional)</label>
            <input
              type="text"
              value={form.serving_info || ''}
              onChange={(e) => set('serving_info', e.target.value)}
              placeholder="30g per scoop · 30 servings per tub"
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Description (optional)</label>
            <textarea
              rows={3}
              value={form.description || ''}
              onChange={(e) => set('description', e.target.value)}
              placeholder="Whey isolate sourced from grass-fed cows. 24g protein per serving…"
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand resize-none transition-all"
            />
          </div>

          <div>
            <label className="block text-xs text-white/40 mb-1.5">Image</label>
            <ImageUpload value={form.image_url} onChange={(v) => set('image_url', v)} folder="supplements" />
          </div>

          <div className="flex items-center gap-4 flex-wrap">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.in_stock}
                onChange={(e) => set('in_stock', e.target.checked)}
                className="accent-brand"
              />
              In stock
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => set('is_featured', e.target.checked)}
                className="accent-brand"
              />
              Featured
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
              {saving ? 'Saving…' : 'Save'}
            </button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function SupplementsEditor() {
  const [items, setItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)
  const [filter, setFilter] = useState('all')

  const fetchAll = () => supabase
    .from('supplements')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })
    .then(({ data }) => setItems(data || []))
    .finally(() => setLoading(false))

  useEffect(() => { fetchAll() }, [])

  async function del(id) {
    if (!window.confirm('Delete this supplement?')) return
    await supabase.from('supplements').delete().eq('id', id)
    fetchAll()
  }

  async function toggle(s, field) {
    await supabase.from('supplements').update({ [field]: !s[field] }).eq('id', s.id)
    fetchAll()
  }

  const filtered = filter === 'all' ? items : items.filter((s) => s.category === filter)

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Supplements</h1>
          <p className="text-white/40 text-sm mt-1">Catalog of supplements available at the club. Display only — no purchase flow.</p>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2 flex-shrink-0 ml-4">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
          </svg>
          Add Supplement
        </button>
      </div>

      <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit mb-6">
        {['all', ...CATEGORIES].map((c) => (
          <button
            key={c}
            onClick={() => setFilter(c)}
            className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${
              filter === c ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
            }`}
          >
            {c}
          </button>
        ))}
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : filtered.length === 0 ? (
        <div className="glass-card p-12 text-center">
          <p className="text-white/40 text-sm">
            {items.length === 0 ? 'No supplements yet. Add one to populate the catalog.' : 'No items in this category.'}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-3">
          {filtered.map((s) => (
            <div key={s.id} className="glass-card p-4 flex gap-3">
              {s.image_url ? (
                <img src={s.image_url} alt="" className="w-16 h-16 rounded-lg object-cover flex-shrink-0" />
              ) : (
                <div className="w-16 h-16 rounded-lg bg-white/5 flex items-center justify-center flex-shrink-0 text-white/30 text-[10px] uppercase tracking-wider">No img</div>
              )}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  {s.brand && <span className="text-[10px] uppercase tracking-widest text-white/40">{s.brand}</span>}
                  {s.is_featured && <span className="text-[10px] uppercase tracking-wider text-brand-light">★</span>}
                  {!s.is_active && <span className="text-[10px] uppercase tracking-wider text-white/40">Inactive</span>}
                  {!s.in_stock && <span className="text-[10px] uppercase tracking-wider text-amber-400">OOS</span>}
                </div>
                <p className="text-white font-medium truncate">{s.name}</p>
                <div className="flex justify-between items-center mt-1">
                  <p className="text-white/40 text-xs capitalize">{s.category}</p>
                  {s.price && <p className="text-brand-light text-sm font-semibold">{s.price}</p>}
                </div>
                <div className="flex gap-1 mt-2">
                  <button onClick={() => toggle(s, 'in_stock')} className="text-[10px] text-white/40 hover:text-white px-2 py-0.5 rounded bg-white/5">{s.in_stock ? 'Mark OOS' : 'In stock'}</button>
                  <button onClick={() => { setEditing(s); setShowModal(true) }} className="text-[10px] text-white/40 hover:text-white px-2 py-0.5 rounded bg-white/5">Edit</button>
                  <button onClick={() => del(s.id)} className="text-[10px] text-white/30 hover:text-brand-light px-2 py-0.5 rounded">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <SupplementModal supplement={editing} onSave={() => { setShowModal(false); fetchAll() }} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
