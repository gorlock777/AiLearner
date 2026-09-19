import { useState, useEffect, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useNavigate, useSearchParams } from 'react-router-dom'
import {
  CheckCircle2,
  XCircle,
  ChevronRight,
  RotateCcw,
  TrendingUp,
  Clock,
  BookOpen,
  Zap,
  Trophy,
  AlertCircle,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { QuizQuestion } from '../store/useAppStore'

// ─── Helpers ────────────────────────────────────────────────────────────────

function getGrade(score: number): { label: string; color: string; bg: string } {
  if (score >= 90) return { label: 'A', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
  if (score >= 75) return { label: 'B', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' }
  if (score >= 60) return { label: 'C', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' }
  return { label: 'D', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)' }
}

// ─── Timer Ring ──────────────────────────────────────────────────────────────

const RADIUS = 22
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function TimerRing({
  timeLeft,
  total,
}: {
  timeLeft: number
  total: number
}) {
  const progress = timeLeft / total
  const offset = CIRCUMFERENCE * (1 - progress)
  const color = timeLeft <= 10 ? '#f43f5e' : timeLeft <= 20 ? '#f59e0b' : '#6366f1'

  return (
    <div className="relative flex items-center justify-center" style={{ width: 56, height: 56 }}>
      <svg width="56" height="56" style={{ transform: 'rotate(-90deg)' }}>
        <circle cx="28" cy="28" r={RADIUS} fill="none" stroke="rgba(255,255,255,0.08)" strokeWidth="3" />
        <circle
          cx="28"
          cy="28"
          r={RADIUS}
          fill="none"
          stroke={color}
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={CIRCUMFERENCE}
          strokeDashoffset={offset}
          style={{ transition: 'stroke-dashoffset 1s linear, stroke 0.3s ease' }}
        />
      </svg>
      <span
        className="absolute font-bold text-sm"
        style={{ color, transition: 'color 0.3s ease' }}
      >
        {timeLeft}
      </span>
    </div>
  )
}

// ─── Score Arc ───────────────────────────────────────────────────────────────

function ScoreArc({ score, animate }: { score: number; animate: boolean }) {
  const size = 160
  const r = 60
  const cx = size / 2
  const cy = size / 2
  const strokeWidth = 10
  const circumference = 2 * Math.PI * r
  const grade = getGrade(score)

  const [displayedOffset, setDisplayedOffset] = useState(circumference)

  useEffect(() => {
    if (!animate) return
    const targetOffset = circumference * (1 - score / 100)
    const timer = setTimeout(() => setDisplayedOffset(targetOffset), 100)
    return () => clearTimeout(timer)
  }, [animate, score, circumference])

  return (
    <div className="relative flex items-center justify-center" style={{ width: size, height: size }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke="rgba(255,255,255,0.06)"
          strokeWidth={strokeWidth}
        />
        <circle
          cx={cx}
          cy={cy}
          r={r}
          fill="none"
          stroke={grade.color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={displayedOffset}
          style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.34,1.56,0.64,1)', filter: `drop-shadow(0 0 8px ${grade.color}66)` }}
        />
      </svg>
      <div className="absolute flex flex-col items-center">
        <span className="font-black text-4xl" style={{ color: grade.color }}>
          {score}%
        </span>
        <span
          className="font-bold text-base mt-0.5 px-3 py-0.5 rounded-full"
          style={{ background: grade.bg, color: grade.color }}
        >
          Grade {grade.label}
        </span>
      </div>
    </div>
  )
}

// ─── Topic Pill Tabs ──────────────────────────────────────────────────────────

function TopicTabs({
  topics,
  selected,
  onSelect,
}: {
  topics: { id: string; title: string; emoji: string }[]
  selected: string
  onSelect: (id: string) => void
}) {
  return (
    <div
      className="flex gap-2 overflow-x-auto pb-1"
      style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
    >
      {topics.map((t) => {
        const active = t.id === selected
        return (
          <motion.button
            key={t.id}
            onClick={() => onSelect(t.id)}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="flex-shrink-0 flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all"
            style={{
              background: active
                ? 'linear-gradient(135deg,#6366f1,#8b5cf6)'
                : 'rgba(255,255,255,0.05)',
              border: active ? '1px solid transparent' : '1px solid rgba(255,255,255,0.08)',
              color: active ? '#fff' : '#94a3b8',
              boxShadow: active ? '0 4px 15px rgba(99,102,241,0.3)' : 'none',
            }}
          >
            <span>{t.emoji}</span>
            <span>{t.title}</span>
          </motion.button>
        )
      })}
    </div>
  )
}

// ─── Option Button ────────────────────────────────────────────────────────────

function OptionButton({
  label,
  index,
  state,
  onClick,
  disabled,
}: {
  label: string
  index: number
  state: 'neutral' | 'correct' | 'wrong' | 'ghost'
  onClick: () => void
  disabled: boolean
}) {
  const letters = ['A', 'B', 'C', 'D']

  const styles: Record<string, { bg: string; border: string; color: string; shadow: string }> = {
    neutral: {
      bg: 'rgba(255,255,255,0.04)',
      border: '1px solid rgba(255,255,255,0.08)',
      color: '#f1f5f9',
      shadow: 'none',
    },
    correct: {
      bg: 'rgba(16,185,129,0.12)',
      border: '1px solid rgba(16,185,129,0.5)',
      color: '#34d399',
      shadow: '0 0 20px rgba(16,185,129,0.2)',
    },
    wrong: {
      bg: 'rgba(244,63,94,0.12)',
      border: '1px solid rgba(244,63,94,0.5)',
      color: '#fb7185',
      shadow: '0 0 20px rgba(244,63,94,0.2)',
    },
    ghost: {
      bg: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      color: 'rgba(148,163,184,0.4)',
      shadow: 'none',
    },
  }

  const s = styles[state]

  return (
    <motion.button
      onClick={onClick}
      disabled={disabled}
      whileHover={!disabled ? { scale: 1.02 } : {}}
      whileTap={!disabled ? { scale: 0.98 } : {}}
      className="relative flex items-center gap-3 w-full text-left rounded-2xl p-4 transition-all"
      style={{
        background: s.bg,
        border: s.border,
        color: s.color,
        boxShadow: s.shadow,
        cursor: disabled ? 'default' : 'pointer',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
      animate={{ background: s.bg, borderColor: s.border.replace('1px solid ', '') }}
      transition={{ duration: 0.25 }}
    >
      <span
        className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold"
        style={{
          background:
            state === 'neutral'
              ? 'rgba(99,102,241,0.15)'
              : state === 'correct'
              ? 'rgba(16,185,129,0.2)'
              : state === 'wrong'
              ? 'rgba(244,63,94,0.2)'
              : 'rgba(255,255,255,0.05)',
          color:
            state === 'neutral'
              ? '#818cf8'
              : state === 'correct'
              ? '#34d399'
              : state === 'wrong'
              ? '#fb7185'
              : 'rgba(148,163,184,0.4)',
        }}
      >
        {letters[index]}
      </span>
      <span className="font-medium text-sm leading-snug">{label}</span>
      {state === 'correct' && (
        <CheckCircle2 className="ml-auto flex-shrink-0" size={18} color="#10b981" />
      )}
      {state === 'wrong' && (
        <XCircle className="ml-auto flex-shrink-0" size={18} color="#f43f5e" />
      )}
    </motion.button>
  )
}

// ─── Quiz Runner ──────────────────────────────────────────────────────────────

const TIMER_DURATION = 30

interface QuizRunnerProps {
  questions: QuizQuestion[]
  topicId: string
  onComplete: (answers: number[], correctCount: number) => void
}

function QuizRunner({ questions, topicId, onComplete }: QuizRunnerProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const [answers, setAnswers] = useState<number[]>([])
  const [timeLeft, setTimeLeft] = useState(TIMER_DURATION)
  const [timerActive, setTimerActive] = useState(true)
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const question = questions[currentIndex]
  const isAnswered = selectedIndex !== null

  const handleAnswer = useCallback(
    (idx: number) => {
      if (isAnswered) return
      setSelectedIndex(idx)
      setTimerActive(false)
      if (timerRef.current) clearInterval(timerRef.current)
    },
    [isAnswered]
  )

  // Auto-answer on timer expire
  useEffect(() => {
    if (!timerActive) return
    setTimeLeft(TIMER_DURATION)
    timerRef.current = setInterval(() => {
      setTimeLeft((t) => {
        if (t <= 1) {
          clearInterval(timerRef.current!)
          setSelectedIndex(-1) // -1 = timed out (no selection)
          setTimerActive(false)
          return 0
        }
        return t - 1
      })
    }, 1000)
    return () => {
      if (timerRef.current) clearInterval(timerRef.current)
    }
  }, [currentIndex, timerActive])

  const handleNext = () => {
    const updatedAnswers = [...answers, selectedIndex ?? -1]
    if (currentIndex + 1 >= questions.length) {
      const correct = updatedAnswers.filter(
        (a, i) => a === questions[i].correctIndex
      ).length
      onComplete(updatedAnswers, correct)
    } else {
      setAnswers(updatedAnswers)
      setSelectedIndex(null)
      setTimerActive(true)
      setCurrentIndex((i) => i + 1)
    }
  }

  const progress = ((currentIndex + (isAnswered ? 1 : 0)) / questions.length) * 100

  return (
    <div className="flex flex-col gap-6">
      {/* Progress bar + timer */}
      <div className="flex items-center gap-4">
        <div className="flex-1">
          <div className="flex justify-between text-xs mb-2" style={{ color: '#94a3b8' }}>
            <span>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <div
            className="h-1.5 rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          >
            <motion.div
              className="h-full rounded-full"
              style={{ background: 'linear-gradient(90deg,#6366f1,#8b5cf6)' }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.4 }}
            />
          </div>
        </div>
        <TimerRing timeLeft={timeLeft} total={TIMER_DURATION} />
      </div>

      {/* Question card */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentIndex}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
          className="glass-card p-6 md:p-8"
        >
          <p
            className="font-semibold text-lg md:text-xl leading-relaxed mb-8"
            style={{ color: '#f1f5f9' }}
          >
            {question.question}
          </p>

          {/* Options grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {question.options.map((opt, idx) => {
              let state: 'neutral' | 'correct' | 'wrong' | 'ghost' = 'neutral'
              if (isAnswered) {
                if (idx === question.correctIndex) state = 'correct'
                else if (idx === selectedIndex) state = 'wrong'
                else state = 'ghost'
              }
              return (
                <OptionButton
                  key={idx}
                  label={opt}
                  index={idx}
                  state={state}
                  onClick={() => handleAnswer(idx)}
                  disabled={isAnswered}
                />
              )
            })}
          </div>

          {/* Explanation */}
          <AnimatePresence>
            {isAnswered && (
              <motion.div
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: 'auto', marginTop: 24 }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div
                  className="rounded-xl p-4 flex gap-3"
                  style={{
                    background:
                      selectedIndex === question.correctIndex
                        ? 'rgba(16,185,129,0.08)'
                        : 'rgba(244,63,94,0.08)',
                    border:
                      selectedIndex === question.correctIndex
                        ? '1px solid rgba(16,185,129,0.2)'
                        : '1px solid rgba(244,63,94,0.2)',
                  }}
                >
                  {selectedIndex === question.correctIndex ? (
                    <CheckCircle2
                      size={18}
                      color="#10b981"
                      className="flex-shrink-0 mt-0.5"
                    />
                  ) : (
                    <AlertCircle
                      size={18}
                      color="#f43f5e"
                      className="flex-shrink-0 mt-0.5"
                    />
                  )}
                  <div>
                    <p
                      className="text-xs font-semibold mb-1"
                      style={{
                        color:
                          selectedIndex === question.correctIndex ? '#10b981' : '#f43f5e',
                      }}
                    >
                      {selectedIndex === question.correctIndex ? 'Correct!' : selectedIndex === -1 ? 'Time\'s up!' : 'Incorrect'}
                    </p>
                    <p className="text-sm leading-relaxed" style={{ color: '#94a3b8' }}>
                      {question.explanation}
                    </p>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>
      </AnimatePresence>

      {/* Next button */}
      <AnimatePresence>
        {isAnswered && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            className="flex justify-end"
          >
            <motion.button
              onClick={handleNext}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              className="btn-primary flex items-center gap-2"
            >
              {currentIndex + 1 >= questions.length ? (
                <>
                  <Trophy size={16} />
                  Finish Quiz
                </>
              ) : (
                <>
                  Next Question
                  <ChevronRight size={16} />
                </>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// ─── Quiz Complete Screen ─────────────────────────────────────────────────────

interface QuizCompleteProps {
  questions: QuizQuestion[]
  answers: number[]
  correctCount: number
  topicTitle: string
  onRetry: () => void
  onViewProgress: () => void
}

function QuizComplete({
  questions,
  answers,
  correctCount,
  topicTitle,
  onRetry,
  onViewProgress,
}: QuizCompleteProps) {
  const score = Math.round((correctCount / questions.length) * 100)
  const grade = getGrade(score)

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      className="flex flex-col gap-8"
    >
      {/* Score card */}
      <div className="glass-card p-8 flex flex-col items-center gap-4 text-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200 }}
        >
          <ScoreArc score={score} animate />
        </motion.div>

        <div>
          <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
            Quiz Complete!
          </h2>
          <p className="mt-1" style={{ color: '#94a3b8' }}>
            {topicTitle}
          </p>
        </div>

        <div className="flex items-center gap-2 text-lg font-semibold">
          <span style={{ color: grade.color }}>
            {correctCount} / {questions.length}
          </span>
          <span style={{ color: '#475569' }}>correct</span>
        </div>

        <div className="flex gap-3">
          <motion.button
            onClick={onRetry}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary flex items-center gap-2"
          >
            <RotateCcw size={15} />
            Retry
          </motion.button>
          <motion.button
            onClick={onViewProgress}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2"
          >
            <TrendingUp size={15} />
            View Progress
          </motion.button>
        </div>
      </div>

      {/* Per-question breakdown */}
      <div className="glass-card p-6">
        <h3 className="font-semibold text-base mb-4" style={{ color: '#f1f5f9' }}>
          Question Breakdown
        </h3>
        <div className="flex flex-col gap-3">
          {questions.map((q, i) => {
            const correct = answers[i] === q.correctIndex
            return (
              <motion.div
                key={q.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.05 * i }}
                className="flex items-start gap-3 p-3 rounded-xl"
                style={{ background: 'rgba(255,255,255,0.03)' }}
              >
                <div className="flex-shrink-0 mt-0.5">
                  {correct ? (
                    <CheckCircle2 size={18} color="#10b981" />
                  ) : (
                    <XCircle size={18} color="#f43f5e" />
                  )}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm leading-snug" style={{ color: '#cbd5e1' }}>
                    <span className="font-semibold" style={{ color: '#94a3b8' }}>
                      Q{i + 1}.{' '}
                    </span>
                    {q.question}
                  </p>
                  {!correct && answers[i] !== -1 && (
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                      Your answer:{' '}
                      <span style={{ color: '#fb7185' }}>{q.options[answers[i]] ?? '—'}</span>
                      {' · '}Correct:{' '}
                      <span style={{ color: '#34d399' }}>{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                  {answers[i] === -1 && (
                    <p className="text-xs mt-1" style={{ color: '#64748b' }}>
                      Timed out · Correct:{' '}
                      <span style={{ color: '#34d399' }}>{q.options[q.correctIndex]}</span>
                    </p>
                  )}
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </motion.div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ topicTitle }: { topicTitle: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 flex flex-col items-center gap-4 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <Zap size={28} color="#6366f1" />
      </div>
      <div>
        <h3 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
          No Quiz Yet
        </h3>
        <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>
          A quiz for{' '}
          <span style={{ color: '#818cf8' }}>{topicTitle}</span> hasn't been generated yet.
          <br />
          Go to the Study page and generate a quiz for this topic.
        </p>
      </div>
      <a href="/study">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary flex items-center gap-2 mt-2"
        >
          <BookOpen size={16} />
          Go to Study Page
        </motion.button>
      </a>
    </motion.div>
  )
}

// ─── No Topics State ──────────────────────────────────────────────────────────

function NoTopicsState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-12 flex flex-col items-center gap-4 text-center"
    >
      <div
        className="w-16 h-16 rounded-2xl flex items-center justify-center"
        style={{ background: 'rgba(99,102,241,0.12)', border: '1px solid rgba(99,102,241,0.2)' }}
      >
        <BookOpen size={28} color="#6366f1" />
      </div>
      <div>
        <h3 className="text-xl font-bold" style={{ color: '#f1f5f9' }}>
          No Topics Found
        </h3>
        <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>
          Upload a document on the home page to extract topics and generate quizzes.
        </p>
      </div>
      <a href="/">
        <motion.button
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="btn-primary flex items-center gap-2 mt-2"
        >
          <Zap size={16} />
          Get Started
        </motion.button>
      </a>
    </motion.div>
  )
}

// ─── Main Quiz Page ───────────────────────────────────────────────────────────

type QuizPhase = 'idle' | 'running' | 'complete'

export function Quiz() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const { topics, getQuizForTopic, recordQuizAttempt } = useAppStore()

  const initialTopicId = searchParams.get('topic') ?? topics[0]?.id ?? ''
  const [selectedTopicId, setSelectedTopicId] = useState(initialTopicId)
  const [phase, setPhase] = useState<QuizPhase>('idle')
  const [finalAnswers, setFinalAnswers] = useState<number[]>([])
  const [finalCorrect, setFinalCorrect] = useState(0)

  const selectedTopic = topics.find((t) => t.id === selectedTopicId)
  const questions = getQuizForTopic(selectedTopicId)

  // When topic changes, reset quiz
  const handleTopicSelect = (id: string) => {
    setSelectedTopicId(id)
    setPhase('idle')
    setFinalAnswers([])
    setFinalCorrect(0)
  }

  const handleStartQuiz = () => {
    setPhase('running')
  }

  const handleComplete = (answers: number[], correctCount: number) => {
    setFinalAnswers(answers)
    setFinalCorrect(correctCount)
    setPhase('complete')

    const score = Math.round((correctCount / questions.length) * 100)
    recordQuizAttempt({
      topicId: selectedTopicId,
      score,
      correctCount,
      totalQuestions: questions.length,
      timestamp: Date.now(),
      answers,
    })
  }

  const handleRetry = () => {
    setPhase('running')
    setFinalAnswers([])
    setFinalCorrect(0)
  }

  if (topics.length === 0) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-10">
        <NoTopicsState />
      </div>
    )
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <Zap size={20} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#f1f5f9' }}>
            Quiz Mode
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Test your knowledge with AI-generated questions
          </p>
        </div>
      </div>

      {/* Topic selector (hidden while quiz is running/complete) */}
      <AnimatePresence>
        {phase !== 'running' && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden"
          >
            <TopicTabs
              topics={topics}
              selected={selectedTopicId}
              onSelect={handleTopicSelect}
            />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content area */}
      <AnimatePresence mode="wait">
        {phase === 'idle' && (
          <motion.div
            key="idle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {questions.length === 0 ? (
              <EmptyState topicTitle={selectedTopic?.title ?? ''} />
            ) : (
              /* Start card */
              <motion.div
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                className="glass-card p-8 flex flex-col items-center gap-6 text-center"
              >
                <span className="text-5xl">{selectedTopic?.emoji}</span>
                <div>
                  <h2 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
                    {selectedTopic?.title}
                  </h2>
                  <p className="mt-1 text-sm" style={{ color: '#94a3b8' }}>
                    {questions.length} questions · 30s per question
                  </p>
                </div>
                <div className="flex gap-6 text-sm" style={{ color: '#64748b' }}>
                  <span className="flex items-center gap-1">
                    <Clock size={14} color="#6366f1" />
                    ~{questions.length * 30}s total
                  </span>
                  <span className="flex items-center gap-1">
                    <CheckCircle2 size={14} color="#10b981" />
                    Multiple choice
                  </span>
                  <span className="flex items-center gap-1">
                    <Trophy size={14} color="#f59e0b" />
                    Graded A–D
                  </span>
                </div>
                <motion.button
                  onClick={handleStartQuiz}
                  whileHover={{ scale: 1.04 }}
                  whileTap={{ scale: 0.96 }}
                  className="btn-primary flex items-center gap-2 px-8 py-3 text-base"
                >
                  <Zap size={18} />
                  Start Quiz
                </motion.button>
              </motion.div>
            )}
          </motion.div>
        )}

        {phase === 'running' && (
          <motion.div
            key="running"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizRunner
              key={selectedTopicId + '-runner'}
              questions={questions}
              topicId={selectedTopicId}
              onComplete={handleComplete}
            />
          </motion.div>
        )}

        {phase === 'complete' && (
          <motion.div
            key="complete"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <QuizComplete
              questions={questions}
              answers={finalAnswers}
              correctCount={finalCorrect}
              topicTitle={selectedTopic?.title ?? ''}
              onRetry={handleRetry}
              onViewProgress={() => navigate('/progress')}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
