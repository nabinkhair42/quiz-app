"use client"

import { Question } from "@/lib/types/quiz";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { MultipleChoiceInput } from "./MultipleChoiceInput";
import { IntegerInput } from "./IntegerInput";
import { Badge } from "../ui/badge";
import { Brain, Calculator, HelpCircle, CheckCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../ui/tooltip";
import { cn } from "@/lib/utils";

interface QuestionCardProps {
  question: Question;
  onAnswer: (answer: string | number) => void;
  currentAnswer?: string | number;
  isDisabled?: boolean;
}

export function QuestionCard({ 
  question, 
  onAnswer, 
  currentAnswer, 
  isDisabled 
}: QuestionCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <Card className={cn(
        "transition-all hover:shadow-md border-l-4",
        currentAnswer !== undefined 
          ? "border-l-green-500" 
          : "border-l-primary"
      )}>
        <CardHeader className="space-y-4">
          <div className="flex items-center justify-between">
            <Badge 
              variant={question.type === 'multiple-choice' ? 'default' : 'secondary'} 
              className="flex items-center gap-1"
            >
              {question.type === 'multiple-choice' ? (
                <>
                  <Brain className="h-3 w-3" />
                  <span>Multiple Choice</span>
                </>
              ) : (
                <>
                  <Calculator className="h-3 w-3" />
                  <span>Numerical Answer</span>
                </>
              )}
            </Badge>
            <div className="flex items-center gap-2">
              {currentAnswer !== undefined && (
                <Badge variant="outline" className="text-green-500">
                  <CheckCircle className="h-3 w-3 mr-1" />
                  Answered
                </Badge>
              )}
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <HelpCircle className="h-4 w-4 text-muted-foreground hover:text-primary cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>{question.type === 'multiple-choice' ? 
                      'Select one of the options below' : 
                      'Enter a numerical value'}
                    </p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
          <CardTitle className="text-xl leading-tight">
            {question.question}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="bg-muted/50 p-4 rounded-lg">
            {question.type === 'multiple-choice' ? (
              <MultipleChoiceInput
                options={question.options!}
                value={currentAnswer as string}
                onChange={onAnswer}
                disabled={isDisabled}
              />
            ) : (
              <IntegerInput
                value={currentAnswer as number}
                onChange={onAnswer}
                disabled={isDisabled}
              />
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
} 