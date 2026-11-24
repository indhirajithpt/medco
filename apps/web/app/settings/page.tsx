'use client';

import React, { useState } from 'react';
import { Header } from '@/components/layout/header';
import { ConnectionStatus } from '@/components/feedback/connection-status';
import { useChat } from '@/providers/chat-provider';
import { Settings, Trash2, Shield, Eye, Database, Check } from 'lucide-react';
import { APP_VERSION, BACKEND_URL } from '@/lib/constants';

export default function SettingsPage() {
  const { clearAllConversations, conversations } = useChat();
  const [clearedNotice, setClearedNotice] = useState(false);
  const [motionReduced, setMotionReduced] = useState(false);

  const handleClear = () => {
    if (confirm('Clear all conversation history stored in memory?')) {
      clearAllConversations();
      setClearedNotice(true);
      setTimeout(() => setClearedNotice(false), 3000);
    }
  };

  return (
    <div className="min-h-dvh flex flex-col bg-[#050505] text-[#f5f5f7] relative">
      <div className="purple-glow-ambient absolute inset-0 pointer-events-none" />
      <Header />

      <main className="flex-1 max-w-3xl w-full mx-auto px-4 sm:px-6 py-10 space-y-8 relative z-10">
        <div className="flex items-center gap-3 border-b border-white/5 pb-4">
          <div className="p-2.5 rounded-xl bg-[#8b5cf6]/20 text-[#c4b5fd]">
            <Settings className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">System Settings</h1>
            <p className="text-xs text-zinc-400">Configure client behavior, privacy, and review backend status</p>
          </div>
        </div>

        {/* Backend & Model Info */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Database className="w-4 h-4 text-[#8b5cf6]" />
            Backend Integration
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-zinc-500">API Endpoint</span>
              <p className="font-mono text-zinc-300">{BACKEND_URL}</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-zinc-500">Connection State</span>
              <div className="pt-0.5"><ConnectionStatus /></div>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-zinc-500">AI Model</span>
              <p className="font-medium text-zinc-200">Google Gemini 2.5 Flash-Lite (Configured)</p>
            </div>
            <div className="p-3 rounded-xl bg-white/[0.03] border border-white/5 space-y-1">
              <span className="text-zinc-500">Embedding Pipeline</span>
              <p className="font-medium text-zinc-200">all-MiniLM-L6-v2 (384 dimensions)</p>
            </div>
          </div>
        </div>

        {/* Privacy & In-Memory Data */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#8b5cf6]" />
            Privacy & Conversation Storage
          </h2>
          <p className="text-xs text-zinc-400 leading-relaxed">
            MedCo does not persist healthcare conversations to your disk or remote database without user authorization. All questions and responses remain only in volatile memory during your active session.
          </p>

          <div className="flex items-center justify-between pt-2 border-t border-white/5">
            <div>
              <span className="text-xs font-medium text-zinc-200 block">Session History</span>
              <span className="text-[11px] text-zinc-500">
                {conversations.length} conversation{conversations.length === 1 ? '' : 's'} currently in memory
              </span>
            </div>
            <button
              type="button"
              onClick={handleClear}
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/25 border border-rose-500/30 text-rose-300 text-xs font-medium transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              <span>Clear Session Memory</span>
            </button>
          </div>
          {clearedNotice && (
            <p className="text-xs text-emerald-400 flex items-center gap-1.5">
              <Check className="w-3.5 h-3.5" /> Memory session cleared successfully.
            </p>
          )}
        </div>

        {/* Accessibility Preferences */}
        <div className="glass-panel rounded-2xl p-5 space-y-4">
          <h2 className="text-sm font-semibold text-zinc-200 uppercase tracking-wider flex items-center gap-2">
            <Eye className="w-4 h-4 text-[#8b5cf6]" />
            Display & Accessibility
          </h2>
          <div className="space-y-3 text-xs">
            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div>
                <span className="font-medium text-zinc-200 block">Color Palette</span>
                <span className="text-zinc-500">High-contrast Black Glassmorphism (#050505)</span>
              </div>
              <span className="px-2.5 py-1 rounded-md bg-[#8b5cf6]/20 text-[#c4b5fd] text-xs font-mono">
                Dark Glass Default
              </span>
            </div>

            <div className="flex items-center justify-between p-3 rounded-xl bg-white/[0.03]">
              <div>
                <span className="font-medium text-zinc-200 block">Reduced Motion Mode</span>
                <span className="text-zinc-500">Minimize ambient pulse animations</span>
              </div>
              <input
                type="checkbox"
                checked={motionReduced}
                onChange={(e) => setMotionReduced(e.target.checked)}
                className="w-4 h-4 accent-[#8b5cf6] rounded"
              />
            </div>
          </div>
        </div>

        {/* Version info */}
        <div className="text-center text-xs text-zinc-600">
          MedCo Version {APP_VERSION} • Prototype Build
        </div>
      </main>
    </div>
  );
}
