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
          Import documents and complete quizzes to populate your retention analytics.
        </p>
        <ShimmerButton onClick={() => navigate('/app')}>
          Import Notes
        </ShimmerButton>
      </div>
    )
  }

  return (
    <div className="min-h-full px-6 py-10 pb-32 max-w-5xl mx-auto flex flex-col gap-8">
      {/* Editorial Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 font-mono text-[11px] mb-3">
            <TrendingUp size={12} />
            <span>Mastery Intelligence</span>
          </div>
          <h1 className="font-heading font-normal text-3xl sm:text-4xl text-white tracking-tight">
            Retention Analytics
          </h1>
        </div>
        <p className="text-xs text-zinc-400 max-w-xs sm:text-right leading-relaxed font-sans">
          Diagnostic accuracy metrics, spaced repetition retention tracking, and revision priorities.
        </p>
      </div>

      {/* Primary KPI Row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="p-6 md:p-7 rounded-3xl bg-[#12141e]/70 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4">
            <span className="uppercase tracking-wider text-[11px]">Knowledge Modules</span>
            <BookOpen size={16} className="text-zinc-400" />
          </div>
          <div>
            <div className="font-heading text-3xl md:text-4xl font-normal text-white mb-1">{topics.length}</div>
            <div className="text-xs text-zinc-400 font-sans">Organized from documents</div>
          </div>
        </div>

        <div className="p-6 md:p-7 rounded-3xl bg-[#12141e]/70 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4">
            <span className="uppercase tracking-wider text-[11px]">Average Accuracy</span>
            <TrendingUp size={16} className="text-emerald-400" />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <div className="font-heading text-3xl md:text-4xl font-normal text-emerald-400 mb-1">
                {avgScore !== null ? `${avgScore}%` : '—'}
              </div>
              <div className="text-xs text-zinc-400 font-mono">
                {quizAttempts.length} attempt{quizAttempts.length !== 1 ? 's' : ''} logged
              </div>
            </div>
            {avgScore !== null && (
              <GaugeMeter
                value={avgScore}
                size={56}
                strokeWidth={6}
                label=""
                className="-my-1"
              />
            )}
          </div>
        </div>

        <div className="p-6 md:p-7 rounded-3xl bg-[#12141e]/70 border border-white/10 backdrop-blur-md shadow-xl flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-zinc-400 font-mono mb-4">
            <span className="uppercase tracking-wider text-[11px]">Active Streak</span>
            <Calendar size={16} className="text-amber-400" />
          </div>
          <div>
            <div className="font-heading text-3xl md:text-4xl font-normal text-amber-400 mb-1">
              {streak} <span className="text-base font-normal text-zinc-400 font-sans">{streak === 1 ? 'day' : 'days'}</span>
            </div>
            <div className="text-xs text-zinc-400 font-sans">Daily practice consistency</div>
          </div>
        </div>
      </div>

      {/* Weak Topics Alert */}
      {weakTopicObjects.length > 0 && (
        <div className="p-6 rounded-3xl border border-amber-500/30 bg-amber-500/10 backdrop-blur-md shadow-lg">
          <div className="flex items-center gap-2 text-amber-300 font-semibold text-xs mb-1.5 font-mono">
            <AlertTriangle size={15} />
            <span>High Priority Revision ({weakTopicObjects.length} topics)</span>
          </div>
          <p className="text-xs text-zinc-300 mb-4 font-sans leading-relaxed">
            Topics scoring below 60% accuracy on recent diagnostic checks. Targeted flashcard study is recommended.
          </p>
          <div className="flex flex-wrap gap-2.5">
            {weakTopicObjects.map((t) => (
              <div
                key={t.id}
                className="flex items-center gap-2.5 px-3.5 py-1.5 rounded-full bg-[#12141e] border border-white/10 text-xs font-mono"
              >
                <span className="text-zinc-200">{t.title}</span>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => navigate('/study')}
                  className="h-6 px-2 text-[11px] font-mono text-emerald-400 hover:text-emerald-300 rounded-full hover:bg-white/5"
                >
                  Study <ArrowRight size={11} />
                </Button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Topics Breakdown */}
      <div className="p-6 md:p-8 rounded-3xl bg-[#12141e]/70 border border-white/10 backdrop-blur-md shadow-xl">
        <div className="flex items-center justify-between mb-6 border-b border-white/[0.08] pb-4">
          <h2 className="font-heading text-lg font-normal text-white">
            Module Performance Breakdown
          </h2>
          <span className="px-2.5 py-0.5 rounded-full bg-white/5 text-zinc-300 border border-white/10 text-xs font-mono">
            {topics.length} topics
          </span>
        </div>

        {topics.length === 0 ? (
          <div className="text-xs text-zinc-400 font-sans">No topics loaded.</div>
        ) : (
          <div className="flex flex-col divide-y divide-white/[0.06]">
            {topics.map((t) => {
              const best = getBestScore(t.id)
              const attempts = getAttemptsForTopic(t.id)
              const isWeak = weakTopics.includes(t.id)

              return (
                <div key={t.id} className="py-4 flex items-center justify-between gap-4">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2.5 mb-1">
                      <span className="font-heading font-normal text-sm md:text-base text-zinc-100 truncate">
                        {t.title}
                      </span>
                      {isWeak && (
                        <Badge variant="warning" className="text-[10px] font-mono">Review Priority</Badge>
                      )}
                    </div>
                    <div className="text-xs text-zinc-400 font-mono">
                      {attempts.length} diagnostic test{attempts.length !== 1 ? 's' : ''} completed
                    </div>
                  </div>

                  <div className="flex items-center gap-4 flex-shrink-0">
                    <div className="text-right">
                      <div className="text-sm font-bold font-mono text-zinc-200">
                        {best !== null ? `${best}%` : 'Unranked'}
                      </div>
                      <div className="text-[10px] text-zinc-400 uppercase tracking-wider font-mono">
                        Best Score
                      </div>
                    </div>

                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => navigate('/quiz')}
                      className="text-xs h-8 px-3 font-mono rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200"
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
