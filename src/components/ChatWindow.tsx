import { type ChangeEvent, type FormEvent, useEffect, useRef } from 'react';

import type {
	ChatConfig,
	ChatMessage,
	OverlayState,
	OverlayType,
	StudentLevel,
} from '../types/chat';
import { ConfigurationForm } from './ConfigurationForm';
import { MessageBubble } from './MessageBubble';

interface ChatWindowProps {
	messages: ChatMessage[];
	activeOverlay: OverlayState | null;
	onToggleOverlay: (messageId: string, type: OverlayType) => void;
	isStreaming: boolean;
	config: ChatConfig;
	languages: string[];
	levels: StudentLevel[];
	onConfigChange: (field: keyof ChatConfig) => (event: ChangeEvent<HTMLSelectElement>) => void;
	onStartSession: (event: FormEvent) => void;
	onReset: () => void;
	hasSession: boolean;
	isStarting: boolean;
}

export const ChatWindow = ({
	messages,
	activeOverlay,
	onToggleOverlay,
	isStreaming,
	config,
	languages,
	levels,
	onConfigChange,
	onStartSession,
	onReset,
	hasSession,
	isStarting,
}: ChatWindowProps) => {
  const scrollRef = useRef<HTMLDivElement | null>(null);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) {
      return;
    }

    el.scrollTo({
      top: el.scrollHeight,
      behavior: 'smooth',
    });
  }, [messages]);

  // Scroll to specific message when overlay is opened (but not when closed)
  useEffect(() => {
    const el = scrollRef.current;
    if (!el || !activeOverlay) {
      return;
    }

    // Small delay to allow the DOM to update with the expanded content
    setTimeout(() => {
      const activeElement = el.querySelector(`[data-message-id="${activeOverlay.messageId}"]`);
      if (activeElement) {
        activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }
    }, 50);
  }, [activeOverlay]);

	return (
		<div className="flex flex-col">
			{/* Configuration Form - Centered before session, Compact after */}
			{!hasSession ? (
				<ConfigurationForm
					config={config}
					languages={languages}
					levels={levels}
					onChange={onConfigChange}
					onSubmit={onStartSession}
					onReset={onReset}
					hasSession={hasSession}
					isStarting={isStarting}
				/>
			) : (
				<>
					<ConfigurationForm
						config={config}
						languages={languages}
						levels={levels}
						onChange={onConfigChange}
						onSubmit={onStartSession}
						onReset={onReset}
						hasSession={hasSession}
						isStarting={isStarting}
					/>
					<div className="p-4">
						<div
							ref={scrollRef}
							className="relative h-[420px] w-full overflow-y-auto rounded-2xl bg-white p-4 sm:h-[520px]"
						>
							{messages.length === 0 ? (
								<div className="flex h-full flex-col items-center justify-center gap-3 text-center text-slate-500">
									<p className="text-lg font-semibold">Your tutor is ready</p>
									<p className="text-sm max-w-sm">Start typing or recording to begin your conversation</p>
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
													activeOverlay?.messageId === message.id &&
													activeOverlay.type === 'translation'
												}
												showCorrection={
													activeOverlay?.messageId === message.id &&
													activeOverlay.type === 'correction'
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
					</div>
				</>
			)}
		</div>
	);
};

