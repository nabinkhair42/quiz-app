"use client"

import { RadioGroup, RadioGroupItem } from "../../../components/ui/radio-group";
import { Label } from "../../../components/ui/label";
import { motion } from "framer-motion";

interface MultipleChoiceInputProps {
  options: string[];
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

export function MultipleChoiceInput({
  options,
  value,
  onChange,
  disabled
}: MultipleChoiceInputProps) {
  return (
    <RadioGroup
      value={value}
      onValueChange={onChange}
      disabled={disabled}
      className="flex flex-col gap-3"
    >
      {options.map((option, index) => (
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.2, delay: index * 0.1 }}
          key={index}
        >
          <label
            className={`flex items-center space-x-2 rounded-lg border p-4 cursor-pointer transition-all
              ${value === option ? 'bg-primary/5 border-primary' : 'hover:bg-muted'}
              ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            `}
          >
            <RadioGroupItem value={option} id={`option-${index}`} />
            <Label 
              htmlFor={`option-${index}`}
              className="flex-1 cursor-pointer"
            >
              {option}
            </Label>
          </label>
        </motion.div>
      ))}
    </RadioGroup>
  );
} 