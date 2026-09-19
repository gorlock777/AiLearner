import { useCallback, useRef, useState } from 'react'
import {
  AlertCircle,
  ArrowRight,
  RotateCcw,
  Sparkles,
  Zap,
  BookOpen,
  Atom,
  Server,
  FileText,
  ScanText,
  Network,
  GaugeCircle,
} from 'lucide-react'

import { parseFile } from '../lib/parser'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import {
  extractTopicsPrompt,
  generateFlashcardsPrompt,
  generateQuizPrompt,
} from '../lib/prompts'
import { useAppStore } from '../store/useAppStore'
import type { Topic, FlashcardSet, QuizSet } from '../store/useAppStore'
import { ExtractionDataView } from '../components/extraction/ExtractionDataView'
import { Button } from '../components/ui/button'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'
import { DropzoneUpload } from '../components/ui/dropzone-upload'
import { LoadingStepper } from '../components/ui/loading-stepper'
import { SpotlightCards } from '../components/ui/spotlight-cards'
import type { SpotlightItem } from '../components/ui/spotlight-cards'

const STEPS = [
  { id: 1, label: 'Parse document content & text layer' },
  { id: 2, label: 'Extract topic hierarchy & key concepts' },
  { id: 3, label: 'Generate active recall flashcards' },
  { id: 4, label: 'Compile adaptive practice questions' },
]

const SAMPLE_PRESETS = [
  {
    name: 'Quantum Computing & Qubits',
    filename: 'quantum_computing_101.md',
    badge: 'Physics',
    icon: Atom,
    color: '#34d399',
    text: `# Quantum Computing Fundamentals: Superposition, Entanglement & Gates

## 1. Qubits and Quantum Superposition
Unlike classical bits which exist deterministically as 0 or 1, a quantum bit (qubit) exists in a linear superposition state:
|ψ⟩ = α|0⟩ + β|1⟩, where α and β are complex probability amplitudes satisfying |α|² + |β|² = 1.
When measured, the superposition collapses probabilistically to state |0⟩ with probability |α|² or |1⟩ with probability |β|².

## 2. Quantum Entanglement and Non-Locality
Quantum entanglement occurs when pairs or groups of particles interact such that the quantum state of each particle cannot be described independently of the state of the others, even when separated by large distances. The canonical Bell state is |Φ⁺⟩ = (|00⟩ + |11⟩) / √2.

## 3. Quantum Logic Gates & Circuits
Quantum computation uses reversible unitary transformations represented by matrix multiplication:
- Pauli-X Gate: Quantum NOT gate, bit flip.
- Hadamard Gate (H): Maps basis states |0⟩ and |1⟩ into equal superposition states (|0⟩ + |1⟩)/√2 and (|0⟩ - |1⟩)/√2.
- CNOT (Controlled-NOT): Two-qubit entangling gate that flips target qubit if control qubit is 1.

## 4. Quantum Supremacy & Error Correction
Fault-tolerant quantum computing requires quantum error correction (such as surface codes) to protect fragile quantum information against decoherence caused by environmental thermal noise.`,
  },
  {
    name: 'Cellular Respiration & ATP',
    filename: 'cellular_respiration.md',
    badge: 'Biology',
    icon: BookOpen,
    color: '#60a5fa',
    text: `# Cellular Respiration and Metabolic Biochemistry

## 1. Glycolysis in the Cytosol
Glycolysis is the anaerobic breakdown of 1 glucose molecule (6 carbons) into 2 molecules of pyruvate (3 carbons).
- Energy investment phase consumes 2 ATP.
- Energy payoff phase produces 4 ATP and 2 NADH.
- Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH per glucose.

## 2. Pyruvate Oxidation and the Krebs Cycle
Pyruvate is actively transported into the mitochondrial matrix and converted into Acetyl-CoA by pyruvate dehydrogenase, releasing CO₂ and generating 1 NADH.
Acetly-CoA joins oxaloacetate (4C) to form citrate (6C).
Through one turn of the citric acid cycle:
- 3 NADH, 1 FADH₂, 1 GTP/ATP, and 2 CO₂ molecules are generated.

## 3. Oxidative Phosphorylation & ETC
Located in the inner mitochondrial membrane, complexes I, II, III, and IV transfer electrons from NADH and FADH₂ to molecular oxygen (the terminal electron acceptor, forming H₂O).
Electron flow pumps protons into the intermembrane space, creating an electrochemical proton gradient (proton-motive force).

## 4. Chemiosmosis and ATP Synthase
Protons flow back into the matrix through the rotor subunit of ATP Synthase, driving mechanical phosphorylation of ADP + Pi into ATP. Theoretical net maximum yield per glucose is approximately 30-32 ATP.`,
  },
  {
    name: 'Distributed Systems & Raft',
    filename: 'distributed_systems_raft.md',
    badge: 'CS Systems',
    icon: Server,
    color: '#a78bfa',
    text: `# Distributed Systems: Raft Consensus Algorithm

## 1. The Consensus Problem
Distributed consensus requires multiple server replicas to agree on a sequence of state machine operations despite network partitions, message delays, and node crashes. Raft achieves equivalent fault tolerance to Paxos while decomposing consensus into distinct, understandable subproblems.

## 2. Server Roles and Term Epochs
Nodes in a Raft cluster exist in one of three states:
- Follower: Passive state, responds to RPCs from candidates and leaders.
- Candidate: Requests votes from peers during leader election when heartbeat timer elapses.
- Leader: Handles all client requests, appends log entries, and sends periodic AppendEntries heartbeats.
Time is divided into numbered Terms, acting as logical clocks to detect obsolete nodes.

## 3. Leader Election and Randomized Heartbeat Timers
When a follower detects election timeout (randomized between 150ms-300ms to avoid split votes), it increments its term, transitions to candidate, votes for itself, and broadcasts RequestVote RPCs. A candidate wins the election by securing majority votes (N/2 + 1).

## 4. Log Replication and Safety Invariant
The leader receives client commands, appends entries to its local log, and broadcasts AppendEntries RPCs. Once an entry is safely replicated across a majority of cluster nodes, the leader commits the entry and applies it to its state machine. If an entry is committed in a given term, it will be present in logs of leaders for all higher terms.`,
  },
]

export function Home() {
  const {
    topics,
    addDocument,
    setActiveDocument,
    setTopics,
    addFlashcardSet,
    addQuizSet,
    clearAll,
  } = useAppStore()

  const [file, setFile] = useState<File | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [currentStep, setCurrentStep] = useState(1)
  const [error, setError] = useState<string | null>(null)

  const hasTopics = topics.length > 0

  const handleFile = (f: File) => {
    setFile(f)
    setError(null)
  }

  const processExtractedText = async (
    text: string,
    filename: string,
    fileSize: number
  ) => {
    setIsProcessing(true)
    setError(null)
    setCurrentStep(1)

    try {
      // Step 1: Save document
      const doc = {
        id: crypto.randomUUID(),
        name: filename,
        size: fileSize,
        type: 'text/plain',
        text,
        uploadedAt: Date.now(),
      }
      addDocument(doc)
      setActiveDocument(doc.id)

      // Step 2: Extract topics
      setCurrentStep(2)
      const topicMessages = extractTopicsPrompt(text)
      const rawTopics = await fetchCompletion(topicMessages)
      const parsedTopics = parseJSONResponse<{ topics: Topic[] }>(rawTopics)

      if (!parsedTopics?.topics?.length) {
        throw new Error('No topics could be extracted from document.')
      }
      setTopics(parsedTopics.topics)

      // Step 3: Flashcards
      setCurrentStep(3)
      for (const topic of parsedTopics.topics) {
        try {
          const fcMessages = generateFlashcardsPrompt(topic.title, text)
          const rawFc = await fetchCompletion(fcMessages)
          const parsedFc = parseJSONResponse<{ flashcards: FlashcardSet['cards'] }>(rawFc)
          if (parsedFc?.flashcards?.length) {
            addFlashcardSet({
              topicId: topic.id,
              cards: parsedFc.flashcards,
              generatedAt: Date.now(),
            })
          }
        } catch {
          // Continue
        }
      }

      // Step 4: Quiz
      setCurrentStep(4)
      for (const topic of parsedTopics.topics) {
        try {
          const quizMessages = generateQuizPrompt(topic.title, text)
          const rawQuiz = await fetchCompletion(quizMessages)
          const parsedQuiz = parseJSONResponse<{ questions: QuizSet['questions'] }>(rawQuiz)
          if (parsedQuiz?.questions?.length) {
            addQuizSet({
              topicId: topic.id,
              questions: parsedQuiz.questions,
              generatedAt: Date.now(),
            })
          }
        } catch {
          // Continue
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Processing failed'
      setError(msg)
    } finally {
      setIsProcessing(false)
    }
  }

  const handleProcess = async () => {
    if (!file) return
    try {
      const text = await parseFile(file)
      await processExtractedText(text, file.name, file.size)
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Failed to parse file'
      setError(msg)
      setIsProcessing(false)
    }
  }

  const handleLoadPreset = async (preset: typeof SAMPLE_PRESETS[number]) => {
    await processExtractedText(preset.text, preset.filename, preset.text.length)
  }

  return (
    <div className="min-h-full flex flex-col">
      {/* ── Spacious Editorial Hero Header ── */}
      {!hasTopics && !isProcessing && (
        <section className="relative w-full py-16 md:py-20 border-b border-white/[0.08] overflow-hidden bg-gradient-to-b from-[#0e1017] via-[#0d0e14] to-[#0d0e12]">
          {/* Subtle atmosphere glow */}
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -translate-x-1/2 w-[700px] sm:w-[900px] h-[400px] rounded-full bg-[radial-gradient(ellipse_at_center,rgba(52,211,153,0.12)_0%,rgba(52,211,153,0.02)_40%,transparent_70%)]"
          />

          <div className="relative z-10 max-w-3xl mx-auto text-center px-6">
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-900/90 border border-white/10 text-[11px] font-mono text-zinc-300 mb-6 shadow-sm backdrop-blur-md">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>Eureka · Neural Ingestion Engine</span>
            </div>

            <h1 className="font-heading font-normal text-3xl sm:text-5xl text-white tracking-tight leading-tight mb-4 drop-shadow-sm">
              Neural Document Ingestion
            </h1>

            <p className="text-sm sm:text-base text-zinc-400 max-w-xl mx-auto leading-relaxed font-sans">
              Transform PDFs, lecture slides, and notes into active recall decks & diagnostic quizzes with editorial clarity.
            </p>
          </div>
        </section>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="px-6 py-10 max-w-5xl mx-auto w-full flex flex-col gap-8">
        {/* Workspace Top Bar (when topics loaded) */}
        {hasTopics && !isProcessing && (
          <div className="flex items-center justify-between border-b border-white/[0.08] pb-6">
            <div>
              <h2 className="font-heading font-normal text-2xl text-white tracking-tight">
                Knowledge Workspace
              </h2>
              <p className="text-xs text-zinc-400 mt-1 font-sans">
                Review extracted topic matrix or reset to load a new document.
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => {
                clearAll()
                setFile(null)
              }}
              className="text-xs font-mono h-9 px-4 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
            >
              <RotateCcw size={13} />
              <span>Reset Workspace</span>
            </Button>
          </div>
        )}

        {/* Error alert */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Extraction Error</AlertTitle>
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Extracted Data View with Interactive Matrix */}
        {hasTopics && !isProcessing ? (
          <ExtractionDataView topics={topics} />
        ) : (
          /* Upload & Ingestion Workbench */
          <div className="flex flex-col gap-6">
            {isProcessing ? (
              <div className="linear-card p-10 border flex flex-col items-center max-w-md mx-auto w-full my-8">
                <div className="text-xs font-semibold text-zinc-200 mb-1 font-mono uppercase tracking-wider">
                  Synthesizing Knowledge Deck
                </div>
                <div className="text-xs text-zinc-400 mb-6 font-mono text-center">
                  Extracting concept topology, flashcards & quiz
                </div>
                <LoadingStepper steps={STEPS} currentStep={currentStep} />
              </div>
            ) : (
              <div className="flex flex-col gap-8">
                <DropzoneUpload
                  selectedFile={file}
                  onFileSelect={handleFile}
                  onFileRemove={() => setFile(null)}
                  isProcessing={isProcessing}
                />

                {file && (
                  <div className="flex justify-end">
                    <ShimmerButton
                      onClick={handleProcess}
                      className="px-5 py-2.5 font-mono text-xs"
                    >
                      <span>Synthesize Study Modules</span>
                      <ArrowRight size={13} />
                    </ShimmerButton>
                  </div>
                )}

                {/* 1-Click Sample Pre-load Packs with KokonutUI SpotlightCards */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center gap-2">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                      Or Try an Instant Sample Topic Pack
                    </span>
                  </div>
                  <SpotlightCards
                    columns={3}
                    items={SAMPLE_PRESETS.map((preset) => ({
                      icon: preset.icon,
                      title: preset.name,
                      description: `1-click load · ${preset.badge}`,
                      color: preset.color,
                      badge: preset.badge,
                      onClick: () => handleLoadPreset(preset),
                      footer: (
                        <div className="flex items-center gap-1 text-[10px] font-mono text-white/40 group-hover:text-white/70 transition-colors">
                          <span>Load & Synthesize</span>
                          <ArrowRight size={10} />
                        </div>
                      ),
                    } satisfies SpotlightItem))}
                  />
                </div>

                {/* Ingestion Specifications with KokonutUI SpotlightCards */}
                <SpotlightCards
                  eyebrow="Ingestion Specifications"
                  columns={3}
                  items={[
                    {
                      icon: ScanText,
                      title: "Text-Layer Parser",
                      description: "Direct in-browser PDF.js stream extraction for digital lecture slides and notes.",
                      color: "#34d399",
                    },
                    {
                      icon: Network,
                      title: "Vision OCR Fallback",
                      description: "Automatic frame-to-canvas rendering for scanned textbook pages and slide graphics.",
                      color: "#60a5fa",
                    },
                    {
                      icon: GaugeCircle,
                      title: "Local Persistence",
                      description: "Extracted topics, generated cards, and practice questions remain in browser.",
                      color: "#a78bfa",
                    },
                  ] satisfies SpotlightItem[]}
                />
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
