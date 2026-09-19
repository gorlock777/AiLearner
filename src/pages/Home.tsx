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
import { BlackHoleHeroSection } from '../components/ui/blackhole-hero-section'
import { VariableFontCursorProximity } from '../components/ui/variable-font-cursor-proximity'
import { DropzoneUpload } from '../components/ui/dropzone-upload'
import { LoadingStepper } from '../components/ui/loading-stepper'

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
    text: `# Cellular Respiration and Metabolic Biochemistry

## 1. Glycolysis in the Cytosol
Glycolysis is the anaerobic breakdown of 1 glucose molecule (6 carbons) into 2 molecules of pyruvate (3 carbons).
- Energy investment phase consumes 2 ATP.
- Energy payoff phase produces 4 ATP and 2 NADH.
- Net yield: 2 ATP (via substrate-level phosphorylation) and 2 NADH per glucose.

## 2. Pyruvate Oxidation and the Krebs Cycle
Pyruvate is actively transported into the mitochondrial matrix and converted into Acetyl-CoA by pyruvate dehydrogenase, releasing CO₂ and generating 1 NADH.
Acetyl-CoA joins oxaloacetate (4C) to form citrate (6C).
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
  const heroContainerRef = useRef<HTMLDivElement>(null)

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
  const [currentStep, setCurrentStep] = useState(0)
  const [error, setError] = useState<string | null>(null)

  const hasTopics = topics.length > 0

  const handleFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase()
    if (!['pdf', 'txt', 'md'].includes(ext ?? '')) {
      setError('Unsupported file format. Please provide a PDF, TXT, or Markdown document.')
      return
    }
    setError(null)
    setFile(f)
  }

  const processExtractedText = async (text: string, docName: string, docSize: number) => {
    setIsProcessing(true)
    setError(null)
    setCurrentStep(1)

    try {
      // Step 1: Save document
      const docId = `doc-${Date.now()}`
      addDocument({
        id: docId,
        name: docName,
        size: docSize,
        type: 'md',
        text,
        uploadedAt: Date.now(),
      })
      setActiveDocument(docId)

      // Step 2: Extract topics
      setCurrentStep(2)
      const topicMessages = extractTopicsPrompt(text)
      const rawTopics = await fetchCompletion(topicMessages)
      const parsedTopics = parseJSONResponse<{ topics: Topic[] }>(rawTopics)
      if (!parsedTopics?.topics?.length) {
        throw new Error('No topics could be extracted. Please check the document content.')
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
      {/* ── 21st.dev Black Hole Hero Section above upload ── */}
      {!hasTopics && !isProcessing && (
        <section
          ref={heroContainerRef}
          className="relative w-full h-64 md:h-72 border-b border-zinc-800/80 overflow-hidden bg-black"
        >
          <BlackHoleHeroSection
            distance={22}
            elevation={-6}
            roll={-18}
            fov={38}
            diskDensity={1.0}
            brightness={1.1}
            spinSpeed={0.06}
            steps={180}
            resolution={0.65}
            scrim="bottom"
            scrimStrength={0.8}
            className="w-full h-full"
          >
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6 z-20 pointer-events-none">
              <div className="pointer-events-auto inline-flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-950/80 border border-zinc-800/80 text-[11px] font-mono text-zinc-400 mb-3 backdrop-blur-md">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>AI Synthesis Engine · OpenRouter Free</span>
              </div>

              <div className="pointer-events-auto cursor-default">
                <VariableFontCursorProximity
                  containerRef={heroContainerRef}
                  fromFontVariationSettings="'wght' 300"
                  toFontVariationSettings="'wght' 800"
                  radius={90}
                  className="text-2xl sm:text-3xl font-heading font-semibold tracking-tight text-zinc-100"
                >
                  Neural Document Ingestion
                </VariableFontCursorProximity>
              </div>

              <p className="text-xs sm:text-sm text-zinc-400 max-w-lg mx-auto mt-2 leading-relaxed">
                Transform PDFs, lecture slides, and notes into active recall decks & diagnostic quizzes.
              </p>
            </div>
          </BlackHoleHeroSection>
        </section>
      )}

      {/* ── Main Workspace Content ── */}
      <div className="px-6 py-6 max-w-4xl mx-auto w-full flex flex-col gap-5">
        {/* Workspace Top Bar (when topics loaded) */}
        {hasTopics && !isProcessing && (
          <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3">
            <div>
              <h2 className="font-heading text-sm font-semibold text-zinc-100 uppercase tracking-wider">
                Knowledge Workspace
              </h2>
              <p className="text-xs text-zinc-400 mt-0.5">
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
              className="text-xs font-mono h-7"
            >
              <RotateCcw size={12} />
              Reset Workspace
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
          <div className="flex flex-col gap-4">
            {isProcessing ? (
              <div className="linear-card p-6 border flex flex-col items-center max-w-md mx-auto w-full">
                <div className="text-xs font-semibold text-zinc-200 mb-1 font-mono">
                  SYNTHESIZING KNOWLEDGE DECK
                </div>
                <div className="text-xs text-zinc-400 mb-4 font-mono text-center">
                  Extracting concept topology, flashcards & quiz
                </div>
                <LoadingStepper steps={STEPS} currentStep={currentStep} />
              </div>
            ) : (
              <div className="flex flex-col gap-4">
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
                      className="px-4 py-2 font-mono text-xs"
                    >
                      <span>Synthesize Study Modules</span>
                      <ArrowRight size={13} />
                    </ShimmerButton>
                  </div>
                )}

                {/* 1-Click Sample Pre-load Packs */}
                <div className="linear-card p-4 border border-zinc-800/80">
                  <div className="flex items-center gap-2 mb-2.5">
                    <Sparkles size={13} className="text-emerald-400" />
                    <span className="text-[11px] font-mono uppercase tracking-wider text-zinc-300 font-semibold">
                      Or Try an Instant Sample Topic Pack
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                    {SAMPLE_PRESETS.map((preset) => {
                      const Icon = preset.icon
                      return (
                        <button
                          key={preset.name}
                          onClick={() => handleLoadPreset(preset)}
                          className="text-left p-3 rounded-md bg-zinc-900/60 border border-zinc-800 hover:border-zinc-700 hover:bg-zinc-850/80 transition-all flex flex-col justify-between group cursor-pointer"
                        >
                          <div>
                            <div className="flex items-center justify-between mb-1.5">
                              <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-950 border border-zinc-800 text-zinc-400">
                                {preset.badge}
                              </span>
                              <Icon size={13} className="text-zinc-500 group-hover:text-emerald-400 transition-colors" />
                            </div>
                            <div className="font-heading text-xs font-semibold text-zinc-200 group-hover:text-white transition-colors line-clamp-1">
                              {preset.name}
                            </div>
                          </div>
                          <div className="text-[10px] font-mono text-zinc-500 mt-2 flex items-center gap-1 group-hover:text-zinc-400">
                            <span>1-Click Load</span>
                            <ArrowRight size={10} />
                          </div>
                        </button>
                      )
                    })}
                  </div>
                </div>
              </div>
            )}

            {/* Ingestion Specifications Grid */}
            <div className="linear-card p-4">
              <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3">
                Ingestion Specifications
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                  <div className="text-zinc-300 font-medium mb-1 font-heading">Text-Layer Parser</div>
                  <div className="text-[11px] text-zinc-400">Direct in-browser PDF.js stream extraction for digital lecture slides and notes.</div>
                </div>
                <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                  <div className="text-zinc-300 font-medium mb-1 font-heading">Vision OCR Fallback</div>
                  <div className="text-[11px] text-zinc-400">Automatic frame-to-canvas rendering for scanned textbook pages and slide graphics.</div>
                </div>
                <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                  <div className="text-zinc-300 font-medium mb-1 font-heading">Local Persistence</div>
                  <div className="text-[11px] text-zinc-400">Extracted topics, generated cards, and practice questions remain in browser.</div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Home
