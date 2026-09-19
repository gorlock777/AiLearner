import { useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  Activity,
  Cpu,
  Keyboard,
  ShieldCheck,
  ScanText,
  Network,
  GaugeCircle,
  Sparkles,
  ChevronDown,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'
import { FloatingNavbar } from '../components/ui/floating-navbar'

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()
  const scrollContainerRef = useRef<HTMLDivElement>(null)

  // Extended 320vh scroll sequence for generous, unhurried animation time
  const { scrollYProgress } = useScroll({
    target: scrollContainerRef,
    offset: ['start start', 'end end'],
  })

  // Phase 1: Giant Merriweather Headline (generous fade over 0% to 35% of scroll)
  const heroOpacity = useTransform(scrollYProgress, [0, 0.28, 0.38], [1, 0.8, 0])
  const heroY = useTransform(scrollYProgress, [0, 0.38], [0, -90])
  const heroScale = useTransform(scrollYProgress, [0, 0.38], [1, 0.92])

  // Black Hole 3D Plunge (ultra-smooth progressive scale & camera move)
  const blackHoleScale = useTransform(scrollYProgress, [0, 0.6, 1], [1, 1.35, 1.65])
  const blackHoleY = useTransform(scrollYProgress, [0, 1], [0, 80])

  // Phase 2: In-Flight Gravitational Insights (generous display between 38% and 78%)
  const insightOpacity = useTransform(scrollYProgress, [0.35, 0.48, 0.72, 0.86], [0, 1, 1, 0])
  const insightY = useTransform(scrollYProgress, [0.35, 0.48, 0.72, 0.86], [70, 0, 0, -60])
  const insightScale = useTransform(scrollYProgress, [0.35, 0.48, 0.72, 0.86], [0.94, 1, 1, 0.96])

  // Scroll Indicator Fade
  const indicatorOpacity = useTransform(scrollYProgress, [0, 0.12], [1, 0])

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid overflow-x-hidden">
      {/* ── Luxury Floating Dynamic Island Navigation ── */}
      <FloatingNavbar hasTopics={topics.length > 0} />

      {/* ── Extended 320vh Scroll-Driven Black Hole Cinema Container ── */}
      <div ref={scrollContainerRef} className="relative h-[320vh] w-full bg-black">
        {/* Sticky Viewport Stage */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex items-center justify-center">
          {/* Black Hole 3D Layer (Performance Optimized: steps 110, resolution 0.55, maxDpr 1.0 for locked 60fps) */}
          <motion.div
            style={{
              scale: blackHoleScale,
              y: blackHoleY,
            }}
            className="absolute inset-0 w-full h-full pointer-events-none"
          >
            <BlackHoleHeroSection
              distance={24}
              elevation={-5.5}
              fov={42}
              glow={1.15}
              steps={110}
              resolution={0.55}
              maxDpr={1.0}
              scrim="none"
              className="w-full h-full"
            />
          </motion.div>

          {/* Soft Radial Ambient Lighting Layer */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 bg-radial from-black/15 via-black/55 to-[#070709]"
          />

          {/* ── STAGE 1: Big Grand Merriweather Headline (Scroll 0% → 35%) ── */}
          <motion.div
            style={{
              opacity: heroOpacity,
              y: heroY,
              scale: heroScale,
            }}
            className="relative z-20 max-w-4xl mx-auto px-6 text-center flex flex-col items-center pointer-events-auto"
          >
            {/* Ambient Badge */}
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 text-[11px] font-mono text-zinc-300 mb-6 backdrop-blur-md shadow-2xl">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Eureka · Neural Active Recall Engine</span>
            </div>

            {/* Giant Grand Merriweather Heading */}
            <h1 className="font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.05] tracking-tight text-white mb-6 drop-shadow-2xl">
              Turn dense notes <br className="hidden sm:inline" />
              into effortless recall.
            </h1>

            <p className="max-w-xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-sans mb-8">
              Eureka transforms complex lecture notes and textbooks into 3D active flashcards, spaced memory intervals, and diagnostic test insights.
            </p>

            <div className="flex flex-wrap items-center justify-center gap-4">
              <ShimmerButton
                onClick={() => navigate('/app')}
                className="px-7 py-3 text-xs font-mono rounded-full"
              >
                <FileText size={14} />
                <span>Launch Eureka Workspace</span>
                <ArrowRight size={13} />
              </ShimmerButton>

              <a
                href="#pipeline"
                className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/20 transition-all backdrop-blur-md"
              >
                <span>Explore Architecture</span>
              </a>
            </div>
          </motion.div>

          {/* ── STAGE 2: In-Flight Gravitational Insights (Scroll 38% → 78%) ── */}
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
                The Eureka Ingestion Engine
              </span>
              <h2 className="font-heading font-normal text-3xl sm:text-4xl text-white tracking-tight">
                Three Pillars of Deep Comprehension
              </h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
                <div>
                  <div className="flex items-center justify-between text-xs font-mono text-emerald-400 mb-3">
                    <span>01 / INGESTION</span>
                    <ScanText size={16} />
                  </div>
                  <h3 className="font-heading text-lg font-normal text-white mb-2">
                    Multimodal Vision OCR
                  </h3>
                  <p className="text-xs text-zinc-300 leading-relaxed">
                    Processes scanned PDFs, lecture slides, and digital documents in-browser with zero upload to external servers.
                  </p>
                </div>
              </div>

              <div className="p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
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

              <div className="p-7 rounded-2xl bg-zinc-950/80 border border-white/10 backdrop-blur-xl shadow-2xl flex flex-col justify-between">
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

      {/* ── 3-Step Precision Pipeline with Soft Gradient SpotlightCards ── */}
      <section id="pipeline" className="py-24 px-6 border-t border-white/[0.06] bg-[#09090d] relative z-10">
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

      {/* ── Architecture & Capabilities Grid with Soft Gradient SpotlightCards ── */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.06] bg-[#070709] relative z-10">
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

      {/* ── FAQ Section with Luxury Card Style ── */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.06] bg-[#09090d] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-400 font-semibold block mb-2">
              Reference
            </span>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-zinc-100">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.06] luxury-card overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Which LLM models does Eureka use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Eureka connects to the <code className="text-zinc-300 font-mono">openrouter/free</code> endpoint, automatically routing extraction prompts to high-performance models with structured JSON schema output support.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                How are scanned slides and textbooks parsed?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If digital text is detected via PDF.js, extraction runs instantly. If pages are scanned bitmap graphics, in-browser canvas renders the frames to base64 images and routes them through OpenRouter vision models for OCR synthesis.
              </p>
            </div>

            <div className="p-6 md:p-8">
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
      <footer className="py-12 border-t border-white/[0.06] bg-[#070709] text-center text-xs font-mono text-zinc-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-full bg-gradient-to-tr from-emerald-500 to-indigo-500 flex items-center justify-center font-bold text-[9px] text-white">
              EU
            </div>
            <span>Eureka — OpenRouter Free Ingestion Engine</span>
          </div>
          <div>MIT License · High-Performance Client Architecture</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
