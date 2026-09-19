// OpenRouter API client
// Model: openrouter/free — auto-selects the best available free model

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const SITE_URL = 'https://ailearner.vercel.app'
const SITE_NAME = 'AiLearner'

export interface Message {
  role: 'system' | 'user' | 'assistant'
  content: string
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

export async function fetchCompletionStream(
  messages: Message[],
  onChunk: (chunk: string) => void,
  options: OpenRouterOptions = {}
): Promise<string> {
  const apiKey = import.meta.env.VITE_OPENROUTER_API_KEY
  if (!apiKey || apiKey === 'your-openrouter-api-key-here') {
    throw new Error('OpenRouter API key not configured.')
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
      stream: true,
    }),
  })

  if (!response.ok) {
    const error = await response.json().catch(() => ({ error: { message: response.statusText } }))
    throw new Error(`OpenRouter error (${response.status}): ${error?.error?.message ?? response.statusText}`)
  }

  const reader = response.body?.getReader()
  const decoder = new TextDecoder()
  let fullText = ''

  if (!reader) throw new Error('No response body')

  while (true) {
    const { done, value } = await reader.read()
    if (done) break

    const chunk = decoder.decode(value)
    const lines = chunk.split('\n').filter(line => line.startsWith('data: '))

    for (const line of lines) {
      const data = line.slice(6)
      if (data === '[DONE]') continue
      try {
        const parsed = JSON.parse(data)
        const content = parsed.choices?.[0]?.delta?.content ?? ''
        if (content) {
          fullText += content
          onChunk(content)
        }
      } catch {
        // skip malformed SSE chunks
      }
    }
  }

  return fullText
}

/** Parse a JSON string from an LLM response, stripping markdown fences if present */
export function parseJSONResponse<T>(raw: string): T {
  // Strip markdown code fences
  const cleaned = raw
    .replace(/^```(?:json)?\s*/im, '')
    .replace(/\s*```\s*$/im, '')
    .trim()

  return JSON.parse(cleaned) as T
}

