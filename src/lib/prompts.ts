import type { Message } from './openrouter'

const JSON_SYSTEM_PROMPT = `You are a study assistant AI. You MUST respond ONLY with valid JSON that exactly matches the schema provided. No markdown, no explanation, no extra text — just the raw JSON object.`

// ─── Topic Extraction ──────────────────────────────────────────────────────

export function extractTopicsPrompt(text: string): Message[] {
  const truncated = text.slice(0, 12000) // keep within token limits
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "topics": [
    {
      "id": "string (slug, e.g. 'photosynthesis')",
      "title": "string",
      "summary": "string (2-3 sentences)",
      "keyPoints": ["string", "string", "string"],
      "difficulty": "beginner | intermediate | advanced"
    }
  ]
}

Extract 4–8 topics. Order from foundational to advanced.`,
    },
    {
      role: 'user',
      content: `Extract the main topics from these study notes:\n\n${truncated}`,
    },
  ]
}

// ─── Flashcard Generation ──────────────────────────────────────────────────

export function generateFlashcardsPrompt(topic: string, text: string): Message[] {
  const truncated = text.slice(0, 8000)
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "flashcards": [
    {
      "id": "string",
      "front": "string (concise question or term)",
      "back": "string (clear, complete answer or definition)",
      "hint": "string (optional hint, can be empty string)",
      "sourceQuote": "string (copy the exact sentence or two from the provided notes that this card was derived from — verbatim, not paraphrased)"
    }
  ]
}

Generate 8–12 flashcards. Mix definitions, concepts, and application questions. For sourceQuote, copy the most relevant 1-2 sentences from the input text verbatim.`,
    },
    {
      role: 'user',
      content: `Generate flashcards for the topic "${topic}" from these notes:\n\n${truncated}`,
    },
  ]
}

// ─── Quiz Generation ───────────────────────────────────────────────────────

export function generateQuizPrompt(topic: string, text: string): Message[] {
  const truncated = text.slice(0, 8000)
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "questions": [
    {
      "id": "string",
      "question": "string",
      "options": ["string", "string", "string", "string"],
      "correctIndex": 0,
      "explanation": "string (why the answer is correct)"
    }
  ]
}

Generate 5–8 multiple-choice questions. Vary difficulty. Make wrong answers plausible.`,
    },
    {
      role: 'user',
      content: `Generate a quiz for the topic "${topic}" from these notes:\n\n${truncated}`,
    },
  ]
}

// ─── Summary Generation ────────────────────────────────────────────────────

export function generateSummaryPrompt(text: string): Message[] {
  const truncated = text.slice(0, 10000)
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "title": "string (document title)",
  "summary": "string (3-4 sentence overview)",
  "wordCount": number,
  "estimatedReadTime": "string (e.g. '5 min')"
}`,
    },
    {
      role: 'user',
      content: `Summarize this document:\n\n${truncated}`,
    },
  ]
}

