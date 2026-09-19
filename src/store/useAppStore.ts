import { create } from 'zustand'
import { persist } from 'zustand/middleware'

// ─── Types ─────────────────────────────────────────────────────────────────

export interface Topic {
  id: string
  title: string
  summary: string
  keyPoints: string[]
  difficulty: 'beginner' | 'intermediate' | 'advanced'
  emoji?: string
}

export interface Flashcard {
  id: string
  front: string
  back: string
  hint: string
  sourceQuote?: string // exact sentence(s) from original doc this card was derived from
}

export interface FlashcardSet {
  topicId: string
  cards: Flashcard[]
  generatedAt: number
}

export interface QuizQuestion {
  id: string
  question: string
  options: string[]
  correctIndex: number
  explanation: string
}

export interface QuizSet {
  topicId: string
  questions: QuizQuestion[]
  generatedAt: number
}

export interface QuizAttempt {
  id: string
  topicId: string
  score: number // 0–100
  correctCount: number
  totalQuestions: number
  timestamp: number
  answers: number[] // selected index per question
}

export interface Document {
  id: string
  name: string
  size: number
  type: string
  text: string
  uploadedAt: number
  topics?: Topic[]
  flashcardSets?: FlashcardSet[]
  quizSets?: QuizSet[]
}

export interface DocumentSummary {
  title: string
  summary: string
  wordCount: number
  estimatedReadTime: string
}

// ─── Computed helpers ───────────────────────────────────────────────────────

function computeWeakTopics(attempts: QuizAttempt[], threshold = 60): string[] {
  const topicScores: Record<string, number[]> = {}
  for (const attempt of attempts) {
    if (!topicScores[attempt.topicId]) topicScores[attempt.topicId] = []
    topicScores[attempt.topicId].push(attempt.score)
  }
  return Object.entries(topicScores)
    .filter(([, scores]) => {
      const avg = scores.reduce((a, b) => a + b, 0) / scores.length
      return avg < threshold
    })
    .map(([topicId]) => topicId)
}

// ─── Store ─────────────────────────────────────────────────────────────────

interface AppState {
  // Documents
  documents: Document[]
  activeDocumentId: string | null
  documentSummary: DocumentSummary | null

  // AI-generated content
  topics: Topic[]
  flashcardSets: FlashcardSet[]
  quizSets: QuizSet[]

  // Quiz history & progress
  quizAttempts: QuizAttempt[]
  weakTopics: string[]

  // UI state
  isProcessing: boolean
  processingStep: string
  error: string | null

  // Actions — Documents
  addDocument: (doc: Document) => void
  removeDocument: (id: string) => void
  setActiveDocument: (id: string | null) => void
  setDocumentSummary: (summary: DocumentSummary | null) => void
  saveDocumentSession: (docId: string, topics: Topic[], fcSets: FlashcardSet[], qSets: QuizSet[]) => void
  loadDocumentSession: (docId: string) => boolean
  clearAll: () => void

  // Actions — AI content
  setTopics: (topics: Topic[]) => void
  addFlashcardSet: (set: FlashcardSet) => void
  addQuizSet: (set: QuizSet) => void
  getFlashcardsForTopic: (topicId: string) => Flashcard[]
  getQuizForTopic: (topicId: string) => QuizQuestion[]

  // Actions — Quiz progress
  recordQuizAttempt: (attempt: Omit<QuizAttempt, 'id'>) => void
  getAttemptsForTopic: (topicId: string) => QuizAttempt[]
  getBestScore: (topicId: string) => number | null

  // Actions — UI
  setProcessing: (isProcessing: boolean, step?: string) => void
  setError: (error: string | null) => void
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      // Initial state
      documents: [],
      activeDocumentId: null,
      documentSummary: null,
      topics: [],
      flashcardSets: [],
      quizSets: [],
      quizAttempts: [],
      weakTopics: [],
      isProcessing: false,
      processingStep: '',
      error: null,

      // Document actions
      addDocument: (doc) =>
        set((state) => ({
          documents: [...state.documents.filter((d) => d.id !== doc.id), doc],
        })),

      removeDocument: (id) =>
        set((state) => ({
          documents: state.documents.filter((d) => d.id !== id),
          activeDocumentId: state.activeDocumentId === id ? null : state.activeDocumentId,
        })),

      setActiveDocument: (id) => set({ activeDocumentId: id }),
      setDocumentSummary: (summary) => set({ documentSummary: summary }),

      saveDocumentSession: (docId, topics, fcSets, qSets) =>
        set((state) => ({
          documents: state.documents.map((d) =>
            d.id === docId
              ? { ...d, topics, flashcardSets: fcSets, quizSets: qSets }
              : d
          ),
        })),

      loadDocumentSession: (docId) => {
        const doc = get().documents.find((d) => d.id === docId)
        if (!doc || !doc.topics?.length) return false

        set({
          activeDocumentId: doc.id,
          topics: doc.topics,
          flashcardSets: doc.flashcardSets ?? [],
          quizSets: doc.quizSets ?? [],
        })
        return true
      },

      clearAll: () =>
        set({
          documents: [],
          activeDocumentId: null,
          documentSummary: null,
          topics: [],
          flashcardSets: [],
          quizSets: [],
          quizAttempts: [],
          weakTopics: [],
          error: null,
        }),

      // AI content actions
      setTopics: (topics) => set({ topics }),

      addFlashcardSet: (newSet) =>
        set((state) => ({
          flashcardSets: [
            ...state.flashcardSets.filter((s) => s.topicId !== newSet.topicId),
            newSet,
          ],
        })),

      addQuizSet: (newSet) =>
        set((state) => ({
          quizSets: [
            ...state.quizSets.filter((s) => s.topicId !== newSet.topicId),
            newSet,
          ],
        })),

      getFlashcardsForTopic: (topicId) => {
        const set = get().flashcardSets.find((s) => s.topicId === topicId)
        return set?.cards ?? []
      },

      getQuizForTopic: (topicId) => {
        const set = get().quizSets.find((s) => s.topicId === topicId)
        return set?.questions ?? []
      },

      // Quiz progress actions
      recordQuizAttempt: (attempt) => {
        const id = `attempt-${Date.now()}-${Math.random().toString(36).slice(2)}`
        const newAttempt = { ...attempt, id }
        set((state) => {
          const newAttempts = [...state.quizAttempts, newAttempt]
          return {
            quizAttempts: newAttempts,
            weakTopics: computeWeakTopics(newAttempts),
          }
        })
      },

      getAttemptsForTopic: (topicId) =>
        get().quizAttempts.filter((a) => a.topicId === topicId),

      getBestScore: (topicId) => {
        const attempts = get().quizAttempts.filter((a) => a.topicId === topicId)
        if (!attempts.length) return null
        return Math.max(...attempts.map((a) => a.score))
      },

      // UI actions
      setProcessing: (isProcessing, step = '') =>
        set({ isProcessing, processingStep: step }),

      setError: (error) => set({ error }),
    }),
    {
      name: 'ailearner-storage',
      // Don't persist UI state
      partialize: (state) => ({
        documents: state.documents,
        activeDocumentId: state.activeDocumentId,
        documentSummary: state.documentSummary,
        topics: state.topics,
        flashcardSets: state.flashcardSets,
        quizSets: state.quizSets,
        quizAttempts: state.quizAttempts,
        weakTopics: state.weakTopics,
      }),
    }
  )
)

