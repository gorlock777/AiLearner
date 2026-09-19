import type { Message } from './openrouter'

const JSON_SYSTEM_PROMPT = `You are a study assistant AI. You MUST respond ONLY with valid JSON that exactly matches the schema provided. No markdown, no explanation, no extra text — just the raw JSON object.`

// ─── Topic Extraction ──────────────────────────────────────────────────────

function getSmartSample(text: string, maxLen = 4500): string {
  if (text.length <= maxLen) return text
  const half = Math.floor(maxLen / 2)
  return `${text.slice(0, half)}\n\n[...middle content omitted for speed...]\n\n${text.slice(-half)}`
}

export function extractTopicsPrompt(text: string): Message[] {
  const sample = getSmartSample(text, 5000)
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
      "summary": "string (2 sentences)",
      "keyPoints": ["string", "string", "string"],
      "difficulty": "beginner | intermediate | advanced"
    }
  ]
}

Extract 4–6 core topics. Keep summaries concise.`,
    },
    {
      role: 'user',
      content: `Extract the main topics from these study notes:\n\n${sample}`,
    },
  ]
}

// ─── Flashcard Generation ──────────────────────────────────────────────────

export function generateFlashcardsPrompt(topic: string, text: string): Message[] {
  const sample = getSmartSample(text, 3500)
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "flashcards": [
    {
      "id": "string",
      "front": "string (concise question or concept)",
      "back": "string (clear answer)",
      "hint": "string (optional hint)",
      "sourceQuote": "string (verbatim quote from text)"
    }
  ]
}

Generate 5–7 high-yield active recall flashcards for this topic.`,
    },
    {
      role: 'user',
      content: `Generate flashcards for topic "${topic}" from these notes:\n\n${sample}`,
    },
  ]
}

// ─── Quiz Generation ───────────────────────────────────────────────────────

export function generateQuizPrompt(topic: string, text: string): Message[] {
  const sample = getSmartSample(text, 3500)
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "questions": [
    {
      "id": "q1",
      "question": "What is...?",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "correctIndex": 0,
      "explanation": "Why this answer is correct"
    }
  ]
}

Generate 4–5 multiple-choice questions for topic "${topic}". Ensure correctIndex is an integer 0, 1, 2, or 3.`,
    },
    {
      role: 'user',
      content: `Generate a practice quiz for topic "${topic}" from these notes:\n\n${sample}`,
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

// ─── Feynman Evaluation ────────────────────────────────────────────────────

export function feynmanEvalPrompt(
  topicTitle: string,
  topicSummary: string,
  userExplanation: string
): Message[] {
  return [
    {
      role: 'system',
      content: `${JSON_SYSTEM_PROMPT}

Schema:
{
  "score": number (0-100, how well the explanation demonstrates understanding),
  "strengths": ["string", "..."] (2-4 specific things the explanation got right),
  "gaps": ["string", "..."] (2-4 specific concepts that were missing, wrong, or vague),
  "modelExplanation": "string (a clear, concise 3-5 sentence explanation of the topic written for a curious non-expert)"
}

Be honest but encouraging. Score strictly — a score above 80 should require a genuinely solid explanation.`,
    },
    {
      role: 'user',
      content: `Topic: ${topicTitle}\n\nTopic summary (for reference): ${topicSummary}\n\nStudent's explanation:\n"${userExplanation}"\n\nEvaluate this explanation and return your assessment as JSON.`,
    },
  ]
}
