import { useState, useEffect, useRef } from 'react'
import { supabase } from '../../../supabase/client'

const CATEGORIES = ['general', 'ambience', 'member', 'equipment', 'event']

// Pull the storage object path back out of a Supabase public URL so we can
// remove the file when a photo is deleted (keeps storage from growing forever).
function pathFromUrl(url) {
  if (!url) return null
  // Supabase public URLs look like:
  //   https://<proj>.supabase.co/storage/v1/object/public/<bucket>/<path>
  const m = url.match(/\/object\/public\/([^/]+)\/(.+)$/)
  if (!m) return null
  return { bucket: m[1], path: decodeURIComponent(m[2]) }
}

export default function GalleryEditor() {
  const [photos, setPhotos] = useState([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [catFilter, setCatFilter] = useState('all')
  const [selected, setSelected] = useState(new Set())
  const inputRef = useRef()

  const fetchAll = () => supabase
    .from('gallery_items')
    .select('*')
    .order('sort_order')
    .order('created_at', { ascending: false })
    .then(({ data }) => setPhotos(data || []))
    .finally(() => setLoading(false))

  useEffect(() => { fetchAll() }, [])

  async function handleFiles(e) {
    const files = Array.from(e.target.files || [])
    if (!files.length) return
    setUploading(true)
    // Compute starting sort_order so new uploads land at the end.
    const tail = photos.length
    await Promise.all(
      files.map(async (file, i) => {
        const ext = file.name.split('.').pop()
        const path = `gallery/${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`
        const { data, error } = await supabase.storage.from('media').upload(path, file, { upsert: true })
        if (!error) {
          const { data: { publicUrl } } = supabase.storage.from('media').getPublicUrl(data.path)
          await supabase.from('gallery_items').insert({
            image_url: publicUrl,
            category: 'general',
            sort_order: tail + i,
          })
        }
      })
    )
    setUploading(false)
    fetchAll()
    e.target.value = ''
  }

  async function updatePhoto(id, field, value) {
    await supabase.from('gallery_items').update({ [field]: value }).eq('id', id)
    setPhotos((p) => p.map((ph) => (ph.id === id ? { ...ph, [field]: value } : ph)))
  }

  async function deletePhoto(id) {
    if (!window.confirm('Remove this photo?')) return
    const photo = photos.find((p) => p.id === id)
    await supabase.from('gallery_items').delete().eq('id', id)
    // Best-effort: remove the underlying file too.
    const ref = pathFromUrl(photo?.image_url)
    if (ref) supabase.storage.from(ref.bucket).remove([ref.path]).catch(() => {})
    setPhotos((p) => p.filter((ph) => ph.id !== id))
    setSelected((s) => { const n = new Set(s); n.delete(id); return n })
  }

  async function deleteSelected() {
    if (!selected.size) return
    if (!window.confirm(`Remove ${selected.size} selected photo${selected.size > 1 ? 's' : ''}?`)) return
    const ids = Array.from(selected)
    const toRemove = photos.filter((p) => selected.has(p.id))
    await supabase.from('gallery_items').delete().in('id', ids)
    // Best-effort: clean up storage objects.
    const refs = toRemove.map((p) => pathFromUrl(p.image_url)).filter(Boolean)
    const byBucket = refs.reduce((acc, r) => {
      (acc[r.bucket] ||= []).push(r.path)
      return acc
    }, {})
    Object.entries(byBucket).forEach(([bucket, paths]) => {
      supabase.storage.from(bucket).remove(paths).catch(() => {})
    })
    setPhotos((p) => p.filter((ph) => !selected.has(ph.id)))
    setSelected(new Set())
  }

  // Move a photo up/down by swapping sort_order with its neighbour in the
  // currently-visible (filtered) list. We persist both sides of the swap.
  async function move(id, dir) {
    const list = [...filtered]
    const idx = list.findIndex((p) => p.id === id)
    const swap = list[idx + dir]
    if (!swap) return
    const me = list[idx]
    const a = me.sort_order ?? idx
    const b = swap.sort_order ?? (idx + dir)
    await Promise.all([
      supabase.from('gallery_items').update({ sort_order: b }).eq('id', me.id),
      supabase.from('gallery_items').update({ sort_order: a }).eq('id', swap.id),
    ])
    fetchAll()
  }

  function toggleSelect(id) {
    setSelected((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  const filtered = catFilter === 'all' ? photos : photos.filter((p) => p.category === catFilter)
  const allSelected = filtered.length > 0 && filtered.every((p) => selected.has(p.id))

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6 flex-wrap gap-3">
        <div>
          <p className="section-eyebrow text-left mb-1">Content</p>
          <h1 className="text-2xl font-semibold text-white">Gallery</h1>
          <p className="text-white/40 text-sm mt-1">
            {photos.length} photo{photos.length === 1 ? '' : 's'} total
            {catFilter !== 'all' && ` · ${filtered.length} in ${catFilter}`}
          </p>
        </div>
        <div className="flex items-center gap-2">
          {selected.size > 0 && (
            <button
              onClick={deleteSelected}
              className="button-ghost text-sm flex items-center gap-2 text-brand-light border-brand/40 hover:bg-brand/10"
            >
              <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.8" stroke="currentColor" className="w-4 h-4">
                <path strokeLinecap="round" strokeLinejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
              </svg>
              Delete {selected.size}
            </button>
          )}
          <button
            onClick={() => inputRef.current?.click()}
            disabled={uploading}
            className="button flex items-center gap-2 disabled:opacity-60"
          >
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="currentColor" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5m-13.5-9L12 3m0 0 4.5 4.5M12 3v13.5" />
            </svg>
            {uploading ? 'Uploading…' : 'Upload Photos'}
          </button>
          <input ref={inputRef} type="file" multiple accept="image/*" onChange={handleFiles} className="hidden" />
        </div>
      </div>

      {/* Category filter */}
      <div className="flex items-center gap-3 flex-wrap mb-6">
        <div className="flex gap-1 p-1 bg-white/5 rounded-xl w-fit">
          {['all', ...CATEGORIES].map((c) => (
            <button
              key={c}
              onClick={() => setCatFilter(c)}
              className={`px-3 py-1.5 rounded-lg text-sm font-medium capitalize transition-all duration-150 ${
                catFilter === c ? 'bg-white/10 text-white' : 'text-white/40 hover:text-white'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
        {filtered.length > 0 && (
          <button
            onClick={() =>
              setSelected((s) => {
                if (allSelected) {
                  const n = new Set(s)
                  filtered.forEach((p) => n.delete(p.id))
                  return n
                }
                const n = new Set(s)
                filtered.forEach((p) => n.add(p.id))
                return n
              })
            }
            className="text-xs text-white/40 hover:text-white transition-colors px-2"
          >
            {allSelected ? 'Clear selection' : 'Select all'}
          </button>
        )}
      </div>

      {loading ? (
        <p className="text-white/30 text-sm">Loading…</p>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {filtered.map((photo, i) => {
            const isSelected = selected.has(photo.id)
            return (
              <div
                key={photo.id}
                className={`group relative rounded-xl overflow-hidden border aspect-square transition-all ${
                  isSelected ? 'border-brand ring-2 ring-brand/40' : 'border-white/10'
                }`}
              >
                <img src={photo.image_url} alt="" className="w-full h-full object-cover" />

                {/* Select checkbox — always visible top-left */}
                <button
                  onClick={(e) => { e.stopPropagation(); toggleSelect(photo.id) }}
                  aria-label={isSelected ? 'Deselect' : 'Select'}
                  className={`absolute top-2 left-2 w-6 h-6 rounded-md flex items-center justify-center transition-all ${
                    isSelected
                      ? 'bg-brand text-white'
                      : 'bg-black/50 text-transparent border border-white/40 hover:text-white/60 group-hover:text-white/80'
                  }`}
                >
                  <svg fill="none" viewBox="0 0 24 24" strokeWidth="3" stroke="currentColor" className="w-3.5 h-3.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                </button>

                {/* Reorder buttons — top-right, on hover */}
                <div className="absolute top-2 right-2 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                  <button
                    onClick={() => move(photo.id, -1)}
                    disabled={i === 0}
                    aria-label="Move left"
                    className="w-6 h-6 rounded-md bg-black/70 text-white/80 flex items-center justify-center hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m15 19-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={() => move(photo.id, +1)}
                    disabled={i === filtered.length - 1}
                    aria-label="Move right"
                    className="w-6 h-6 rounded-md bg-black/70 text-white/80 flex items-center justify-center hover:bg-black/90 disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <svg fill="none" viewBox="0 0 24 24" strokeWidth="2.2" stroke="currentColor" className="w-3.5 h-3.5">
                      <path strokeLinecap="round" strokeLinejoin="round" d="m9 5 7 7-7 7" />
                    </svg>
                  </button>
                </div>

                {/* Hover overlay with category/caption/delete */}
                <div className="absolute inset-0 bg-black/70 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-2 gap-1.5">
                  <select
                    value={photo.category}
                    onChange={(e) => updatePhoto(photo.id, 'category', e.target.value)}
                    className="w-full bg-white/10 text-white text-xs rounded-lg p-1.5 border border-white/20 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  >
                    {CATEGORIES.map((c) => (
                      <option key={c} value={c}>{c}</option>
                    ))}
                  </select>
                  <input
                    type="text"
                    value={photo.caption || ''}
                    onChange={(e) => updatePhoto(photo.id, 'caption', e.target.value)}
                    placeholder="Caption…"
                    className="w-full bg-white/10 text-white text-xs rounded-lg p-1.5 border border-white/20 placeholder:text-white/30 focus:outline-none"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <button
                    onClick={() => deletePhoto(photo.id)}
                    className="w-full text-xs text-brand-light bg-brand/20 rounded-lg p-1.5 hover:bg-brand/30 transition-colors"
                  >
                    Remove
                  </button>
                </div>
              </div>
            )
          })}
          {filtered.length === 0 && (
            <div className="col-span-full py-16 text-center text-white/30 text-sm">
              No photos yet — click Upload Photos to add some.
            </div>
          )}
        </div>
      )}
    </div>
  )
}
