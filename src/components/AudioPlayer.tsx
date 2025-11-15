import { useEffect, useRef, useState } from 'react';

interface AudioPlayerProps {
  src?: string;
  label?: string;
  size?: 'sm' | 'md';
  tone?: 'light' | 'dark';
}

const PlayPauseIcon = ({ isPlaying }: { isPlaying: boolean }) => (
  <svg
    aria-hidden="true"
    viewBox="0 0 24 24"
    className="h-4 w-4"
    fill="currentColor"
  >
    {isPlaying ? (
      <path d="M8.25 5.25h2.25v13.5H8.25zm5.25 0h2.25v13.5H13.5z" />
    ) : (
      <path d="M7 4.5v15l11-7.5z" />
    )}
  </svg>
);

const noop = () => {};

export const AudioPlayer = ({
  src,
  label,
  size = 'md',
  tone = 'light',
}: AudioPlayerProps) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    if (!audioRef.current) {
      return noop;
    }

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);

    audioRef.current.addEventListener('play', handlePlay);
    audioRef.current.addEventListener('pause', handlePause);
    audioRef.current.addEventListener('ended', handlePause);

    return () => {
      audioRef.current?.removeEventListener('play', handlePlay);
      audioRef.current?.removeEventListener('pause', handlePause);
      audioRef.current?.removeEventListener('ended', handlePause);
    };
  }, []);

  useEffect(() => {
    if (!audioRef.current) {
      return;
    }

    audioRef.current.pause();
    audioRef.current.currentTime = 0;
    setIsPlaying(false);
  }, [src]);

  useEffect(() => {
    if (typeof document === 'undefined') {
      return;
    }

    const pauseOthers = (event: Event) => {
      if (!audioRef.current) {
        return;
      }

      const target = event.target as HTMLAudioElement;
      if (target !== audioRef.current) {
        audioRef.current.pause();
      }
    };

    document.addEventListener('play', pauseOthers, true);
    return () => document.removeEventListener('play', pauseOthers, true);
  }, []);

  const togglePlayback = async () => {
    if (!audioRef.current || !src) {
      return;
    }

    if (audioRef.current.paused) {
      try {
        await audioRef.current.play();
      } catch (err) {
        console.error(err);
      }
      return;
    }

    audioRef.current.pause();
  };

  const sizeClasses = size === 'sm' ? 'h-9 px-3 text-xs' : 'h-10 px-4 text-sm';
  const toneClasses =
    tone === 'dark'
      ? 'bg-white/10 text-white border border-white/20 hover:bg-white/20 focus-visible:ring-white/30'
      : 'bg-korli-dark/10 text-korli-dark border border-korli-border hover:bg-white focus-visible:ring-korli-border';

  return (
    <button
      type="button"
      onClick={togglePlayback}
      disabled={!src}
      className={`inline-flex items-center gap-2 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-offset-transparent disabled:opacity-40 disabled:cursor-not-allowed ${sizeClasses} ${toneClasses}`}
      aria-label={isPlaying ? 'Pause audio' : 'Play audio'}
    >
      <PlayPauseIcon isPlaying={isPlaying} />
      {label && <span className="font-medium">{label}</span>}
      <audio ref={audioRef} src={src} preload="none" className="hidden" />
    </button>
  );
};

