import type { BaseEntry } from '../../types/common';
import { formatDate } from '../../lib/date-utils';
import SourceLink from './SourceLink';
import ReactMarkdown from 'react-markdown';
import { useState } from 'react';

interface EntryCardProps {
  entry: BaseEntry;
  isNew?: boolean;
}

const MARKET_LABEL: Record<string, string> = {
  india: 'India',
  us: 'United States',
  both: 'Global',
};

export default function EntryCard({ entry, isNew }: EntryCardProps) {
  const [expanded, setExpanded] = useState(false);

  return (
    <div className="py-6 border-b border-[#d2d2d7]/50 dark:border-[#424245]/50 last:border-b-0">
      <div className="flex items-baseline gap-3 mb-2">
        <span className="text-sm text-[#86868b] font-mono">
          {formatDate(entry.timestamp)}
        </span>
        <span className="text-xs text-[#86868b] uppercase tracking-wider">
          {MARKET_LABEL[entry.market] || entry.market}
        </span>
        {isNew && (
          <span className="text-[10px] font-semibold text-[#0071e3]">NEW</span>
        )}
      </div>

      <button
        onClick={() => setExpanded(!expanded)}
        className="text-left bg-transparent border-none cursor-pointer p-0 w-full"
        style={{ fontFamily: 'inherit' }}
      >
        <p className="text-[17px] font-medium text-[#1d1d1f] dark:text-[#f5f5f7] leading-snug">
          {entry.summary || entry.title}
        </p>
      </button>

      {expanded && (
        <div className="mt-4">
          <div className="text-[15px] text-[#6e6e73] leading-relaxed max-w-3xl">
            <ReactMarkdown>{entry.content}</ReactMarkdown>
          </div>
          <div className="mt-4 flex items-center gap-4">
            <SourceLink url={entry.source_url} name={entry.source_name} />
            {entry.tags.length > 0 && (
              <div className="flex gap-2">
                {entry.tags.slice(0, 3).map((tag) => (
                  <span
                    key={tag}
                    className="text-[11px] text-[#86868b]"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
