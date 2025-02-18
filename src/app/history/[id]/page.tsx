"use client"

import { useEffect, useState, use } from "react";
import { QuizAttempt } from "@/lib/types/quiz";
import { getQuizAttempt } from "@/lib/db";
import { quizQuestions } from "@/lib/data/quiz-questions";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, ChevronLeft, XCircle } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { useRouter } from "next/navigation";

interface PageProps {
  params: Promise<{ id: string }>;
}

export default function QuizDetailsPage({ params }: PageProps) {
  const { id } = use(params);
  const [attempt, setAttempt] = useState<QuizAttempt | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const loadAttempt = async () => {
      try {
        const data = await getQuizAttempt(id);
        if (!data) {
          router.push('/history');
          return;
        }
        setAttempt(data);
      } catch (error) {
        console.error('Failed to load attempt:', error);
        router.push('/history');
      } finally {
        setIsLoading(false);
      }
    };
    loadAttempt();
  }, [id, router]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!attempt) {
    return null;
  }

  const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <div className="container mx-auto max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start gap-4 mb-8">
        <Link href="/history">
          <Button variant="ghost" size="icon">
            <ChevronLeft className="h-4 w-4" />
          </Button>
        </Link>
        <div>
          <h1 className="text-2xl font-bold">Quiz Attempt Details</h1>
          <p className="text-muted-foreground">
            Taken on {formatDate(attempt.startTime)}
          </p>
        </div>
      </div>

      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Summary</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Score</p>
            <p className="text-2xl font-bold">{attempt.score}/10</p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Percentage</p>
            <p className="text-2xl font-bold">
              {((attempt.score! / 10) * 100).toFixed(0)}%
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Time Taken</p>
            <p className="text-2xl font-bold">
              {Math.round((attempt.endTime! - attempt.startTime) / 1000)}s
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-muted-foreground">Questions</p>
            <p className="text-2xl font-bold">
              {Object.keys(attempt.answers).length}/10
            </p>
          </div>
        </CardContent>
      </Card>

      <div className="space-y-4">
        {quizQuestions.map((question) => {
          const userAnswer = attempt.answers[question.id];
          const isCorrect = userAnswer === question.correctAnswer;
          const isAnswered = userAnswer !== undefined;

          return (
            <Card 
              key={question.id}
              className={cn(
                "transition-colors",
                isAnswered && (isCorrect 
                  ? "border-green-500/50 bg-green-500/5"
                  : "border-red-500/50 bg-red-500/5"
                )
              )}
            >
              <CardContent className="pt-6">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <span className="text-sm text-muted-foreground">
                        Question {question.id}
                      </span>
                      {isAnswered && (
                        isCorrect ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <XCircle className="h-4 w-4 text-red-500" />
                        )
                      )}
                    </div>
                    <p className="font-medium mb-4">{question.question}</p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Your Answer:</span>
                        <span className={cn(
                          "text-sm",
                          !isAnswered && "text-muted-foreground italic"
                        )}>
                          {isAnswered ? userAnswer : "No answer provided"}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-sm font-medium">Correct Answer:</span>
                        <span className="text-sm">{question.correctAnswer}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
} 