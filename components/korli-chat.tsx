"use client";

import { useCallback, useState, type FormEvent } from "react";

import { ConfigurationForm } from "@/components/configuration-form";
import { GenderSettings } from "@/components/gender-settings";
import { KorliHeader } from "@/components/korli-header";
import { KorliInput } from "@/components/korli-input";
import { KorliMessages } from "@/components/korli-messages";
import { useKorliChat } from "@/hooks/use-korli-chat";
import type { ChatConfig, GenderOption, StudentLevel } from "@/lib/types";

const DEFAULT_CONFIG: ChatConfig = {
  foreignLanguage: "Spanish",
  nativeLanguage: "English",
  studentLevel: "B1" as StudentLevel,
  tutorGender: "female",
  studentGender: "male",
};

export function KorliChat() {
  const {
    threadId,
    config,
    messages,
    activeOverlay,
    isStarting,
    isStreaming,
    error,
    startConversation,
    sendTextMessage,
    toggleOverlay,
    resetChat,
  } = useKorliChat();

  const [formConfig, setFormConfig] = useState<ChatConfig>(DEFAULT_CONFIG);
  const [tutorGender, setTutorGender] = useState<GenderOption>("female");
  const [studentGender, setStudentGender] = useState<GenderOption>("male");
  const [showGenderSettings, setShowGenderSettings] = useState(false);

  const hasSession = Boolean(threadId);

  const handleConfigChange = useCallback(
    (field: keyof ChatConfig) => (value: string) => {
      setFormConfig((prev) => ({ ...prev, [field]: value }));
    },
    []
  );

  const handleStartSession = useCallback(
    async (event: FormEvent) => {
      event.preventDefault();
      try {
        await startConversation({
          ...formConfig,
          tutorGender,
          studentGender,
        });
      } catch (err) {
        console.error("Failed to start session:", err);
      }
    },
    [formConfig, tutorGender, studentGender, startConversation]
  );

  const handleReset = useCallback(() => {
    resetChat();
    setFormConfig(DEFAULT_CONFIG);
    setTutorGender("female");
    setStudentGender("male");
  }, [resetChat]);

  const handleSendText = useCallback(
    async (message: string) => {
      await sendTextMessage(message, tutorGender, studentGender);
    },
    [sendTextMessage, tutorGender, studentGender]
  );

  return (
    <div className="flex h-dvh flex-col bg-background">
      <KorliHeader />

      <div className="flex flex-1 flex-col overflow-hidden">
        {!hasSession ? (
          <ConfigurationForm
            config={formConfig}
            onChange={handleConfigChange}
            onSubmit={handleStartSession}
            onReset={handleReset}
            hasSession={hasSession}
            isStarting={isStarting}
          />
        ) : (
          <div className="flex flex-1 flex-col overflow-hidden">
            <ConfigurationForm
              config={config || formConfig}
              onChange={handleConfigChange}
              onSubmit={handleStartSession}
              onReset={handleReset}
              hasSession={hasSession}
              isStarting={isStarting}
            />

            <div className="flex-1 overflow-hidden px-4 py-3">
              <div className="mx-auto flex h-full max-w-3xl flex-col">
                <KorliMessages
                  messages={messages}
                  activeOverlay={activeOverlay}
                  onToggleOverlay={toggleOverlay}
                />
              </div>
            </div>

            <div className="border-t border-border bg-background px-4 py-3">
              <div className="mx-auto max-w-3xl">
                {error && (
                  <p className="mb-2 text-sm text-destructive">{error}</p>
                )}
                <KorliInput
                  disabled={isStarting}
                  hasSession={hasSession}
                  isStreaming={isStreaming}
                  onSendText={handleSendText}
                  foreignLanguage={config?.foreignLanguage || formConfig.foreignLanguage}
                  onOpenGenderSettings={() => setShowGenderSettings(true)}
                />
              </div>
            </div>
          </div>
        )}
      </div>

      <GenderSettings
        open={showGenderSettings}
        onOpenChange={setShowGenderSettings}
        tutorGender={tutorGender}
        studentGender={studentGender}
        onTutorGenderChange={setTutorGender}
        onStudentGenderChange={setStudentGender}
      />
    </div>
  );
}
