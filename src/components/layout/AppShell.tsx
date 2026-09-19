import { Outlet, NavLink, Link, useLocation } from 'react-router-dom'
import {
  UploadCloud,
  Layers,
  CheckCircle,
  BarChart3,
  Settings,
  Trash2,
  KeyRound,
  ExternalLink,
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
            ? 'bg-white text-stone-900 shadow-sm border border-stone-200/90'
            : hovered
            ? 'bg-stone-200/60 text-stone-900'
            : 'text-stone-400 hover:text-stone-700'
        }`}
      >
        {/* Active stripe indicator */}
        {isActive && (
          <motion.div
            layoutId="nav-active-bar"
            className="absolute left-0 top-2 bottom-2 w-[2.5px] rounded-full bg-emerald-600"
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
          <div className="px-2.5 py-1 rounded-md bg-stone-900 text-xs font-medium text-white shadow-xl whitespace-nowrap">
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
    <div className="flex h-screen w-screen overflow-hidden bg-[#fafaf8] text-stone-900 linear-grid">
      {/* ── Sleek Minimal Sidebar ── */}
      <aside className="relative z-20 flex flex-col items-center py-4 flex-shrink-0 w-16 bg-[#f5f5f3] border-r border-stone-200">
        {/* Logo */}
        <Link
          to="/"
          className="mb-6 flex items-center justify-center group"
          title="Back to Landing Page"
        >
          <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-stone-900 text-white shadow-sm font-bold font-mono text-xs group-hover:bg-black transition-colors">
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
              className="flex items-center justify-center w-7 h-7 rounded-md bg-white border border-stone-200 text-[11px] font-mono text-stone-700 font-semibold shadow-xs"
              title={`${topics.length} topics organized`}
            >
              {topics.length}
            </div>
          )}

          <Button
            variant="ghost"
            size="icon"
            onClick={() => setSettingsOpen(true)}
            className="text-stone-400 hover:text-stone-800 hover:bg-stone-200/50"
            title="Workspace Settings"
          >
            <Settings size={16} />
          </Button>
        </div>
      </aside>

      {/* ── Main View Area (Spacious & Clean — No Top Bar) ── */}
      <div className="flex flex-col flex-1 h-full overflow-hidden">
        <main className="relative z-10 flex-1 overflow-y-auto bg-[#fafaf8]" data-scroll-area>
          <motion.div
            key={location.pathname}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -6 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="min-h-full"
          >
            <Outlet />
          </motion.div>
        </main>
      </div>

      {/* ── Settings Dialog Modal ── */}
      <Dialog open={settingsOpen} onOpenChange={setSettingsOpen}>
        <DialogContent className="bg-white border-stone-200 text-stone-900">
          <DialogHeader>
            <DialogTitle className="text-stone-900 font-heading">Eureka Workspace Settings</DialogTitle>
            <DialogDescription className="text-stone-500">
              Configure OpenRouter API parameters or reset cached browser storage.
            </DialogDescription>
          </DialogHeader>

          <div className="flex flex-col gap-4 py-2">
            <div>
              <label className="text-xs font-medium text-stone-700 mb-1.5 flex items-center justify-between">
                <span className="flex items-center gap-1.5">
                  <KeyRound size={13} className="text-stone-500" />
                  Custom OpenRouter API Key (Optional)
                </span>
                <a
                  href="https://openrouter.ai/keys"
                  target="_blank"
                  rel="noreferrer"
                  className="text-emerald-600 hover:underline inline-flex items-center gap-1 text-[11px]"
                >
                  Get free key <ExternalLink size={10} />
                </a>
              </label>
              <div className="flex gap-2">
                <Input
                  type="password"
                  value={apiKeyInput}
                  onChange={(e) => setApiKeyInput(e.target.value)}
                  placeholder="sk-or-v1-..."
                  className="font-mono text-xs flex-1 bg-stone-50 border-stone-200"
                />
                <Button size="sm" onClick={handleSaveApiKey} className="bg-stone-900 text-white hover:bg-stone-800">
                  Save
                </Button>
              </div>
              {savedKeyMsg && (
                <div className="text-[11px] text-emerald-600 font-mono mt-1">
                  API Key updated in localStorage.
                </div>
              )}
            </div>

            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-medium text-stone-700 mb-1">
                Active Inference Endpoint
              </div>
              <div className="flex items-center justify-between text-xs text-stone-600 font-mono bg-stone-50 p-2.5 rounded border border-stone-200">
                <span>Model Router</span>
                <Badge variant="outline" className="text-[10px] text-stone-800 bg-white border-stone-300">
                  openrouter/free (auto)
                </Badge>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-200">
              <div className="text-xs font-medium text-rose-600 mb-1 flex items-center gap-1.5">
                <Trash2 size={13} />
                Clear Local Data
              </div>
              <p className="text-[11px] text-stone-500 mb-3">
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
              className="border-stone-200 text-stone-700"
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
