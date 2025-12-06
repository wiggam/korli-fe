"use client";

import { User } from "lucide-react";

import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import type { GenderOption } from "@/lib/types";
import { cn } from "@/lib/utils";

interface GenderSettingsProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  tutorGender: GenderOption;
  studentGender: GenderOption;
  onTutorGenderChange: (gender: GenderOption) => void;
  onStudentGenderChange: (gender: GenderOption) => void;
}

interface GenderButtonProps {
  label: string;
  description: string;
  selected: boolean;
  onClick: () => void;
}

function GenderButton({ label, description, selected, onClick }: GenderButtonProps) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex flex-1 flex-col items-center gap-2 rounded-lg border p-4 transition-all",
        selected
          ? "border-primary bg-primary/5 text-primary"
          : "border-border bg-background text-muted-foreground hover:border-muted-foreground/50 hover:bg-muted/50"
      )}
    >
      <User className={cn("h-6 w-6", selected && "text-primary")} />
      <span className="font-medium">{label}</span>
      <span className="text-xs opacity-70">{description}</span>
    </button>
  );
}

export function GenderSettings({
  open,
  onOpenChange,
  tutorGender,
  studentGender,
  onTutorGenderChange,
  onStudentGenderChange,
}: GenderSettingsProps) {
  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-sm">
        <SheetHeader>
          <SheetTitle>Voice Settings</SheetTitle>
          <SheetDescription>
            Choose the voice gender for your tutor and for playback of your
            corrected messages.
          </SheetDescription>
        </SheetHeader>

        <div className="mt-8 space-y-8">
          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Tutor Voice
            </label>
            <p className="text-xs text-muted-foreground">
              The voice used for AI messages and tutor responses.
            </p>
            <div className="flex gap-3">
              <GenderButton
                label="Male"
                description="Deeper voice"
                selected={tutorGender === "male"}
                onClick={() => onTutorGenderChange("male")}
              />
              <GenderButton
                label="Female"
                description="Higher voice"
                selected={tutorGender === "female"}
                onClick={() => onTutorGenderChange("female")}
              />
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Your Voice (for corrections)
            </label>
            <p className="text-xs text-muted-foreground">
              The voice used when playing back your corrected messages.
            </p>
            <div className="flex gap-3">
              <GenderButton
                label="Male"
                description="Deeper voice"
                selected={studentGender === "male"}
                onClick={() => onStudentGenderChange("male")}
              />
              <GenderButton
                label="Female"
                description="Higher voice"
                selected={studentGender === "female"}
                onClick={() => onStudentGenderChange("female")}
              />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <Button
            onClick={() => onOpenChange(false)}
            className="w-full"
          >
            Done
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}

