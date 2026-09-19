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
        <div className="w-12 h-12 rounded-lg bg-[#182030] border border-[#252f44] flex items-center justify-center text-slate-400 mb-4">
          <Layers size={20} />
        </div>
        <h2 className="text-lg font-semibold text-slate-100 mb-2">No learning data yet</h2>
        <p className="text-sm text-slate-400 mb-6">
          Upload documents and take practice quizzes to track your retention.
        </p>
        <button onClick={() => navigate('/')} className="btn-primary">
          Upload Notes
        </button>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-8 max-w-4xl mx-auto flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-100 mb-1">
          Learning Analytics
        </h1>
        <p className="text-sm text-slate-400">
          Track retention, test history, and topics needing revision.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="ui-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Topics Organized</span>
            <BookOpen size={16} className="text-blue-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">{topics.length}</div>
          <div className="text-[11px] text-slate-400 mt-1">Extracted from notes</div>
        </div>

        <div className="ui-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Average Quiz Score</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {avgScore !== null ? `${avgScore}%` : '—'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">
            Across {quizAttempts.length} attempt{quizAttempts.length !== 1 ? 's' : ''}
          </div>
        </div>

        <div className="ui-card p-5">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span>Study Streak</span>
            <Calendar size={16} className="text-amber-400" />
          </div>
          <div className="text-2xl font-bold text-slate-100">
            {streak} {streak === 1 ? 'day' : 'days'}
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Consecutive days active</div>
        </div>
      </div>

      {/* Weak Topics Alert (Needs Revision) */}
      {weakTopicObjects.length > 0 && (
        <div className="ui-card p-5 border-amber-900/40 bg-amber-950/10">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-sm mb-2">
            <AlertTriangle size={16} />
            <span>Topics Needing Revision ({weakTopicObjects.length})</span>
          </div>
          <p className="text-xs text-slate-400 mb-4">
            These topics scored below 60% on recent tests and require additional practice.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {weakTopicObjects.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-3 px-3 py-2 rounded-lg bg-[#0f1420] border border-[#1e2638] text-xs"
              >
                <span className="font-medium text-slate-200">{t.title}</span>
                <button
                  onClick={() => navigate('/study')}
                  className="text-blue-400 hover:text-blue-300 font-medium flex items-center gap-1"
                >
                  Review
                  <ArrowRight size={12} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Breakdown */}
      <div className="ui-card p-6">
        <h2 className="text-base font-semibold text-slate-100 mb-4">
          Topic Performance
        </h2>
        {topics.length === 0 ? (
          <div className="text-xs text-slate-400">No topics loaded.</div>
        ) : (
          <div className="flex flex-col divide-y divide-[#1e2638]">
            {topics.map((t) => {
              const best = getBestScore(t.id)
              const attempts = getAttemptsForTopic(t.id)
              const isWeak = weakTopics.includes(t.id)

              return (
                <div key={t.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-sm font-medium text-slate-200 truncate">
                        {t.title}
                      </span>
                      {isWeak && (
                        <span className="badge badge-warning">Needs Review</span>
                      )}
                    </div>
                    <div className="text-xs text-slate-400">
                      {attempts.length} attempt{attempts.length !== 1 ? 's' : ''}
                    </div>
                  </div>

                  <div className="flex items-center gap-6 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-semibold text-slate-100">
                        {best !== null ? `${best}%` : 'Unranked'}
                      </div>
                      <div className="text-[10px] text-slate-400 uppercase tracking-wider">
                        Best Score
                      </div>
                    </div>

                    <button
                      onClick={() => navigate('/quiz')}
                      className="btn-secondary px-3 py-1.5 text-xs"
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
        <div className="ui-card p-6">
          <div className="flex items-center gap-2 mb-4">
            <Clock size={16} className="text-slate-400" />
            <h2 className="text-base font-semibold text-slate-100">
              Recent Quiz History
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-[#1e2638]">
            {sortedAttempts.map((attempt) => {
              const topic = topics.find((t) => t.id === attempt.topicId)
              const isPass = attempt.score >= 60

              return (
                <div
                  key={attempt.id}
                  className="py-3 flex items-center justify-between gap-4 text-xs"
                >
                  <div className="flex items-center gap-2.5">
                    {isPass ? (
                      <CheckCircle2 size={16} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={16} className="text-rose-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-slate-200">
                        {topic?.title ?? 'General Quiz'}
                      </div>
                      <div className="text-slate-400">{formatDate(attempt.timestamp)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-slate-400">
                      {attempt.correctCount} / {attempt.totalQuestions}
                    </span>
                    <span
                      className={`badge ${
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
