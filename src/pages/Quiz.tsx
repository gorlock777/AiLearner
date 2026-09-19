import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  ArrowRight,
  RotateCcw,
  CheckSquare,
  HelpCircle,
  BarChart2,
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
        <div className="w-12 h-12 rounded-lg bg-[#182030] border border-[#252f44] flex items-center justify-center text-slate-400 mb-4">
          <CheckSquare size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">No notes uploaded</h2>
        <p className="text-sm text-slate-400 mb-6">
          Upload documents to automatically generate practice quizzes.
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
          <h1 className="text-2xl font-semibold text-slate-100">Practice Quiz</h1>
          <span className="text-xs text-slate-400">
            {questions.length > 0
              ? `Question ${currentIndex + 1} of ${questions.length}`
              : '0 questions'}
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

      {/* Main Quiz Area */}
      <div className="w-full">
        {questions.length === 0 ? (
          <div className="ui-card p-8 text-center max-w-md mx-auto">
            <HelpCircle size={24} className="text-slate-500 mx-auto mb-3" />
            <div className="text-sm font-medium text-slate-200 mb-1">
              No questions found for this topic
            </div>
            <p className="text-xs text-slate-400 mb-4">
              Return to Upload to process notes or generate quizzes.
            </p>
            <button onClick={() => navigate('/')} className="btn-primary mx-auto">
              Upload Notes
            </button>
          </div>
        ) : quizFinished ? (
          /* Results Screen */
          <div className="ui-card p-8 max-w-xl mx-auto text-center">
            <div className="text-xs uppercase tracking-wider text-slate-400 font-semibold mb-2">
              Quiz Completed
            </div>
            <div className="text-4xl font-bold text-slate-100 mb-2">
              {finalScore}%
            </div>
            <p className="text-sm text-slate-400 mb-6">
              You answered {correctCount} of {questions.length} questions correctly.
            </p>

            {/* Questions breakdown */}
            <div className="flex flex-col gap-2.5 text-left mb-6">
              {questions.map((q, idx) => {
                const userAns = answers[idx]
                const isCorrect = userAns === q.correctIndex
                return (
                  <div
                    key={q.id || idx}
                    className="p-3 rounded-lg bg-[#0f1420] border border-[#1e2638] flex items-start gap-3 text-xs"
                  >
                    {isCorrect ? (
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0 mt-0.5" />
                    ) : (
                      <XCircle size={16} className="text-rose-400 flex-shrink-0 mt-0.5" />
                    )}
                    <div className="flex-1">
                      <div className="font-medium text-slate-200 mb-1">
                        {idx + 1}. {q.question}
                      </div>
                      <div className="text-slate-400">
                        Answer: {q.options[q.correctIndex]}
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            <div className="flex items-center justify-center gap-3">
              <button onClick={handleRestart} className="btn-secondary">
                <RotateCcw size={14} />
                Retry Quiz
              </button>
              <button onClick={() => navigate('/progress')} className="btn-primary">
                <BarChart2 size={14} />
                View Analytics
              </button>
            </div>
          </div>
        ) : currentQuestion ? (
          /* Question Runner */
          <div className="ui-card p-6 md:p-8">
            {/* Progress bar */}
            <div className="w-full h-1 bg-[#182030] rounded-full mb-6 overflow-hidden">
              <div
                className="h-full bg-blue-500 transition-all duration-200"
                style={{
                  width: `${((currentIndex) / questions.length) * 100}%`,
                }}
              />
            </div>

            <h2 className="text-lg font-medium text-slate-100 mb-6 leading-relaxed">
              {currentQuestion.question}
            </h2>

            {/* Options */}
            <div className="flex flex-col gap-3 mb-6">
              {currentQuestion.options.map((opt, idx) => {
                const isSelected = selectedAnswer === idx
                const isCorrect = idx === currentQuestion.correctIndex

                let btnStyle =
                  'bg-[#0f1420] border-[#1e2638] text-slate-200 hover:border-[#2a364d] hover:bg-[#141b2a]'

                if (isAnswered) {
                  if (isCorrect) {
                    btnStyle =
                      'bg-emerald-950/20 border-emerald-500/60 text-emerald-200 font-medium'
                  } else if (isSelected) {
                    btnStyle =
                      'bg-rose-950/20 border-rose-500/60 text-rose-200 font-medium'
                  } else {
                    btnStyle = 'bg-[#0c1018] border-[#161d2b] text-slate-500 opacity-60'
                  }
                }

                return (
                  <button
                    key={idx}
                    disabled={isAnswered}
                    onClick={() => handleSelectOption(idx)}
                    className={`w-full text-left p-3.5 rounded-lg border text-sm transition-colors flex items-center justify-between ${btnStyle}`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded flex items-center justify-center text-xs font-semibold bg-[#182030] text-slate-400 border border-[#252f44]">
                        {String.fromCharCode(65 + idx)}
                      </span>
                      <span>{opt}</span>
                    </div>

                    {isAnswered && isCorrect && (
                      <CheckCircle2 size={16} className="text-emerald-400" />
                    )}
                    {isAnswered && isSelected && !isCorrect && (
                      <XCircle size={16} className="text-rose-400" />
                    )}
                  </button>
                )
              })}
            </div>

            {/* Explanation box on answer */}
            {isAnswered && currentQuestion.explanation && (
              <div className="p-4 rounded-lg bg-[#0f1420] border border-[#1e2638] mb-6 text-xs text-slate-300 leading-relaxed">
                <span className="font-semibold text-slate-200 block mb-1">
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
                  <ArrowRight size={14} />
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
