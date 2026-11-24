import React from 'react';
import { cn } from '@/lib/utils';

interface PulseLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animated?: boolean;
  className?: string;
}

export function PulseLogo({ size = 'md', animated = false, className }: PulseLogoProps) {
  const sizeClasses = {
    sm: 'w-7 h-7 p-1.5',
    md: 'w-10 h-10 p-2',
    lg: 'w-16 h-16 p-3.5',
    xl: 'w-20 h-20 p-4',
  }[size];

  const strokeWidth = size === 'sm' ? 2.5 : 2;

  return (
    <div
      className={cn(
        'relative flex items-center justify-center rounded-2xl bg-gradient-to-br from-[#1c142c] via-[#120f1f] to-[#0a0a0e] border border-[#a78bfa]/30 shadow-[0_0_24px_-4px_rgba(139,92,246,0.35)]',
        sizeClasses,
        className
      )}
      aria-hidden="true"
    >
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        strokeLinejoin="round"
        className={cn(
          'w-full h-full text-[#c4b5fd] filter drop-shadow-[0_0_6px_rgba(167,139,250,0.6)]',
          animated && 'animate-pulse'
        )}
      >
        <path d="M22 12h-4l-3 9L9 3l-3 9H2" />
      </svg>
      {animated && (
        <span className="absolute inset-0 rounded-2xl ring-1 ring-[#c4b5fd]/40 animate-ping opacity-25" />
      )}
    </div>
  );
}
