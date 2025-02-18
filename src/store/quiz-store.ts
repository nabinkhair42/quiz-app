import { create } from 'zustand';
import { QuizState } from '@/types/quiz';
import { quizQuestions } from '@/data/quiz-questions';

interface QuizStore extends QuizState {
  startTime: number | null;
  isQuizActive: boolean;
  setAnswer: (questionId: number, answer: string | number) => void;
  setCurrentQuestion: (index: number) => void;
  setTimeRemaining: (time: number) => void;
  completeQuiz: () => void;
  resetQuiz: () => void;
  startQuiz: () => void;
  canProceed: () => boolean;
}

export const useQuizStore = create<QuizStore>((set, get) => ({
  currentQuestionIndex: 0,
  timeRemaining: 30,
  answers: {},
  isComplete: false,
  startTime: null,
  isQuizActive: false,

  startQuiz: () => 
    set({ 
      startTime: Date.now(),
      currentQuestionIndex: 0,
      timeRemaining: 30,
      answers: {},
      isComplete: false,
      isQuizActive: true,
    }),

  setAnswer: (questionId, answer) =>
    set((state) => ({
      answers: { ...state.answers, [questionId]: answer },
    })),

  setCurrentQuestion: (index) =>
    set({ currentQuestionIndex: index, timeRemaining: 30 }),

  setTimeRemaining: (time) => set({ timeRemaining: time }),

  completeQuiz: () => set({ isComplete: true, isQuizActive: false }),

  resetQuiz: () =>
    set({
      currentQuestionIndex: 0,
      timeRemaining: 30,
      answers: {},
      isComplete: false,
      startTime: null,
      isQuizActive: false,
    }),

  canProceed: () => {
    const state = get();
    const currentQuestion = quizQuestions[state.currentQuestionIndex];
    return state.timeRemaining <= 0 || state.answers[currentQuestion.id] !== undefined;
  },
})); 