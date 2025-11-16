import { type FormEvent, useMemo, useState } from 'react';

import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { LANGUAGES } from './constants/languages';
import { useChat } from './hooks/useChat';
import type { ChatConfig, GenderOption, StudentLevel } from './types/chat';

const LEVELS: StudentLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const GENDERS: GenderOption[] = ['female', 'male'];

const initialConfig: ChatConfig = {
	nativeLanguage: 'English',
	foreignLanguage: 'Spanish',
	studentLevel: 'A2',
	tutorGender: 'female',
	studentGender: 'female',
};

function App() {
	const [form, setForm] = useState<ChatConfig>(initialConfig);
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
			await startConversation(form);
		} catch {
			// error handled within the hook
		}
	};

	return (
		<div className="min-h-screen bg-slate-50 px-4 py-6">
			<main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
				<header className="text-center">
					<p className="text-xs uppercase tracking-[0.35em] text-blue-600">
						Korli Tutor
					</p>
					<h1 className="mt-2 text-3xl font-semibold tracking-tight text-slate-900 sm:text-4xl">
						AI Language Coach
					</h1>
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
				<section className="flex flex-col rounded-3xl border border-slate-200 bg-white shadow-lg">
					<ChatWindow
						messages={messages}
						activeOverlay={activeOverlay}
						onToggleOverlay={toggleOverlay}
						isStreaming={isStreaming}
						config={form}
						languages={sortedLanguages}
						levels={LEVELS}
						genders={GENDERS}
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
							onSendText={sendTextMessage}
							onSendAudio={sendAudioMessage}
						/>
					)}
				</section>
			</main>
		</div>
	);
}

export default App;
