import { useRef } from 'react'
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
  ChevronDown,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
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
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Scroll Progress across the 260vh hero track
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1: Main Headline & CTA (fades out as you plunge)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.3], [1, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.3], [0, -80])
  const heroScale = useTransform(scrollYProgress, [0, 0.3], [1, 0.92])

  // Black Hole 3D Camera Plunge
  const blackHoleScale = useTransform(scrollYProgress, [0, 0.65, 1], [1, 1.4, 1.75])
  const blackHoleY = useTransform(scrollYProgress, [0, 1], [0, 60])
  const blackHoleDistance = useTransform(scrollYProgress, [0, 0.8], [24, 12])

  // Phase 2: In-Flight Gravitational Insights (warps in at mid-scroll)
  const insightOpacity = useTransform(scrollYProgress, [0.32, 0.52, 0.76, 0.94], [0, 1, 1, 0])
  const insightY = useTransform(scrollYProgress, [0.32, 0.52, 0.76, 0.94], [80, 0, 0, -60])
  const insightScale = useTransform(scrollYProgress, [0.32, 0.52, 0.76, 0.94], [0.92, 1, 1, 0.96])

  // Scroll Indicator Fade
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.15], [1, 0])

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid">
      {/* ── Top Navigation Bar ── */}
      <header className="fixed top-0 z-50 w-full border-b border-zinc-800/80 bg-[#09090b]/80 backdrop-blur-md">
        <div className="max-w-6xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-6">
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className="w-7 h-7 rounded-lg border border-zinc-700 bg-zinc-900 flex items-center justify-center font-bold text-xs text-zinc-100 group-hover:border-zinc-500 transition-colors shadow-inner">
                AL
              </div>
              <span className="text-sm font-semibold tracking-tight text-zinc-100 group-hover:text-white font-mono">
                AiLearner
              </span>
            </Link>

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
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com/gorlock777/AiLearner"
              target="_blank"
              rel="noreferrer"
              className="btn-secondary h-8 px-3 text-xs"
            >
              <GithubIcon size={13} />
              <span className="hidden sm:inline font-mono text-[11px]">gorlock777/AiLearner</span>
            </a>

            <ShimmerButton
              onClick={() => navigate(topics.length > 0 ? '/study' : '/app')}
              className="h-8 px-4 text-xs font-mono"
            >
              <span>{topics.length > 0 ? 'Resume Study' : 'Launch Workspace'}</span>
              <ArrowRight size={12} />
            </ShimmerButton>
          </div>
        </div>
      </header>

      {/* ── 260vh Scroll-Driven Black Hole Cinema Container ── */}
      <div ref={scrollContainerRef} className="relative h-[260vh] w-full bg-black">
        {/* Sticky Viewport Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Black Hole 3D Layer with Scroll-Driven Transforms */}
          <motion.div
            style={{
              scale: blackHoleScale,
              y: blackHoleY,
            }}
            className="absolute inset-0 w-full h-full"
          >
            <BlackHoleHeroSection
              distance={24}
              elevation={-5.5}
              fov={42}
              glow={1.1}
              steps={240}
              resolution={0.7}
              scrim="none"
              className="w-full h-full"
            />
          </motion.div>

          {/* Radial Dark Vignette for Editorial Typography Readability */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial from-black/20 via-black/60 to-black/90"
          />

          {/* ── STAGE 1: Big Grand Merriweather Headline (Scroll 0% → 30%) ── */}
          <motion.div
            style={{
              opacity: heroOpacity,
              y: heroY,
              scale: heroScale,
            }}
            className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pointer-events-auto"
          >
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-950/85 border border-zinc-800 text-[11px] font-mono text-zinc-300 mb-6 backdrop-blur-md shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>The Singularity of Learning · OpenRouter Free</span>
            </div>

            {/* Giant Grand Merriweather Heading */}
            <h1 className="font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5rem] leading-[1.06] tracking-tight text-white mb-6 drop-shadow-2xl">
              Turn dense notes <br className="hidden sm:inline" />
              into effortless recall.
            </h1>

            <p className="max-w-xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-sans mb-8">
              AiLearner plunges complex study materials into active recall flashcards, 3D memory physics, and diagnostic test feedback.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <ShimmerButton
                onClick={() => navigate('/app')}
                className="px-6 py-3 text-xs font-mono"
              >
                <FileText size={14} />
                <span>Launch Free Workspace</span>
                <ArrowRight size={13} />
              </ShimmerButton>

              <a
                href="#pipeline"
                className="inline-flex items-center gap-2 rounded-lg border border-zinc-800 bg-zinc-900/80 px-5 py-3 text-xs font-mono text-zinc-300 hover:text-white hover:border-zinc-700 transition-colors backdrop-blur-sm"
              >
                <span>Explore Architecture</span>
              </a>
            </div>
          </motion.div>

          {/* ── STAGE 2: In-Flight Gravitational Insights (Scroll 35% → 80%) ── */}
          <motion.div
            style={{
              opacity: insightOpacity,
              y: insightY,
              scale: insightScale,
            }}
            className="absolute z-20 max-w-5xl mx-auto px-6 w-full pointer-events-none"
          >
            <div className="text-center mb-8">
              <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-emerald-400 font-semibold mb-2 block">
                Gravitational Synthesis Engine
              </span>
              <h2 className="font-heading font-normal text-3xl sm:text-4xl text-white tracking-tight">
                Three Pillars of Knowledge Ingestion
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-3">
                    <span>01 / INGESTION</span>
                    <ScanText size={16} />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-white mb-2">
                    Multimodal Vision OCR
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Processes scanned PDFs, lecture slides, and digital documents in-browser with zero upload to cloud storage.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-sky-400 mb-3">
                    <span>02 / STRUCTURE</span>
                    <Network size={16} />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-white mb-2">
                    3D Active Flashcards
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Deconstructs complex material into spring-animated 3D flipcards with keyboard recall navigation.
                  </p>
                </div>
              </div>

              <div className="p-6 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-amber-400 mb-3">
                    <span>03 / DIAGNOSTIC</span>
                    <GaugeCircle size={16} />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-white mb-2">
                    Adaptive Quizzing
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Diagnostic checkups with circular accuracy gauge dials and automated weak topic revision flags.
                  </p>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Floating Scroll Indicator */}
          <motion.div
            style={{ opacity: indicatorOpacity }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest pointer-events-none"
          >
            <span>Scroll to Enter Event Horizon</span>
            <ChevronDown size={14} className="animate-bounce text-emerald-400" />
          </motion.div>
        </div>
      </div>

      {/* ── 3-Step Precision Pipeline with KokonutUI SpotlightCards ── */}
      <section id="pipeline" className="py-24 px-6 border-t border-zinc-800/80 bg-[#0c0c0e] relative z-20">
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

      {/* ── Architecture & Capabilities Grid with KokonutUI SpotlightCards ── */}
      <section id="features" className="py-24 px-6 border-t border-zinc-800/80 bg-[#09090b] relative z-20">
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
      <section id="faq" className="py-24 px-6 border-t border-zinc-800/80 bg-[#0c0c0e] relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-400 font-semibold block mb-2">
              Reference
            </span>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-zinc-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-850 border border-zinc-800/80 rounded-2xl bg-zinc-950/60 shadow-xl overflow-hidden">
            <div className="p-6">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Which LLM models does AiLearner use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                AiLearner connects to the <code className="text-zinc-300 font-mono">openrouter/free</code> endpoint, automatically routing extraction prompts to high-performance models with structured JSON schema output support.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                How are scanned slides and textbooks parsed?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If digital text is detected via PDF.js, extraction runs instantly. If pages are scanned bitmap graphics, in-browser canvas renders the frames to base64 images and routes them through OpenRouter vision models for OCR synthesis.
              </p>
            </div>

            <div className="p-6">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Where is study data saved?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All data resides strictly in your browser's <code className="text-zinc-300 font-mono">localStorage</code>. No external database or login account is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Clean Footer ── */}
      <footer className="py-12 border-t border-zinc-800/80 bg-[#09090b] text-center text-xs font-mono text-zinc-500 relative z-20">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[10px] text-zinc-300">
              AL
            </div>
            <span>AiLearner — OpenRouter Free Ingestion</span>
          </div>
          <div>MIT License · High-Performance Local Storage Engine</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
