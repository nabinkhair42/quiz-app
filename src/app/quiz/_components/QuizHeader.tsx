"use client"

import { motion } from "framer-motion";

interface QuizHeaderProps {
  currentQuestion: number;
  totalQuestions: number;
}

export function QuizHeader({ currentQuestion, totalQuestions }: QuizHeaderProps) {
  return (
    <motion.div 
      className="flex items-center justify-between mb-8"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-2xl font-bold">Quiz Progress</h1>
      <span className="text-muted-foreground">
        Question {currentQuestion + 1} of {totalQuestions}
      </span>
    </motion.div>
  );
} 