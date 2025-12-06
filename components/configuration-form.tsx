"use client";

import type { FormEvent } from "react";
import Image from "next/image";

import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { LevelSlider } from "@/components/level-slider";
import { LANGUAGE_TO_FLAG, LANGUAGES, LEVELS } from "@/lib/constants/languages";
import type { ChatConfig, StudentLevel } from "@/lib/types";
import { cn } from "@/lib/utils";

interface ConfigurationFormProps {
  config: ChatConfig;
  onChange: (field: keyof ChatConfig) => (value: string) => void;
  onSubmit: (event: FormEvent) => void;
  onReset?: () => void;
  hasSession: boolean;
  isStarting: boolean;
}

function getFlagPath(language: string): string | null {
  const countryCode = LANGUAGE_TO_FLAG[language];
  if (!countryCode) return null;
  return `/flags/l/${countryCode}.svg`;
}

function LanguageItem({ language }: { language: string }) {
  const flagPath = getFlagPath(language);
  
  return (
    <div className="flex items-center gap-2">
      {flagPath && (
        <Image
          src={flagPath}
          alt={`${language} flag`}
          width={20}
          height={15}
          className="rounded-sm"
        />
      )}
      <span>{language}</span>
    </div>
  );
}

export function ConfigurationForm({
  config,
  onChange,
  onSubmit,
  onReset,
  hasSession,
  isStarting,
}: ConfigurationFormProps) {
  const sortedLanguages = [...LANGUAGES].sort();

  if (hasSession) {
    return (
      <div className="flex items-center justify-between border-b border-border px-4 py-2">
        <div className="flex flex-wrap items-center gap-2 text-xs text-muted-foreground">
          <span>
            <span className="font-medium text-foreground">
              {config.foreignLanguage}
            </span>{" "}
            → {config.nativeLanguage}
          </span>
          <span className="text-muted-foreground/50">•</span>
          <span>
            Level:{" "}
            <span className="font-medium text-foreground">
              {config.studentLevel}
            </span>
          </span>
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={onReset}
          className="h-7 px-3 text-xs"
        >
          Reset
        </Button>
      </div>
    );
  }

  return (
    <div className="flex min-h-[480px] items-center justify-center p-6">
      <form onSubmit={onSubmit} className="w-full max-w-xl space-y-8">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-foreground">
            Start your language practice
          </h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Choose your languages and level to begin
          </p>
        </div>

        <div className="space-y-6">
          <div className="grid gap-4 sm:grid-cols-2">
            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Learning
              </label>
              <Select
                value={config.foreignLanguage}
                onValueChange={onChange("foreignLanguage")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <LanguageItem language={config.foreignLanguage} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {sortedLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      <LanguageItem language={lang} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium text-foreground">
                Native Language
              </label>
              <Select
                value={config.nativeLanguage}
                onValueChange={onChange("nativeLanguage")}
              >
                <SelectTrigger className="w-full">
                  <SelectValue>
                    <LanguageItem language={config.nativeLanguage} />
                  </SelectValue>
                </SelectTrigger>
                <SelectContent className="max-h-[300px]">
                  {sortedLanguages.map((lang) => (
                    <SelectItem key={lang} value={lang}>
                      <LanguageItem language={lang} />
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-3">
            <label className="text-sm font-medium text-foreground">
              Proficiency Level
            </label>
            <LevelSlider
              value={config.studentLevel}
              onChange={onChange("studentLevel") as (value: string) => void}
              levels={LEVELS}
            />
            <p className="text-xs text-muted-foreground text-center">
              {config.studentLevel === "A1" && "Beginner - Basic phrases and vocabulary"}
              {config.studentLevel === "A2" && "Elementary - Simple conversations"}
              {config.studentLevel === "B1" && "Intermediate - Everyday topics"}
              {config.studentLevel === "B2" && "Upper Intermediate - Complex discussions"}
              {config.studentLevel === "C1" && "Advanced - Fluent expression"}
              {config.studentLevel === "C2" && "Mastery - Near-native proficiency"}
            </p>
          </div>
        </div>

        <div className="flex justify-center pt-2">
          <Button
            type="submit"
            disabled={isStarting}
            size="lg"
            className="px-8"
          >
            {isStarting ? "Starting..." : "Let's Chat"}
          </Button>
        </div>
      </form>
    </div>
  );
}

