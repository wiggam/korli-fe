'use client';

import { Languages, Shield } from 'lucide-react';

import { AudioPlayer } from '@/components/audio-player';
import { Button } from '@/components/ui/button';
import { type AccentColor, ACCENT_COLORS } from '@/contexts/korli-chat-context';
import type { ChatMessage } from '@/lib/types';
import { cn } from '@/lib/utils';

interface MessageBubbleProps {
	message: ChatMessage;
	previousUserMessage?: ChatMessage;
	showTranslation?: boolean;
	showCorrection?: boolean;
	onToggleTranslation?: () => void;
	onToggleCorrection?: () => void;
	accentColor: AccentColor;
}

function getAccentClasses(color: AccentColor) {
	const found = ACCENT_COLORS.find((c) => c.value === color);
	return found ? `${found.bgClass}` : 'bg-blue-600';
}

function UserMessage({
	message,
	accentColor,
}: {
	message: ChatMessage;
	accentColor: AccentColor;
}) {
	if (message.role !== 'user') return null;

	return (
		<div className="flex justify-end" data-message-id={message.id}>
			<div className="max-w-[85%] sm:max-w-[70%]">
				<div
					className={cn(
						'rounded-2xl px-3 py-2 text-sm text-white sm:px-4 sm:py-3 sm:text-base',
						getAccentClasses(accentColor)
					)}
				>
					<p className="whitespace-pre-wrap">{message.content}</p>
					{message.status === 'transcribing' && (
						<span className="mt-2 inline-flex items-center gap-2 text-xs opacity-80">
							<span className="h-2 w-2 animate-spin rounded-full border-2 border-current border-t-transparent" />
							Transcribing audio…
						</span>
					)}
				</div>
			</div>
		</div>
	);
}

function AssistantMessage({
	message,
	showTranslation,
	onToggleTranslation,
	previousUserMessage,
	showCorrection,
	onToggleCorrection,
}: {
	message: ChatMessage;
	showTranslation?: boolean;
	onToggleTranslation?: () => void;
	previousUserMessage?: ChatMessage;
	showCorrection?: boolean;
	onToggleCorrection?: () => void;
}) {
	if (message.role !== 'ai') return null;

	const translationAvailable = Boolean(message.translation);
	const correctionAvailable =
		previousUserMessage?.role === 'user' &&
		Boolean(previousUserMessage.correction?.corrected);
	const userTTSAvailable =
		previousUserMessage?.role === 'user' &&
		Boolean(previousUserMessage.correction?.audioUrl);

	return (
		<div className="flex justify-start" data-message-id={message.id}>
			<div className="w-full space-y-2">
				<div className="text-sm leading-relaxed text-foreground sm:text-base">
					<p className="whitespace-pre-wrap">{message.content}</p>
					{message.isStreaming && !message.content && (
						<span className="inline-flex items-center gap-2 text-sm text-muted-foreground">
							<span className="h-2 w-2 animate-pulse rounded-full bg-primary" />
							Korli is responding…
						</span>
					)}
				</div>

				<div className="flex flex-wrap items-center justify-between gap-2">
					<div className="flex flex-wrap items-center gap-2">
						{message.iconsLoading ? (
							<div className="flex items-center gap-1.5 rounded-md px-2 py-1">
								<div className="h-3 w-3 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
								<span className="hidden text-xs text-muted-foreground sm:inline">
									Loading...
								</span>
							</div>
						) : (
							<>
								{translationAvailable && (
									<Button
										type="button"
										variant={showTranslation ? 'secondary' : 'outline'}
										size="sm"
										onClick={onToggleTranslation}
										className="h-7 gap-1.5 px-2 text-xs"
									>
										<Languages
											className={cn(
												'h-3.5 w-3.5',
												showTranslation && 'text-blue-600 dark:text-blue-400'
											)}
										/>
										<span className="hidden sm:inline">Translate</span>
									</Button>
								)}

								{message.audioUrl && (
									<AudioPlayer src={message.audioUrl} label="Play" size="sm" />
								)}

								{correctionAvailable && (
									<Button
										type="button"
										variant={showCorrection ? 'secondary' : 'outline'}
										size="sm"
										onClick={onToggleCorrection}
										className="h-7 gap-1.5 px-2 text-xs"
									>
										<Shield
											className={cn(
												'h-3.5 w-3.5',
												showCorrection && 'text-amber-600 dark:text-amber-400'
											)}
										/>
										<span className="hidden sm:inline">Correction</span>
									</Button>
								)}
							</>
						)}
					</div>

					{userTTSAvailable &&
						!correctionAvailable &&
						previousUserMessage?.role === 'user' && (
							<div className="ml-auto">
								<AudioPlayer
									src={previousUserMessage.correction?.audioUrl}
									label="Your message"
									size="sm"
								/>
							</div>
						)}
				</div>

				{showTranslation && message.translation && (
					<div className="rounded-lg border border-blue-200 bg-blue-50 p-2 dark:border-blue-800 dark:bg-blue-950/50">
						<p className="text-xs font-semibold uppercase tracking-wide text-blue-700 dark:text-blue-300">
							Translation
						</p>
						<p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-foreground sm:text-sm">
							{message.translation}
						</p>
					</div>
				)}

				{showCorrection &&
					previousUserMessage?.role === 'user' &&
					previousUserMessage.correction && (
						<div className="relative rounded-lg border border-amber-200 bg-amber-50 p-2 dark:border-amber-800 dark:bg-amber-950/50">
							<p className="text-xs font-semibold uppercase tracking-wide text-amber-700 dark:text-amber-300">
								Corrections
							</p>

							{previousUserMessage.correction.audioUrl && (
								<div className="absolute right-3 top-3 sm:hidden">
									<AudioPlayer
										src={previousUserMessage.correction.audioUrl}
										size="sm"
									/>
								</div>
							)}

							{previousUserMessage.correction.correctedMessage && (
								<p className="mt-1 whitespace-pre-wrap text-xs font-medium leading-relaxed text-foreground sm:text-sm">
									{previousUserMessage.correction.correctedMessage}
								</p>
							)}

							{previousUserMessage.correction.translation && (
								<p className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-muted-foreground sm:text-sm">
									{previousUserMessage.correction.translation}
								</p>
							)}

							{previousUserMessage.correction.audioUrl && (
								<div className="mt-2 hidden sm:block">
									<AudioPlayer
										src={previousUserMessage.correction.audioUrl}
										label="Listen"
										size="sm"
									/>
								</div>
							)}
						</div>
					)}
			</div>
		</div>
	);
}

export function MessageBubble({
	message,
	showTranslation,
	showCorrection,
	onToggleTranslation,
	onToggleCorrection,
	previousUserMessage,
	accentColor,
}: MessageBubbleProps) {
	if (message.role === 'user') {
		return <UserMessage message={message} accentColor={accentColor} />;
	}

	return (
		<AssistantMessage
			message={message}
			showTranslation={showTranslation}
			showCorrection={showCorrection}
			onToggleTranslation={onToggleTranslation}
			onToggleCorrection={onToggleCorrection}
			previousUserMessage={previousUserMessage}
		/>
	);
}
