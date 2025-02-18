"use client"

import { Input } from "../../../components/ui/input";
import { useState, useEffect, KeyboardEvent } from "react";
import { Button } from "../../../components/ui/button";
import { ChevronUp, ChevronDown } from "lucide-react";

interface IntegerInputProps {
  value?: number;
  onChange: (value: number) => void;
  disabled?: boolean;
}

export function IntegerInput({
  value,
  onChange,
  disabled
}: IntegerInputProps) {
  const [localValue, setLocalValue] = useState<string>(value?.toString() || '');

  useEffect(() => {
    setLocalValue(value?.toString() || '');
  }, [value]);

  const handleSubmit = () => {
    const numValue = parseInt(localValue, 10);
    if (!isNaN(numValue)) {
      onChange(numValue);
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  const incrementValue = () => {
    const current = parseInt(localValue, 10) || 0;
    setLocalValue((current + 1).toString());
    onChange(current + 1);
  };

  const decrementValue = () => {
    const current = parseInt(localValue, 10) || 0;
    setLocalValue((current - 1).toString());
    onChange(current - 1);
  };

  return (
    <div className="flex items-center gap-2">
      <div className="relative flex-1 max-w-[200px]">
        <Input
          type="number"
          value={localValue}
          onChange={(e) => setLocalValue(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          className="pr-12"
          placeholder="Enter your answer..."
        />
        <div className="absolute right-1 top-1 bottom-1 flex flex-col gap-0.5">
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={incrementValue}
            disabled={disabled}
          >
            <ChevronUp className="h-3 w-3" />
          </Button>
          <Button
            size="icon"
            variant="ghost"
            className="h-5 w-5"
            onClick={decrementValue}
            disabled={disabled}
          >
            <ChevronDown className="h-3 w-3" />
          </Button>
        </div>
      </div>
    </div>
  );
} 