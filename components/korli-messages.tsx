"use client";

import { useEffect, useRef } from "react";

import { MessageBubble } from "@/components/message-bubble";
import type { ChatMessage, OverlayState } from "@/lib/types";

interface KorliMessagesProps {
  messages: ChatMessage[];
  activeOverlay: OverlayState | null;
  onToggleOverlay: (messageId: string, type: "translation" | "correction") => void;
}

export function KorliMessages({
  messages,
  activeOverlay,
  onToggleOverlay,
}: KorliMessagesProps) {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    el.scrollTo({
      top: el.scrollHeight,
      behavior: "smooth",
    });
  }, [messages]);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !activeOverlay) return;

    setTimeout(() => {
      const activeElement = el.querySelector(
        `[data-message-id="${activeOverlay.messageId}"]`
      );
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: "smooth", block: "nearest" });
      }
    }, 50);
  }, [activeOverlay]);

  if (messages.length === 0) {
    return (
      <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-muted-foreground">
        <p className="text-lg font-semibold">Your tutor is ready</p>
        <p className="max-w-sm text-sm">
          Start typing or recording to begin your conversation
        </p>
      </div>
    );
  }

  return (
    <div
      ref={scrollRef}
      className="flex-1 overflow-y-auto px-4 py-3"
    >
      <div className="flex flex-col gap-4">
        {messages.map((message, index) => {
          let previousUserMessage: ChatMessage | undefined;
          if (message.role === "ai" && index > 0) {
            for (let i = index - 1; i >= 0; i--) {
              if (messages[i].role === "user") {
                previousUserMessage = messages[i];
                break;
              }
            }
          }

          return (
            <MessageBubble
              key={message.id}
              message={message}
              previousUserMessage={previousUserMessage}
              showTranslation={
                activeOverlay?.messageId === message.id &&
                activeOverlay.type === "translation"
              }
              showCorrection={
                activeOverlay?.messageId === message.id &&
                activeOverlay.type === "correction"
              }
              onToggleTranslation={
                message.role === "ai"
                  ? () => onToggleOverlay(message.id, "translation")
                  : undefined
              }
              onToggleCorrection={
                message.role === "ai"
                  ? () => onToggleOverlay(message.id, "correction")
                  : undefined
              }
            />
          );
        })}
      </div>
    </div>
  );
}

