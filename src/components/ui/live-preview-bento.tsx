import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  Sparkles,
  Layers,
  CheckCircle2,
  Cpu,
  ArrowRight,
  Brain,
  Check,
  Zap,
} from 'lucide-react'
import { ShimmerButton } from './shimmer-button'
import { Badge } from './badge'

const PREVIEW_MODULES = [
  {
    title: 'Quantum Superposition',
    badge: 'Physics',
    color: '#34d399',
    prompt: 'How does a qubit differ fundamentally from a classical bit?',
    answer: 'A classical bit exists deterministically as 0 or 1. A qubit exists in a linear superposition |ψ⟩ = α|0⟩ + β|1⟩ until measured.',
    quiz: 'What is the net probability constraint for complex amplitudes α and β?',
    quizOptions: ['|α|² + |β|² = 1', 'α + β = 0', '|α| · |β| = 1'],
    correctIdx: 0,
  },
  {
    title: 'Cellular Respiration',
    badge: 'Biology',
    color: '#60a5fa',
    prompt: 'What is the net ATP & NADH yield of Glycolysis per glucose?',
    answer: 'Glycolysis consumes 2 ATP and produces 4 ATP and 2 NADH, yielding a net 2 ATP and 2 NADH in the cytosol.',
    quiz: 'Where does pyruvate oxidation occur in eukaryotic cells?',
    quizOptions: ['Mitochondrial matrix', 'Outer membrane', 'Cytosol'],
    correctIdx: 0,
  },
  {
    title: 'Raft Consensus',
    badge: 'CS Systems',
    color: '#a78bfa',
    prompt: 'How does Raft avoid split votes during leader election?',
    answer: 'Followers use randomized election timeouts (150ms-300ms) to ensure one candidate initiates voting before others.',
    quiz: 'What constitutes a quorum in an N-node Raft cluster?',
    quizOptions: ['(N / 2) + 1 votes', 'All N votes', '2/3 majority'],
    correctIdx: 0,
  },
]

export function LivePreviewBento({ onLaunch }: { onLaunch: () => void }) {
  const [activeTab, setActiveTab] = useState(0)
  const [flipped, setFlipped] = useState(false)
  const [selectedOption, setSelectedOption] = useState<number | null>(null)

  const mod = PREVIEW_MODULES[activeTab]

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, delay: 0.2 }}
      className="w-full max-w-4xl mx-auto mt-12 rounded-2xl bg-zinc-950/80 border border-white/10 p-5 sm:p-7 backdrop-blur-2xl shadow-[0_20px_60px_rgba(0,0,0,0.7)] text-left"
    >
      {/* Top Bar with Live Indicator and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-zinc-200">
            Interactive Ingestion Pipeline Simulator
          </span>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30">
            Live Preview
          </Badge>
        </div>

        {/* Preset Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0">
          {PREVIEW_MODULES.map((item, idx) => (
            <button
              key={item.title}
              onClick={() => {
                setActiveTab(idx)
                setFlipped(false)
                setSelectedOption(null)
              }}
              className={`text-xs font-mono px-3 py-1.5 rounded-lg transition-all cursor-pointer ${
                activeTab === idx
                  ? 'bg-white/10 text-white font-medium border border-white/15 shadow-sm'
                  : 'text-zinc-400 hover:text-zinc-200 hover:bg-white/5'
              }`}
            >
              {item.title}
            </button>
          ))}
        </div>
      </div>

      {/* Main Split Grid: 3D Flashcard + Quiz Demo */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-5">
        {/* Left: 3D Flashcard Preview */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="group relative min-h-[240px] rounded-xl bg-[#0c0c10] border border-white/[0.08] hover:border-white/20 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span
              className="px-2 py-0.5 rounded border text-[10px]"
              style={{
                color: mod.color,
                borderColor: `${mod.color}40`,
                background: `${mod.color}10`,
              }}
            >
              {flipped ? 'Key Answer' : 'Prompt / Concept'}
            </span>
            <span className="text-[10px] text-zinc-500 group-hover:text-zinc-300 transition-colors">
              Click to {flipped ? 'flip back' : 'reveal'} ↻
            </span>
          </div>

          <div className="my-auto py-4 text-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={flipped ? 'back' : 'front'}
                initial={{ opacity: 0, y: 4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.15 }}
                className="font-heading font-normal text-base sm:text-lg text-zinc-100 leading-relaxed"
              >
                {flipped ? mod.answer : mod.prompt}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2 border-t border-white/[0.06]">
            <span>3D Flashcard Deck</span>
            <span>Space / Click</span>
          </div>
        </div>

        {/* Right: Adaptive Diagnostic Quiz Preview */}
        <div className="rounded-xl bg-[#0c0c10] border border-white/[0.08] p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
              <span className="text-zinc-300">Diagnostic Practice Question</span>
              <span className="text-emerald-400">1 of 1</span>
            </div>

            <p className="font-heading font-normal text-sm text-zinc-100 mb-3 leading-snug">
              {mod.quiz}
            </p>

            <div className="flex flex-col gap-2">
              {mod.quizOptions.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx
                const isCorrect = optIdx === mod.correctIdx

                let btnBg = 'bg-white/[0.03] border-white/[0.08] text-zinc-300 hover:bg-white/[0.06]'
                if (selectedOption !== null) {
                  if (isCorrect) btnBg = 'bg-emerald-500/15 border-emerald-500/40 text-emerald-300 font-medium'
                  else if (isSelected) btnBg = 'bg-rose-500/15 border-rose-500/40 text-rose-300'
                  else btnBg = 'bg-white/[0.01] border-white/[0.04] text-zinc-600 opacity-50'
                }

                return (
                  <button
                    key={opt}
                    onClick={() => setSelectedOption(optIdx)}
                    className={`text-left p-2.5 rounded-lg border text-xs font-sans transition-all flex items-center justify-between cursor-pointer ${btnBg}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <Check size={13} className="text-emerald-400 flex-shrink-0" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-500 pt-2.5 mt-3 border-t border-white/[0.06]">
            <span>Real-Time Evaluation</span>
            <span className="text-emerald-400/80">Structured Schema</span>
          </div>
        </div>
      </div>

      {/* Bottom CTA Strip */}
      <div className="mt-5 pt-4 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs font-mono text-zinc-400">
          <Brain size={14} className="text-emerald-400" />
          <span>Upload your own lecture slides or notes in the full workspace.</span>
        </div>

        <ShimmerButton onClick={onLaunch} className="h-8 px-4 text-xs font-mono rounded-full">
          <span>Open Eureka Workspace</span>
          <ArrowRight size={12} />
        </ShimmerButton>
      </div>
    </motion.div>
  )
}

export default LivePreviewBento

