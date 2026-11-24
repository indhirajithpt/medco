'use client';

import React from 'react';
import { ChatMessage } from '@/types/chat';
import { PulseLogo } from '@/components/ui/pulse-logo';
import { MarkdownRenderer } from './markdown-renderer';
import { SourceCard } from './source-card';
import { Copy, Check, RotateCw, BookOpen, AlertCircle } from 'lucide-react';

interface AssistantMessageProps {
  message: ChatMessage;
  onRetry?: () => void;
  isLatest?: boolean;
}

export function AssistantMessage({ message, onRetry, isLatest }: AssistantMessageProps) {
  const [copied, setCopied] = React.useState(false);
  const [showSources, setShowSources] = React.useState(true);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(message.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // ignore
    }
  };

  const hasSources = message.sources && message.sources.length > 0;

  return (
    <div className="flex gap-3 sm:gap-4 w-full">
      <div className="shrink-0 mt-1">
        <PulseLogo size="sm" />
      </div>

      <div className="flex-1 space-y-3 min-w-0">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="text-xs font-semibold text-zinc-200">MedCo</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-[#8b5cf6]/15 border border-[#8b5cf6]/30 text-[#c4b5fd]">
              Evidence RAG
            </span>
          </div>
          <span className="text-[10px] text-zinc-500">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>

        {message.error ? (
          <div className="rounded-xl bg-rose-500/10 border border-rose-500/30 p-3.5 text-rose-300 text-xs space-y-2">
            <div className="flex items-center gap-2 font-medium text-rose-200">
              <AlertCircle className="w-4 h-4 text-rose-400" />
              <span>Generation Error</span>
            </div>
            <p>{message.error}</p>
            {onRetry && (
              <button
                type="button"
                onClick={onRetry}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 text-xs transition-colors"
              >
                <RotateCw className="w-3.5 h-3.5" />
                <span>Retry Question</span>
              </button>
            )}
          </div>
        ) : (
          <div className="rounded-2xl rounded-tl-sm p-4 sm:p-5 bg-[#0e0e14]/80 border border-white/8 backdrop-blur-xl shadow-lg">
            <MarkdownRenderer content={message.content} />

            {/* Action Bar */}
            <div className="mt-4 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs text-zinc-400">
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopy}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors"
                  title="Copy medical answer"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'Copied' : 'Copy'}</span>
                </button>

                {onRetry && isLatest && (
                  <button
                    type="button"
                    onClick={onRetry}
                    className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg hover:bg-white/5 text-zinc-400 hover:text-zinc-200 transition-colors"
                    title="Regenerate medical answer"
                  >
                    <RotateCw className="w-3.5 h-3.5" />
                    <span>Regenerate</span>
                  </button>
                )}
              </div>

              {hasSources && (
                <button
                  type="button"
                  onClick={() => setShowSources(!showSources)}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-zinc-300 transition-colors text-xs"
                >
                  <BookOpen className="w-3.5 h-3.5 text-[#a78bfa]" />
                  <span>
                    {showSources ? 'Hide Sources' : 'View Sources'} ({message.sources!.length})
                  </span>
                </button>
              )}
            </div>

            {/* Evidence References Accordion */}
            {hasSources && showSources && (
              <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="text-[11px] font-semibold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                    <BookOpen className="w-3.5 h-3.5 text-[#8b5cf6]" />
                    Retrieved Clinical References ({message.sources!.length})
                  </div>
                  <span className="text-[10px] text-zinc-500">Supabase pgvector (MiniLM-L6-v2)</span>
                </div>
                <div className="grid grid-cols-1 gap-2">
                  {message.sources!.map((src) => (
                    <SourceCard key={src.reference} source={src} />
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
