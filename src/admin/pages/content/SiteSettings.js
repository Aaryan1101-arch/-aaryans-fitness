import { useState, useEffect } from 'react'
import { supabase } from '../../../supabase/client'
import ImageUpload from '../../components/ImageUpload'

const FIELDS = [
  { section: 'Branding', fields: [
    { key: 'site_name', label: 'Site Name' },
    { key: 'tagline', label: 'Tagline' },
  ]},
  { section: 'Contact', fields: [
    { key: 'phone_primary', label: 'Primary Phone' },
    { key: 'phone_secondary', label: 'Secondary Phone' },
    { key: 'email', label: 'Email' },
    { key: 'address', label: 'Address' },
    { key: 'map_embed_url', label: 'Google Maps Embed URL', wide: true },
  ]},
  { section: 'Social', fields: [
    { key: 'facebook', label: 'Facebook URL' },
    { key: 'instagram', label: 'Instagram URL' },
    { key: 'whatsapp', label: 'WhatsApp Number' },
  ]},
  { section: 'Footer', fields: [
    { key: 'footer_copyright', label: 'Copyright Text' },
  ]},
]

export default function SiteSettings() {
  const [form, setForm] = useState({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)

  useEffect(() => {
    supabase.from('site_settings').select('*').eq('id', 1).single()
      .then(({ data }) => { if (data) setForm(data) })
      .finally(() => setLoading(false))
  }, [])

  const set = (key, val) => setForm(p => ({ ...p, [key]: val }))

  async function handleSave(e) {
    e.preventDefault()
    setSaving(true)
    await supabase.from('site_settings').upsert({ ...form, id: 1, updated_at: new Date().toISOString() })
    setSaving(false)
    setSaved(true)
    setTimeout(() => setSaved(false), 2500)
  }

  if (loading) return <div className="p-8 text-white/30 text-sm">Loading…</div>

  return (
    <div className="p-8 max-w-2xl">
      <p className="section-eyebrow text-left mb-1">Content</p>
      <h1 className="text-2xl font-semibold text-white mb-8">Site Settings</h1>

      <form onSubmit={handleSave} className="space-y-8">
        {FIELDS.map(({ section, fields }) => (
          <div key={section} className="glass-card p-6 space-y-4">
            <h2 className="text-white/50 text-xs uppercase tracking-widest font-semibold mb-4">{section}</h2>
            {section === 'Branding' && (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {[
                  { key: 'logo_url', label: 'Logo', folder: 'logos' },
                  { key: 'logo_stamp_url', label: 'Logo Stamp', folder: 'logos' },
                ].map(({ key, label, folder }) => (
                  <div key={key}>
                    <label className="block text-xs text-white/40 mb-2">{label}</label>
                    <ImageUpload value={form[key] || ''} onChange={v => set(key, v)} folder={folder} />
                  </div>
                ))}
              </div>
            )}
            {fields.map(({ key, label, wide }) => (
              <div key={key}>
                <label className="block text-xs font-medium text-white/40 mb-1.5">{label}</label>
                <input
                  type="text"
                  value={form[key] || ''}
                  onChange={e => set(key, e.target.value)}
                  className={`block p-2.5 text-white bg-white/5 border border-white/10 rounded-lg text-sm focus:outline-none focus:border-brand focus:ring-2 focus:ring-brand/20 transition-all ${wide ? 'w-full' : 'w-full'}`}
                />
              </div>
            ))}
          </div>
        ))}

        <div className="flex items-center gap-3">
          <button type="submit" disabled={saving} className="button disabled:opacity-60">
            {saving ? 'Saving…' : 'Save Settings'}
          </button>
          {saved && <span className="text-emerald-400 text-sm">Saved!</span>}
        </div>
      </form>
    </div>
  )
}
