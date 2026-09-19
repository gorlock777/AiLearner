import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  Layers,
  ArrowRight,
  FileText,
  Check,
  RotateCcw,
  Sliders,
  Terminal,
  Activity,
  Cpu,
  BookOpen,
  Keyboard,
  ShieldCheck,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'

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

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  const [previewFlipped, setPreviewFlipped] = useState(false)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center font-bold text-[11px] text-white">
                AL
              </div>
              <span className="text-xs font-semibold tracking-tight text-zinc-100 group-hover:text-white font-mono">
                AiLearner
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs text-zinc-400">
              <a href="#pipeline" className="hover:text-zinc-200 transition-colors">
                Pipeline
              </a>
              <a href="#features" className="hover:text-zinc-200 transition-colors">
                Architecture
              </a>
              <a href="#telemetry" className="hover:text-zinc-200 transition-colors">
                Telemetry
              </a>
              <a href="#faq" className="hover:text-zinc-200 transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-2">
            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary h-7 px-2.5 text-xs"
            >
              <GithubIcon size={12} />
              <span className="hidden sm:inline font-mono text-[11px]">gorlock777/AiLearner</span>
            </a>

            <Button
              size="sm"
              onClick={() => navigate(topics.length > 0 ? '/study' : '/app')}
              className="h-7 text-xs"
            >
              {topics.length > 0 ? 'Resume Study' : 'Launch Workspace'}
              <ArrowRight size={11} />
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="relative pt-16 pb-14 md:pt-24 md:pb-20 px-6">
        <div className="max-w-5xl mx-auto text-center relative z-10 flex flex-col items-center">
          {/* Metadata Tag */}
          <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-6">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
            <span>OpenRouter Free Router · Zero-Backend Local Persistence</span>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-zinc-100 max-w-3xl leading-[1.15] mb-5">
            Turn dense study notes into active recall and diagnostic tests.
          </h1>

          {/* Subtitle */}
          <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto mb-8 leading-relaxed">
            Ingest PDFs, lecture slides, and notes. AiLearner extracts topic hierarchies, synthesizes spaced-repetition flashcards, and runs adaptive practice assessments.
          </p>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row items-center gap-2.5 mb-14">
            <Button
              size="lg"
              onClick={() => navigate('/app')}
              className="px-5 font-medium text-xs"
            >
              <FileText size={13} />
              Import Document
              <ArrowRight size={12} />
            </Button>

            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary h-9 px-4 text-xs font-mono"
            >
              <GithubIcon size={13} />
              Source on GitHub
            </a>
          </div>

          {/* ── Precision Product Interface Preview ── */}
          <div className="w-full max-w-4xl linear-card linear-card-highlight text-left overflow-hidden border border-zinc-800">
            {/* Window title bar */}
            <div className="flex items-center justify-between border-b border-zinc-800/80 px-4 py-2.5 bg-zinc-900/40 text-xs text-zinc-400 font-mono">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-sm bg-zinc-700 inline-block" />
                <span>workspace / deep_learning_fundamentals.pdf</span>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant="secondary">3 Topics Extracted</Badge>
                <Badge variant="success">Ready</Badge>
              </div>
            </div>

            {/* Split Workbench View */}
            <div className="grid grid-cols-1 md:grid-cols-12 divide-y md:divide-y-0 md:divide-x divide-zinc-800/80">
              {/* Left Column: Topics Tree */}
              <div className="md:col-span-4 p-4 bg-zinc-950/40 flex flex-col gap-2">
                <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-500 font-semibold px-1">
                  Extracted Concepts
                </div>

                <div className="p-2.5 rounded bg-zinc-900 border border-zinc-700/80 text-xs">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-200">Vanishing Gradients</span>
                    <Badge variant="warning">Hard</Badge>
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono">
                    6 cards · 4 questions
                  </div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/30 border border-zinc-800/60 text-xs opacity-75">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-300">Activation Functions</span>
                    <Badge variant="secondary">Mid</Badge>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    8 cards · 5 questions
                  </div>
                </div>

                <div className="p-2.5 rounded bg-zinc-900/30 border border-zinc-800/60 text-xs opacity-75">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-medium text-zinc-300">Backpropagation</span>
                    <Badge variant="secondary">Mid</Badge>
                  </div>
                  <div className="text-[11px] text-zinc-500 font-mono">
                    5 cards · 3 questions
                  </div>
                </div>
              </div>

              {/* Right Column: Live Interactive Card & Quiz Inspector */}
              <div className="md:col-span-8 p-5 flex flex-col gap-4">
                {/* Active Card Preview */}
                <div
                  onClick={() => setPreviewFlipped((f) => !f)}
                  className="cursor-pointer p-5 rounded border border-zinc-800 bg-[#121215] hover:border-zinc-700 transition-colors flex flex-col justify-between min-h-[140px] select-none"
                >
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400">
                    <span className="uppercase text-[10px] text-zinc-400">
                      {previewFlipped ? 'Answer / Concept Details' : 'Flashcard Question'}
                    </span>
                    <span className="flex items-center gap-1 text-zinc-400">
                      <kbd className="kbd">Space</kbd> Flip
                    </span>
                  </div>

                  <div className="py-3 text-center">
                    <p className="text-xs sm:text-sm font-medium text-zinc-200 leading-relaxed max-w-lg mx-auto">
                      {previewFlipped
                        ? 'Repeated multiplication of derivatives smaller than 1 causes gradient signals to exponentially decay as they propagate to initial layers.'
                        : 'Why does the vanishing gradient problem prevent convergence in deep neural networks?'}
                    </p>
                  </div>

                  <div className="flex items-center justify-between text-[10px] font-mono text-zinc-400 pt-2 border-t border-zinc-800/60">
                    <span>Active Recall Mode</span>
                    <span>Card 1 / 6</span>
                  </div>
                </div>

                {/* Inline Multiple Choice Simulation */}
                <div className="p-4 rounded border border-zinc-800 bg-zinc-900/40">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 mb-2.5">
                    <span>PRACTICE DIAGNOSTIC</span>
                    <span className="text-emerald-400">Accuracy 88%</span>
                  </div>

                  <div className="text-xs font-medium text-zinc-200 mb-3">
                    Which activation function solves the vanishing gradient issue for positive activations?
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {['Sigmoid', 'ReLU', 'Tanh'].map((opt, idx) => {
                      const isSelected = selectedAnswer === idx
                      const isCorrect = idx === 1
                      let style = 'bg-zinc-900 border-zinc-800 text-zinc-300 hover:border-zinc-700'
                      if (isSelected) {
                        style = isCorrect
                          ? 'bg-emerald-950/30 border-emerald-500/40 text-emerald-300'
                          : 'bg-rose-950/30 border-rose-500/40 text-rose-300'
                      }

                      return (
                        <button
                          key={idx}
                          onClick={() => setSelectedAnswer(idx)}
                          className={`p-2 rounded border text-left text-xs flex items-center justify-between transition-colors font-mono ${style}`}
                        >
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] text-zinc-400">{String.fromCharCode(65 + idx)}.</span>
                            <span>{opt}</span>
                          </div>
                          {isSelected && isCorrect && <Check size={12} className="text-emerald-400" />}
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-16 px-6 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-1">
              Architecture
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              System Ingestion & Practice Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-zinc-400">01 / INGESTION</span>
                <Badge variant="secondary">Vision OCR</Badge>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                Multi-Format Document Parser
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Processes PDF, Markdown, and TXT. If a PDF contains image-only slides or scanned textbook pages, dynamic canvas rendering runs multimodal vision OCR via free OpenRouter models.
              </p>
            </div>

            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-zinc-400">02 / STRUCTURE</span>
                <Badge variant="secondary">JSON Schema</Badge>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                Topic Extraction & Cards
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Extracts topic hierarchies and key concepts without emoji fluff. Generates two-sided flashcards equipped with hint metadata for active recall.
              </p>
            </div>

            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-zinc-400">03 / DIAGNOSTIC</span>
                <Badge variant="secondary">Adaptive Quiz</Badge>
              </div>
              <h3 className="text-sm font-semibold text-zinc-100 mb-1.5">
                Assessment & Weak Spot Tracking
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Runs multiple-choice checks with instant explanations. Topics scoring below 60% are flagged as high-priority revision targets in your analytics stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture & Features Grid ── */}
      <section id="features" className="py-16 px-6 border-t border-zinc-800/80">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-1">
              Capabilities
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              Built for Fast, Distraction-Free Study
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-zinc-300">
                <ShieldCheck size={15} />
                <h4 className="text-xs font-semibold">100% Client-Side</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Zero database dependencies. All uploaded documents, flashcards, and test attempts remain in your browser’s localStorage.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-zinc-300">
                <Keyboard size={15} />
                <h4 className="text-xs font-semibold">Keyboard First</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Navigate decks with Space to flip, 1 for needs review, 2 for mastered, and arrow keys for traversal.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-zinc-300">
                <Cpu size={15} />
                <h4 className="text-xs font-semibold">Free LLM Router</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Powered by OpenRouter free router models with structured JSON schema outputs and vision support.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-zinc-300">
                <Activity size={15} />
                <h4 className="text-xs font-semibold">Retention Stream</h4>
              </div>
              <p className="text-[11px] text-zinc-400 leading-relaxed">
                Continuous accuracy telemetry and daily consecutive streak calculation across all quiz attempts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-16 px-6 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-1">
              Reference
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-zinc-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-800/80 border border-zinc-800 rounded bg-zinc-950/40">
            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1">
                Which LLM models does AiLearner use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed font-mono text-[11px]">
                AiLearner connects to the openrouter/free endpoint, routing requests to high-speed models with structured output and multimodal vision capabilities.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1">
                How are scanned PDFs or slide screenshots handled?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When a PDF lacks a selectable text layer, the in-browser parser renders each page onto a canvas and triggers vision OCR to transcribe the slide frames into text.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1">
                Where is study data stored?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All data is stored directly in your browser’s localStorage via Zustand. No account creation or server database required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-zinc-800/80 py-8 px-6 bg-[#09090b]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-white">
              AL
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              AiLearner · E2 Hackathon 2026 · gorlock777
            </span>
          </div>

          <div className="flex items-center gap-3">
            <Button
              size="sm"
              onClick={() => navigate('/app')}
              className="text-xs"
            >
              Open Workspace
              <ArrowRight size={12} />
            </Button>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
