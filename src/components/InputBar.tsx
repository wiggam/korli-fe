import { useCallback, useEffect, useRef, useState } from 'react';

import { AudioPlayer } from './AudioPlayer';

interface InputBarProps {
	disabled: boolean;
	hasSession: boolean;
	onSendText: (message: string) => Promise<void>;
	onSendAudio: (file: Blob) => Promise<void>;
}

type RecordingState = 'idle' | 'recording' | 'preview';

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

const MicIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-5 w-5 text-slate-700"
		fill="currentColor"
	>
		<path d="M12 15a3 3 0 0 0 3-3V6a3 3 0 0 0-6 0v6a3 3 0 0 0 3 3zm6-3a1 1 0 0 1 2 0 8 8 0 0 1-7 7.94V22h-2v-2.06A8 8 0 0 1 4 12a1 1 0 0 1 2 0 6 6 0 0 0 12 0z" />
	</svg>
);

const StopIcon = () => (
	<svg
		viewBox="0 0 24 24"
		className="h-4 w-4 text-slate-700"
		fill="currentColor"
	>
		<path d="M6 6h12v12H6z" />
	</svg>
);

const SendIcon = () => (
	<svg viewBox="0 0 24 24" className="h-4 w-4" fill="currentColor">
		<path d="M3.4 20.4 21 12 3.4 3.6l.05 6.9L15 12l-11.55 1.5z" />
	</svg>
);

export const InputBar = ({
	disabled,
	hasSession,
	onSendText,
	onSendAudio,
}: InputBarProps) => {
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

	const stopRecording = useCallback(() => {
		mediaRecorderRef.current?.stop();
		mediaRecorderRef.current = null;
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
					stopRecording();
					return;
				}

				chunksRef.current.push(event.data);
			};

			mediaRecorder.onerror = (event) => {
				console.error(event.error);
				setRecordingError('Microphone error occurred.');
				stopRecording();
			};

			mediaRecorder.onstop = () => {
				clearTimer();
				cleanupStream();
				setTimer(0);

				if (sizeExceededRef.current) {
					chunksRef.current = [];
					sizeExceededRef.current = false;
					setRecordingState('idle');
					return;
				}

				if (chunksRef.current.length === 0) {
					setRecordingState('idle');
					return;
				}

				const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
				chunksRef.current = [];

				if (blob.size === 0) {
					setRecordingState('idle');
					return;
				}

				if (previewUrl) {
					URL.revokeObjectURL(previewUrl);
				}

				const url = URL.createObjectURL(blob);
				setPreviewBlob(blob);
				setPreviewUrl(url);
				previewUrlRef.current = url;
				setRecordingState('preview');
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

	useEffect(
		() => () => {
			clearTimer();
			cleanupStream();
			mediaRecorderRef.current?.stop();
			if (previewUrlRef.current) {
				URL.revokeObjectURL(previewUrlRef.current);
			}
		},
		[]
	);

	const sendText = async () => {
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

	return (
		<div className="space-y-3 p-4">
			{recordingState === 'preview' && previewUrl && (
				<div className="flex flex-col gap-3 rounded-2xl border border-slate-200 bg-slate-50 p-3 sm:flex-row sm:items-center sm:justify-between">
					<div className="flex flex-col gap-1 text-sm text-slate-700">
						<span className="font-semibold uppercase tracking-wide text-slate-500">
							Audio preview
						</span>
						<AudioPlayer
							src={previewUrl}
							label="Play recording"
							tone="light"
							size="sm"
						/>
					</div>
					<div className="flex gap-2">
						<button
							type="button"
							className="inline-flex items-center gap-2 rounded-full bg-emerald-500 px-4 py-2 text-sm font-semibold text-emerald-950 transition hover:bg-emerald-400"
							onClick={sendAudio}
						>
							<SendIcon />
							Send audio
						</button>
						<button
							type="button"
							onClick={resetPreview}
							className="rounded-full border border-slate-300 bg-white px-4 py-2 text-sm font-semibold text-slate-700 transition hover:bg-slate-50"
						>
							Delete
						</button>
					</div>
				</div>
			)}

			<div className="flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-3">
				<textarea
					value={text}
					disabled={textDisabled}
					onChange={(event) => setText(event.target.value)}
					onKeyDown={(event) => {
						if (event.key === 'Enter' && !event.shiftKey) {
							event.preventDefault();
							void sendText();
						}
					}}
					rows={1}
					className="flex-1 resize-none bg-transparent text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50"
					placeholder={
						hasSession
							? recordingState === 'recording'
								? 'Recording in progress…'
								: 'Type your message'
							: 'Start the session to begin chatting'
					}
				/>

				<div className="flex items-center gap-1">
					<button
						type="button"
						className={`flex h-9 w-9 items-center justify-center rounded-full transition ${
							recordingState === 'recording'
								? 'bg-red-50 text-red-600'
								: 'bg-white text-slate-700 hover:bg-gray-100'
						} ${micDisabled ? 'cursor-not-allowed opacity-50' : ''}`}
						onClick={
							recordingState === 'recording' ? stopRecording : startRecording
						}
						disabled={micDisabled}
						aria-label={
							recordingState === 'recording'
								? 'Stop recording'
								: 'Start recording'
						}
					>
						{recordingState === 'recording' ? <StopIcon /> : <MicIcon />}
					</button>
					<button
						type="button"
						onClick={sendText}
						disabled={
							!hasSession ||
							disabled ||
							!text.trim() ||
							recordingState !== 'idle'
						}
						className="inline-flex h-9 items-center justify-center rounded-full bg-blue-500 px-4 text-sm font-semibold text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
					>
						<SendIcon />
					</button>
				</div>
			</div>

			{recordingState === 'recording' && (
				<div className="flex items-center gap-2 text-sm text-red-600">
					<span className="h-2 w-2 animate-pulse rounded-full bg-red-500" />
					Recording… {formattedTimer}
				</div>
			)}

			{recordingError && (
				<p className="text-sm text-red-600">{recordingError}</p>
			)}
		</div>
	);
};
