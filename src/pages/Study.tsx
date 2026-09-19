import { useState, useEffect, useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
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
  FileText,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { generateFlashcardsPrompt } from '../lib/prompts'
import type { Flashcard } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Alert, AlertDescription } from '../components/ui/alert'
import { CardFlip } from '../components/ui/card-flip'
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
      }, 120)
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
        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <Layers size={16} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">No study modules loaded</h2>
        <p className="text-xs text-zinc-400 mb-4">
          Import course material first to generate flashcard sets.
        </p>
        <Button size="sm" onClick={() => navigate('/app')}>
          Import Material
        </Button>
      </div>
    )
  }

  const activeTopic = topics.find((t) => t.id === selectedTopicId)

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-6 max-w-3xl mx-auto">
      {/* Header and Topic Tabs */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-3">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 font-mono uppercase tracking-wider">
              Flashcard Deck
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeTopic?.title ?? 'Active Spaced Repetition'}
            </p>
          </div>
          <Badge variant="secondary">
            {cards.length > 0 ? `${currentIndex + 1} / ${cards.length}` : '0 / 0'}
          </Badge>
        </div>

        {/* Topic Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
          {topics.map((t) => {
            const isSelected = t.id === selectedTopicId
            return (
              <Button
                key={t.id}
                variant={isSelected ? 'secondary' : 'ghost'}
                size="sm"
                onClick={() => setSelectedTopicId(t.id)}
                className={`whitespace-nowrap text-xs h-7 px-2.5 font-mono ${
                  isSelected ? 'border-zinc-700 bg-zinc-800 text-zinc-100' : 'text-zinc-400'
                }`}
              >
                {t.title}
              </Button>
            )
          })}
        </div>
      </div>

      {/* Main Flashcard Work Area */}
      <div className="w-full flex flex-col items-center">
        {isGenerating ? (
          <div className="linear-card w-full p-12 text-center flex flex-col items-center">
            <Loader2 size={20} className="animate-spin text-zinc-300 mb-3" />
            <div className="text-xs font-mono text-zinc-300">
              Generating active flashcards...
            </div>
          </div>
        ) : cards.length === 0 ? (
          <div className="linear-card w-full p-8 text-center">
            <Layers size={20} className="text-zinc-500 mx-auto mb-2" />
            <div className="text-xs font-semibold text-zinc-200 mb-1 font-mono">
              NO FLASHCARDS FOR THIS TOPIC
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
            <ShimmerButton onClick={handleGenerate} className="mx-auto">
              Generate Cards
            </ShimmerButton>
          </div>
        ) : sessionComplete ? (
          <div className="linear-card linear-card-highlight w-full p-8 text-center flex flex-col items-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-4">
              Active Recall Session Complete
            </div>

            <GaugeMeter
              value={cards.length > 0 ? Math.round((knownCount / cards.length) * 100) : 0}
              size={140}
              strokeWidth={10}
              label="Mastery"
              sublabel={`${knownCount} of ${cards.length} cards retained`}
              className="mb-6"
            />

            <div className="grid grid-cols-2 gap-3 w-full max-w-sm mb-6">
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-emerald-400">{knownCount}</div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Mastered</div>
              </div>
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-amber-400">{reviewCount}</div>
                <div className="text-[11px] text-zinc-400 font-mono mt-0.5">Needs Review</div>
              </div>
            </div>

            <div className="flex items-center justify-center gap-3">
              <Button variant="secondary" size="sm" onClick={handleRestart}>
                <RotateCcw size={12} />
                Restart Deck
              </Button>
              <ShimmerButton onClick={() => navigate('/quiz')}>
                Take Practice Quiz
                <ArrowRight size={12} />
              </ShimmerButton>
            </div>
          </div>
        ) : currentCard ? (
          <div className="w-full flex flex-col items-center">
            {/* Precision 3D CardFlip */}
            <CardFlip
              isFlipped={isFlipped}
              onFlip={handleFlip}
              className="w-full min-h-[270px]"
              front={
                <div className="w-full h-full min-h-[270px] linear-card linear-card-highlight p-6 flex flex-col justify-between border border-zinc-800 hover:border-zinc-700 transition-colors shadow-lg">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                    <span className="uppercase text-[10px] text-zinc-400 font-mono">
                      CONCEPT / PROMPT
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <kbd className="kbd">Space</kbd> Flip
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center">
                    <div className="font-serif text-lg font-normal text-zinc-100 leading-relaxed max-w-lg mx-auto">
                      {currentCard.card.front}
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
                    <span>{activeTopic?.title}</span>
                    <div className="flex items-center gap-1">
                      {cards.map((c, idx) => (
                        <div
                          key={c.card.id || idx}
                          className={`h-1 rounded-sm transition-all ${
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
                    <span>{currentIndex + 1} / {cards.length}</span>
                  </div>
                </div>
              }
              back={
                <div className="w-full h-full min-h-[270px] linear-card linear-card-highlight p-6 flex flex-col justify-between border border-zinc-700/80 bg-zinc-900/95 shadow-xl">
                  <div className="flex items-center justify-between text-[11px] font-mono text-zinc-400 border-b border-zinc-800/60 pb-2.5">
                    <span className="uppercase text-[10px] text-emerald-400 font-mono">
                      ANSWER / KEY CONCEPT
                    </span>
                    <span className="flex items-center gap-1 text-[11px] text-zinc-400 font-mono">
                      <kbd className="kbd">Space</kbd> Flip Back
                    </span>
                  </div>

                  <div className="my-auto py-6 text-center">
                    <div className="font-serif text-lg font-normal text-zinc-100 leading-relaxed max-w-lg mx-auto">
                      {currentCard.card.back}
                    </div>
                    {currentCard.card.hint && (
                      <div className="mt-3 text-xs text-zinc-400 font-mono">
                        Hint: {currentCard.card.hint}
                      </div>
                    )}
                  </div>

                  <div className="flex items-center justify-between pt-2.5 border-t border-zinc-800/60 text-[10px] font-mono text-zinc-400">
                    <span className="text-emerald-400/80">{activeTopic?.title}</span>
                    <div className="flex items-center gap-1">
                      {cards.map((c, idx) => (
                        <div
                          key={c.card.id || idx}
                          className={`h-1 rounded-sm transition-all ${
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
                    <span>{currentIndex + 1} / {cards.length}</span>
                  </div>
                </div>
              }
            />

            {/* Navigation & Command Legend */}
            <div className="w-full mt-4 flex items-center justify-between">
              <Button
                variant="secondary"
                size="sm"
                onClick={goPrev}
                disabled={currentIndex === 0}
                className="h-8 px-2.5"
                title="Previous card"
              >
                <ChevronLeft size={14} />
              </Button>

              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResult('review')}
                  className="h-8 text-xs font-mono"
                >
                  <X size={12} className="text-amber-400" />
                  Hard <kbd className="kbd ml-1">1</kbd>
                </Button>
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => handleResult('known')}
                  className="h-8 text-xs font-mono"
                >
                  <Check size={12} className="text-emerald-400" />
                  Good <kbd className="kbd ml-1">2</kbd>
                </Button>
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={goNext}
                className="h-8 px-2.5"
                title="Next card"
              >
                <ChevronRight size={14} />
              </Button>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Study
