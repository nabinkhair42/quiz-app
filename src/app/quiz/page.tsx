"use client";

import { QuestionCard } from "@/app/quiz/_components/QuestionCard";
import { Timer } from "@/app/quiz/_components/Timer";
import { QuizHeader } from "@/app/quiz/_components/QuizHeader";
import { QuizActions } from "@/app/quiz/_components/QuizActions";
import { quizQuestions } from "@/data/quiz-questions";
import { useQuizStore } from "@/store/quiz-store";
import { useRouter, usePathname } from "next/navigation";
import { saveQuizAttempt } from "@/lib/db";
import { createQuizAttempt } from "@/lib/utils";
import { toast } from "sonner";
import { CheckCircle2, TimerIcon, XCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useEffect, useState, useCallback } from "react";
import { QuizDialog } from "./_components/QuizDialog";

export default function QuizPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [showDialog, setShowDialog] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [intendedPath, setIntendedPath] = useState<string | null>(null);
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
    isQuizActive,
  } = useQuizStore();

  const currentQuestion = quizQuestions[currentQuestionIndex];

  useEffect(() => {
    startQuiz();
  }, [startQuiz]);

  // Handle browser close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isQuizActive) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [isQuizActive]);

  // Handle navigation
  const handleNavigation = useCallback((path: string) => {
    if (isQuizActive) {
      setIntendedPath(path);
      setShowDialog(true);
      return false;
    }
    return true;
  }, [isQuizActive]);

  const handleConfirmLeave = useCallback(() => {
    setIsLeaving(true);
    if (intendedPath) {
      router.push(intendedPath);
    } else {
      router.push('/');
    }
  }, [router, intendedPath]);

  const handleQuit = useCallback(() => {
    handleNavigation('/');
  }, [handleNavigation]);

  // Intercept navigation attempts
  useEffect(() => {
    const handleClick = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      const anchor = target.closest('a');
      if (anchor && anchor.href) {
        const url = new URL(anchor.href);
        if (url.pathname !== pathname) {
          e.preventDefault();
          if (handleNavigation(url.pathname)) {
            router.push(url.pathname);
          }
        }
      }
    };

    document.addEventListener('click', handleClick);
    return () => document.removeEventListener('click', handleClick);
  }, [pathname, router, handleNavigation]);

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

  const handleAnswer = (answer: string | number) => {
    setAnswer(currentQuestion.id, answer);
    
    if (currentQuestion.type === 'multiple-choice') {
      toast.success("Answer recorded!", {
        icon: <CheckCircle2 className="h-4 w-4" />,
        duration: 1000,
      });
    }
  };

  if (isLeaving) {
    return null; // Prevent flash of content during navigation
  }

  return (
    <>
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

      <QuizDialog 
        isOpen={showDialog}
        onClose={() => {
          setShowDialog(false);
          setIntendedPath(null);
        }}
        onConfirm={handleConfirmLeave}
      />
    </>
  );
} 