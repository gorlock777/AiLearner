import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import {
  FileText,
  CheckCircle2,
  ArrowRight,
  Check,
  RotateCw,
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
    color: '#e4e4e7',
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
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-[#13151c]/90 border border-white/10 p-5 sm:p-6 shadow-[0_20px_60px_rgba(0,0,0,0.6)] backdrop-blur-xl text-left">
      {/* Top Bar with Live Indicator and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3.5 border-b border-white/[0.08]">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-mono font-medium text-zinc-200">
            Interactive Ingestion Pipeline Simulator
          </span>
          <Badge variant="outline" className="text-[10px] text-emerald-400 border-emerald-500/30 bg-emerald-950/40">
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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5 mt-4">
        {/* Left: 3D Flashcard Preview */}
        <div
          onClick={() => setFlipped(!flipped)}
          className="group relative min-h-[220px] rounded-xl bg-[#181b24] border border-white/10 hover:border-white/20 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-md"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
            <span
              className="px-2 py-0.5 rounded border text-[10px]"
              style={{
                color: mod.color,
                borderColor: `${mod.color}40`,
                background: `${mod.color}14`,
              }}
            >
              {flipped ? 'Key Answer' : 'Prompt / Concept'}
            </span>
            <span className="text-[10px] text-zinc-400 group-hover:text-zinc-200 transition-colors flex items-center gap-1">
              <RotateCw size={10} />
              <span>Click to {flipped ? 'flip back' : 'reveal'}</span>
            </span>
          </div>

          <div className="my-auto py-3 text-center">
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

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06]">
            <span>3D Flashcard Deck</span>
            <span>Click / Tap</span>
          </div>
        </div>

        {/* Right: Adaptive Diagnostic Quiz Preview */}
        <div className="rounded-xl bg-[#181b24] border border-white/10 p-5 flex flex-col justify-between shadow-md">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2">
              <span className="text-zinc-300">Diagnostic Practice Question</span>
              <span className="text-emerald-400 font-semibold">1 of 1</span>
            </div>

            <p className="font-heading font-normal text-sm text-zinc-100 mb-3 leading-snug">
              {mod.quiz}
            </p>

            <div className="flex flex-col gap-2">
              {mod.quizOptions.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx
                const isCorrect = optIdx === mod.correctIdx

                let btnBg = 'bg-white/[0.04] border-white/[0.08] text-zinc-300 hover:bg-white/[0.08]'
                if (selectedOption !== null) {
                  if (isSelected && isCorrect) {
                    btnBg = 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                  } else if (isSelected && !isCorrect) {
                    btnBg = 'bg-rose-500/20 border-rose-500/50 text-rose-300'
                  } else if (isCorrect) {
                    btnBg = 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400'
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOption(optIdx)
                    }}
                    className={`w-full text-left text-xs font-mono px-3 py-1.5 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnBg}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <Check size={13} className="text-emerald-400" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-white/[0.06] mt-2">
            <span>Adaptive Quiz</span>
            <span>Instant Evaluation</span>
          </div>
        </div>
      </div>

      {/* Bottom Callout & Launch Action */}
      <div className="mt-4 pt-3.5 border-t border-white/[0.08] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono">
          <FileText size={14} className="text-zinc-400" />
          <span>Synthesizes PDF slides & textbooks into active retention decks</span>
        </div>

        <ShimmerButton
          onClick={onLaunch}
          className="text-xs font-mono h-8 px-4 self-end sm:self-auto"
        >
          <span>Open Full Workspace</span>
          <ArrowRight size={12} />
        </ShimmerButton>
      </div>
    </div>
  )
}

export default LivePreviewBento
