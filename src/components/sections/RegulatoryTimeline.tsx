import { useState } from 'react';
import { useDataLoader } from '../../hooks/useDataLoader';
import type { RegulatoryData } from '../../types/regulatory';
import type { Market } from '../../types/common';
import TimelineView from '../common/TimelineView';
import EntryCard from '../common/EntryCard';

interface Props {
  matchesFilter: (m: Market) => boolean;
  isNewEntry: (ts: string) => boolean;
}

export default function RegulatoryTimeline({ matchesFilter, isNewEntry }: Props) {
  const { data, loading } = useDataLoader<RegulatoryData>('regulatory-timeline.json');
  const [typeFilter, setTypeFilter] = useState<string>('all');

  if (loading) return <div className="text-[#86868b] py-20 text-center">Loading...</div>;
  if (!data) return <div className="text-[#86868b] py-20 text-center">No data available.</div>;

  const filteredEvents = data.events.filter((e) => {
    if (!matchesFilter(e.market)) return false;
    if (typeFilter !== 'all' && e.type !== typeFilter) return false;
    return true;
  });

  const types = [...new Set(data.events.map((e) => e.type))];
  const highImpact = filteredEvents.filter((e) => e.impact === 'high').length;

  const timelineItems = filteredEvents.map((e) => ({
    id: e.id,
    date: e.date,
    title: e.title,
    summary: `${e.agency} — ${e.summary}`,
    market: e.market,
    source_url: e.source_url,
    impact: e.impact,
    isNew: isNewEntry(e.date),
  }));

  return (
    <div className="space-y-16">
      {/* Summary Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <p className="text-sm text-[#86868b]">Total Events</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{filteredEvents.length}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">High Impact</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{highImpact}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">India Events</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{data.events.filter((e) => e.market === 'india').length}</p>
        </div>
        <div>
          <p className="text-sm text-[#86868b]">US Events</p>
          <p className="text-4xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] tracking-tight">{data.events.filter((e) => e.market === 'us').length}</p>
        </div>
      </div>

      {/* Type Filter */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setTypeFilter('all')}
          className={`px-4 py-2 text-sm rounded-full border transition-colors ${
            typeFilter === 'all'
              ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
              : 'bg-transparent text-[#6e6e73] border-[#d2d2d7] hover:border-[#86868b]'
          }`}
          style={{ fontFamily: 'inherit' }}
        >
          All Types
        </button>
        {types.map((t) => (
          <button
            key={t}
            onClick={() => setTypeFilter(t)}
            className={`px-4 py-2 text-sm rounded-full border capitalize transition-colors ${
              typeFilter === t
                ? 'bg-[#1d1d1f] text-white border-[#1d1d1f]'
                : 'bg-transparent text-[#6e6e73] border-[#d2d2d7] hover:border-[#86868b]'
            }`}
            style={{ fontFamily: 'inherit' }}
          >
            {t.replace(/_/g, ' ')}
          </button>
        ))}
      </div>

      {/* Timeline */}
      <TimelineView items={timelineItems} />

      {/* News */}
      {data.entries.length > 0 && (
        <div>
          <h3 className="text-2xl font-semibold text-[#1d1d1f] dark:text-[#f5f5f7] mb-2">
            Analysis & Coverage
          </h3>
          {data.entries.map((e) => (
            <EntryCard key={e.id} entry={e} isNew={isNewEntry(e.timestamp)} />
          ))}
        </div>
      )}
    </div>
  );
}
