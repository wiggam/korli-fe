import type { ChatConfig, SSEventPayload, StartTextChatResponse } from '../types/chat';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? 'http://localhost:8000';

type SSECallbacks = {
  onEvent: (event: SSEventPayload) => void;
  onError?: (error: Error) => void;
  onComplete?: () => void;
};

const safeJsonParse = (value: string) => {
  if (!value) {
    return null;
  }

  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const buildJsonBody = (config: Record<string, unknown>) =>
  JSON.stringify(
    Object.entries(config).reduce<Record<string, unknown>>((acc, [key, value]) => {
      if (value !== undefined && value !== null) {
        acc[key] = value;
      }

      return acc;
    }, {}),
  );

const startSSE = (path: string, init: RequestInit, callbacks: SSECallbacks) => {
  const controller = new AbortController();

  const fetchStream = async () => {
    try {
      const response = await fetch(path, {
        ...init,
        signal: controller.signal,
        headers: {
          Accept: 'text/event-stream',
          ...(init.headers ?? {}),
        },
      });

      if (!response.ok) {
        const message = await response.text();
        throw new Error(message || 'Streaming request failed');
      }

      if (!response.body) {
        throw new Error('Streaming response body is unavailable');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder('utf-8');
      let buffer = '';

      const processBuffer = () => {
        const chunks = buffer.split(/\r?\n\r?\n/);
        buffer = chunks.pop() ?? '';

        for (const chunk of chunks) {
          if (!chunk.trim()) {
            continue;
          }

          const lines = chunk.split(/\r?\n/);
          let eventName = 'message';
          const dataLines: string[] = [];

          for (const line of lines) {
            if (line.startsWith(':')) {
              continue;
            }

            if (line.startsWith('event:')) {
              eventName = line.slice(6).trim();
              continue;
            }

            if (line.startsWith('data:')) {
              dataLines.push(line.slice(5).trim());
            }
          }

          const raw = dataLines.join('\n');
          callbacks.onEvent({
            event: eventName,
            data: safeJsonParse(raw),
            raw,
          });
        }
      };

      const read = async (): Promise<void> => {
        const { value, done } = await reader.read();

        if (done) {
          callbacks.onComplete?.();
          return;
        }

        buffer += decoder.decode(value, { stream: true });
        processBuffer();
        await read();
      };

      await read();
    } catch (error) {
      if ((error as Error).name === 'AbortError') {
        return;
      }

      callbacks.onError?.(error as Error);
    }
  };

  void fetchStream();

  return () => controller.abort();
};

const toUrl = (path: string) => `${API_BASE_URL}${path}`;

export const startTextChat = async (config: ChatConfig): Promise<StartTextChatResponse> => {
  const response = await fetch(toUrl('/api/chat/text'), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: buildJsonBody({
      foreign_language: config.foreignLanguage,
      native_language: config.nativeLanguage,
      student_level: config.studentLevel,
      tutor_gender: config.tutorGender,
      student_gender: config.studentGender,
    }),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Unable to start chat session');
  }

  return (await response.json()) as StartTextChatResponse;
};

export interface ContinueTextChatPayload {
  threadId: string;
  message: string;
  foreignLanguage: string;
}

export const continueTextChatSSE = (
  payload: ContinueTextChatPayload,
  callbacks: SSECallbacks,
) =>
  startSSE(
    toUrl('/api/chat/text'),
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: buildJsonBody({
        thread_id: payload.threadId,
        message: payload.message,
        stream: true,
        foreign_language: payload.foreignLanguage,
      }),
    },
    callbacks,
  );

export interface VoiceChatPayload {
  threadId: string;
  audioFile: Blob;
  foreignLanguage: string;
}

export const voiceChatSSE = (payload: VoiceChatPayload, callbacks: SSECallbacks) => {
  const formData = new FormData();
  formData.append('thread_id', payload.threadId);
  formData.append('foreign_language', payload.foreignLanguage);
  formData.append('stream', 'true');
  formData.append('audio_file', payload.audioFile, 'message.webm');

  return startSSE(
    toUrl('/api/chat/voice'),
    {
      method: 'POST',
      body: formData,
    },
    callbacks,
  );
};

export type { SSECallbacks };

