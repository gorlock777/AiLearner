import { Outlet, NavLink, useLocation } from 'react-router-dom'
import {
  UploadCloud,
  Layers,
  CheckCircle,
  BarChart3,
  Cpu,
  FileText,
  Command,
} from 'lucide-react'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const navItems = [
  { to: '/', icon: UploadCloud, label: 'Upload Notes' },
  { to: '/study', icon: Layers, label: 'Flashcards' },
  { to: '/quiz', icon: CheckCircle, label: 'Practice Quiz' },
  { to: '/progress', icon: BarChart3, label: 'Analytics' },
]

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
        className={`relative flex items-center justify-center w-10 h-10 rounded-lg transition-all duration-150 ${
          isActive
            ? 'bg-zinc-800 text-white shadow-sm border border-zinc-700/80'
            : hovered
            ? 'bg-zinc-900 text-zinc-200 border border-zinc-800'
            : 'text-zinc-400 hover:text-zinc-200 border border-transparent'
        }`}
      >
        <Icon size={18} strokeWidth={isActive ? 2 : 1.75} />
      </NavLink>

      {/* Floating tooltip */}
      {hovered && (
        <div className="pointer-events-none absolute left-[68px] top-1/2 -translate-y-1/2 z-50">
          <div className="px-2.5 py-1 rounded-md bg-zinc-900 text-xs font-medium text-zinc-200 border border-zinc-700/80 shadow-xl whitespace-nowrap">
            {label}
          </div>
        </div>
      )}
    </div>
  )
}

export function AppShell() {
  const { topics, documents } = useAppStore()
  const activeDoc = documents[0]
  const location = useLocation()

  const getPageTitle = () => {
    if (location.pathname === '/') return 'Document Workspace'
    if (location.pathname.startsWith('/study')) return 'Flashcard Deck'
    if (location.pathname.startsWith('/quiz')) return 'Adaptive Quiz'
    if (location.pathname.startsWith('/progress')) return 'Performance Analytics'
    return 'AiLearner'
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#09090b] text-zinc-100 linear-grid">
      {/* ── Linear Sidebar ── */}
      <aside className="relative z-20 flex flex-col items-center py-4 flex-shrink-0 w-16 bg-[#0c0c0e] border-r border-zinc-800/80">
        {/* Logo */}
        <div className="mb-6 flex items-center justify-center">
          <div className="flex items-center justify-center w-9 h-9 rounded-lg bg-zinc-900 border border-zinc-700/80 text-white shadow-inner font-bold text-xs">
            AL
          </div>
        </div>

        {/* Nav list */}
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

        {/* Bottom indicator */}
        <div className="flex flex-col items-center gap-2">
          {topics.length > 0 && (
            <div
              className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-300 font-semibold"
              title={`${topics.length} topics organized`}
            >
              {topics.length}
            </div>
          )}
          <span className="text-[10px] font-mono text-zinc-400">v1.0</span>
        </div>
      </aside>

      {/* ── Main View Area ── */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        {/* Topbar */}
        <header className="h-12 border-b border-zinc-800/80 bg-[#0c0c0e]/80 backdrop-blur-md px-6 flex items-center justify-between flex-shrink-0 z-10">
          <div className="flex items-center gap-3">
            <span className="text-xs font-medium text-zinc-400">AiLearner</span>
            <span className="text-zinc-600">/</span>
            <span className="text-xs font-medium text-zinc-200">{getPageTitle()}</span>

            {activeDoc && (
              <span className="hidden md:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md bg-zinc-900 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
                <FileText size={11} />
                {activeDoc.name}
              </span>
            )}
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden sm:inline-flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-zinc-900/90 border border-zinc-800 text-[11px] text-zinc-400 font-mono">
              <Cpu size={12} className="text-emerald-400" />
              openrouter/free
            </div>

            <div className="hidden lg:flex items-center gap-1 text-xs text-zinc-400 bg-zinc-900/80 px-2 py-1 rounded border border-zinc-800">
              <Command size={11} />
              <span className="text-[10px]">K</span>
            </div>
          </div>
        </header>

        {/* Content View */}
        <main className="relative z-10 flex-1 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AppShell
