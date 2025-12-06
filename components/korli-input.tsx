"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RecordPlugin from "wavesurfer.js/dist/plugins/record.js";
import { useTheme } from "next-themes";
import { X } from "lucide-react";

import { transcribeAudio } from "@/lib/korli-api";
import { Button } from "@/components/ui/button";
import {
  PromptInput,
  PromptInputSubmit,
  PromptInputTextarea,
  PromptInputToolbar,
  PromptInputTools,
} from "@/components/elements/prompt-input";
import { ArrowUpIcon, CheckIcon, MicIcon, PersonaIcon, StopIcon } from "@/components/icons";

type RecordingState = "idle" | "recording";

const MAX_AUDIO_BYTES = 10 * 1024 * 1024;

interface KorliInputProps {
  disabled: boolean;
  hasSession: boolean;
  isStreaming: boolean;
  onSendText: (message: string) => Promise<void>;
  foreignLanguage: string;
  onOpenGenderSettings: () => void;
}

export function KorliInput({
  disabled,
  hasSession,
  isStreaming,
  onSendText,
  foreignLanguage,
  onOpenGenderSettings,
}: KorliInputProps) {
  const { resolvedTheme } = useTheme();
  const waveformColor = resolvedTheme === "dark" ? "#ffffff" : "#475569";

  const [text, setText] = useState("");
  const [recordingState, setRecordingState] = useState<RecordingState>("idle");
  const [recordingError, setRecordingError] = useState<string | null>(null);
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [transcribedAudioBlob, setTranscribedAudioBlob] = useState<Blob | null>(null);

  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const recordedSizeRef = useRef(0);
  const sizeExceededRef = useRef(false);
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const liveWaveformRef = useRef<HTMLDivElement | null>(null);
  const liveWaveSurferRef = useRef<WaveSurfer | null>(null);
  const recordPluginRef = useRef<InstanceType<typeof RecordPlugin> | null>(null);
  const shouldTranscribeRef = useRef(false);
  const transcribedAudioUrlRef = useRef<string | null>(null);
  const transcribedAudioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlayingTranscribedAudio, setIsPlayingTranscribedAudio] = useState(false);

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

  const transcribeAndInsert = useCallback(
    async (blob: Blob) => {
      setIsTranscribing(true);
      setRecordingError(null);

      try {
        const transcribedText = await transcribeAudio(blob, foreignLanguage);

        if (!transcribedText) {
          throw new Error("No transcription received");
        }

        setTranscribedAudioBlob(blob);
        setText((prev) => prev + transcribedText);
        setRecordingState("idle");
        shouldTranscribeRef.current = false;
      } catch (err) {
        setRecordingError(
          err instanceof Error ? err.message : "Unable to transcribe audio."
        );
        shouldTranscribeRef.current = false;
        setRecordingState("idle");
      } finally {
        setIsTranscribing(false);
      }
    },
    [foreignLanguage]
  );

  const stopRecording = useCallback(
    (shouldAccept: boolean) => {
      if (!mediaRecorderRef.current) return;

      destroyLiveWaveform();

      const acceptRecording = shouldAccept;

      mediaRecorderRef.current.onstop = () => {
        cleanupStream();

        if (sizeExceededRef.current) {
          chunksRef.current = [];
          sizeExceededRef.current = false;
          setRecordingState("idle");
          mediaRecorderRef.current = null;
          return;
        }

        if (chunksRef.current.length === 0) {
          setRecordingState("idle");
          mediaRecorderRef.current = null;
          return;
        }

        if (!acceptRecording) {
          chunksRef.current = [];
          setRecordingState("idle");
          mediaRecorderRef.current = null;
          return;
        }

        const blob = new Blob(chunksRef.current, { type: "audio/webm" });
        chunksRef.current = [];

        if (blob.size === 0) {
          setRecordingState("idle");
          mediaRecorderRef.current = null;
          return;
        }

        void transcribeAndInsert(blob);
        mediaRecorderRef.current = null;
      };

      mediaRecorderRef.current.stop();
    },
    [destroyLiveWaveform, transcribeAndInsert]
  );

  const acceptRecording = useCallback(() => {
    if (recordingState === "recording") {
      shouldTranscribeRef.current = true;
      stopRecording(true);
    }
  }, [stopRecording, recordingState]);

  const cancelRecording = useCallback(() => {
    stopRecording(false);
  }, [stopRecording]);

  const startRecording = async () => {
    if (disabled || !hasSession) {
      setRecordingError("Start the tutor session before recording.");
      return;
    }

    if (transcribedAudioUrlRef.current) {
      URL.revokeObjectURL(transcribedAudioUrlRef.current);
      transcribedAudioUrlRef.current = null;
    }
    setTranscribedAudioBlob(null);

    if (
      typeof MediaRecorder === "undefined" ||
      typeof navigator === "undefined" ||
      !navigator.mediaDevices?.getUserMedia
    ) {
      setRecordingError("Your browser does not support audio recording.");
      return;
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      mediaStreamRef.current = stream;
      const mediaRecorder = new MediaRecorder(stream, {
        mimeType: "audio/webm",
      });

      setRecordingError(null);
      setRecordingState("recording");
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
          setRecordingError("Recording stopped: 10MB audio limit reached.");
          stopRecording(false);
          return;
        }

        chunksRef.current.push(event.data);
      };

      mediaRecorder.onerror = () => {
        setRecordingError("Microphone error occurred.");
        stopRecording(false);
      };

      mediaRecorderRef.current = mediaRecorder;
      mediaRecorder.start(250);
    } catch (err) {
      setRecordingError(
        err instanceof DOMException && err.name === "NotAllowedError"
          ? "Microphone permissions are required to record audio."
          : "Unable to access the microphone."
      );
      cleanupStream();
      mediaRecorderRef.current = null;
      setRecordingState("idle");
    }
  };

  useEffect(() => {
    if (recordingState !== "recording") {
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
      if (transcribedAudioUrlRef.current) {
        URL.revokeObjectURL(transcribedAudioUrlRef.current);
      }
    },
    [destroyLiveWaveform]
  );

  useEffect(() => {
    if (transcribedAudioBlob) {
      if (transcribedAudioUrlRef.current) {
        URL.revokeObjectURL(transcribedAudioUrlRef.current);
      }
      transcribedAudioUrlRef.current = URL.createObjectURL(transcribedAudioBlob);
      if (transcribedAudioUrlRef.current) {
        transcribedAudioRef.current = new Audio(transcribedAudioUrlRef.current);
      }
    } else {
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
      if (transcribedAudioUrlRef.current) {
        URL.revokeObjectURL(transcribedAudioUrlRef.current);
      }
    };
  }, [transcribedAudioBlob]);

  useEffect(() => {
    const audio = transcribedAudioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlayingTranscribedAudio(true);
    const handlePause = () => setIsPlayingTranscribedAudio(false);
    const handleEnded = () => setIsPlayingTranscribedAudio(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [transcribedAudioBlob]);

  const toggleTranscribedAudio = useCallback(async () => {
    const audio = transcribedAudioRef.current;
    if (!audio || !transcribedAudioBlob) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.error("Error playing audio:", err);
      }
    } else {
      audio.pause();
    }
  }, [transcribedAudioBlob]);

  const sendText = async () => {
    const value = text.trim();
    if (!value || disabled || recordingState !== "idle" || isStreaming) {
      return;
    }

    try {
      await onSendText(value);
      setText("");
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
        err instanceof Error ? err.message : "Unable to send message."
      );
    }
  };

  const textDisabled = disabled || recordingState !== "idle" || isTranscribing;
  const micDisabled = disabled || isTranscribing || isStreaming;
  const canSend = recordingState === "idle" && text.trim() && !isTranscribing && !isStreaming;

  return (
    <div className="relative flex w-full flex-col gap-3">
      {transcribedAudioBlob && (
        <div className="flex items-center justify-center">
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={toggleTranscribedAudio}
            className="gap-1.5"
          >
            {isPlayingTranscribedAudio ? (
              <StopIcon size={14} />
            ) : (
              <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="currentColor">
                <path d="M7 4.5v15l11-7.5z" />
              </svg>
            )}
            <span>Transcribed audio</span>
          </Button>
        </div>
      )}

      <PromptInput
        className="rounded-xl border border-border bg-background p-3 shadow-xs transition-all duration-200 focus-within:border-border hover:border-muted-foreground/50"
        onSubmit={(event) => {
          event.preventDefault();
          if (canSend) {
            void sendText();
          }
        }}
      >
        {recordingState === "recording" ? (
          <div className="flex items-center gap-2 py-2">
            <div
              ref={liveWaveformRef}
              className="flex-1 overflow-hidden"
              style={{ minHeight: "26px" }}
            />
          </div>
        ) : (
          <div className="flex flex-row items-start gap-1 sm:gap-2">
            <PromptInputTextarea
              autoFocus
              className="grow resize-none border-0 border-none bg-transparent p-2 text-sm outline-none ring-0 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0"
              data-testid="korli-input"
              disableAutoResize={false}
              maxHeight={200}
              minHeight={44}
              onChange={(e) => setText(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  if (canSend) {
                    void sendText();
                  }
                }
              }}
              placeholder={
                hasSession
                  ? "Type your message..."
                  : "Start the session to begin chatting"
              }
              ref={textareaRef}
              rows={1}
              value={text}
              disabled={textDisabled}
            />
          </div>
        )}

        <PromptInputToolbar className="border-t-0 p-0 shadow-none">
          <PromptInputTools className="gap-0 sm:gap-0.5">
            {recordingState === "recording" ? (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={cancelRecording}
                  disabled={isTranscribing}
                  className="h-8 w-8 rounded-lg p-1 text-destructive hover:bg-destructive/10 hover:text-destructive"
                >
                  <X size={16} />
                </Button>
                {isTranscribing ? (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={acceptRecording}
                    className="h-8 w-8 rounded-lg p-1 text-green-600 hover:bg-green-600/10 hover:text-green-600 dark:text-green-400 dark:hover:text-green-400"
                  >
                    <CheckIcon size={16} />
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={onOpenGenderSettings}
                  disabled={!hasSession}
                  className="h-8 w-8 rounded-lg p-1"
                >
                  <PersonaIcon size={16} />
                </Button>

                {isTranscribing ? (
                  <div className="flex h-8 w-8 items-center justify-center">
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-muted-foreground border-t-transparent" />
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={startRecording}
                    disabled={micDisabled || !hasSession}
                    className="h-8 w-8 rounded-lg p-1"
                  >
                    <MicIcon size={16} />
                  </Button>
                )}
              </>
            )}
          </PromptInputTools>

          {isStreaming ? (
            <Button
              type="button"
              size="sm"
              onClick={() => {}}
              className="h-8 w-8 rounded-full bg-foreground p-1 text-background hover:bg-foreground/90"
            >
              <StopIcon size={14} />
            </Button>
          ) : (
            <PromptInputSubmit
              className="h-8 w-8 rounded-full bg-primary text-primary-foreground transition-colors duration-200 hover:bg-primary/90 disabled:bg-muted disabled:text-muted-foreground"
              data-testid="send-button"
              disabled={!canSend}
            >
              <ArrowUpIcon size={14} />
            </PromptInputSubmit>
          )}
        </PromptInputToolbar>
      </PromptInput>

      {recordingError && (
        <p className="text-xs text-destructive">{recordingError}</p>
      )}
    </div>
  );
}

