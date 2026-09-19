// Browser-side document parser for PDF, TXT, and MD files

export type SupportedFileType = 'pdf' | 'txt' | 'md' | 'unknown'

export function getFileType(file: File): SupportedFileType {
  const ext = file.name.split('.').pop()?.toLowerCase()
  if (file.type === 'application/pdf' || ext === 'pdf') return 'pdf'
  if (ext === 'md' || ext === 'markdown') return 'md'
  if (file.type === 'text/plain' || ext === 'txt') return 'txt'
  return 'unknown'
}

export async function parseFile(file: File): Promise<string> {
  const fileType = getFileType(file)

  switch (fileType) {
    case 'pdf':
      return parsePDF(file)
    case 'txt':
    case 'md':
      return parseText(file)
    default:
      throw new Error(`Unsupported file type: ${file.type || file.name.split('.').pop()}. Please upload a PDF, TXT, or MD file.`)
  }
}

async function parseText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve(e.target?.result as string ?? '')
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file, 'UTF-8')
  })
}

async function parsePDF(file: File): Promise<string> {
  const { GlobalWorkerOptions, getDocument } = await import('pdfjs-dist')

  // Use CDN worker to avoid bundling issues
  GlobalWorkerOptions.workerSrc = `https://unpkg.com/pdfjs-dist@${(await import('pdfjs-dist')).version}/build/pdf.worker.min.mjs`

  const arrayBuffer = await file.arrayBuffer()
  const pdf = await getDocument({ data: arrayBuffer }).promise

  const textParts: string[] = []
  const maxPages = Math.min(pdf.numPages, 50) // cap at 50 pages

  for (let i = 1; i <= maxPages; i++) {
    const page = await pdf.getPage(i)
    const content = await page.getTextContent()
    const pageText = content.items
      .map((item) => ('str' in item ? item.str : ''))
      .join(' ')
    textParts.push(pageText)
  }

  const fullText = textParts.join('\n\n').replace(/\s+/g, ' ').trim()

  if (!fullText) {
    throw new Error('Could not extract text from PDF. The file may be image-based (scanned). Please use a text-based PDF.')
  }

  return fullText
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n\n[... content truncated for processing ...]'
}

