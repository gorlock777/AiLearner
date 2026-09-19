import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  BookOpen,
  CheckSquare,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
  Award,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import type { Topic, QuizAttempt } from '../store/useAppStore'

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

export function Progress() {
  const navigate = useNavigate()
  const { topics, quizAttempts, weakTopics, getBestScore, getAttemptsForTopic } = useAppStore()

  const avgScore = useMemo(() => {
    if (quizAttempts.length === 0) return null
    const sum = quizAttempts.reduce((acc, a) => acc + a.score, 0)
    return Math.round(sum / quizAttempts.length)
  }, [quizAttempts])

  const streak = useMemo(() => {
    return computeStreak(quizAttempts.map((a) => a.timestamp))
  }, [quizAttempts])

  const weakTopicObjects = useMemo(() => {
    return topics.filter((t) => weakTopics.includes(t.id))
  }, [topics, weakTopics])

  const sortedAttempts = useMemo(() => {
    return [...quizAttempts].sort((a, b) => b.timestamp - a.timestamp).slice(0, 8)
  }, [quizAttempts])

  if (topics.length === 0 && quizAttempts.length === 0) {
    return (
      <div className="min-h-full flex flex-col items-center justify-center p-8 text-center max-w-md mx-auto">
        <div className="w-11 h-11 rounded-lg bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-4">
          <Layers size={20} />
        </div>
        <h2 className="text-base font-semibold text-zinc-100 mb-1">No learning metrics yet</h2>
        <p className="text-xs text-zinc-400 mb-5">
          Upload documents and complete quizzes to populate your retention telemetry.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Upload Notes
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto flex flex-col gap-6">
      {/* Header */}
      <div>
        <h1 className="text-xl font-semibold text-zinc-100 mb-1">
          Performance Analytics
        </h1>
        <p className="text-xs text-zinc-400">
          Retention analytics, quiz accuracy, and targeted revision priorities
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Knowledge Modules</span>
            <BookOpen size={15} className="text-zinc-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">{topics.length}</div>
          <div className="text-[11px] text-zinc-400 mt-1">Organized from notes</div>
        </div>

        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Average Accuracy</span>
            <TrendingUp size={15} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {avgScore !== null ? `${avgScore}%` : '—'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1 font-mono">
            {quizAttempts.length} attempt{quizAttempts.length !== 1 ? 's' : ''} logged
          </div>
        </div>

        <div className="linear-card p-5">
          <div className="flex items-center justify-between text-xs text-zinc-400 mb-2">
            <span>Consecutive Streak</span>
            <Calendar size={15} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-zinc-100">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-[11px] text-zinc-400 mt-1">Daily active retention</div>
        </div>
      </div>

      {/* Weak Topics Alert (Needs Revision) */}
      {weakTopicObjects.length > 0 && (
        <div className="linear-card p-5 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-1.5">
            <AlertTriangle size={15} />
            <span>High Priority Revision ({weakTopicObjects.length})</span>
          </div>
          <p className="text-xs text-zinc-400 mb-4">
            Topics scoring under 60% on recent testing modules. Spaced review recommended.
          </p>
          <div className="flex flex-wrap gap-2">
            {weakTopicObjects.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 text-xs"
              >
                <span className="font-medium text-zinc-200">{t.title}</span>
                <button
                  onClick={() => navigate('/study')}
                  className="text-zinc-400 hover:text-white font-medium flex items-center gap-1 transition-colors text-[11px]"
                >
                  Study
                  <ArrowRight size={11} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Breakdown */}
      <div className="linear-card p-5">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-zinc-100">
            Module Performance Breakdown
          </h2>
          <span className="text-[11px] font-mono text-zinc-400">
            {topics.length} topics
          </span>
        </div>

        {topics.length === 0 ? (
          <div className="text-xs text-zinc-400">No topics loaded.</div>
        ) : (
          <div className="flex flex-col divide-y divide-zinc-800/80">
            {topics.map((t) => {
              const best = getBestScore(t.id)
              const attempts = getAttemptsForTopic(t.id)
              const isWeak = weakTopics.includes(t.id)

              return (
                <div key={t.id} className="py-3 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {t.title}
                      </span>
                      {isWeak && (
                        <span className="badge badge-warning text-[10px]">Review</span>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {attempts.length} test{attempts.length !== 1 ? 's' : ''} completed
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-zinc-200">
                        {best !== null ? `${best}%` : 'Unranked'}
                      </div>
                      <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono">
                        Best Score
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/quiz')}
                      className="btn-secondary py-1 px-2.5 text-xs"
                    >
                      Quiz
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent History Table */}
      {sortedAttempts.length > 0 && (
        <div className="linear-card p-5">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={15} className="text-zinc-400" />
            <h2 className="text-sm font-semibold text-zinc-100">
              Recent Activity Stream
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-800/80">
            {sortedAttempts.map((attempt) => {
              const topic = topics.find((t) => t.id === attempt.topicId)
              const isPass = attempt.score >= 60

              return (
                <div
                  key={attempt.id}
                  className="py-2.5 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {isPass ? (
                      <CheckCircle2 size={15} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={15} className="text-amber-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-zinc-200 text-xs">
                        {topic?.title ?? 'General Quiz'}
                      </div>
                      <div className="text-zinc-400 text-[11px] font-mono">{formatDate(attempt.timestamp)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px] font-mono">
                      {attempt.correctCount} / {attempt.totalQuestions}
                    </span>
                    <span
                      className={`badge font-mono text-[10px] ${
                        attempt.score >= 80
                          ? 'badge-success'
                          : attempt.score >= 60
                          ? 'badge-warning'
                          : 'badge-danger'
                      }`}
                    >
                      {attempt.score}%
                    </span>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}

export default Progress
