import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
  LayoutGrid,
  ListTree,
  Table as TableIcon,
  Activity,
  FileSearch,
  BookOpen,
  Sparkles,
} from 'lucide-react'
import { motion } from 'framer-motion'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { ShimmerButton } from '@/components/ui/shimmer-button'
import { GaugeMeter } from '@/components/ui/gauge-meter'
import {
  Table,
  TableHeader,
  TableBody,
  TableRow,
  TableHead,
  TableCell,
} from '@/components/ui/table'
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from '@/components/ui/accordion'
import { DocumentInspectorDialog } from './DocumentInspectorDialog'
import type { Topic } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'

interface ExtractionDataViewProps {
  topics: Topic[]
}

export function ExtractionDataView({ topics }: ExtractionDataViewProps) {
  const navigate = useNavigate()
  const { documents, flashcardSets, quizSets, getBestScore } = useAppStore()
  const [inspectorOpen, setInspectorOpen] = useState(false)

  const activeDoc = documents[0]
  const totalCards = flashcardSets.reduce((sum, s) => sum + s.cards.length, 0)
  const totalQuestions = quizSets.reduce((sum, s) => sum + s.questions.length, 0)

  const getDifficultyVariant = (diff: Topic['difficulty']) => {
    switch (diff) {
      case 'beginner':
        return 'success'
      case 'intermediate':
        return 'warning'
      case 'advanced':
        return 'destructive'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="w-full linear-card flex flex-col">
      {/* ── Top Header Toolbar ── */}
      <div className="border-b border-zinc-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700 text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2 font-mono">
              <span>EXTRACTED KNOWLEDGE MATRIX</span>
              <Badge variant="secondary">
                {topics.length} topics
              </Badge>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5 font-mono">
              {activeDoc?.name ? `${activeDoc.name} · ` : ''}
              {totalCards} cards · {totalQuestions} quiz items synthesized
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInspectorOpen(true)}
            className="text-xs font-mono h-7 px-2.5"
          >
            <FileSearch size={12} className="text-zinc-400" />
            <span>Inspect Doc</span>
          </Button>

          <ShimmerButton
            onClick={() => navigate('/study')}
            className="text-xs h-7 px-3"
          >
            <Layers size={12} />
            <span>Study All</span>
            <ArrowRight size={11} />
          </ShimmerButton>
        </div>
      </div>

      {/* ── Content Tabs ── */}
      <div className="p-4">
        <Tabs defaultValue="matrix">
          <div className="flex items-center justify-between mb-4">
            <TabsList className="bg-zinc-900 border border-zinc-800 rounded">
              <TabsTrigger value="matrix" className="text-xs font-mono gap-1.5">
                <LayoutGrid size={12} /> Matrix
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="text-xs font-mono gap-1.5">
                <ListTree size={12} /> Hierarchy
              </TabsTrigger>
              <TabsTrigger value="table" className="text-xs font-mono gap-1.5">
                <TableIcon size={12} /> Table
              </TabsTrigger>
              <TabsTrigger value="telemetry" className="text-xs font-mono gap-1.5">
                <Activity size={12} /> Telemetry
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Interactive Knowledge Matrix (Topic Cards with mini dials) */}
          <TabsContent value="matrix" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {topics.map((topic, idx) => {
                const topicCards = flashcardSets.find((s) => s.topicId === topic.id)?.cards.length ?? 0
                const topicQuestions = quizSets.find((s) => s.topicId === topic.id)?.questions.length ?? 0
                const bestScore = getBestScore(topic.id)

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: idx * 0.04 }}
                    className="p-4 rounded-lg bg-zinc-900/40 border border-zinc-800/90 hover:border-zinc-700/90 transition-all flex flex-col justify-between group shadow-sm hover:shadow-md"
                  >
                    <div>
                      {/* Topic Card Top Bar */}
                      <div className="flex items-start justify-between gap-3 mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-medium bg-zinc-950 text-zinc-400 border border-zinc-800">
                            0{idx + 1}
                          </span>
                          <h3 className="font-heading text-xs font-semibold text-zinc-100 group-hover:text-white transition-colors">
                            {topic.title}
                          </h3>
                        </div>

                        <Badge variant={getDifficultyVariant(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>

                      {/* Summary */}
                      <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed mb-3">
                        {topic.summary}
                      </p>

                      {/* Concept Chips */}
                      {topic.keyPoints && topic.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-1.5 mb-4">
                          {topic.keyPoints.slice(0, 3).map((kp, kIdx) => (
                            <span
                              key={kIdx}
                              className="px-2 py-0.5 rounded bg-zinc-950/80 border border-zinc-800/80 text-[10px] font-mono text-zinc-300 truncate max-w-[200px]"
                              title={kp}
                            >
                              {kp}
                            </span>
                          ))}
                          {topic.keyPoints.length > 3 && (
                            <span className="px-1.5 py-0.5 rounded bg-zinc-950/40 text-[10px] font-mono text-zinc-500">
                              +{topic.keyPoints.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer & Action Buttons */}
                    <div className="pt-3 border-t border-zinc-800/70 flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {bestScore !== null ? (
                          <div className="flex items-center gap-1.5">
                            <GaugeMeter
                              value={bestScore}
                              size={28}
                              strokeWidth={3}
                              label=""
                            />
                            <span className="text-[10px] font-mono text-zinc-400">
                              {bestScore}% best
                            </span>
                          </div>
                        ) : (
                          <span className="text-[10px] font-mono text-zinc-500">
                            {topicCards} cards · {topicQuestions} Qs
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-1.5">
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate('/study')}
                          className="h-6 px-2 text-[11px] font-mono text-zinc-300"
                        >
                          <Layers size={10} />
                          Cards
                        </Button>
                        <Button
                          variant="secondary"
                          size="sm"
                          onClick={() => navigate('/quiz')}
                          className="h-6 px-2 text-[11px] font-mono text-zinc-300"
                        >
                          <Zap size={10} />
                          Quiz
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                )
              })}
            </div>
          </TabsContent>

          {/* TAB 2: Accordion Hierarchy */}
          <TabsContent value="hierarchy" className="mt-0">
            <Accordion type="single" defaultValue={topics[0]?.id}>
              {topics.map((topic, idx) => {
                const topicCards = flashcardSets.find((s) => s.topicId === topic.id)?.cards.length ?? 0
                const topicQuestions = quizSets.find((s) => s.topicId === topic.id)?.questions.length ?? 0

                return (
                  <AccordionItem key={topic.id} value={topic.id} className="border-zinc-800/80">
                    <AccordionTrigger className="hover:no-underline py-3">
                      <div className="flex items-center gap-2.5 text-left">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                          0{idx + 1}
                        </span>
                        <span className="font-heading font-medium text-zinc-200 text-xs">{topic.title}</span>
                        <Badge variant={getDifficultyVariant(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-1 pb-3 text-xs">
                      <p className="text-zinc-400 mb-3 leading-relaxed">
                        {topic.summary}
                      </p>

                      {topic.keyPoints?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1.5 font-mono">
                            Core Concepts:
                          </span>
                          <ul className="flex flex-col gap-1 pl-1">
                            {topic.keyPoints.map((kp, kIdx) => (
                              <li key={kIdx} className="flex items-start gap-2 text-zinc-300">
                                <span className="text-zinc-500 font-mono text-[10px]">-</span>
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-3 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80 font-mono">
                        <span>{topicCards} flashcards</span>
                        <span>·</span>
                        <span>{topicQuestions} questions</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>

          {/* TAB 3: Clean Data Table */}
          <TabsContent value="table" className="mt-0">
            <div className="rounded border border-zinc-800 overflow-hidden bg-zinc-950/30">
              <Table>
                <TableHeader>
                  <TableRow className="border-zinc-800 bg-zinc-900/60">
                    <TableHead className="text-zinc-400 font-mono text-[11px]">TOPIC</TableHead>
                    <TableHead className="text-zinc-400 font-mono text-[11px]">DIFFICULTY</TableHead>
                    <TableHead className="text-zinc-400 font-mono text-[11px]">CONCEPTS</TableHead>
                    <TableHead className="text-right text-zinc-400 font-mono text-[11px]">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((t) => (
                    <TableRow key={t.id} className="border-zinc-800/60 hover:bg-zinc-850/40 text-xs">
                      <TableCell className="font-medium text-zinc-200 font-heading">
                        {t.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDifficultyVariant(t.difficulty)}>
                          {t.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono text-[11px]">
                        {t.keyPoints?.length ?? 0} concepts
                      </TableCell>
                      <TableCell className="text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/study')}
                          className="h-6 px-2 text-xs font-mono text-zinc-300 hover:text-white"
                        >
                          Study <ArrowRight size={11} />
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB 4: Telemetry Overview */}
          <TabsContent value="telemetry" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-zinc-100 mb-0.5">{topics.length}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Total Modules</div>
              </div>
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-emerald-400 mb-0.5">{totalCards}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Flashcards Vault</div>
              </div>
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-blue-400 mb-0.5">{totalQuestions}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Quiz Questions</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* ── Document Inspector Drawer Modal ── */}
      <DocumentInspectorDialog
        open={inspectorOpen}
        onOpenChange={setInspectorOpen}
        document={activeDoc}
        topics={topics}
      />
    </div>
  )
}

export default ExtractionDataView
