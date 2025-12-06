"use client";

import { cn } from "@/lib/utils";

interface LevelSliderProps {
  value: string;
  onChange: (value: string) => void;
  levels: readonly string[];
}

export function LevelSlider({ value, onChange, levels }: LevelSliderProps) {
  return (
    <div className="flex w-full gap-1 sm:gap-2">
      {levels.map((level) => (
        <button
          key={level}
          type="button"
          onClick={() => onChange(level)}
          className={cn(
            "flex-1 rounded-lg py-2 sm:py-3 text-xs sm:text-sm font-medium transition-all",
            value === level
              ? "bg-primary text-primary-foreground shadow-sm"
              : "bg-muted text-muted-foreground hover:bg-accent hover:text-accent-foreground"
          )}
        >
          {level}
        </button>
      ))}
    </div>
  );
}

