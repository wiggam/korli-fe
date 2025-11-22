import { useCallback, useEffect, useRef, useState } from 'react';
import { UserCircle2 } from 'lucide-react';
import RecordPlugin from 'wavesurfer.js/dist/plugins/record.js';
import WaveSurfer from 'wavesurfer.js';

import { useTheme } from '../contexts/ThemeContext';
import { darkModeColors, getThemeButtonClasses } from '../utils/theme';
import { AudioPlayer } from './AudioPlayer';

interface InputBarProps {
	disabled: boolean;
	hasSession: boolean;
	onSendText: (message: string) => Promise<void>;
	onSendAudio: (file: Blob) => Promise<void>;
	onOpenGenderSettings: () => void;
}

type RecordingState = 'idle' | 'recording' | 'preview';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;
const WAVEFORM_COLORS: Record<string, string> = {
	yellow: '#facc15',
	green: '#22c55e',
	blue: '#38bdf8',
	pink: '#ec4899',
	purple: '#a855f7',
	orange: '#fb923c',
};

const MicIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 sm:h-5 sm:w-5"
		fill="currentColor"
	>
		<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm6-3a1 1 0 0 1 2 0 8 8 0 0 1-7 7.94V22h-2v-2.06A8 8 0 0 1 4 12a1 1 0 0 1 2 0 6 6 0 0 0 12 0z" />
	</svg>
);

const StopIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-3.5 w-3.5 sm:h-4 sm:w-4"
		fill="currentColor"
	>
		<path d="M6 6h12v12H6z" />
	</svg>
);

const SendIcon = () => (
	<svg viewBox="0 0 24 24" className="h-3.5 w-3.5 sm:h-4 sm:w-4" fill="currentColor">
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

const TrashIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 sm:h-5 sm:w-5"
		fill="none"
		stroke="currentColor"
		strokeWidth="2"
		strokeLinecap="round"
		strokeLinejoin="round"
	>
		<path d="M3 6h18M19 6v14a2 2 0 01-2 2H7a2 2 0 01-2-2V6m3 0V4a2 2 0 012-2h4a2 2 0 012 2v2" />
	</svg>
);

export const InputBar = ({
	disabled,
	hasSession,
	onSendText,
	onSendAudio,
	onOpenGenderSettings,
}: InputBarProps) => {
	const { theme } = useTheme();
	const accentColor = WAVEFORM_COLORS[theme.color] ?? '#22c55e';
	const [text, setText] = useState('');
	const [recordingState, setRecordingState] = useState<RecordingState>('idle');
	const [timer, setTimer] = useState(0);
	const [recordingError, setRecordingError] = useState<string | null>(null);
	const [previewUrl, setPreviewUrl] = useState<string | null>(null);
	const [previewBlob, setPreviewBlob] = useState<Blob | null>(null);

	const mediaRecorderRef = useRef<MediaRecorder | null>(null);
	const mediaStreamRef = useRef<MediaStream | null>(null);
	const timerRef = useRef<number | null>(null);
	const chunksRef = useRef<Blob[]>([]);
	const recordedSizeRef = useRef(0);
	const sizeExceededRef = useRef(false);
	const previewUrlRef = useRef<string | null>(null);
	const textareaRef = useRef<HTMLTextAreaElement | null>(null);
	const liveWaveformRef = useRef<HTMLDivElement | null>(null);
	const liveWaveSurferRef = useRef<WaveSurfer | null>(null);
	const recordPluginRef = useRef<InstanceType<typeof RecordPlugin> | null>(null);

	const clearTimer = () => {
		if (timerRef.current) {
			window.clearInterval(timerRef.current);
			timerRef.current = null;
		}
	};

	const cleanupStream = () => {
		mediaStreamRef.current?.getTracks().forEach((track) => track.stop());
		mediaStreamRef.current = null;
	};

	const resetPreview = useCallback(() => {
		if (previewUrl) {
			URL.revokeObjectURL(previewUrl);
		}
		setPreviewUrl(null);
		previewUrlRef.current = null;
		setPreviewBlob(null);
		setRecordingState('idle');
		setRecordingError(null);
	}, [previewUrl]);

	const stopRecording = useCallback((shouldAccept: boolean) => {
		if (!mediaRecorderRef.current) return;
		
		// Store whether we should accept or cancel
		const acceptRecording = shouldAccept;
		
		mediaRecorderRef.current.onstop = () => {
			clearTimer();
			cleanupStream();
			setTimer(0);

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

			// Accept recording - create preview
			const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
			chunksRef.current = [];

			if (blob.size === 0) {
				setRecordingState('idle');
				mediaRecorderRef.current = null;
				return;
			}

			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
			}

			const url = URL.createObjectURL(blob);
			setPreviewBlob(blob);
			setPreviewUrl(url);
			previewUrlRef.current = url;
			setRecordingState('preview');
			mediaRecorderRef.current = null;
		};

		mediaRecorderRef.current.stop();
	}, []);

	const acceptRecording = useCallback(() => {
		stopRecording(true);
	}, [stopRecording]);

	const cancelRecording = useCallback(() => {
		stopRecording(false);
	}, [stopRecording]);

	const autoResizeTextarea = useCallback(() => {
		const textarea = textareaRef.current;
		if (!textarea) return;

		// Reset height to auto to get the correct scrollHeight
		textarea.style.height = 'auto';
		// Set height based on scrollHeight, with a max of ~5 lines (120px)
		textarea.style.height = `${Math.min(textarea.scrollHeight, 120)}px`;
	}, []);

	const handleTextChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
		setText(event.target.value);
		// Small delay to allow state to update before resizing
		setTimeout(autoResizeTextarea, 0);
	};

	const destroyLiveWaveform = useCallback(() => {
		recordPluginRef.current?.destroy();
		recordPluginRef.current = null;
		liveWaveSurferRef.current?.destroy();
		liveWaveSurferRef.current = null;
	}, []);

	const startRecording = async () => {
		if (disabled || !hasSession) {
			setRecordingError('Start the tutor session before recording.');
			return;
		}

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
			setTimer(0);
			sizeExceededRef.current = false;
			recordedSizeRef.current = 0;
			chunksRef.current = [];

			timerRef.current = window.setInterval(() => {
				setTimer((prev) => prev + 1);
			}, 1000);

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
			scrollingWaveformWindow: 1,
			continuousWaveform: true,
			continuousWaveformDuration: 1.5,
			mediaRecorderTimeslice: 20,
		});

		const waveSurfer = WaveSurfer.create({
			container: liveWaveformRef.current,
			height: 40,
			waveColor: accentColor,
			progressColor: accentColor,
			cursorWidth: 0,
			barWidth: 2,
			barGap: 2,
			barRadius: 4,
			barAlign: 'center',
			interact: false,
			normalize: false,
			normalizeTo: 0.5,
			minPxPerSec: 300,
			autoScroll: true,
			autoCenter: false,
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
	}, [accentColor, destroyLiveWaveform, recordingState]);

	useEffect(
		() => () => {
			clearTimer();
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
		// If in preview state, send audio instead
		if (recordingState === 'preview') {
			await sendAudio();
			return;
		}

		const value = text.trim();
		if (!value || disabled || recordingState !== 'idle') {
			return;
		}

		try {
			await onSendText(value);
			setText('');
		} catch (err) {
			setRecordingError(
				err instanceof Error ? err.message : 'Unable to send message.'
			);
		}
	};

	const sendAudio = async () => {
		if (!previewBlob || !previewUrl) {
			return;
		}

		try {
			await onSendAudio(previewBlob);
			if (previewUrl) {
				URL.revokeObjectURL(previewUrl);
			}
			setPreviewBlob(null);
			setPreviewUrl(null);
			previewUrlRef.current = null;
			setRecordingState('idle');
		} catch (err) {
			setRecordingError(
				err instanceof Error ? err.message : 'Unable to send audio.'
			);
		}
	};

	const formattedTimer = new Date(timer * 1000).toISOString().substring(14, 19);
	const textDisabled = disabled || recordingState !== 'idle';
	const micDisabled = disabled || recordingState === 'preview';
	const canSend = recordingState === 'preview' || (recordingState === 'idle' && text.trim());

	return (
		<div className="space-y-3 px-2 sm:px-4 py-1.5 sm:py-2">
			<div className={`flex items-center gap-2 rounded-full border ${darkModeColors.border} ${darkModeColors.inputBg} px-3 sm:px-4 py-2 sm:py-3`}>
				{recordingState === 'recording' ? (
					<div className="flex-1 h-10 overflow-hidden">
						<div ref={liveWaveformRef} className="h-full w-full" />
					</div>
				) : (
					<div className="flex-1 flex items-center gap-2">
						{recordingState === 'preview' && previewUrl && (
							<>
								<AudioPlayer
									src={previewUrl}
									label="Play recording"
									tone="light"
									size="sm"
								/>
								<button
									type="button"
									onClick={resetPreview}
									className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border ${darkModeColors.inputIconBorder} transition ${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover}`}
									aria-label="Delete recording"
								>
									<TrashIcon />
								</button>
							</>
						)}
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
							className={`flex-1 resize-none overflow-hidden bg-transparent text-xs sm:text-sm leading-6 ${darkModeColors.inputText} ${darkModeColors.inputPlaceholder} focus:outline-none disabled:cursor-not-allowed disabled:opacity-50`}
							placeholder={
								hasSession
									? 'Type your message'
									: 'Start the session to begin chatting'
							}
							style={{ minHeight: '24px', paddingTop: '2px', paddingBottom: '2px' }}
						/>
					</div>
				)}

				<div className="flex items-center gap-0 sm:gap-0.5">
					{recordingState === 'recording' ? (
						<div className="flex items-center gap-1">
							<button
								type="button"
								onClick={cancelRecording}
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition ${darkModeColors.recordingCancelBg} ${darkModeColors.recordingCancelBorder} ${darkModeColors.recordingCancelText} ${darkModeColors.recordingCancelHover}`}
								aria-label="Cancel recording"
							>
								<XIcon />
							</button>
							<button
								type="button"
								onClick={acceptRecording}
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border transition ${darkModeColors.recordingAcceptBg} ${darkModeColors.recordingAcceptBorder} ${darkModeColors.recordingAcceptText} ${darkModeColors.recordingAcceptHover}`}
								aria-label="Accept recording"
							>
								<CheckIcon />
							</button>
						</div>
					) : (
						<>
							<button
								type="button"
								onClick={onOpenGenderSettings}
								disabled={!hasSession}
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border ${darkModeColors.inputIconBorder} transition ${
									hasSession
										? `${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover}`
										: 'cursor-not-allowed opacity-50'
								}`}
								aria-label="Gender settings"
							>
								<UserCircle2 className={`h-4 w-4 sm:h-5 sm:w-5 ${darkModeColors.inputIconText}`} />
							</button>
							<button
								type="button"
								className={`flex h-7 w-7 sm:h-9 sm:w-9 items-center justify-center rounded-full border ${darkModeColors.inputIconBorder} transition ${darkModeColors.inputIconBg} ${darkModeColors.inputIconText} ${darkModeColors.inputIconHover} ${micDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
								onClick={startRecording}
								disabled={micDisabled}
								aria-label="Start recording"
							>
								<MicIcon />
							</button>
							<div className="w-1 sm:w-1.5" />
							<button
								type="button"
								onClick={sendText}
								disabled={
									!hasSession ||
									disabled ||
									!canSend
								}
								className={`inline-flex h-7 sm:h-9 items-center justify-center rounded-full px-3 sm:px-4 text-xs sm:text-sm font-semibold transition ${getThemeButtonClasses(theme.color, !hasSession || disabled || !canSend)}`}
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
