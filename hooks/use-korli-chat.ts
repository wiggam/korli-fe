'use client';

import { useCallback, useEffect, useRef, useState } from 'react';

import { continueTextChatSSE, startTextChat } from '@/lib/korli-api';
import type {
	AIMessage,
	ChatConfig,
	ChatMessage,
	ChatMode,
	GenderOption,
	OverlayState,
	OverlayType,
	SSEventPayload,
	StartTextChatResponse,
	UserMessage,
} from '@/lib/types';
import { generateUUID } from '@/lib/utils';

const releaseAudioFromMessages = (messages: ChatMessage[]) => {
	if (typeof URL === 'undefined' || typeof URL.revokeObjectURL !== 'function') {
		return;
	}

	messages.forEach((message) => {
		if (message.role === 'user' && message.userAudio?.localUrl) {
			URL.revokeObjectURL(message.userAudio.localUrl);
		}
	});
};

export const useKorliChat = () => {
	const [messages, setMessages] = useState<ChatMessage[]>([]);
	const [threadId, setThreadId] = useState<string | null>(null);
	const [config, setConfig] = useState<ChatConfig | null>(null);
	const [activeOverlay, setActiveOverlay] = useState<OverlayState | null>(null);
	const [status, setStatus] = useState({
		isStarting: false,
		isStreaming: false,
	});
	const [error, setError] = useState<string | null>(null);

	// Ask mode collapsed blocks state
	const [collapsedAskBlocks, setCollapsedAskBlocks] = useState<Set<string>>(
		new Set()
	);

	const messagesRef = useRef<ChatMessage[]>([]);
	const streamAbortRef = useRef<(() => void) | null>(null);
	const currentUserMessageIdRef = useRef<string | null>(null);
	const currentAIMessageIdRef = useRef<string | null>(null);
	const pendingAIDataRef = useRef<{
		translation?: string;
		audioUrl?: string;
		mode?: ChatMode;
		askBlockId?: string;
	} | null>(null);
	const pendingCorrectionRef = useRef<{
		corrected?: boolean;
		correctedMessage?: string;
		translation?: string;
		audioUrl?: string;
	} | null>(null);

	// Track current mode and ask_block_id for the streaming message
	const currentModeRef = useRef<ChatMode>('practice');
	const currentAskBlockIdRef = useRef<string | null>(null);

	useEffect(() => {
		messagesRef.current = messages;
	}, [messages]);

	useEffect(
		() => () => {
			streamAbortRef.current?.();
			releaseAudioFromMessages(messagesRef.current);
		},
		[]
	);

	const finishStream = useCallback(() => {
		// Apply pending translation, audioUrl, mode, and askBlockId to AI message
		if (currentAIMessageIdRef.current) {
			const aiMessageId = currentAIMessageIdRef.current;
			const pendingData = pendingAIDataRef.current;

			setMessages((prev) =>
				prev.map((message) => {
					if (message.id !== aiMessageId || message.role !== 'ai') {
						return message;
					}

					return {
						...message,
						translation: pendingData?.translation ?? message.translation,
						audioUrl: pendingData?.audioUrl ?? message.audioUrl,
						mode: pendingData?.mode ?? message.mode,
						askBlockId: pendingData?.askBlockId ?? message.askBlockId,
						isStreaming: false,
						iconsLoading: false,
					};
				})
			);
		}

		// Apply pending correction to user message (only for practice mode)
		if (
			currentUserMessageIdRef.current &&
			pendingCorrectionRef.current &&
			currentModeRef.current === 'practice'
		) {
			const userId = currentUserMessageIdRef.current;
			const correctionData = pendingCorrectionRef.current;

			setMessages((prev) =>
				prev.map((message) => {
					if (message.id !== userId || message.role !== 'user') {
						return message;
					}

					return {
						...message,
						correction: {
							corrected: Boolean(correctionData.corrected),
							correctedMessage:
								correctionData.correctedMessage ??
								message.correction?.correctedMessage,
							translation:
								correctionData.translation ?? message.correction?.translation,
							audioUrl: correctionData.audioUrl ?? message.correction?.audioUrl,
						},
						status: 'complete',
					};
				})
			);
		} else if (
			currentUserMessageIdRef.current &&
			currentModeRef.current === 'ask'
		) {
			// For ask mode, just mark the user message as complete (no correction)
			const userId = currentUserMessageIdRef.current;
			setMessages((prev) =>
				prev.map((message) => {
					if (message.id !== userId || message.role !== 'user') {
						return message;
					}
					return { ...message, status: 'complete' };
				})
			);
		}

		// Clean up
		streamAbortRef.current?.();
		streamAbortRef.current = null;
		currentUserMessageIdRef.current = null;
		currentAIMessageIdRef.current = null;
		pendingAIDataRef.current = null;
		pendingCorrectionRef.current = null;
		currentModeRef.current = 'practice';
		currentAskBlockIdRef.current = null;

		setStatus((prev) =>
			prev.isStreaming ? { ...prev, isStreaming: false } : prev
		);
	}, []);

	const handleStreamError = useCallback(
		(err: Error) => {
			console.error(err);
			setError(err.message || 'Streaming request failed');
			finishStream();
		},
		[finishStream]
	);

	const handleStreamComplete = useCallback(() => {
		finishStream();
	}, [finishStream]);

	const toggleOverlay = useCallback((messageId: string, type: OverlayType) => {
		setActiveOverlay((prev) => {
			if (prev && prev.messageId === messageId && prev.type === type) {
				return null;
			}

			return { messageId, type };
		});
	}, []);

	const resetChat = useCallback(() => {
		streamAbortRef.current?.();
		streamAbortRef.current = null;
		currentUserMessageIdRef.current = null;
		currentAIMessageIdRef.current = null;
		pendingAIDataRef.current = null;
		pendingCorrectionRef.current = null;
		currentModeRef.current = 'practice';
		currentAskBlockIdRef.current = null;

		setMessages((prev) => {
			releaseAudioFromMessages(prev);
			return [];
		});

		setThreadId(null);
		setConfig(null);
		setActiveOverlay(null);
		setStatus({ isStarting: false, isStreaming: false });
		setError(null);
		setCollapsedAskBlocks(new Set());
	}, []);

	// Ask block collapse functions
	const toggleAskBlockCollapse = useCallback((blockId: string) => {
		setCollapsedAskBlocks((prev) => {
			const next = new Set(prev);
			if (next.has(blockId)) {
				next.delete(blockId);
			} else {
				next.add(blockId);
			}
			return next;
		});
	}, []);

	const collapseAllAskBlocks = useCallback(() => {
		// Get all unique ask block IDs from messages
		const askBlockIds = new Set<string>();
		messagesRef.current.forEach((msg) => {
			if (msg.askBlockId) {
				askBlockIds.add(msg.askBlockId);
			}
		});
		setCollapsedAskBlocks(askBlockIds);
	}, []);

	const expandAllAskBlocks = useCallback(() => {
		setCollapsedAskBlocks(new Set());
	}, []);

	const applyToCurrentUserMessage = useCallback(
		(updater: (message: UserMessage) => UserMessage) => {
			const targetId = currentUserMessageIdRef.current;
			if (!targetId) {
				return;
			}

			setMessages((prev) =>
				prev.map((message) => {
					if (message.id !== targetId || message.role !== 'user') {
						return message;
					}

					return updater(message);
				})
			);
		},
		[]
	);

	const handleAssistantStart = useCallback(
		(id: string, mode?: ChatMode, askBlockId?: string | null) => {
			currentAIMessageIdRef.current = id;
			pendingAIDataRef.current = null;

			// Update current mode refs
			if (mode) {
				currentModeRef.current = mode;
			}
			if (askBlockId) {
				currentAskBlockIdRef.current = askBlockId;
			}

			setMessages((prev) => {
				if (prev.some((message) => message.id === id)) {
					return prev;
				}

				return [
					...prev,
					{
						id,
						role: 'ai',
						content: '',
						createdAt: Date.now(),
						translation: undefined,
						isStreaming: true,
						iconsLoading: true,
						mode: mode ?? currentModeRef.current,
						askBlockId: askBlockId ?? currentAskBlockIdRef.current ?? undefined,
					} as AIMessage,
				];
			});
		},
		[]
	);

	const handleAssistantDelta = useCallback(
		(id: string, text: string, mode?: ChatMode, askBlockId?: string | null) => {
			if (!text) {
				return;
			}

			setMessages((prev) => {
				let touched = false;

				const next = prev.map((message) => {
					if (message.id !== id || message.role !== 'ai') {
						return message;
					}

					touched = true;
					return {
						...message,
						content: `${message.content}${text}`,
						// Update mode/askBlockId if provided
						mode: mode ?? message.mode,
						askBlockId: askBlockId ?? message.askBlockId,
					};
				});

				if (!touched) {
					currentAIMessageIdRef.current = id;
					next.push({
						id,
						role: 'ai',
						content: text,
						translation: undefined,
						createdAt: Date.now(),
						isStreaming: true,
						iconsLoading: true,
						mode: mode ?? currentModeRef.current,
						askBlockId: askBlockId ?? currentAskBlockIdRef.current ?? undefined,
					});
				}

				return next;
			});
		},
		[]
	);

	const handleAssistantEnd = useCallback((payload: unknown) => {
		if (!payload || typeof payload !== 'object') {
			return;
		}

		const data = payload as {
			id?: string;
			ai_message?: string;
			translation?: string;
			audio_url?: string;
			mode?: ChatMode;
			ask_block_id?: string;
		};

		if (!data.id) {
			return;
		}

		// Update mode refs from payload
		if (data.mode) {
			currentModeRef.current = data.mode;
		}
		if (data.ask_block_id) {
			currentAskBlockIdRef.current = data.ask_block_id;
		}

		// Store translation, audioUrl, mode, and askBlockId to apply when "done" event is received
		currentAIMessageIdRef.current = data.id;
		pendingAIDataRef.current = {
			translation: data.translation,
			audioUrl: data.audio_url,
			mode: data.mode ?? currentModeRef.current,
			askBlockId:
				data.ask_block_id ?? currentAskBlockIdRef.current ?? undefined,
		};

		// Only update content if needed, but don't set translation/audioUrl yet
		setMessages((prev) => {
			const exists = prev.find(
				(message) => message.id === data.id && message.role === 'ai'
			);

			if (!exists) {
				return [
					...prev,
					{
						id: data.id,
						role: 'ai',
						content: data.ai_message ?? '',
						translation: undefined,
						createdAt: Date.now(),
						isStreaming: true,
						iconsLoading: true,
						mode: data.mode ?? currentModeRef.current,
						askBlockId:
							data.ask_block_id ?? currentAskBlockIdRef.current ?? undefined,
					} as AIMessage,
				];
			}

			return prev.map((message) => {
				if (message.id !== data.id || message.role !== 'ai') {
					return message;
				}

				return {
					...message,
					content: message.content || data.ai_message || '',
					mode: data.mode ?? message.mode,
					askBlockId: data.ask_block_id ?? message.askBlockId,
					// Keep isStreaming true until "done" event
				};
			});
		});
	}, []);

	const handleCorrection = useCallback((payload: unknown) => {
		if (!payload || typeof payload !== 'object') {
			return;
		}

		const data = payload as {
			corrected?: boolean;
			corrected_message?: string;
			correctedMessage?: string;
			translation?: string;
			audio_url?: string;
			audioUrl?: string;
		};

		// Store correction data to apply when "done" event is received
		pendingCorrectionRef.current = {
			corrected: data.corrected,
			correctedMessage: data.corrected_message ?? data.correctedMessage,
			translation: data.translation,
			audioUrl: data.audio_url ?? data.audioUrl,
		};
	}, []);

	const handleTranscript = useCallback(
		(payload: unknown) => {
			if (!payload || typeof payload !== 'object') {
				return;
			}

			const data = payload as { text?: string };

			if (!data.text) {
				return;
			}

			const transcript = data.text;

			applyToCurrentUserMessage((message) => ({
				...message,
				content: transcript,
				status: message.status === 'transcribing' ? 'pending' : message.status,
			}));
		},
		[applyToCurrentUserMessage]
	);

	const handleStreamEvent = useCallback(
		(event: SSEventPayload) => {
			switch (event.event) {
				case 'thread':
					if (
						event.data &&
						typeof (event.data as { thread_id?: string }).thread_id === 'string'
					) {
						setThreadId((event.data as { thread_id: string }).thread_id);
					}
					break;
				case 'assistant_start':
					{
						const data = event.data as {
							id?: string;
							mode?: ChatMode;
							ask_block_id?: string;
						};
						if (data?.id) {
							handleAssistantStart(data.id, data.mode, data.ask_block_id);
						}
					}
					break;
				case 'assistant_delta':
					{
						const data = event.data as {
							id?: string;
							channel?: string;
							text?: string;
							mode?: ChatMode;
							ask_block_id?: string;
						};
						if (
							data?.id &&
							data.channel === 'foreign' &&
							typeof data.text === 'string'
						) {
							handleAssistantDelta(
								data.id,
								data.text,
								data.mode,
								data.ask_block_id
							);
						}
					}
					break;
				case 'assistant_end':
					handleAssistantEnd(event.data);
					break;
				case 'correction':
					handleCorrection(event.data);
					break;
				case 'transcript':
					handleTranscript(event.data);
					break;
				case 'done':
					finishStream();
					break;
				default:
					break;
			}
		},
		[
			finishStream,
			handleAssistantDelta,
			handleAssistantEnd,
			handleAssistantStart,
			handleCorrection,
			handleTranscript,
		]
	);

	const startConversation = useCallback(async (chatConfig: ChatConfig) => {
		streamAbortRef.current?.();
		streamAbortRef.current = null;
		currentUserMessageIdRef.current = null;
		currentAIMessageIdRef.current = null;
		pendingAIDataRef.current = null;
		pendingCorrectionRef.current = null;

		setActiveOverlay(null);
		setStatus({ isStarting: true, isStreaming: false });
		setError(null);

		setMessages((prev) => {
			releaseAudioFromMessages(prev);
			return [];
		});

		try {
			const response: StartTextChatResponse = await startTextChat(chatConfig);
			setThreadId(response.thread_id);
			setConfig(chatConfig);

			setMessages([
				{
					id: response.thread_id
						? `assistant-${response.thread_id}`
						: generateUUID(),
					role: 'ai',
					content: response.ai_message?.content ?? '',
					translation: response.ai_message?.translation,
					audioUrl: response.ai_message?.audio_url,
					createdAt: Date.now(),
					isStreaming: false,
				},
			]);
		} catch (err) {
			setError(err instanceof Error ? err.message : 'Unable to start chat');
			throw err;
		} finally {
			setStatus((prev) => ({ ...prev, isStarting: false }));
		}
	}, []);

	const sendTextMessage = useCallback(
		async (
			rawMessage: string,
			tutorGender?: GenderOption,
			studentGender?: GenderOption,
			mode: ChatMode = 'practice',
			askBlockId?: string
		) => {
			if (!threadId || !config) {
				throw new Error('Start the session before sending a message.');
			}

			const message = rawMessage.trim();
			if (!message || status.isStreaming) {
				return;
			}

			// Auto-collapse all ask blocks when sending a practice message
			if (mode === 'practice') {
				collapseAllAskBlocks();
			}

			const userMessageId = generateUUID();
			currentUserMessageIdRef.current = userMessageId;
			currentAIMessageIdRef.current = null;
			pendingAIDataRef.current = null;
			pendingCorrectionRef.current = null;
			currentModeRef.current = mode;
			currentAskBlockIdRef.current = askBlockId ?? null;

			const newMessage: UserMessage = {
				id: userMessageId,
				role: 'user',
				type: 'text',
				content: message,
				createdAt: Date.now(),
				status: 'pending',
				mode,
				askBlockId,
			};

			setMessages((prev) => [...prev, newMessage]);
			setActiveOverlay(null);
			setStatus((prev) => ({ ...prev, isStreaming: true }));

			streamAbortRef.current = continueTextChatSSE(
				{
					threadId,
					message,
					foreignLanguage: config.foreignLanguage,
					tutorGender,
					studentGender,
					mode,
					askBlockId,
				},
				{
					onEvent: handleStreamEvent,
					onError: handleStreamError,
					onComplete: handleStreamComplete,
				}
			);
		},
		[
			collapseAllAskBlocks,
			config,
			handleStreamComplete,
			handleStreamError,
			handleStreamEvent,
			status.isStreaming,
			threadId,
		]
	);

	const clearError = useCallback(() => setError(null), []);

	return {
		threadId,
		config,
		messages,
		activeOverlay,
		isStarting: status.isStarting,
		isStreaming: status.isStreaming,
		error,
		startConversation,
		sendTextMessage,
		toggleOverlay,
		resetChat,
		clearError,
		// Ask mode block collapse management
		collapsedAskBlocks,
		toggleAskBlockCollapse,
		collapseAllAskBlocks,
		expandAllAskBlocks,
	};
};
