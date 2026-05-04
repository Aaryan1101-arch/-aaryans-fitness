export default function EmptyState({ icon, title, sub, action }) {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      {icon && (
        <div className="w-14 h-14 rounded-2xl bg-white/5 text-white/30 flex items-center justify-center mb-4">
          {icon}
        </div>
      )}
      <p className="text-white/60 font-medium mb-1">{title}</p>
      {sub && <p className="text-white/30 text-sm mb-6">{sub}</p>}
      {action}
    </div>
  )
}
