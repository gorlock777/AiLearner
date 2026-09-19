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
  ChevronDown,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { CosmicAuroraHero } from '../components/ui/cosmic-aurora-hero'
import { LivePreviewBento } from '../components/ui/live-preview-bento'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'
import { FloatingNavbar } from '../components/ui/floating-navbar'

import { CinematicTitle } from '../components/ui/cinematic-title'

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid overflow-x-hidden">
      <FloatingNavbar hasTopics={topics.length > 0} />

      <CosmicAuroraHero>
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-zinc-950/80 border border-white/10 text-[11px] font-mono text-zinc-300 mb-6 backdrop-blur-md shadow-2xl"
        >
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
          <span>Eureka · Neural Active Recall Engine · OpenRouter Free</span>
        </motion.div>

        {/* Kokonut UI Inspired Cinematic Staggered Title */}
        <CinematicTitle
          text="Turn dense notes into effortless recall."
          highlight="effortless"
          subtitle="Eureka transforms complex lecture notes and textbooks into 3D active flashcards, spaced memory intervals, and diagnostic test insights — completely in-browser."
        />

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex flex-wrap items-center justify-center gap-4 mb-12"
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
            className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-3 text-xs font-mono text-zinc-300 hover:text-white hover:border-white/20 transition-all backdrop-blur-md"
          >
            <span>Explore Architecture</span>
          </a>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="flex flex-col items-center gap-1.5 text-zinc-400 font-mono text-[10px] uppercase tracking-widest"
        >
          <span>Scroll to explore</span>
          <ChevronDown size={14} className="animate-bounce text-emerald-400" />
        </motion.div>

        <LivePreviewBento onLaunch={() => navigate('/app')} />
      </CosmicAuroraHero>

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
                color: "#e4e4e7",
                badge: "Vision OCR",
              },
              {
                icon: Network,
                title: "Topic Extraction & Cards",
                description: "Extracts topic hierarchies and key concepts. Generates two-sided 3D flashcards with spring physics and keyboard shortcuts.",
                color: "#34d399",
                badge: "JSON Schema",
              },
              {
                icon: GaugeCircle,
                title: "Assessment & Weak Spot Tracking",
                description: "Runs multiple-choice checks with instant explanations and circular gauge accuracy dials. Topics scoring below 60% are flagged for priority revision.",
                color: "#e4e4e7",
                badge: "Adaptive Quiz",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

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
                color: "#e4e4e7",
              },
              {
                icon: Activity,
                title: "Retention Stream",
                description: "Continuous accuracy telemetry, circular score gauges, and daily streak calculations across all practice tests.",
                color: "#34d399",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

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

      <footer className="py-12 border-t border-white/[0.06] bg-[#070709] text-center text-xs font-mono text-zinc-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-900 border border-zinc-800 flex items-center justify-center font-bold text-[9px] font-mono text-zinc-300">
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
