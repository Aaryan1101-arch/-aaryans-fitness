import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import StatusBadge from '../../components/StatusBadge'

const BLANK = { name: '', price: '', is_popular: false, features: '', sort_order: 0, is_active: true }

function PlanModal({ plan, onSave, onClose }) {
  const [form, setForm] = useState({
    ...BLANK,
    ...plan,
    features: Array.isArray(plan?.features) ? plan.features.join('\n') : '',
  })
  const [saving, setSaving] = useState(false)

  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    const features = form.features.split('\n').map(f => f.trim()).filter(Boolean)
    const payload = { ...form, features }
    if (plan?.id) {
      await supabase.from('membership_plans').update(payload).eq('id', plan.id)
    } else {
      await supabase.from('membership_plans').insert(payload)
    }
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{plan?.id ? 'Edit Plan' : 'Add Plan'}</h2>
          <button onClick={onClose} className="icon-button"><svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          {[
            { k: 'name', label: 'Plan Name', placeholder: 'Bill Monthly' },
            { k: 'price', label: 'Price', placeholder: 'RS 3000' },
            { k: 'sort_order', label: 'Display Order', type: 'number' },
          ].map(({ k, label, placeholder, type = 'text' }) => (
            <div key={k}>
              <label className="block text-xs text-white/40 mb-1.5">{label}</label>
              <input type={type} required={k !== 'sort_order'} value={form[k] || ''} onChange={e => set(k, type === 'number' ? Number(e.target.value) : e.target.value)}
                placeholder={placeholder}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            </div>
          ))}
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Features (one per line)</label>
            <textarea rows={5} value={form.features} onChange={e => set('features', e.target.value)}
              placeholder={"Unlimited Gym Access\nAerobics\nKick Boxing"}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 resize-none transition-all" />
          </div>
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input type="checkbox" checked={form.is_popular} onChange={e => set('is_popular', e.target.checked)} className="accent-brand" />
              Mark as Popular
            </label>
            <label className="flex items-center gap-2 cursor-pointer text-sm text-white/60">
              <input type="checkbox" checked={form.is_active} onChange={e => set('is_active', e.target.checked)} className="accent-brand" />
              Active
            </label>
          </div>
          <div className="flex gap-3 pt-1">
            <button type="submit" disabled={saving} className="button flex-1 justify-center disabled:opacity-60">{saving ? 'Saving…' : 'Save Plan'}</button>
            <button type="button" onClick={onClose} className="button-ghost px-4">Cancel</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default function PlansEditor() {
  const [plans, setPlans] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetchPlans = () => {
    supabase.from('membership_plans').select('*').order('sort_order')
      .then(({ data }) => setPlans(data || []))
      .finally(() => setLoading(false))
  }

  useEffect(() => { fetchPlans() }, [])

  async function deletePlan(id) {
    if (!window.confirm('Delete this plan?')) return
    await supabase.from('membership_plans').delete().eq('id', id)
    fetchPlans()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Membership Plans</h1>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Plan
        </button>
      </div>

      {loading ? <p className="text-white/30 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {plans.map(plan => (
            <div key={plan.id} className="glass-card p-4 flex items-center gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-1">
                  <p className="text-white font-medium">{plan.name}</p>
                  {plan.is_popular && <StatusBadge status="converted" className="text-[10px]" />}
                  {!plan.is_active && <StatusBadge status="lost" className="text-[10px]" />}
                </div>
                <p className="text-brand-light text-sm font-semibold">{plan.price}</p>
                <p className="text-white/30 text-xs mt-0.5">{(plan.features || []).length} features · order #{plan.sort_order}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(plan); setShowModal(true) }} className="button-ghost text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => deletePlan(plan.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2">Delete</button>
              </div>
            </div>
          ))}
        </div>
      )}

      {showModal && (
        <PlanModal plan={editing} onSave={() => { setShowModal(false); fetchPlans() }} onClose={() => setShowModal(false)} />
      )}
    </div>
  )
}
