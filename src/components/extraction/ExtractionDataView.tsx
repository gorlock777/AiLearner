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
  BarChart3,
  FileSearch,
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
    <div className="w-full flex flex-col gap-6">
      {/* ── Top Header Toolbar ── */}
      <div className="p-6 md:p-8 rounded-2xl bg-[#12141e]/70 border border-white/[0.08] backdrop-blur-md shadow-2xl flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 shrink-0">
            <CheckCircle2 size={20} />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h2 className="font-heading font-normal text-xl sm:text-2xl text-white tracking-tight">
                Extracted Knowledge Matrix
              </h2>
              <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-[11px] font-mono font-medium">
                {topics.length} topics
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-1 font-sans">
              {activeDoc?.name ? `${activeDoc.name} · ` : ''}
              {totalCards} active flashcards &middot; {totalQuestions} diagnostic questions synthesized
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setInspectorOpen(true)}
            className="text-xs font-mono h-9 px-3.5 rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-300 hover:text-white"
          >
            <FileSearch size={13} className="text-zinc-400" />
            <span>Inspect Doc</span>
          </Button>

          <ShimmerButton
            onClick={() => navigate('/study')}
            className="text-xs font-mono h-9 px-5 rounded-full"
          >
            <Layers size={13} />
            <span>Study All Decks</span>
            <ArrowRight size={12} />
          </ShimmerButton>
        </div>
      </div>

      {/* ── Content Tabs ── */}
      <div>
        <Tabs defaultValue="matrix">
          <div className="flex items-center justify-between mb-6">
            <TabsList className="bg-zinc-900/80 border border-white/10 p-1 rounded-full backdrop-blur-md">
              <TabsTrigger value="matrix" className="text-xs font-mono gap-2 rounded-full px-4 py-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <LayoutGrid size={13} /> Matrix
              </TabsTrigger>
              <TabsTrigger value="hierarchy" className="text-xs font-mono gap-2 rounded-full px-4 py-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <ListTree size={13} /> Hierarchy
              </TabsTrigger>
              <TabsTrigger value="table" className="text-xs font-mono gap-2 rounded-full px-4 py-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <TableIcon size={13} /> Table
              </TabsTrigger>
              <TabsTrigger value="overview" className="text-xs font-mono gap-2 rounded-full px-4 py-1.5 data-[state=active]:bg-white/10 data-[state=active]:text-white">
                <BarChart3 size={13} /> Overview
              </TabsTrigger>
            </TabsList>
          </div>

          {/* TAB 1: Interactive Knowledge Matrix (Spacious Merriweather Cards) */}
          <TabsContent value="matrix" className="mt-0">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {topics.map((topic, idx) => {
                const topicCards = flashcardSets.find((s) => s.topicId === topic.id)?.cards.length ?? 0
                const topicQuestions = quizSets.find((s) => s.topicId === topic.id)?.questions.length ?? 0
                const bestScore = getBestScore(topic.id)

                return (
                  <motion.div
                    key={topic.id}
                    initial={{ opacity: 0, y: 12 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.25, delay: idx * 0.05 }}
                    className="p-6 md:p-7 rounded-2xl bg-[#12141e]/60 border border-white/[0.08] hover:border-white/20 transition-all duration-300 flex flex-col justify-between group shadow-lg hover:shadow-2xl backdrop-blur-md"
                  >
                    <div>
                      {/* Topic Card Top Bar */}
                      <div className="flex items-start justify-between gap-4 mb-3.5">
                        <div className="flex items-center gap-3">
                          <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-semibold bg-white/5 text-zinc-400 border border-white/10 shrink-0">
                            0{idx + 1}
                          </span>
                          <h3 className="font-heading font-normal text-base md:text-lg text-white group-hover:text-emerald-300 transition-colors leading-snug">
                            {topic.title}
                          </h3>
                        </div>

                        <Badge variant={getDifficultyVariant(topic.difficulty)} className="text-[10px] font-mono shrink-0 uppercase tracking-wider">
                          {topic.difficulty}
                        </Badge>
                      </div>

                      {/* Summary */}
                      <p className="text-xs text-zinc-400 font-sans leading-relaxed mb-5">
                        {topic.summary}
                      </p>

                      {/* Concept Chips */}
                      {topic.keyPoints && topic.keyPoints.length > 0 && (
                        <div className="flex flex-wrap gap-2 mb-6">
                          {topic.keyPoints.slice(0, 3).map((kp, kIdx) => (
                            <span
                              key={kIdx}
                              className="px-3 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] font-mono text-zinc-300 truncate max-w-[220px]"
                              title={kp}
                            >
                              {kp}
                            </span>
                          ))}
                          {topic.keyPoints.length > 3 && (
                            <span className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-mono text-zinc-500 border border-white/5">
                              +{topic.keyPoints.length - 3} more
                            </span>
                          )}
                        </div>
                      )}
                    </div>

                    {/* Card Footer & Action Buttons */}
                    <div className="pt-4 border-t border-white/[0.08] flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-2">
                        {bestScore !== null ? (
                          <div className="flex items-center gap-2">
                            <GaugeMeter
                              value={bestScore}
                              size={30}
                              strokeWidth={3}
                              label=""
                            />
                            <span className="text-xs font-mono text-zinc-300 font-medium">
                              {bestScore}% recall
                            </span>
                          </div>
                        ) : (
                          <span className="text-xs font-mono text-zinc-500">
                            {topicCards} cards &middot; {topicQuestions} Qs
                          </span>
                        )}
                      </div>

                      <div className="flex items-center gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/study')}
                          className="h-8 px-3 text-xs font-mono rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200"
                        >
                          <Layers size={12} />
                          Cards
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => navigate('/quiz')}
                          className="h-8 px-3 text-xs font-mono rounded-full border-white/10 bg-white/5 hover:bg-white/10 text-zinc-200"
                        >
                          <Zap size={12} />
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
            <Accordion type="single" defaultValue={topics[0]?.id} className="flex flex-col gap-3">
              {topics.map((topic, idx) => {
                const topicCards = flashcardSets.find((s) => s.topicId === topic.id)?.cards.length ?? 0
                const topicQuestions = quizSets.find((s) => s.topicId === topic.id)?.questions.length ?? 0

                return (
                  <AccordionItem
                    key={topic.id}
                    value={topic.id}
                    className="border border-white/[0.08] rounded-2xl bg-[#12141e]/60 backdrop-blur-md px-6 overflow-hidden shadow-sm"
                  >
                    <AccordionTrigger className="hover:no-underline py-4">
                      <div className="flex items-center gap-3 text-left">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-mono font-medium bg-white/5 text-zinc-400 border border-white/10">
                          0{idx + 1}
                        </span>
                        <span className="font-heading font-normal text-sm md:text-base text-white">{topic.title}</span>
                        <Badge variant={getDifficultyVariant(topic.difficulty)} className="text-[10px] font-mono">
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent className="pt-2 pb-5 text-xs font-sans">
                      <p className="text-zinc-400 mb-4 leading-relaxed text-sm">
                        {topic.summary}
                      </p>

                      {topic.keyPoints?.length > 0 && (
                        <div className="mb-4">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-2 font-mono">
                            Core Knowledge Concept Topology:
                          </span>
                          <ul className="flex flex-col gap-2 pl-1">
                            {topic.keyPoints.map((kp, kIdx) => (
                              <li key={kIdx} className="flex items-start gap-2.5 text-zinc-300 text-xs font-mono">
                                <span className="text-emerald-400 font-bold">&bull;</span>
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-xs text-zinc-400 pt-3 border-t border-white/[0.08] font-mono">
                        <span>{topicCards} flashcards synthesized</span>
                        <span>&middot;</span>
                        <span>{topicQuestions} practice questions</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>

          {/* TAB 3: Clean Data Table */}
          <TabsContent value="table" className="mt-0">
            <div className="rounded-2xl border border-white/[0.08] overflow-hidden bg-[#12141e]/60 backdrop-blur-md shadow-lg">
              <Table>
                <TableHeader>
                  <TableRow className="border-b border-white/[0.08] bg-white/[0.03]">
                    <TableHead className="text-zinc-400 font-mono text-xs py-4 px-6">TOPIC</TableHead>
                    <TableHead className="text-zinc-400 font-mono text-xs py-4 px-6">DIFFICULTY</TableHead>
                    <TableHead className="text-zinc-400 font-mono text-xs py-4 px-6">CONCEPTS</TableHead>
                    <TableHead className="text-right text-zinc-400 font-mono text-xs py-4 px-6">ACTION</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((t) => (
                    <TableRow key={t.id} className="border-b border-white/[0.06] hover:bg-white/[0.02] text-xs">
                      <TableCell className="font-heading font-normal text-sm text-zinc-100 py-4 px-6">
                        {t.title}
                      </TableCell>
                      <TableCell className="py-4 px-6">
                        <Badge variant={getDifficultyVariant(t.difficulty)} className="text-[10px] font-mono">
                          {t.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono text-xs py-4 px-6">
                        {t.keyPoints?.length ?? 0} concepts
                      </TableCell>
                      <TableCell className="text-right py-4 px-6">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => navigate('/study')}
                          className="h-7 px-3 text-xs font-mono text-zinc-300 hover:text-white rounded-full hover:bg-white/10"
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

          {/* TAB 4: Overview Metrics */}
          <TabsContent value="overview" className="mt-0">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-6 md:p-8 rounded-2xl bg-[#12141e]/60 border border-white/[0.08] backdrop-blur-md text-center shadow-lg">
                <div className="font-heading text-3xl md:text-4xl text-white mb-1">{topics.length}</div>
                <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Total Modules</div>
              </div>
              <div className="p-6 md:p-8 rounded-2xl bg-[#12141e]/60 border border-white/[0.08] backdrop-blur-md text-center shadow-lg">
                <div className="font-heading text-3xl md:text-4xl text-emerald-400 mb-1">{totalCards}</div>
                <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Flashcards Vault</div>
              </div>
              <div className="p-6 md:p-8 rounded-2xl bg-[#12141e]/60 border border-white/[0.08] backdrop-blur-md text-center shadow-lg">
                <div className="font-heading text-3xl md:text-4xl text-amber-400 mb-1">{totalQuestions}</div>
                <div className="text-xs text-zinc-400 font-mono uppercase tracking-wider">Quiz Questions</div>
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
