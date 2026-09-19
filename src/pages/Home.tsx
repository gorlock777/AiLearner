import { useCallback, useRef, useState } from 'react'
import {
  UploadCloud,
  FileText,
  AlertCircle,
  ArrowRight,
  Loader2,
  Check,
  RotateCcw,
  Sliders,
  Layers,
  HelpCircle,
  Clock,
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
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Alert, AlertDescription, AlertTitle } from '../components/ui/alert'

const STEPS = [
  { id: 1, label: 'Parse document content & text layer' },
  { id: 2, label: 'Extract topic hierarchy & key concepts' },
  { id: 3, label: 'Generate active recall flashcards' },
  { id: 4, label: 'Compile adaptive practice questions' },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function Home() {
  const fileInputRef = useRef<HTMLInputElement>(null)

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
  const [isDragging, setIsDragging] = useState(false)
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

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const droppedFile = e.dataTransfer.files?.[0]
    if (droppedFile) handleFile(droppedFile)
  }, [])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleProcess = async () => {
    if (!file) return

    setIsProcessing(true)
    setError(null)
    setCurrentStep(1)

    try {
      // Step 1: Parse
      const text = await parseFile(file)
      const docId = `doc-${Date.now()}`
      addDocument({
        id: docId,
        name: file.name,
        size: file.size,
        type: file.type || file.name.split('.').pop() || 'unknown',
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

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Workspace Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-zinc-800/80 pb-5">
        <div>
          <h1 className="text-lg font-semibold text-zinc-100 flex items-center gap-2">
            Document Ingestion & Workspace
          </h1>
          <p className="text-xs text-zinc-400 mt-0.5">
            Import lecture slides, readings, or raw notes to synthesize your study decks.
          </p>
        </div>

        {hasTopics && !isProcessing && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => {
              clearAll()
              setFile(null)
            }}
            className="text-xs text-zinc-400 hover:text-zinc-200 h-7"
          >
            <RotateCcw size={12} />
            Reset Workspace
          </Button>
        )}
      </div>

      {/* Error alert */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Extraction Error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Extracted Data View */}
      {hasTopics && !isProcessing ? (
        <ExtractionDataView topics={topics} />
      ) : (
        /* Upload & Ingestion Workbench */
        <div className="flex flex-col gap-4">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => !isProcessing && fileInputRef.current?.click()}
            className={`linear-card p-6 border transition-colors relative select-none ${
              isProcessing
                ? 'cursor-default'
                : 'cursor-pointer hover:border-zinc-700 bg-zinc-950/40'
            } ${isDragging ? 'border-zinc-500 bg-zinc-900/60' : ''}`}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.txt,.md"
              className="hidden"
              onChange={(e) => {
                const f = e.target.files?.[0]
                if (f) handleFile(f)
              }}
            />

            {isProcessing ? (
              <div className="py-6 flex flex-col items-center max-w-md mx-auto">
                <Loader2 size={20} className="animate-spin text-zinc-300 mb-3" />
                <div className="text-xs font-semibold text-zinc-200 mb-1 font-mono">
                  PROCESSING DOCUMENT
                </div>
                <div className="text-xs text-zinc-400 mb-4 font-mono text-center">
                  Extracting concept hierarchy and questions
                </div>

                <div className="w-full mb-5">
                  <Progress value={currentStep} max={4} />
                </div>

                <div className="w-full flex flex-col gap-2 border border-zinc-800 rounded bg-zinc-900/40 p-3">
                  {STEPS.map((step) => {
                    const isDone = currentStep > step.id
                    const isCurrent = currentStep === step.id
                    return (
                      <div
                        key={step.id}
                        className={`text-xs flex items-center justify-between font-mono ${
                          isDone
                            ? 'text-emerald-400'
                            : isCurrent
                            ? 'text-zinc-200 font-medium'
                            : 'text-zinc-400'
                        }`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="text-[10px] text-zinc-400">0{step.id}</span>
                          <span>{step.label}</span>
                        </span>
                        {isDone ? (
                          <Check size={12} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 size={12} className="animate-spin text-zinc-300" />
                        ) : (
                          <span className="text-[10px] text-zinc-400">QUEUED</span>
                        )}
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : file ? (
              /* Selected File Ready State */
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 py-2">
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-300">
                    <FileText size={18} />
                  </div>
                  <div>
                    <div className="text-xs font-semibold text-zinc-100 font-mono">
                      {file.name}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono mt-0.5">
                      {formatBytes(file.size)} · Ready to parse
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      setFile(null)
                    }}
                    className="text-xs font-mono"
                  >
                    Change File
                  </Button>
                  <Button
                    size="sm"
                    onClick={(e) => {
                      e.stopPropagation()
                      handleProcess()
                    }}
                    className="text-xs font-mono"
                  >
                    Generate Modules
                    <ArrowRight size={12} />
                  </Button>
                </div>
              </div>
            ) : (
              /* Default Dropzone */
              <div className="py-6 flex flex-col items-center text-center">
                <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
                  <UploadCloud size={18} />
                </div>
                <div className="text-xs font-medium text-zinc-200 mb-1">
                  Drag and drop your study document, or click to browse
                </div>
                <div className="text-[11px] text-zinc-400 mb-3">
                  Supports text or scanned PDF, Markdown (.md), and plain text (.txt)
                </div>

                <div className="flex items-center gap-2 text-[10px] font-mono text-zinc-400">
                  <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900">PDF</span>
                  <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900">TXT</span>
                  <span className="px-1.5 py-0.5 rounded border border-zinc-800 bg-zinc-900">MD</span>
                  <span>· In-browser Vision OCR fallback included</span>
                </div>
              </div>
            )}
          </div>

          {/* Workbench Specifications Table */}
          <div className="linear-card p-4">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 font-semibold mb-3">
              Ingestion Specifications
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
              <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-zinc-300 font-medium mb-1">Text-Layer Extraction</div>
                <div className="text-[11px] text-zinc-400">Direct standalone PDF.js extraction for digital lecture slides and notes.</div>
              </div>
              <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-zinc-300 font-medium mb-1">Vision OCR Fallback</div>
                <div className="text-[11px] text-zinc-400">Automatic frame-to-canvas rendering for scanned textbook pages and slide graphics.</div>
              </div>
              <div className="p-3 rounded bg-zinc-900/40 border border-zinc-800/80">
                <div className="text-zinc-300 font-medium mb-1">Local Persistence</div>
                <div className="text-[11px] text-zinc-400">Extracted topics, generated cards, and practice questions remain on device.</div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
