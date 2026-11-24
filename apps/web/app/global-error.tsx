'use client';

import React from 'react';

export default function GlobalError({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html lang="en">
      <body className="bg-[#050505] text-white min-h-screen flex items-center justify-center p-6 font-sans">
        <div className="max-w-md w-full p-8 rounded-3xl bg-[#111116] border border-white/10 text-center space-y-4">
          <h2 className="text-xl font-bold text-white">Application Error</h2>
          <p className="text-sm text-zinc-400">
            A critical system error occurred. Please refresh or reset the application.
          </p>
          <button
            type="button"
            onClick={() => reset()}
            className="px-5 py-2.5 rounded-xl bg-[#8b5cf6] hover:bg-[#a78bfa] text-white font-medium text-xs transition-colors"
          >
            Reset Application
          </button>
        </div>
      </body>
    </html>
  );
}
