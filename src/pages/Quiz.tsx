import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  CheckSquare,
  HelpCircle,
  BarChart3,
  Check,
  X,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppStore } from '../store/useAppStore'
import type { QuizQuestion } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Progress } from '../components/ui/progress'
import { GaugeMeter } from '../components/ui/gauge-meter'
import { ShimmerButton } from '../components/ui/shimmer-button'

export function Quiz() {
  const navigate = useNavigate()
  const { topics, getQuizForTopic, recordQuizAttempt } = useAppStore()

  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(
    topics[0]?.id ?? null
  )
  const [questions, setQuestions] = useState<QuizQuestion[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [quizFinished, setQuizFinished] = useState(false)

  // Sync selected topic
  useEffect(() => {
    if (!selectedTopicId && topics.length > 0) {
      setSelectedTopicId(topics[0].id)
    }
  }, [topics, selectedTopicId])

  // Load quiz questions
  useEffect(() => {
    if (!selectedTopicId) return
    const q = getQuizForTopic(selectedTopicId)
    setQuestions(q)
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers([])
    setQuizFinished(false)
  }, [selectedTopicId, getQuizForTopic])

  const handleSelectOption = (idx: number) => {
    if (selectedAnswer !== null) return // Already answered
    setSelectedAnswer(idx)
  }

  const handleNext = () => {
    if (selectedAnswer === null) return
    const newAnswers = [...answers, selectedAnswer]
    setAnswers(newAnswers)

    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1)
      setSelectedAnswer(null)
    } else {
      // Finished quiz
      setQuizFinished(true)
      const correctCount = newAnswers.filter(
        (ans, i) => ans === questions[i]?.correctIndex
      ).length
      const score = Math.round((correctCount / questions.length) * 100)

      if (selectedTopicId) {
        recordQuizAttempt({
          topicId: selectedTopicId,
          score,
          correctCount,
          totalQuestions: questions.length,
          timestamp: Date.now(),
          answers: newAnswers,
        })
      }
    }
  }

  const handleRestart = () => {
    setCurrentIndex(0)
    setSelectedAnswer(null)
    setAnswers([])
    setQuizFinished(false)
  }

  if (topics.length === 0) {
    return (
      <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 text-center max-w-lg mx-auto">
        <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <CheckSquare size={22} strokeWidth={1.5} />
        </div>
        <h2 className="font-heading text-xl font-normal text-zinc-100 mb-2">No study modules loaded</h2>
        <p className="text-sm text-zinc-400 mb-6 leading-relaxed max-w-sm">
          Import course material in the workspace to generate diagnostic quizzes.
        </p>
        <ShimmerButton onClick={() => navigate('/app')} className="px-5 py-2.5">
          <span>Go to Workspace</span>
          <ArrowRight size={14} />
        </ShimmerButton>
      </div>
    )
  }

  const activeTopic = topics.find((t) => t.id === selectedTopicId)
  const currentQuestion = questions[currentIndex]
  const isAnswered = selectedAnswer !== null
  const correctCount = answers.filter((ans, i) => ans === questions[i]?.correctIndex).length
  const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <div className="min-h-full flex flex-col items-center px-4 sm:px-6 py-8 md:py-12 max-w-3xl mx-auto">
      {/* ── Editorial Header & Topic Selector ── */}
      <header className="w-full mb-8 flex flex-col items-center text-center">
        <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-300 font-semibold mb-2">
          Diagnostic Assessment
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

        {questions.length > 0 && !quizFinished && (
          <div className="flex items-center gap-3 text-xs font-mono text-zinc-300 mt-1">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="text-zinc-700">·</span>
            <div className="w-24 h-1 rounded-full bg-zinc-800 overflow-hidden">
              <div
                className="h-full bg-emerald-400 transition-all duration-300 ease-out"
                style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
              />
            </div>
          </div>
        )}
      </header>

      {/* Main Quiz Area */}
      <div className="w-full">
        {questions.length === 0 ? (
          <div className="p-10 rounded-2xl bg-zinc-900/40 border border-zinc-800 text-center max-w-md mx-auto flex flex-col items-center">
            <HelpCircle size={24} className="text-zinc-500 mb-3" />
            <h3 className="font-heading text-lg font-normal text-zinc-200 mb-1.5">
              No questions for this topic
            </h3>
            <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
              Synthesize a quiz from the document workspace.
            </p>
            <ShimmerButton onClick={() => navigate('/app')} className="px-4 py-2">
              <span>Import Notes</span>
              <ArrowRight size={13} />
            </ShimmerButton>
          </div>
        ) : quizFinished ? (
          /* Results Screen */
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.2 }}
            className="p-8 sm:p-12 max-w-xl mx-auto rounded-2xl bg-[#0d0d10] border border-zinc-800 text-center flex flex-col items-center shadow-2xl"
          >
            <span className="text-[10px] font-mono uppercase tracking-[0.2em] text-zinc-300 font-semibold mb-6">
              Diagnostic Assessment Complete
            </span>

            <GaugeMeter
              value={finalScore}
              size={150}
              strokeWidth={10}
              label="Score"
              sublabel={`${correctCount} of ${questions.length} questions correct`}
              className="mb-8"
            />

            {/* Questions breakdown */}
            <div className="w-full flex flex-col gap-2.5 text-left mb-8">
              {questions.map((q, idx) => {
                const userAns = answers[idx]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id || idx}
                    className="p-4 rounded-xl bg-zinc-900/60 border border-zinc-800 flex items-start gap-3 text-xs"
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-heading font-normal text-sm text-zinc-100 mb-1 leading-snug">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-zinc-400 text-xs font-mono">
                        Correct: <span className="text-emerald-400 font-medium">{q.options[q.correctIndex]}</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-3 w-full">
              <Button
                variant="outline"
                size="sm"
                onClick={handleRestart}
                className="font-mono text-xs h-9 px-4"
              >
                <RotateCcw size={13} />
                Retry Test
              </Button>
              <ShimmerButton
                onClick={() => navigate('/progress')}
                className="text-xs h-9 px-4"
              >
                <BarChart3 size={13} />
                <span>View Analytics</span>
              </ShimmerButton>
            </div>
          </motion.div>
        ) : currentQuestion ? (
          /* Question Runner */
          <div className="p-8 sm:p-12 md:p-14 rounded-2xl bg-[#0e0e12] border border-zinc-800/90 shadow-2xl flex flex-col justify-between min-h-[380px]">
            <div>
              <div className="text-xs text-zinc-300 font-mono mb-4 uppercase tracking-wider">
                Question {currentIndex + 1} of {questions.length} · {activeTopic?.title}
              </div>

              <h2 className="font-heading font-normal text-xl sm:text-2xl text-zinc-100 mb-8 leading-relaxed">
                {currentQuestion.question}
              </h2>

              {/* Options */}
              <div className="flex flex-col gap-3 mb-6">
                {currentQuestion.options.map((opt, idx) => {
                  const isSelected = selectedAnswer === idx
                  const isCorrect = idx === currentQuestion.correctIndex

                  let btnStyle =
                    'bg-zinc-900/60 border-zinc-800 text-zinc-200 hover:border-zinc-700 hover:bg-zinc-850 cursor-pointer'

                  if (isAnswered) {
                    if (isCorrect) {
                      btnStyle =
                        'bg-emerald-950/30 border-emerald-500/50 text-emerald-200 font-medium'
                    } else if (isSelected) {
                      btnStyle =
                        'bg-rose-950/30 border-rose-500/50 text-rose-200 font-medium'
                    } else {
                      btnStyle = 'bg-zinc-900/20 border-zinc-900 text-zinc-600 opacity-40'
                    }
                  }

                  return (
                    <button
                      key={idx}
                      disabled={isAnswered}
                      onClick={() => handleSelectOption(idx)}
                      className={`w-full text-left p-4 rounded-xl border text-sm transition-all duration-150 flex items-center justify-between ${btnStyle}`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="font-mono text-xs text-zinc-300 w-5">
                          {String.fromCharCode(65 + idx)}.
                        </span>
                        <span>{opt}</span>
                      </div>

                      {isAnswered && isCorrect && (
                        <Check size={16} className="text-emerald-400 flex-shrink-0" />
                      )}
                      {isAnswered && isSelected && !isCorrect && (
                        <X size={16} className="text-rose-400 flex-shrink-0" />
                      )}
                    </button>
                  )
                })}
              </div>

              {/* Explanation box on answer */}
              {isAnswered && currentQuestion.explanation && (
                <motion.div
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="p-4 rounded-xl bg-zinc-900/80 border border-zinc-800/80 mb-6 text-xs text-zinc-300 leading-relaxed"
                >
                  <span className="font-semibold text-zinc-200 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                    Reference Explanation
                  </span>
                  {currentQuestion.explanation}
                </motion.div>
              )}
            </div>

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-4 border-t border-zinc-850">
                <ShimmerButton onClick={handleNext} className="px-5 py-2.5">
                  <span>{currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}</span>
                  <ArrowRight size={13} />
                </ShimmerButton>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Quiz
