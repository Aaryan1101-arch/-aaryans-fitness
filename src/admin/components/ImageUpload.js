import { useState } from 'react'
import { supabase } from '../../supabase/client'

export default function ImageUpload({ value, onChange, folder = 'general', className = '' }) {
  const [uploading, setUploading] = useState(false)
  const [error, setError] = useState('')

  async function handleFile(e) {
    const file = e.target.files?.[0]
    if (!file) return
    setError('')
    setUploading(true)
    const ext = file.name.split('.').pop()
    const path = `${folder}/${Date.now()}.${ext}`
    const { data, error: uploadErr } = await supabase.storage.from('media').upload(path, file, { upsert: true })
    if (uploadErr) {
      setError(uploadErr.message)
    } else {
      const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
      onChange(publicUrl)
    }
    setUploading(false)
  }

  return (
    <div className={`space-y-2 ${className}`}>
      {value && (
        <div className="relative group w-32 h-32 rounded-xl overflow-hidden border border-white/10">
          <img src={value} alt="" className="w-full h-full object-cover" />
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white/80 text-xs"
          >
            Remove
          </button>
        </div>
      )}
      <label className={`flex items-center gap-2 cursor-pointer button-ghost text-sm w-fit ${uploading ? 'opacity-60 pointer-events-none' : ''}`}>
        <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
          <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
        </svg>
        {uploading ? 'Uploading…' : value ? 'Change image' : 'Upload image'}
        <input type="file" accept="image/jpeg,image/png,image/webp,image/gif" onChange={handleFile} className="hidden" />
      </label>
      {error && <p className="text-brand-light text-xs">{error}</p>}
    </div>
  )
}
