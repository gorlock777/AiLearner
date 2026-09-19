import { useState, useEffect, useCallback, useRef } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import {
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  ArrowRight,
  Check,
  X,
  BookOpen,
  Loader2,
  Layers,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { generateFlashcardsPrompt } from '../lib/prompts'
import type { Flashcard } from '../store/useAppStore'

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

  // Sync selected topic if list updates
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
      setGenerateError('No document text available. Please upload notes first.')
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

  // Keyboard controls
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
        <div className="w-12 h-12 rounded-lg bg-[#182030] border border-[#252f44] flex items-center justify-center text-slate-400 mb-4">
          <BookOpen size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">No notes uploaded</h2>
        <p className="text-sm text-slate-400 mb-6">
          Upload your notes or syllabus first to generate flashcard sets.
        </p>
        <Link to="/" className="btn-primary">
          Go to Upload
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-8 max-w-4xl mx-auto">
      {/* Header and Topic Tabs */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-2xl font-semibold text-slate-100">Flashcards</h1>
          <span className="text-xs text-slate-400">
            {cards.length > 0 ? `${currentIndex + 1} of ${cards.length}` : '0 cards'}
          </span>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId
            return (
              <button
                key={t.id}
                onClick={() => setSelectedTopicId(t.id)}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors border ${
                  isSelected
                    ? 'bg-[#2563eb] text-white border-blue-500'
                    : 'bg-[#131926] text-slate-300 border-[#1e2638] hover:bg-[#182030]'
                }`}
              >
                {t.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Flashcard Work Area */}
      <div className="w-full max-w-xl flex flex-col items-center">
        {isGenerating ? (
          <div className="ui-card w-full p-12 text-center flex flex-col items-center">
            <Loader2 size={24} className="animate-spin text-blue-500 mb-3" />
            <div className="text-sm font-medium text-slate-200">
              Generating flashcards for topic
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="ui-card w-full p-8 text-center">
            <Layers size={24} className="text-slate-500 mx-auto mb-3" />
            <div className="text-sm font-medium text-slate-200 mb-1">
              No flashcards for this topic yet
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Synthesize a study deck from your document.
            </p>
            {generateError && (
              <div className="text-xs text-red-400 mb-4">{generateError}</div>
            )}
            <button onClick={handleGenerate} className="btn-primary mx-auto">
              Generate Cards
            </button>
          </div>
        ) : sessionComplete ? (
          <div className="ui-card w-full p-8 text-center">
            <div className="text-lg font-semibold text-slate-100 mb-1">
              Session Completed
            </div>
            <p className="text-xs text-slate-400 mb-6">
              Review results for this deck
            </p>

            <div className="grid grid-cols-2 gap-3 mb-6">
              <div className="ui-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-emerald-400">{knownCount}</div>
                <div className="text-xs text-slate-400 mt-0.5">Mastered</div>
              </div>
              <div className="ui-card-subtle p-4 text-center">
                <div className="text-2xl font-bold text-rose-400">{reviewCount}</div>
                <div className="text-xs text-slate-400 mt-0.5">Needs Review</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={handleRestart} className="btn-secondary">
                <RotateCcw size={14} />
                Restart Deck
              </button>
              <button onClick={() => navigate('/quiz')} className="btn-primary">
                Practice Quiz
                <ArrowRight size={14} />
              </button>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full flex flex-col items-center">
            {/* 3D Physical Card */}
            <div
              onClick={handleFlip}
              className="w-full h-72 cursor-pointer select-none rounded-xl bg-[#131926] border border-[#1e2638] hover:border-[#2b374e] transition-colors p-8 flex flex-col justify-between relative shadow-sm"
            >
              <div className="flex items-center justify-between text-xs text-slate-400">
                <span className="font-semibold uppercase tracking-wider text-[10px]">
                  {isFlipped ? 'Answer' : 'Question'}
                </span>
                <span>Click or Space to flip</span>
              </div>

              <div className="my-auto text-center">
                <div className="text-lg font-medium text-slate-100 leading-relaxed">
                  {isFlipped ? currentCard.card.back : currentCard.card.front}
                </div>
                {isFlipped && currentCard.card.hint && (
                  <div className="mt-3 text-xs text-slate-400">
                    Hint: {currentCard.card.hint}
                  </div>
                )}
              </div>

              <div className="flex items-center justify-center gap-1.5">
                {cards.map((c, idx) => (
                  <div
                    key={c.card.id || idx}
                    className={`h-1.5 rounded-full transition-all ${
                      idx === currentIndex
                        ? 'w-4 bg-blue-500'
                        : c.result === 'known'
                        ? 'w-1.5 bg-emerald-500'
                        : c.result === 'review'
                        ? 'w-1.5 bg-rose-500'
                        : 'w-1.5 bg-[#1e2638]'
                    }`}
                  />
                ))}
              </div>
            </div>

            {/* Navigation and Actions */}
            <div className="w-full mt-5 flex items-center justify-between">
              <button
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="btn-secondary px-3 py-1.5"
                title="Previous card"
              >
                <ChevronLeft size={16} />
              </button>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => handleResult('review')}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-rose-900/50 bg-rose-950/20 text-rose-300 hover:bg-rose-950/40 transition-colors flex items-center gap-1.5"
                >
                  <X size={14} />
                  Review Again
                  <span className="text-[10px] text-rose-400/60 ml-1">1</span>
                </button>
                <button
                  onClick={() => handleResult('known')}
                  className="px-4 py-2 rounded-lg text-xs font-medium border border-emerald-900/50 bg-emerald-950/20 text-emerald-300 hover:bg-emerald-950/40 transition-colors flex items-center gap-1.5"
                >
                  <Check size={14} />
                  Mastered
                  <span className="text-[10px] text-emerald-400/60 ml-1">2</span>
                </button>
              </div>

              <button
                onClick={goNext}
                className="btn-secondary px-3 py-1.5"
                title="Next card"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Study
