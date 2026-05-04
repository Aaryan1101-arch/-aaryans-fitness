const LEAD_COLORS = {
  new:       'bg-blue-500/20 text-blue-300 border-blue-500/30',
  contacted: 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  trialed:   'bg-purple-500/20 text-purple-300 border-purple-500/30',
  converted: 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  lost:      'bg-white/10 text-white/40 border-white/10',
}

const MEMBER_COLORS = {
  active:    'bg-emerald-500/20 text-emerald-300 border-emerald-500/30',
  paused:    'bg-yellow-500/20 text-yellow-300 border-yellow-500/30',
  expired:   'bg-brand/20 text-brand-light border-brand/30',
  cancelled: 'bg-white/10 text-white/40 border-white/10',
}

export default function StatusBadge({ status, type = 'lead', onClick, className = '' }) {
  const map = type === 'member' ? MEMBER_COLORS : LEAD_COLORS
  const color = map[status] || 'bg-white/10 text-white/50 border-white/10'

  return (
    <span
      onClick={onClick}
      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border capitalize
        ${color} ${onClick ? 'cursor-pointer hover:opacity-80 transition-opacity select-none' : ''} ${className}`}
    >
      {status}
    </span>
  )
}
