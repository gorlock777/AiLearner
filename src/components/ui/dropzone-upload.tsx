import * as React from 'react'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'

export interface DropzoneUploadProps {
  onFileSelect: (file: File) => void
  onFileRemove?: () => void
  selectedFile?: File | null
  accept?: string[]
  isProcessing?: boolean
  className?: string
}

function formatBytes(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

export function DropzoneUpload({
  onFileSelect,
  onFileRemove,
  selectedFile,
  accept = ['.pdf', '.txt', '.md'],
  isProcessing = false,
  className,
}: DropzoneUploadProps) {
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleDrop = useCallback(
    (e: React.DragEvent<HTMLDivElement>) => {
      e.preventDefault()
      setIsDragging(false)
      const file = e.dataTransfer.files?.[0]
      if (file) {
        onFileSelect(file)
      }
    },
    [onFileSelect]
  )

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) onFileSelect(file)
        }}
      />

      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'relative overflow-hidden rounded-lg border transition-all duration-200 select-none p-6',
          isDragging
            ? 'border-zinc-400 bg-zinc-900/80 shadow-lg'
            : selectedFile
            ? 'border-zinc-700 bg-zinc-950/60'
            : 'border-zinc-800/90 bg-zinc-950/40 hover:border-zinc-700 hover:bg-zinc-900/40 cursor-pointer'
        )}
      >
        <AnimatePresence mode="wait">
          {selectedFile ? (
            <motion.div
              key="file-ready"
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="flex items-center justify-between gap-4"
            >
              <div className="flex items-center gap-3 min-w-0">
                <div className="w-9 h-9 rounded bg-zinc-900 border border-zinc-700/80 flex items-center justify-center text-zinc-200 flex-shrink-0">
                  <FileText size={18} />
                </div>
                <div className="min-w-0">
                  <div className="text-xs font-semibold text-zinc-100 font-mono truncate">
                    {selectedFile.name}
                  </div>
                  <div className="text-[11px] text-zinc-400 font-mono mt-0.5 flex items-center gap-2">
                    <span>{formatBytes(selectedFile.size)}</span>
                    <span>·</span>
                    <span className="text-emerald-400 flex items-center gap-1">
                      <CheckCircle2 size={11} /> Ready
                    </span>
                  </div>
                </div>
              </div>

              {!isProcessing && onFileRemove && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    onFileRemove()
                  }}
                  className="rounded p-1 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
                  title="Remove file"
                >
                  <X size={15} />
                </button>
              )}
            </motion.div>
          ) : (
            <motion.div
              key="empty-drop"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center text-center py-2"
            >
              <div
                className={cn(
                  'w-10 h-10 rounded-md border flex items-center justify-center mb-3 transition-colors',
                  isDragging
                    ? 'border-zinc-400 bg-zinc-800 text-zinc-100'
                    : 'border-zinc-800 bg-zinc-900 text-zinc-400'
                )}
              >
                <UploadCloud size={20} />
              </div>

              <div className="text-xs font-medium text-zinc-200 mb-1">
                Drop your lecture notes or slides here, or click to browse
              </div>
              <div className="text-[11px] text-zinc-400 mb-3">
                Digital PDF, scanned slides, Markdown (.md), and plain text (.txt)
              </div>

              <div className="flex items-center gap-1.5">
                <Badge variant="secondary">PDF</Badge>
                <Badge variant="secondary">TXT</Badge>
                <Badge variant="secondary">MD</Badge>
                <span className="text-[10px] text-zinc-400 font-mono ml-1">
                  · Vision OCR enabled
                </span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}

