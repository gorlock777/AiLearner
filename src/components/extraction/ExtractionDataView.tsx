import { useNavigate } from 'react-router-dom'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
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
import {
  Layers,
  CheckCircle2,
  ArrowRight,
  Zap,
} from 'lucide-react'
import type { Topic } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'

interface ExtractionDataViewProps {
  topics: Topic[]
}

export function ExtractionDataView({ topics }: ExtractionDataViewProps) {
  const navigate = useNavigate()
  const { documents, flashcardSets, quizSets } = useAppStore()

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
    <div className="w-full linear-card">
      <div className="border-b border-zinc-800/80 p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-zinc-950/40">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-7 h-7 rounded bg-zinc-900 border border-zinc-700 text-emerald-400">
            <CheckCircle2 size={15} />
          </div>
          <div>
            <div className="text-xs font-semibold text-zinc-100 flex items-center gap-2 font-mono">
              EXTRACTED KNOWLEDGE TOPOLOGY
              <Badge variant="secondary">
                {topics.length} topics
              </Badge>
            </div>
            <div className="text-[11px] text-zinc-400 mt-0.5">
              {activeDoc?.name ? `${activeDoc.name} · ` : ''}
              Generated study sets ready
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button
            size="sm"
            onClick={() => navigate('/study')}
            className="text-xs h-7"
          >
            <Layers size={13} />
            Study Flashcards
          </Button>
          <Button
            variant="secondary"
            size="sm"
            onClick={() => navigate('/quiz')}
            className="text-xs h-7"
          >
            <Zap size={13} />
            Quiz
          </Button>
        </div>
      </div>

      <div className="p-4">
        <Tabs defaultValue="topics">
          <TabsList className="mb-4 bg-zinc-900 border border-zinc-800 rounded">
            <TabsTrigger value="topics" className="text-xs font-mono">Hierarchy</TabsTrigger>
            <TabsTrigger value="table" className="text-xs font-mono">Table</TabsTrigger>
            <TabsTrigger value="metrics" className="text-xs font-mono">Telemetry</TabsTrigger>
          </TabsList>

          {/* TAB 1: Accordion Topic Hierarchy */}
          <TabsContent value="topics">
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
                        <span className="font-medium text-zinc-200 text-xs">{topic.title}</span>
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

          {/* TAB 2: Clean Linear Data Table */}
          <TabsContent value="table">
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
                      <TableCell className="font-medium text-zinc-200">
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

          {/* TAB 3: Metrics Overview */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-zinc-100 mb-0.5">{topics.length}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Topics</div>
              </div>
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-emerald-400 mb-0.5">{totalCards}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Flashcards Ready</div>
              </div>
              <div className="p-3.5 rounded bg-zinc-900/50 border border-zinc-800 text-center">
                <div className="text-xl font-bold font-mono text-blue-400 mb-0.5">{totalQuestions}</div>
                <div className="text-[11px] text-zinc-400 font-mono">Diagnostic Questions</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
