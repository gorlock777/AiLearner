import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  ArrowRight,
  Lightbulb,
  Layers,
  Loader2,
  AlertCircle,
  RotateCcw,
  CheckCircle2,
  XCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import { fetchCompletion, parseJSONResponse } from '../lib/openrouter'
import { feynmanEvalPrompt } from '../lib/prompts'
import { ShimmerButton } from '../components/ui/shimmer-button'
import { Button } from '../components/ui/button'
import { Alert, AlertDescription } from '../components/ui/alert'
import { GaugeMeter } from '../components/ui/gauge-meter'

interface FeynmanResult {
  score: number // 0–100
  strengths: string[]
  gaps: string[]
  modelExplanation: string
}

export function Feynman() {
  const navigate = useNavigate()
  const { topics } = useAppStore()

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics[0]?.id ?? null
  )
  const [explanation, setExplanation] = useState('')
  const [isEvaluating, setIsEvaluating] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<FeynmanResult | null>(null)
  const [showModel, setShowModel] = useState(false)

  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id)
    }
  }, [topics, selectedTopicId])

  const activeTopic = topics.find((t) => t.id === selectedTopicId)

  const handleReset = () => {
    setExplanation('')
    setResult(null)
    setError(null)
    setShowModel(false)
  }

  const handleTopicChange = (id: string) => {
    setSelectedTopicId(id)
    handleReset()
  }

  const handleEvaluate = async () => {
    if (!activeTopic || !explanation.trim()) return
    if (explanation.trim().split(/\s+/).length < 20) {
      setError('Write at least a few sentences — the Feynman technique only works when you really try to explain.')
      return
    }

    setIsEvaluating(true)
    setError(null)
    setResult(null)

    try {
      const messages = feynmanEvalPrompt(activeTopic.title, activeTopic.summary, explanation)
      const raw = await fetchCompletion(messages)
      const parsed = parseJSONResponse<FeynmanResult>(raw)
      setResult(parsed)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Evaluation failed. Please try again.')
    } finally {
      setIsEvaluating(false)
    }
  }

  if (topics.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-stone-100 border border-stone-200 flex items-center justify-center text-stone-600 mb-4">
          <Layers size={22} strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-xl font-normal text-stone-900 mb-2">No topics loaded yet</h2>
        <p className="text-sm text-stone-600 mb-6 leading-relaxed max-w-sm">
          Upload your notes first. Feynman Mode works best after you've studied the flashcards at least once.
        </p>
        <ShimmerButton onClick={() => navigate('/app')} className="px-5 py-2.5 bg-stone-900 text-white hover:bg-stone-800">
          <span>Go to Workspace</span>
          <ArrowRight size={14} />
        </ShimmerButton>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center px-4 sm:px-6 py-8 md:py-12 max-w-3xl mx-auto">

      {/* ── Header ── */}
      <header className="w-full mb-8 flex flex-col items-center text-center">
        <div className="flex items-center gap-2 mb-2">
          <Lightbulb size={14} className="text-amber-600" />
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-stone-500 font-semibold">
            Feynman Technique
          </span>
        </div>
        <h1 className="font-heading font-normal text-2xl md:text-3xl text-stone-900 mb-1">
          Teach it to learn it.
        </h1>
        <p className="text-xs text-stone-600 max-w-sm leading-relaxed">
          Explain the topic below as if you're teaching someone who's never heard of it. The AI will score your explanation and pinpoint exactly what's missing.
        </p>
      </header>

      {/* ── Topic selector ── */}
      <div className="flex items-center justify-center gap-1.5 flex-wrap max-w-xl mx-auto mb-8">
        {topics.map((t) => {
          const isSelected = t.id === selectedTopicId
          const diffColor =
            t.difficulty === 'advanced'
              ? 'bg-rose-500'
              : t.difficulty === 'intermediate'
              ? 'bg-amber-500'
              : 'bg-emerald-600'
          return (
            <button
              key={t.id}
              onClick={() => handleTopicChange(t.id)}
              className={`flex items-center gap-1.5 text-xs px-3.5 py-1.5 rounded-full transition-all duration-150 cursor-pointer ${
                isSelected
                  ? 'bg-stone-900 text-white font-medium shadow-sm'
                  : 'text-stone-600 hover:text-stone-900 hover:bg-stone-100'
              }`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${diffColor} flex-shrink-0`} />
              {t.title}
            </button>
          )
        })}
      </div>

      <AnimatePresence mode="wait">
        {!result ? (
          /* ── Input Phase ── */
          <motion.div
            key="input"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="w-full flex flex-col gap-4"
          >
            {/* Topic context pill */}
            {activeTopic && (
              <div className="w-full p-4 rounded-xl bg-stone-50 border border-stone-200">
                <div className="text-[10px] font-mono uppercase tracking-widest text-stone-500 mb-1">
                  Topic to explain
                </div>
                <div className="text-sm font-semibold text-stone-900">{activeTopic.title}</div>
                <div className="text-xs text-stone-600 mt-1 leading-relaxed">{activeTopic.summary}</div>
              </div>
            )}

            {/* Text area */}
            <div className="relative">
              <textarea
                value={explanation}
                onChange={(e) => {
                  setExplanation(e.target.value)
                  if (error) setError(null)
                }}
                placeholder={`Explain ${activeTopic?.title ?? 'this topic'} in your own words. Pretend you're teaching it to a curious friend who's never studied it before...`}
                rows={10}
                className="w-full rounded-2xl bg-white border border-stone-200 hover:border-stone-300 focus:border-stone-500 focus:outline-none p-5 text-sm text-stone-900 placeholder:text-stone-400 leading-relaxed resize-none transition-colors font-sans shadow-xs"
              />
              <div className="absolute bottom-4 right-4 text-[11px] font-mono text-stone-400">
                {explanation.trim().split(/\s+/).filter(Boolean).length} words
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertCircle className="h-4 w-4" />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <ShimmerButton
              onClick={handleEvaluate}
              disabled={isEvaluating || explanation.trim().length < 10}
              className="w-full py-3 text-sm font-mono bg-stone-900 text-white hover:bg-stone-800"
            >
              {isEvaluating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>AI is evaluating your explanation...</span>
                </>
              ) : (
                <>
                  <Lightbulb size={15} />
                  <span>Evaluate My Understanding</span>
                  <ArrowRight size={14} />
                </>
              )}
            </ShimmerButton>
          </motion.div>
        ) : (
          /* ── Results Phase ── */
          <motion.div
            key="result"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
            className="w-full flex flex-col gap-5"
          >
            {/* Score gauge */}
            <div className="w-full rounded-2xl bg-white border border-stone-200 p-8 flex flex-col items-center shadow-xl">
              <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-stone-500 mb-6">
                Feynman Score — {activeTopic?.title}
              </span>
              <GaugeMeter
                value={result.score}
                size={150}
                strokeWidth={10}
                label="Understanding"
                sublabel={
                  result.score >= 80
                    ? 'Excellent grasp — ready to teach with clarity'
                    : result.score >= 55
                    ? 'Solid foundation, a few key concepts to refine'
                    : 'Review the source cards to close understanding gaps'
                }
                className="mb-6"
              />
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="w-full rounded-2xl bg-emerald-50/70 border border-emerald-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-emerald-700" />
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-800 font-semibold">
                    What you got right
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-emerald-950 leading-relaxed flex gap-2">
                      <span className="text-emerald-600 mt-0.5 flex-shrink-0">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div className="w-full rounded-2xl bg-amber-50/70 border border-amber-200 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={14} className="text-amber-700" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-800 font-semibold">
                    Gaps & misconceptions
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="text-sm text-amber-950 leading-relaxed flex gap-2">
                      <span className="text-amber-600 mt-0.5 flex-shrink-0">·</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model explanation — collapsible */}
            <div className="w-full rounded-2xl bg-white border border-stone-200 overflow-hidden shadow-xs">
              <button
                onClick={() => setShowModel((v) => !v)}
                className="w-full flex items-center justify-between p-5 text-sm font-mono text-stone-800 hover:text-stone-900 transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={13} className="text-amber-600" />
                  Model explanation
                </span>
                {showModel ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
              </button>
              <AnimatePresence>
                {showModel && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-6 pt-1 border-t border-stone-200">
                      <p className="text-sm text-stone-700 leading-relaxed font-sans">
                        {result.modelExplanation}
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleReset}
                className="font-mono text-xs h-9 px-4 border-stone-200 text-stone-700 hover:bg-stone-100"
              >
                <RotateCcw size={13} />
                Try Again
              </Button>
              <ShimmerButton
                onClick={() => navigate('/study')}
                className="text-xs h-9 px-4 bg-stone-900 text-white hover:bg-stone-800"
              >
                <span>Back to Flashcards</span>
                <ArrowRight size={13} />
              </ShimmerButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default Feynman
