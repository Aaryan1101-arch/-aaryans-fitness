export default function StatCard({ label, value, sub, icon, accent = false }) {
  return (
    <div className={`glass-card p-6 ${accent ? 'border-brand/30 bg-brand/5' : ''}`}>
      <div className="flex items-start justify-between mb-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
          accent ? 'bg-brand/30 text-brand-light' : 'bg-white/10 text-white/60'
        }`}>
          {icon}
        </div>
      </div>
      <p className={`text-3xl font-bold mb-1 ${accent ? 'text-brand-light' : 'text-white'}`}>
        {value ?? '—'}
      </p>
      <p className="text-sm text-white/50">{label}</p>
      {sub && <p className="text-xs text-white/30 mt-1">{sub}</p>}
    </div>
  )
}
