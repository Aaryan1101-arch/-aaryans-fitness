import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const BLANK = { name: '', rating: 5, review: '', photo_url: '', is_featured: true, sort_order: 0 }

function ReviewModal({ review, onSave, onClose }) {
  const [form, setForm] = useState({ ...BLANK, ...review })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (review?.id) await supabase.from('reviews').update(form).eq('id', review.id)
    else await supabase.from('reviews').insert(form)
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{review?.id ? 'Edit Review' : 'Add Review'}</h2>
          <button onClick={onClose} className="icon-button"><svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Reviewer Name</label>
            <input required type="text" value={form.name} onChange={e => set('name', e.target.value)}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-2">Rating</label>
            <div className="flex gap-1">
              {[1,2,3,4,5].map(n => (
                <button key={n} type="button" onClick={() => set('rating', n)}
                  className={`text-2xl transition-opacity ${n <= form.rating ? 'opacity-100' : 'opacity-20'}`}>⭐</button>
              ))}
            </div>
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Review Text</label>
            <textarea rows={4} required value={form.review} onChange={e => set('review', e.target.value)}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand resize-none transition-all" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Photo (optional)</label>
            <ImageUpload value={form.photo_url || ''} onChange={v => set('photo_url', v)} folder="reviews" />
          </div>
          <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
            <input type="checkbox" checked={form.is_featured} onChange={e => set('is_featured', e.target.checked)} className="accent-brand" />
            Show on website
          </label>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="button flex-1 justify-center disabled:opacity-60">{saving ? 'Saving…' : 'Save Review'}</button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function ReviewsEditor() {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetch = () => supabase.from('reviews').select('*').order('sort_order')
    .then(({ data }) => setReviews(data || [])).finally(() => setLoading(false))

  useEffect(() => { fetch() }, [])

  async function del(id) {
    if (!window.confirm('Delete this review?')) return
    await supabase.from('reviews').delete().eq('id', id)
    fetch()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Reviews</h1>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Review
        </button>
      </div>

      {loading ? <p className="text-white/30 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {reviews.map(r => (
            <div key={r.id} className="glass-card p-4 flex items-start gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{r.name}</p>
                  <span className="text-yellow-400 text-xs">{'★'.repeat(r.rating)}</span>
                  {!r.is_featured && <span className="text-[10px] text-white/30 bg-white/5 px-1.5 py-0.5 rounded">hidden</span>}
                </div>
                <p className="text-white/40 text-sm line-clamp-2">{r.review}</p>
              </div>
              <div className="flex gap-2 flex-shrink-0">
                <button onClick={() => { setEditing(r); setShowModal(true) }} className="button-ghost text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => del(r.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2">Delete</button>
              </div>
            </div>
          ))}
          {reviews.length === 0 && <p className="text-white/30 text-sm text-center py-8">No reviews yet.</p>}
        </div>
      )}

      {showModal && <ReviewModal review={editing} onSave={() => { setShowModal(false); fetch() }} onClose={() => setShowModal(false)} />}
    </div>
  )
}
