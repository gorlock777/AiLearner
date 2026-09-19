import { useCallback, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CloudUpload,
  FileText,
  CheckCircle2,
  AlertCircle,
  ArrowRight,
  Sparkles,
  Loader2,
  BookOpen,
  Brain,
  RotateCcw,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

import { parseFile } from '../lib/parser'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import {
  extractTopicsPrompt,
  generateFlashcardsPrompt,
  generateQuizPrompt,
} from '../lib/prompts'
import { useAppStore } from '../store/useAppStore'
import type { Topic, FlashcardSet, QuizSet } from '../store/useAppStore'

// ─── Processing steps ──────────────────────────────────────────────────────

const STEPS = [
  { id: 1, label: 'Parsing document...' },
  { id: 2, label: 'Extracting topics with AI...' },
  { id: 3, label: 'Generating flashcards...' },
  { id: 4, label: 'Preparing your quiz...' },
]

// ─── Difficulty color map ──────────────────────────────────────────────────

const DIFF_COLORS: Record<string, { bg: string; text: string; border: string }> = {
  beginner: {
    bg: 'rgba(16,185,129,0.12)',
    text: '#34d399',
    border: 'rgba(16,185,129,0.3)',
  },
  intermediate: {
    bg: 'rgba(251,191,36,0.12)',
    text: '#fbbf24',
    border: 'rgba(251,191,36,0.3)',
  },
  advanced: {
    bg: 'rgba(239,68,68,0.12)',
    text: '#f87171',
    border: 'rgba(239,68,68,0.3)',
  },
}

// ─── Helpers ───────────────────────────────────────────────────────────────

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

// ─── Sub-components ────────────────────────────────────────────────────────

function ProcessingOverlay({
  currentStep,
  totalTopics,
}: {
  currentStep: number
  totalTopics: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="absolute inset-0 flex flex-col items-center justify-center rounded-2xl z-10"
      style={{
        background: 'rgba(7,11,20,0.88)',
        backdropFilter: 'blur(16px)',
      }}
    >
      {/* Spinning ring */}
      <div className="relative mb-8">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-16 h-16 rounded-full"
          style={{
            border: '2px solid rgba(99,102,241,0.15)',
            borderTopColor: '#6366f1',
            boxShadow: '0 0 20px rgba(99,102,241,0.4)',
          }}
        />
        <div className="absolute inset-0 flex items-center justify-center">
          <Sparkles size={20} style={{ color: '#818cf8' }} />
        </div>
      </div>

      <div className="flex flex-col gap-3 w-56">
        {STEPS.map((step, i) => {
          const done = currentStep > step.id
          const active = currentStep === step.id
          const pending = currentStep < step.id
          return (
            <motion.div
              key={step.id}
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.08 }}
              className="flex items-center gap-3"
            >
              <div className="flex-shrink-0">
                {done ? (
                  <CheckCircle2 size={16} style={{ color: '#34d399' }} />
                ) : active ? (
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={16} style={{ color: '#818cf8' }} />
                  </motion.div>
                ) : (
                  <div
                    className="w-4 h-4 rounded-full border"
                    style={{ borderColor: 'rgba(148,163,184,0.2)' }}
                  />
                )}
              </div>
              <span
                className="text-sm"
                style={{
                  color: done
                    ? '#34d399'
                    : active
                    ? '#c7d2fe'
                    : 'rgba(148,163,184,0.35)',
                  fontWeight: active ? 600 : 400,
                  transition: 'color 0.3s',
                }}
              >
                {step.label}
              </span>
            </motion.div>
          )
        })}
      </div>

      {totalTopics > 0 && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="mt-6 text-xs"
          style={{ color: 'rgba(148,163,184,0.5)' }}
        >
          Found {totalTopics} topic{totalTopics !== 1 ? 's' : ''} — generating content…
        </motion.p>
      )}
    </motion.div>
  )
}

// ─── Main Home page ────────────────────────────────────────────────────────

export function Home() {
  const navigate = useNavigate()
  const {
    topics,
    setTopics,
    addFlashcardSet,
    addQuizSet,
    setProcessing,
    setError,
    error,
    isProcessing,
    clearAll,
  } = useAppStore()

  const [dragOver, setDragOver] = useState(false)
  const [file, setFile] = useState<File | null>(null)
  const [currentStep, setCurrentStep] = useState(0)
  const [foundTopics, setFoundTopics] = useState(0)
  const [done, setDone] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // ── Drag & drop handlers ──────────────────────────────────────────────────

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped) {
      setFile(dropped)
      setError(null)
    }
  }, [setError])

  const handleFileChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const selected = e.target.files?.[0]
      if (selected) {
        setFile(selected)
        setError(null)
      }
    },
    [setError]
  )

  // ── Processing pipeline ───────────────────────────────────────────────────

  const handleProcess = useCallback(async () => {
    if (!file) return
    setError(null)
    setDone(false)
    setFoundTopics(0)

    try {
      // Step 1 — Parse
      setCurrentStep(1)
      setProcessing(true, 'Parsing document...')
      const text = await parseFile(file)

      // Step 2 — Extract topics
      setCurrentStep(2)
      setProcessing(true, 'Extracting topics with AI...')
      const topicsRaw = await fetchCompletion(extractTopicsPrompt(text))
      const { topics: extractedTopics } = parseJSONResponse<{ topics: Topic[] }>(topicsRaw)
      setTopics(extractedTopics)
      setFoundTopics(extractedTopics.length)

      // Step 3 — Flashcards (parallel per topic)
      setCurrentStep(3)
      setProcessing(true, 'Generating flashcards...')
      await Promise.all(
        extractedTopics.map(async (topic) => {
          const raw = await fetchCompletion(generateFlashcardsPrompt(topic.title, text))
          const { flashcards } = parseJSONResponse<{ flashcards: FlashcardSet['cards'] }>(raw)
          addFlashcardSet({
            topicId: topic.id,
            cards: flashcards,
            generatedAt: Date.now(),
          })
        })
      )

      // Step 4 — Quiz (parallel per topic)
      setCurrentStep(4)
      setProcessing(true, 'Preparing your quiz...')
      await Promise.all(
        extractedTopics.map(async (topic) => {
          const raw = await fetchCompletion(generateQuizPrompt(topic.title, text))
          const { questions } = parseJSONResponse<{ questions: QuizSet['questions'] }>(raw)
          addQuizSet({
            topicId: topic.id,
            questions,
            generatedAt: Date.now(),
          })
        })
      )

      setProcessing(false)
      setCurrentStep(0)
      setDone(true)

      // Small delay so user can see the success state before navigating
      setTimeout(() => navigate('/study'), 1400)
    } catch (err) {
      setProcessing(false)
      setCurrentStep(0)
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    }
  }, [
    file,
    setError,
    setProcessing,
    setTopics,
    addFlashcardSet,
    addQuizSet,
    navigate,
  ])

  // ── Topics-already-exist state ────────────────────────────────────────────

  const hasTopics = topics.length > 0

  // ── Render ────────────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-6 py-16 relative">

      {/* Hero headline */}
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.55, ease: 'easeOut' }}
        className="text-center mb-12 max-w-2xl"
      >
        {/* Label pill */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="inline-flex items-center gap-2 mb-6 px-4 py-1.5 rounded-full text-sm font-medium"
          style={{
            background: 'rgba(99,102,241,0.12)',
            border: '1px solid rgba(99,102,241,0.28)',
            color: '#a5b4fc',
          }}
        >
          <Sparkles size={14} />
          AI-Powered Study Assistant
        </motion.div>

        <h1
          className="font-bold tracking-tight mb-4 leading-tight"
          style={{ fontSize: 'clamp(2rem, 5vw, 3.25rem)', color: '#f1f5f9' }}
        >
          Turn Your Notes Into{' '}
          <span
            style={{
              background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 50%, #a78bfa 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              backgroundClip: 'text',
            }}
          >
            Active Learning
          </span>
        </h1>

        <p
          className="text-lg leading-relaxed max-w-xl mx-auto"
          style={{ color: 'rgba(148,163,184,0.75)' }}
        >
          Upload your study material and let AI generate flashcards, quizzes, and
          reveal your weak spots — automatically.
        </p>
      </motion.div>

      {/* ── If topics already exist ── */}
      <AnimatePresence mode="wait">
        {hasTopics && !isProcessing ? (
          <motion.div
            key="has-topics"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl"
          >
            {/* Ready card */}
            <div
              className="rounded-2xl p-8 text-center mb-6"
              style={{
                background: 'rgba(16,185,129,0.06)',
                border: '1px solid rgba(16,185,129,0.25)',
                backdropFilter: 'blur(16px)',
                boxShadow: '0 0 40px rgba(16,185,129,0.08)',
              }}
            >
              <CheckCircle2
                size={40}
                className="mx-auto mb-4"
                style={{ color: '#34d399' }}
              />
              <h2 className="text-xl font-semibold mb-2" style={{ color: '#ecfdf5' }}>
                Your notes are ready!
              </h2>
              <p className="text-sm mb-6" style={{ color: 'rgba(148,163,184,0.65)' }}>
                {topics.length} topic{topics.length !== 1 ? 's' : ''} extracted and ready to study
              </p>

              {/* Topic badges */}
              <div className="flex flex-wrap gap-2 justify-center mb-6">
                {topics.map((t) => {
                  const dc = DIFF_COLORS[t.difficulty] ?? DIFF_COLORS.beginner
                  return (
                    <motion.span
                      key={t.id}
                      initial={{ opacity: 0, scale: 0.85 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="px-3 py-1 rounded-full text-xs font-medium"
                      style={{
                        background: dc.bg,
                        border: `1px solid ${dc.border}`,
                        color: dc.text,
                      }}
                    >
                      {t.emoji} {t.title}
                    </motion.span>
                  )
                })}
              </div>

              {/* CTA buttons */}
              <div className="flex gap-3 justify-center">
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/study')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    color: 'white',
                    boxShadow: '0 4px 20px rgba(99,102,241,0.4)',
                  }}
                >
                  <BookOpen size={16} />
                  Study Flashcards
                  <ArrowRight size={14} />
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => navigate('/quiz')}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: '#c7d2fe',
                  }}
                >
                  <Brain size={16} />
                  Take Quiz
                </motion.button>
              </div>
            </div>

            {/* Option to re-upload */}
            <div className="text-center">
              <button
                onClick={() => {
                  clearAll()
                  setFile(null)
                  setDone(false)
                }}
                className="inline-flex items-center gap-1.5 text-sm"
                style={{ color: 'rgba(148,163,184,0.45)' }}
              >
                <RotateCcw size={13} />
                Upload new material
              </button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="upload"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -16 }}
            transition={{ duration: 0.4 }}
            className="w-full max-w-xl"
          >
            {/* ── Upload zone ── */}
            <div className="relative mb-4">
              <motion.div
                onClick={() => !isProcessing && fileInputRef.current?.click()}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                animate={{
                  borderColor: dragOver
                    ? 'rgba(99,102,241,0.8)'
                    : file
                    ? 'rgba(99,102,241,0.45)'
                    : 'rgba(255,255,255,0.08)',
                  boxShadow: dragOver
                    ? '0 0 0 3px rgba(99,102,241,0.2), 0 0 40px rgba(99,102,241,0.25), inset 0 0 60px rgba(99,102,241,0.05)'
                    : file
                    ? '0 0 20px rgba(99,102,241,0.12)'
                    : 'none',
                }}
                transition={{ duration: 0.2 }}
                className="rounded-2xl border-2 border-dashed p-12 flex flex-col items-center gap-4 cursor-pointer relative overflow-hidden"
                style={{
                  background: dragOver
                    ? 'rgba(99,102,241,0.06)'
                    : 'rgba(255,255,255,0.025)',
                  backdropFilter: 'blur(12px)',
                  minHeight: 220,
                }}
              >
                {/* Processing overlay */}
                <AnimatePresence>
                  {isProcessing && (
                    <ProcessingOverlay
                      currentStep={currentStep}
                      totalTopics={foundTopics}
                    />
                  )}
                </AnimatePresence>

                {/* Animated gradient border on drag */}
                {dragOver && (
                  <motion.div
                    className="absolute inset-0 rounded-2xl pointer-events-none"
                    animate={{ opacity: [0.4, 0.7, 0.4] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(99,102,241,0.1), rgba(139,92,246,0.1), rgba(99,102,241,0.1))',
                    }}
                  />
                )}

                {/* Icon area */}
                <motion.div
                  animate={dragOver ? { scale: 1.15, y: -4 } : { scale: 1, y: 0 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="flex items-center justify-center w-16 h-16 rounded-2xl"
                  style={{
                    background: file
                      ? 'rgba(99,102,241,0.15)'
                      : dragOver
                      ? 'rgba(99,102,241,0.2)'
                      : 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(99,102,241,0.2)',
                  }}
                >
                  {file ? (
                    <FileText size={28} style={{ color: '#818cf8' }} />
                  ) : (
                    <CloudUpload
                      size={28}
                      style={{
                        color: dragOver ? '#818cf8' : 'rgba(148,163,184,0.5)',
                      }}
                    />
                  )}
                </motion.div>

                {/* Text */}
                {file ? (
                  <div className="text-center">
                    <p
                      className="font-semibold mb-1"
                      style={{ color: '#c7d2fe' }}
                    >
                      {file.name}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(148,163,184,0.55)' }}>
                      {formatBytes(file.size)}
                    </p>
                  </div>
                ) : (
                  <div className="text-center">
                    <p
                      className="font-medium mb-1"
                      style={{ color: dragOver ? '#c7d2fe' : 'rgba(203,213,225,0.7)' }}
                    >
                      {dragOver ? 'Drop your file here' : 'Drag & drop or click to upload'}
                    </p>
                    <p className="text-sm" style={{ color: 'rgba(148,163,184,0.45)' }}>
                      Supports .pdf, .txt, .md files
                    </p>
                  </div>
                )}

                {/* Hidden input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.txt,.md"
                  className="hidden"
                  onChange={handleFileChange}
                />
              </motion.div>
            </div>

            {/* ── Error card ── */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -8, scale: 0.97 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -8, scale: 0.97 }}
                  transition={{ duration: 0.25 }}
                  className="mb-4 flex items-start gap-3 p-4 rounded-xl"
                  style={{
                    background: 'rgba(239,68,68,0.08)',
                    border: '1px solid rgba(239,68,68,0.25)',
                    backdropFilter: 'blur(10px)',
                  }}
                >
                  <AlertCircle
                    size={18}
                    className="flex-shrink-0 mt-0.5"
                    style={{ color: '#f87171' }}
                  />
                  <p className="text-sm" style={{ color: '#fca5a5' }}>
                    {error}
                  </p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* ── Process button ── */}
            <motion.button
              onClick={handleProcess}
              disabled={!file || isProcessing}
              whileHover={file && !isProcessing ? { scale: 1.02 } : {}}
              whileTap={file && !isProcessing ? { scale: 0.97 } : {}}
              className="w-full py-3.5 rounded-xl font-semibold text-base flex items-center justify-center gap-2.5 transition-all duration-200"
              style={{
                background:
                  file && !isProcessing
                    ? 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)'
                    : 'rgba(255,255,255,0.05)',
                color:
                  file && !isProcessing
                    ? 'white'
                    : 'rgba(148,163,184,0.35)',
                boxShadow:
                  file && !isProcessing
                    ? '0 4px 24px rgba(99,102,241,0.45), 0 1px 0 rgba(255,255,255,0.1) inset'
                    : 'none',
                cursor: file && !isProcessing ? 'pointer' : 'not-allowed',
                border: file && !isProcessing
                  ? 'none'
                  : '1px solid rgba(255,255,255,0.06)',
              }}
            >
              {isProcessing ? (
                <>
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
                  >
                    <Loader2 size={18} />
                  </motion.div>
                  Processing…
                </>
              ) : done ? (
                <>
                  <CheckCircle2 size={18} />
                  Done! Heading to Study…
                </>
              ) : (
                <>
                  <Sparkles size={18} />
                  Process Notes
                  <ArrowRight size={16} />
                </>
              )}
            </motion.button>

            {/* Helper text */}
            {!file && !isProcessing && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center text-xs mt-4"
                style={{ color: 'rgba(148,163,184,0.35)' }}
              >
                Your file is processed locally — nothing is stored on our servers
              </motion.p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Feature pills at the bottom ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.5 }}
        className="flex flex-wrap gap-3 justify-center mt-14"
      >
        {[
          { icon: '⚡', label: 'Instant flashcards' },
          { icon: '🧠', label: 'AI-generated quizzes' },
          { icon: '📊', label: 'Weak spot analysis' },
          { icon: '🔒', label: 'Privacy-first' },
        ].map((feat) => (
          <div
            key={feat.label}
            className="flex items-center gap-2 px-3 py-1.5 rounded-full text-xs"
            style={{
              background: 'rgba(255,255,255,0.04)',
              border: '1px solid rgba(255,255,255,0.07)',
              color: 'rgba(148,163,184,0.6)',
            }}
          >
            <span>{feat.icon}</span>
            {feat.label}
          </div>
        ))}
      </motion.div>
    </div>
  )
}
