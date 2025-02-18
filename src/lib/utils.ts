import { QuizAttempt } from "@/types/quiz";
import { quizQuestions } from "@/data/quiz-questions";
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


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