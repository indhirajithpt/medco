'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { PulseLogo } from '@/components/ui/pulse-logo';
import { ConnectionStatus } from '@/components/feedback/connection-status';
import { MessageSquarePlus, Settings, Info, Menu } from 'lucide-react';

interface HeaderProps {
  onToggleSidebar?: () => void;
  showSidebarToggle?: boolean;
}

export function Header({ onToggleSidebar, showSidebarToggle }: HeaderProps) {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 w-full border-b border-white/5 bg-[#050505]/75 backdrop-blur-xl px-4 sm:px-6 h-16 flex items-center justify-between">
      <div className="flex items-center gap-3">
        {showSidebarToggle && (
          <button
            type="button"
            onClick={onToggleSidebar}
            aria-label="Toggle navigation drawer"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 md:hidden transition-colors"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        <Link href="/" className="flex items-center gap-2.5 group">
          <PulseLogo size="sm" />
          <div className="flex flex-col">
            <span className="font-semibold text-sm sm:text-base text-zinc-100 group-hover:text-white transition-colors tracking-tight flex items-center gap-1.5">
              MedCo
              <span className="text-[10px] uppercase font-mono px-1.5 py-0.2 rounded bg-white/5 text-[#a78bfa] border border-white/10">
                AI RAG
              </span>
            </span>
          </div>
        </Link>
      </div>

      <div className="flex items-center gap-2 sm:gap-4">
        <ConnectionStatus className="hidden sm:inline-flex" />

        <nav className="flex items-center gap-1 sm:gap-2">
          <Link
            href="/"
            className="p-2 rounded-xl text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            title="Start New Consultation"
            aria-label="New chat"
          >
            <MessageSquarePlus className="w-4 h-4" />
          </Link>

          <Link
            href="/about"
            className={`p-2 rounded-xl transition-colors ${
              pathname === '/about' ? 'text-[#c4b5fd] bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="About MedCo & Architecture"
            aria-label="About"
          >
            <Info className="w-4 h-4" />
          </Link>

          <Link
            href="/settings"
            className={`p-2 rounded-xl transition-colors ${
              pathname === '/settings' ? 'text-[#c4b5fd] bg-white/10' : 'text-zinc-400 hover:text-white hover:bg-white/5'
            }`}
            title="System & Privacy Settings"
            aria-label="Settings"
          >
            <Settings className="w-4 h-4" />
          </Link>
        </nav>
      </div>
    </header>
  );
}
