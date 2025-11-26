import { type FormEvent, useEffect, useMemo, useState } from 'react';
import { Settings as SettingsIcon } from 'lucide-react';

import { AppInformation } from './components/AppInformation';
import { ChatWindow } from './components/ChatWindow';
import { GenderSettings } from './components/GenderSettings';
import { InputBar } from './components/InputBar';
import { NavigationTabs } from './components/NavigationTabs';
import { Settings } from './components/Settings';
import { LANGUAGES } from './constants/languages';
import { useTheme } from './contexts/ThemeContext';
import { useChat } from './hooks/useChat';
import type { ChatConfig, GenderOption, StudentLevel } from './types/chat';
import { darkModeColors, getThemeColorClasses } from './utils/theme';

const LEVELS: StudentLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];

const initialConfig: ChatConfig = {
	nativeLanguage: 'English',
	foreignLanguage: 'Russian',
	studentLevel: 'A2',
	tutorGender: 'female',
	studentGender: 'female',
};

function App() {
	const { theme } = useTheme();
	const [form, setForm] = useState<ChatConfig>(initialConfig);
	const [tutorGender, setTutorGender] = useState<GenderOption>('female');
	const [studentGender, setStudentGender] = useState<GenderOption>('female');
	const [genderChanged, setGenderChanged] = useState(false);
	const [showGenderSettings, setShowGenderSettings] = useState(false);
	const [showSettings, setShowSettings] = useState(false);
	const [activePage, setActivePage] = useState<'chat' | 'info'>('chat');

	const {
		threadId,
		messages,
		activeOverlay,
		isStarting,
		isStreaming,
		error,
		startConversation,
		sendTextMessage,
		toggleOverlay,
		resetChat,
		clearError,
	} = useChat();

	const hasSession = Boolean(threadId);
	const sortedLanguages = useMemo(() => [...LANGUAGES].sort(), []);

	// Enable scrolling on info page, disable on chat page
	useEffect(() => {
		const rootElement = document.getElementById('root');
		if (activePage === 'info') {
			document.documentElement.style.overflow = 'auto';
			document.body.style.overflow = 'auto';
			if (rootElement) {
				rootElement.style.overflow = 'auto';
			}
		} else {
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
			if (rootElement) {
				rootElement.style.overflow = 'hidden';
			}
		}

		// Cleanup function to restore defaults when component unmounts
		return () => {
			document.documentElement.style.overflow = 'hidden';
			document.body.style.overflow = 'hidden';
			if (rootElement) {
				rootElement.style.overflow = 'hidden';
			}
		};
	}, [activePage]);

	const handleField = (field: keyof ChatConfig) => (value: string) => {
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

	const handleApplyGenderSettings = (
		newTutorGender: GenderOption,
		newStudentGender: GenderOption
	) => {
		const changed =
			newTutorGender !== tutorGender || newStudentGender !== studentGender;
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

	const handleOpenSettings = () => {
		setShowSettings(true);
	};

	const handleCloseSettings = () => {
		setShowSettings(false);
	};

	const handleSendText = async (message: string) => {
		if (genderChanged) {
			await sendTextMessage(message, tutorGender, studentGender);
			setGenderChanged(false);
		} else {
			await sendTextMessage(message);
		}
	};

	const handlePageChange = (page: 'chat' | 'info') => {
		setActivePage(page);
	};

	return (
		<div
			className={`flex flex-col ${
				activePage === 'chat'
					? 'h-screen h-[100dvh] overflow-hidden fixed inset-0'
					: 'min-h-screen min-h-[100dvh]'
			}`}
		>
			{/* Unified Header - Navigation, Logo, Settings */}
			<header className="fixed top-0 left-0 right-0 z-40 bg-transparent px-4 pt-2 sm:pt-3 pb-2 sm:pb-3 mobile-header-padding">
				<div className="mx-auto relative flex max-w-5xl items-center">
					{/* Left: Page slider (chat / info) */}
					<div className="flex-shrink-0 w-[90px] sm:w-[110px]">
						<NavigationTabs
							activePage={activePage}
							onPageChange={handlePageChange}
						/>
					</div>

					{/* Center: Logo - absolutely positioned for perfect centering (only on chat page) */}
					{activePage === 'chat' && (
						<div className="absolute left-1/2 -translate-x-1/2">
							<img
								src={
									theme.mode === 'dark'
										? '/korli-logo-white.png'
										: '/korli-logo.png'
								}
								alt="Korli - AI Language Coach"
								className="h-6 w-auto sm:h-8 mobile-header-logo"
							/>
						</div>
					)}

					{/* Right: Settings button */}
					<div className="flex-shrink-0 ml-auto w-[90px] sm:w-[110px] flex justify-end">
						<button
							type="button"
							onClick={handleOpenSettings}
							className={`p-1.5 sm:p-2 ${darkModeColors.textPlaceholder} transition ${darkModeColors.bgHover} hover:text-slate-600 dark:hover:text-white rounded-full`}
							aria-label="Settings"
						>
							<SettingsIcon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
						</button>
					</div>
				</div>
			</header>

			<main
				className={`mx-auto flex w-full ${
					activePage === 'info' ? '' : 'max-w-5xl'
				} ${
					activePage === 'chat'
						? 'h-full md:h-[calc(100%-1.5rem)] overflow-hidden'
						: 'flex-1'
				} flex-col gap-2 sm:gap-3 mt-14 sm:mt-16 mobile-main-margin px-4 ${
					activePage === 'info' ? 'pb-5 sm:pb-6' : ''
				} ${activePage === 'chat' ? 'chat-container-mobile pb-0 md:pb-6' : ''}`}
			>
				{error && (
					<div className="flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-700">
						<p>{error}</p>
						<button
							type="button"
							onClick={clearError}
							className="rounded-full border border-red-300/30 px-3 py-1 text-xs uppercase tracking-wide text-red-700 transition hover:bg-red-500/10"
						>
							Dismiss
						</button>
					</div>
				)}

				{activePage === 'chat' ? (
					/* Unified chat area - configuration, messages, and input */
					<section
						className={[
							'flex flex-1 flex-col overflow-hidden rounded-3xl h-full',
							'shadow-lg dark:shadow-[0_10px_25px_-5px_rgba(0,0,0,0.3),0_8px_10px_-6px_rgba(0,0,0,0.2)]',
							hasSession
								? darkModeColors.border
								: `border ${getThemeColorClasses(theme.color).border}`,
							darkModeColors.bgSurface,
						].join(' ')}
					>
						<ChatWindow
							messages={messages}
							activeOverlay={activeOverlay}
							onToggleOverlay={toggleOverlay}
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
								foreignLanguage={form.foreignLanguage}
								onOpenGenderSettings={handleOpenGenderSettings}
							/>
						)}
					</section>
				) : (
					<AppInformation />
				)}

				{/* Gender Settings Modal */}
				{showGenderSettings && (
					<GenderSettings
						tutorGender={tutorGender}
						studentGender={studentGender}
						onApply={handleApplyGenderSettings}
						onClose={handleCloseGenderSettings}
					/>
				)}

				{/* Settings Modal */}
				{showSettings && <Settings onClose={handleCloseSettings} />}
			</main>
		</div>
	);
}

export default App;
