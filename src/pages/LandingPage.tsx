import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Layers,
  CheckCircle2,
  BarChart3,
  ArrowRight,
  FileText,
  Sparkles,
  Zap,
  Check,
  Eye,
  RotateCcw,
  Shield,
  Cpu,
  HelpCircle,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'

function GithubIcon({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
    </svg>
  )
}

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  const [previewFlipped, setPreviewFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-xl">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 flex items-center justify-center font-bold text-xs text-white shadow-inner">
                AL
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white">
                AiLearner
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs text-zinc-400">
              <a href="#features" className="hover:text-zinc-200 transition-colors">Features</a>
              <a href="#pipeline" className="hover:text-zinc-200 transition-colors">How It Works</a>
              <a href="#telemetry" className="hover:text-zinc-200 transition-colors">Telemetry</a>
              <a href="#faq" className="hover:text-zinc-200 transition-colors">FAQ</a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary py-1 px-2.5 text-xs"
            >
              <GithubIcon size={13} />
              <span className="hidden sm:inline">GitHub</span>
            </a>

            <button
              onClick={() => navigate(topics.length > 0 ? '/study' : '/app')}
              className="btn-primary py-1 px-3 text-xs"
            >
              {topics.length > 0 ? 'Resume Study' : 'Launch App'}
              <ArrowRight size={12} />
            </button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-20 pb-16 md:pt-28 md:pb-24 px-6 overflow-hidden">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Tag badge */}
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900/90 border border-zinc-800 text-xs text-zinc-300 mb-6 shadow-sm">
            <span className="flex h-2 w-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="font-mono text-[11px] text-zinc-400">
              E2 Hackathon · Powered by OpenRouter free models
            </span>
          </div>

          {/* Headline */}
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-zinc-100 max-w-4xl leading-[1.1] mb-6">
            Turn dense study material into active recall.
          </h1>

          {/* Subtitle */}
          <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto mb-8 leading-relaxed font-normal">
            Upload lecture notes, slide decks, or readings. AiLearner automatically synthesizes 3D flashcards, adaptive practice quizzes, and flags your weak topics in seconds.
          </p>

          {/* Action buttons */}
          <div className="flex flex-col sm:flex-row items-center gap-3 mb-16">
            <button
              onClick={() => navigate('/app')}
              className="btn-primary text-sm py-2.5 px-5 w-full sm:w-auto text-zinc-950 font-semibold"
            >
              <Sparkles size={14} />
              Upload Material & Generate Deck
              <ArrowRight size={14} />
            </button>

            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary text-sm py-2.5 px-5 w-full sm:w-auto font-mono text-xs"
            >
              <GithubIcon size={14} />
              gorlock777/AiLearner
            </a>
          </div>

          {/* ── Interactive Live Preview Mockup Card ── */}
          <div className="w-full max-w-3xl linear-card linear-card-highlight p-6 text-left shadow-2xl relative">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4 mb-5">
              <div className="flex items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 inline-block" />
                <span className="w-3 h-3 rounded-full bg-zinc-800 border border-zinc-700 inline-block" />
                <span className="text-xs text-zinc-400 font-mono ml-2">
                  interactive_study_session.ts
                </span>
              </div>
              <span className="badge badge-success text-[10px] font-mono">
                Active Simulation
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Left: Interactive 3D Card Simulation */}
              <div
                onClick={() => setPreviewFlipped((f) => !f)}
                className="cursor-pointer p-6 rounded-xl bg-zinc-900/80 border border-zinc-800 hover:border-zinc-700 transition-all flex flex-col justify-between h-52 relative group select-none shadow-sm"
              >
                <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                  <span className="uppercase font-semibold tracking-wider">
                    {previewFlipped ? 'Answer' : 'Question'}
                  </span>
                  <span className="text-[10px] text-zinc-400 group-hover:text-zinc-400">
                    Click to flip ↻
                  </span>
                </div>

                <div className="my-auto text-center">
                  <div className="text-sm font-medium text-zinc-200">
                    {previewFlipped
                      ? 'Vanishing gradient occurs when backpropagated gradients shrink exponentially, preventing early layers from training.'
                      : 'Why does the vanishing gradient problem occur in deep sigmoid networks?'}
                  </div>
                </div>

                <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 border-t border-zinc-800/60 pt-2">
                  <span>Topic: Neural Networks</span>
                  <span className="badge badge-default text-[9px]">Card 1/12</span>
                </div>
              </div>

              {/* Right: Interactive Quiz Question Simulation */}
              <div className="p-5 rounded-xl bg-zinc-900/50 border border-zinc-800 flex flex-col justify-between h-52">
                <div>
                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 mb-2">
                    <span className="uppercase font-semibold tracking-wider">Practice Quiz</span>
                    <span className="text-emerald-400">Score: 85%</span>
                  </div>
                  <div className="text-xs font-medium text-zinc-200 mb-3">
                    Which activation function prevents vanishing gradients for positive inputs?
                  </div>
                </div>

                <div className="flex flex-col gap-1.5">
                  {['Sigmoid', 'ReLU (Rectified Linear Unit)', 'Tanh'].map((opt, idx) => {
                    const isSelected = selectedAnswer === idx
                    const isCorrect = idx === 1
                    let style = 'bg-zinc-900/60 border-zinc-800 text-zinc-400 hover:bg-zinc-800'
                    if (isSelected) {
                      style = isCorrect
                        ? 'bg-emerald-950/40 border-emerald-500/60 text-emerald-200'
                        : 'bg-rose-950/40 border-rose-500/60 text-rose-200'
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedAnswer(idx)}
                        className={`text-left text-xs p-2 rounded-lg border flex items-center justify-between transition-colors ${style}`}
                      >
                        <span>{opt}</span>
                        {isSelected && isCorrect && <Check size={13} className="text-emerald-400" />}
                      </button>
                    )
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Step Pipeline ── */}
      <section id="pipeline" className="py-20 px-6 border-t border-zinc-800/80 bg-[#0c0c0e]/50">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-2">
              Autonomous Ingestion
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
              How notes become active learning
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="linear-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-300">
                  01
                </span>
                <span className="badge badge-default text-[10px] font-mono">Vision OCR</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                Ingest & OCR Document
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Drop PDF, Markdown, or raw text. Scanned slides or handwritten images are automatically transcribed via Multimodal Vision AI.
              </p>
            </div>

            <div className="linear-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-300">
                  02
                </span>
                <span className="badge badge-default text-[10px] font-mono">AI Synthesis</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                Topic Extraction & Cards
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                OpenRouter free models extract foundational-to-advanced topics, key concepts, and synthesize two-sided active flashcards.
              </p>
            </div>

            <div className="linear-card p-6 flex flex-col">
              <div className="flex items-center justify-between mb-4">
                <span className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-mono text-xs font-bold text-zinc-300">
                  03
                </span>
                <span className="badge badge-default text-[10px] font-mono">Telemetry</span>
              </div>
              <h3 className="text-base font-semibold text-zinc-100 mb-2">
                Adaptive Quiz & Weak Spots
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Test your retention with instant explanation feedback. Modules scoring under 60% are flagged for high-priority spaced review.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Feature Grid ── */}
      <section id="features" className="py-20 px-6 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="text-center mb-16">
            <span className="text-xs uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-2">
              Engineered for Speed
            </span>
            <h2 className="text-2xl sm:text-3xl font-semibold tracking-tight text-zinc-100">
              Built without fluff or clichés
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="linear-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Layers size={18} className="text-zinc-300" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Keyboard-First Spaced Repetition
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Navigate your study deck at the speed of thought using Space to flip, 1 to mark for review, and 2 for mastered.
              </p>
              <div className="flex items-center gap-1.5 font-mono text-[10px] text-zinc-500">
                <kbd className="kbd">Space</kbd>
                <kbd className="kbd">←</kbd>
                <kbd className="kbd">→</kbd>
                <kbd className="kbd">1</kbd>
                <kbd className="kbd">2</kbd>
              </div>
            </div>

            <div className="linear-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 size={18} className="text-zinc-300" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Adaptive Multiple Choice Tests
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Plausible distractors, real-time grading, and clear explanations that explain the exact reasoning behind correct answers.
              </p>
              <span className="badge badge-default text-[10px] font-mono">
                Instant Explanations
              </span>
            </div>

            <div className="linear-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <BarChart3 size={18} className="text-zinc-300" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Weak-Topic Detection
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Never waste time reviewing what you already know. Telemetry flags concepts under 60% for immediate targeted revision.
              </p>
              <span className="badge badge-warning text-[10px] font-mono">
                Priority Review Radar
              </span>
            </div>

            <div className="linear-card p-6">
              <div className="flex items-center gap-3 mb-3">
                <Shield size={18} className="text-zinc-300" />
                <h3 className="text-sm font-semibold text-zinc-100">
                  Zero-Backend Privacy
                </h3>
              </div>
              <p className="text-xs text-zinc-400 leading-relaxed mb-4">
                Everything runs directly in your browser. Documents and progress are stored in your local storage, never on a third-party server.
              </p>
              <span className="badge badge-success text-[10px] font-mono">
                100% Client-Side
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* ── Telemetry Stats Ticker ── */}
      <section id="telemetry" className="py-12 px-6 border-y border-zinc-800/80 bg-zinc-900/30">
        <div className="max-w-5xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100 mb-1">0s</div>
            <div className="text-xs text-zinc-400 font-mono">Backend Setup</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">100%</div>
            <div className="text-xs text-zinc-400 font-mono">Client-Side</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-blue-400 mb-1">~50/day</div>
            <div className="text-xs text-zinc-400 font-mono">Free AI Requests</div>
          </div>
          <div>
            <div className="text-2xl font-bold font-mono text-zinc-100 mb-1">PDF+OCR</div>
            <div className="text-xs text-zinc-400 font-mono">Native Support</div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-6 max-w-3xl mx-auto w-full">
        <div className="text-center mb-12">
          <h2 className="text-2xl font-semibold text-zinc-100 mb-2">
            Frequently Asked Questions
          </h2>
          <p className="text-xs text-zinc-400">Everything you need to know about the study engine</p>
        </div>

        <div className="flex flex-col gap-3">
          <div className="linear-card p-5">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              Which LLM models does this use?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              AiLearner uses the <code className="font-mono text-zinc-300">openrouter/free</code> router, which automatically selects available high-performance free models with vision and structured output capabilities.
            </p>
          </div>

          <div className="linear-card p-5">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              Can it handle scanned textbooks or lecture slide images?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Yes. If a PDF contains scanned images or slides without a selectable text layer, our automatic Multimodal Vision OCR renders the page frames and transcribes them into structured study notes.
            </p>
          </div>

          <div className="linear-card p-5">
            <h3 className="text-sm font-medium text-zinc-200 mb-2">
              Where is my data stored?
            </h3>
            <p className="text-xs text-zinc-400 leading-relaxed">
              All parsed text, generated flashcards, and test attempt history are saved locally in your browser’s <code className="font-mono text-zinc-300">localStorage</code> via Zustand.
            </p>
          </div>
        </div>
      </section>

      {/* ── CTA Banner & Footer ── */}
      <footer className="mt-auto border-t border-zinc-800/80 py-12 px-6 bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-3">
            <div className="w-7 h-7 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-xs text-white">
              AL
            </div>
            <span className="text-xs text-zinc-400">
              AiLearner · Built for E2 Hackathon 2026 by gorlock777
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => navigate('/app')}
              className="btn-primary py-1.5 px-4 text-xs"
            >
              Start Studying Now
              <ArrowRight size={13} />
            </button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
