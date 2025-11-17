import { type FormEvent, useMemo, useState } from 'react';

import { ChatWindow } from './components/ChatWindow';
import { GenderSettings } from './components/GenderSettings';
import { InputBar } from './components/InputBar';
import { LANGUAGES } from './constants/languages';
import { useChat } from './hooks/useChat';
import type { ChatConfig, GenderOption, StudentLevel } from './types/chat';

const LEVELS: StudentLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const initialConfig: ChatConfig = {
	nativeLanguage: 'English',
	foreignLanguage: 'Spanish',
	studentLevel: 'A2',
	tutorGender: 'female',
	studentGender: 'female',
};

function App() {
	const [form, setForm] = useState<ChatConfig>(initialConfig);
	const [tutorGender, setTutorGender] = useState<GenderOption>('female');
	const [studentGender, setStudentGender] = useState<GenderOption>('female');
	const [genderChanged, setGenderChanged] = useState(false);
	const [showGenderSettings, setShowGenderSettings] = useState(false);
	
	const {
		threadId,
		messages,
		activeOverlay,
		isStarting,
		isStreaming,
		error,
		startConversation,
		sendTextMessage,
		sendAudioMessage,
		toggleOverlay,
		resetChat,
		clearError,
	} = useChat();

	const hasSession = Boolean(threadId);
	const sortedLanguages = useMemo(() => [...LANGUAGES].sort(), []);

	const handleField =
		(field: keyof ChatConfig) => (value: string) => {
			setForm((prev) => ({ ...prev, [field]: value }));
		};

	const handleStart = async (event: FormEvent) => {
		event.preventDefault();

		try {
			// Always use female/female for initial conversation
			await startConversation({
				...form,
				tutorGender: 'female',
				studentGender: 'female',
			});
			setTutorGender('female');
			setStudentGender('female');
			setGenderChanged(false);
		} catch {
			// error handled within the hook
		}
	};

	const handleApplyGenderSettings = (newTutorGender: GenderOption, newStudentGender: GenderOption) => {
		const changed = newTutorGender !== tutorGender || newStudentGender !== studentGender;
		setTutorGender(newTutorGender);
		setStudentGender(newStudentGender);
		if (changed) {
			setGenderChanged(true);
		}
	};

	const handleOpenGenderSettings = () => {
		setShowGenderSettings(true);
	};

	const handleCloseGenderSettings = () => {
		setShowGenderSettings(false);
	};

	const handleSendText = async (message: string) => {
		if (genderChanged) {
			await sendTextMessage(message, tutorGender, studentGender);
			setGenderChanged(false);
		} else {
			await sendTextMessage(message);
		}
	};

	const handleSendAudio = async (audioFile: Blob) => {
		if (genderChanged) {
			await sendAudioMessage(audioFile, tutorGender, studentGender);
			setGenderChanged(false);
		} else {
			await sendAudioMessage(audioFile);
		}
	};

	return (
		<div className="flex min-h-screen flex-col bg-slate-50 px-4 py-6">
			<main className="mx-auto flex w-full max-w-5xl flex-1 flex-col gap-6">
				<header className="flex justify-center">
					<img 
						src="/korli-logo.png" 
						alt="Korli - AI Language Coach" 
						className="h-10 w-auto sm:h-11"
					/>
				</header>

				{error && (
					<div className="flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
						<p>{error}</p>
						<button
							type="button"
							onClick={clearError}
							className="rounded-full border border-red-300/30 px-3 py-1 text-xs uppercase tracking-wide text-red-100 transition hover:bg-red-500/20"
						>
							Dismiss
						</button>
					</div>
				)}

			{/* Unified chat area - configuration, messages, and input */}
			<section className="flex flex-1 flex-col overflow-hidden rounded-3xl border border-slate-200 bg-white shadow-lg max-h-[calc(100vh-8rem)]">
				<ChatWindow
					messages={messages}
						activeOverlay={activeOverlay}
						onToggleOverlay={toggleOverlay}
						isStreaming={isStreaming}
						config={form}
						languages={sortedLanguages}
						levels={LEVELS}
						onConfigChange={handleField}
						onStartSession={handleStart}
						onReset={resetChat}
						hasSession={hasSession}
						isStarting={isStarting}
					/>

					{hasSession && (
						<InputBar
							disabled={!hasSession || isStreaming}
							hasSession={hasSession}
							onSendText={handleSendText}
							onSendAudio={handleSendAudio}
							onOpenGenderSettings={handleOpenGenderSettings}
						/>
					)}
				</section>

				{/* Gender Settings Modal */}
				{showGenderSettings && (
					<GenderSettings
						tutorGender={tutorGender}
						studentGender={studentGender}
						onApply={handleApplyGenderSettings}
						onClose={handleCloseGenderSettings}
					/>
				)}
			</main>
		</div>
	);
}

export default App;
