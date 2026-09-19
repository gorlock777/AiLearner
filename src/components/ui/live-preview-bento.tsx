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
    color: '#059669',
    prompt: 'How does a qubit differ fundamentally from a classical bit?',
    answer: 'A classical bit exists deterministically as 0 or 1. A qubit exists in a linear superposition |ψ⟩ = α|0⟩ + β|1⟩ until measured.',
    quiz: 'What is the net probability constraint for complex amplitudes α and β?',
    quizOptions: ['|α|² + |β|² = 1', 'α + β = 0', '|α| · |β| = 1'],
    correctIdx: 0,
  },
  {
    title: 'Cellular Respiration',
    badge: 'Biology',
    color: '#2563eb',
    prompt: 'What is the net ATP & NADH yield of Glycolysis per glucose?',
    answer: 'Glycolysis consumes 2 ATP and produces 4 ATP and 2 NADH, yielding a net 2 ATP and 2 NADH in the cytosol.',
    quiz: 'Where does pyruvate oxidation occur in eukaryotic cells?',
    quizOptions: ['Mitochondrial matrix', 'Outer membrane', 'Cytosol'],
    correctIdx: 0,
  },
  {
    title: 'Raft Consensus',
    badge: 'CS Systems',
    color: '#7c3aed',
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
    <div className="w-full max-w-4xl mx-auto rounded-2xl bg-white/95 border border-stone-200/90 p-5 sm:p-7 shadow-[0_12px_40px_rgba(0,0,0,0.06)] text-left">
      {/* Top Bar with Live Indicator and Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-stone-200/80">
        <div className="flex items-center gap-2.5">
          <div className="w-2.5 h-2.5 rounded-full bg-emerald-600 animate-pulse" />
          <span className="text-xs font-mono font-medium text-stone-800">
            Interactive Ingestion Pipeline Simulator
          </span>
          <Badge variant="outline" className="text-[10px] text-emerald-700 border-emerald-600/30 bg-emerald-50">
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
                  ? 'bg-stone-900 text-white font-medium shadow-sm'
                  : 'text-stone-500 hover:text-stone-900 hover:bg-stone-100'
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
          className="group relative min-h-[240px] rounded-xl bg-stone-50/80 border border-stone-200/80 hover:border-stone-400 p-5 flex flex-col justify-between cursor-pointer transition-all duration-300 shadow-sm"
        >
          <div className="flex items-center justify-between text-[11px] font-mono text-stone-500">
            <span
              className="px-2 py-0.5 rounded border text-[10px]"
              style={{
                color: mod.color,
                borderColor: `${mod.color}30`,
                background: `${mod.color}0a`,
              }}
            >
              {flipped ? 'Key Answer' : 'Prompt / Concept'}
            </span>
            <span className="text-[10px] text-stone-500 group-hover:text-stone-900 transition-colors flex items-center gap-1">
              <RotateCw size={10} />
              <span>Click to {flipped ? 'flip back' : 'reveal'}</span>
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
                className="font-heading font-normal text-base sm:text-lg text-stone-900 leading-relaxed"
              >
                {flipped ? mod.answer : mod.prompt}
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-200/60">
            <span>3D Flashcard Deck</span>
            <span>Click / Tap</span>
          </div>
        </div>

        {/* Right: Adaptive Diagnostic Quiz Preview */}
        <div className="rounded-xl bg-stone-50/80 border border-stone-200/80 p-5 flex flex-col justify-between shadow-sm">
          <div>
            <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 mb-2">
              <span className="text-stone-700">Diagnostic Practice Question</span>
              <span className="text-emerald-600 font-semibold">1 of 1</span>
            </div>

            <p className="font-heading font-normal text-sm text-stone-900 mb-3 leading-snug">
              {mod.quiz}
            </p>

            <div className="flex flex-col gap-2">
              {mod.quizOptions.map((opt, optIdx) => {
                const isSelected = selectedOption === optIdx
                const isCorrect = optIdx === mod.correctIdx

                let btnBg = 'bg-white border-stone-200 text-stone-700 hover:bg-stone-100/80'
                if (selectedOption !== null) {
                  if (isSelected && isCorrect) {
                    btnBg = 'bg-emerald-50 border-emerald-500 text-emerald-800'
                  } else if (isSelected && !isCorrect) {
                    btnBg = 'bg-rose-50 border-rose-500 text-rose-800'
                  } else if (isCorrect) {
                    btnBg = 'bg-emerald-50/60 border-emerald-500/50 text-emerald-700'
                  }
                }

                return (
                  <button
                    key={opt}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelectedOption(optIdx)
                    }}
                    className={`w-full text-left text-xs font-mono px-3 py-2 rounded-lg border transition-all flex items-center justify-between cursor-pointer ${btnBg}`}
                  >
                    <span>{opt}</span>
                    {selectedOption !== null && isCorrect && (
                      <Check size={13} className="text-emerald-600" />
                    )}
                  </button>
                )
              })}
            </div>
          </div>

          <div className="flex items-center justify-between text-[10px] font-mono text-stone-500 pt-2 border-t border-stone-200/60 mt-3">
            <span>Adaptive Quiz</span>
            <span>Instant Evaluation</span>
          </div>
        </div>
      </div>

      {/* Bottom Callout & Launch Action */}
      <div className="mt-5 pt-4 border-t border-stone-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-xs text-stone-600 font-mono">
          <FileText size={14} className="text-stone-500" />
          <span>Synthesizes PDF slides & textbooks into active retention decks</span>
        </div>

        <ShimmerButton
          onClick={onLaunch}
          className="text-xs font-mono h-8 px-4 self-end sm:self-auto bg-stone-900 text-white hover:bg-stone-800"
        >
          <span>Open Full Workspace</span>
          <ArrowRight size={12} />
        </ShimmerButton>
      </div>
    </div>
  )
}

export default LivePreviewBento
