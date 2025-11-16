import { useEffect, useRef } from 'react';

import type { ChatMessage, OverlayState, OverlayType } from '../types/chat';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
  messages: ChatMessage[];
  activeOverlay: OverlayState | null;
  onToggleOverlay: (messageId: string, type: OverlayType) => void;
  isStreaming: boolean;
}

export const ChatWindow = ({
  messages,
  activeOverlay,
  onToggleOverlay,
  isStreaming,
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages, activeOverlay]);

  return (
    <section className="flex flex-col rounded-3xl border border-slate-200 bg-white p-4 shadow-lg">
      <div
        ref={scrollRef}
        className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-white p-4 sm:h-[520px]"
      >
        {messages.length === 0 ? (
          <div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
            <p className="text-lg font-semibold">Your tutor is ready</p>
            <p className="text-sm max-w-sm">
              Select your languages and level, then press <span className="text-slate-900">Start</span> to
              receive your first message.
            </p>
          </div>
        ) : (
          <div className="flex flex-col gap-6">
            {messages.map((message, index) => {
              // For AI messages, find the previous user message to check for corrections
              let previousUserMessage: ChatMessage | undefined;
              if (message.role === 'ai' && index > 0) {
                // Look backwards to find the most recent user message
                for (let i = index - 1; i >= 0; i--) {
                  if (messages[i].role === 'user') {
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
                    activeOverlay?.messageId === message.id && activeOverlay.type === 'translation'
                  }
                  showCorrection={
                    activeOverlay?.messageId === message.id && activeOverlay.type === 'correction'
                  }
                  onToggleTranslation={
                    message.role === 'ai'
                      ? () => onToggleOverlay(message.id, 'translation')
                      : undefined
                  }
                  onToggleCorrection={
                    message.role === 'ai'
                      ? () => onToggleOverlay(message.id, 'correction')
                      : undefined
                  }
                />
              );
            })}
          </div>
        )}
      </div>

      {isStreaming && (
        <div className="mt-3 flex items-center gap-2 text-sm text-slate-600">
          <span className="h-2 w-2 animate-pulse rounded-full bg-emerald-400" />
          Waiting for the tutor to finish responding…
        </div>
      )}
    </section>
  );
};

