import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  FileText,
  ScanText,
  Network,
  GaugeCircle,
  ShieldCheck,
  Keyboard,
  Cpu,
  Activity,
  ChevronDown,
} from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { CosmicHero } from '../components/ui/cosmic-hero'
import { LivePreviewBento } from '../components/ui/live-preview-bento'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'
import { FloatingNavbar } from '../components/ui/floating-navbar'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { lenisGlobal } from '../components/layout/SmoothScroll'

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  // ── Multi-layer Smooth Parallax Transforms ──
  const { scrollY } = useScroll()
  const heroTextY = useTransform(scrollY, [0, 500], [0, -80])
  const heroTextOpacity = useTransform(scrollY, [0, 400], [1, 0.25])
  const heroTextScale = useTransform(scrollY, [0, 500], [1, 0.95])

  const bentoY = useTransform(scrollY, [0, 500], [50, -30])
  const bentoScale = useTransform(scrollY, [0, 450], [0.94, 1])

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid overflow-x-hidden">
      {/* ── Luminous Floating Dynamic Island Navigation ── */}
      <FloatingNavbar hasTopics={topics.length > 0} />

      {/* ── Big Centered Hero with Celestial Astrolabe Orbits & Parallax Depth ── */}
      <CosmicHero>
        {/* Parallax Hero Headline & CTA Block */}
        <motion.div
          style={{ y: heroTextY, opacity: heroTextOpacity, scale: heroTextScale }}
          className="w-full flex flex-col items-center will-change-transform"
        >
          {/* Big Grand Merriweather Headline (Starlight Metallic Rim Gradient) */}
          <motion.h1
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="font-heading font-normal text-4xl sm:text-6xl md:text-7xl lg:text-[5.25rem] leading-[1.05] tracking-tight text-transparent bg-clip-text bg-gradient-to-b from-white via-zinc-100 to-zinc-400/75 mb-6 drop-shadow-[0_4px_20px_rgba(255,255,255,0.14)] drop-shadow-[0_16px_40px_rgba(0,0,0,0.95)]"
          >
            Turn dense notes <br className="hidden sm:inline" />
            into effortless recall.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="max-w-2xl text-sm sm:text-base md:text-lg text-zinc-300 leading-relaxed font-sans mb-8"
          >
            Eureka transforms complex lecture notes and textbooks into 3D active flashcards,
            spaced memory intervals, and diagnostic test insights — completely in-browser.
          </motion.p>

          {/* Hero Action Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="flex flex-wrap items-center justify-center gap-4 mb-10"
          >
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
              onClick={(e) => {
                e.preventDefault()
                lenisGlobal.scrollTo('#pipeline', { offset: -60, duration: 1.2 })
              }}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/20 transition-all backdrop-blur-md cursor-pointer"
            >
              <span>Explore Architecture</span>
            </a>
          </motion.div>

          {/* Scroll Indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.4 }}
            className="flex flex-col items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest mb-12"
          >
            <span>Scroll to charge warp engine</span>
            <ChevronDown size={14} className="animate-bounce text-emerald-400" />
          </motion.div>
        </motion.div>

        {/* Live Interactive Ingestion Simulator with Smooth Parallax Rise */}
        <motion.div
          style={{ y: bentoY, scale: bentoScale }}
          className="w-full will-change-transform"
        >
          <LivePreviewBento onLaunch={() => navigate('/app')} />
        </motion.div>
      </CosmicHero>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-24 px-6 border-t border-white/[0.06] bg-[#0d0e12]/30 relative z-10">
        <div className="max-w-5xl mx-auto">
          <SpotlightCards
            eyebrow="Architecture"
            heading="System Ingestion & Practice Loop"
            columns={3}
            items={[
              {
                icon: ScanText,
                title: "Multi-Format Document Parser",
                description: "Processes PDF, Markdown, and TXT. When a PDF contains scanned pages or slides, in-browser canvas rendering triggers multimodal vision OCR models.",
                color: "#e4e4e7",
                badge: "Vision OCR",
              },
              {
                icon: Network,
                title: "Topic Extraction & Cards",
                description: "Extracts topic hierarchies and key concepts without fluff. Generates two-sided 3D flashcards with spring physics and keyboard shortcuts.",
                color: "#34d399",
                badge: "JSON Schema",
              },
              {
                icon: GaugeCircle,
                title: "Assessment & Weak Spot Tracking",
                description: "Runs multiple-choice checks with instant explanations and circular gauge accuracy dials. Topics scoring below 60% are flagged for priority revision.",
                color: "#fbbf24",
                badge: "Adaptive Quiz",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section id="features" className="py-24 px-6 border-t border-white/[0.06] bg-transparent relative z-10">
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
                description: "Navigate decks with Space to flip, 1 for review, 2 for mastered, and arrow keys for a fully mouse-free study flow.",
                color: "#e4e4e7",
              },
              {
                icon: Cpu,
                title: "Neural Extraction",
                description: "Structured JSON schema reasoning models extract core topic hierarchies and diagnostic questions instantly.",
                color: "#60a5fa",
              },
              {
                icon: Activity,
                title: "Retention Analytics",
                description: "Continuous mastery tracking, circular score gauges, and spaced recall streak calculations across all practice tests.",
                color: "#fbbf24",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── FAQ Section ── */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.06] bg-[#0d0e12]/30 relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-400 font-semibold block mb-2">
              Reference
            </span>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.08] rounded-2xl bg-[#12141e]/50 backdrop-blur-sm border border-white/[0.1] shadow-2xl overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Which AI models does Eureka use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Eureka runs structured JSON schema models with multimodal vision OCR fallback, ensuring zero hallucination and high-precision flashcards.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                How are scanned slides and textbooks parsed?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                If digital text is detected via PDF.js, extraction runs instantly. If pages are scanned bitmap graphics, in-browser canvas renders the frames to base64 images and routes them through vision models for OCR synthesis.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Where is study data saved?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                All data resides strictly in your browser's <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10">localStorage</code>. No external database or login account is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-12 border-t border-white/[0.06] bg-transparent text-center text-xs font-mono text-zinc-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-900 border border-white/10 text-white flex items-center justify-center font-bold text-[9px] font-mono">
              EU
            </div>
            <span className="text-zinc-300 font-semibold">Eureka</span>
          </div>
          <div className="text-zinc-500">MIT License · Lunar Space Titanium Architecture</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
