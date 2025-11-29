import { Languages, UserCircle2, Mail, Linkedin, Settings } from 'lucide-react';
import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeColorClasses } from '../utils/theme';
import { LANGUAGES } from '../constants/languages';
import { THEME_COLORS } from '../types/theme';

export const AppInformation = () => {
	const { theme, setColor, setMode } = useTheme();
	const languageCount = LANGUAGES.length;

	// Icon components that are theme-aware
	const TranslationIcon = () => (
		<Languages
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.messageAiIconText}`}
		/>
	);

	const AudioIcon = () => (
		<svg
			viewBox="0 0 24 24"
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.messageAiIconText}`}
			fill="currentColor"
		>
			<path d="M7 4.5v15l11-7.5z" />
		</svg>
	);

	const CorrectionIcon = () => (
		<svg
			viewBox="0 0 24 24"
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.messageAiIconText}`}
			fill="currentColor"
		>
			<path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6z" />
		</svg>
	);

	const PersonaIcon = () => (
		<UserCircle2
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.inputIconText}`}
		/>
	);

	const MicIcon = () => (
		<svg
			viewBox="0 0 24 24"
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.inputIconText}`}
			fill="currentColor"
		>
			<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm6-3a1 1 0 0 1 2 0 8 8 0 0 1-7 7.94V22h-2v-2.06A8 8 0 0 1 4 12a1 1 0 0 1 2 0 6 6 0 0 0 12 0z" />
		</svg>
	);

	const SendIcon = () => (
		<svg
			viewBox="0 0 24 24"
			className={`h-5 w-5 sm:h-6 sm:w-6 ${darkModeColors.inputIconText}`}
			fill="currentColor"
		>
			<path d="M3.4 20.4 21 12 3.4 3.6l.05 6.9L15 12l-11.55 1.5z" />
		</svg>
	);

	return (
		<div className="w-full">
			{/* Hero Section */}
			<section
				className={`w-full py-6 sm:py-8 md:py-10 ${darkModeColors.infoPageSection1} rounded-t-3xl`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center space-y-3">
						<div className="flex justify-center mb-2">
							<img
								src={
									theme.mode === 'dark'
										? '/korli-logo-white.png'
										: '/korli-logo.png'
								}
								alt="Korli - AI Language Coach"
								className="h-12 w-auto sm:h-16 md:h-20"
							/>
						</div>
						<p
							className={`text-lg sm:text-xl md:text-2xl ${darkModeColors.textSecondary} max-w-3xl mx-auto`}
						>
							Learn languages through conversation at your level
						</p>
					</div>
				</div>
			</section>

			{/* Section 1: Language Support & Adaptive Learning */}
			<section
				className={`w-full py-12 sm:py-16 md:py-20 ${darkModeColors.infoPageSection2}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						{/* Language Support */}
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className={`p-3 rounded-xl ${darkModeColors.bgHover}`}>
									<svg
										viewBox="0 0 24 24"
										className={`h-8 w-8 ${darkModeColors.textPrimary}`}
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<circle cx="12" cy="12" r="10" />
										<path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z" />
									</svg>
								</div>
								<div>
									<h2
										className={`text-2xl sm:text-3xl font-bold ${darkModeColors.textPrimary}`}
									>
										{languageCount} Languages
									</h2>
								</div>
							</div>
							<p
								className={`text-base sm:text-lg leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Practice with {languageCount} languages including Spanish,
								French, German, Japanese, Chinese, Arabic, and many more. Korli
								supports a wide range of languages to help you learn.
							</p>
						</div>

						{/* Adaptive Learning */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-6`}
						>
							<div className="flex items-center gap-4">
								<div className={`p-3 rounded-xl ${darkModeColors.bgHover}`}>
									<svg
										viewBox="0 0 24 24"
										className={`h-8 w-8 ${darkModeColors.textPrimary}`}
										fill="none"
										stroke="currentColor"
										strokeWidth="2"
									>
										<path d="M12 2L2 7l10 5 10-5-10-5z" />
										<path d="M2 17l10 5 10-5M2 12l10 5 10-5" />
									</svg>
								</div>
								<h2
									className={`text-2xl sm:text-3xl font-bold ${darkModeColors.textPrimary}`}
								>
									Learn at Your Level
								</h2>
							</div>
							<p
								className={`text-base sm:text-lg leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Korli adapts to your proficiency level (A1-C2). The AI tutor
								adjusts vocabulary, grammar complexity, and conversation style
								to match your current abilities.
							</p>
							<div className="flex items-center gap-2">
								{['A1', 'A2', 'B1', 'B2', 'C1', 'C2'].map((level, idx) => (
									<div
										key={level}
										className={`flex-1 text-center py-2 rounded-md text-sm font-semibold border ${
											idx === 1
												? `${
														getThemeColorClasses(theme.color).primary
												  } text-white ${
														getThemeColorClasses(theme.color).border
												  }`
												: `${darkModeColors.bgHover} ${darkModeColors.textSecondary} ${darkModeColors.borderChatSeparator}`
										}`}
									>
										{level}
									</div>
								))}
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Section 2: Core Features (Translation, Audio, Corrections) */}
			<section
				className={`w-full py-12 sm:py-16 md:py-20 ${darkModeColors.infoPageSection1}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2
							className={`text-3xl sm:text-4xl font-bold ${darkModeColors.textPrimary} mb-4`}
						>
							Powerful Learning Features
						</h2>
						<p
							className={`text-lg ${darkModeColors.textSecondary} max-w-2xl mx-auto`}
						>
							Everything you need to master a new language
						</p>
					</div>
					<div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
						{/* Translation Feature */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-4 ${
								darkModeColors.bgHover
							} transition-shadow hover:shadow-lg`}
						>
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${darkModeColors.bgHover}`}>
									<TranslationIcon />
								</div>
								<h3
									className={`text-xl font-bold ${darkModeColors.textPrimary}`}
								>
									Instant Translations
								</h3>
							</div>
							<p
								className={`text-sm sm:text-base leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Every AI message can be translated to your native language.
								Click the translation icon on any message to see the
								translation.
							</p>
							<div className="pt-2">
								<img
									src="/translation-example.png"
									alt="Translation example"
									className={`w-full max-w-md mx-auto rounded-lg border ${darkModeColors.border}`}
								/>
							</div>
							<p className={`text-xs ${darkModeColors.textMuted} italic`}>
								Click the translation icon on any message
							</p>
						</div>

						{/* Audio Feature */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-4 ${
								darkModeColors.bgHover
							} transition-shadow hover:shadow-lg`}
						>
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${darkModeColors.bgHover}`}>
									<AudioIcon />
								</div>
								<h3
									className={`text-xl font-bold ${darkModeColors.textPrimary}`}
								>
									Audio Playback
								</h3>
							</div>
							<p
								className={`text-sm sm:text-base leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Every AI message includes audio playback. Click the audio button
								to hear pronunciations and practice your listening skills.
							</p>
							<div
								className={`inline-flex items-center gap-2 px-3 py-2 rounded-full border ${darkModeColors.messageAiIconBorder} ${darkModeColors.messageAiIconBg} ${darkModeColors.messageAiIconText}`}
							>
								<AudioIcon />
								<span className="text-xs sm:text-sm font-medium">
									Play audio
								</span>
							</div>
							<p className={`text-xs ${darkModeColors.textMuted} italic`}>
								Click the audio button to hear pronunciations
							</p>
						</div>

						{/* Corrections Feature */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-4 ${
								darkModeColors.bgHover
							} transition-shadow hover:shadow-lg`}
						>
							<div className="flex items-center gap-3">
								<div className={`p-2 rounded-lg ${darkModeColors.bgHover}`}>
									<CorrectionIcon />
								</div>
								<h3
									className={`text-xl font-bold ${darkModeColors.textPrimary}`}
								>
									Smart Corrections
								</h3>
							</div>
							<p
								className={`text-sm sm:text-base leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Get instant grammar corrections with explanations. See the
								corrected version and hear it pronounced. If your message is
								correct, you'll hear it back under the AI response.
							</p>
							<div className="pt-2">
								<img
									src="/correction-example.png"
									alt="Correction example"
									className={`w-full max-w-xs mx-auto rounded-lg border ${darkModeColors.border}`}
								/>
							</div>
							<p className={`text-xs ${darkModeColors.textMuted} italic`}>
								If your message is correct, hear it back under the AI response
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Section 3: Voice Recording */}
			<section
				className={`w-full py-12 sm:py-16 md:py-20 ${darkModeColors.infoPageSection2}`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
						<div className="space-y-6">
							<div className="flex items-center gap-4">
								<div className={`p-3 rounded-xl ${darkModeColors.bgHover}`}>
									<MicIcon />
								</div>
								<h2
									className={`text-2xl sm:text-3xl font-bold ${darkModeColors.textPrimary}`}
								>
									Voice Messages
								</h2>
							</div>
							<p
								className={`text-base sm:text-lg leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Record audio messages that get automatically transcribed to
								text. Watch the waveform as you speak, then accept or cancel.
								After transcription, listen back with the "Transcribed audio"
								button above the input.
							</p>
							<div className="flex items-center gap-3 pt-4">
								<div
									className={`flex items-center gap-2 px-4 py-2 rounded-full border ${darkModeColors.inputIconBorder} ${darkModeColors.inputIconBg}`}
								>
									<MicIcon />
									<span className="text-sm">Record</span>
								</div>
								<span className={`text-sm ${darkModeColors.textMuted}`}>→</span>
								<div
									className={`flex items-center gap-2 px-4 py-2 rounded-full border ${darkModeColors.inputIconBorder} ${darkModeColors.inputIconBg}`}
								>
									<SendIcon />
									<span className="text-sm">Send</span>
								</div>
							</div>
						</div>
						<div className="pt-4">
							<img
								src={
									theme.mode === 'dark'
										? '/wavesurfer-dark.png'
										: '/wavesurfer-light.png'
								}
								alt="Voice recording interface"
								className={`w-full rounded-lg border ${darkModeColors.border}`}
							/>
						</div>
					</div>
				</div>
			</section>

			{/* Section 4: Customization (Theme & Gender) */}
			<section
				className={`w-full py-12 sm:py-16 md:py-20 ${darkModeColors.infoPageSection1} rounded-b-3xl`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="text-center mb-12">
						<h2
							className={`text-3xl sm:text-4xl font-bold ${darkModeColors.textPrimary} mb-4`}
						>
							Customize Your Experience
						</h2>
						<p
							className={`text-lg ${darkModeColors.textSecondary} max-w-2xl mx-auto`}
						>
							Make Korli work the way you want
						</p>
					</div>
					<div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
						{/* Theme Customization */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-6`}
						>
							<div className="flex items-center gap-4">
								<div className={`p-3 rounded-xl ${darkModeColors.bgHover}`}>
									<Settings
										className={`h-8 w-8 ${darkModeColors.textPrimary}`}
									/>
								</div>
								<h3
									className={`text-2xl font-bold ${darkModeColors.textPrimary}`}
								>
									Theme & Mode
								</h3>
							</div>
							<p
								className={`text-base leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Choose from 6 vibrant theme colors and switch between light and
								dark mode to match your preference.
							</p>
							<div className="space-y-4">
								<div>
									<p
										className={`text-sm font-semibold mb-3 ${darkModeColors.textSecondary}`}
									>
										Theme Colors
									</p>
									<div className="flex flex-wrap gap-3">
										{THEME_COLORS.map((color) => {
											const colorClasses = getThemeColorClasses(color);
											return (
												<button
													key={color}
													type="button"
													onClick={() => setColor(color)}
													className={`w-12 h-12 rounded-full ${
														colorClasses.primary
													} border-2 ${
														theme.color === color
															? 'border-slate-900 dark:border-white ring-2 ring-offset-2 ring-offset-white dark:ring-offset-slate-800'
															: 'border-transparent hover:ring-2 hover:ring-offset-2 hover:ring-offset-white dark:hover:ring-offset-slate-800 hover:ring-slate-300 dark:hover:ring-slate-500'
													} transition-all cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2`}
													title={color.charAt(0).toUpperCase() + color.slice(1)}
													aria-label={`Select ${color} theme`}
												/>
											);
										})}
									</div>
								</div>
								<div>
									<p
										className={`text-sm font-semibold mb-3 ${darkModeColors.textSecondary}`}
									>
										Mode
									</p>
									<div className="flex gap-3">
										<button
											type="button"
											onClick={() => setMode('light')}
											className={`flex-1 px-4 py-3 rounded-lg border transition ${
												theme.mode === 'light'
													? `${darkModeColors.borderChatSeparator} ${darkModeColors.bgHover}`
													: `${darkModeColors.borderChatSeparator} ${darkModeColors.bgSurface} hover:${darkModeColors.bgHover}`
											} text-center text-sm font-medium ${
												darkModeColors.textPrimary
											} focus:outline-none focus:ring-2 focus:ring-offset-2`}
											aria-label="Switch to light mode"
										>
											☀️ Light
										</button>
										<button
											type="button"
											onClick={() => setMode('dark')}
											className={`flex-1 px-4 py-3 rounded-lg border transition ${
												theme.mode === 'dark'
													? `${darkModeColors.borderChatSeparator} ${darkModeColors.bgHover}`
													: `${darkModeColors.borderChatSeparator} ${darkModeColors.bgSurface} hover:${darkModeColors.bgHover}`
											} text-center text-sm font-medium ${
												darkModeColors.textPrimary
											} focus:outline-none focus:ring-2 focus:ring-offset-2`}
											aria-label="Switch to dark mode"
										>
											🌙 Dark
										</button>
									</div>
								</div>
							</div>
							<p className={`text-xs ${darkModeColors.textMuted} italic pt-2`}>
								Click the colors and mode buttons above to change your theme
							</p>
						</div>

						{/* Gender Settings */}
						<div
							className={`rounded-2xl border ${
								getThemeColorClasses(theme.color).border
							} ${darkModeColors.bgSurface} p-6 sm:p-8 space-y-6`}
						>
							<div className="flex items-center gap-4">
								<div className={`p-3 rounded-xl ${darkModeColors.bgHover}`}>
									<PersonaIcon />
								</div>
								<h3
									className={`text-2xl font-bold ${darkModeColors.textPrimary}`}
								>
									Personalize Voices
								</h3>
							</div>
							<p
								className={`text-base leading-relaxed ${darkModeColors.textSecondary}`}
							>
								Choose the gender of both the AI tutor and yourself for more
								personalized conversations. This affects the voice used in audio
								playback.
							</p>
							<div
								className={`inline-flex items-center gap-2 px-4 py-2 rounded-full border ${darkModeColors.inputIconBorder} ${darkModeColors.inputIconBg} ${darkModeColors.inputIconText}`}
							>
								<PersonaIcon />
								<span className="text-sm font-medium">Persona</span>
							</div>
							<p className={`text-xs ${darkModeColors.textMuted} italic`}>
								Click the persona icon in the message bar to change
							</p>
						</div>
					</div>
				</div>
			</section>

			{/* Footer Section */}
			<footer
				className={`w-full py-8 sm:py-10 ${darkModeColors.infoPageSection2} border-t ${darkModeColors.borderChatSeparator} rounded-b-3xl`}
			>
				<div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
					<div className="flex items-center justify-center gap-6 flex-wrap text-center">
						<span
							className={`text-base font-medium ${darkModeColors.textPrimary}`}
						>
							George Wiggam
						</span>
						<a
							href="mailto:georgewiggam8@gmail.com"
							className={`flex items-center gap-2 ${darkModeColors.textSecondary} hover:text-slate-900 dark:hover:text-white transition-colors`}
							aria-label="Email George Wiggam"
						>
							<Mail className="h-5 w-5" />
							<span className="text-sm sm:text-base">
								georgewiggam8@gmail.com
							</span>
						</a>
						<a
							href="https://www.linkedin.com/in/george-wiggam/"
							target="_blank"
							rel="noopener noreferrer"
							className={`flex items-center gap-2 ${darkModeColors.textSecondary} hover:text-slate-900 dark:hover:text-white transition-colors`}
							aria-label="LinkedIn Profile"
						>
							<Linkedin className="h-5 w-5" />
							<span className="text-sm sm:text-base">LinkedIn</span>
						</a>
					</div>
				</div>
			</footer>
		</div>
	);
};
