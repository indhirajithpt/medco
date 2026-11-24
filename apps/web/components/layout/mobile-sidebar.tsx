'use client';

import React from 'react';
import { Conversation } from '@/types/chat';
import { Sidebar } from './sidebar';
import { X } from 'lucide-react';

interface MobileSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  conversations: Conversation[];
  activeId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
}

export function MobileSidebar({
  isOpen,
  onClose,
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
}: MobileSidebarProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex" role="dialog" aria-modal="true">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Drawer */}
      <div className="relative flex-1 max-w-xs w-full h-full bg-[#08080b] flex flex-col z-10 shadow-2xl">
        <div className="p-3 border-b border-white/5 flex items-center justify-between">
          <span className="font-semibold text-sm text-zinc-200">Consultation History</span>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg text-zinc-400 hover:text-white"
            aria-label="Close sidebar"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-hidden">
          <Sidebar
            conversations={conversations}
            activeId={activeId}
            onSelectConversation={(id) => {
              onSelectConversation(id);
              onClose();
            }}
            onNewConversation={() => {
              onNewConversation();
              onClose();
            }}
            onDeleteConversation={onDeleteConversation}
            onRenameConversation={onRenameConversation}
            isCollapsed={false}
            className="w-full border-r-0"
          />
        </div>
      </div>
    </div>
  );
}
