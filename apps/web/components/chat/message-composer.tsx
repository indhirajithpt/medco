'use client';

import React from 'react';
import { ArrowUp, Square, Mic, AlertCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MessageComposerProps {
  onSendMessage: (content: string) => void;
  isLoading: boolean;
  onCancel?: () => void;
  placeholder?: string;
  initialValue?: string;
  className?: string;
}

interface SpeechRecognitionEvent {
  results: Array<Array<{ transcript: string }>>;
}

interface SpeechRecognitionErrorEvent {
  error: string;
}

interface SpeechRecognitionInstance {
  continuous: boolean;
  interimResults: boolean;
  lang: string;
  onstart: (() => void) | null;
  onresult: ((event: SpeechRecognitionEvent) => void) | null;
  onerror: ((event: SpeechRecognitionErrorEvent) => void) | null;
  onend: (() => void) | null;
  start: () => void;
  stop: () => void;
}

export function MessageComposer({
  onSendMessage,
  isLoading,
  onCancel,
  placeholder = 'Ask any healthcare or medical question...',
  initialValue = '',
  className,
}: MessageComposerProps) {
  const [input, setInput] = React.useState(initialValue);
  const [prevInitialValue, setPrevInitialValue] = React.useState(initialValue);
  const [isRecording, setIsRecording] = React.useState(false);
  const [speechError, setSpeechError] = React.useState<string | null>(null);
  const textareaRef = React.useRef<HTMLTextAreaElement>(null);

  // Sync initialValue when caller changes it (e.g. clicking quick action)
  if (initialValue !== prevInitialValue) {
    setPrevInitialValue(initialValue);
    setInput(initialValue);
  }

  // Auto-resize textarea
  React.useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 180)}px`;
    }
  }, [input]);

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (isLoading) return;
    const trimmed = input.trim();
    if (!trimmed) return;
    onSendMessage(trimmed);
    setInput('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  // Functional Web Speech API speech-to-text
  const toggleSpeechRecognition = () => {
    setSpeechError(null);
    const win = window as unknown as {
      SpeechRecognition?: new () => SpeechRecognitionInstance;
      webkitSpeechRecognition?: new () => SpeechRecognitionInstance;
    };
    const SpeechRecognition = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      setSpeechError('Speech recognition is not supported in this browser.');
      setTimeout(() => setSpeechError(null), 4000);
      return;
    }

    if (isRecording) {
      setIsRecording(false);
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = false;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsRecording(true);
      };

      recognition.onresult = (event: SpeechRecognitionEvent) => {
        const transcript = event.results[0]?.[0]?.transcript || '';
        setInput((prev) => (prev ? `${prev} ${transcript}` : transcript));
        setIsRecording(false);
      };

      recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
        setIsRecording(false);
        setSpeechError(event.error === 'not-allowed' ? 'Microphone permission denied.' : 'Speech input failed.');
        setTimeout(() => setSpeechError(null), 4000);
      };

      recognition.onend = () => {
        setIsRecording(false);
      };

      recognition.start();
    } catch {
      setIsRecording(false);
      setSpeechError('Could not start speech recognition.');
    }
  };

  const charCount = input.length;
  const isNearLimit = charCount > 3500;
  const isOverLimit = charCount > 4000;

  return (
    <div className={cn('relative w-full', className)}>
      {speechError && (
        <div className="absolute -top-9 left-2 flex items-center gap-1.5 px-3 py-1 rounded-lg bg-rose-500/20 border border-rose-500/30 text-rose-300 text-xs backdrop-blur-md">
          <AlertCircle className="w-3.5 h-3.5" />
          <span>{speechError}</span>
        </div>
      )}

      <form
        onSubmit={handleSubmit}
        className={cn(
          'relative rounded-2xl bg-[#0d0d12]/90 border border-white/10 focus-within:border-[#8b5cf6]/50 focus-within:ring-1 focus-within:ring-[#8b5cf6]/40 backdrop-blur-xl shadow-[0_8px_32px_rgba(0,0,0,0.6)] transition-all p-2 sm:p-2.5',
          isOverLimit && 'border-rose-500/60 focus-within:border-rose-500'
        )}
      >
        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          rows={1}
          maxLength={4000}
          disabled={isLoading}
          aria-label="Ask MedCo a health question"
          className="w-full resize-none bg-transparent px-3 py-2 text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none disabled:opacity-50 min-h-[44px] max-h-[180px]"
        />

        <div className="flex items-center justify-between px-2 pt-1 border-t border-white/5">
          <div className="flex items-center gap-2 text-xs text-zinc-500">
            {isNearLimit && (
              <span className={cn('font-mono text-[11px]', isOverLimit ? 'text-rose-400 font-semibold' : 'text-amber-400')}>
                {charCount}/4000
              </span>
            )}
            <span className="hidden sm:inline text-[11px] text-zinc-500">
              Press Enter to send, Shift + Enter for new line
            </span>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={toggleSpeechRecognition}
              title={isRecording ? 'Listening... click to stop' : 'Dictate question via voice'}
              aria-label={isRecording ? 'Listening' : 'Dictate question'}
              className={cn(
                'p-2 rounded-xl text-zinc-400 hover:text-zinc-200 hover:bg-white/5 transition-colors',
                isRecording && 'text-rose-400 bg-rose-500/20 animate-pulse'
              )}
            >
              <Mic className="w-4 h-4" />
            </button>

            {isLoading ? (
              <button
                type="button"
                onClick={onCancel}
                title="Cancel generation"
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-white/10 hover:bg-white/15 text-zinc-200 transition-colors"
              >
                <Square className="w-3.5 h-3.5 fill-current" />
              </button>
            ) : (
              <button
                type="submit"
                disabled={!input.trim() || isOverLimit}
                title="Send medical question"
                aria-label="Send question"
                className="flex items-center justify-center w-8 h-8 rounded-xl bg-gradient-to-tr from-[#8b5cf6] to-[#a78bfa] hover:brightness-110 disabled:opacity-30 disabled:pointer-events-none text-white shadow-[0_0_12px_rgba(139,92,246,0.5)] transition-all"
              >
                <ArrowUp className="w-4 h-4 stroke-[2.5]" />
              </button>
            )}
          </div>
        </div>
      </form>
    </div>
  );
}
