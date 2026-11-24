'use client';

import React from 'react';
import { MedicalSource } from '@/types/api';
import { sanitizeUrl, getDomain } from '@/lib/utils';
import { ExternalLink, ChevronDown, ChevronUp, FileText } from 'lucide-react';

interface SourceCardProps {
  source: MedicalSource;
  isExpandedDefault?: boolean;
}

export function SourceCard({ source, isExpandedDefault = false }: SourceCardProps) {
  const [expanded, setExpanded] = React.useState(isExpandedDefault);
  const safeUrl = sanitizeUrl(source.source);
  const domain = getDomain(source.source);

  return (
    <div
      id={`source-${source.reference}`}
      className="group relative rounded-xl bg-[#111116]/70 border border-white/8 hover:border-[#a78bfa]/30 backdrop-blur-md p-3.5 transition-all text-xs text-zinc-300"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-2.5 min-w-0">
          <span className="flex items-center justify-center w-5 h-5 rounded-md bg-[#8b5cf6]/20 border border-[#8b5cf6]/40 text-[#c4b5fd] font-mono font-medium text-[11px] shrink-0">
            {source.reference}
          </span>
          <div className="min-w-0">
            <h5 className="font-medium text-zinc-200 text-xs truncate max-w-sm sm:max-w-md">
              {source.question || `Medical Reference [${source.reference}]`}
            </h5>
            <div className="flex items-center gap-2 text-[11px] text-zinc-400 mt-0.5">
              <span className="truncate">{domain}</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {safeUrl && (
            <a
              href={safeUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open source ${source.reference} on ${domain}`}
              className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          )}
          <button
            type="button"
            onClick={() => setExpanded(!expanded)}
            aria-expanded={expanded}
            aria-label={expanded ? 'Collapse excerpt' : 'Expand excerpt'}
            className="p-1 rounded-md text-zinc-400 hover:text-white hover:bg-white/5 transition-colors"
          >
            {expanded ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
        </div>
      </div>

      {expanded && source.answer && (
        <div className="mt-2.5 pt-2.5 border-t border-white/5 text-zinc-400 text-[11px] leading-relaxed max-h-48 overflow-y-auto">
          <div className="flex items-center gap-1.5 text-zinc-500 mb-1 font-medium text-[10px] uppercase tracking-wider">
            <FileText className="w-3 h-3" />
            Retrieved Clinical Reference Content
          </div>
          <p className="whitespace-pre-wrap">{source.answer}</p>
        </div>
      )}
    </div>
  );
}
