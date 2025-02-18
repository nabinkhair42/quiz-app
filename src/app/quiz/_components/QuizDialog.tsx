"use client"

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { AlertTriangle } from "lucide-react"

interface QuizDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
}

export function QuizDialog({ isOpen, onClose, onConfirm }: QuizDialogProps) {
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-4">
            <div className="p-2 rounded-full bg-yellow-500/20">
              <AlertTriangle className="h-6 w-6 text-yellow-500" />
            </div>
            <div>
              <DialogTitle>Leave Quiz?</DialogTitle>
              <DialogDescription>
                Your progress will be lost if you leave the quiz.
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>
        <DialogFooter className="flex flex-row justify-end gap-2 sm:gap-0">
          <Button variant="outline" onClick={onClose}>
            Continue Quiz
          </Button>
          <Button variant="destructive" onClick={onConfirm}>
            Leave Anyway
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 