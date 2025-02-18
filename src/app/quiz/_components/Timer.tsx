"use client"

import { useEffect, useCallback } from "react";
import { Progress } from "../../../components/ui/progress";
import { useQuizStore } from "@/store/quiz-store";
import { cn } from "@/lib/utils";

interface TimerProps {
  onTimeUp: () => void;
}

export function Timer({ onTimeUp }: TimerProps) {
  const { timeRemaining, setTimeRemaining } = useQuizStore();

  const handleTimeUp = useCallback(() => {
    if (timeRemaining <= 0) {
      onTimeUp();
    }
  }, [timeRemaining, onTimeUp]);

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleTimeUp();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(timeRemaining - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining, setTimeRemaining, handleTimeUp]);

  // Calculate progress percentage
  const progress = (timeRemaining / 30) * 100;

  // Determine color based on time remaining
  const getProgressColor = () => {
    if (progress > 60) return "bg-green-500";
    if (progress > 30) return "bg-yellow-500";
    return "bg-red-500";
  };

  // Determine text color based on time remaining
  const getTextColor = () => {
    if (progress > 60) return "text-green-500";
    if (progress > 30) return "text-yellow-500";
    return "text-red-500";
  };

  return (
    <div className="w-full space-y-2">
      <div className="flex justify-between">
        <span>Time Remaining</span>
        <span className={cn("font-medium", getTextColor())}>
          {timeRemaining}s
        </span>
      </div>
      <Progress 
        value={progress} 
        className="h-2 transition-all"
        indicatorClassName={cn(
          "transition-all",
          getProgressColor(),
          progress <= 30 && "animate-pulse"
        )}
      />
    </div>
  );
} 