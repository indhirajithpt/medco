'use client';

import React from 'react';
import Link from 'next/link';
import { RotateCw, Home, AlertTriangle } from 'lucide-react';

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  React.useEffect(() => {
    // Log unexpected errors internally without leaking confidential info
    console.error('App Route Error caught:', error.message);
  }, [error]);

  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050505] text-zinc-100 relative">
      <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />

      <div className="relative z-10 glass-panel rounded-3xl p-8 max-w-lg w-full text-center space-y-6 border border-rose-500/30">
        <div className="flex justify-center">
          <div className="p-3 rounded-2xl bg-rose-500/20 text-rose-400">
            <AlertTriangle className="w-10 h-10" />
          </div>
        </div>

        <div className="space-y-2">
          <h2 className="text-xl sm:text-2xl font-bold text-white">
            Something went wrong
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            MedCo encountered an unexpected issue while rendering this view.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-2">
          <button
            type="button"
            onClick={() => reset()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] text-white font-medium text-xs sm:text-sm hover:brightness-110 transition-all"
          >
            <RotateCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>

          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs sm:text-sm border border-white/10 transition-colors"
          >
            <Home className="w-4 h-4" />
            <span>Return Home</span>
          </Link>
        </div>
      </div>
    </div>
  );
}
