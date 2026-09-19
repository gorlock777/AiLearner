import { useNavigate, Link } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Activity,
  Cpu,
  Keyboard,
  ShieldCheck,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Badge } from '../components/ui/badge'
import { Button } from '../components/ui/button'
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section'

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
    <div className="min-h-screen bg-[#FAFAF8] text-[#1A1A1A] flex flex-col selection:bg-[rgba(0,0,0,0.08)] selection:text-white linear-grid">
      {/* ── Top Navigation Bar ── */}
      <header className="sticky top-0 z-50 w-full border-b border-[rgba(0,0,0,0.08)] bg-[#FAFAF8]/90 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-12 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-6 h-6 rounded border border-[rgba(0,0,0,0.1)] flex items-center justify-center font-bold text-[11px] text-[#1A1A1A]">
                AL
              </div>
              <span className="text-xs font-semibold tracking-tight text-[#1A1A1A] group-hover:text-black font-mono">
                AiLearner
              </span>
            </Link>

            <nav className="hidden md:flex items-center gap-4 text-xs text-[rgba(0,0,0,0.4)]">
              <a href="#pipeline" className="hover:text-[rgba(0,0,0,0.6)] transition-colors">
                Pipeline
              </a>
              <a href="#features" className="hover:text-[rgba(0,0,0,0.6)] transition-colors">
                Architecture
              </a>
              <a href="#telemetry" className="hover:text-[rgba(0,0,0,0.6)] transition-colors">
                Telemetry
              </a>
              <a href="#faq" className="hover:text-[rgba(0,0,0,0.6)] transition-colors">
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
      <section className="relative min-h-[92svh] w-full md:min-h-[720px] overflow-hidden">
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
            <div className="max-w-[34rem]">
              <h1 className="text-[2.5rem] font-light leading-[1.05] tracking-[-0.03em] text-[#1A1A1A] sm:text-6xl lg:text-[4.25rem]">
                Turn dense notes
                <br />
                into mastery
              </h1>

              <p className="mt-6 max-w-md text-[0.95rem] leading-relaxed text-[rgba(0,0,0,0.6)] md:mt-7">
                AiLearner transforms your study notes into active recall, spaced repetition, and adaptive diagnostic practice — 100% in your browser.
              </p>

              <div className="mt-8 flex flex-wrap items-center gap-3 md:mt-10">
                <Button
                  size="lg"
                  onClick={() => navigate('/app')}
                  className="px-6 py-3 text-sm font-medium text-black"
                >
                  <FileText size={14} />
                  Import Document
                </Button>
                <a
                  href="https://github.com/gorlock777/AiLearner"
                  target="_blank"
                  rel="noreferrer"
                  className="inline-flex items-center gap-2 rounded-md border border-[rgba(0,0,0,0.1)] px-6 py-3 text-sm text-[rgba(0,0,0,0.6)] transition hover:border-[rgba(0,0,0,0.2)] hover:text-[rgba(0,0,0,0.8)]"
                >
                  <GithubIcon size={13} />
                  Source on GitHub
                </a>
              </div>
            </div>
          </div>
        </BlackHoleHeroSection>
      </section>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-16 px-6 border-t border-[rgba(0,0,0,0.08)] bg-[#F0EFEB]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-wider font-mono text-[rgba(0,0,0,0.4)] font-semibold block mb-1">
              Architecture
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
              System Ingestion & Practice Loop
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[rgba(0,0,0,0.4)]">01 / INGESTION</span>
                <Badge variant="secondary">Vision OCR</Badge>
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Multi-Format Document Parser
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed">
                Processes PDF, Markdown, and TXT. If a PDF contains image-only slides or scanned textbook pages, dynamic canvas rendering runs multimodal vision OCR via free OpenRouter models.
              </p>
            </div>

            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[rgba(0,0,0,0.4)]">02 / STRUCTURE</span>
                <Badge variant="secondary">JSON Schema</Badge>
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Topic Extraction & Cards
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed">
                Extracts topic hierarchies and key concepts without emoji fluff. Generates two-sided flashcards equipped with hint metadata for active recall.
              </p>
            </div>

            <div className="linear-card p-5 flex flex-col">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="text-[rgba(0,0,0,0.4)]">03 / DIAGNOSTIC</span>
                <Badge variant="secondary">Adaptive Quiz</Badge>
              </div>
              <h3 className="text-sm font-semibold text-[#1A1A1A] mb-1.5">
                Assessment & Weak Spot Tracking
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed">
                Runs multiple-choice checks with instant explanations. Topics scoring below 60% are flagged as high-priority revision targets in your analytics stream.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Architecture & Features Grid ── */}
      <section id="features" className="py-16 px-6 border-t border-[rgba(0,0,0,0.08)]">
        <div className="max-w-5xl mx-auto">
          <div className="mb-10">
            <span className="text-[10px] uppercase tracking-wider font-mono text-[rgba(0,0,0,0.4)] font-semibold block mb-1">
              Capabilities
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
              Built for Fast, Distraction-Free Study
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-[rgba(0,0,0,0.3)]">
                <ShieldCheck size={15} />
                <h4 className="text-xs font-semibold">100% Client-Side</h4>
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed">
                Zero database dependencies. All uploaded documents, flashcards, and test attempts remain in your browser’s localStorage.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-[rgba(0,0,0,0.3)]">
                <Keyboard size={15} />
                <h4 className="text-xs font-semibold">Keyboard First</h4>
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed">
                Navigate decks with Space to flip, 1 for needs review, 2 for mastered, and arrow keys for traversal.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-[rgba(0,0,0,0.3)]">
                <Cpu size={15} />
                <h4 className="text-xs font-semibold">Free LLM Router</h4>
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed">
                Powered by OpenRouter free router models with structured JSON schema outputs and vision support.
              </p>
            </div>

            <div className="linear-card p-4">
              <div className="flex items-center gap-2 mb-2 text-[rgba(0,0,0,0.3)]">
                <Activity size={15} />
                <h4 className="text-xs font-semibold">Retention Stream</h4>
              </div>
              <p className="text-[11px] text-[rgba(0,0,0,0.4)] leading-relaxed">
                Continuous accuracy telemetry and daily consecutive streak calculation across all quiz attempts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-16 px-6 border-t border-[rgba(0,0,0,0.08)] bg-[#F0EFEB]">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8">
            <span className="text-[10px] uppercase tracking-wider font-mono text-[rgba(0,0,0,0.4)] font-semibold block mb-1">
              Reference
            </span>
            <h2 className="text-xl font-semibold tracking-tight text-[#1A1A1A]">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[rgba(0,0,0,0.08)] border border-[rgba(0,0,0,0.08)] rounded bg-[rgba(0,0,0,0.02)]">
            <div className="p-4">
              <h3 className="text-xs font-medium text-[rgba(0,0,0,0.2)] mb-1">
                Which LLM models does AiLearner use?
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed font-mono text-[11px]">
                AiLearner connects to the openrouter/free endpoint, routing requests to high-speed models with structured output and multimodal vision capabilities.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-[rgba(0,0,0,0.2)] mb-1">
                How are scanned PDFs or slide screenshots handled?
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed">
                When a PDF lacks a selectable text layer, the in-browser parser renders each page onto a canvas and triggers vision OCR to transcribe the slide frames into text.
              </p>
            </div>

            <div className="p-4">
              <h3 className="text-xs font-medium text-[rgba(0,0,0,0.2)] mb-1">
                Where is study data stored?
              </h3>
              <p className="text-xs text-[rgba(0,0,0,0.4)] leading-relaxed">
                All data is stored directly in your browser’s localStorage via Zustand. No account creation or server database required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="mt-auto border-t border-[rgba(0,0,0,0.08)] py-8 px-6 bg-[#FAFAF8]">
        <div className="max-w-5xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <div className="w-5 h-5 rounded border border-[rgba(0,0,0,0.08)] flex items-center justify-center font-bold text-[10px] text-[#1A1A1A]">
              AL
            </div>
            <span className="text-xs text-[rgba(0,0,0,0.4)] font-mono">
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
