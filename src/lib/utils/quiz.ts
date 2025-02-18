import { QuizAttempt } from "@/lib/types/quiz";
import { quizQuestions } from "@/lib/data/quiz-questions";

export function calculateScore(answers: QuizAttempt['answers']): number {
  return Object.entries(answers).reduce((score, [id, answer]) => {
    const question = quizQuestions.find(q => q.id === parseInt(id));
    return question?.correctAnswer === answer ? score + 1 : score;
  }, 0);
}

export function createQuizAttempt(
  answers: QuizAttempt['answers'], 
  startTime: number
): QuizAttempt {
  return {
    id: Date.now().toString(),
    startTime,
    endTime: Date.now(),
    answers,
    score: calculateScore(answers),
  };
} 