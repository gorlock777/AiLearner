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
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { ExpandingUniverse } from '../components/ui/expanding-universe'
import { LivePreviewBento } from '../components/ui/live-preview-bento'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'
import { FloatingNavbar } from '../components/ui/floating-navbar'

export function LandingPage() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  return (
    <div className="min-h-screen bg-[#fafaf8] text-stone-900 flex flex-col selection:bg-stone-200 selection:text-stone-900 linear-grid overflow-x-hidden">
      {/* ── Luminous Floating Dynamic Island Navigation ── */}
      <FloatingNavbar hasTopics={topics.length > 0} />

      {/* ── Expanding Universe Sciency Scroll Engine (Scales from 1.0 to 2.4 into Workspace) ── */}
      <ExpandingUniverse>
        <LivePreviewBento onLaunch={() => navigate('/app')} />
      </ExpandingUniverse>

      {/* ── 3-Step Precision Pipeline ── */}
      <section id="pipeline" className="py-24 px-6 border-t border-stone-200/80 bg-[#f5f5f3] relative z-10">
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
                color: "#059669",
                badge: "Vision OCR",
              },
              {
                icon: Network,
                title: "Topic Extraction & Cards",
                description: "Extracts topic hierarchies and key concepts without fluff. Generates two-sided 3D flashcards with spring physics and keyboard shortcuts.",
                color: "#2563eb",
                badge: "JSON Schema",
              },
              {
                icon: GaugeCircle,
                title: "Assessment & Weak Spot Tracking",
                description: "Runs multiple-choice checks with instant explanations and circular gauge accuracy dials. Topics scoring below 60% are flagged for priority revision.",
                color: "#d97706",
                badge: "Adaptive Quiz",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── Capabilities Grid ── */}
      <section id="features" className="py-24 px-6 border-t border-stone-200/80 bg-[#fafaf8] relative z-10">
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
                color: "#059669",
              },
              {
                icon: Keyboard,
                title: "Keyboard First",
                description: "Navigate decks with Space to flip, 1 for review, 2 for mastered, and arrow keys for a fully mouse-free study flow.",
                color: "#18181b",
              },
              {
                icon: Cpu,
                title: "Free LLM Router",
                description: "Integrated with OpenRouter free router models with structured JSON schema outputs and vision OCR fallbacks.",
                color: "#2563eb",
              },
              {
                icon: Activity,
                title: "Retention Telemetry",
                description: "Continuous accuracy telemetry, circular score gauges, and daily streak calculations across all practice tests.",
                color: "#d97706",
              },
            ] satisfies SpotlightItem[]}
          />
        </div>
      </section>

      {/* ── FAQ Section with Luxury Alabaster Card Style ── */}
      <section id="faq" className="py-24 px-6 border-t border-stone-200/80 bg-[#f5f5f3] relative z-10">
        <div className="max-w-4xl mx-auto">
          <div className="mb-10 text-center">
            <span className="text-[10px] uppercase tracking-[0.2em] font-mono text-stone-500 font-semibold block mb-2">
              Reference
            </span>
            <h2 className="font-heading text-3xl font-normal tracking-tight text-stone-900">
              Frequently Asked Questions
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-stone-200 luxury-card overflow-hidden bg-white">
            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-stone-900 mb-2 font-mono">
                Which LLM models does Eureka use?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Eureka connects to the <code className="text-stone-800 font-mono bg-stone-100 px-1.5 py-0.5 rounded">openrouter/free</code> endpoint, automatically routing extraction prompts to high-performance models with structured JSON schema output support.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-stone-900 mb-2 font-mono">
                How are scanned slides and textbooks parsed?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                If digital text is detected via PDF.js, extraction runs instantly. If pages are scanned bitmap graphics, in-browser canvas renders the frames to base64 images and routes them through OpenRouter vision models for OCR synthesis.
              </p>
            </div>

            <div className="p-6 md:p-8">
              <h3 className="text-sm font-semibold text-stone-900 mb-2 font-mono">
                Where is study data saved?
              </h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                All data resides strictly in your browser's <code className="text-stone-800 font-mono bg-stone-100 px-1.5 py-0.5 rounded">localStorage</code>. No external database or login account is required.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── Alabaster Editorial Footer ── */}
      <footer className="py-12 border-t border-stone-200 bg-[#fafaf8] text-center text-xs font-mono text-stone-500 relative z-10">
        <div className="max-w-6xl mx-auto px-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-stone-900 text-white flex items-center justify-center font-bold text-[9px] font-mono">
              EU
            </div>
            <span className="text-stone-700 font-semibold">Eureka — OpenRouter Free Ingestion Engine</span>
          </div>
          <div className="text-stone-500">MIT License · Luminous Alabaster Architecture</div>
        </div>
      </footer>
    </div>
  )
}

export default LandingPage
