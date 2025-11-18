import { type ChangeEvent, type FormEvent, useEffect, useRef } from 'react';

import type {
	ChatConfig,
	ChatMessage,
	OverlayState,
	OverlayType,
	StudentLevel,
} from '../types/chat';
import { darkModeColors } from '../utils/theme';
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
	onConfigChange: (
		field: keyof ChatConfig
	) => (value: string) => void;
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
			const activeElement = el.querySelector(
				`[data-message-id="${activeOverlay.messageId}"]`
			);
			if (activeElement) {
				activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}, 50);
	}, [activeOverlay]);

	return (
		<div className="flex flex-1 flex-col min-h-0">
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
					<div className="flex flex-1 flex-col px-2 sm:px-3 md:px-4 pt-0.5 sm:pt-1 md:pt-1.5 pb-1 sm:pb-1.5 md:pb-2 min-h-0">
						<div
							ref={scrollRef}
							className={`relative flex-1 w-full overflow-y-auto rounded-2xl ${darkModeColors.bgChatScroll} px-2 sm:px-3 md:px-4 pt-1 sm:pt-1.5 md:pt-2 pb-2 sm:pb-3 md:pb-4`}
						>
							{messages.length === 0 ? (
								<div className={`flex h-full flex-col items-center justify-center gap-3 text-center ${darkModeColors.chatHint}`}>
									<p className="text-lg font-semibold">Your tutor is ready</p>
									<p className="text-sm max-w-sm">
										Start typing or recording to begin your conversation
									</p>
								</div>
							) : (
								<div className="flex flex-col gap-1 sm:gap-2 md:gap-2">
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
					</div>
				</>
			)}
		</div>
	);
};
