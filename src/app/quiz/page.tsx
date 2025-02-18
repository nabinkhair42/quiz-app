"use client";

import { QuestionCard } from "@/components/quiz/QuestionCard";
import { Timer } from "@/components/quiz/Timer";
import { quizQuestions } from "@/lib/data/quiz-questions";
import { useQuizStore } from "@/store/quiz-store";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { saveQuizAttempt } from "@/lib/db";
import { toast } from "sonner";
import { 
  ArrowRight, 
  LogOut, 
  AlertTriangle,
  CheckCircle2,
  Timer as TimerIcon,
  XCircle
} from "lucide-react";
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
    const score = calculateScore();
    const attempt = {
      id: Date.now().toString(),
      startTime: startTime!,
      endTime: Date.now(),
      answers,
      score,
    };
    
    try {
      await saveQuizAttempt(attempt);
      toast.success(`Quiz completed! Your score: ${score}/10`, {
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

  const calculateScore = () => {
    return Object.entries(answers).reduce((score, [id, answer]) => {
      const question = quizQuestions.find(q => q.id === parseInt(id));
      return question?.correctAnswer === answer ? score + 1 : score;
    }, 0);
  };

  const handleAnswer = (answer: string | number) => {
    setAnswer(currentQuestion.id, answer);
    
    // Only show toast for multiple choice answers
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
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold">Quiz Progress</h1>
        <span className="text-muted-foreground">
          Question {currentQuestionIndex + 1} of {quizQuestions.length}
        </span>
      </div>

      <Timer onTimeUp={handleTimeUp} />
      
      <QuestionCard
        question={currentQuestion}
        onAnswer={handleAnswer}
        currentAnswer={answers[currentQuestion.id]}
        isDisabled={timeRemaining <= 0}
      />

      <div className="flex justify-between mt-8">
        <Button
          variant="outline"
          onClick={handleQuit}
          className="flex items-center gap-2"
        >
          <LogOut className="h-4 w-4" />
          Quit Quiz
        </Button>
        <Button 
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          {currentQuestionIndex < quizQuestions.length - 1 ? (
            <>
              Next Question
              <ArrowRight className="h-4 w-4" />
            </>
          ) : (
            <>
              Complete Quiz
              <CheckCircle2 className="h-4 w-4" />
            </>
          )}
        </Button>
      </div>
    </motion.div>
  );
} 