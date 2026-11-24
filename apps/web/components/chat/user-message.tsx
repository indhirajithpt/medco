import React from 'react';
import { ChatMessage } from '@/types/chat';

interface UserMessageProps {
  message: ChatMessage;
}

export function UserMessage({ message }: UserMessageProps) {
  return (
    <div className="flex justify-end w-full">
      <div className="max-w-[85%] sm:max-w-[75%] rounded-2xl rounded-br-sm px-4 py-3 bg-[#17122b]/90 border border-[#8b5cf6]/30 shadow-[0_4px_20px_-2px_rgba(139,92,246,0.2)] text-zinc-100 text-sm leading-relaxed backdrop-blur-xl">
        <p className="whitespace-pre-wrap break-words">{message.content}</p>
        <div className="mt-1 flex justify-end">
          <span className="text-[10px] text-[#a78bfa]/60">
            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
          </span>
        </div>
      </div>
    </div>
  );
}
