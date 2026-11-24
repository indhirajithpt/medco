'use client';

import React from 'react';
import { checkBackendHealth } from '@/lib/api';
import { BackendHealthStatus } from '@/types/api';
import { cn } from '@/lib/utils';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface ConnectionStatusProps {
  className?: string;
  showText?: boolean;
}

export function ConnectionStatus({ className, showText = true }: ConnectionStatusProps) {
  const [status, setStatus] = React.useState<BackendHealthStatus['status']>('healthy');
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    let isMounted = true;
    async function check() {
      try {
        const res = await checkBackendHealth();
        if (isMounted) {
          setStatus(res.status);
          setLoading(false);
        }
      } catch {
        if (isMounted) {
          setStatus('unhealthy');
          setLoading(false);
        }
      }
    }

    check();
    const interval = setInterval(check, 20000);
    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, []);

  const config = {
    healthy: {
      color: 'bg-emerald-500',
      glow: 'shadow-[0_0_8px_rgba(34,197,94,0.6)]',
      text: 'Backend Connected',
      icon: CheckCircle2,
      textColor: 'text-zinc-300',
    },
    degraded: {
      color: 'bg-amber-500',
      glow: 'shadow-[0_0_8px_rgba(245,158,11,0.6)]',
      text: 'Backend Degraded',
      icon: AlertTriangle,
      textColor: 'text-amber-300',
    },
    unhealthy: {
      color: 'bg-rose-500',
      glow: 'shadow-[0_0_8px_rgba(239,68,68,0.6)]',
      text: 'Backend Offline',
      icon: AlertTriangle,
      textColor: 'text-rose-300',
    },
  }[status];

  return (
    <div
      className={cn(
        'inline-flex items-center gap-2 px-2.5 py-1 rounded-full bg-[#111116]/80 border border-white/5 backdrop-blur-md text-xs',
        className
      )}
      title={`FastAPI Status: ${status}`}
      role="status"
      aria-live="polite"
    >
      <span
        className={cn(
          'w-2 h-2 rounded-full transition-colors',
          config.color,
          config.glow,
          loading && 'animate-pulse'
        )}
      />
      {showText && (
        <span className={cn('text-xs font-medium', config.textColor)}>
          {loading ? 'Checking backend...' : config.text}
        </span>
      )}
    </div>
  );
}
