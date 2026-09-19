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
  BookOpen,
  CheckSquare,
  FileText,
  Layers,
  ArrowRight,
  CheckCircle2,
  ListOrdered,
} from 'lucide-react'
import type { Topic } from '@/store/useAppStore'
import { useAppStore } from '@/store/useAppStore'

interface ExtractionDataViewProps {
  topics: Topic[]
  onClear?: () => void
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
    <Card className="w-full max-w-2xl border-[#1e2638] bg-[#101522]">
      <CardHeader className="border-b border-[#1e2638] pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-blue-500/10 border border-blue-500/20 text-blue-400">
              <CheckCircle2 size={18} />
            </div>
            <div>
              <CardTitle className="text-base font-semibold text-slate-100">
                Extracted Study Architecture
              </CardTitle>
              <CardDescription>
                {activeDoc?.name ? `${activeDoc.name} · ` : ''}
                {topics.length} topics organized for active revision
              </CardDescription>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => navigate('/study')}
              className="btn-primary text-xs py-1.5 px-3"
            >
              <BookOpen size={13} />
              Start Study
            </button>
            <button
              onClick={() => navigate('/quiz')}
              className="btn-secondary text-xs py-1.5 px-3"
            >
              <CheckSquare size={13} />
              Quiz
            </button>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-5">
        <Tabs defaultValue="topics">
          <TabsList className="mb-4">
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
                        <span className="w-5 h-5 rounded flex items-center justify-center text-[10px] font-semibold bg-[#182030] text-slate-400 border border-[#252f44]">
                          {idx + 1}
                        </span>
                        <span className="font-medium text-slate-200">{topic.title}</span>
                        <Badge variant={getDifficultyVariant(topic.difficulty)}>
                          {topic.difficulty}
                        </Badge>
                      </div>
                    </AccordionTrigger>
                    <AccordionContent>
                      <p className="text-slate-300 mb-3 leading-relaxed">
                        {topic.summary}
                      </p>

                      {topic.keyPoints?.length > 0 && (
                        <div className="mb-3">
                          <span className="text-[11px] uppercase tracking-wider text-slate-400 font-semibold block mb-1.5">
                            Key Concepts:
                          </span>
                          <ul className="flex flex-col gap-1 pl-1">
                            {topic.keyPoints.map((kp, kIdx) => (
                              <li key={kIdx} className="flex items-start gap-2 text-xs text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 mt-1.5 flex-shrink-0" />
                                <span>{kp}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      <div className="flex items-center gap-4 text-[11px] text-slate-400 pt-2 border-t border-[#1a2130]">
                        <span>{topicCards} flashcards ready</span>
                        <span>·</span>
                        <span>{topicQuestions} quiz questions</span>
                      </div>
                    </AccordionContent>
                  </AccordionItem>
                )
              })}
            </Accordion>
          </TabsContent>

          {/* TAB 2: Clean Shadcn Data Table */}
          <TabsContent value="table">
            <div className="rounded-lg border border-[#1e2638] overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Topic</TableHead>
                    <TableHead>Difficulty</TableHead>
                    <TableHead>Concepts</TableHead>
                    <TableHead className="text-right">Action</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {topics.map((t) => (
                    <TableRow key={t.id}>
                      <TableCell className="font-medium text-slate-200">
                        {t.title}
                      </TableCell>
                      <TableCell>
                        <Badge variant={getDifficultyVariant(t.difficulty)}>
                          {t.difficulty}
                        </Badge>
                      </TableCell>
                      <TableCell className="text-slate-400">
                        {t.keyPoints?.length ?? 0} points
                      </TableCell>
                      <TableCell className="text-right">
                        <button
                          onClick={() => navigate('/study')}
                          className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
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

          {/* TAB 3: Metrics Card */}
          <TabsContent value="metrics">
            <div className="grid grid-cols-3 gap-3">
              <div className="p-4 rounded-lg bg-[#0f1420] border border-[#1e2638] text-center">
                <div className="text-xl font-bold text-slate-100 mb-1">{topics.length}</div>
                <div className="text-[11px] text-slate-400">Extracted Topics</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0f1420] border border-[#1e2638] text-center">
                <div className="text-xl font-bold text-blue-400 mb-1">{totalCards}</div>
                <div className="text-[11px] text-slate-400">Flashcards Ready</div>
              </div>
              <div className="p-4 rounded-lg bg-[#0f1420] border border-[#1e2638] text-center">
                <div className="text-xl font-bold text-emerald-400 mb-1">{totalQuestions}</div>
                <div className="text-[11px] text-slate-400">Quiz Questions</div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}

