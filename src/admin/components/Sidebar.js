import { NavLink } from 'react-router-dom'

const Icon = {
  dashboard: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 0 1 6 3.75h2.25A2.25 2.25 0 0 1 10.5 6v2.25a2.25 2.25 0 0 1-2.25 2.25H6a2.25 2.25 0 0 1-2.25-2.25V6ZM3.75 15.75A2.25 2.25 0 0 1 6 13.5h2.25a2.25 2.25 0 0 1 2.25 2.25V18a2.25 2.25 0 0 1-2.25 2.25H6A2.25 2.25 0 0 1 3.75 18v-2.25ZM13.5 6a2.25 2.25 0 0 1 2.25-2.25H18A2.25 2.25 0 0 1 20.25 6v2.25A2.25 2.25 0 0 1 18 10.5h-2.25a2.25 2.25 0 0 1-2.25-2.25V6ZM13.5 15.75a2.25 2.25 0 0 1 2.25-2.25H18a2.25 2.25 0 0 1 2.25 2.25V18A2.25 2.25 0 0 1 18 20.25h-2.25A2.25 2.25 0 0 1 13.5 18v-2.25Z" />
    </svg>
  ),
  leads: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 13.5h3.86a2.25 2.25 0 0 1 2.012 1.244l.256.512a2.25 2.25 0 0 0 2.013 1.244h3.218a2.25 2.25 0 0 0 2.013-1.244l.256-.512a2.25 2.25 0 0 1 2.013-1.244h3.859m-19.5.338V18a2.25 2.25 0 0 0 2.25 2.25h15A2.25 2.25 0 0 0 21.75 18v-4.162c0-.224-.034-.447-.1-.661L19.24 5.338a2.25 2.25 0 0 0-2.15-1.588H6.911a2.25 2.25 0 0 0-2.15 1.588L2.35 13.177a2.25 2.25 0 0 0-.1.661Z" />
    </svg>
  ),
  members: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
    </svg>
  ),
  schedule: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
    </svg>
  ),
  analytics: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 0 1 3 19.875v-6.75ZM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V8.625ZM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 0 1-1.125-1.125V4.125Z" />
    </svg>
  ),
  content: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 6H5.25A2.25 2.25 0 0 0 3 8.25v10.5A2.25 2.25 0 0 0 5.25 21h10.5A2.25 2.25 0 0 0 18 18.75V10.5m-10.5 6L21 3m0 0h-5.25M21 3v5.25" />
    </svg>
  ),
  logout: (
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 9V5.25A2.25 2.25 0 0 0 13.5 3h-6a2.25 2.25 0 0 0-2.25 2.25v13.5A2.25 2.25 0 0 0 7.5 21h6a2.25 2.25 0 0 0 2.25-2.25V15m3 0 3-3m0 0-3-3m3 3H9" />
    </svg>
  ),
  notice: (
    // Megaphone — reads as "announcement" more clearly than a bell.
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.34 15.84c-.688-.06-1.386-.09-2.09-.09H7.5a4.5 4.5 0 1 1 0-9h.75c.704 0 1.402-.03 2.09-.09m0 9.18c.253.962.584 1.892.985 2.783.247.55.06 1.21-.463 1.51l-.657.38c-.551.318-1.26.117-1.527-.461a20.85 20.85 0 0 1-1.44-4.282m3.102.069a18.03 18.03 0 0 1-.59-4.59c0-1.586.205-3.124.59-4.59m0 9.18a23.85 23.85 0 0 1 8.835 2.535M10.34 6.66a23.85 23.85 0 0 0 8.835-2.535m0 0A23.74 23.74 0 0 0 18.795 3m.38 1.125a23.91 23.91 0 0 1 1.014 5.395m-1.014 8.855c-.118.38-.245.754-.38 1.125m.38-1.125a23.91 23.91 0 0 0 1.014-5.395m0-3.46c.495.413.811 1.035.811 1.73 0 .695-.316 1.317-.811 1.73m0-3.46a24.347 24.347 0 0 1 0 3.46" />
    </svg>
  ),
  offer: (
    // Price-tag — universally reads as "deal/offer/sale".
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.568 3H5.25A2.25 2.25 0 0 0 3 5.25v4.318c0 .597.237 1.17.659 1.591l9.581 9.581c.699.699 1.78.872 2.607.33a18.095 18.095 0 0 0 5.223-5.223c.542-.827.369-1.908-.33-2.607L11.16 3.66A2.25 2.25 0 0 0 9.568 3Z" />
      <path strokeLinecap="round" strokeLinejoin="round" d="M6 6h.008v.008H6V6Z" />
    </svg>
  ),
  supplement: (
    // Beaker — health/lab semantic. The shopping-cart we had implies a buy
    // flow, but the catalog is display-only.
    <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
      <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 0-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
    </svg>
  ),
}

const linkClass = ({ isActive }) =>
  `flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
    isActive
      ? 'bg-brand/15 text-brand-light'
      : 'text-white/50 hover:text-white hover:bg-white/5'
  }`

export default function Sidebar({ admin, onSignOut, newLeadCount = 0 }) {
  return (
    <aside className="w-60 flex-shrink-0 flex flex-col bg-[#171717] border-r border-white/[0.07] h-screen sticky top-0">
      {/* Logo */}
      <div className="px-4 py-5 border-b border-white/[0.07]">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-brand flex items-center justify-center flex-shrink-0">
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="2" stroke="white" className="w-4 h-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z" />
            </svg>
          </div>
          <div>
            <p className="text-white text-sm font-semibold leading-tight">Admin</p>
            <p className="text-white/30 text-xs">Aaryan's Fitness</p>
          </div>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
        <NavLink to="/admin" end className={linkClass}>
          {Icon.dashboard}
          Dashboard
        </NavLink>

        <NavLink to="/admin/leads" className={linkClass}>
          <span className="relative">
            {Icon.leads}
            {newLeadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-brand rounded-full text-[9px] text-white font-bold flex items-center justify-center">
                {newLeadCount > 9 ? '9+' : newLeadCount}
              </span>
            )}
          </span>
          Leads
          {newLeadCount > 0 && (
            <span className="ml-auto text-[10px] bg-brand/20 text-brand-light px-1.5 py-0.5 rounded-full font-semibold">
              {newLeadCount} new
            </span>
          )}
        </NavLink>

        <NavLink to="/admin/members" className={linkClass}>
          {Icon.members}
          Members
        </NavLink>

        <div className="pt-3 mt-1 border-t border-white/[0.07]">
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Content</p>
          </div>

          <NavLink to="/admin/content/settings" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 0 1 1.37.49l1.296 2.247a1.125 1.125 0 0 1-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 0 1 0 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 0 1-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 0 1-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 0 1-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 0 1-1.369-.49l-1.297-2.247a1.125 1.125 0 0 1 .26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 0 1 0-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 0 1-.26-1.43l1.297-2.247a1.125 1.125 0 0 1 1.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28Z" />
              <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </svg>
            Site Settings
          </NavLink>

          <NavLink to="/admin/content/hero" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Hero
          </NavLink>

          <NavLink to="/admin/content/plans" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Z" />
            </svg>
            Plans
          </NavLink>

          <NavLink to="/admin/content/services" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 12h16.5m-16.5 3.75h16.5M3.75 19.5h16.5M5.625 4.5h12.75a1.875 1.875 0 0 1 0 3.75H5.625a1.875 1.875 0 0 1 0-3.75Z" />
            </svg>
            Services
          </NavLink>

          <NavLink to="/admin/content/gallery" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
            </svg>
            Gallery
          </NavLink>

          <NavLink to="/admin/content/team" className={linkClass}>
            {Icon.members}
            Team
          </NavLink>

          <NavLink to="/admin/content/reviews" className={linkClass}>
            <svg fill="none" viewBox="0 0 24 24" strokeWidth="1.7" stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
            </svg>
            Reviews
          </NavLink>
        </div>

        <div className="pt-3 mt-1 border-t border-white/[0.07]">
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Announcements</p>
          </div>

          <NavLink to="/admin/content/notices" className={linkClass}>
            {Icon.notice}
            Notices
          </NavLink>

          <NavLink to="/admin/content/offers" className={linkClass}>
            {Icon.offer}
            Offers
          </NavLink>

          <NavLink to="/admin/content/supplements" className={linkClass}>
            {Icon.supplement}
            Supplements
          </NavLink>
        </div>

        <div className="pt-3 mt-1 border-t border-white/[0.07]">
          <div className="px-3 pb-1.5 pt-2">
            <p className="text-[10px] uppercase tracking-widest text-white/20 font-semibold">Coming soon</p>
          </div>
          <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/25 cursor-not-allowed">
            {Icon.schedule}
            Schedule
          </span>
          <span className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-white/25 cursor-not-allowed">
            {Icon.analytics}
            Analytics
          </span>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-3 py-4 border-t border-white/[0.07]">
        <div className="flex items-center gap-2.5 px-3 mb-2">
          <div className="w-7 h-7 rounded-full bg-brand/20 text-brand-light flex items-center justify-center text-xs font-bold flex-shrink-0">
            {admin?.email?.[0]?.toUpperCase() || '?'}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white/80 text-xs font-medium truncate">{admin?.email}</p>
            <p className="text-white/30 text-[10px] capitalize">{admin?.role || 'admin'}</p>
          </div>
        </div>
        <button
          onClick={onSignOut}
          className="w-full flex items-center gap-3 px-3 py-2 rounded-xl text-sm text-white/40 hover:text-white hover:bg-white/5 transition-all duration-150"
        >
          {Icon.logout}
          Sign out
        </button>
      </div>
    </aside>
  )
}
