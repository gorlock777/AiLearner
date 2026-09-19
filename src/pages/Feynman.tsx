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
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-white/10 flex items-center justify-center text-zinc-400 mb-4">
          <Layers size={22} strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-xl font-normal text-white mb-2">No topics loaded yet</h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed max-w-sm">
          Upload your notes first. Feynman Mode works best after you've studied the flashcards at least once.
        </p>
        <ShimmerButton onClick={() => navigate('/app')} className="px-5 py-2.5">
          <span>Go to Workspace</span>
          <ArrowRight size={14} />
        </ShimmerButton>
      </div>
    )
  }

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-10 pb-32 max-w-4xl mx-auto w-full">

      {/* ── Header ── */}
      <header className="w-full mb-10 flex flex-col items-center text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-300 font-mono text-[11px] mb-3">
          <Lightbulb size={12} />
          <span>Feynman Explanation Assessment</span>
        </div>
        <h1 className="font-heading font-normal text-2xl md:text-3xl text-white tracking-tight mb-2">
          Teach it to master it.
        </h1>
        <p className="text-xs sm:text-sm text-zinc-400 max-w-lg leading-relaxed font-sans">
          Explain the concept in simple, intuitive terms. The model evaluates clarity, detects jargon without depth, and pinpoints knowledge gaps.
        </p>
      </header>

      {/* ── Topic selector ── */}
      <div className="flex items-center justify-center gap-2 flex-wrap max-w-2xl mx-auto mb-8">
        {topics.map((t) => {
          const isSelected = t.id === selectedTopicId
          const diffColor =
            t.difficulty === 'advanced'
              ? 'bg-rose-400'
              : t.difficulty === 'intermediate'
              ? 'bg-amber-400'
              : 'bg-emerald-400'
          return (
            <button
              key={t.id}
              onClick={() => handleTopicChange(t.id)}
              className={`flex items-center gap-2 text-xs px-4 py-1.5 rounded-full transition-all duration-200 cursor-pointer font-sans ${
                isSelected
                  ? 'bg-white text-zinc-950 font-medium shadow-md'
                  : 'text-zinc-400 hover:text-white bg-white/5 hover:bg-white/10 border border-white/5'
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
            className="w-full flex flex-col gap-6"
          >
            {/* Topic context pill */}
            {activeTopic && (
              <div className="w-full p-6 rounded-2xl bg-[#12141e]/70 border border-white/10 backdrop-blur-md shadow-lg">
                <div className="text-[10px] font-mono uppercase tracking-widest text-zinc-400 mb-1.5">
                  Concept Target
                </div>
                <h3 className="font-heading font-normal text-lg text-white">{activeTopic.title}</h3>
                <div className="text-xs text-zinc-400 mt-1.5 leading-relaxed font-sans">{activeTopic.summary}</div>
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
                placeholder={`Explain ${activeTopic?.title ?? 'this concept'} in your own words. Pretend you're teaching it to a curious beginner...`}
                rows={10}
                className="w-full rounded-2xl bg-[#12141e]/80 border border-white/10 hover:border-white/20 focus:border-white/30 focus:outline-none p-6 text-sm text-zinc-100 placeholder:text-zinc-500 leading-relaxed resize-none transition-colors font-sans shadow-xl backdrop-blur-md"
              />
              <div className="absolute bottom-5 right-5 text-[11px] font-mono text-zinc-400 bg-zinc-900/80 px-2.5 py-1 rounded-md border border-white/5">
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
              className="w-full py-3.5 text-xs font-mono rounded-full"
            >
              {isEvaluating ? (
                <>
                  <Loader2 size={15} className="animate-spin" />
                  <span>Evaluating explanation clarity...</span>
                </>
              ) : (
                <>
                  <Lightbulb size={15} />
                  <span>Evaluate Conceptual Mastery</span>
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
            className="w-full flex flex-col gap-6"
          >
            {/* Score gauge */}
            <div className="w-full rounded-3xl bg-[#12141e]/80 border border-white/10 backdrop-blur-md p-8 sm:p-10 flex flex-col items-center shadow-2xl">
              <span className="text-[11px] font-mono uppercase tracking-[0.2em] text-zinc-400 mb-6">
                Feynman Score — {activeTopic?.title}
              </span>
              <GaugeMeter
                value={result.score}
                size={160}
                strokeWidth={10}
                label="Mastery"
                sublabel={
                  result.score >= 80
                    ? 'Excellent clarity — concise and accurate'
                    : result.score >= 55
                    ? 'Solid foundation, a few key points to deepen'
                    : 'Review the source flashcards to close conceptual gaps'
                }
                className="mb-6"
              />
            </div>

            {/* Strengths */}
            {result.strengths.length > 0 && (
              <div className="w-full rounded-2xl bg-emerald-500/10 border border-emerald-500/20 p-6 backdrop-blur-md">
                <div className="flex items-center gap-2 mb-3">
                  <CheckCircle2 size={14} className="text-emerald-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-emerald-300 font-semibold">
                    What you got right
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.strengths.map((s, i) => (
                    <li key={i} className="text-sm text-zinc-200 leading-relaxed flex gap-2">
                      <span className="text-emerald-400 mt-0.5 flex-shrink-0">·</span>
                      {s}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Gaps */}
            {result.gaps.length > 0 && (
              <div className="w-full rounded-2xl bg-amber-950/40 border border-amber-500/30 p-6">
                <div className="flex items-center gap-2 mb-3">
                  <XCircle size={14} className="text-amber-400" />
                  <span className="text-xs font-mono uppercase tracking-widest text-amber-300 font-semibold">
                    Gaps & misconceptions
                  </span>
                </div>
                <ul className="flex flex-col gap-2">
                  {result.gaps.map((g, i) => (
                    <li key={i} className="text-sm text-zinc-200 leading-relaxed flex gap-2">
                      <span className="text-amber-400 mt-0.5 flex-shrink-0">·</span>
                      {g}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Model explanation — collapsible */}
            <div className="w-full rounded-2xl bg-[#14161e] border border-white/10 overflow-hidden shadow-xs">
              <button
                onClick={() => setShowModel((v) => !v)}
                className="w-full flex items-center justify-between p-5 text-sm font-mono text-zinc-300 hover:text-white transition-colors cursor-pointer"
              >
                <span className="flex items-center gap-2">
                  <Lightbulb size={13} className="text-amber-400" />
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
                    <div className="px-5 pb-6 pt-1 border-t border-white/10">
                      <p className="text-sm text-zinc-300 leading-relaxed font-sans">
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
                className="font-mono text-xs h-9 px-4 border-white/10 text-zinc-300 hover:bg-zinc-800"
              >
                <RotateCcw size={13} />
                Try Again
              </Button>
              <ShimmerButton
                onClick={() => navigate('/study')}
                className="text-xs h-9 px-4"
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
