import { type ChangeEvent, type FormEvent, useMemo, useState } from 'react';

import { ChatWindow } from './components/ChatWindow';
import { InputBar } from './components/InputBar';
import { LANGUAGES } from './constants/languages';
import { useChat } from './hooks/useChat';
import type { ChatConfig, GenderOption, StudentLevel } from './types/chat';

const LEVELS: StudentLevel[] = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
const GENDERS: GenderOption[] = ['female', 'male'];

const initialConfig: ChatConfig = {
  nativeLanguage: 'English',
  foreignLanguage: 'Spanish',
  studentLevel: 'A2',
  tutorGender: 'female',
  studentGender: 'female',
};

function App() {
  const [form, setForm] = useState<ChatConfig>(initialConfig);
  const {
    threadId,
    messages,
    activeOverlay,
    isStarting,
    isStreaming,
    error,
    startConversation,
    sendTextMessage,
    sendAudioMessage,
    toggleOverlay,
    resetChat,
    clearError,
  } = useChat();

  const hasSession = Boolean(threadId);
  const sortedLanguages = useMemo(() => [...LANGUAGES].sort(), []);

  const handleField =
    (field: keyof ChatConfig) =>
    (event: ChangeEvent<HTMLSelectElement>) => {
      setForm((prev) => ({ ...prev, [field]: event.target.value }));
    };

  const handleStart = async (event: FormEvent) => {
    event.preventDefault();
    try {
      await startConversation(form);
    } catch {
      // error handled within the hook
    }
  };

  return (
    <div className="min-h-screen bg-korli-dark px-4 py-6 text-white">
      <main className="mx-auto flex w-full max-w-5xl flex-col gap-6">
        <header className="rounded-3xl border border-white/10 bg-gradient-to-br from-[#141b32] via-[#10162a] to-[#0b0f1f] p-6 shadow-2xl">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.35em] text-blue-300">Korli Tutor</p>
              <h1 className="mt-2 text-3xl font-semibold tracking-tight sm:text-4xl">
                AI language coach
              </h1>
              <p className="mt-2 text-sm text-white/70">
                Configure your target language, level, and genders to start practicing instantly.
              </p>
            </div>
            <div className="rounded-2xl border border-white/15 bg-white/5 px-4 py-3 text-sm text-white/70">
              <p className="font-semibold uppercase tracking-wide text-white">
                Session status
              </p>
              <p className="mt-1 text-base text-emerald-300">
                {hasSession ? 'Live tutoring' : 'Awaiting configuration'}
              </p>
            </div>
          </div>

          <form onSubmit={handleStart} className="mt-6 grid gap-4 md:grid-cols-2">
            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white/80">Native language</span>
              <select
                value={form.nativeLanguage}
                onChange={handleField('nativeLanguage')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                {sortedLanguages.map((language) => (
                  <option className="text-black" key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white/80">Foreign language</span>
              <select
                value={form.foreignLanguage}
                onChange={handleField('foreignLanguage')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                {sortedLanguages.map((language) => (
                  <option className="text-black" key={language} value={language}>
                    {language}
                  </option>
                ))}
              </select>
            </label>

            <label className="flex flex-col gap-2 text-sm">
              <span className="font-semibold text-white/80">Student level</span>
              <select
                value={form.studentLevel}
                onChange={handleField('studentLevel')}
                className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
              >
                {LEVELS.map((level) => (
                  <option className="text-black" key={level} value={level}>
                    {level}
                  </option>
                ))}
              </select>
            </label>

            <div className="grid grid-cols-2 gap-3 text-sm">
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-white/80">Tutor gender</span>
                <select
                  value={form.tutorGender}
                  onChange={handleField('tutorGender')}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                >
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender} className="text-black capitalize">
                      {gender}
                    </option>
                  ))}
                </select>
              </label>
              <label className="flex flex-col gap-2">
                <span className="font-semibold text-white/80">Student gender</span>
                <select
                  value={form.studentGender}
                  onChange={handleField('studentGender')}
                  className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-white focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/30"
                >
                  {GENDERS.map((gender) => (
                    <option key={gender} value={gender} className="text-black capitalize">
                      {gender}
                    </option>
                  ))}
                </select>
              </label>
            </div>

            <div className="flex flex-col gap-3 md:col-span-2 md:flex-row md:items-center md:justify-end">
              <button
                type="submit"
                disabled={isStarting}
                className="inline-flex items-center justify-center rounded-2xl bg-blue-500 px-6 py-3 text-sm font-semibold uppercase tracking-wide text-white transition hover:bg-blue-400 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {isStarting ? 'Starting…' : hasSession ? 'Restart session' : 'Start session'}
              </button>
              {hasSession && (
                <button
                  type="button"
                  onClick={resetChat}
                  className="rounded-2xl border border-white/15 px-6 py-3 text-sm font-semibold text-white/80 transition hover:bg-white/10"
                >
                  Reset chat
                </button>
              )}
            </div>
          </form>
        </header>

        {error && (
          <div className="flex items-start justify-between gap-4 rounded-2xl border border-red-500/20 bg-red-500/10 px-4 py-3 text-sm text-red-100">
            <p>{error}</p>
            <button
              type="button"
              onClick={clearError}
              className="rounded-full border border-red-300/30 px-3 py-1 text-xs uppercase tracking-wide text-red-100 transition hover:bg-red-500/20"
            >
              Dismiss
            </button>
          </div>
        )}

        <ChatWindow
          messages={messages}
          activeOverlay={activeOverlay}
          onToggleOverlay={toggleOverlay}
          isStreaming={isStreaming}
        />

        <InputBar
          disabled={!hasSession || isStreaming}
          hasSession={hasSession}
          onSendText={sendTextMessage}
          onSendAudio={sendAudioMessage}
        />
      </main>
    </div>
  );
}

export default App;
