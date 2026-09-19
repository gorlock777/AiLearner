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
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { QuizQuestion } from '../store/useAppStore'

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
        <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <CheckSquare size={20} />
        </div>
        <h2 className="text-base font-semibold text-zinc-100 mb-1">No notes uploaded</h2>
        <p className="text-xs text-zinc-400 mb-5">
          Upload course material to automatically generate practice quizzes.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Upload Notes
        </button>
      </div>
    )
  }

  const currentQuestion = questions[currentIndex]
  const isAnswered = selectedAnswer !== null
  const correctCount = answers.filter(
    (ans, i) => ans === questions[i]?.correctIndex
  ).length
  const finalScore = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0

  return (
    <div className="min-h-full flex flex-col items-center px-6 py-8 max-w-3xl mx-auto">
      {/* Header and Topic Tabs */}
      <div className="w-full mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-xl font-semibold text-zinc-100">Adaptive Quiz</h1>
            <p className="text-xs text-zinc-400">Multiple choice active recall test</p>
          </div>
          <span className="text-xs font-mono text-zinc-400 bg-zinc-900 border border-zinc-800 px-2 py-1 rounded">
            {questions.length > 0
              ? `Question ${currentIndex + 1} / ${questions.length}`
              : '0 / 0'}
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
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-all border ${
                  isSelected
                    ? 'bg-zinc-800 text-white border-zinc-700 shadow-sm font-semibold'
                    : 'bg-zinc-900/60 text-zinc-400 border-zinc-800/80 hover:bg-zinc-850 hover:text-zinc-200'
                }`}
              >
                {t.title}
              </button>
            )
          })}
        </div>
      </div>

      {/* Main Quiz Area */}
      <div className="w-full">
        {questions.length === 0 ? (
          <div className="linear-card p-8 text-center max-w-md mx-auto">
            <HelpCircle size={22} className="text-zinc-500 mx-auto mb-3" />
            <div className="text-sm font-medium text-zinc-200 mb-1">
              No questions found for this topic
            </div>
            <p className="text-xs text-zinc-400 mb-4">
              Return to Upload to process notes or generate quizzes.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary mx-auto">
              Upload Notes
            </button>
          </div>
        ) : quizFinished ? (
          /* Results Screen */
          <div className="linear-card linear-card-highlight p-8 max-w-xl mx-auto text-center">
            <div className="text-xs font-mono uppercase tracking-wider text-zinc-400 mb-2">
              Quiz Completed
            </div>
            <div className="text-4xl font-bold font-mono text-zinc-100 mb-2">
              {finalScore}%
            </div>
            <p className="text-xs text-zinc-400 mb-6">
              You answered {correctCount} of {questions.length} questions correctly.
            </p>

            {/* Questions breakdown */}
            <div className="flex flex-col gap-2 text-left mb-6">
              {questions.map((q, idx) => {
                const userAns = answers[idx]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id || idx}
                    className="p-3 rounded-lg bg-zinc-900/60 border border-zinc-800 flex items-start gap-3 text-xs"
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={15} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-zinc-200 mb-1">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-zinc-400 text-[11px]">
                        Correct: {q.options[q.correctIndex]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={handleRestart} className="btn-secondary">
                <RotateCcw size={13} />
                Retry Quiz
              </button>
              <button onClick={() => navigate('/progress')} className="btn-primary">
                <BarChart3 size={13} />
                View Analytics
              </button>
            </div>
          </div>
        ) : currentQuestion ? (
          /* Question Runner */
          <div className="linear-card linear-card-highlight p-6 md:p-8">
            {/* Progress bar */}
            <div className="w-full h-1 bg-zinc-900 rounded-full mb-6 overflow-hidden border border-zinc-800/80">
              <div
                className="h-full bg-zinc-200 transition-all duration-200"
                style={{
                  width: `${((currentIndex) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h2 className="text-base font-medium text-zinc-100 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-2.5 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentQuestion.correctIndex

                let btnStyle =
                  'bg-zinc-900/60 border-zinc-800 text-zinc-300 hover:border-zinc-700 hover:bg-zinc-850 hover:text-white'

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-950/30 border-emerald-500/60 text-emerald-200 font-medium'
                  } else if (isSelected) {
                    btnStyle =
                      'bg-rose-950/30 border-rose-500/60 text-rose-200 font-medium'
                  } else {
                    btnStyle = 'bg-zinc-900/20 border-zinc-900 text-zinc-600 opacity-40'
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3 rounded-lg border text-xs transition-all flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="kbd">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 size={15} className="text-emerald-400" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={15} className="text-rose-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation box on answer */}
            {isAnswered && currentQuestion.explanation && (
              <div className="p-4 rounded-lg bg-zinc-900/80 border border-zinc-800 mb-6 text-xs text-zinc-300 leading-relaxed">
                <span className="font-semibold text-zinc-200 block mb-1 font-mono text-[11px] uppercase tracking-wider">
                  Explanation:
                </span>
                {currentQuestion.explanation}
              </div>
            )}

            {/* Next Button */}
            {isAnswered && (
              <div className="flex justify-end">
                <button onClick={handleNext} className="btn-primary">
                  {currentIndex < questions.length - 1 ? 'Next Question' : 'Complete Quiz'}
                  <ArrowRight size={13} />
                </button>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  )
}

export default Quiz
