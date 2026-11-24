'use client';

import React from 'react';
import { PulseLogo } from '@/components/ui/pulse-logo';
import { QuickActions } from '@/components/landing/quick-actions';
import { MessageComposer } from '@/components/chat/message-composer';
import { ConnectionStatus } from '@/components/feedback/connection-status';
import { Sparkles, Database, Settings } from 'lucide-react';
import Link from 'next/link';

interface LandingHeroProps {
  onSendMessage: (msg: string) => void;
  isLoading: boolean;
}

export function LandingHero({ onSendMessage, isLoading }: LandingHeroProps) {
  const [selectedPrompt, setSelectedPrompt] = React.useState('');

  const handleSelectQuickAction = (prompt: string) => {
    setSelectedPrompt(prompt);
  };

  return (
    <div className="relative w-full max-w-4xl mx-auto flex flex-col items-center justify-center py-8 sm:py-16 px-4">
      {/* Brand Icon & Title */}
      <div className="flex flex-col items-center text-center space-y-4 mb-8">
        <div className="relative">
          <PulseLogo size="lg" />
        </div>

        <div className="space-y-1.5">
          <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight text-white flex items-center justify-center gap-2">
            MedCo
          </h1>
          <p className="text-xs sm:text-sm text-zinc-400 font-medium tracking-wide uppercase">
            Your AI Healthcare Assistant
          </p>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl font-medium text-zinc-100 pt-2 tracking-tight">
          What can I help you with today?
        </h2>
      </div>

      {/* Main Glassmorphism Assistant Container */}
      <div className="w-full glass-panel rounded-3xl p-4 sm:p-7 shadow-[0_20px_50px_rgba(0,0,0,0.7)] border border-white/10 space-y-6">
        {/* Panel Header */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-white/5">
          <div className="flex items-center gap-2.5">
            <PulseLogo size="sm" />
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-zinc-200">MedCo Core</span>
              <span className="text-[10px] text-zinc-400 flex items-center gap-1">
                <Database className="w-3 h-3 text-[#a78bfa]" />
                Supabase pgvector RAG (all-MiniLM-L6-v2)
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-[11px] text-[#c4b5fd]">
              <Sparkles className="w-3 h-3" />
              <span>Gemini 2.5 Flash-Lite</span>
            </div>
            <ConnectionStatus />
            <Link
              href="/settings"
              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
              title="Assistant Settings"
            >
              <Settings className="w-4 h-4" />
            </Link>
          </div>
        </div>

        {/* Message Input Box */}
        <MessageComposer
          onSendMessage={onSendMessage}
          isLoading={isLoading}
          initialValue={selectedPrompt}
          placeholder="Ask about medical symptoms, conditions, treatments, or prevention..."
        />

        {/* Quick Action Cards Grid */}
        <div className="space-y-2 pt-2">
          <div className="text-[11px] font-semibold text-zinc-400 uppercase tracking-wider px-1">
            Clinical Domains
          </div>
          <QuickActions onSelectPrompt={handleSelectQuickAction} disabled={isLoading} />
        </div>
      </div>
    </div>
  );
}
