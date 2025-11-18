import type { ChatMessage } from '../types/chat';
import { AudioPlayer } from './AudioPlayer';
import { Languages } from 'lucide-react';

interface MessageBubbleProps {
	message: ChatMessage;
	showTranslation?: boolean;
	showCorrection?: boolean;
	onToggleTranslation?: () => void;
	onToggleCorrection?: () => void;
}

const TranslationIcon = ({ active }: { active?: boolean }) => (
	<Languages
		className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
			active ? 'text-blue-600' : 'text-slate-600'
		}`}
	/>
);

const CorrectionIcon = ({ active }: { active?: boolean }) => (
	<svg
		viewBox="0 0 24 24"
		className={`h-3.5 w-3.5 sm:h-4 sm:w-4 ${
			active ? 'text-amber-600' : 'text-slate-600'
		}`}
		fill="currentColor"
	>
		<path d="M12 2 3 6v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V6z" />
	</svg>
);

const IconButton = ({
	label,
	active,
	onClick,
	icon,
}: {
	label: string;
	active?: boolean;
	icon: React.ReactNode;
	onClick?: () => void;
}) => (
	<button
		type="button"
		onClick={onClick}
		aria-label={label}
		className={`inline-flex h-6 sm:h-7 items-center gap-1.5 rounded-full bg-white px-1.5 sm:px-2 text-[10px] font-medium transition ${
			active
				? 'bg-gray-100 text-blue-700 hover:bg-gray-200'
				: 'text-slate-700 hover:bg-gray-100'
		}`}
	>
		{icon}
		<span className="hidden sm:inline">{label}</span>
	</button>
);

// User Message Component - Right-aligned bubble (iMessage style)
const UserMessage = ({ message }: { message: ChatMessage }) => {
	if (message.role !== 'user') return null;

	return (
		<div className="flex justify-end" data-message-id={message.id}>
			<div className="flex flex-col items-end gap-2 max-w-[85%] sm:max-w-[70%]">
				<div className="rounded-3xl bg-blue-100 px-2.5 sm:px-3 py-1.5 sm:py-2 text-xs leading-relaxed text-blue-900 shadow-sm sm:text-sm">
					<p className="whitespace-pre-wrap">{message.content}</p>
					{message.status === 'transcribing' && (
						<span className="mt-2 inline-flex items-center gap-2 text-xs text-blue-700">
							<span className="h-2 w-2 animate-ping rounded-full bg-blue-600" />
							Transcribing audio…
						</span>
					)}
				</div>

				{message.userAudio?.localUrl && (
					<AudioPlayer
						src={message.userAudio.localUrl}
						label="Play original recording"
						tone="light"
						size="sm"
					/>
				)}
			</div>
		</div>
	);
};

// AI Message Component - Full-width ChatGPT-style card
const AssistantMessage = ({
	message,
	showTranslation,
	onToggleTranslation,
	previousUserMessage,
	showCorrection,
	onToggleCorrection,
}: {
	message: ChatMessage;
	showTranslation?: boolean;
	onToggleTranslation?: () => void;
	previousUserMessage?: ChatMessage;
	showCorrection?: boolean;
	onToggleCorrection?: () => void;
}) => {
	if (message.role !== 'ai') return null;

	const translationAvailable = Boolean(message.translation);

	// Check if previous user message has corrections
	const correctionAvailable =
		previousUserMessage?.role === 'user' &&
		Boolean(previousUserMessage.correction?.corrected);

	// Check if AI TTS of user's message is available (even without corrections)
	const userTTSAvailable =
		previousUserMessage?.role === 'user' &&
		Boolean(previousUserMessage.correction?.audioUrl);

	return (
		<div className="flex justify-start" data-message-id={message.id}>
			<div className="w-full max-w-full rounded-xl bg-white p-0">
				{/* Main AI text */}
				<div className="text-xs leading-relaxed text-slate-900 sm:text-sm">
					<p className="whitespace-pre-wrap">{message.content}</p>
					{message.isStreaming && !message.content && (
						<span className="inline-flex items-center gap-2 text-xs text-slate-500">
							<span className="h-2 w-2 animate-pulse rounded-full bg-blue-500" />
							Korli is responding…
						</span>
					)}
				</div>

				{/* Actions row - with left and right sections */}
				<div className="flex flex-wrap items-center justify-between gap-2">
					{/* Left side: Translation, AI audio, and corrections button */}
					<div className="flex flex-wrap items-center gap-2">
						{translationAvailable && (
							<IconButton
								label="Translate"
								active={showTranslation}
								onClick={onToggleTranslation}
								icon={<TranslationIcon active={showTranslation} />}
							/>
						)}

						{message.audioUrl && (
							<AudioPlayer
								src={message.audioUrl}
								label="Play audio"
								tone="light"
								size="sm"
							/>
						)}

						{correctionAvailable && (
							<IconButton
								label="Correction"
								active={showCorrection}
								onClick={onToggleCorrection}
								icon={<CorrectionIcon active={showCorrection} />}
							/>
						)}
					</div>

					{/* Right side: User's audio playback (AI TTS) - only show if no corrections */}
					{userTTSAvailable && !correctionAvailable && (
						<div className="ml-auto">
							<AudioPlayer
								src={previousUserMessage.correction?.audioUrl}
								label="Play your message"
								tone="light"
								size="sm"
							/>
						</div>
					)}
				</div>

				{/* Translation section (inline) */}
				{showTranslation && message.translation && (
					<div className="mt-1.5 sm:mt-2 rounded-lg border border-blue-200 bg-blue-50 p-2">
						<p className="text-xs font-semibold uppercase tracking-wide text-blue-700">
							Translation
						</p>
						<p className="mt-1 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
							{message.translation}
						</p>
					</div>
				)}

				{/* Corrections section (inline) - showing corrections from previous user message */}
				{showCorrection &&
					previousUserMessage?.role === 'user' &&
					previousUserMessage.correction && (
						<div className="mt-1.5 sm:mt-2 rounded-lg border border-amber-200 bg-amber-50 p-2 relative">
							<p className="text-xs font-semibold uppercase tracking-wide text-amber-700">
								Corrections
							</p>
							{previousUserMessage.correction.audioUrl && (
								<div className="absolute top-2 right-2 sm:hidden">
									<AudioPlayer
										src={previousUserMessage.correction.audioUrl}
										label="Play corrected audio"
										tone="light"
										size="sm"
									/>
								</div>
							)}

							{previousUserMessage.correction.correctedMessage && (
								<p className="mt-1 whitespace-pre-wrap text-xs font-medium leading-relaxed text-slate-900">
									{previousUserMessage.correction.correctedMessage}
								</p>
							)}

							{previousUserMessage.correction.translation && (
								<p className="mt-0.5 whitespace-pre-wrap text-xs leading-relaxed text-slate-700">
									{previousUserMessage.correction.translation}
								</p>
							)}

							{previousUserMessage.correction.audioUrl && (
								<div className="mt-2 hidden sm:block">
									<AudioPlayer
										src={previousUserMessage.correction.audioUrl}
										label="Play corrected audio"
										tone="light"
										size="sm"
									/>
								</div>
							)}
						</div>
					)}
			</div>
		</div>
	);
};

interface MessageBubbleExtendedProps extends MessageBubbleProps {
	previousUserMessage?: ChatMessage;
}

export const MessageBubble = ({
	message,
	showTranslation,
	showCorrection,
	onToggleTranslation,
	onToggleCorrection,
	previousUserMessage,
}: MessageBubbleExtendedProps) => {
	if (message.role === 'user') {
		return <UserMessage message={message} />;
	}

	return (
		<AssistantMessage
			message={message}
			showTranslation={showTranslation}
			showCorrection={showCorrection}
			onToggleTranslation={onToggleTranslation}
			onToggleCorrection={onToggleCorrection}
			previousUserMessage={previousUserMessage}
		/>
	);
};
