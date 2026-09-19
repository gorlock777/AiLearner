import { type ClassValue, clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function formatDate(timestamp: number): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(new Date(timestamp))
}

export function formatRelativeDate(timestamp: number): string {
  const diff = Date.now() - timestamp
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return 'just now'
  if (minutes < 60) return `${minutes}m ago`
  if (hours < 24) return `${hours}h ago`
  if (days < 7) return `${days}d ago`
  return formatDate(timestamp)
}

export function scoreGrade(score: number): { grade: string; color: string; bg: string } {
  if (score >= 90) return { grade: 'A', color: '#10b981', bg: 'rgba(16,185,129,0.15)' }
  if (score >= 75) return { grade: 'B', color: '#6366f1', bg: 'rgba(99,102,241,0.15)' }
  if (score >= 60) return { grade: 'C', color: '#f59e0b', bg: 'rgba(245,158,11,0.15)' }
  return { grade: 'D', color: '#f43f5e', bg: 'rgba(244,63,94,0.15)' }
}

export function difficultyColor(difficulty: 'beginner' | 'intermediate' | 'advanced'): string {
  switch (difficulty) {
    case 'beginner': return '#10b981'
    case 'intermediate': return '#f59e0b'
    case 'advanced': return '#f43f5e'
  }
}

export function generateId(): string {
  return `${Date.now()}-${Math.random().toString(36).slice(2, 9)}`
}

export function computeStudyStreak(timestamps: number[]): number {
  if (!timestamps.length) return 0

  const days = [...new Set(
    timestamps.map(t => new Date(t).toDateString())
  )].sort().reverse()

  if (!days.length) return 0

  let streak = 0
  const today = new Date().toDateString()
  const yesterday = new Date(Date.now() - 86400000).toDateString()

  if (days[0] !== today && days[0] !== yesterday) return 0

  for (let i = 0; i < days.length; i++) {
    const expected = new Date(Date.now() - i * 86400000).toDateString()
    if (days[i] === expected) streak++
    else break
  }

  return streak
}

