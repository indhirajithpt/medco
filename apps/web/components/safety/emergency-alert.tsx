import React from 'react';
import { EMERGENCY_WARNING } from '@/lib/constants';
import { PhoneCall, AlertOctagon } from 'lucide-react';
import { cn } from '@/lib/utils';

interface EmergencyAlertProps {
  className?: string;
  reason?: string;
}

export function EmergencyAlert({ className, reason }: EmergencyAlertProps) {
  return (
    <div
      role="alert"
      className={cn(
        'w-full rounded-2xl bg-rose-950/40 border border-rose-500/40 backdrop-blur-xl p-4 text-rose-100 shadow-[0_0_24px_-4px_rgba(244,63,94,0.3)] space-y-3',
        className
      )}
    >
      <div className="flex items-start gap-3">
        <div className="p-2 rounded-xl bg-rose-500/20 text-rose-400 shrink-0">
          <AlertOctagon className="w-6 h-6" />
        </div>
        <div className="space-y-1">
          <h4 className="font-semibold text-rose-200 text-sm sm:text-base">
            Medical Emergency Guidance
          </h4>
          <p className="text-xs sm:text-sm text-rose-200/90 leading-relaxed">
            {EMERGENCY_WARNING}
          </p>
          {reason && (
            <p className="text-xs text-rose-300/80 italic pt-1">
              Trigger notice: {reason}
            </p>
          )}
        </div>
      </div>
      <div className="flex items-center gap-3 pt-1 border-t border-rose-500/20">
        <a
          href="tel:911"
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white font-medium text-xs sm:text-sm transition-colors focus:ring-2 focus:ring-rose-400"
        >
          <PhoneCall className="w-4 h-4" />
          <span>Call 911 Immediately</span>
        </a>
        <span className="text-xs text-rose-300/70">
          Do not delay seeking in-person emergency care.
        </span>
      </div>
    </div>
  );
}
