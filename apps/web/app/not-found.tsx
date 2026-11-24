'use client';

import Link from 'next/link';
import { PulseLogo } from '@/components/ui/pulse-logo';
import { ArrowLeft, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-dvh flex flex-col items-center justify-center p-6 bg-[#050505] text-zinc-100 relative overflow-hidden">
      <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />

      <div className="relative z-10 glass-panel rounded-3xl p-8 sm:p-12 max-w-lg w-full text-center space-y-6 border border-white/10 shadow-2xl">
        <div className="flex justify-center">
          <PulseLogo size="lg" />
        </div>

        <div className="space-y-2">
          <h1 className="text-6xl sm:text-7xl font-bold font-mono tracking-tighter text-[#c4b5fd]/80">
            404
          </h1>
          <h2 className="text-xl sm:text-2xl font-semibold text-white">
            This page could not be found.
          </h2>
          <p className="text-sm text-zinc-400 leading-relaxed">
            The page you are looking for may have moved or no longer exists.
          </p>
        </div>

        <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            href="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6] to-[#a78bfa] hover:brightness-110 text-white font-medium text-xs sm:text-sm shadow-md transition-all"
          >
            <Home className="w-4 h-4" />
            <span>Return to MedCo</span>
          </Link>

          <button
            type="button"
            onClick={() => window.history.back()}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 text-zinc-300 font-medium text-xs sm:text-sm border border-white/10 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Go Back</span>
          </button>
        </div>
      </div>
    </div>
  );
}
