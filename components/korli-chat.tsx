'use client';

import { ConfigurationForm } from '@/components/configuration-form';
import { GenderSettings } from '@/components/gender-settings';
import { KorliHeader } from '@/components/korli-header';
import { KorliInput } from '@/components/korli-input';
import { KorliMessages } from '@/components/korli-messages';
import { useKorliChatContext } from '@/contexts/korli-chat-context';

export function KorliChat() {
	const {
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
	} = useKorliChatContext();

	return (
		<div className="flex h-dvh flex-col bg-background">
			<KorliHeader />

			<div className="flex flex-1 flex-col overflow-hidden">
				{!hasSession ? (
					<ConfigurationForm
						config={formConfig}
						onChange={handleConfigChange}
						onSubmit={handleStartSession}
						onReset={handleReset}
						hasSession={hasSession}
						isStarting={isStarting}
						tutorGender={tutorGender}
						studentGender={studentGender}
						onTutorGenderChange={setTutorGender}
						onStudentGenderChange={setStudentGender}
					/>
				) : (
					<div className="flex flex-1 flex-col overflow-hidden">
						<ConfigurationForm
							config={config || formConfig}
							onChange={handleConfigChange}
							onSubmit={handleStartSession}
							onReset={handleReset}
							hasSession={hasSession}
							isStarting={isStarting}
							tutorGender={tutorGender}
							studentGender={studentGender}
							onTutorGenderChange={setTutorGender}
							onStudentGenderChange={setStudentGender}
						/>

						<div className="flex-1 overflow-hidden px-4 py-3">
							<div className="mx-auto flex h-full max-w-5xl flex-col">
								<KorliMessages
									messages={messages}
									activeOverlay={activeOverlay}
									onToggleOverlay={toggleOverlay}
									accentColor={accentColor}
								/>
							</div>
						</div>

						<div className="px-4 pb-6 pt-3">
							<div className="mx-auto max-w-5xl">
								{error && (
									<p className="mb-2 text-sm text-destructive">{error}</p>
								)}
								<KorliInput
									disabled={isStarting}
									hasSession={hasSession}
									isStreaming={isStreaming}
									onSendText={handleSendText}
									foreignLanguage={
										config?.foreignLanguage || formConfig.foreignLanguage
									}
									onOpenGenderSettings={() => setShowGenderSettings(true)}
									accentColor={accentColor}
								/>
							</div>
						</div>
					</div>
				)}
			</div>

			<GenderSettings
				open={showGenderSettings}
				onOpenChange={setShowGenderSettings}
				tutorGender={tutorGender}
				studentGender={studentGender}
				onTutorGenderChange={setTutorGender}
				onStudentGenderChange={setStudentGender}
				accentColor={accentColor}
				onAccentColorChange={setAccentColor}
			/>
		</div>
	);
}
