"use client"

import { useEffect, useState } from "react"
import type { QuizAttempt } from "@/lib/types/quiz"
import { clearQuizAttempts, getQuizAttempts } from "@/lib/db"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Trophy, Clock, Calendar, Percent, ArrowUpRight, Trash2, Eye } from "lucide-react"
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card"
import { toast } from "sonner"
import Link from "next/link"

export default function HistoryPage() {
  const [attempts, setAttempts] = useState<QuizAttempt[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadAttempts = async () => {
      try {
        const data = await getQuizAttempts()
        setAttempts(data.sort((a, b) => b.startTime - a.startTime))
      } catch (error) {
        console.error("Failed to load attempts:", error)
        toast.error("Failed to load quiz history")
      } finally {
        setIsLoading(false)
      }
    }
    loadAttempts()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-40">Loading...</div>
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    })
  }

  const getScoreColor = (score: number) => {
    if (score >= 8) return "text-green-500"
    if (score >= 6) return "text-yellow-500"
    return "text-red-500"
  }

  const getDuration = (start: number, end: number) => {
    return `${Math.round((end - start) / 1000)}s`
  }

  const handleClearHistory = async () => {
    try {
      await clearQuizAttempts()
      setAttempts([])
      toast.success("Quiz history cleared successfully")
    } catch (error) {
      toast.error("Failed to clear history")
      console.error("Failed to clear history:", error)
    }
  }

  return (
    <div className="container mx-auto max-w-4xl px-4 py-6">
      <div className="flex flex-col md:flex-row items-center justify-between mb-6 gap-4">
        <div>
          <h1 className="text-3xl font-bold">Quiz History</h1>
          <p className="text-muted-foreground">View your past quiz attempts and track your progress</p>
        </div>
        {attempts.length > 0 && (
          <Button variant="destructive" onClick={handleClearHistory} className="flex items-center gap-2">
            <Trash2 className="h-4 w-4" />
            Clear History
          </Button>
        )}
      </div>

      {attempts.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-10 text-center">
            <Trophy className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Quiz Attempts Yet</h3>
            <p className="text-muted-foreground mb-4">Take your first quiz to start tracking your progress</p>
            <Button asChild>
              <Link href="/quiz" className="flex items-center gap-2">
                Start Quiz
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {attempts.map((attempt) => (
            <Card key={attempt.id} className="shadow-md hover:shadow-lg transition">
              <CardContent className="p-6">
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4">
                  <div className="flex items-center gap-4">
                    <span className={`text-2xl font-bold ${getScoreColor(attempt.score!)}`}>{attempt.score}/10</span>
                    <Link href={`/history/${attempt.id}`}>
                      <Button variant="outline" size="sm" className="flex items-center gap-2">
                        <Eye className="h-4 w-4" />
                        View Details
                      </Button>
                    </Link>
                  </div>
                </div>
                <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4" />
                    {formatDate(attempt.startTime)}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock className="h-4 w-4" />
                    {getDuration(attempt.startTime, attempt.endTime!)}
                  </div>
                  <HoverCard>
                    <HoverCardTrigger asChild>
                      <div className="flex items-center gap-2 cursor-help">
                        <Percent className="h-4 w-4 text-muted-foreground" />
                        <span className="text-muted-foreground">{((attempt.score! / 10) * 100).toFixed(0)}%</span>
                      </div>
                    </HoverCardTrigger>
                    <HoverCardContent>Score percentage and ranking</HoverCardContent>
                  </HoverCard>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}