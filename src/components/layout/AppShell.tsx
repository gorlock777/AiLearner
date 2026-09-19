import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Upload, BookOpen, CheckSquare, BarChart2, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const navItems = [
  { to: '/', icon: Upload, label: 'Upload' },
  { to: '/study', icon: BookOpen, label: 'Flashcards' },
  { to: '/quiz', icon: CheckSquare, label: 'Quiz' },
  { to: '/progress', icon: BarChart2, label: 'Progress' },
]

function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  if (!visible) return null
  return (
    <div className="pointer-events-none absolute left-[68px] top-1/2 -translate-y-1/2 z-50">
      <div className="px-2.5 py-1 rounded bg-[#1e2638] text-xs font-medium text-slate-200 border border-[#2b374e] shadow-lg whitespace-nowrap">
        {label}
      </div>
    </div>
  )
}

function SidebarNavItem({
  to,
  icon: Icon,
  label,
  isExact,
}: {
  to: string
  icon: React.ElementType
  label: string
  isExact?: boolean
}) {
  const [hovered, setHovered] = useState(false)
  const location = useLocation()
  const isActive = isExact ? location.pathname === to : location.pathname.startsWith(to)

  return (
    <div
      className="relative flex items-center justify-center w-full px-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={to}
        end={isExact}
        className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-colors duration-150 ${
          isActive
            ? 'bg-[#2563eb] text-white'
            : hovered
            ? 'bg-[#182030] text-slate-200'
            : 'text-slate-400 hover:text-slate-200'
        }`}
      >
        <Icon size={18} strokeWidth={isActive ? 2.2 : 1.8} />
      </NavLink>
      <NavTooltip label={label} visible={hovered} />
    </div>
  )
}

export function AppShell() {
  const { topics } = useAppStore()

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0a0d14] text-slate-100">
      {/* ── Minimalist Sidebar ── */}
      <aside className="relative z-20 flex flex-col items-center py-4 flex-shrink-0 w-16 bg-[#0f1420] border-r border-[#1e2638]">
        {/* Brand mark */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-[#182236] border border-[#263552] text-blue-400">
            <Sparkles size={18} />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex flex-col items-center gap-2 flex-1 w-full">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isExact={item.to === '/'}
            />
          ))}
        </nav>

        {/* Topic Counter Badge */}
        {topics.length > 0 && (
          <div className="mb-3 flex flex-col items-center" title={`${topics.length} topics loaded`}>
            <div className="flex items-center justify-center w-7 h-7 rounded bg-[#182030] border border-[#252f44] text-[11px] font-semibold text-blue-400">
              {topics.length}
            </div>
            <span className="text-[9px] text-slate-400 mt-1 uppercase tracking-wider font-semibold">
              topics
            </span>
          </div>
        )}

        <div className="text-[10px] tracking-wider text-slate-400 font-medium">
          v1.0
        </div>
      </aside>

      {/* ── Main Workspace ── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
