export interface Question {
  id: number;
  type: 'multiple-choice' | 'integer';
  question: string;
  options?: string[];
  correctAnswer: string | number;
}

export interface QuizAttempt {
  id: string;
  startTime: number;
  endTime: number;
  answers: Record<number, string | number>;
  score: number;
}

export interface QuizState {
  currentQuestionIndex: number;
  timeRemaining: number;
  answers: Record<number, string | number>;
  isComplete: boolean;
} 