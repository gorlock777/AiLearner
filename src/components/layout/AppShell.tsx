import { Outlet, NavLink, useLocation } from 'react-router-dom'
import { Home, BookOpen, Brain, BarChart3, Zap } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import { useAppStore } from '../../store/useAppStore'

const navItems = [
  { to: '/', icon: Home, label: 'Upload' },
  { to: '/study', icon: BookOpen, label: 'Flashcards' },
  { to: '/quiz', icon: Brain, label: 'Quiz' },
  { to: '/progress', icon: BarChart3, label: 'Progress' },
]

// Tooltip that appears to the right of the sidebar icon
function NavTooltip({ label, visible }: { label: string; visible: boolean }) {
  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, x: -6, scale: 0.92 }}
          animate={{ opacity: 1, x: 0, scale: 1 }}
          exit={{ opacity: 0, x: -4, scale: 0.95 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
          className="pointer-events-none absolute left-[72px] top-1/2 -translate-y-1/2 z-50"
        >
          <div
            className="px-3 py-1.5 rounded-lg text-sm font-medium whitespace-nowrap"
            style={{
              background: 'rgba(99,102,241,0.18)',
              backdropFilter: 'blur(12px)',
              border: '1px solid rgba(99,102,241,0.3)',
              color: '#c7d2fe',
              boxShadow: '0 4px 24px rgba(99,102,241,0.15)',
            }}
          >
            {label}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

// Individual nav item with active state and tooltip
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
      className="relative flex items-center justify-center"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <NavLink
        to={to}
        end={isExact}
        className="relative flex items-center justify-center w-11 h-11 rounded-xl transition-all duration-200"
        style={({ isActive: navActive }) => ({
          background: navActive
            ? 'rgba(99,102,241,0.2)'
            : hovered
            ? 'rgba(255,255,255,0.06)'
            : 'transparent',
          boxShadow: navActive ? '0 0 18px rgba(99,102,241,0.35), inset 0 0 0 1px rgba(99,102,241,0.4)' : 'none',
        })}
      >
        {({ isActive: navActive }) => (
          <>
            {/* Active glow behind icon */}
            {navActive && (
              <motion.div
                layoutId="nav-glow"
                className="absolute inset-0 rounded-xl"
                style={{
                  background: 'radial-gradient(circle at center, rgba(99,102,241,0.4) 0%, transparent 70%)',
                }}
                transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              />
            )}
            <Icon
              size={20}
              style={{
                color: navActive ? '#818cf8' : hovered ? '#a5b4fc' : 'rgba(148,163,184,0.55)',
                filter: navActive ? 'drop-shadow(0 0 6px rgba(99,102,241,0.7))' : 'none',
                transition: 'color 0.2s, filter 0.2s',
                position: 'relative',
                zIndex: 1,
              }}
            />
          </>
        )}
      </NavLink>
      <NavTooltip label={label} visible={hovered} />
    </div>
  )
}

export function AppShell() {
  const { topics } = useAppStore()

  return (
    <div
      className="flex h-screen w-screen overflow-hidden"
      style={{ background: '#070b14' }}
    >
      {/* ── Fixed background orbs ── */}
      <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        {/* Dot-grid pattern */}
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle, rgba(148,163,184,0.08) 1px, transparent 1px)`,
            backgroundSize: '28px 28px',
          }}
        />
        {/* Orb 1 — top-left indigo */}
        <motion.div
          animate={{ scale: [1, 1.08, 1], opacity: [0.35, 0.5, 0.35] }}
          transition={{ duration: 8, repeat: Infinity, ease: 'easeInOut' }}
          className="absolute"
          style={{
            width: 560,
            height: 560,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(99,102,241,0.22) 0%, transparent 70%)',
            top: '-180px',
            left: '-100px',
            filter: 'blur(8px)',
          }}
        />
        {/* Orb 2 — bottom-right violet */}
        <motion.div
          animate={{ scale: [1, 1.06, 1], opacity: [0.2, 0.35, 0.2] }}
          transition={{ duration: 11, repeat: Infinity, ease: 'easeInOut', delay: 2 }}
          className="absolute"
          style={{
            width: 700,
            height: 700,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(139,92,246,0.18) 0%, transparent 70%)',
            bottom: '-260px',
            right: '-180px',
            filter: 'blur(10px)',
          }}
        />
        {/* Orb 3 — mid-screen cyan accent */}
        <motion.div
          animate={{ scale: [1, 1.12, 1], opacity: [0.1, 0.2, 0.1] }}
          transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut', delay: 5 }}
          className="absolute"
          style={{
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'radial-gradient(circle, rgba(6,182,212,0.14) 0%, transparent 70%)',
            top: '40%',
            left: '35%',
            filter: 'blur(12px)',
          }}
        />
      </div>

      {/* ── Sidebar ── */}
      <motion.aside
        initial={{ x: -80, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: 'easeOut' }}
        className="relative z-20 flex flex-col items-center py-5 flex-shrink-0"
        style={{
          width: 64,
          background: 'rgba(7,11,20,0.85)',
          backdropFilter: 'blur(20px)',
          borderRight: '1px solid rgba(255,255,255,0.06)',
          boxShadow: '4px 0 32px rgba(0,0,0,0.4)',
        }}
      >
        {/* Logo */}
        <div className="mb-8 flex items-center justify-center" style={{ marginTop: 4 }}>
          <motion.div
            whileHover={{ scale: 1.1, rotate: 5 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
            className="flex items-center justify-center w-10 h-10 rounded-xl cursor-default"
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
              boxShadow: '0 0 20px rgba(99,102,241,0.5), 0 0 40px rgba(99,102,241,0.2)',
            }}
          >
            <Zap size={18} fill="white" color="white" />
          </motion.div>
        </div>

        {/* Divider */}
        <div
          className="w-8 mb-6"
          style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}
        />

        {/* Nav items */}
        <nav className="flex flex-col items-center gap-2 flex-1">
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

        {/* Topic count badge at bottom */}
        {topics.length > 0 && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="mb-2 flex flex-col items-center gap-1"
          >
            <div
              className="flex items-center justify-center w-8 h-8 rounded-full text-xs font-bold"
              style={{
                background: 'rgba(99,102,241,0.25)',
                border: '1px solid rgba(99,102,241,0.5)',
                color: '#818cf8',
                boxShadow: '0 0 10px rgba(99,102,241,0.3)',
              }}
            >
              {topics.length}
            </div>
            <span style={{ fontSize: 9, color: 'rgba(148,163,184,0.4)', letterSpacing: '0.05em' }}>
              topics
            </span>
          </motion.div>
        )}

        {/* Bottom divider + version */}
        <div
          className="w-8 mt-4 mb-3"
          style={{ height: 1, background: 'rgba(255,255,255,0.07)' }}
        />
        <div
          style={{
            fontSize: 9,
            letterSpacing: '0.08em',
            color: 'rgba(148,163,184,0.3)',
            textTransform: 'uppercase',
            writingMode: 'vertical-rl',
            transform: 'rotate(180deg)',
          }}
        >
          AiLearner
        </div>
      </motion.aside>

      {/* ── Main content ── */}
      <main className="relative z-10 flex-1 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  )
}
