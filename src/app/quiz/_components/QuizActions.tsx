"use client"

import { Button } from "@/components/ui/button";
import { ArrowRight, LogOut, CheckCircle2 } from "lucide-react";
import { motion } from "framer-motion";

interface QuizActionsProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  onNext: () => void;
  onQuit: () => void;
}

export function QuizActions({ 
  currentQuestionIndex, 
  totalQuestions, 
  onNext, 
  onQuit 
}: QuizActionsProps) {
  return (
    <motion.div 
      className="flex justify-between mt-8"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <Button
        variant="outline"
        onClick={onQuit}
        className="flex items-center gap-2"
      >
        <LogOut className="h-4 w-4" />
        Quit Quiz
      </Button>
      <Button 
        onClick={onNext}
        className="flex items-center gap-2"
      >
        {currentQuestionIndex < totalQuestions - 1 ? (
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
    </motion.div>
  );
} 