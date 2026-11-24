'use client';

import React from 'react';
import { Conversation } from '@/types/chat';
import { MessageSquare, MessageSquarePlus, Trash2, Edit2, Search, X, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarProps {
  conversations: Conversation[];
  activeId?: string;
  onSelectConversation: (id: string) => void;
  onNewConversation: () => void;
  onDeleteConversation: (id: string) => void;
  onRenameConversation: (id: string, newTitle: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
  className?: string;
}

export function Sidebar({
  conversations,
  activeId,
  onSelectConversation,
  onNewConversation,
  onDeleteConversation,
  onRenameConversation,
  isCollapsed,
  className,
}: SidebarProps) {
  const [searchQuery, setSearchQuery] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editTitle, setEditTitle] = React.useState('');

  const filtered = conversations.filter((c) =>
    c.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const startRename = (c: Conversation, e: React.MouseEvent) => {
    e.stopPropagation();
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const saveRename = (id: string) => {
    if (editTitle.trim()) {
      onRenameConversation(id, editTitle.trim());
    }
    setEditingId(null);
  };

  return (
    <aside
      className={cn(
        'h-full flex flex-col bg-[#08080b]/90 border-r border-white/5 backdrop-blur-2xl transition-all duration-300 select-none z-30',
        isCollapsed ? 'w-16' : 'w-72 sm:w-80',
        className
      )}
    >
      {/* Top action: New Consultation */}
      <div className="p-3 border-b border-white/5">
        <button
          type="button"
          onClick={onNewConversation}
          className="w-full flex items-center justify-center gap-2 px-3.5 py-2.5 rounded-xl bg-gradient-to-r from-[#8b5cf6]/20 to-[#8b5cf6]/10 hover:from-[#8b5cf6]/30 hover:to-[#8b5cf6]/20 border border-[#8b5cf6]/30 text-white font-medium text-xs transition-all shadow-sm"
        >
          <MessageSquarePlus className="w-4 h-4 text-[#c4b5fd]" />
          {!isCollapsed && <span>New Consultation</span>}
        </button>
      </div>

      {/* Search Input when expanded */}
      {!isCollapsed && conversations.length > 0 && (
        <div className="px-3 pt-3">
          <div className="relative">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-zinc-500" />
            <input
              type="text"
              placeholder="Search conversations..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-[#111116] border border-white/5 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-200 placeholder:text-zinc-500 focus:outline-none focus:border-[#8b5cf6]/40"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-2.5 text-zinc-500 hover:text-zinc-300"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      )}

      {/* Conversation List */}
      <div className="flex-1 overflow-y-auto px-2 py-3 space-y-1">
        {filtered.length === 0 ? (
          <div className="px-4 py-8 text-center text-xs text-zinc-600">
            {!isCollapsed && (searchQuery ? 'No matching conversations' : 'No prior consultations in memory')}
          </div>
        ) : (
          filtered.map((c) => {
            const isActive = c.id === activeId;
            return (
              <div
                key={c.id}
                onClick={() => onSelectConversation(c.id)}
                className={cn(
                  'group relative flex items-center justify-between gap-2 px-3 py-2.5 rounded-xl cursor-pointer text-xs transition-all',
                  isActive
                    ? 'bg-white/10 text-white border border-[#8b5cf6]/40 shadow-[0_0_12px_rgba(139,92,246,0.15)]'
                    : 'text-zinc-400 hover:bg-white/5 hover:text-zinc-200'
                )}
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <MessageSquare className={cn('w-4 h-4 shrink-0', isActive ? 'text-[#c4b5fd]' : 'text-zinc-500')} />
                  {!isCollapsed && (
                    editingId === c.id ? (
                      <input
                        type="text"
                        value={editTitle}
                        autoFocus
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => setEditTitle(e.target.value)}
                        onBlur={() => saveRename(c.id)}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') saveRename(c.id);
                          if (e.key === 'Escape') setEditingId(null);
                        }}
                        className="bg-black/60 border border-[#8b5cf6] rounded px-1.5 py-0.5 text-xs text-white w-full focus:outline-none"
                      />
                    ) : (
                      <span className="truncate">{c.title}</span>
                    )
                  )}
                </div>

                {!isCollapsed && editingId !== c.id && (
                  <div className="hidden group-hover:flex items-center gap-1 shrink-0">
                    <button
                      type="button"
                      onClick={(e) => startRename(c, e)}
                      title="Rename"
                      className="p-1 hover:text-white rounded transition-colors"
                    >
                      <Edit2 className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteConversation(c.id);
                      }}
                      title="Delete"
                      className="p-1 hover:text-rose-400 rounded transition-colors"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

      {/* Memory Notice Banner */}
      {!isCollapsed && (
        <div className="p-3 border-t border-white/5 text-[11px] text-zinc-500 bg-[#0c0c10]">
          <div className="flex items-center gap-1.5 text-zinc-400 font-medium mb-1">
            <ShieldAlert className="w-3.5 h-3.5 text-[#8b5cf6]" />
            <span>In-Memory Privacy Mode</span>
          </div>
          <p className="leading-snug">
            Conversations exist solely in active session memory for health data privacy.
          </p>
        </div>
      )}
    </aside>
  );
}
