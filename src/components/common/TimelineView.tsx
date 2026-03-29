import { formatDate } from '../../lib/date-utils';
import SourceLink from './SourceLink';
import type { Market } from '../../types/common';

export interface TimelineItem {
  id: string;
  date: string;
  title: string;
  summary: string;
  market: Market;
  source_url: string;
  source_name?: string;
  impact?: 'high' | 'medium' | 'low';
  isNew?: boolean;
}

interface TimelineViewProps {
  items: TimelineItem[];
  className?: string;
}

const MARKET_LABEL: Record<Market, string> = {
  india: 'India',
  us: 'United States',
  both: 'Global',
};

export default function TimelineView({ items, className = '' }: TimelineViewProps) {
  const sorted = [...items].sort(
    (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
  );

  return (
    <div className={`${className}`}>
      <div className="space-y-0">
        {sorted.map((item, i) => (
          <div
            key={item.id}
            className={`py-8 ${i < sorted.length - 1 ? 'border-b border-[#d2d2d7]' : ''}`}
          >
            <div className="flex items-baseline gap-4 mb-2">
              <span className="text-sm text-[#86868b] font-mono min-w-[100px]">
                {formatDate(item.date)}
              </span>
              <span className="text-xs text-[#86868b] uppercase tracking-wider">
                {MARKET_LABEL[item.market]}
              </span>
              {item.isNew && (
                <span className="text-[10px] font-semibold text-[#0071e3]">
                  NEW
                </span>
              )}
            </div>
            <h4 className="text-xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
              {item.title}
            </h4>
            <p className="text-[15px] text-[#6e6e73] leading-relaxed max-w-3xl">
              {item.summary}
            </p>
            <div className="mt-3">
              <SourceLink
                url={item.source_url}
                name={item.source_name || 'Source'}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
