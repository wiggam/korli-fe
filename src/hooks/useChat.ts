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
    streamAbortRef.current?.();
    streamAbortRef.current = null;
    currentUserMessageIdRef.current = null;

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
          translation: '',
          isStreaming: true,
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
        next.push({
          id,
          role: 'ai',
          content: text,
          translation: '',
          createdAt: Date.now(),
          isStreaming: true,
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

    setMessages((prev) => {
      const exists = prev.find((message) => message.id === data.id && message.role === 'ai');

      if (!exists) {
        return [
          ...prev,
          {
            id: data.id,
            role: 'ai',
            content: data.ai_message ?? '',
            translation: data.translation,
            audioUrl: data.audio_url,
            createdAt: Date.now(),
            isStreaming: false,
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
          translation: data.translation ?? message.translation,
          audioUrl: data.audio_url ?? message.audioUrl,
          isStreaming: false,
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

      applyToCurrentUserMessage((message) => ({
        ...message,
        correction: {
          corrected: Boolean(data.corrected),
          correctedMessage: data.corrected_message ?? data.correctedMessage ?? message.correction?.correctedMessage,
          translation: data.translation ?? message.correction?.translation,
          audioUrl: data.audio_url ?? data.audioUrl ?? message.correction?.audioUrl,
        },
        status: 'complete',
      }));
    },
    [applyToCurrentUserMessage],
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

  const sendAudioMessage = useCallback(
    async (audioFile: Blob, tutorGender?: GenderOption, studentGender?: GenderOption) => {
      if (!threadId || !config) {
        throw new Error('Start the session before sending audio.');
      }

      if (status.isStreaming) {
        return;
      }

      const userMessageId = createId();
      currentUserMessageIdRef.current = userMessageId;

      const localUrl =
        typeof URL !== 'undefined' && typeof URL.createObjectURL === 'function'
          ? URL.createObjectURL(audioFile)
          : undefined;

      const userMessage: UserMessage = {
        id: userMessageId,
        role: 'user',
        type: 'audio',
        content: 'Transcribing your audio…',
        createdAt: Date.now(),
        status: 'transcribing',
        userAudio: localUrl ? { localUrl } : undefined,
      };

      setMessages((prev) => [...prev, userMessage]);
      setActiveOverlay(null);
      setStatus((prev) => ({ ...prev, isStreaming: true }));

      streamAbortRef.current = voiceChatSSE(
        {
          threadId,
          audioFile,
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
    sendAudioMessage,
    toggleOverlay,
    resetChat,
    clearError,
  };
};

