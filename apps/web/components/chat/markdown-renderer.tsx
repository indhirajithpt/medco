'use client';

import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

interface MarkdownRendererProps {
  content: string;
  onCitationClick?: (citationNumber: number) => void;
}

export function MarkdownRenderer({ content, onCitationClick }: MarkdownRendererProps) {
  // Replace citation bracket formats like [1] or [1, 2] with interactive citation buttons
  // Note: we let react-markdown process normal markdown, and handle citation tokens through custom components or inline renderer.
  return (
    <div className="prose prose-invert max-w-none text-sm text-zinc-200 leading-relaxed space-y-3">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          h1: ({ ...props }) => (
            <h1 className="text-lg font-semibold text-white tracking-tight mt-4 mb-2" {...props} />
          ),
          h2: ({ ...props }) => (
            <h2 className="text-base font-semibold text-white tracking-tight mt-3 mb-1.5" {...props} />
          ),
          h3: ({ ...props }) => (
            <h3 className="text-sm font-semibold text-purple-200 tracking-tight mt-2.5 mb-1" {...props} />
          ),
          p: ({ children }) => {
            return (
              <p className="text-zinc-200 text-sm leading-relaxed mb-2.5">
                {processCitations(children, onCitationClick)}
              </p>
            );
          },
          ul: ({ ...props }) => (
            <ul className="list-disc list-outside pl-4 space-y-1 text-zinc-300 text-sm mb-2" {...props} />
          ),
          ol: ({ ...props }) => (
            <ol className="list-decimal list-outside pl-4 space-y-1 text-zinc-300 text-sm mb-2" {...props} />
          ),
          li: ({ children }) => (
            <li className="leading-relaxed">
              {processCitations(children, onCitationClick)}
            </li>
          ),
          strong: ({ ...props }) => (
            <strong className="font-semibold text-white" {...props} />
          ),
          blockquote: ({ ...props }) => (
            <blockquote
              className="border-l-2 border-[#8b5cf6]/50 pl-3 italic text-zinc-400 bg-white/[0.02] py-1 my-2 rounded-r-md text-xs sm:text-sm"
              {...props}
            />
          ),
          table: ({ ...props }) => (
            <div className="overflow-x-auto my-3 rounded-lg border border-white/10">
              <table className="min-w-full divide-y divide-white/10 text-xs" {...props} />
            </div>
          ),
          th: ({ ...props }) => (
            <th className="px-3 py-2 text-left font-semibold text-zinc-200 bg-white/5" {...props} />
          ),
          td: ({ ...props }) => (
            <td className="px-3 py-2 text-zinc-300 border-t border-white/5" {...props} />
          ),
          code: ({ ...props }) => (
            <code className="px-1.5 py-0.5 rounded bg-white/10 text-[#c4b5fd] font-mono text-xs" {...props} />
          ),
          a: ({ href, children, ...props }) => {
            const isSafe = href?.startsWith('http://') || href?.startsWith('https://');
            return isSafe ? (
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#a78bfa] hover:text-[#c4b5fd] underline underline-offset-2"
                {...props}
              >
                {children}
              </a>
            ) : (
              <span className="text-[#a78bfa]">{children}</span>
            );
          },
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
}

function processCitations(children: React.ReactNode, onCitationClick?: (n: number) => void): React.ReactNode {
  if (typeof children !== 'string') {
    if (Array.isArray(children)) {
      return children.map((child, i) => (
        <React.Fragment key={i}>{processCitations(child, onCitationClick)}</React.Fragment>
      ));
    }
    return children;
  }

  // Regex to match citation patterns like [1], [2, 3]
  const regex = /\[(\d+(?:\s*,\s*\d+)*)\]/g;
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(children)) !== null) {
    if (match.index > lastIndex) {
      parts.push(children.substring(lastIndex, match.index));
    }

    const citationNums = match[1].split(',').map((s) => parseInt(s.trim(), 10)).filter((n) => !isNaN(n));
    parts.push(
      <span key={`citation-${match.index}`} className="inline-flex items-center gap-1 mx-0.5 align-baseline">
        {citationNums.map((num) => (
          <button
            key={num}
            type="button"
            onClick={() => {
              if (onCitationClick) {
                onCitationClick(num);
              } else {
                const el = document.getElementById(`source-${num}`);
                if (el) {
                  el.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                  el.classList.add('ring-2', 'ring-[#8b5cf6]');
                  setTimeout(() => el.classList.remove('ring-2', 'ring-[#8b5cf6]'), 2000);
                }
              }
            }}
            title={`View Medical Reference [${num}]`}
            className="inline-flex items-center justify-center px-1.5 py-0.2 rounded-md bg-[#8b5cf6]/20 hover:bg-[#8b5cf6]/35 text-[#c4b5fd] hover:text-white border border-[#8b5cf6]/40 text-[10px] font-mono font-semibold transition-colors"
          >
            [{num}]
          </button>
        ))}
      </span>
    );

    lastIndex = regex.lastIndex;
  }

  if (lastIndex < children.length) {
    parts.push(children.substring(lastIndex));
  }

  return parts;
}
