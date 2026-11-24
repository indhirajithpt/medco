'use client';

import React from 'react';
import { Activity, ShieldPlus, Pill, FileText, LucideIcon } from 'lucide-react';
import { QUICK_ACTIONS } from '@/lib/constants';

interface QuickActionsProps {
  onSelectPrompt: (prompt: string) => void;
  disabled?: boolean;
}

const iconMap: Record<string, LucideIcon> = {
  Activity,
  ShieldPlus,
  Pill,
  FileText,
};

export function QuickActions({ onSelectPrompt, disabled }: QuickActionsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full">
      {QUICK_ACTIONS.map((item) => {
        const IconComponent = iconMap[item.icon] || Activity;
        return (
          <button
            key={item.id}
            type="button"
            disabled={disabled}
            onClick={() => onSelectPrompt(item.prompt)}
            className="group relative flex flex-col items-start p-4 rounded-2xl glass-panel-interactive text-left cursor-pointer disabled:opacity-50 disabled:pointer-events-none"
          >
            <div className="p-2.5 rounded-xl bg-gradient-to-br from-[#8b5cf6]/20 to-[#8b5cf6]/5 border border-[#8b5cf6]/30 text-[#c4b5fd] group-hover:scale-105 group-hover:border-[#a78bfa]/50 transition-all mb-3 shadow-[0_0_12px_rgba(139,92,246,0.15)]">
              <IconComponent className="w-5 h-5" />
            </div>

            <span className="font-semibold text-sm text-zinc-100 group-hover:text-white transition-colors">
              {item.title}
            </span>
            <span className="text-xs text-zinc-400 group-hover:text-zinc-300 transition-colors mt-0.5 line-clamp-1">
              {item.subtitle}
            </span>
          </button>
        );
      })}
    </div>
  );
}
