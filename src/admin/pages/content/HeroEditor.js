import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

export default function HeroEditor() {
  const [form, setForm] = useState({ why_us_items: [{title:''},{title:''},{title:''},{title:''}] })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('hero_section').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setForm(data) })
      .finally(() => setLoading(false))
  }, [])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  function setWhyUs(i, field, val) {
    setForm(p => {
      const items = [...(p.why_us_items || [])]
      items[i] = { ...items[i], [field]: val }
      return { ...p, why_us_items: items }
    })
  }

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('hero_section').upsert({ ...form, id: 1, updated_at: new Date().toISOString() })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <div className="p-8 text-white/30 text-sm">Loading…</div>

  return (
    <div className="p-8 max-w-2xl">
      <p className="section-eyebrow text-left mb-1">Content</p>
      <h1 className="text-2xl font-semibold text-white mb-8">Hero Section</h1>

      <form onSubmit={handleSave} className="space-y-6">
        <div className="glass-card p-6 space-y-4">
          <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold">Main Text</h2>
          {[
            { key: 'headline', label: 'Headline' },
            { key: 'subheading', label: 'Subheading' },
            { key: 'cta_label', label: 'CTA Button Text' },
            { key: 'tagline1', label: 'Tagline 1' },
            { key: 'tagline2', label: 'Tagline 2' },
          ].map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-white/40 mb-1.5">{label}</label>
              <input type="text" value={form[key] || ''} onChange={e => set(key, e.target.value)}
                className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
            </div>
          ))}
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold">Background Image</h2>
          <ImageUpload value={form.bg_image_url || ''} onChange={v => set('bg_image_url', v)} folder="hero" />
          <p className="text-white/20 text-xs">Recommended: 1920×1080px JPG. Leave blank to use the default.</p>
        </div>

        <div className="glass-card p-6 space-y-4">
          <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-2">
            {form.why_us_title || 'Why Choose Us?'} — Cards
          </h2>
          <div>
            <label className="block text-xs font-medium text-white/40 mb-1.5">Section Title</label>
            <input type="text" value={form.why_us_title || ''} onChange={e => set('why_us_title', e.target.value)}
              className="block w-full p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all" />
          </div>
          <div className="grid grid-cols-2 gap-4 mt-2">
            {(form.why_us_items || []).map((item, i) => (
              <div key={i} className="space-y-2">
                <label className="block text-xs text-white/30">Card {i + 1} — Title</label>
                <input type="text" value={item.title || ''} onChange={e => setWhyUs(i, 'title', e.target.value)}
                  placeholder={['Modern Equipment','Healthy Nutrition','Expert Training','Tailored Package'][i]}
                  className="block w-full p-2 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand transition-all" />
                <ImageUpload value={item.icon_url || ''} onChange={v => setWhyUs(i, 'icon_url', v)} folder="hero/icons" />
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="button disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Hero'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
        </div>
      </form>
    </div>
  )
}
