import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  UploadCloud,
  Layers,
  CheckCircle,
  BarChart3,
  Settings,
  Trash2,
  KeyRound,
  Lightbulb,
} from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useAppStore } from '../../store/useAppStore'
import { Button } from '../ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '../ui/dialog'
import { Input } from '../ui/input'
import { Badge } from '../ui/badge'

const navItems = [
  { to: '/app', icon: UploadCloud, label: 'Upload Notes' },
  { to: '/study', icon: Layers, label: 'Flashcards' },
  { to: '/quiz', icon: CheckCircle, label: 'Practice Quiz' },
  { to: '/feynman', icon: Lightbulb, label: 'Feynman Mode' },
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
        className={`relative flex items-center justify-center w-10 h-10 rounded-xl transition-all duration-200 ${
          isActive
            ? 'bg-zinc-800 text-white shadow-sm border border-white/10'
            : hovered
            ? 'bg-zinc-900 text-zinc-200'
            : 'text-zinc-500 hover:text-zinc-300'
        }`}
      >
        {/* Active stripe indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-active-bar"
            className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full bg-emerald-400"
            transition={{ type: 'spring', stiffness: 380, damping: 36 }}
          />
        )}
        <Icon size={17} strokeWidth={isActive ? 2.2 : 1.6} />
      </NavLink>

      {/* Animated floating tooltip */}
      {hovered && (
        <motion.div
          initial={{ opacity: 0, x: -4 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.12 }}
          className="pointer-events-none absolute left-[68px] top-1/2 -translate-y-1/2 z-50"
        >
          <div className="px-2.5 py-1 rounded-md bg-zinc-900 text-xs font-medium text-zinc-200 border border-white/10 shadow-xl whitespace-nowrap">
            {label}
          </div>
        </motion.div>
      )}
    </div>
  )
}

export function AppShell() {
  const { topics, clearAll } = useAppStore()
  const location = useLocation()

  const [settingsOpen, setSettingsOpen] = useState(false)
  const [apiKeyInput, setApiKeyInput] = useState(
    () => localStorage.getItem('ai_learner_openrouter_key') || ''
  )
  const [savedKeyMsg, setSavedKeyMsg] = useState(false)

  const handleSaveApiKey = () => {
    if (apiKeyInput.trim()) {
      localStorage.setItem('ai_learner_openrouter_key', apiKeyInput.trim())
    } else {
      localStorage.removeItem('ai_learner_openrouter_key')
    }
    setSavedKeyMsg(true)
    setTimeout(() => setSavedKeyMsg(false), 2000)
  }

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-[#0d0e12] text-zinc-100 linear-grid" data-lenis-prevent>
      {/* ── Sleek Minimal Sidebar ── */}
      <aside className="relative z-20 flex flex-col items-center py-4 flex-shrink-0 w-16 bg-[#111319] border-r border-white/10" data-lenis-prevent>
        {/* Logo */}
        <Link
          to="/"
          className="mb-6 flex items-center justify-center group"
          title="Back to Landing Page"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-zinc-900 border border-white/10 text-white shadow-sm font-bold font-mono text-xs group-hover:border-white/25 transition-colors">
            EU
          </div>
        </Link>

        {/* Nav list */}
        <nav className="flex flex-col items-center gap-2 flex-1 w-full">
          {navItems.map((item) => (
            <SidebarNavItem
              key={item.to}
              to={item.to}
              icon={item.icon}
              label={item.label}
              isExact={item.to === '/app'}
            />
          ))}
        </nav>

        {/* Bottom controls */}
        <div className="flex flex-col items-center gap-2">
          {topics.length > 0 && (
            <div
              className="flex items-center justify-center w-7 h-7 rounded-md bg-zinc-900 border border-white/10 text-[11px] font-mono text-zinc-300 font-semibold"
              title={`${topics.length} topics organized`}
            >
              {topics.length}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="text-zinc-400 hover:text-zinc-200"
            title="Workspace Settings"
          >
            <Settings size={16} />
          </Button>
        </div>
      </aside>

      {/* ── Main View Area ── */}
      <div className="flex flex-col flex-1 h-full overflow-hidden" data-lenis-prevent>
        <main
          className="relative z-10 flex-1 overflow-y-auto overflow-x-hidden bg-[#0d0e12] focus:outline-none"
          data-lenis-prevent
          style={{ overscrollBehavior: 'contain', WebkitOverflowScrolling: 'touch' }}
        >
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="min-h-full pb-36 md:pb-48"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ── Settings Dialog Modal ── */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-[#14161e] border-white/10 text-zinc-100">
          <DialogHeader>
            <DialogTitle className="text-white font-heading">Eureka Workspace Settings</DialogTitle>
            <DialogDescription className="text-zinc-400">
              Configure neural API key parameters or reset cached browser storage.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-xs font-medium text-zinc-300 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound size={13} className="text-zinc-400" />
                  Custom API Key (Optional)
                </span>
                <span className="text-zinc-500 text-[11px] font-mono">
                  Stored securely in browser
                </span>
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-..."
                  className="font-mono text-xs flex-1 bg-zinc-900 border-white/10"
                />
                <Button size="sm" onClick={handleSaveApiKey}>
                  Save
                </Button>
              </div>
              {savedKeyMsg && (
                <div className="text-[11px] text-emerald-400 font-mono mt-1">
                  API Key updated in localStorage.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="text-xs font-medium text-zinc-300 mb-1">
                Active Inference Endpoint
              </div>
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono bg-zinc-900/60 p-2.5 rounded border border-white/10">
                <span>Neural Router</span>
                <Badge variant="outline" className="text-[10px] text-zinc-300 border-white/10">
                  Adaptive Intelligence (Auto)
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-white/10">
              <div className="text-xs font-medium text-rose-400 mb-1 flex items-center gap-1.5">
                <Trash2 size={13} />
                Clear Local Data
              </div>
              <p className="text-[11px] text-zinc-400 mb-3">
                Wipes all stored documents, extracted topic nodes, flashcard sets, and quiz logs from browser memory.
              </p>
              <Button
                variant="destructive"
                size="sm"
                onClick={() => {
                  clearAll()
                  setSettingsOpen(false)
                }}
                className="w-full text-xs font-mono"
              >
                Clear Entire Workspace Data
              </Button>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setSettingsOpen(false)}
            >
              Close
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default AppShell
