import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  UploadCloud,
  FileText,
  AlertCircle,
  ArrowRight,
  Loader2,
  CheckCircle2,
  RotateCcw,
  Sparkles,
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

const STEPS = [
  { id: 1, label: 'Reading and parsing document contents' },
  { id: 2, label: 'Structuring key topics and concepts' },
  { id: 3, label: 'Synthesizing flashcard sets' },
  { id: 4, label: 'Drafting practice quiz questions' },
]

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function Home() {
  const navigate = useNavigate()
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
      setError('Unsupported file type. Please upload a PDF, TXT, or MD document.')
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
    <div className="min-h-full flex flex-col items-center justify-center px-6 py-12 max-w-4xl mx-auto">
      {/* Header */}
      <div className="w-full text-center mb-8">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-mono text-zinc-400 mb-4">
          <Sparkles size={12} className="text-zinc-200" />
          Linear-Style Active Recall Engine
        </div>
        <h1 className="text-3xl font-semibold tracking-tight text-zinc-100 mb-2">
          Transform notes into active practice
        </h1>
        <p className="text-sm text-zinc-400 max-w-lg mx-auto">
          Upload course materials, slide decks, or readings to synthesize flashcards and test questions.
        </p>
      </div>

      {/* Error alert */}
      {error && (
        <div className="w-full max-w-xl mb-6 p-4 rounded-lg bg-rose-950/30 border border-rose-800/60 text-rose-200 text-xs flex items-start gap-3">
          <AlertCircle size={16} className="text-rose-400 mt-0.5 flex-shrink-0" />
          <div className="flex-1">{error}</div>
        </div>
      )}

      {/* Active Topics Present */}
      {hasTopics && !isProcessing ? (
        <div className="w-full flex flex-col items-center mb-8">
          <ExtractionDataView topics={topics} />

          <div className="mt-4 flex items-center gap-3">
            <button
              onClick={() => {
                clearAll()
                setFile(null)
              }}
              className="text-xs text-zinc-400 hover:text-zinc-200 inline-flex items-center gap-1.5 transition-colors font-mono"
            >
              <RotateCcw size={12} />
              Reset Workspace & Upload New File
            </button>
          </div>
        </div>
      ) : null}

      {/* Upload Zone */}
      {(!hasTopics || isProcessing) && (
        <div className="w-full max-w-xl">
          <div
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => fileInputRef.current?.click()}
            className={`linear-card linear-card-highlight cursor-pointer p-8 text-center transition-all duration-200 relative ${
              isDragging
                ? 'border-zinc-500 bg-zinc-900/90'
                : 'hover:border-zinc-700 hover:bg-zinc-900/60'
            }`}
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
              <div className="py-6 flex flex-col items-center">
                <Loader2 size={24} className="animate-spin text-zinc-300 mb-4" />
                <div className="text-sm font-medium text-zinc-200 mb-4">
                  Synthesizing study modules with AI
                </div>
                <div className="w-full max-w-xs flex flex-col gap-2.5 text-left">
                  {STEPS.map((step) => {
                    const isDone = currentStep > step.id
                    const isCurrent = currentStep === step.id
                    return (
                      <div
                        key={step.id}
                        className={`text-xs flex items-center gap-2.5 ${
                          isDone
                            ? 'text-emerald-400 font-medium'
                            : isCurrent
                            ? 'text-zinc-200 font-medium'
                            : 'text-zinc-400'
                        }`}
                      >
                        {isDone ? (
                          <CheckCircle2 size={14} className="text-emerald-400" />
                        ) : isCurrent ? (
                          <Loader2 size={14} className="animate-spin text-zinc-300" />
                        ) : (
                          <div className="w-3.5 h-3.5 rounded-full border border-zinc-700" />
                        )}
                        <span>{step.label}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            ) : file ? (
              <div className="py-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-700 text-zinc-200 mx-auto mb-3">
                  <FileText size={20} />
                </div>
                <div className="text-sm font-medium text-zinc-100 mb-1 font-mono">
                  {file.name}
                </div>
                <div className="text-xs text-zinc-400 mb-4 font-mono">
                  {formatBytes(file.size)}
                </div>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleProcess()
                  }}
                  className="btn-primary mx-auto"
                >
                  Generate Study System
                  <ArrowRight size={13} />
                </button>
              </div>
            ) : (
              <div className="py-4">
                <div className="flex items-center justify-center w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-400 mx-auto mb-3">
                  <UploadCloud size={20} />
                </div>
                <div className="text-sm font-medium text-zinc-200 mb-1">
                  Drop lecture notes here, or click to browse
                </div>
                <div className="text-xs text-zinc-400 mb-4">
                  Accepts PDF, Markdown, and TXT files
                </div>
                <div className="flex items-center justify-center gap-2">
                  <span className="kbd">PDF</span>
                  <span className="kbd">TXT</span>
                  <span className="kbd">MD</span>
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}

export default Home
