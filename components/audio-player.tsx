"use client";

import { useEffect, useRef, useState } from "react";
import { Pause, Play } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface AudioPlayerProps {
  src?: string;
  label?: string;
  size?: "sm" | "md";
}

export function AudioPlayer({ src, label, size = "md" }: AudioPlayerProps) {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
    };
  }, []);

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.pause();
    audio.currentTime = 0;
    setIsPlaying(false);
  }, [src]);

  useEffect(() => {
    if (typeof document === "undefined") return;

    const pauseOthers = (event: Event) => {
      const audio = audioRef.current;
      if (!audio) return;

      const target = event.target as HTMLAudioElement;
      if (target !== audio) {
        audio.pause();
      }
    };

    document.addEventListener("play", pauseOthers, true);
    return () => document.removeEventListener("play", pauseOthers, true);
  }, []);

  const togglePlayback = async () => {
    const audio = audioRef.current;
    if (!audio || !src) return;

    if (audio.paused) {
      try {
        await audio.play();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    audio.pause();
  };

  return (
    <Button
      type="button"
      variant="outline"
      size={size === "sm" ? "sm" : "default"}
      onClick={togglePlayback}
      disabled={!src}
      className={cn(
        "gap-1.5",
        size === "sm" && "h-7 px-2 text-xs"
      )}
    >
      {isPlaying ? (
        <Pause className={cn("h-4 w-4", size === "sm" && "h-3.5 w-3.5")} />
      ) : (
        <Play className={cn("h-4 w-4", size === "sm" && "h-3.5 w-3.5")} />
      )}
      {label && <span className="hidden sm:inline">{label}</span>}
      <audio ref={audioRef} src={src} preload="none" className="hidden" />
    </Button>
  );
}

