import { useNavigate } from 'react-router-dom'
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from '@/components/ui/card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Badge } from '@/components/ui/badge'
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
  BookOpen,
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
    <div className="w-full max-w-3xl linear-card linear-card-highlight">
      <div className="border-b border-zinc-800/80 p-5 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-zinc-900 border border-zinc-700/80 text-emerald-400">
            <CheckCircle2 size={16} />
          </div>
          <div>
            <div className="text-sm font-semibold text-zinc-100 flex items-center gap-2">
              Extracted Knowledge Architecture
              <span className="badge badge-default text-[10px] font-mono">
                {topics.length} topics
              </span>
            </div>
            <div className="text-xs text-zinc-400 mt-0.5">
              {activeDoc?.name ? `${activeDoc.name} · ` : ''}
              Synthesized and ready for active learning
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => navigate('/study')}
            className="btn-primary"
          >
            <Layers size={14} />
            Launch Flashcards
          </button>
          <button
            onClick={() => navigate('/quiz')}
            className="btn-secondary"
          >
            <Zap size={14} />
            Quiz
          </button>
        </div>
      </div>

      <div className="p-5">
        <Tabs defaultValue="topics">
          <TabsList className="mb-4 bg-zinc-900 border border-zinc-800">
            <TabsTrigger value="topics">Topic Hierarchy</TabsTrigger>
            <TabsTrigger value="table">Data Table</TabsTrigger>
            <TabsTrigger value="metrics">Deck Metrics</TabsTrigger>
          </TabsList>

          {/* TAB 1: Accordion Topic Hierarchy */}
          <TabsContent value="topics">
            <Accordion type="single" defaultValue={topics[0]?.id}>
              {topics.map((topic, idx) => {
                const topicCards = flashcardSets.find((s) => s.topicId === topic.id)?.cards.length ?? 0
                const topicQuestions = quizSets.find((s) => s.topicId === topic.id)?.questions.length ?? 0

                return (
                  <AccordionItem key={topic.id} value={topic.id}>
                    <AccordionTrigger>
                      <div className="flex items-center gap-2.5">
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-mono font-medium bg-zinc-900 text-zinc-400 border border-zinc-800">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-zinc-200">{topic.title}</span>
                        <Badge variant={getDifficultyVariant(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-zinc-300 mb-3 leading-relaxed text-xs">
                        {topic.summary}
                      </p>

                      {topic.keyPoints?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[10px] uppercase tracking-wider text-zinc-500 font-semibold block mb-1.5 font-mono">
                            Key Concepts:
                          </span>
                          <ul className="flex flex-col gap-1.5 pl-1">
                            {topic.keyPoints.map((kp, kIdx) => (
                              <li key={kIdx} className="flex items-start gap-2 text-xs text-zinc-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-zinc-500 mt-1.5 flex-shrink-0" />
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-zinc-500 pt-2 border-t border-zinc-800/80 font-mono">
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
            <div className="rounded-lg border border-zinc-800 overflow-hidden bg-zinc-900/30">
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
                    <TableRow key={t.id} className="border-zinc-800/60 hover:bg-zinc-800/40">
                      <TableCell className="font-medium text-zinc-200">
                        {t.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDifficultyVariant(t.difficulty)}>
                          {t.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-zinc-400 font-mono text-xs">
                        {t.keyPoints?.length ?? 0} points
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => navigate('/study')}
                          className="text-xs text-zinc-300 hover:text-white font-medium inline-flex items-center gap-1 transition-colors"
                        >
                          Study
                          <ArrowRight size={12} />
                        </button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </TabsContent>

          {/* TAB 3: Metrics Overview */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-zinc-100 mb-1">{topics.length}</div>
                <div className="text-[11px] text-zinc-400">Total Topics</div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-emerald-400 mb-1">{totalCards}</div>
                <div className="text-[11px] text-zinc-400">Flashcards Ready</div>
              </div>
              <div className="p-4 rounded-lg bg-zinc-900/60 border border-zinc-800 text-center">
                <div className="text-2xl font-bold font-mono text-blue-400 mb-1">{totalQuestions}</div>
                <div className="text-[11px] text-zinc-400">Quiz Questions</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
