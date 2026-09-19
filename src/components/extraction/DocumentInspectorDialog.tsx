import { useState, useMemo } from 'react'
import {
  FileText,
  Copy,
  Check,
  Search,
  BookOpen,
  Cpu,
  Clock,
  Layers,
  Sparkles,
  ExternalLink,
} from 'lucide-react'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import type { Topic, Document } from '@/store/useAppStore'

interface DocumentInspectorDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  document?: Document | null
  topics: Topic[]
}

export function DocumentInspectorDialog({
  open,
  onOpenChange,
  document,
  topics,
}: DocumentInspectorDialogProps) {
  const [copied, setCopied] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')

  const text = document?.text ?? ''

  const stats = useMemo(() => {
    if (!text) return { words: 0, chars: 0, readingMin: 0, estimatedTokens: 0 }
    const words = text.trim() ? text.trim().split(/\s+/).length : 0
    const chars = text.length
    const readingMin = Math.max(1, Math.ceil(words / 200))
    const estimatedTokens = Math.round(words * 1.33)
    return { words, chars, readingMin, estimatedTokens }
  }, [text])

  const handleCopy = () => {
    if (!text) return
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  const filteredText = useMemo(() => {
    if (!searchTerm.trim()) return text
    const lines = text.split('\n')
    const matching = lines.filter((l) =>
      l.toLowerCase().includes(searchTerm.toLowerCase())
    )
    return matching.join('\n')
  }, [text, searchTerm])

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[85vh] flex flex-col p-6 overflow-hidden bg-[#0f0f12] border-zinc-800 text-zinc-100">
        <DialogHeader className="border-b border-zinc-800/80 pb-3 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded bg-zinc-900 border border-zinc-700 flex items-center justify-center text-emerald-400">
                <FileText size={16} />
              </div>
              <div>
                <DialogTitle className="text-sm font-semibold text-zinc-100 font-mono flex items-center gap-2">
                  {document?.name ?? 'Parsed Document Telemetry'}
                  <Badge variant="secondary" className="font-mono text-[10px]">
                    {document?.type?.toUpperCase() ?? 'DOC'}
                  </Badge>
                </DialogTitle>
                <DialogDescription className="text-xs text-zinc-400 mt-0.5">
                  Extracted text layer, OCR transcription stream, and token metrics.
                </DialogDescription>
              </div>
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={handleCopy}
              className="text-xs font-mono h-7 px-2.5"
            >
              {copied ? (
                <>
                  <Check size={12} className="text-emerald-400" />
                  <span>Copied</span>
                </>
              ) : (
                <>
                  <Copy size={12} />
                  <span>Copy Text</span>
                </>
              )}
            </Button>
          </div>
        </DialogHeader>

        {/* Telemetry KPI Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 py-3 border-b border-zinc-800/80 flex-shrink-0">
          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xs font-bold font-mono text-zinc-200">
              {stats.words.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <BookOpen size={10} /> Words
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xs font-bold font-mono text-emerald-400">
              ~{stats.estimatedTokens.toLocaleString()}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <Cpu size={10} /> LLM Tokens
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xs font-bold font-mono text-amber-400">
              {stats.readingMin} min
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <Clock size={10} /> Read Time
            </div>
          </div>

          <div className="p-2.5 rounded bg-zinc-900/60 border border-zinc-800 text-center">
            <div className="text-xs font-bold font-mono text-blue-400">
              {topics.length}
            </div>
            <div className="text-[10px] text-zinc-400 font-mono flex items-center justify-center gap-1 mt-0.5">
              <Layers size={10} /> Modules
            </div>
          </div>
        </div>

        {/* Search & Text Layer Box */}
        <div className="flex flex-col flex-1 min-h-0 pt-3 gap-2">
          <div className="relative flex items-center flex-shrink-0">
            <Search size={13} className="absolute left-2.5 text-zinc-500 pointer-events-none" />
            <Input
              placeholder="Search extracted text layer..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 h-8 text-xs font-mono bg-zinc-900/80 border-zinc-800"
            />
          </div>

          <div className="flex-1 overflow-y-auto rounded border border-zinc-800 bg-zinc-950/80 p-3 font-mono text-[11px] leading-relaxed text-zinc-300 select-text scrollbar-thin">
            {filteredText ? (
              <pre className="whitespace-pre-wrap font-mono">{filteredText}</pre>
            ) : (
              <div className="text-zinc-500 text-center py-8">
                {searchTerm ? 'No matching text found.' : 'No parsed document content available.'}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default DocumentInspectorDialog

