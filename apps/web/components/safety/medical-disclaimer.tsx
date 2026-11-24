import React from 'react';
import Link from 'next/link';
import { DISCLAIMER_SHORT, PROTOTYPE_NOTICE } from '@/lib/constants';
import { AlertCircle, ShieldAlert } from 'lucide-react';
import { cn } from '@/lib/utils';

interface MedicalDisclaimerProps {
  className?: string;
  variant?: 'minimal' | 'full' | 'banner';
}

export function MedicalDisclaimer({ className, variant = 'minimal' }: MedicalDisclaimerProps) {
  if (variant === 'banner') {
    return (
      <div className={cn('w-full py-2 px-4 bg-amber-500/10 border-b border-amber-500/20 text-amber-200/90 text-xs text-center flex items-center justify-center gap-2', className)}>
        <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />
        <span>{PROTOTYPE_NOTICE}</span>
      </div>
    );
  }

  if (variant === 'full') {
    return (
      <div className={cn('rounded-2xl p-4 bg-[#111116]/80 border border-white/10 backdrop-blur-md space-y-2 text-xs text-zinc-400', className)}>
        <div className="flex items-center gap-2 text-zinc-200 font-medium">
          <ShieldAlert className="w-4 h-4 text-[#a78bfa]" />
          <span>Medical Notice & Safety Policy</span>
        </div>
        <p>{DISCLAIMER_SHORT}</p>
        <p className="text-zinc-500">{PROTOTYPE_NOTICE}</p>
        <div className="pt-1">
          <Link href="/disclaimer" className="text-[#a78bfa] hover:text-[#c4b5fd] underline underline-offset-2">
            Read complete clinical limitations & safety guidelines
          </Link>
        </div>
      </div>
    );
  }

  return (
    <footer className={cn('text-center text-[11px] sm:text-xs text-zinc-500 max-w-xl mx-auto px-4 leading-relaxed', className)}>
      <p>{DISCLAIMER_SHORT}</p>
      <div className="mt-1 flex items-center justify-center gap-3 text-[10px] text-zinc-600">
        <span>Research Prototype</span>
        <span>•</span>
        <Link href="/disclaimer" className="hover:text-zinc-400 transition-colors">
          Disclaimer
        </Link>
        <span>•</span>
        <Link href="/privacy" className="hover:text-zinc-400 transition-colors">
          Privacy
        </Link>
      </div>
    </footer>
  );
}
