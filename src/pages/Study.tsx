import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Sparkles,
  Loader2,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { generateFlashcardsPrompt } from '../lib/prompts'
import type { Flashcard } from '../store/useAppStore'

// ─── Types ──────────────────────────────────────────────────────────────────

type CardResult = 'known' | 'review' | null

interface SessionCard {
  card: Flashcard
  result: CardResult
}

// ─── Skeleton Card ───────────────────────────────────────────────────────────

function SkeletonCard() {
  return (
    <div className="w-full max-w-[520px] mx-auto">
      {/* Skeleton pill tabs */}
      <div className="flex gap-3 mb-8 overflow-hidden">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="h-9 rounded-full animate-pulse flex-shrink-0"
            style={{
              width: `${80 + i * 20}px`,
              background: 'rgba(255,255,255,0.07)',
            }}
          />
        ))}
      </div>
      {/* Skeleton card */}
      <div
        className="w-full rounded-2xl animate-pulse"
        style={{
          height: '300px',
          background: 'rgba(255,255,255,0.04)',
          border: '1px solid rgba(255,255,255,0.08)',
        }}
      >
        <div className="p-8 flex flex-col gap-4 h-full justify-center items-center">
          <div
            className="h-4 rounded-full w-1/4 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          <div
            className="h-6 rounded-full w-3/4 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
          <div
            className="h-6 rounded-full w-1/2 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.07)' }}
          />
        </div>
      </div>
    </div>
  )
}

// ─── Main Component ──────────────────────────────────────────────────────────

export default function Study() {
  const navigate = useNavigate()
  const { topics, getFlashcardsForTopic, addFlashcardSet, documents } = useAppStore()

  // ── Topic selection
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics.length > 0 ? topics[0].id : null
  )

  // ── Flashcard state
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [hasFlippedOnce, setHasFlippedOnce] = useState(false)

  // ── Generation state
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)

  // ── Session complete
  const [sessionComplete, setSessionComplete] = useState(false)

  const cardContainerRef = useRef<HTMLDivElement>(null)

  // ── Load flashcards when topic changes
  useEffect(() => {
    if (!selectedTopicId) return
    const existing = getFlashcardsForTopic(selectedTopicId)
    if (existing.length > 0) {
      setCards(existing.map((card) => ({ card, result: null })))
      setCurrentIndex(0)
      setIsFlipped(false)
      setHasFlippedOnce(false)
      setSessionComplete(false)
      setGenerateError(null)
    } else {
      setCards([])
      setSessionComplete(false)
    }
  }, [selectedTopicId, getFlashcardsForTopic])

  // ── Auto-generate flashcards if missing
  const handleGenerate = useCallback(async () => {
    if (!selectedTopicId) return
    const topic = topics.find((t) => t.id === selectedTopicId)
    if (!topic) return

    // Pick the document text (use first document)
    const text = documents[0]?.text ?? ''
    if (!text) {
      setGenerateError('No document text found. Please upload notes first.')
      return
    }

    setIsGenerating(true)
    setGenerateError(null)
    try {
      const messages = generateFlashcardsPrompt(topic.title, text)
      const raw = await fetchCompletion(messages)
      const parsed = parseJSONResponse<{ flashcards: Flashcard[] }>(raw)
      const newSet = {
        topicId: selectedTopicId,
        cards: parsed.flashcards,
        generatedAt: Date.now(),
      }
      addFlashcardSet(newSet)
      setCards(parsed.flashcards.map((card) => ({ card, result: null })))
      setCurrentIndex(0)
      setIsFlipped(false)
      setHasFlippedOnce(false)
      setSessionComplete(false)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate flashcards.')
    } finally {
      setIsGenerating(false)
    }
  }, [selectedTopicId, topics, documents, addFlashcardSet])

  // ── Navigation helpers
  const goNext = useCallback(() => {
    if (currentIndex < cards.length - 1) {
      setCurrentIndex((i) => i + 1)
      setIsFlipped(false)
    } else {
      setSessionComplete(true)
    }
  }, [currentIndex, cards.length])

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1)
      setIsFlipped(false)
    }
  }, [currentIndex])

  const handleFlip = useCallback(() => {
    setIsFlipped((f) => !f)
    if (!hasFlippedOnce) setHasFlippedOnce(true)
  }, [hasFlippedOnce])

  const handleResult = useCallback(
    (result: 'known' | 'review') => {
      setCards((prev) =>
        prev.map((sc, idx) => (idx === currentIndex ? { ...sc, result } : sc))
      )
      // Small delay so the button press registers visually, then advance
      setTimeout(() => {
        goNext()
      }, 120)
    },
    [currentIndex, goNext]
  )

  const handleRestart = useCallback(() => {
    setCards((prev) => prev.map((sc) => ({ ...sc, result: null })))
    setCurrentIndex(0)
    setIsFlipped(false)
    setHasFlippedOnce(false)
    setSessionComplete(false)
  }, [])

  // ── Keyboard controls
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Don't fire if user is typing somewhere
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      switch (e.key) {
        case ' ':
        case 'Enter':
          e.preventDefault()
          handleFlip()
          break
        case 'ArrowRight':
          e.preventDefault()
          if (isFlipped) goNext()
          break
        case 'ArrowLeft':
          e.preventDefault()
          goPrev()
          break
        case '1':
          if (isFlipped) handleResult('known')
          break
        case '2':
          if (isFlipped) handleResult('review')
          break
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleFlip, goNext, goPrev, handleResult, isFlipped])

  // ── Derived values
  const currentCard = cards[currentIndex]?.card ?? null
  const knownCount = cards.filter((sc) => sc.result === 'known').length
  const reviewCount = cards.filter((sc) => sc.result === 'review').length
  const progressPct = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0

  // ── No topics state
  if (topics.length === 0) {
    return (
      <div
        className="min-h-screen flex flex-col items-center justify-center gap-6 px-4"
        style={{ background: '#070b14' }}
      >
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center"
        >
          <div className="text-6xl mb-4">📚</div>
          <h2 className="text-2xl font-bold text-white mb-2">No notes uploaded yet</h2>
          <p className="text-white/50 mb-8">
            Upload your study notes to generate flashcards and start learning.
          </p>
          <Link
            to="/"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white transition-all duration-200 hover:scale-105"
            style={{
              background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
              boxShadow: '0 0 24px rgba(99,102,241,0.4)',
            }}
          >
            <BookOpen size={18} />
            Go to Upload
          </Link>
        </motion.div>
      </div>
    )
  }

  return (
    <div
      className="min-h-screen flex flex-col"
      style={{ background: '#070b14' }}
    >
      {/* ── Page header */}
      <div className="px-6 pt-8 pb-4 max-w-4xl mx-auto w-full">
        <motion.h1
          initial={{ opacity: 0, y: -12 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-3xl font-bold text-white mb-1"
        >
          Flashcards
        </motion.h1>
        <p className="text-white/40 text-sm">
          Space to flip · Arrow keys to navigate · 1 = Got it · 2 = Review again
        </p>
      </div>

      {/* ── Topic pills */}
      <div className="px-6 max-w-4xl mx-auto w-full">
        <div
          className="flex gap-3 pb-3 overflow-x-auto"
          style={{ scrollbarWidth: 'none' }}
        >
          {topics.map((topic, i) => {
            const isActive = topic.id === selectedTopicId
            return (
              <motion.button
                key={topic.id}
                initial={{ opacity: 0, x: -12 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                onClick={() => setSelectedTopicId(topic.id)}
                className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 cursor-pointer"
                style={{
                  background: isActive
                    ? 'linear-gradient(135deg, rgba(99,102,241,0.35), rgba(139,92,246,0.25))'
                    : 'rgba(255,255,255,0.05)',
                  border: isActive
                    ? '1px solid rgba(99,102,241,0.6)'
                    : '1px solid rgba(255,255,255,0.08)',
                  color: isActive ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                  boxShadow: isActive ? '0 0 16px rgba(99,102,241,0.25)' : 'none',
                }}
                whileHover={{ scale: 1.04 }}
                whileTap={{ scale: 0.97 }}
              >
                <span>{topic.emoji}</span>
                <span>{topic.title}</span>
                {getFlashcardsForTopic(topic.id).length > 0 && (
                  <span
                    className="text-xs px-1.5 py-0.5 rounded-full"
                    style={{
                      background: isActive
                        ? 'rgba(99,102,241,0.4)'
                        : 'rgba(255,255,255,0.08)',
                      color: isActive ? '#c7d2fe' : 'rgba(255,255,255,0.35)',
                    }}
                  >
                    {getFlashcardsForTopic(topic.id).length}
                  </span>
                )}
              </motion.button>
            )
          })}
        </div>
      </div>

      {/* ── Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-4 py-6">
        <AnimatePresence mode="wait">
          {/* ── Generating state */}
          {isGenerating && (
            <motion.div
              key="generating"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center gap-4"
            >
              <SkeletonCard />
              <div className="flex items-center gap-2 text-indigo-400 text-sm mt-4">
                <Loader2 size={16} className="animate-spin" />
                <span>Generating flashcards with AI…</span>
              </div>
            </motion.div>
          )}

          {/* ── No cards for this topic */}
          {!isGenerating && cards.length === 0 && !sessionComplete && (
            <motion.div
              key="empty"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="flex flex-col items-center gap-5 text-center max-w-sm"
            >
              <div className="text-5xl">
                {topics.find((t) => t.id === selectedTopicId)?.emoji ?? '📖'}
              </div>
              <div>
                <h3 className="text-xl font-semibold text-white mb-1">
                  No flashcards yet
                </h3>
                <p className="text-white/40 text-sm">
                  Generate AI-powered flashcards for{' '}
                  <span className="text-indigo-400">
                    {topics.find((t) => t.id === selectedTopicId)?.title}
                  </span>
                </p>
              </div>
              {generateError && (
                <p className="text-red-400 text-sm bg-red-400/10 px-4 py-2 rounded-lg">
                  {generateError}
                </p>
              )}
              <motion.button
                onClick={handleGenerate}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.97 }}
                className="flex items-center gap-2 px-6 py-3 rounded-xl font-semibold text-white"
                style={{
                  background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                  boxShadow: '0 0 24px rgba(99,102,241,0.4)',
                }}
              >
                <Sparkles size={18} />
                Generate Flashcards
              </motion.button>
            </motion.div>
          )}

          {/* ── Session complete */}
          {sessionComplete && (
            <motion.div
              key="complete"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ type: 'spring', stiffness: 240, damping: 22 }}
              className="flex flex-col items-center gap-6 text-center max-w-sm w-full"
            >
              {/* Glow orb */}
              <div className="relative">
                <div
                  className="absolute inset-0 rounded-full blur-3xl"
                  style={{ background: 'rgba(99,102,241,0.3)', transform: 'scale(1.5)' }}
                />
                <div className="relative text-6xl">🎉</div>
              </div>

              <div>
                <h2 className="text-3xl font-bold text-white mb-2">Session Complete!</h2>
                <p className="text-white/40">Here's how you did</p>
              </div>

              {/* Stats */}
              <div className="flex gap-4 w-full">
                <div
                  className="flex-1 rounded-2xl p-4 text-center"
                  style={{
                    background: 'rgba(34,197,94,0.1)',
                    border: '1px solid rgba(34,197,94,0.25)',
                  }}
                >
                  <div className="text-3xl font-bold text-green-400">{knownCount}</div>
                  <div className="text-xs text-green-400/70 mt-1">Mastered</div>
                </div>
                <div
                  className="flex-1 rounded-2xl p-4 text-center"
                  style={{
                    background: 'rgba(239,68,68,0.1)',
                    border: '1px solid rgba(239,68,68,0.25)',
                  }}
                >
                  <div className="text-3xl font-bold text-red-400">{reviewCount}</div>
                  <div className="text-xs text-red-400/70 mt-1">Need Review</div>
                </div>
                <div
                  className="flex-1 rounded-2xl p-4 text-center"
                  style={{
                    background: 'rgba(99,102,241,0.1)',
                    border: '1px solid rgba(99,102,241,0.25)',
                  }}
                >
                  <div className="text-3xl font-bold text-indigo-400">{cards.length}</div>
                  <div className="text-xs text-indigo-400/70 mt-1">Total</div>
                </div>
              </div>

              {/* Mastery bar */}
              <div className="w-full">
                <div className="flex justify-between text-xs text-white/40 mb-1.5">
                  <span>Mastery</span>
                  <span>
                    {cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0}%
                  </span>
                </div>
                <div
                  className="h-2 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{
                      width: `${cards.length > 0 ? (knownCount / cards.length) * 100 : 0}%`,
                    }}
                    transition={{ duration: 1, delay: 0.3, ease: 'easeOut' }}
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #22c55e)',
                    }}
                  />
                </div>
              </div>

              {/* Action buttons */}
              <div className="flex gap-3 w-full">
                <motion.button
                  onClick={handleRestart}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                  style={{
                    background: 'rgba(255,255,255,0.06)',
                    border: '1px solid rgba(255,255,255,0.1)',
                    color: 'rgba(255,255,255,0.7)',
                  }}
                >
                  <RotateCcw size={16} />
                  Restart
                </motion.button>
                <motion.button
                  onClick={() => navigate('/quiz')}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.97 }}
                  className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm text-white"
                  style={{
                    background: 'linear-gradient(135deg, #6366f1, #8b5cf6)',
                    boxShadow: '0 0 20px rgba(99,102,241,0.35)',
                  }}
                >
                  Take Quiz
                  <ArrowRight size={16} />
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── Active flashcard session */}
          {!isGenerating && cards.length > 0 && !sessionComplete && currentCard && (
            <motion.div
              key="session"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center w-full max-w-2xl gap-6"
            >
              {/* Card counter */}
              <div className="text-sm text-white/40">
                Card{' '}
                <span className="text-white font-semibold">{currentIndex + 1}</span>
                {' '}of{' '}
                <span className="text-white font-semibold">{cards.length}</span>
              </div>

              {/* ── Flip card area */}
              <div className="flex items-center gap-4 w-full">
                {/* Prev button */}
                <motion.button
                  onClick={goPrev}
                  disabled={currentIndex === 0}
                  whileHover={{ scale: currentIndex === 0 ? 1 : 1.1 }}
                  whileTap={{ scale: currentIndex === 0 ? 1 : 0.93 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: currentIndex === 0 ? 'rgba(255,255,255,0.15)' : 'rgba(255,255,255,0.6)',
                    cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
                  }}
                >
                  <ChevronLeft size={18} />
                </motion.button>

                {/* ── The 3D card */}
                <div
                  ref={cardContainerRef}
                  className="flex-1 cursor-pointer"
                  style={{ perspective: '1000px' }}
                  onClick={handleFlip}
                >
                  <motion.div
                    style={{ transformStyle: 'preserve-3d', position: 'relative', height: '300px' }}
                    animate={{ rotateY: isFlipped ? 180 : 0 }}
                    transition={{ duration: 0.5, type: 'spring', stiffness: 200, damping: 20 }}
                  >
                    {/* ── Front face */}
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 select-none"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        background:
                          'linear-gradient(135deg, rgba(99,102,241,0.08) 0%, rgba(255,255,255,0.04) 100%)',
                        border: '1px solid rgba(99,102,241,0.2)',
                        boxShadow:
                          '0 0 40px rgba(99,102,241,0.1), inset 0 1px 0 rgba(255,255,255,0.06)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      {/* Label */}
                      <span
                        className="absolute top-4 left-5 text-xs font-semibold tracking-widest uppercase"
                        style={{ color: 'rgba(99,102,241,0.6)' }}
                      >
                        Question
                      </span>

                      <p className="text-white text-xl font-semibold text-center leading-relaxed">
                        {currentCard.front}
                      </p>

                      {/* Flip hint */}
                      <AnimatePresence>
                        {!hasFlippedOnce && (
                          <motion.span
                            initial={{ opacity: 0.7 }}
                            animate={{ opacity: [0.7, 0.4, 0.7] }}
                            exit={{ opacity: 0 }}
                            transition={{ duration: 1.8, repeat: Infinity, exit: { duration: 0.3 } }}
                            className="absolute bottom-4 text-xs"
                            style={{ color: 'rgba(255,255,255,0.3)' }}
                          >
                            Tap to flip
                          </motion.span>
                        )}
                      </AnimatePresence>
                    </div>

                    {/* ── Back face */}
                    <div
                      className="absolute inset-0 rounded-2xl flex flex-col items-center justify-center p-8 select-none"
                      style={{
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        background:
                          'linear-gradient(135deg, rgba(139,92,246,0.1) 0%, rgba(255,255,255,0.05) 100%)',
                        border: '1px solid rgba(139,92,246,0.25)',
                        boxShadow:
                          '0 0 40px rgba(139,92,246,0.12), inset 0 1px 0 rgba(255,255,255,0.07)',
                        backdropFilter: 'blur(16px)',
                      }}
                    >
                      {/* Label */}
                      <span
                        className="absolute top-4 left-5 text-xs font-semibold tracking-widest uppercase"
                        style={{ color: 'rgba(139,92,246,0.6)' }}
                      >
                        Answer
                      </span>

                      <p className="text-white text-lg font-medium text-center leading-relaxed">
                        {currentCard.back}
                      </p>

                      {/* Hint */}
                      {currentCard.hint && (
                        <p
                          className="absolute bottom-4 text-xs text-center px-4"
                          style={{ color: 'rgba(255,255,255,0.3)' }}
                        >
                          💡 {currentCard.hint}
                        </p>
                      )}
                    </div>
                  </motion.div>
                </div>

                {/* Next button */}
                <motion.button
                  onClick={goNext}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.93 }}
                  className="flex-shrink-0 w-10 h-10 rounded-full flex items-center justify-center transition-all duration-200"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    color: 'rgba(255,255,255,0.6)',
                    cursor: 'pointer',
                  }}
                >
                  <ChevronRight size={18} />
                </motion.button>
              </div>

              {/* ── Progress bar */}
              <div className="w-full px-14">
                <div
                  className="h-1.5 rounded-full overflow-hidden"
                  style={{ background: 'rgba(255,255,255,0.07)' }}
                >
                  <motion.div
                    className="h-full rounded-full"
                    style={{
                      background: 'linear-gradient(90deg, #6366f1, #8b5cf6)',
                    }}
                    animate={{ width: `${progressPct}%` }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                  />
                </div>

                {/* Result dots */}
                <div className="flex gap-1 mt-2 justify-center flex-wrap">
                  {cards.map((sc, idx) => (
                    <motion.div
                      key={idx}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: idx * 0.02 }}
                      className="w-2 h-2 rounded-full"
                      style={{
                        background:
                          sc.result === 'known'
                            ? '#22c55e'
                            : sc.result === 'review'
                            ? '#ef4444'
                            : idx === currentIndex
                            ? '#6366f1'
                            : 'rgba(255,255,255,0.12)',
                        boxShadow:
                          idx === currentIndex ? '0 0 6px rgba(99,102,241,0.7)' : 'none',
                      }}
                    />
                  ))}
                </div>
              </div>

              {/* ── Action buttons (visible only when flipped) */}
              <AnimatePresence>
                {isFlipped && (
                  <motion.div
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    transition={{ duration: 0.25 }}
                    className="flex gap-4 w-full max-w-sm"
                  >
                    <motion.button
                      onClick={() => handleResult('review')}
                      whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(239,68,68,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                      style={{
                        background: 'rgba(239,68,68,0.12)',
                        border: '1px solid rgba(239,68,68,0.3)',
                        color: '#f87171',
                      }}
                    >
                      <X size={16} />
                      Review Again
                    </motion.button>
                    <motion.button
                      onClick={() => handleResult('known')}
                      whileHover={{ scale: 1.04, boxShadow: '0 0 20px rgba(34,197,94,0.35)' }}
                      whileTap={{ scale: 0.97 }}
                      className="flex-1 flex items-center justify-center gap-2 py-3 rounded-xl font-semibold text-sm"
                      style={{
                        background: 'rgba(34,197,94,0.12)',
                        border: '1px solid rgba(34,197,94,0.3)',
                        color: '#4ade80',
                      }}
                    >
                      <Check size={16} />
                      Got it
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* ── Keyboard shortcut hint */}
              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
                {isFlipped
                  ? 'Press 1 to mark as Review · Press 2 to mark as Got it · → to continue'
                  : 'Press Space or Enter to flip'}
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
