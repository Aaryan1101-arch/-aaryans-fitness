import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const BLANK = { name: '', role: '', bio: '', photo_url: '', sort_order: 0, is_active: true }

function MemberModal({ member, onSave, onClose }) {
  const [form, setForm] = useState({ ...BLANK, ...member })
  const [saving, setSaving] = useState(false)
  const set = (k, v) => setForm(p => ({ ...p, [k]: v }))

  async function handleSubmit(e) {
    e.preventDefault()
    setSaving(true)
    if (member?.id) await supabase.from('team_members').update(form).eq('id', member.id)
    else await supabase.from('team_members').insert(form)
    setSaving(false)
    onSave()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ background: 'rgba(0,0,0,0.75)', backdropFilter: 'blur(4px)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="glass-card w-full max-w-md p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-white font-semibold">{member?.id ? 'Edit Member' : 'Add Team Member'}</h2>
          <button onClick={onClose} className="icon-button"><svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" /></svg></button>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-3">
            {[{ k:'name',label:'Name' },{ k:'role',label:'Role / Title' }].map(({ k, label }) => (
              <div key={k}>
                <label className="block text-xs text-white/40 mb-1.5">{label}</label>
                <input required={k === 'name'} type="text" value={form[k] || ''} onChange={e => set(k, e.target.value)}
                  className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
              </div>
            ))}
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Bio (optional)</label>
            <textarea rows={2} value={form.bio || ''} onChange={e => set('bio', e.target.value)}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand resize-none transition-all" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Photo</label>
            <ImageUpload value={form.photo_url || ''} onChange={v => set('photo_url', v)} folder="team" />
          </div>
          <div>
            <label className="block text-xs text-white/40 mb-1.5">Display Order</label>
            <input type="number" value={form.sort_order || 0} onChange={e => set('sort_order', Number(e.target.value))}
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

export default function TeamEditor() {
  const [team, setTeam] = useState([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(null)
  const [showModal, setShowModal] = useState(false)

  const fetch = () => supabase.from('team_members').select('*').order('sort_order')
    .then(({ data }) => setTeam(data || [])).finally(() => setLoading(false))

  useEffect(() => { fetch() }, [])

  async function del(id) {
    if (!window.confirm('Remove this team member?')) return
    await supabase.from('team_members').delete().eq('id', id)
    fetch()
  }

  return (
    <div className="p-8 max-w-2xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Team</h1>
        </div>
        <button onClick={() => { setEditing(null); setShowModal(true) }} className="button flex items-center gap-2">
          <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-4 h-4"><path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" /></svg>
          Add Member
        </button>
      </div>

      {loading ? <p className="text-white/30 text-sm">Loading…</p> : (
        <div className="space-y-3">
          {team.map(m => (
            <div key={m.id} className="glass-card p-4 flex items-center gap-4">
              {m.photo_url
                ? <img src={m.photo_url} alt="" className="w-12 h-12 rounded-full object-cover flex-shrink-0 border border-white/10" />
                : <div className="w-12 h-12 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-lg font-bold flex-shrink-0">{m.name[0]}</div>
              }
              <div className="flex-1">
                <p className="text-white font-medium">{m.name}</p>
                <p className="text-white/40 text-sm">{m.role}</p>
              </div>
              <div className="flex gap-2">
                <button onClick={() => { setEditing(m); setShowModal(true) }} className="button-ghost text-xs px-3 py-1.5">Edit</button>
                <button onClick={() => del(m.id)} className="text-xs text-white/30 hover:text-brand-light transition-colors px-2">Delete</button>
              </div>
            </div>
          ))}
          {team.length === 0 && <p className="text-white/30 text-sm text-center py-8">No team members yet.</p>}
        </div>
      )}

      {showModal && <MemberModal member={editing} onSave={() => { setShowModal(false); fetch() }} onClose={() => setShowModal(false)} />}
    </div>
  )
}
