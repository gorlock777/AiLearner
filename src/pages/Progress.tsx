import { useMemo } from 'react'
import { motion } from 'framer-motion'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  BookOpen,
  Zap,
  Flame,
  Trophy,
  Target,
  Calendar,
  ChevronRight,
  CheckCircle2,
  XCircle,
  Clock,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Topic, QuizAttempt } from '../store/useAppStore'

// ─── Helpers ─────────────────────────────────────────────────────────────────

function formatDate(ts: number): string {
  const d = new Date(ts)
  const now = new Date()
  const diffMs = now.getTime() - d.getTime()
  const diffHrs = diffMs / (1000 * 60 * 60)

  if (diffHrs < 1) return 'Just now'
  if (diffHrs < 24) return `${Math.floor(diffHrs)}h ago`
  if (diffHrs < 48) return 'Yesterday'
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
}

function formatTime(ts: number): string {
  return new Date(ts).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })
}

/** Compute study streak in days: consecutive days up to today that have ≥1 attempt */
function computeStreak(timestamps: number[]): number {
  if (timestamps.length === 0) return 0

  const days = new Set(
    timestamps.map((ts) => {
      const d = new Date(ts)
      return `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    })
  )

  let streak = 0
  const today = new Date()
  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = `${d.getFullYear()}-${d.getMonth()}-${d.getDate()}`
    if (days.has(key)) {
      streak++
    } else {
      break
    }
  }
  return streak
}

function scoreColor(score: number): string {
  if (score >= 80) return '#10b981'
  if (score >= 60) return '#f59e0b'
  return '#f43f5e'
}

function scoreBg(score: number): string {
  if (score >= 80) return 'rgba(16,185,129,0.12)'
  if (score >= 60) return 'rgba(245,158,11,0.12)'
  return 'rgba(244,63,94,0.12)'
}

function scoreBorder(score: number): string {
  if (score >= 80) return 'rgba(16,185,129,0.3)'
  if (score >= 60) return 'rgba(245,158,11,0.3)'
  return 'rgba(244,63,94,0.3)'
}

// ─── Stat Card ────────────────────────────────────────────────────────────────

function StatCard({
  icon: Icon,
  label,
  value,
  sub,
  color,
  delay,
}: {
  icon: React.ElementType
  label: string
  value: string | number
  sub?: string
  color: string
  delay: number
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 flex flex-col gap-3"
    >
      <div
        className="w-10 h-10 rounded-xl flex items-center justify-center"
        style={{ background: `${color}18`, border: `1px solid ${color}33` }}
      >
        <Icon size={20} color={color} />
      </div>
      <div>
        <p className="text-3xl font-black" style={{ color: '#f1f5f9' }}>
          {value}
        </p>
        <p className="text-sm font-medium mt-0.5" style={{ color: '#94a3b8' }}>
          {label}
        </p>
        {sub && (
          <p className="text-xs mt-1" style={{ color: '#475569' }}>
            {sub}
          </p>
        )}
      </div>
    </motion.div>
  )
}

// ─── Mini Score Bar ───────────────────────────────────────────────────────────

function ScoreBar({ score }: { score: number }) {
  return (
    <div className="relative h-1.5 rounded-full overflow-hidden" style={{ background: 'rgba(255,255,255,0.06)' }}>
      <motion.div
        initial={{ width: 0 }}
        animate={{ width: `${score}%` }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="absolute inset-y-0 left-0 rounded-full"
        style={{ background: scoreColor(score) }}
      />
    </div>
  )
}

// ─── Topic Score Card ─────────────────────────────────────────────────────────

function TopicScoreCard({
  topic,
  bestScore,
  attempts,
  isWeak,
  onStudy,
  onQuiz,
  delay,
}: {
  topic: Topic
  bestScore: number | null
  attempts: number
  isWeak: boolean
  onStudy: () => void
  onQuiz: () => void
  delay: number
}) {
  const score = bestScore ?? 0
  const hasData = bestScore !== null

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay }}
      className="glass-card p-5 flex flex-col gap-4"
      style={{ position: 'relative', overflow: 'hidden' }}
    >
      {/* Weak topic glow */}
      {isWeak && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'radial-gradient(ellipse at top left, rgba(244,63,94,0.06) 0%, transparent 70%)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-3">
          <span className="text-2xl">{topic.emoji}</span>
          <div>
            <p className="font-semibold text-sm leading-tight" style={{ color: '#f1f5f9' }}>
              {topic.title}
            </p>
            <p className="text-xs mt-0.5" style={{ color: '#64748b' }}>
              {attempts} attempt{attempts !== 1 ? 's' : ''}
            </p>
          </div>
        </div>
        {isWeak && (
          <span
            className="flex items-center gap-1 text-xs font-semibold px-2 py-0.5 rounded-full flex-shrink-0"
            style={{
              background: 'rgba(244,63,94,0.12)',
              color: '#fb7185',
              border: '1px solid rgba(244,63,94,0.25)',
            }}
          >
            <Flame size={11} />
            Weak
          </span>
        )}
      </div>

      {/* Score */}
      {hasData ? (
        <>
          <div className="flex items-end justify-between">
            <span
              className="text-4xl font-black"
              style={{ color: scoreColor(score), lineHeight: 1 }}
            >
              {score}
            </span>
            <span className="text-xs pb-1" style={{ color: '#475569' }}>
              / 100
            </span>
          </div>
          <ScoreBar score={score} />
        </>
      ) : (
        <div
          className="flex items-center gap-2 py-3 rounded-xl px-3"
          style={{ background: 'rgba(255,255,255,0.03)' }}
        >
          <Target size={14} color="#475569" />
          <span className="text-sm" style={{ color: '#475569' }}>
            No quiz taken yet
          </span>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex gap-2">
        <motion.button
          onClick={onStudy}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(99,102,241,0.1)',
            border: '1px solid rgba(99,102,241,0.2)',
            color: '#818cf8',
          }}
        >
          <BookOpen size={13} />
          Study
        </motion.button>
        <motion.button
          onClick={onQuiz}
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
          className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl text-xs font-semibold transition-all"
          style={{
            background: 'rgba(99,102,241,0.15)',
            border: '1px solid rgba(99,102,241,0.3)',
            color: '#a5b4fc',
          }}
        >
          <Zap size={13} />
          Quiz →
        </motion.button>
      </div>
    </motion.div>
  )
}

// ─── Weak Topics Panel ────────────────────────────────────────────────────────

function WeakTopicsPanel({
  weakTopics,
  topics,
  onRevise,
}: {
  weakTopics: string[]
  topics: Topic[]
  onRevise: (topicId: string) => void
}) {
  if (weakTopics.length === 0) return null

  const weakTopicData = weakTopics
    .map((id) => topics.find((t) => t.id === id))
    .filter(Boolean) as Topic[]

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.15 }}
      className="rounded-2xl p-5"
      style={{
        background: 'rgba(244,63,94,0.06)',
        border: '1px solid rgba(244,63,94,0.2)',
        backdropFilter: 'blur(12px)',
        WebkitBackdropFilter: 'blur(12px)',
      }}
    >
      <div className="flex items-center gap-2 mb-4">
        <Flame size={18} color="#f43f5e" />
        <h2 className="font-bold text-base" style={{ color: '#fb7185' }}>
          Needs Revision
        </h2>
        <span
          className="ml-1 px-2 py-0.5 rounded-full text-xs font-bold"
          style={{ background: 'rgba(244,63,94,0.15)', color: '#fb7185' }}
        >
          {weakTopics.length}
        </span>
      </div>

      <div className="flex flex-col gap-3">
        {weakTopicData.map((topic, i) => (
          <motion.div
            key={topic.id}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.05 * i }}
            className="flex items-center justify-between gap-4 p-3 rounded-xl"
            style={{ background: 'rgba(244,63,94,0.06)' }}
          >
            <div className="flex items-center gap-3">
              <span className="text-xl">{topic.emoji}</span>
              <div>
                <p className="font-semibold text-sm" style={{ color: '#f1f5f9' }}>
                  {topic.title}
                </p>
                <span
                  className="text-xs font-semibold"
                  style={{ color: '#fb7185' }}
                >
                  Needs Revision
                </span>
              </div>
            </div>
            <motion.button
              onClick={() => onRevise(topic.id)}
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              className="flex-shrink-0 flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold"
              style={{
                background: 'rgba(244,63,94,0.15)',
                border: '1px solid rgba(244,63,94,0.3)',
                color: '#fb7185',
              }}
            >
              Start Revision
              <ChevronRight size={12} />
            </motion.button>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

// ─── Quiz History Timeline ────────────────────────────────────────────────────

function QuizHistoryTimeline({
  attempts,
  topics,
}: {
  attempts: QuizAttempt[]
  topics: Topic[]
}) {
  const sorted = [...attempts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 10)

  return (
    <div className="glass-card p-6">
      <div className="flex items-center gap-2 mb-5">
        <Clock size={18} color="#6366f1" />
        <h2 className="font-bold text-base" style={{ color: '#f1f5f9' }}>
          Recent Quiz History
        </h2>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div
          className="absolute left-5 top-0 bottom-0 w-px"
          style={{ background: 'rgba(255,255,255,0.06)' }}
        />

        <div className="flex flex-col gap-4">
          {sorted.map((attempt, i) => {
            const topic = topics.find((t) => t.id === attempt.topicId)
            const color = scoreColor(attempt.score)
            const isCorrect = attempt.score >= 60

            return (
              <motion.div
                key={attempt.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.04 * i }}
                className="flex gap-4 pl-2"
              >
                {/* Timeline dot */}
                <div
                  className="flex-shrink-0 w-6 h-6 rounded-full flex items-center justify-center z-10"
                  style={{ background: isCorrect ? 'rgba(16,185,129,0.2)' : 'rgba(244,63,94,0.2)', border: `1px solid ${color}44` }}
                >
                  {isCorrect ? (
                    <CheckCircle2 size={12} color="#10b981" />
                  ) : (
                    <XCircle size={12} color="#f43f5e" />
                  )}
                </div>

                {/* Content */}
                <div className="flex-1 flex items-center justify-between gap-4 pb-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
                  <div>
                    <p className="font-medium text-sm" style={{ color: '#f1f5f9' }}>
                      {topic?.emoji} {topic?.title ?? attempt.topicId}
                    </p>
                    <p className="text-xs mt-0.5" style={{ color: '#475569' }}>
                      {formatDate(attempt.timestamp)} · {formatTime(attempt.timestamp)}
                      {' · '}
                      {attempt.correctCount}/{attempt.totalQuestions} correct
                    </p>
                  </div>
                  <span
                    className="flex-shrink-0 font-bold text-sm px-3 py-1 rounded-full"
                    style={{
                      color,
                      background: scoreBg(attempt.score),
                      border: `1px solid ${scoreBorder(attempt.score)}`,
                    }}
                  >
                    {attempt.score}%
                  </span>
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </div>
  )
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="glass-card p-14 flex flex-col items-center gap-5 text-center"
    >
      <div
        className="w-20 h-20 rounded-2xl flex items-center justify-center"
        style={{
          background: 'rgba(99,102,241,0.1)',
          border: '1px solid rgba(99,102,241,0.2)',
        }}
      >
        <TrendingUp size={36} color="#6366f1" />
      </div>
      <div>
        <h3 className="text-2xl font-bold" style={{ color: '#f1f5f9' }}>
          No Quiz Attempts Yet
        </h3>
        <p className="mt-2 text-sm max-w-sm mx-auto leading-relaxed" style={{ color: '#94a3b8' }}>
          Start studying and take some quizzes to see your progress, scores, and weak areas here.
        </p>
      </div>
      <div className="flex gap-3">
        <a href="/study">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-secondary flex items-center gap-2"
          >
            <BookOpen size={15} />
            Study First
          </motion.button>
        </a>
        <a href="/quiz">
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            className="btn-primary flex items-center gap-2"
          >
            <Zap size={15} />
            Take a Quiz
          </motion.button>
        </a>
      </div>
    </motion.div>
  )
}

// ─── Main Progress Page ───────────────────────────────────────────────────────

export function Progress() {
  const navigate = useNavigate()
  const { topics, quizAttempts, weakTopics, getBestScore, getAttemptsForTopic } = useAppStore()

  const hasAttempts = quizAttempts.length > 0

  const avgScore = useMemo(() => {
    if (!hasAttempts) return 0
    const total = quizAttempts.reduce((s, a) => s + a.score, 0)
    return Math.round(total / quizAttempts.length)
  }, [quizAttempts, hasAttempts])

  const streak = useMemo(
    () => computeStreak(quizAttempts.map((a) => a.timestamp)),
    [quizAttempts]
  )

  const topicStudied = useMemo(
    () => topics.filter((t) => getAttemptsForTopic(t.id).length > 0).length,
    [topics, getAttemptsForTopic]
  )

  const handleRevise = (topicId: string) => {
    navigate(`/study?topic=${topicId}`)
  }

  const handleStudy = (topicId: string) => {
    navigate(`/study?topic=${topicId}`)
  }

  const handleQuiz = (topicId: string) => {
    navigate(`/quiz?topic=${topicId}`)
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 flex flex-col gap-8">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div
          className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0"
          style={{ background: 'linear-gradient(135deg,#6366f1,#8b5cf6)' }}
        >
          <TrendingUp size={20} color="white" />
        </div>
        <div>
          <h1 className="text-2xl font-black" style={{ color: '#f1f5f9' }}>
            Progress Dashboard
          </h1>
          <p className="text-sm" style={{ color: '#64748b' }}>
            Your learning analytics at a glance
          </p>
        </div>
      </div>

      {!hasAttempts ? (
        <EmptyState />
      ) : (
        <>
          {/* ── Stat cards row ── */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <StatCard
              icon={BookOpen}
              label="Topics Studied"
              value={topicStudied}
              sub={`of ${topics.length} total topic${topics.length !== 1 ? 's' : ''}`}
              color="#6366f1"
              delay={0}
            />
            <StatCard
              icon={Trophy}
              label="Average Score"
              value={`${avgScore}%`}
              sub={`across ${quizAttempts.length} attempt${quizAttempts.length !== 1 ? 's' : ''}`}
              color={scoreColor(avgScore)}
              delay={0.08}
            />
            <StatCard
              icon={Calendar}
              label="Study Streak"
              value={`${streak} day${streak !== 1 ? 's' : ''}`}
              sub={streak > 0 ? 'Keep it up! 🔥' : 'Start a streak today'}
              color="#f59e0b"
              delay={0.16}
            />
          </div>

          {/* ── Weak topics panel ── */}
          {weakTopics.length > 0 && (
            <WeakTopicsPanel
              weakTopics={weakTopics}
              topics={topics}
              onRevise={handleRevise}
            />
          )}

          {/* ── Per-topic score grid ── */}
          {topics.length > 0 && (
            <section>
              <h2
                className="font-bold text-base mb-4 flex items-center gap-2"
                style={{ color: '#f1f5f9' }}
              >
                <Target size={16} color="#6366f1" />
                Topic Scores
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {topics.map((topic, i) => {
                  const best = getBestScore(topic.id)
                  const attemptsCount = getAttemptsForTopic(topic.id).length
                  const isWeak = weakTopics.includes(topic.id)

                  return (
                    <TopicScoreCard
                      key={topic.id}
                      topic={topic}
                      bestScore={best}
                      attempts={attemptsCount}
                      isWeak={isWeak}
                      onStudy={() => handleStudy(topic.id)}
                      onQuiz={() => handleQuiz(topic.id)}
                      delay={0.05 * i}
                    />
                  )
                })}
              </div>
            </section>
          )}

          {/* ── Quiz history timeline ── */}
          {quizAttempts.length > 0 && (
            <QuizHistoryTimeline attempts={quizAttempts} topics={topics} />
          )}
        </>
      )}
    </div>
  )
}
