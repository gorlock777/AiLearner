import { useState, useEffect, useCallback } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  Layers,
  Loader2,
  AlertCircle,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { generateFlashcardsPrompt } from '../lib/prompts'
import type { Flashcard } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'
import { Alert, AlertDescription } from '../components/ui/alert'

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
      }, 150)
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

  if (topics.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <Layers size={20} />
        </div>
        <h2 className="text-base font-semibold text-zinc-100 mb-1">No notes uploaded</h2>
        <p className="text-xs text-zinc-400 mb-5">
          Upload course material first to generate flashcard sets.
        </p>
        <Button onClick={() => navigate('/app')}>
          Upload Material
        </Button>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      {/* Header and Topic Tabs */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Flashcard Workspace</h1>
            <p className="text-xs text-zinc-400">Interactive spaced repetition deck</p>
          </div>
          <Badge variant="secondary" className="font-mono text-xs">
            {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
          </Badge>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId
            return (
              <Button
                key={t.id}
                variant={isSelected ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTopicId(t.id)}
                className={`whitespace-nowrap text-xs ${
                  isSelected ? 'border-zinc-700 bg-zinc-800 text-white' : 'text-zinc-400'
                }`}
              >
                {t.title}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Main Flashcard Work Area */}
      <div className="w-full max-w-xl flex flex-col items-center">
        {isGenerating ? (
          <div className="linear-card w-full p-12 text-center flex flex-col items-center">
            <Loader2 size={24} className="animate-spin text-zinc-300 mb-3" />
            <div className="text-sm font-medium text-zinc-200">
              Generating active flashcards with AI...
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="linear-card w-full p-8 text-center">
            <Layers size={22} className="text-zinc-500 mx-auto mb-3" />
            <div className="text-sm font-medium text-zinc-200 mb-1">
              No flashcards for this topic yet
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Synthesize a targeted flashcard deck for active recall.
            </p>
            {generateError && (
              <div className="mb-4">
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{generateError}</AlertDescription>
                </Alert>
              </div>
            )}
            <Button onClick={handleGenerate} className="mx-auto">
              Generate Cards
            </Button>
          </div>
        ) : sessionComplete ? (
          <div className="linear-card linear-card-highlight w-full p-8 text-center">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Deck Completed
            </div>
            <div className="text-3xl font-bold text-zinc-100 mb-2 font-mono">
              {cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0}% Mastery
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              Summary of your active recall attempt
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-emerald-400">{knownCount}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Mastered</div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-amber-400">{reviewCount}</div>
                <div className="text-[11px] text-zinc-400 mt-0.5">Needs Review</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" onClick={handleRestart}>
                <RotateCcw size={14} />
                Restart Deck
              </Button>
              <Button onClick={() => navigate('/quiz')}>
                Take Practice Quiz
                <ArrowRight size={14} />
              </Button>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full flex flex-col items-center">
            {/* Linear 3D Card */}
            <div
              onClick={handleFlip}
              className="w-full h-72 cursor-pointer select-none linear-card linear-card-highlight p-8 flex flex-col justify-between relative shadow-lg"
            >
              <div className="flex items-center justify-between text-xs text-zinc-400 font-mono">
                <span className="font-semibold uppercase tracking-wider text-[10px] text-zinc-400">
                  {isFlipped ? 'ANSWER / EXPLANATION' : 'TERM / CONCEPT'}
                </span>
                <span className="flex items-center gap-1 text-[11px]">
                  Press <kbd className="kbd">Space</kbd> to flip
                </span>
              </div>

              <div className="my-auto text-center">
                <div className="text-lg font-medium text-zinc-100 leading-relaxed max-w-md mx-auto">
                  {isFlipped ? currentCard.card.back : currentCard.card.front}
                </div>
                {isFlipped && currentCard.card.hint && (
                  <div className="mt-3 text-xs text-zinc-400 font-mono">
                    Hint: {currentCard.card.hint}
                  </div>
                )}
              </div>

              {/* Progress step dots */}
              <div className="flex items-center justify-center gap-1.5">
                {cards.map((c, idx) => (
                  <div
                    key={c.card.id || idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-4 bg-zinc-200'
                        : c.result === 'known'
                        ? 'w-1.5 bg-emerald-500'
                        : c.result === 'review'
                        ? 'w-1.5 bg-amber-500'
                        : 'w-1.5 bg-zinc-800'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation & Keycap Legend */}
            <div className="w-full mt-5 flex items-center justify-between">
              <Button
                variant="secondary"
                size="icon"
                onClick={goPrev}
                disabled={currentIndex === 0}
                title="Previous card"
              >
                <ChevronLeft size={16} />
              </Button>

              <div className="flex items-center gap-3">
                <Button
                  variant="secondary"
                  onClick={() => handleResult('review')}
                  className="flex items-center gap-2 text-xs"
                >
                  <X size={13} className="text-amber-400" />
                  Review Again
                  <kbd className="kbd">1</kbd>
                </Button>
                <Button
                  variant="secondary"
                  onClick={() => handleResult('known')}
                  className="flex items-center gap-2 text-xs"
                >
                  <Check size={13} className="text-emerald-400" />
                  Mastered
                  <kbd className="kbd">2</kbd>
                </Button>
              </div>

              <Button
                variant="secondary"
                size="icon"
                onClick={goNext}
                title="Next card"
              >
                <ChevronRight size={16} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Study
