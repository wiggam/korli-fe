import { useCallback, useEffect, useRef, useState } from 'react';

import { continueTextChatSSE, startTextChat, voiceChatSSE } from '../lib/api';
import type {
  AIMessage,
  ChatConfig,
  ChatMessage,
  GenderOption,
  OverlayState,
  OverlayType,
  SSEventPayload,
  StartTextChatResponse,
  UserMessage,
} from '../types/chat';

const createId = () => {
  if (typeof crypto !== 'undefined' && 'randomUUID' in crypto) {
    return crypto.randomUUID();
  }

  return `msg-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 8)}`;
};

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

export const useChat = () => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [threadId, setThreadId] = useState<string | null>(null);
  const [config, setConfig] = useState<ChatConfig | null>(null);
  const [activeOverlay, setActiveOverlay] = useState<OverlayState | null>(null);
  const [status, setStatus] = useState({ isStarting: false, isStreaming: false });
  const [error, setError] = useState<string | null>(null);

  const messagesRef = useRef<ChatMessage[]>([]);
  const streamAbortRef = useRef<(() => void) | null>(null);
  const currentUserMessageIdRef = useRef<string | null>(null);
  const currentAIMessageIdRef = useRef<string | null>(null);
  const pendingAIDataRef = useRef<{ translation?: string; audioUrl?: string } | null>(null);
  const pendingCorrectionRef = useRef<{
    corrected?: boolean;
    correctedMessage?: string;
    translation?: string;
    audioUrl?: string;
  } | null>(null);

  useEffect(() => {
    messagesRef.current = messages;
  }, [messages]);

  useEffect(
    () => () => {
      streamAbortRef.current?.();
      releaseAudioFromMessages(messagesRef.current);
    },
    [],
  );

  const finishStream = useCallback(() => {
    // Apply pending translation and audioUrl to AI message
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
            isStreaming: false,
            iconsLoading: false,
          };
        }),
      );
    }

    // Apply pending correction to user message
    if (currentUserMessageIdRef.current && pendingCorrectionRef.current) {
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
              correctedMessage: correctionData.correctedMessage ?? message.correction?.correctedMessage,
              translation: correctionData.translation ?? message.correction?.translation,
              audioUrl: correctionData.audioUrl ?? message.correction?.audioUrl,
            },
            status: 'complete',
          };
        }),
      );
    }

    // Clean up
    streamAbortRef.current?.();
    streamAbortRef.current = null;
    currentUserMessageIdRef.current = null;
    currentAIMessageIdRef.current = null;
    pendingAIDataRef.current = null;
    pendingCorrectionRef.current = null;

    setStatus((prev) =>
      prev.isStreaming ? { ...prev, isStreaming: false } : prev,
    );
  }, []);

  const handleStreamError = useCallback(
    (err: Error) => {
      console.error(err);
      setError(err.message || 'Streaming request failed');
      finishStream();
    },
    [finishStream],
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

    setMessages((prev) => {
      releaseAudioFromMessages(prev);
      return [];
    });

    setThreadId(null);
    setConfig(null);
    setActiveOverlay(null);
    setStatus({ isStarting: false, isStreaming: false });
    setError(null);
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
        }),
      );
    },
    [],
  );

  const handleAssistantStart = useCallback((id: string) => {
    currentAIMessageIdRef.current = id;
    pendingAIDataRef.current = null;

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
        } as AIMessage,
      ];
    });
  }, []);

  const handleAssistantDelta = useCallback((id: string, text: string) => {
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
        });
      }

      return next;
    });
  }, []);

  const handleAssistantEnd = useCallback((payload: unknown) => {
    if (!payload || typeof payload !== 'object') {
      return;
    }

    const data = payload as {
      id?: string;
      ai_message?: string;
      translation?: string;
      audio_url?: string;
    };

    if (!data.id) {
      return;
    }

    // Store translation and audioUrl to apply when "done" event is received
    currentAIMessageIdRef.current = data.id;
    pendingAIDataRef.current = {
      translation: data.translation,
      audioUrl: data.audio_url,
    };

    // Only update content if needed, but don't set translation/audioUrl yet
    setMessages((prev) => {
      const exists = prev.find((message) => message.id === data.id && message.role === 'ai');

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
          // Keep isStreaming true until "done" event
        };
      });
    });
  }, []);

  const handleCorrection = useCallback(
    (payload: unknown) => {
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
    },
    [],
  );

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
    [applyToCurrentUserMessage],
  );

  const handleStreamEvent = useCallback(
    (event: SSEventPayload) => {
      switch (event.event) {
        case 'thread':
          if (event.data && typeof (event.data as { thread_id?: string }).thread_id === 'string') {
            setThreadId((event.data as { thread_id: string }).thread_id);
          }
          break;
        case 'assistant_start':
          if (event.data && typeof (event.data as { id?: string }).id === 'string') {
            handleAssistantStart((event.data as { id: string }).id);
          }
          break;
        case 'assistant_delta':
          {
            const data = event.data as { id?: string; channel?: string; text?: string };
            if (data?.id && data.channel === 'foreign' && typeof data.text === 'string') {
              handleAssistantDelta(data.id, data.text);
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
    [finishStream, handleAssistantDelta, handleAssistantEnd, handleAssistantStart, handleCorrection, handleTranscript],
  );

  const startConversation = useCallback(
    async (chatConfig: ChatConfig) => {
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
            id: response.thread_id ? `assistant-${response.thread_id}` : createId(),
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
    },
    [],
  );

  const sendTextMessage = useCallback(
    async (rawMessage: string, tutorGender?: GenderOption, studentGender?: GenderOption) => {
      if (!threadId || !config) {
        throw new Error('Start the session before sending a message.');
      }

      const message = rawMessage.trim();
      if (!message || status.isStreaming) {
        return;
      }

      const userMessageId = createId();
      currentUserMessageIdRef.current = userMessageId;
      currentAIMessageIdRef.current = null;
      pendingAIDataRef.current = null;
      pendingCorrectionRef.current = null;

      const newMessage: UserMessage = {
        id: userMessageId,
        role: 'user',
        type: 'text',
        content: message,
        createdAt: Date.now(),
        status: 'pending',
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
        },
        {
          onEvent: handleStreamEvent,
          onError: handleStreamError,
          onComplete: handleStreamComplete,
        },
      );
    },
    [config, handleStreamComplete, handleStreamError, handleStreamEvent, status.isStreaming, threadId],
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
  };
};

