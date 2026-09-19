// Browser-side document parser for PDF, TXT, and MD files
import { transcribeScannedImages } from './openrouter'

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
      throw new Error(
        `Unsupported file type: ${file.type || file.name.split('.').pop()}. Please upload a PDF, TXT, or MD file.`
      )
  }
}

async function parseText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = (e) => resolve((e.target?.result as string) ?? '')
    reader.onerror = () => reject(new Error('Failed to read file'))
    reader.readAsText(file, 'UTF-8')
  })
}

async function renderPageToJpeg(page: any): Promise<string> {
  const viewport = page.getViewport({ scale: 1.2 })
  const canvas = document.createElement('canvas')
  const context = canvas.getContext('2d')
  if (!context) throw new Error('Could not create canvas context for OCR')

  canvas.height = viewport.height
  canvas.width = viewport.width

  // Render white background
  context.fillStyle = '#FFFFFF'
  context.fillRect(0, 0, canvas.width, canvas.height)

  await page.render({
    canvasContext: context,
    viewport,
  }).promise

  return canvas.toDataURL('image/jpeg', 0.8)
}

async function parsePDF(file: File): Promise<string> {
  try {
    const importDynamic = new Function('url', 'return import(url)')
    const pdfjsLib: any = await importDynamic(
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.min.mjs'
    )

    pdfjsLib.GlobalWorkerOptions.workerSrc =
      'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/4.10.38/pdf.worker.min.mjs'

    const arrayBuffer = await file.arrayBuffer()
    const loadingTask = pdfjsLib.getDocument({
      data: new Uint8Array(arrayBuffer),
      useSystemFonts: true,
    })
    const pdf = await loadingTask.promise

    const textParts: string[] = []
    const maxPages = Math.min(pdf.numPages, 50)

    // Phase 1: Try native PDF text extraction
    for (let i = 1; i <= maxPages; i++) {
      const page = await pdf.getPage(i)
      const content = await page.getTextContent()
      const pageText = content.items
        .map((item: any) => ('str' in item ? item.str : ''))
        .join(' ')
      if (pageText.trim()) {
        textParts.push(pageText.trim())
      }
    }

    let fullText = textParts.join('\n\n').replace(/\s+/g, ' ').trim()

    // Phase 2: If scanned/image PDF with insufficient text, perform AI Vision OCR
    if (!fullText || fullText.length < 50) {
      const ocrPages = Math.min(pdf.numPages, 6)
      const pageImages: string[] = []

      for (let i = 1; i <= ocrPages; i++) {
        const page = await pdf.getPage(i)
        const dataUrl = await renderPageToJpeg(page)
        pageImages.push(dataUrl)
      }

      if (pageImages.length > 0) {
        fullText = await transcribeScannedImages(pageImages)
      }
    }

    if (!fullText || fullText.trim().length < 10) {
      throw new Error(
        'Could not extract text from PDF. The document appears empty or unreadable.'
      )
    }

    return fullText
  } catch (err: any) {
    console.error('PDF parsing error:', err)
    throw new Error(
      err?.message ||
        'Failed to parse PDF. Please ensure the file contains readable notes or convert to TXT/Markdown.'
    )
  }
}

export function estimateTokens(text: string): number {
  return Math.ceil(text.length / 4)
}

export function truncateToTokens(text: string, maxTokens: number): string {
  const maxChars = maxTokens * 4
  if (text.length <= maxChars) return text
  return text.slice(0, maxChars) + '\n\n[... content truncated for processing ...]'
}
