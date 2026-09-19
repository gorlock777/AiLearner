// OpenRouter API client
// Model: openrouter/free — auto-selects the best available free model

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const SITE_URL = 'https://ailearner.vercel.app'
const SITE_NAME = 'AiLearner'

export type ContentPart =
  | { type: 'text'; text: string }
  | { type: 'image_url'; image_url: { url: string } }

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string | ContentPart[]
}

export interface OpenRouterOptions {
  model?: string
  temperature?: number
  maxTokens?: number
}

export async function fetchCompletion(
  messages: Message[],
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.')
  }

  const response = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'HTTP-Referer': SITE_URL,
      'X-Title': SITE_NAME,
    },
    body: JSON.stringify({
      model: options.model ?? 'openrouter/free',
      messages,
      temperature: options.temperature ?? 0.3,
      max_tokens: options.maxTokens ?? 4096,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }))
    const msg = error?.error?.message ?? response.statusText
    if (response.status === 429) {
      throw new Error('Rate limit reached. Free models allow ~50 requests/day. Try again later.')
    }
    throw new Error(`OpenRouter error (${response.status}): ${msg}`)
  }

  const data = await response.json()
  return data.choices?.[0]?.message?.content ?? ''
}

export async function transcribeScannedImages(
  imageDataUrls: string[]
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured. Please set VITE_OPENROUTER_API_KEY in your .env file.')
  }

  const contentParts: ContentPart[] = [
    {
      type: 'text',
      text: 'You are an OCR and document transcription expert. Transcribe and summarize all the text, lecture slide contents, formulas, terms, and explanations from these scanned page images into clear, highly structured markdown study notes.',
    },
  ]

  for (const url of imageDataUrls) {
    contentParts.push({
      type: 'image_url',
      image_url: { url },
    })
  }

  const messages: Message[] = [
    {
      role: 'user',
      content: contentParts,
    },
  ]

  // Try free multimodal models in order
  const visionModels = [
    'google/gemini-2.0-flash-exp:free',
    'google/gemini-flash-1.5-8b:free',
    'meta-llama/llama-3.2-11b-vision-instruct:free',
    'openrouter/free',
  ]

  for (const model of visionModels) {
    try {
      const response = await fetch(OPENROUTER_API_URL, {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
          'HTTP-Referer': SITE_URL,
          'X-Title': SITE_NAME,
        },
        body: JSON.stringify({
          model,
          messages,
          temperature: 0.2,
          max_tokens: 4096,
        }),
      })

      if (response.ok) {
        const data = await response.json()
        const text = data.choices?.[0]?.message?.content ?? ''
        if (text && text.trim().length > 30) {
          return text.trim()
        }
      }
    } catch {
      // Try next vision fallback
    }
  }

  throw new Error('Unable to transcribe scanned PDF images. Please ensure the PDF is legible.')
}

/** Parse a JSON string from an LLM response, stripping markdown fences if present */
export function parseJSONResponse<T>(raw: string): T {
  const cleaned = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim()

  return JSON.parse(cleaned) as T
}
