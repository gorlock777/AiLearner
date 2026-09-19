import { useNavigate } from 'react-router-dom'
import {
  ScanText,
  Network,
  GaugeCircle,
  ShieldCheck,
  Keyboard,
  Cpu,
  Activity,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ExpandingUniverse } from '../components/ui/expanding-universe'
import { LivePreviewBento } from '../components/ui/live-preview-bento'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'
import { FloatingNavbar } from '../components/ui/floating-navbar'

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  return (
    <div className="min-h-screen bg-[#0d0e12] text-zinc-100 flex flex-col selection:bg-zinc-800 selection:text-white linear-grid overflow-x-hidden">
      {/* ── Luminous Floating Dynamic Island Navigation ── */}
      <FloatingNavbar hasTopics={topics.length > 0} />

      {/* ── Expanding Universe Sciency Scroll Engine (Scales from 1.0 to 2.4 into Workspace) ── */}
      <ExpandingUniverse>
        <LivePreviewBento onLaunch={() => navigate('/app')} />
      </ExpandingUniverse>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-24 px-6 border-t border-white/[0.08] bg-[#111319] relative z-10">
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
      <section id="features" className="py-24 px-6 border-t border-white/[0.08] bg-[#0d0e12] relative z-10">
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
                title: "Free LLM Router",
                description: "Integrated with OpenRouter free router models with structured JSON schema outputs and vision OCR fallbacks.",
                color: "#60a5fa",
              },
              {
                icon: Activity,
                title: "Retention Telemetry",
                description: "Continuous accuracy telemetry, circular score gauges, and daily streak calculations across all practice tests.",
                color: "#fbbf24",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── FAQ Section with Luxury Titanium Card Style ── */}
      <section id="faq" className="py-24 px-6 border-t border-white/[0.08] bg-[#111319] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-zinc-400 font-semibold block mb-2">
              Reference
            </span>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-white">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-white/[0.08] luxury-card overflow-hidden">
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-zinc-100 mb-2 font-mono">
                Which LLM models does Eureka use?
              </h3>
              <p className="text-xs text-zinc-400 leading-relaxed">
                Eureka connects to the <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10">openrouter/free</code> endpoint, automatically routing extraction prompts to high-performance models with structured JSON schema output support.
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
                All data resides strictly in your browser's <code className="text-zinc-200 font-mono bg-zinc-900 px-1.5 py-0.5 rounded border border-white/10">localStorage</code>. No external database or login account is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Lunar Space Editorial Footer ── */}
      <footer className="py-12 border-t border-white/[0.08] bg-[#0d0e12] text-center text-xs font-mono text-zinc-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-zinc-900 border border-white/10 text-white flex items-center justify-center font-bold text-[9px] font-mono">
              EU
            </div>
            <span className="text-zinc-300 font-semibold">Eureka — OpenRouter Free Ingestion Engine</span>
          </div>
          <div className="text-zinc-500">MIT License · Lunar Space Titanium Architecture</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
