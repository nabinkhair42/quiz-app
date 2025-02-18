"use client";

import { QuestionCard } from "@/app/quiz/_components/QuestionCard";
import { Timer } from "@/app/quiz/_components/Timer";
import { QuizHeader } from "@/app/quiz/_components/QuizHeader";
import { QuizActions } from "@/app/quiz/_components/QuizActions";
import { quizQuestions } from "@/lib/data/quiz-questions";
import { useQuizStore } from "@/store/quiz-store";
import { useRouter } from "next/navigation";
import { saveQuizAttempt } from "@/lib/db";
import { createQuizAttempt } from "@/lib/utils/quiz";
import { toast } from "sonner";
import { AlertTriangle, CheckCircle2, TimerIcon, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect } from "react";

export default function QuizPage() {
  const router = useRouter();
  const {
    currentQuestionIndex,
    answers,
    setAnswer,
    setCurrentQuestion,
    completeQuiz,
    timeRemaining,
    startTime,
    startQuiz,
    canProceed,
  } = useQuizStore();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  const handleTimeUp = () => {
    if (currentQuestionIndex === quizQuestions.length - 1) {
      handleComplete();
      return;
    }

    toast.warning("Time's up! Moving to next question", {
      icon: <TimerIcon className="h-4 w-4" />,
      duration: 2000,
    });
    
    setCurrentQuestion(currentQuestionIndex + 1);
  };

  const handleNext = () => {
    if (!canProceed()) {
      toast.error("Please answer the question before proceeding", {
        icon: <XCircle className="h-4 w-4" />,
        duration: 2000,
      });
      return;
    }

    if (currentQuestionIndex < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestionIndex + 1);
      toast.success("Moving to next question!", {
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 1500,
      });
    } else {
      handleComplete();
    }
  };

  const handleComplete = async () => {
    if (!canProceed()) {
      toast.error("Please answer all questions before completing", {
        icon: <XCircle className="h-4 w-4" />,
        duration: 2000,
      });
      return;
    }

    completeQuiz();
    const attempt = createQuizAttempt(answers, startTime!);
    
    try {
      await saveQuizAttempt(attempt);
      toast.success(`Quiz completed! Your score: ${attempt.score}/10`, {
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 3000,
      });
      router.push('/history');
    } catch (error) {
      console.error("Failed to save quiz attempt:", error);
      toast.error("Failed to save quiz attempt", {
        icon: <XCircle className="h-4 w-4" />,
      });
    }
  };

  const handleQuit = () => {
    toast.warning("Quiz progress will be lost!", {
      icon: <AlertTriangle className="h-4 w-4" />,
      action: {
        label: "Quit anyway",
        onClick: () => router.push('/'),
      },
    });
  };

  const handleAnswer = (answer: string | number) => {
    setAnswer(currentQuestion.id, answer);
    
    if (currentQuestion.type === 'multiple-choice') {
      toast.success("Answer recorded!", {
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 1000,
      });
    }
  };

  return (
    <motion.div 
      className="container mx-auto max-w-2xl space-y-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <QuizHeader 
        currentQuestion={currentQuestionIndex} 
        totalQuestions={quizQuestions.length} 
      />

      <Timer onTimeUp={handleTimeUp} />
      
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion.id]}
        isDisabled={timeRemaining <= 0}
      />

      <QuizActions 
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={quizQuestions.length}
        onNext={handleNext}
        onQuit={handleQuit}
      />
    </motion.div>
  );
} 