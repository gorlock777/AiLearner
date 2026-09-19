import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Check,
  RotateCw,
  Layers,
  Loader2,
  AlertCircle,
  Sparkles,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { generateFlashcardsPrompt } from '../lib/prompts'
import type { Flashcard } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { GaugeMeter } from '../components/ui/gauge-meter'
import { ShimmerButton } from '../components/ui/shimmer-button'

type CardResult = 'known' | 'review' | null

interface SessionCard {
  card: Flashcard
  result: CardResult
}

export function Study() {
  const navigate = useNavigate()
  const { topics, getFlashcardsForTopic, addFlashcardSet, documents } = useAppStore()

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics[0]?.id ?? null
  )
  const [cards, setCards] = useState<SessionCard[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [isGenerating, setIsGenerating] = useState(false)
  const [generateError, setGenerateError] = useState<string | null>(null)
  const [sessionComplete, setSessionComplete] = useState(false)

  // Sync selected topic
  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id)
    }
  }, [topics, selectedTopicId])

  // Load flashcards for topic
  useEffect(() => {
    if (!selectedTopicId) return
    const existing = getFlashcardsForTopic(selectedTopicId)
    if (existing.length > 0) {
      setCards(existing.map((card) => ({ card, result: null })))
      setCurrentIndex(0)
      setIsFlipped(false)
      setSessionComplete(false)
      setGenerateError(null)
    } else {
      setCards([])
      setSessionComplete(false)
    }
  }, [selectedTopicId, getFlashcardsForTopic])

  const handleGenerate = useCallback(async () => {
    if (!selectedTopicId) return
    const topic = topics.find((t) => t.id === selectedTopicId)
    if (!topic) return

    const text = documents[0]?.text ?? ''
    if (!text) {
      setGenerateError('No document text found. Please upload notes in the workspace first.')
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
      setSessionComplete(false)
    } catch (err) {
      setGenerateError(err instanceof Error ? err.message : 'Failed to generate flashcards.')
    } finally {
      setIsGenerating(false)
    }
  }, [selectedTopicId, topics, documents, addFlashcardSet])

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
  }, [])

  const handleResult = useCallback(
    (result: 'known' | 'review') => {
      setCards((prev) =>
        prev.map((sc, idx) => (idx === currentIndex ? { ...sc, result } : sc))
      )
      setTimeout(() => {
        goNext()
      }, 100)
    },
    [currentIndex, goNext]
  )

  const handleRestart = () => {
    setCards((prev) => prev.map((sc) => ({ ...sc, result: null })))
    setCurrentIndex(0)
    setIsFlipped(false)
    setSessionComplete(false)
  }

  // Keyboard navigation
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (['input', 'textarea'].includes((e.target as HTMLElement)?.tagName?.toLowerCase())) {
        return
      }
      if (e.code === 'Space' || e.key === 'Enter') {
        e.preventDefault()
        handleFlip()
      } else if (e.key === 'ArrowRight') {
        e.preventDefault()
        goNext()
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault()
        goPrev()
      } else if (e.key === '1' && isFlipped) {
        e.preventDefault()
        handleResult('review')
      } else if (e.key === '2' && isFlipped) {
        e.preventDefault()
        handleResult('known')
      }
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [handleFlip, goNext, goPrev, handleResult, isFlipped])

  const currentCard = cards[currentIndex]
  const knownCount = cards.filter((c) => c.result === 'known').length
  const reviewCount = cards.filter((c) => c.result === 'review').length
  const activeTopic = topics.find((t) => t.id === selectedTopicId)
  const progressPercent = cards.length > 0 ? ((currentIndex + 1) / cards.length) * 100 : 0

  if (topics.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <Layers size={22} strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-xl font-normal text-zinc-100 mb-2">No study modules loaded</h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed max-w-sm">
          Import course material or select a sample preset in the workspace to synthesize your flashcards.
        </p>
        <ShimmerButton onClick={() => navigate('/app')} className="px-5 py-2.5">
          <span>Go to Workspace</span>
          <ArrowRight size={14} />
        </ShimmerButton>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center px-4 sm:px-6 py-8 md:py-12 max-w-3xl mx-auto">
      {/* ── Editorial Header & Topic Selector ── */}
      <header className="w-full mb-8 flex flex-col items-center text-center">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-300 font-semibold mb-2">
          Active Recall Deck
        </span>

        {/* Minimal Topic Selector Bar */}
        <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl mx-auto mt-1 mb-3">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`text-xs px-3 py-1 rounded-full transition-all duration-150 cursor-pointer ${
                  isSelected
                    ? 'bg-zinc-100 text-zinc-950 font-medium shadow-sm'
                    : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/60'
                }`}
              >
                {t.title}
              </button>
            )
          })}
        </div>

        {cards.length > 0 && !sessionComplete && (
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-300 mt-1">
            <span>Card {currentIndex + 1} of {cards.length}</span>
            <span className="text-zinc-700">·</span>
            <div className="w-24 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* ── Main Workspace Body ── */}
      <div className="w-full flex flex-col items-center">
        {isGenerating ? (
          <div className="w-full py-24 text-center flex flex-col items-center">
            <Loader2 size={24} className="animate-spin text-zinc-400 mb-4" />
            <div className="font-heading text-lg font-normal text-zinc-200">
              Synthesizing flashcard deck...
            </div>
            <p className="text-xs text-zinc-300 mt-1 font-mono">
              Extracting core definitions and active prompts
            </p>
          </div>
        ) : cards.length === 0 ? (
          <div className="w-full max-w-md p-10 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 text-center flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-zinc-850 border border-zinc-750 flex items-center justify-center text-zinc-400 mb-3">
              <Sparkles size={18} className="text-emerald-400" />
            </div>
            <h3 className="font-heading text-lg font-normal text-zinc-100 mb-1.5">
              Ready to generate cards
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Create an active recall set for <strong className="text-zinc-300">{activeTopic?.title}</strong>.
            </p>
            {generateError && (
              <div className="mb-4 w-full">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generateError}</AlertDescription>
                </Alert>
              </div>
            )}
            <ShimmerButton onClick={handleGenerate} className="px-5 py-2.5">
              <span>Generate Flashcards</span>
              <ArrowRight size={13} />
            </ShimmerButton>
          </div>
        ) : sessionComplete ? (
          /* ── Session Complete Screen ── */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="w-full max-w-lg p-10 rounded-2xl bg-[#0d0d10] border border-zinc-800 text-center flex flex-col items-center shadow-2xl"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold mb-6">
              Session Complete
            </span>

            <GaugeMeter
              value={cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0}
              size={150}
              strokeWidth={10}
              label="Mastery"
              sublabel={`${knownCount} of ${cards.length} cards retained`}
              className="mb-8"
            />

            <div className="grid grid-cols-2 gap-3 w-full mb-8">
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-emerald-400">{knownCount}</div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1">Mastered</div>
              </div>
              <div className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-amber-400">{reviewCount}</div>
                <div className="text-[11px] text-zinc-400 font-mono mt-1">Needs Review</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="font-mono text-xs h-9 px-4"
              >
                <RotateCcw size={13} />
                Restart Deck
              </Button>
              <ShimmerButton
                onClick={() => navigate('/quiz')}
                className="text-xs h-9 px-4"
              >
                <span>Take Practice Quiz</span>
                <ArrowRight size={13} />
              </ShimmerButton>
            </div>
          </motion.div>
        ) : currentCard ? (
          /* ── Spacious Editorial Flashcard ── */
          <div className="w-full flex flex-col items-center">
            {/* The Flashcard Surface */}
            <div
              onClick={handleFlip}
              className="group relative w-full min-h-[340px] md:min-h-[380px] rounded-2xl bg-[#0e0e12] border border-zinc-800/90 p-8 sm:p-12 md:p-16 flex flex-col justify-between shadow-2xl transition-all duration-300 hover:border-zinc-700 cursor-pointer select-none"
            >
              {/* Subtle top label */}
              <div className="flex items-center justify-between text-xs font-mono text-zinc-300">
                <span className="uppercase tracking-widest text-[10px]">
                  {isFlipped ? 'Answer / Insight' : 'Prompt / Concept'}
                </span>
                <span className="flex items-center gap-1 text-[11px] text-zinc-400 group-hover:text-zinc-300 transition-colors">
                  <RotateCw size={11} className="group-hover:rotate-180 transition-transform duration-500" />
                  <span>Click or <kbd className="kbd">Space</kbd> to flip</span>
                </span>
              </div>

              {/* Centered Editorial Typography */}
              <div className="my-auto py-8 text-center">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={isFlipped ? 'back' : 'front'}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.18 }}
                    className="font-heading font-normal text-xl sm:text-2xl md:text-3xl text-zinc-100 leading-relaxed max-w-xl mx-auto"
                  >
                    {isFlipped ? currentCard.card.back : currentCard.card.front}
                  </motion.div>
                </AnimatePresence>

                {isFlipped && currentCard.card.hint && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.1 }}
                    className="mt-6 text-xs text-zinc-400 font-mono max-w-md mx-auto"
                  >
                    Context: {currentCard.card.hint}
                  </motion.div>
                )}
              </div>

              {/* Bottom Card Footer */}
              <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 pt-3 border-t border-zinc-850/70">
                <span>{activeTopic?.title}</span>
                <span className="text-zinc-400">{currentIndex + 1} / {cards.length}</span>
              </div>
            </div>

            {/* ── Tactical Response Controls ── */}
            <div className="w-full mt-6 flex flex-col items-center gap-3">
              {isFlipped ? (
                <div className="grid grid-cols-2 gap-3 w-full max-w-md">
                  <button
                    onClick={() => handleResult('review')}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 transition-all font-mono text-xs font-medium cursor-pointer"
                  >
                    <span>Needs Review</span>
                    <kbd className="kbd text-amber-300 border-amber-500/30 bg-amber-950/40">1</kbd>
                  </button>

                  <button
                    onClick={() => handleResult('known')}
                    className="flex items-center justify-center gap-2 py-3 px-4 rounded-xl bg-emerald-500/10 hover:bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 transition-all font-mono text-xs font-medium cursor-pointer"
                  >
                    <Check size={14} />
                    <span>Mastered</span>
                    <kbd className="kbd text-emerald-300 border-emerald-500/30 bg-emerald-950/40">2</kbd>
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between w-full max-w-md px-2 text-xs text-zinc-300 font-mono">
                  <button
                    onClick={goPrev}
                    disabled={currentIndex === 0}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-600 cursor-pointer"
                  >
                    <ChevronLeft size={14} />
                    <span>Previous (<kbd className="kbd text-[9px]">←</kbd>)</span>
                  </button>

                  <button
                    onClick={handleFlip}
                    className="px-4 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-zinc-300 hover:text-white hover:bg-zinc-800 transition-colors cursor-pointer"
                  >
                    Reveal Answer
                  </button>

                  <button
                    onClick={goNext}
                    disabled={currentIndex === cards.length - 1}
                    className="flex items-center gap-1 text-zinc-400 hover:text-zinc-200 disabled:opacity-30 disabled:hover:text-zinc-600 cursor-pointer"
                  >
                    <span>Next (<kbd className="kbd text-[9px]">→</kbd>)</span>
                    <ChevronRight size={14} />
                  </button>
                </div>
              )}
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Study
