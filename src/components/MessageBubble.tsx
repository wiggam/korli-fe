import type { ReactNode } from 'react';

import type { ChatMessage } from '../types/chat';
import { AudioPlayer } from './AudioPlayer';

interface MessageBubbleProps {
  message: ChatMessage;
  showTranslation?: boolean;
  showCorrection?: boolean;
  onToggleTranslation?: () => void;
  onToggleCorrection?: () => void;
}

const TranslationIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${active ? 'text-blue-500' : 'text-white/70'}`}
    fill="currentColor"
  >
    <path d="M4 5h16v2H4zm3 4h2.5l2 5h2l2-5H18l-3.5 9h-2z" />
  </svg>
);

const CorrectionIcon = ({ active }: { active?: boolean }) => (
  <svg
    viewBox="0 0 24 24"
    className={`h-4 w-4 ${active ? 'text-amber-400' : 'text-white/70'}`}
    fill="currentColor"
  >
    <path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6z" />
  </svg>
);

const IconButton = ({
  label,
  active,
  onClick,
  icon,
}: {
  label: string;
  active?: boolean;
  icon: ReactNode;
  onClick?: () => void;
}) => (
  <button
    type="button"
    onClick={onClick}
    className={`inline-flex items-center gap-1 rounded-full border px-3 py-1 text-xs font-medium transition ${
      active
        ? 'border-blue-400 bg-blue-500/10 text-blue-100'
        : 'border-white/10 bg-white/5 text-white/70 hover:bg-white/10'
    }`}
  >
    {icon}
    {label}
  </button>
);

export const MessageBubble = ({
  message,
  showTranslation,
  showCorrection,
  onToggleTranslation,
  onToggleCorrection,
}: MessageBubbleProps) => {
  const isAssistant = message.role === 'ai';
  const bubbleColor = isAssistant
    ? 'bg-korli-ai text-slate-900'
    : 'bg-gradient-to-br from-blue-500 to-blue-600 text-white';
  const metaAlign = isAssistant ? 'justify-start' : 'justify-end';

  const translationAvailable = isAssistant && Boolean(message.translation);
  const correctionAvailable = !isAssistant && Boolean(message.correction?.corrected);
  const playbackAvailable = !isAssistant && Boolean(message.correction?.audioUrl);

  return (
    <div className={`flex ${isAssistant ? 'justify-start' : 'justify-end'}`}>
      <div className="relative flex w-full max-w-[85%] flex-col gap-2 sm:max-w-[70%]">
        {showTranslation && isAssistant && message.translation && (
          <div className="absolute -top-24 left-0 z-20 w-64 rounded-3xl border border-white/40 bg-white/95 p-4 text-sm text-slate-900 shadow-xl sm:w-80">
            <p className="font-semibold uppercase text-slate-500">Translation</p>
            <p className="mt-1 whitespace-pre-wrap leading-relaxed">{message.translation}</p>
          </div>
        )}

        {showCorrection && !isAssistant && message.correction && (
          <div className="absolute -top-28 right-0 z-20 w-64 rounded-3xl border border-amber-200 bg-korli-ai/90 p-4 text-sm text-slate-900 shadow-xl sm:w-80">
            <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wide text-amber-600">
              <span>Correction</span>
              <span>AI Tutor</span>
            </div>
            {message.correction.correctedMessage && (
              <p className="mt-2 font-medium whitespace-pre-wrap">
                {message.correction.correctedMessage}
              </p>
            )}
            {message.correction.translation && (
              <p className="mt-1 text-slate-600 whitespace-pre-wrap">
                {message.correction.translation}
              </p>
            )}
            {message.correction.audioUrl && (
              <div className="mt-3">
                <AudioPlayer
                  src={message.correction.audioUrl}
                  label="Correction audio"
                  tone="dark"
                  size="sm"
                />
              </div>
            )}
          </div>
        )}

        {!isAssistant && message.userAudio?.localUrl && (
          <div className="flex justify-end">
            <AudioPlayer
              src={message.userAudio.localUrl}
              label="Your recording"
              tone="light"
              size="sm"
            />
          </div>
        )}

        <div
          className={`rounded-3xl px-4 py-3 text-sm leading-relaxed shadow-lg sm:text-base ${bubbleColor}`}
        >
          <p className="whitespace-pre-wrap">{message.content}</p>
          {message.role === 'ai' && message.isStreaming && (
            <span className="mt-2 inline-flex items-center gap-2 text-xs text-slate-500">
              <span className="h-2 w-2 animate-pulse rounded-full bg-slate-500" />
              AI tutor is responding…
            </span>
          )}
          {message.role === 'user' && message.status === 'transcribing' && (
            <span className="mt-2 inline-flex items-center gap-2 text-xs text-white/80">
              <span className="h-2 w-2 animate-ping rounded-full bg-white" />
              Transcribing audio…
            </span>
          )}
        </div>

        <div className={`flex flex-wrap gap-2 text-xs ${metaAlign}`}>
          {translationAvailable && (
            <IconButton
              label="Translation"
              active={showTranslation}
              onClick={onToggleTranslation}
              icon={<TranslationIcon active={showTranslation} />}
            />
          )}

          {isAssistant && message.audioUrl && (
            <AudioPlayer src={message.audioUrl} label="Play audio" tone="dark" size="sm" />
          )}

          {!isAssistant && correctionAvailable && (
            <IconButton
              label="See correction"
              active={showCorrection}
              onClick={onToggleCorrection}
              icon={<CorrectionIcon active={showCorrection} />}
            />
          )}

          {!isAssistant && playbackAvailable && (
            <AudioPlayer
              src={message.correction?.audioUrl}
              label="AI playback"
              tone="light"
              size="sm"
            />
          )}
        </div>
      </div>
    </div>
  );
};

