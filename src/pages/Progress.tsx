import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  TrendingUp,
  BookOpen,
  AlertTriangle,
  Clock,
  ArrowRight,
  CheckCircle2,
  Calendar,
  Layers,
} from 'lucide-react'
import { useAppStore } from '../store/useAppStore'
import { Button } from '../components/ui/button'
import { Badge } from '../components/ui/badge'
import { GaugeMeter } from '../components/ui/gauge-meter'
import { ShimmerButton } from '../components/ui/shimmer-button'

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
        <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-800 flex items-center justify-center text-zinc-400 mb-3">
          <Layers size={16} />
        </div>
        <h2 className="text-sm font-semibold text-zinc-100 mb-1">No learning metrics yet</h2>
        <p className="text-xs text-zinc-400 mb-4">
          Import documents and complete quizzes to populate your retention telemetry.
        </p>
        <ShimmerButton onClick={() => navigate('/app')}>
          Import Notes
        </ShimmerButton>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-6 max-w-4xl mx-auto flex flex-col gap-5">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-zinc-800/80 pb-6">
        <div>
          <span className="text-[10px] font-mono tracking-[0.2em] uppercase text-zinc-300 font-semibold mb-1.5 block">
            Telemetry & Retention
          </span>
          <h1 className="font-heading font-normal text-2xl sm:text-3xl text-zinc-100 tracking-tight">
            Performance Analytics
          </h1>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs sm:text-right leading-relaxed font-mono">
          Diagnostic accuracy, weak area revision priorities, and study streaks
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="p-5 rounded-xl bg-[#0e0e12] border border-zinc-800/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-mono mb-3">
            <span className="uppercase tracking-wider text-[10px]">Knowledge Modules</span>
            <BookOpen size={14} className="text-zinc-400" />
          </div>
          <div>
            <div className="font-heading text-2xl font-normal text-zinc-100 mb-0.5">{topics.length}</div>
            <div className="text-[11px] text-zinc-400">Organized from documents</div>
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e12] border border-zinc-800/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-mono mb-3">
            <span className="uppercase tracking-wider text-[10px]">Average Accuracy</span>
            <TrendingUp size={14} className="text-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading text-2xl font-normal text-zinc-100 mb-0.5">
                {avgScore !== null ? `${avgScore}%` : '—'}
              </div>
              <div className="text-[11px] text-zinc-400 font-mono">
                {quizAttempts.length} attempt{quizAttempts.length !== 1 ? 's' : ''} logged
              </div>
            </div>
            {avgScore !== null && (
              <GaugeMeter
                value={avgScore}
                size={52}
                strokeWidth={5}
                label=""
                className="-my-1"
              />
            )}
          </div>
        </div>

        <div className="p-5 rounded-xl bg-[#0e0e12] border border-zinc-800/80 shadow-md flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-300 font-mono mb-3">
            <span className="uppercase tracking-wider text-[10px]">Daily Streak</span>
            <Calendar size={14} className="text-amber-400" />
          </div>
          <div>
            <div className="font-heading text-2xl font-normal text-zinc-100 mb-0.5">
              {streak} <span className="text-sm font-normal text-zinc-400 font-sans">{streak === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="text-[11px] text-zinc-400">Active retention tracking</div>
          </div>
        </div>
      </div>

      {/* Weak Topics Alert */}
      {weakTopicObjects.length > 0 && (
        <div className="linear-card p-4 border-amber-500/20 bg-amber-950/10">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-1 font-mono">
            <AlertTriangle size={14} />
            <span>High Priority Revision ({weakTopicObjects.length})</span>
          </div>
          <p className="text-xs text-zinc-400 mb-3">
            Topics scoring below 60% accuracy on recent diagnostic checks.
          </p>
          <div className="flex flex-wrap gap-2">
            {weakTopicObjects.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2 px-2.5 py-1 rounded bg-zinc-900 border border-zinc-800 text-xs font-mono"
              >
                <span className="text-zinc-200">{t.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/study')}
                  className="h-5 px-1.5 text-[10px] text-zinc-400 hover:text-white"
                >
                  Study <ArrowRight size={10} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Breakdown */}
      <div className="linear-card p-4">
        <div className="flex items-center justify-between mb-3 border-b border-zinc-800/80 pb-2.5">
          <h2 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">
            Module Performance Breakdown
          </h2>
          <Badge variant="secondary">
            {topics.length} topics
          </Badge>
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
                <div key={t.id} className="py-2.5 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-xs font-medium text-zinc-200 truncate">
                        {t.title}
                      </span>
                      {isWeak && (
                        <Badge variant="warning">Review</Badge>
                      )}
                    </div>
                    <div className="text-[11px] text-zinc-400 font-mono">
                      {attempts.length} test{attempts.length !== 1 ? 's' : ''} completed
                    </div>
                  </div>

                  <div className="flex items-center gap-3 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-xs font-bold font-mono text-zinc-200">
                        {best !== null ? `${best}%` : 'Unranked'}
                      </div>
                      <div className="text-[9px] text-zinc-400 uppercase tracking-wider font-mono">
                        Best Score
                      </div>
                    </div>

                    <Button
                      variant="secondary"
                      size="sm"
                      onClick={() => navigate('/quiz')}
                      className="text-xs h-7 px-2.5 font-mono"
                    >
                      Quiz
                    </Button>
                  </div>
                </div>
              )
            })}
          </div>
        )}
      </div>

      {/* Recent History Table */}
      {sortedAttempts.length > 0 && (
        <div className="linear-card p-4">
          <div className="flex items-center gap-2 mb-3 border-b border-zinc-800/80 pb-2.5">
            <Clock size={14} className="text-zinc-400" />
            <h2 className="text-xs font-semibold text-zinc-100 font-mono uppercase tracking-wider">
              Recent Assessment Activity
            </h2>
          </div>

          <div className="flex flex-col divide-y divide-zinc-800/80">
            {sortedAttempts.map((attempt) => {
              const topic = topics.find((t) => t.id === attempt.topicId)
              const isPass = attempt.score >= 60

              return (
                <div
                  key={attempt.id}
                  className="py-2 flex items-center justify-between gap-4 text-xs font-mono"
                >
                  <div className="flex items-center gap-2.5">
                    {isPass ? (
                      <CheckCircle2 size={14} className="text-emerald-400 flex-shrink-0" />
                    ) : (
                      <AlertTriangle size={14} className="text-amber-400 flex-shrink-0" />
                    )}
                    <div>
                      <div className="font-medium text-zinc-200 text-xs">
                        {topic?.title ?? 'General Assessment'}
                      </div>
                      <div className="text-zinc-400 text-[10px]">{formatDate(attempt.timestamp)}</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <span className="text-zinc-400 text-[11px]">
                      {attempt.correctCount} / {attempt.totalQuestions}
                    </span>
                    <Badge
                      variant={
                        attempt.score >= 80
                          ? 'success'
                          : attempt.score >= 60
                          ? 'warning'
                          : 'destructive'
                      }
                    >
                      {attempt.score}%
                    </Badge>
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
