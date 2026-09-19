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
import { useAppStore } from '../store/useAppStore'
import type { QuizQuestion } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { Progress } from '../components/ui/progress'

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
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <CheckSquare size={16} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">No study modules loaded</h2>
        <p className="text-xs text-zinc-400 mb-4">
          Import course material to automatically generate practice quizzes.
        </p>
        <Button size="sm" onClick={() => navigate('/app')}>
          Import Notes
        </Button>
      </div>
    )
  }

  const activeTopic = topics.find((t) => t.id === selectedTopicId)
  const currentQuestion = questions[currentIndex]
  const isAnswered = selectedAnswer !== null
  const correctCount = answers.filter(
    (ans, i) => ans === questions[i]?.correctIndex
  ).length
  const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-6 max-w-3xl mx-auto">
      {/* Header and Topic Tabs */}
      <div className="w-full mb-6">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-3">
          <div>
            <h1 className="text-sm font-semibold text-zinc-100 font-mono uppercase tracking-wider">
              Diagnostic Assessment
            </h1>
            <p className="text-xs text-zinc-400 mt-0.5">
              {activeTopic?.title ?? 'Adaptive Multiple Choice Test'}
            </p>
          </div>
          <Badge variant="secondary">
            {questions.length > 0
              ? `Question ${currentIndex + 1} / ${questions.length}`
              : '0 / 0'}
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

      {/* Main Quiz Area */}
      <div className="w-full">
        {questions.length === 0 ? (
          <div className="linear-card p-8 text-center max-w-md mx-auto">
            <HelpCircle size={20} className="text-zinc-500 mx-auto mb-2" />
            <div className="text-xs font-semibold text-zinc-200 mb-1 font-mono">
              NO QUESTIONS FOR THIS TOPIC
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Return to Ingestion to parse notes and draft question sets.
            </p>
            <Button size="sm" onClick={() => navigate('/app')} className="mx-auto">
              Import Notes
            </Button>
          </div>
        ) : quizFinished ? (
          /* Results Screen */
          <div className="linear-card linear-card-highlight p-6 max-w-xl mx-auto text-center">
            <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 mb-1">
              Assessment Summary
            </div>
            <div className="text-3xl font-bold font-mono text-zinc-100 mb-1">
              {finalScore}% Accuracy
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              {correctCount} of {questions.length} questions answered correctly
            </p>

            {/* Questions breakdown */}
            <div className="flex flex-col gap-2 text-left mb-6">
              {questions.map((q, idx) => {
                const userAns = answers[idx]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id || idx}
                    className="p-3 rounded bg-zinc-900/50 border border-zinc-800 flex items-start gap-2.5 text-xs"
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={14} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-zinc-200 mb-1">
                        0{idx + 1}. {q.question}
                      </div>
                      <div className="text-zinc-400 text-[11px] font-mono">
                        Correct: {q.options[q.correctIndex]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-2">
              <Button variant="secondary" size="sm" onClick={handleRestart}>
                <RotateCcw size={12} />
                Retry Test
              </Button>
              <Button size="sm" onClick={() => navigate('/progress')}>
                <BarChart3 size={12} />
                View Analytics
              </Button>
            </div>
          </div>
        ) : currentQuestion ? (
          /* Question Runner */
          <div className="linear-card linear-card-highlight p-6">
            {/* Progress bar */}
            <div className="mb-5">
              <Progress value={currentIndex} max={questions.length} />
            </div>

            <div className="text-xs text-zinc-400 font-mono mb-2">
              QUESTION 0{currentIndex + 1} OF 0{questions.length}
            </div>

            <h2 className="text-sm font-medium text-zinc-100 mb-5 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-2 mb-5">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentQuestion.correctIndex

                let btnStyle =
                  'bg-zinc-900/50 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850'

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-950/20 border-emerald-500/40 text-emerald-300 font-medium'
                  } else if (isSelected) {
                    btnStyle =
                      'bg-rose-950/20 border-rose-500/40 text-rose-300 font-medium'
                  } else {
                    btnStyle = 'bg-zinc-900/10 border-zinc-900 text-zinc-600 opacity-40'
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-2.5 rounded border text-xs transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-mono text-[11px] text-zinc-400">
                        {String.fromCharCode(65 + idx)}.
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <Check size={13} className="text-emerald-400" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <X size={13} className="text-rose-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation box on answer */}
            {isAnswered && currentQuestion.explanation && (
              <div className="p-3 rounded bg-zinc-900/60 border border-zinc-800 mb-5 text-xs text-zinc-300 leading-relaxed">
                <span className="font-semibold text-zinc-200 block mb-1 font-mono text-[10px] uppercase tracking-wider">
                  Reference Explanation:
                </span>
                {currentQuestion.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end pt-2 border-t border-zinc-800/80">
                <Button size="sm" onClick={handleNext}>
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Assessment'}
                  <ArrowRight size={12} />
                </Button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Quiz
