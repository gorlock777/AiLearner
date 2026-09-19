import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Activity,
  Cpu,
  Keyboard,
  ShieldCheck,
  Zap,
  Sparkles,
  Layers,
  CheckCircle2,
  ScanText,
  Network,
  GaugeCircle,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'

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

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/85 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center font-bold text-[11px] text-zinc-100 group-hover:border-zinc-500 transition-colors">
                AL
              </div>
              <span className="text-xs font-semibold tracking-tight text-zinc-100 group-hover:text-white font-mono">
                AiLearner
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-5 text-xs text-zinc-400">
              <a href="#pipeline" className="hover:text-zinc-200 transition-colors">
                Pipeline
              </a>
              <a href="#features" className="hover:text-zinc-200 transition-colors">
                Architecture
              </a>
              <a href="#faq" className="hover:text-zinc-200 transition-colors">
                FAQ
              </a>
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary h-7 px-2.5 text-xs"
            >
              <GithubIcon size={12} />
              <span className="hidden sm:inline font-mono text-[11px]">gorlock777/AiLearner</span>
            </a>

            <ShimmerButton
              onClick={() => navigate(topics.length > 0 ? '/study' : '/app')}
              className="h-7 px-3 text-xs"
            >
              <span>{topics.length > 0 ? 'Resume Study' : 'Launch Workspace'}</span>
              <ArrowRight size={11} />
            </ShimmerButton>
          </div>
        </div>
      </header>

      {/* ── Hero Section with Schwarzschild WebGL Canvas ── */}
      <section className="relative min-h-[92svh] w-full md:min-h-[720px] overflow-hidden bg-black">
        <BlackHoleHeroSection
          distance={24}
          elevation={-5.5}
          fov={42}
          glow={1}
          steps={300}
          resolution={0.7}
          scrim="left"
          scrimStrength={0.9}
        >
          <div className="flex h-full min-h-[92svh] items-start px-6 pt-14 sm:px-10 md:min-h-[720px] md:items-center md:pt-0 lg:px-20">
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, ease: 'easeOut' }}
              className="max-w-[36rem]"
            >
              <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950/80 border border-zinc-800 text-[11px] font-mono text-zinc-400 mb-5 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>OpenRouter Neural Synthesis · 100% Client Side</span>
              </div>

              <h1 className="font-heading text-[2.5rem] font-normal leading-[1.08] tracking-tight text-zinc-100 sm:text-6xl lg:text-[4.25rem]">
                Turn dense notes
                <br />
                into mastery
              </h1>

              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-zinc-400 md:mt-7">
                AiLearner transforms complex study notes into active recall decks, spaced repetition, and adaptive diagnostic practice — with zero database dependencies.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <ShimmerButton
                  onClick={() => navigate('/app')}
                  className="px-6 py-2.5 text-xs font-mono"
                >
                  <FileText size={13} />
                  <span>Launch Workspace</span>
                  <ArrowRight size={12} />
                </ShimmerButton>

                <a
                  href="https://github.com/gorlock777/AiLearner"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-zinc-800 bg-zinc-900/60 px-5 py-2.5 text-xs font-medium text-zinc-300 transition hover:border-zinc-700 hover:text-white"
                >
                  <GithubIcon size={13} />
                  <span>GitHub Repository</span>
                </a>
              </div>
            </motion.div>
          </div>
        </BlackHoleHeroSection>
      </section>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-20 px-6 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-5xl mx-auto">
          <SpotlightCards
            eyebrow="Architecture"
            heading="System Ingestion & Practice Loop"
            columns={3}
            items={[
              {
                icon: ScanText,
                title: "Multi-Format Document Parser",
                description: "Processes PDF, Markdown, and TXT. When a PDF contains scanned pages or slides, in-browser canvas rendering triggers multimodal vision OCR via free OpenRouter models.",
                color: "#34d399",
                badge: "Vision OCR",
              },
              {
                icon: Network,
                title: "Topic Extraction & Cards",
                description: "Extracts topic hierarchies and key concepts without emoji fluff. Generates two-sided 3D flashcards with spring physics and keyboard shortcuts.",
                color: "#60a5fa",
                badge: "JSON Schema",
              },
              {
                icon: GaugeCircle,
                title: "Assessment & Weak Spot Tracking",
                description: "Runs multiple-choice checks with instant explanations and circular gauge accuracy dials. Topics scoring below 60% are flagged for priority revision.",
                color: "#a78bfa",
                badge: "Adaptive Quiz",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── Architecture & Capabilities Grid ── */}
      <section id="features" className="py-20 px-6 border-t border-zinc-800/80 bg-[#09090b]">
        <div className="max-w-5xl mx-auto">
          <SpotlightCards
            eyebrow="Capabilities"
            heading="Built for Fast, Distraction-Free Study"
            columns={4}
            items={[
              {
                icon: ShieldCheck,
                title: "100% Client-Side",
                description: "Zero server databases. All uploaded documents, flashcard decks, and quiz attempts persist directly in browser localStorage.",
                color: "#34d399",
              },
              {
                icon: Keyboard,
                title: "Keyboard First",
                description: "Navigate decks with Space to flip, 1 for hard, 2 for mastered, and arrow keys for a fully mouse-free study flow.",
                color: "#e4e4e7",
              },
              {
                icon: Cpu,
                title: "Free LLM Router",
                description: "Integrated with OpenRouter free router models with structured JSON schema outputs and vision OCR fallbacks.",
                color: "#60a5fa",
              },
              {
                icon: Activity,
                title: "Retention Stream",
                description: "Continuous accuracy telemetry, circular score gauges, and daily streak calculations across all practice tests.",
                color: "#f59e0b",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>


      {/* ── FAQ Section ── */}
      <section id="faq" className="py-20 px-6 border-t border-zinc-800/80 bg-[#0c0c0e]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-wider font-mono text-zinc-400 font-semibold block mb-1">
              Reference
            </span>
            <h2 className="font-heading text-2xl font-normal tracking-tight text-zinc-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-800 border border-zinc-800 rounded bg-zinc-900/40">
            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1 font-mono">
                Which LLM models does AiLearner use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                AiLearner connects to the <code className="text-zinc-300 font-mono">openrouter/free</code> endpoint, automatically routing extraction prompts to high-performance models with structured JSON schema output support.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1 font-mono">
                How are scanned PDFs or slide screenshots handled?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                When a PDF lacks an embedded text layer, the in-browser parser renders each page onto an HTML5 canvas and triggers multimodal vision OCR to transcribe the slide frames into clean text.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-zinc-200 mb-1 font-mono">
                Where is study data stored?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All data is stored directly in your browser's localStorage via Zustand. No account creation, login, or remote database is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-zinc-800/80 py-8 px-6 bg-[#09090b]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded border border-zinc-700 bg-zinc-900 flex items-center justify-center font-bold text-[10px] text-zinc-100">
              AL
            </div>
            <span className="text-xs text-zinc-400 font-mono">
              AiLearner · E2 Hackathon 2026 · gorlock777
            </span>
          </div>

          <div className="flex items-center gap-3">
            <ShimmerButton
              onClick={() => navigate('/app')}
              className="text-xs px-3 py-1.5"
            >
              <span>Launch Workspace</span>
              <ArrowRight size={12} />
            </ShimmerButton>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
