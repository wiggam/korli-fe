import { useCallback, useEffect, useRef, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
import WaveSurfer from 'wavesurfer.js';

import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeButtonClasses } from '../utils/theme';
import { transcribeAudio } from '../lib/api';

interface InputBarProps {
	disabled: boolean;
	hasSession: boolean;
	onSendText: (message: string) => Promise<void>;
	foreignLanguage: string;
	onOpenGenderSettings: () => void;
}

type RecordingState = 'idle' | 'recording' | 'preview';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const MicIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 sm:h-5 sm:w-5"
		fill="currentColor"
	>
		<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm6-3a1 1 0 0 1 2 0 8 8 0 0 1-7 7.94V22h-2v-2.06A8 8 0 0 1 4 12a1 1 0 0 1 2 0 6 6 0 0 0 12 0z" />
	</svg>
);

const SendIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-3.5 w-3.5 sm:h-4 sm:w-4"
		fill="currentColor"
	>
		<path d="M3.4 20.4 21 12 3.4 3.6l.05 6.9L15 12l-11.55 1.5z" />
	</svg>
);

const CheckIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 sm:h-5 sm:w-5"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M20 6L9 17l-5-5" />
	</svg>
);

const XIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 sm:h-5 sm:w-5"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M18 6L6 18M6 6l12 12" />
	</svg>
);

export const InputBar = ({
	disabled,
	hasSession,
	onSendText,
	foreignLanguage,
	onOpenGenderSettings,
}: InputBarProps) => {
	const { theme } = useTheme();

	// Get waveform color to match icon colors (slate-700 in light mode, white in dark mode)
	const waveformColor = theme.mode === 'dark' ? '#ffffff' : '#475569';
	const [text, setText] = useState('');
	const [recordingState, setRecordingState] = useState<RecordingState>('idle');
	const [recordingError, setRecordingError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);
	const [isTranscribing, setIsTranscribing] = useState(false);
	const [transcribedAudioBlob, setTranscribedAudioBlob] = useState<Blob | null>(
		null
	);
	const transcribedAudioUrlRef = useRef<string | null>(null);
	const transcribedAudioRef = useRef<HTMLAudioElement | null>(null);
	const [isPlayingTranscribedAudio, setIsPlayingTranscribedAudio] =
		useState(false);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const recordedSizeRef = useRef(0);
	const sizeExceededRef = useRef(false);
	const previewUrlRef = useRef<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const liveWaveformRef = useRef<HTMLDivElement | null>(null);
	const liveWaveSurferRef = useRef<WaveSurfer | null>(null);
	const recordPluginRef = useRef<InstanceType<typeof RecordPlugin> | null>(
		null
	);
	const shouldTranscribeRef = useRef(false);

	const cleanupStream = () => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		mediaStreamRef.current = null;
	};

	const destroyLiveWaveform = useCallback(() => {
		recordPluginRef.current?.destroy();
		recordPluginRef.current = null;
		liveWaveSurferRef.current?.destroy();
		liveWaveSurferRef.current = null;
	}, []);

	const stopRecording = useCallback(
		(shouldAccept: boolean) => {
			if (!mediaRecorderRef.current) return;

			// Stop the waveform immediately
			destroyLiveWaveform();

			// Store whether we should accept or cancel
			const acceptRecording = shouldAccept;

			mediaRecorderRef.current.onstop = () => {
				cleanupStream();

				if (sizeExceededRef.current) {
					chunksRef.current = [];
					sizeExceededRef.current = false;
					setRecordingState('idle');
					mediaRecorderRef.current = null;
					return;
				}

				if (chunksRef.current.length === 0) {
					setRecordingState('idle');
					mediaRecorderRef.current = null;
					return;
				}

				if (!acceptRecording) {
					// Cancel recording - discard chunks
					chunksRef.current = [];
					setRecordingState('idle');
					mediaRecorderRef.current = null;
					return;
				}

				// Accept recording - create blob but keep recording state
				const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
				chunksRef.current = [];

				if (blob.size === 0) {
					setRecordingState('idle');
					mediaRecorderRef.current = null;
					return;
				}

				// Store blob for transcription, but keep recording state
				setPreviewBlob(blob);
				mediaRecorderRef.current = null;
			};

			mediaRecorderRef.current.stop();
		},
		[destroyLiveWaveform]
	);

	const transcribeAndInsert = useCallback(
		async (blob: Blob) => {
			const textarea = textareaRef.current;
			let startPos = 0;

			if (textarea) {
				startPos = textarea.selectionStart;
			}

			setIsTranscribing(true);
			setRecordingError(null);

			try {
				// Transcribe the audio
				const transcribedText = await transcribeAudio(blob, foreignLanguage);

				if (!transcribedText) {
					throw new Error('No transcription received');
				}

				// Store the audio blob for playback
				setTranscribedAudioBlob(blob);

				// Insert transcribed text at cursor position
				if (textarea) {
					const end = textarea.selectionEnd;
					const newText =
						text.substring(0, startPos) + transcribedText + text.substring(end);
					setText(newText);

					// Set cursor position after inserted text
					setTimeout(() => {
						const newCursorPos = startPos + transcribedText.length;
						textarea.setSelectionRange(newCursorPos, newCursorPos);
						textarea.focus();
						autoResizeTextarea();
					}, 0);
				} else {
					// If textarea is not available, just append to text
					setText((prev) => prev + transcribedText);
				}

				// Clean up preview state but keep the URL for playback
				setPreviewUrl(null);
				previewUrlRef.current = null;
				setPreviewBlob(null);
				setRecordingState('idle');
				shouldTranscribeRef.current = false;
			} catch (err) {
				setRecordingError(
					err instanceof Error ? err.message : 'Unable to transcribe audio.'
				);
				shouldTranscribeRef.current = false;
				// On error, still switch to idle state
				setRecordingState('idle');
				setPreviewBlob(null);
			} finally {
				setIsTranscribing(false);
			}
		},
		[foreignLanguage, text]
	);

	const acceptRecording = useCallback(() => {
		// If we're still recording, stop and transcribe
		if (recordingState === 'recording') {
			shouldTranscribeRef.current = true;
			stopRecording(true);
		}
	}, [stopRecording, recordingState]);

	const cancelRecording = useCallback(() => {
		stopRecording(false);
	}, [stopRecording]);

	const autoResizeTextarea = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		// Reset height to auto to get the correct scrollHeight
		textarea.style.height = 'auto';
		// Set height based on scrollHeight, with a max of ~10 lines (240px)
		// Allow it to expand to show more content
		textarea.style.height = `${Math.min(textarea.scrollHeight, 240)}px`;
	}, []);

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
		// Small delay to allow state to update before resizing
		setTimeout(autoResizeTextarea, 0);
	};

	const startRecording = async () => {
		if (disabled || !hasSession) {
			setRecordingError('Start the tutor session before recording.');
			return;
		}

		// Clean up previous transcribed audio when starting a new recording
		if (transcribedAudioUrlRef.current) {
			URL.revokeObjectURL(transcribedAudioUrlRef.current);
			transcribedAudioUrlRef.current = null;
		}
		setTranscribedAudioBlob(null);
		if (transcribedAudioRef.current) {
			transcribedAudioRef.current.pause();
			transcribedAudioRef.current = null;
		}
		setIsPlayingTranscribedAudio(false);

		if (
			typeof MediaRecorder === 'undefined' ||
			typeof navigator === 'undefined' ||
			!navigator.mediaDevices?.getUserMedia
		) {
			setRecordingError('Your browser does not support audio recording.');
			return;
		}

		try {
			const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
			mediaStreamRef.current = stream;
			const mediaRecorder = new MediaRecorder(stream, {
				mimeType: 'audio/webm',
			});

			setRecordingError(null);
			setRecordingState('recording');
			sizeExceededRef.current = false;
			recordedSizeRef.current = 0;
			chunksRef.current = [];

			mediaRecorder.ondataavailable = (event) => {
				if (!event.data || event.data.size === 0) {
					return;
				}

				recordedSizeRef.current += event.data.size;
				if (recordedSizeRef.current > MAX_AUDIO_BYTES) {
					sizeExceededRef.current = true;
					setRecordingError('Recording stopped: 10MB audio limit reached.');
					stopRecording(false);
					return;
				}

				chunksRef.current.push(event.data);
			};

			mediaRecorder.onerror = (event) => {
				console.error(event.error);
				setRecordingError('Microphone error occurred.');
				stopRecording(false);
			};

			mediaRecorderRef.current = mediaRecorder;
			mediaRecorder.start(250);
		} catch (err) {
			console.error(err);
			setRecordingError(
				err instanceof DOMException && err.name === 'NotAllowedError'
					? 'Microphone permissions are required to record audio.'
					: 'Unable to access the microphone.'
			);
			cleanupStream();
			mediaRecorderRef.current = null;
			setRecordingState('idle');
		}
	};

	useEffect(() => {
		previewUrlRef.current = previewUrl;
	}, [previewUrl]);

	// Transcribe when preview blob is ready and transcription is requested
	useEffect(() => {
		if (
			shouldTranscribeRef.current &&
			previewBlob &&
			recordingState === 'recording' &&
			!isTranscribing
		) {
			void transcribeAndInsert(previewBlob);
		}
	}, [previewBlob, recordingState, transcribeAndInsert, isTranscribing]);

	useEffect(() => {
		if (recordingState !== 'recording') {
			destroyLiveWaveform();
			return;
		}

		if (!mediaStreamRef.current || !liveWaveformRef.current) {
			return;
		}

		const recordPlugin = RecordPlugin.create({
			renderRecordedAudio: false,
			scrollingWaveform: true,
			scrollingWaveformWindow: 0.5,
			continuousWaveform: true,
			continuousWaveformDuration: 0.5,
			mediaRecorderTimeslice: 20,
		});

		const waveSurfer = WaveSurfer.create({
			container: liveWaveformRef.current,
			height: 26,
			waveColor: waveformColor,
			progressColor: waveformColor,
			cursorWidth: 0,
			barHeight: 1.7,
			barWidth: 4,
			barGap: 2,
			barRadius: 4,
			interact: false,
			minPxPerSec: 300,
			normalize: false,
			autoScroll: true,
			autoCenter: true,
			fillParent: true,
			hideScrollbar: true,
			plugins: [recordPlugin],
		});

		recordPlugin.renderMicStream(mediaStreamRef.current);
		liveWaveSurferRef.current = waveSurfer;
		recordPluginRef.current = recordPlugin;

		return () => {
			destroyLiveWaveform();
		};
	}, [waveformColor, destroyLiveWaveform, recordingState]);

	useEffect(
		() => () => {
			cleanupStream();
			mediaRecorderRef.current?.stop();
			destroyLiveWaveform();
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
			}
		},
		[destroyLiveWaveform]
	);

	useEffect(() => {
		if (text === '') {
			const textarea = textareaRef.current;
			if (textarea) {
				textarea.style.height = 'auto';
			}
		}
	}, [text]);

	const sendText = async () => {
		const value = text.trim();
		if (!value || disabled || recordingState !== 'idle') {
			return;
		}

		try {
			await onSendText(value);
			setText('');
			// Reset transcribed audio when sending
			if (transcribedAudioUrlRef.current) {
				URL.revokeObjectURL(transcribedAudioUrlRef.current);
				transcribedAudioUrlRef.current = null;
			}
			setTranscribedAudioBlob(null);
			if (transcribedAudioRef.current) {
				transcribedAudioRef.current.pause();
				transcribedAudioRef.current = null;
			}
			setIsPlayingTranscribedAudio(false);
		} catch (err) {
			setRecordingError(
				err instanceof Error ? err.message : 'Unable to send message.'
			);
		}
	};

	const textDisabled = disabled || recordingState !== 'idle' || isTranscribing;
	const micDisabled =
		disabled || recordingState === 'preview' || isTranscribing;
	const canSend = recordingState === 'idle' && text.trim() && !isTranscribing;

	// Create URL from blob when blob is available
	useEffect(() => {
		if (transcribedAudioBlob) {
			// Clean up previous URL if it exists
			if (transcribedAudioUrlRef.current) {
				URL.revokeObjectURL(transcribedAudioUrlRef.current);
			}
			// Create new URL from blob
			transcribedAudioUrlRef.current =
				URL.createObjectURL(transcribedAudioBlob);
			// Initialize audio element
			if (transcribedAudioUrlRef.current) {
				transcribedAudioRef.current = new Audio(transcribedAudioUrlRef.current);
			}
		} else {
			// Clean up when blob is cleared
			if (transcribedAudioUrlRef.current) {
				URL.revokeObjectURL(transcribedAudioUrlRef.current);
				transcribedAudioUrlRef.current = null;
			}
			if (transcribedAudioRef.current) {
				transcribedAudioRef.current.pause();
				transcribedAudioRef.current = null;
			}
			setIsPlayingTranscribedAudio(false);
		}

		return () => {
			// Cleanup on unmount
			if (transcribedAudioUrlRef.current) {
				URL.revokeObjectURL(transcribedAudioUrlRef.current);
			}
		};
	}, [transcribedAudioBlob]);

	// Handle transcribed audio playback events
	useEffect(() => {
		const audio = transcribedAudioRef.current;
		if (!audio) return;

		const handlePlay = () => setIsPlayingTranscribedAudio(true);
		const handlePause = () => setIsPlayingTranscribedAudio(false);
		const handleEnded = () => setIsPlayingTranscribedAudio(false);

		audio.addEventListener('play', handlePlay);
		audio.addEventListener('pause', handlePause);
		audio.addEventListener('ended', handleEnded);

		return () => {
			audio.removeEventListener('play', handlePlay);
			audio.removeEventListener('pause', handlePause);
			audio.removeEventListener('ended', handleEnded);
		};
	}, [transcribedAudioBlob]);

	const toggleTranscribedAudio = useCallback(async () => {
		const audio = transcribedAudioRef.current;
		if (!audio || !transcribedAudioBlob) return;

		if (audio.paused) {
			try {
				await audio.play();
			} catch (err) {
				console.error('Error playing audio:', err);
			}
		} else {
			audio.pause();
		}
	}, [transcribedAudioBlob]);

	return (
		<div className="space-y-3 px-2 sm:px-4 py-1.5 sm:py-2">
			{transcribedAudioBlob && (
				<div className="flex items-center justify-center">
					<button
						type="button"
						onClick={toggleTranscribedAudio}
						className={`flex items-center gap-1.5 rounded-full border ${darkModeColors.inputIconBorder} ${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover} px-3 sm:px-4 py-1.5 sm:py-2 text-xs sm:text-sm transition`}
						aria-label={
							isPlayingTranscribedAudio
								? 'Pause transcribed audio'
								: 'Play transcribed audio'
						}
					>
						<svg
							viewBox="0 0 24 24"
							className="h-3.5 w-3.5 sm:h-4 sm:w-4"
							fill="currentColor"
						>
							{isPlayingTranscribedAudio ? (
								<path d="M8.25 5.25h2.25v13.5H8.25zm5.25 0h2.25v13.5H13.5z" />
							) : (
								<path d="M7 4.5v15l11-7.5z" />
							)}
						</svg>
						<span className="font-medium">Transcribed audio</span>
					</button>
				</div>
			)}
			<div
				className={`flex items-center gap-2 rounded-full border ${darkModeColors.border} ${darkModeColors.inputBg} px-3 sm:px-4 py-2 sm:py-3`}
			>
				{recordingState === 'recording' ? (
					<div
						className="flex-1 overflow-hidden flex items-center"
						style={{ minHeight: '24px' }}
					>
						<div ref={liveWaveformRef} className="h-full w-full" />
					</div>
				) : (
					<div className="flex-1 flex items-center gap-2">
						<textarea
							ref={textareaRef}
							value={text}
							disabled={textDisabled}
							onChange={handleTextChange}
							onKeyDown={(event) => {
								if (event.key === 'Enter' && !event.shiftKey) {
									event.preventDefault();
									void sendText();
								}
							}}
							rows={1}
							className={`flex-1 resize-none overflow-y-auto bg-transparent text-xs sm:text-sm leading-6 ${darkModeColors.inputText} ${darkModeColors.inputPlaceholder} focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
							placeholder={
								hasSession
									? 'Type your message'
									: 'Start the session to begin chatting'
							}
							style={{
								minHeight: '24px',
								maxHeight: '240px',
								paddingTop: '2px',
								paddingBottom: '2px',
							}}
						/>
					</div>
				)}

				<div className="flex items-center gap-0 sm:gap-0.5">
					{recordingState === 'recording' ? (
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={cancelRecording}
								disabled={isTranscribing}
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition ${
									darkModeColors.inputIconBorder
								} ${darkModeColors.inputIconBg} ${
									darkModeColors.inputIconText
								} ${
									darkModeColors.inputIconHover
								} hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-900/30 dark:hover:text-red-400 ${
									isTranscribing ? 'cursor-not-allowed opacity-50' : ''
								}`}
								aria-label="Cancel recording"
							>
								<XIcon />
							</button>
							{isTranscribing ? (
								<div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center">
									<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
								</div>
							) : (
								<button
									type="button"
									onClick={acceptRecording}
									className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition ${darkModeColors.inputIconBorder} ${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover} hover:bg-green-50 hover:text-green-600 dark:hover:bg-green-900/30 dark:hover:text-green-400`}
									aria-label="Accept recording"
								>
									<CheckIcon />
								</button>
							)}
						</div>
					) : (
						<>
							<button
								type="button"
								onClick={onOpenGenderSettings}
								disabled={!hasSession}
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border ${
									darkModeColors.inputIconBorder
								} transition ${
									hasSession
										? `${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover}`
										: 'cursor-not-allowed opacity-50'
								}`}
								aria-label="Gender settings"
							>
								<UserCircle2
									className={`h-4 w-4 sm:h-5 sm:w-5 ${darkModeColors.inputIconText}`}
								/>
							</button>
							{isTranscribing ? (
								<div className="flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center">
									<div className="h-4 w-4 sm:h-5 sm:w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
								</div>
							) : (
								<button
									type="button"
									className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border ${
										darkModeColors.inputIconBorder
									} transition ${darkModeColors.inputIconBg} ${
										darkModeColors.inputIconText
									} ${darkModeColors.inputIconHover} ${
										micDisabled ? 'cursor-not-allowed opacity-50' : ''
									}`}
									onClick={startRecording}
									disabled={micDisabled}
									aria-label="Start recording"
								>
									<MicIcon />
								</button>
							)}
							<div className="w-1 sm:w-1.5" />
							<button
								type="button"
								onClick={sendText}
								disabled={!hasSession || disabled || !canSend}
								className={`inline-flex h-7 sm:h-9 items-center justify-center rounded-full px-3 sm:px-4 text-xs sm:text-sm font-semibold transition ${getThemeButtonClasses(
									theme.color,
									!hasSession || disabled || !canSend
								)}`}
							>
								<SendIcon />
							</button>
						</>
					)}
				</div>
			</div>

			{recordingError && (
				<p className="text-xs sm:text-sm text-red-600">{recordingError}</p>
			)}
		</div>
	);
};
