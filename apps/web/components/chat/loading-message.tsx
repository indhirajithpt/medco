import React from 'react';
import { PulseLogo } from '@/components/ui/pulse-logo';

interface LoadingMessageProps {
  statusText?: string;
  onCancel?: () => void;
}

export function LoadingMessage({
  statusText = 'MedCo is analyzing medical literature and synthesizing evidence...',
  onCancel,
}: LoadingMessageProps) {
  return (
    <div className="flex gap-3 sm:gap-4 w-full" role="status" aria-live="polite">
      <div className="shrink-0 mt-1">
        <PulseLogo size="sm" animated />
      </div>

      <div className="flex-1 space-y-2 max-w-xl">
        <div className="rounded-2xl rounded-tl-sm p-4 bg-[#0e0e14]/80 border border-white/8 backdrop-blur-xl space-y-3">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#8b5cf6] animate-ping" />
            <span className="text-xs font-medium text-zinc-300">{statusText}</span>
          </div>

          {/* Skeleton lines */}
          <div className="space-y-2 pt-1">
            <div className="h-3 bg-white/5 rounded-full w-4/5 animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-full animate-pulse" />
            <div className="h-3 bg-white/5 rounded-full w-3/5 animate-pulse" />
          </div>

          {onCancel && (
            <div className="pt-2">
              <button
                type="button"
                onClick={onCancel}
                className="text-xs text-zinc-400 hover:text-zinc-200 underline underline-offset-2 transition-colors"
              >
                Cancel request
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
