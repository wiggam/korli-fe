// Korli Chat Types

export type GenderOption = 'male' | 'female';

export type StudentLevel = 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';

export interface ChatConfig {
  nativeLanguage: string;
  foreignLanguage: string;
  studentLevel: StudentLevel;
  tutorGender: GenderOption;
  studentGender: GenderOption;
}

export interface CorrectionMeta {
  corrected: boolean;
  correctedMessage?: string;
  translation?: string;
  audioUrl?: string;
}

export interface UserAudioMeta {
  localUrl?: string;
}

export type UserMessageStatus = 'pending' | 'transcribing' | 'complete';

export interface BaseMessage {
  id: string;
  createdAt: number;
  role: 'ai' | 'user';
}

export interface AIMessage extends BaseMessage {
  role: 'ai';
  content: string;
  translation?: string;
  audioUrl?: string;
  isStreaming?: boolean;
  iconsLoading?: boolean;
}

export interface UserMessage extends BaseMessage {
  role: 'user';
  type: 'text' | 'audio';
  content: string;
  status: UserMessageStatus;
  userAudio?: UserAudioMeta;
  correction?: CorrectionMeta;
}

export type ChatMessage = AIMessage | UserMessage;

export type OverlayType = 'translation' | 'correction';

export interface OverlayState {
  messageId: string;
  type: OverlayType;
}

export interface SSEventPayload<T = unknown> {
  event: string;
  data: T;
  raw: string;
}

export interface StartTextChatResponse {
  thread_id: string;
  ai_message: {
    content: string;
    translation?: string;
    audio_url?: string;
  };
}

export interface ContinueTextChatPayload {
  threadId: string;
  message: string;
  foreignLanguage: string;
  tutorGender?: GenderOption;
  studentGender?: GenderOption;
}

export interface VoiceChatPayload {
  threadId: string;
  audioFile: Blob;
  foreignLanguage: string;
  tutorGender?: GenderOption;
  studentGender?: GenderOption;
}
