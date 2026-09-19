import * as React from 'react'
import { useState, useCallback, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { UploadCloud, FileText, FileCode, File, CheckCircle2, X } from 'lucide-react'
import { cn } from '@/lib/utils'

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

function getFileIcon(name: string) {
  const ext = name.split('.').pop()?.toLowerCase()
  if (ext === 'pdf') return { icon: FileText, color: '#f87171', label: 'PDF' }
  if (ext === 'md')  return { icon: FileCode,  color: '#a78bfa', label: 'MD'  }
  return { icon: File, color: '#60a5fa', label: 'TXT' }
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
      const f = e.dataTransfer.files?.[0]
      if (f) onFileSelect(f)
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

  const fileInfo = selectedFile ? getFileIcon(selectedFile.name) : null

  return (
    <div className={cn('w-full', className)}>
      <input
        ref={fileInputRef}
        type="file"
        accept={accept.join(',')}
        className="hidden"
        onChange={(e) => {
          const f = e.target.files?.[0]
          if (f) onFileSelect(f)
        }}
      />

      {/* ── Outer wrapper: chase-border animation via SVG stroke on hover ── */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={() => !isProcessing && !selectedFile && fileInputRef.current?.click()}
        className={cn(
          'group relative overflow-hidden rounded-xl select-none transition-all duration-300',
          !selectedFile && !isProcessing && 'cursor-pointer'
        )}
      >
        {/* Animated border — SVG rect that traces the perimeter on hover/drag */}
        <svg
          className="pointer-events-none absolute inset-0 w-full h-full"
          style={{ borderRadius: '12px' }}
          aria-hidden="true"
        >
          <rect
            x="1" y="1"
            width="calc(100% - 2px)" height="calc(100% - 2px)"
            rx="11" ry="11"
            fill="none"
            strokeWidth="1.5"
            stroke={isDragging ? 'rgba(52,211,153,0.8)' : 'rgba(255,255,255,0.10)'}
            strokeDasharray="8 4"
            style={{
              transition: 'stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Animated chasing highlight on hover — pure CSS gradient sweep */}
        <motion.div
          className="pointer-events-none absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            background: isDragging
              ? 'radial-gradient(ellipse at 50% 0%, rgba(52,211,153,0.12) 0%, transparent 70%)'
              : 'radial-gradient(ellipse at 50% 0%, rgba(255,255,255,0.04) 0%, transparent 70%)',
          }}
        />

        {/* Inner content area */}
        <div
          className={cn(
            'relative p-6 rounded-xl border transition-all duration-300',
            isDragging
              ? 'border-emerald-400/60 bg-emerald-950/20 shadow-[0_0_32px_rgba(52,211,153,0.08)]'
              : selectedFile
              ? 'border-white/10 bg-zinc-950/60'
              : 'border-white/[0.07] bg-zinc-950/40 group-hover:border-white/20 group-hover:bg-zinc-900/40'
          )}
        >
          <AnimatePresence mode="wait">

            {/* ── G: File preview chip ── */}
            {selectedFile && fileInfo ? (
              <motion.div
                key="file-ready"
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -4 }}
                transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
                className="flex items-center justify-between gap-4"
              >
                <div className="flex items-center gap-3 min-w-0">
                  {/* Icon chip */}
                  <div
                    className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 border"
                    style={{
                      background: `${fileInfo.color}18`,
                      borderColor: `${fileInfo.color}40`,
                    }}
                  >
                    <fileInfo.icon size={18} style={{ color: fileInfo.color }} />
                  </div>

                  {/* File name + meta */}
                  <div className="min-w-0">
                    <div className="text-xs font-semibold text-zinc-100 font-mono truncate leading-none mb-1">
                      {selectedFile.name}
                    </div>
                    <div className="flex items-center gap-2 text-[11px] font-mono text-zinc-500">
                      {/* Type pill */}
                      <span
                        className="px-1.5 py-0.5 rounded-md border text-[9px] font-bold uppercase tracking-wide"
                        style={{ color: fileInfo.color, borderColor: `${fileInfo.color}40`, background: `${fileInfo.color}12` }}
                      >
                        {fileInfo.label}
                      </span>
                      <span>{formatBytes(selectedFile.size)}</span>
                      <span>·</span>
                      <span className="text-emerald-400 flex items-center gap-1">
                        <CheckCircle2 size={10} />
                        Ready
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
                    className="rounded-lg p-1.5 text-zinc-500 hover:bg-zinc-800 hover:text-zinc-200 transition-colors flex-shrink-0"
                    title="Remove file"
                  >
                    <X size={14} />
                  </button>
                )}
              </motion.div>
            ) : (

              /* ── Empty drop state ── */
              <motion.div
                key="empty-drop"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="flex flex-col items-center justify-center text-center py-2"
              >
                {/* Upload icon with drag glow */}
                <motion.div
                  animate={isDragging ? { scale: 1.1 } : { scale: 1 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 20 }}
                  className={cn(
                    'w-11 h-11 rounded-xl border flex items-center justify-center mb-3 transition-all duration-300',
                    isDragging
                      ? 'border-emerald-400/60 bg-emerald-900/30 text-emerald-300 shadow-[0_0_20px_rgba(52,211,153,0.15)]'
                      : 'border-zinc-800 bg-zinc-900 text-zinc-400 group-hover:border-zinc-600 group-hover:text-zinc-300'
                  )}
                >
                  <UploadCloud size={20} />
                </motion.div>

                <div className="text-xs font-medium text-zinc-200 mb-1">
                  {isDragging ? 'Drop it!' : 'Drop your lecture notes or slides, or click to browse'}
                </div>
                <div className="text-[11px] text-zinc-500 mb-3">
                  Digital PDF, scanned slides, Markdown (.md), plain text (.txt)
                </div>

                <div className="flex items-center gap-1.5">
                  {[
                    { label: 'PDF', color: '#f87171' },
                    { label: 'TXT', color: '#60a5fa' },
                    { label: 'MD',  color: '#a78bfa' },
                  ].map((t) => (
                    <span
                      key={t.label}
                      className="text-[10px] font-mono px-2 py-0.5 rounded-full border font-medium"
                      style={{ color: t.color, borderColor: `${t.color}40`, background: `${t.color}12` }}
                    >
                      {t.label}
                    </span>
                  ))}
                  <span className="text-[10px] text-zinc-600 font-mono ml-1">· Vision OCR</span>
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </div>
      </div>
    </div>
  )
}
