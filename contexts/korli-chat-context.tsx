'use client';

import {
	createContext,
	useCallback,
	useContext,
	useState,
	type FormEvent,
	type ReactNode,
} from 'react';

import { useKorliChat } from '@/hooks/use-korli-chat';
import type {
	ChatConfig,
	ChatMessage,
	GenderOption,
	OverlayState,
	StudentLevel,
} from '@/lib/types';

export type AccentColor =
	| 'blue'
	| 'green'
	| 'orange'
	| 'red'
	| 'pink'
	| 'yellow';

export const ACCENT_COLORS: {
	value: AccentColor;
	label: string;
	bgClass: string;
	hoverClass: string;
	ringClass: string;
}[] = [
	{
		value: 'blue',
		label: 'Blue',
		bgClass: 'bg-blue-600',
		hoverClass: 'hover:bg-blue-700',
		ringClass: 'ring-blue-600',
	},
	{
		value: 'green',
		label: 'Green',
		bgClass: 'bg-green-600',
		hoverClass: 'hover:bg-green-700',
		ringClass: 'ring-green-600',
	},
	{
		value: 'orange',
		label: 'Orange',
		bgClass: 'bg-orange-500',
		hoverClass: 'hover:bg-orange-600',
		ringClass: 'ring-orange-500',
	},
	{
		value: 'red',
		label: 'Red',
		bgClass: 'bg-red-500',
		hoverClass: 'hover:bg-red-600',
		ringClass: 'ring-red-500',
	},
	{
		value: 'pink',
		label: 'Pink',
		bgClass: 'bg-pink-500',
		hoverClass: 'hover:bg-pink-600',
		ringClass: 'ring-pink-500',
	},
	{
		value: 'yellow',
		label: 'Yellow',
		bgClass: 'bg-yellow-500',
		hoverClass: 'hover:bg-yellow-600',
		ringClass: 'ring-yellow-500',
	},
];

const DEFAULT_CONFIG: ChatConfig = {
	foreignLanguage: 'Russian',
	nativeLanguage: 'English',
	studentLevel: 'B1' as StudentLevel,
	tutorGender: 'female',
	studentGender: 'male',
};

interface KorliChatContextValue {
	// Chat state from useKorliChat
	threadId: string | null;
	config: ChatConfig | null;
	messages: ChatMessage[];
	activeOverlay: OverlayState | null;
	isStarting: boolean;
	isStreaming: boolean;
	error: string | null;
	hasSession: boolean;

	// Form config
	formConfig: ChatConfig;
	tutorGender: GenderOption;
	studentGender: GenderOption;
	showGenderSettings: boolean;
	accentColor: AccentColor;

	// Actions
	handleConfigChange: (field: keyof ChatConfig) => (value: string) => void;
	handleStartSession: (event: FormEvent) => Promise<void>;
	handleReset: () => void;
	handleSendText: (message: string) => Promise<void>;
	toggleOverlay: (
		messageId: string,
		type: 'translation' | 'correction'
	) => void;
	setTutorGender: (gender: GenderOption) => void;
	setStudentGender: (gender: GenderOption) => void;
	setShowGenderSettings: (show: boolean) => void;
	setAccentColor: (color: AccentColor) => void;
}

const KorliChatContext = createContext<KorliChatContextValue | null>(null);

export function KorliChatProvider({ children }: { children: ReactNode }) {
	const {
		threadId,
		config,
		messages,
		activeOverlay,
		isStarting,
		isStreaming,
		error,
		startConversation,
		sendTextMessage,
		toggleOverlay,
		resetChat,
	} = useKorliChat();

	const [formConfig, setFormConfig] = useState<ChatConfig>(DEFAULT_CONFIG);
	const [tutorGender, setTutorGender] = useState<GenderOption>('female');
	const [studentGender, setStudentGender] = useState<GenderOption>('male');
	const [showGenderSettings, setShowGenderSettings] = useState(false);
	const [accentColor, setAccentColor] = useState<AccentColor>('blue');

	const hasSession = Boolean(threadId);

	const handleConfigChange = useCallback(
		(field: keyof ChatConfig) => (value: string) => {
			setFormConfig((prev) => ({ ...prev, [field]: value }));
		},
		[]
	);

	const handleStartSession = useCallback(
		async (event: FormEvent) => {
			event.preventDefault();
			try {
				await startConversation({
					...formConfig,
					tutorGender,
					studentGender,
				});
			} catch (err) {
				console.error('Failed to start session:', err);
			}
		},
		[formConfig, tutorGender, studentGender, startConversation]
	);

	const handleReset = useCallback(() => {
		resetChat();
		setFormConfig(DEFAULT_CONFIG);
		setTutorGender('female');
		setStudentGender('male');
	}, [resetChat]);

	const handleSendText = useCallback(
		async (message: string) => {
			await sendTextMessage(message, tutorGender, studentGender);
		},
		[sendTextMessage, tutorGender, studentGender]
	);

	const value: KorliChatContextValue = {
		threadId,
		config,
		messages,
		activeOverlay,
		isStarting,
		isStreaming,
		error,
		hasSession,
		formConfig,
		tutorGender,
		studentGender,
		showGenderSettings,
		accentColor,
		handleConfigChange,
		handleStartSession,
		handleReset,
		handleSendText,
		toggleOverlay,
		setTutorGender,
		setStudentGender,
		setShowGenderSettings,
		setAccentColor,
	};

	return (
		<KorliChatContext.Provider value={value}>
			{children}
		</KorliChatContext.Provider>
	);
}

export function useKorliChatContext() {
	const context = useContext(KorliChatContext);
	if (!context) {
		throw new Error(
			'useKorliChatContext must be used within a KorliChatProvider'
		);
	}
	return context;
}
