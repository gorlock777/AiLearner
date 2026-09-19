import { Link, useNavigate } from 'react-router-dom'
import { ArrowRight, Sparkles, FileText, Layers, CheckCircle, BarChart3 } from 'lucide-react'
import { motion } from 'framer-motion'
import { ShimmerButton } from './shimmer-button'

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
      />
    </svg>
  )
}

export function FloatingNavbar({ hasTopics }: { hasTopics: boolean }) {
  const navigate = useNavigate()

  return (
    <motion.header
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="fixed top-5 inset-x-0 z-50 flex justify-center px-4 pointer-events-none"
    >
      <div className="pointer-events-auto flex items-center justify-between gap-4 sm:gap-8 px-4 sm:px-6 py-2.5 rounded-full bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)]">
        {/* Brand Logo */}
        <Link to="/" className="flex items-center gap-2.5 group">
          <div className="w-6 h-6 rounded-full bg-gradient-to-tr from-emerald-400 to-indigo-500 flex items-center justify-center font-bold text-[10px] text-white shadow-md">
            EU
          </div>
          <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white font-mono">
            Eureka
          </span>
        </Link>

        {/* Center Nav Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs text-zinc-400">
          <a href="#pipeline" className="hover:text-zinc-200 transition-colors font-mono">
            Pipeline
          </a>
          <a href="#features" className="hover:text-zinc-200 transition-colors font-mono">
            Architecture
          </a>
          <a href="#faq" className="hover:text-zinc-200 transition-colors font-mono">
            FAQ
          </a>
        </nav>

        {/* Action Button */}
        <div className="flex items-center gap-2.5">
          <a
            href="https://github.com/gorlock777/AiLearner"
            target="_blank"
            rel="noreferrer"
            className="p-2 rounded-full text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="GitHub Repository"
          >
            <GithubIcon size={14} />
          </a>

          <ShimmerButton
            onClick={() => navigate(hasTopics ? '/study' : '/app')}
            className="h-7 px-3.5 text-xs font-mono rounded-full"
          >
            <span>{hasTopics ? 'Resume Study' : 'Launch Workspace'}</span>
            <ArrowRight size={11} />
          </ShimmerButton>
        </div>
      </div>
    </motion.header>
  )
}

export default FloatingNavbar

