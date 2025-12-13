'use client';

import { useEffect, useMemo, useRef } from 'react';

import { AskBlockGroup } from '@/components/ask-block-group';
import { MessageBubble } from '@/components/message-bubble';
import type { AccentColor } from '@/contexts/korli-chat-context';
import type { ChatMessage, OverlayState } from '@/lib/types';

// Type for grouped messages - either a single practice message or a group of ask messages
type MessageGroup = 
	| { type: 'practice'; message: ChatMessage; index: number }
	| { type: 'ask-block'; blockId: string; messages: ChatMessage[]; indices: number[] };

interface KorliMessagesProps {
	messages: ChatMessage[];
	activeOverlay: OverlayState | null;
	onToggleOverlay: (
		messageId: string,
		type: 'translation' | 'correction'
	) => void;
	accentColor: AccentColor;
	collapsedAskBlocks: Set<string>;
	onToggleAskBlockCollapse: (blockId: string) => void;
}

export function KorliMessages({
	messages,
	activeOverlay,
	onToggleOverlay,
	accentColor,
	collapsedAskBlocks,
	onToggleAskBlockCollapse,
}: KorliMessagesProps) {
	const scrollRef = useRef<HTMLDivElement | null>(null);

	// Group messages: practice messages as individual items, ask messages grouped by blockId
	const messageGroups = useMemo(() => {
		type AskBlock = { blockId: string; messages: ChatMessage[]; indices: number[] };
		const groups: MessageGroup[] = [];
		let currentAskBlock: AskBlock | null = null;

		const pushAskBlock = (block: AskBlock) => {
			groups.push({
				type: 'ask-block',
				blockId: block.blockId,
				messages: block.messages,
				indices: block.indices,
			});
		};

		messages.forEach((message, index) => {
			const isAskMode = message.mode === 'ask' && message.askBlockId;

			if (isAskMode) {
				// Check if we should continue or start a new ask block
				if (currentAskBlock && currentAskBlock.blockId === message.askBlockId) {
					currentAskBlock.messages.push(message);
					currentAskBlock.indices.push(index);
				} else {
					// Save current block if exists
					if (currentAskBlock) {
						pushAskBlock(currentAskBlock);
					}
					// Start new block
					currentAskBlock = {
						blockId: message.askBlockId!,
						messages: [message],
						indices: [index],
					};
				}
			} else {
				// Save current ask block if exists
				if (currentAskBlock) {
					pushAskBlock(currentAskBlock);
					currentAskBlock = null;
				}
				// Add practice message
				groups.push({ type: 'practice', message, index });
			}
		});

		// Don't forget the last ask block - use type assertion since TS can't track mutations in forEach
		if (currentAskBlock as AskBlock | null) {
			pushAskBlock(currentAskBlock as AskBlock);
		}

		return groups;
	}, [messages]);

	useEffect(() => {
		const el = scrollRef.current;
		if (!el) return;

		el.scrollTo({
			top: el.scrollHeight,
			behavior: 'smooth',
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
				activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
			}
		}, 50);
	}, [activeOverlay]);

	// Helper to find previous user message for AI messages
	const findPreviousUserMessage = (index: number): ChatMessage | undefined => {
		for (let i = index - 1; i >= 0; i--) {
			if (messages[i].role === 'user') {
				return messages[i];
			}
		}
		return undefined;
	};

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
		<div ref={scrollRef} className="flex-1 overflow-y-auto px-1 py-1">
			<div className="flex flex-col gap-2 sm:gap-4">
				{messageGroups.map((group) => {
					if (group.type === 'practice') {
						const { message, index } = group;
						const previousUserMessage = message.role === 'ai' 
							? findPreviousUserMessage(index) 
							: undefined;

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
								accentColor={accentColor}
							/>
						);
					}

					// Ask block group
					const { blockId, messages: blockMessages, indices } = group;
					const isCollapsed = collapsedAskBlocks.has(blockId);

					return (
						<AskBlockGroup
							key={`ask-block-${blockId}`}
							blockId={blockId}
							messages={blockMessages}
							isCollapsed={isCollapsed}
							onToggleCollapse={onToggleAskBlockCollapse}
						>
							{blockMessages.map((message, blockIndex) => {
								const globalIndex = indices[blockIndex];
								const previousUserMessage = message.role === 'ai'
									? findPreviousUserMessage(globalIndex)
									: undefined;

								return (
									<MessageBubble
										key={message.id}
										message={message}
										previousUserMessage={previousUserMessage}
										showTranslation={
											activeOverlay?.messageId === message.id &&
											activeOverlay.type === 'translation'
										}
										showCorrection={false} // No corrections in ask mode
										onToggleTranslation={
											message.role === 'ai'
												? () => onToggleOverlay(message.id, 'translation')
												: undefined
										}
										onToggleCorrection={undefined} // No corrections in ask mode
										accentColor={accentColor}
										isAskMode
									/>
								);
							})}
						</AskBlockGroup>
					);
				})}
			</div>
		</div>
	);
}
